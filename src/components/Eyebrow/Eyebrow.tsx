import type { ComponentProps } from "react";
import { cx } from "../../utils";
import styles from "./Eyebrow.module.scss";

export interface EyebrowProps extends ComponentProps<"p"> {
  /** `accent` draws the eye; `muted` sits back. */
  tone?: "muted" | "accent";
}

/**
 * The small monospaced label set above a heading.
 */
export function Eyebrow({ tone = "muted", className, ...props }: EyebrowProps) {
  return (
    <p className={cx(styles.eyebrow, tone === "accent" && styles.accent, className)} {...props} />
  );
}
