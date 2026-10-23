import type { CSSProperties } from "react";

/**
 * Join class names, skipping falsy ones.
 */
export function cx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(" ");
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export function headingTag(level: HeadingLevel) {
  return `h${level}` as const;
}

/** A step on the spacing scale, `--gm-space-1` to `--gm-space-9`. */
export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export function space(step: Space) {
  return step === 0 ? "0" : `var(--gm-space-${step})`;
}

export type Tone =
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export function toneColor(tone: Tone) {
  return tone === "neutral"
    ? "var(--gm-color-text-muted)"
    : `var(--gm-color-${tone})`;
}

/**
 * Inline style setting custom properties, which CSSProperties doesn't allow
 * for by name.
 */
export function vars(
  properties: Record<`--${string}`, string | number | undefined>,
  style?: CSSProperties,
) {
  return { ...properties, ...style } as CSSProperties;
}
