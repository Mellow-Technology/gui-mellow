import type { ComponentProps } from "react";
import { cx } from "../../utils";
import styles from "./Pattern.module.scss";

export type PatternName = "grid" | "dots" | "hex" | "leaves" | "halftone" | "circuit" | "petals";

export interface PatternProps extends ComponentProps<"div"> {
  /** A pattern by name, or `theme` for the theme's own (a grid by default). */
  pattern?: PatternName | "theme";
  /**
   * `radial` fades out from near the top centre, `bottom` fades out
   * downwards, `none` covers evenly.
   */
  fade?: "radial" | "bottom" | "none";
}

/**
 * A faint repeating texture filling its nearest positioned ancestor, behind
 * that ancestor's content. Coloured by --gm-pattern-color.
 */
export function Pattern({ pattern = "theme", fade = "radial", className, ...props }: PatternProps) {
  return (
    <div
      className={cx(
        styles.pattern,
        pattern !== "theme" && styles[pattern],
        fade !== "none" && styles[fade],
        className,
      )}
      aria-hidden
      {...props}
    />
  );
}
