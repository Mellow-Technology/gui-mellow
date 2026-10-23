import type { ComponentProps } from "react";
import { cx, vars } from "../../utils";
import styles from "./Chip.module.scss";

export interface ChipProps extends ComponentProps<"button"> {
  /** Whether the chip is switched on. */
  selected?: boolean;
  /**
   * A colour for the chip, such as a category's, shown as a swatch and used
   * to light the chip when selected.
   */
  color?: string;
}

/**
 * A compact toggle, for filters and the like.
 */
export function Chip({
  selected = false,
  color,
  className,
  style,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(styles.chip, className)}
      style={color ? vars({ "--gm-chip-color": color }, style) : style}
      {...props}
    >
      {color && <span className={styles.swatch} aria-hidden />}
      {children}
    </button>
  );
}
