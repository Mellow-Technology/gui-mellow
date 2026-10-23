import type { ComponentProps, ReactNode } from "react";
import { cx, headingTag, type HeadingLevel } from "../../utils";
import { TagList } from "../Tag";
import styles from "./PairList.module.scss";

export interface Pair {
  title: ReactNode;
  body: ReactNode;
  tags?: ReactNode[];
}

export interface PairListProps extends ComponentProps<"div"> {
  items: Pair[];
  /** Column headings, such as ["The problem", "Our answer"]. */
  labels?: [ReactNode, ReactNode];
  level?: HeadingLevel;
}

/**
 * Rows setting one thing against another: problems and their answers,
 * questions and replies, before and after.
 */
export function PairList({ items, labels, level = 3, className, ...props }: PairListProps) {
  const Heading = headingTag(level);

  return (
    <div className={cx(styles.list, className)} {...props}>
      {labels && (
        <div className={cx(styles.row, styles.labels)} aria-hidden>
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
      {items.map((item, i) => (
        <div className={styles.row} key={i}>
          <Heading className={styles.title}>{item.title}</Heading>
          <div>
            <div className={styles.body}>{item.body}</div>
            {item.tags && <TagList className={styles.tags} tags={item.tags} />}
          </div>
        </div>
      ))}
    </div>
  );
}
