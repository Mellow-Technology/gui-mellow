import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Tag.module.scss";

export function Tag({ className, ...props }: ComponentProps<"span">) {
  return <span className={cx(styles.tag, className)} {...props} />;
}

export interface TagListProps extends ComponentProps<"ul"> {
  tags: ReactNode[];
}

/**
 * A wrapping run of tags, such as a post's topics or a product's features.
 */
export function TagList({ tags, className, ...props }: TagListProps) {
  return (
    <ul className={cx(styles.list, className)} {...props}>
      {tags.map((tag, i) => (
        <li key={i} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
