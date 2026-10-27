import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./DetailList.module.scss";

export interface Detail {
  label: ReactNode;
  value: ReactNode;
}

export interface DetailListProps extends ComponentProps<"dl"> {
  /** Details whose value is empty, null or undefined are left out. */
  items: Detail[];
}

/**
 * Labelled facts about one thing, such as an application's image and
 * address: a description list, a label and its value to a row. PairList
 * suits two pieces of prose set against each other, and Table suits rows
 * to compare.
 */
export function DetailList({ items, className, ...props }: DetailListProps) {
  const shown = items.filter((item) => item.value !== undefined && item.value !== null && item.value !== "");

  return (
    <dl className={cx(styles.list, className)} {...props}>
      {shown.map((item, i) => (
        <div className={styles.row} key={i}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
