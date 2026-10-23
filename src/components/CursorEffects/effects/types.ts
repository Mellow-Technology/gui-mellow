/** What an effect knows of the theme, read from the tokens on <html>. */
export interface CursorTheme {
  scheme: "light" | "dark";
  /** From --gm-particle-colors, as rgb() strings. */
  colors: string[];
  primary: string;
  accent: string;
  link: string;
  heading: string;
  bg: string;
  displayFont: string;
  monoFont: string;
}

/**
 * One effect. The runner calls `frame` on every animation frame after
 * clearing the canvas, and stops when it returns false, so an effect at rest
 * costs nothing.
 */
export interface CursorEffect {
  move?(x: number, y: number, target: EventTarget | null): void;
  down?(x: number, y: number): void;
  leave?(): void;
  frame(context: CanvasRenderingContext2D, seconds: number, now: number): boolean;
}

export type CursorEffectFactory = (theme: CursorTheme) => CursorEffect;

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function between(low: number, high: number) {
  return low + Math.random() * (high - low);
}

/** Eases towards a target, at the same rate whatever the frame rate. */
export function approach(from: number, to: number, rate: number, seconds: number) {
  return from + (to - from) * (1 - Math.exp(-rate * seconds));
}

/** Drops spent particles, in place. */
export function prune<T extends { age: number; life: number }>(particles: T[]) {
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i]!.age >= particles[i]!.life) particles.splice(i, 1);
  }
}
