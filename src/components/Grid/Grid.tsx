import type { HTMLAttributes } from "react";
import { cx, space, vars, type Space } from "../../utils";
import styles from "./Grid.module.scss";

export interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "ul" | "ol" | "section";
  /**
   * The narrowest a column may get before the grid drops to fewer columns,
   * as a CSS length. On screens narrower than this there is one column.
   */
  min?: string;
  gap?: Space;
}

/**
 * A responsive grid that fits as many columns as there's room for, with no
 * breakpoints to manage.
 */
export function Grid({
  as: Tag = "div",
  min = "260px",
  gap = 6,
  className,
  style,
  ...props
}: GridProps) {
  return (
    <Tag
      className={cx(styles.grid, className)}
      style={vars({ "--gm-grid-min": min, "--gm-grid-gap": space(gap) }, style)}
      {...props}
    />
  );
}
