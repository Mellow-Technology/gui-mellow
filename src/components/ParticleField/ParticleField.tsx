"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { THEME_CHANGE_EVENT } from "../../theme";
import { cx } from "../../utils";
import styles from "./ParticleField.module.scss";

type Rgb = readonly [number, number, number];

const RAINBOW: Rgb[] = [
  [255, 0, 0],
  [255, 154, 0],
  [208, 222, 33],
  [77, 220, 74],
  [63, 218, 216],
  [47, 201, 226],
  [28, 127, 238],
  [95, 21, 242],
  [186, 12, 248],
  [251, 7, 217],
];

/**
 * Read "r g b, r g b, …" from the --gm-particle-colors token.
 */
function tokenColors(element: Element): Rgb[] {
  const value = getComputedStyle(element).getPropertyValue("--gm-particle-colors");
  const colors = value
    .replace(/"/g, "")
    .split(",")
    .map((triple) => triple.trim().split(/\s+/).map(Number))
    .filter((rgb): rgb is [number, number, number] => rgb.length === 3 && rgb.every(Number.isFinite));
  return colors.length ? colors : RAINBOW;
}

const LINK_DISTANCE = 200;
const SPEED = 0.4;
const FRICTION = 0.997;
const FADE_FRAMES = 80;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: Rgb;
  baseAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  life: number;
  maxLife: number;
}

function pick<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]!;
}

function spawn(width: number, height: number, colors: readonly Rgb[]): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED,
    radius: 1.5 + Math.random() * 3,
    color: pick(colors),
    baseAlpha: 0.2 + Math.random() * 0.3,
    pulseSpeed: 0.003 + Math.random() * 0.004,
    pulseOffset: Math.random() * Math.PI * 2,
    life: 0,
    maxLife: 500 + Math.random() * 500,
  };
}

export interface ParticleFieldProps extends ComponentProps<"canvas"> {
  /** Particles per square pixel. */
  density?: number;
  /**
   * Particle colours, as RGB triples. By default they come from the
   * --gm-particle-colors token, following the theme and palette.
   */
  colors?: readonly Rgb[];
  /** Fill the whole viewport behind the page, rather than the parent element. */
  fixed?: boolean;
}

/**
 * Drifting, linked particles drawn on a canvas, as a background. Draws a
 * single still frame for visitors who prefer reduced motion, and only
 * animates while visible.
 */
export function ParticleField({
  density = 0.00012,
  colors,
  fixed = true,
  className,
  ...props
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let palette = colors ?? tokenColors(canvas);
    let lineColor = pick(palette);
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const targetCount = () => Math.max(30, Math.min(200, Math.floor(width * height * density)));

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: targetCount() }, () => spawn(width, height, palette));
      // Spread out births so they don't all fade together
      for (const p of particles) p.life = Math.random() * p.maxLife;
    };

    const step = (p: Particle) => {
      p.life++;
      p.vx = (p.vx + (Math.random() - 0.5) * 0.025) * FRICTION;
      p.vy = (p.vy + (Math.random() - 0.5) * 0.025) * FRICTION;
      const speed = Math.hypot(p.vx, p.vy);
      const maxSpeed = SPEED * 2.5;
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
      p.x += p.vx;
      p.y += p.vy;

      const pad = 30;
      if (p.x < -pad) p.x = width + pad;
      if (p.x > width + pad) p.x = -pad;
      if (p.y < -pad) p.y = height + pad;
      if (p.y > height + pad) p.y = -pad;
    };

    const alphaOf = (p: Particle) => {
      let alpha = p.baseAlpha + Math.sin(performance.now() * p.pulseSpeed + p.pulseOffset) * 0.08;
      if (p.life < FADE_FRAMES) alpha *= p.life / FADE_FRAMES;
      else if (p.life > p.maxLife - FADE_FRAMES) alpha *= (p.maxLife - p.life) / FADE_FRAMES;
      return Math.max(alpha, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const [lr, lg, lb] = lineColor;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]!;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]!;
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${(1 - distance / LINK_DISTANCE) * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const [r, g, b] = p.color;
        const alpha = alphaOf(p);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        if (p.radius > 2) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.12})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const animate = () => {
      for (const p of particles) step(p);
      particles = particles.filter((p) => p.life < p.maxLife);
      while (particles.length < targetCount()) particles.push(spawn(width, height, palette));
      draw();
      frame = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!frame && !reducedMotion) frame = requestAnimationFrame(animate);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    draw();

    // Follow the theme and palette, unless given colours of our own
    const recolor = () => {
      if (colors) return;
      palette = tokenColors(canvas);
      lineColor = pick(palette);
      for (const p of particles) p.color = pick(palette);
      draw();
    };
    window.addEventListener(THEME_CHANGE_EVENT, recolor);
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", recolor);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas);

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start();
      else stop();
    });
    visibility.observe(canvas);

    return () => {
      stop();
      window.removeEventListener(THEME_CHANGE_EVENT, recolor);
      scheme.removeEventListener("change", recolor);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, [density, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={cx(styles.canvas, fixed ? styles.fixed : styles.contained, className)}
      aria-hidden
      {...props}
    />
  );
}
