import type { HTMLAttributes } from "react";
import { cx } from "../../utils";
import styles from "./Container.module.scss";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. */
  as?: "div" | "main" | "section" | "article" | "header" | "footer" | "nav";
  /** `narrow` suits running text; `wide` suits grids. */
  size?: "narrow" | "wide";
}

/**
 * Centres content in a column with a gutter either side.
 */
export function Container({
  as: Tag = "div",
  size = "wide",
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cx(styles.container, size === "narrow" && styles.narrow, className)}
      {...props}
    />
  );
}
