"use client";

import { useEffect } from "react";

/**
 * Keeps the highlight of `[data-glow]` elements under the pointer, by setting
 * `--mx` and `--my` on them. Render once, in the root layout: it's one passive
 * listener for the whole page, and draws nothing.
 */
export function GlowTracker() {
  useEffect(() => {
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-glow]");
      if (!element) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = element.getBoundingClientRect();
        element.style.setProperty("--mx", `${event.clientX - box.left}px`);
        element.style.setProperty("--my", `${event.clientY - box.top}px`);
      });
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      document.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
