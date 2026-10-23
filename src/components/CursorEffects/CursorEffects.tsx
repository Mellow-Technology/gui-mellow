"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  getCursorEffectsEnabled,
  subscribeToCursorEffects,
  THEME_CHANGE_EVENT,
} from "../../theme";
import type { CursorEffect, CursorEffectFactory, CursorTheme } from "./effects/types";
import styles from "./CursorEffects.module.scss";

export type CursorEffectName = "ripple" | "fireflies" | "comic" | "reticle" | "sparkle";

// Each effect is its own chunk, so a page loads only the one its theme uses
const effects: Record<CursorEffectName, () => Promise<{ default: CursorEffectFactory }>> = {
  ripple: () => import("./effects/ripple"),
  fireflies: () => import("./effects/fireflies"),
  comic: () => import("./effects/comic"),
  reticle: () => import("./effects/reticle"),
  sparkle: () => import("./effects/sparkle"),
};

function isEffectName(name: string): name is CursorEffectName {
  return name in effects;
}

function readTheme(root: HTMLElement): { name: string; theme: CursorTheme } {
  const style = getComputedStyle(root);
  const token = (name: string) => style.getPropertyValue(`--gm-${name}`).trim();
  const colors = token("particle-colors")
    .replace(/"/g, "")
    .split(",")
    .map((triple) => triple.trim())
    .filter((triple) => /^\d+ \d+ \d+$/.test(triple))
    .map((triple) => `rgb(${triple})`);

  return {
    name: token("cursor-effect"),
    theme: {
      scheme: style.colorScheme === "dark" ? "dark" : "light",
      colors: colors.length ? colors : [token("color-primary")],
      primary: token("color-primary"),
      accent: token("color-accent"),
      link: token("color-link"),
      heading: token("color-heading"),
      bg: token("color-bg"),
      displayFont: token("font-display") || "sans-serif",
      monoFont: token("font-mono") || "monospace",
    },
  };
}

export interface CursorEffectsProps {
  /** Use this effect rather than the theme's. "none" keeps only the cursors. */
  effect?: CursorEffectName | "none";
  /** Turn effects off, whatever the visitor's choice; for a setting of your own. */
  enabled?: boolean;
}

/**
 * The theme's custom cursors, and an effect drawn around the pointer:
 * ripples in the default theme, fireflies in solarpunk, comic bursts in
 * magazine, a targeting reticle in cyberpunk, sparkles in kawaii. Render it
 * once, in the root layout, to opt in.
 *
 * It stays off on touch screens and, apart from the cursors, for visitors
 * who prefer reduced motion. Visitors can switch it off with CursorToggle.
 * The canvas is drawn only while something is moving.
 */
export function CursorEffects({ effect, enabled = true }: CursorEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visitorEnabled = useSyncExternalStore(subscribeToCursorEffects, getCursorEffectsEnabled, () => false);
  const on = enabled && visitorEnabled;

  useEffect(() => {
    const root = document.documentElement;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!on || !canvas || !context || !matchMedia("(pointer: fine)").matches) return;

    // The custom cursors are still pictures, so they don't count as motion
    root.dataset.cursor = "";
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const dark = matchMedia("(prefers-color-scheme: dark)");

    let current: CursorEffect | undefined;
    let loading = 0;
    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      const seconds = Math.min((now - last) / 1000, 0.05);
      last = now;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const busy = current?.frame(context, seconds, now) ?? false;
      context.globalAlpha = 1;
      frame = busy ? requestAnimationFrame(tick) : 0;
    };

    const wake = () => {
      if (frame || !current) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      const ratio = devicePixelRatio || 1;
      canvas.width = innerWidth * ratio;
      canvas.height = innerHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      wake();
    };

    // Load the effect the theme asks for, again whenever the theme changes
    const load = async () => {
      const request = ++loading;
      const { name, theme } = readTheme(root);
      const wanted = effect ?? name;
      if (still.matches || !isEffectName(wanted)) {
        current = undefined;
        context.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      const { default: create } = await effects[wanted]();
      if (request !== loading) return;
      current = create(theme);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      current?.move?.(event.clientX, event.clientY, event.target);
      wake();
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      current?.down?.(event.clientX, event.clientY);
      wake();
    };
    const onLeave = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      current?.leave?.();
      wake();
    };
    // Anything the effect is tracking may have moved
    const onScroll = () => wake();
    const onThemeChange = () => void load();

    resize();
    void load();
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerout", onLeave);
    addEventListener("scroll", onScroll, { passive: true, capture: true });
    addEventListener("resize", resize);
    addEventListener(THEME_CHANGE_EVENT, onThemeChange);
    dark.addEventListener("change", onThemeChange);
    still.addEventListener("change", onThemeChange);

    return () => {
      delete root.dataset.cursor;
      cancelAnimationFrame(frame);
      loading++;
      context.clearRect(0, 0, canvas.width, canvas.height);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerout", onLeave);
      removeEventListener("scroll", onScroll, { capture: true });
      removeEventListener("resize", resize);
      removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
      dark.removeEventListener("change", onThemeChange);
      still.removeEventListener("change", onThemeChange);
    };
  }, [on, effect]);

  return on ? <canvas ref={canvasRef} className={styles.canvas} aria-hidden /> : null;
}
