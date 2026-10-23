import type { CSSProperties, HTMLAttributes } from "react";
import { cx, space, type Space } from "../../utils";
import styles from "./Stack.module.scss";

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "ul" | "ol" | "nav" | "section";
  /** `row` wraps onto new lines when it runs out of room. */
  direction?: "row" | "column";
  gap?: Space;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
}

/**
 * Lays children out in a line with even spacing: a column by default, or a
 * wrapping row of buttons, tags and the like.
 */
export function Stack({
  as: Tag = "div",
  direction = "column",
  gap = 4,
  align,
  justify,
  className,
  style,
  ...props
}: StackProps) {
  return (
    <Tag
      className={cx(styles.stack, direction === "row" && styles.row, className)}
      style={{ gap: space(gap), alignItems: align, justifyContent: justify, ...style }}
      {...props}
    />
  );
}
