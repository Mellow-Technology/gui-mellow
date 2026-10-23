"use client";

import { useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { cx } from "../../utils";
import { alignClass, type NormalCell, type SortDirection, type TableColumn, type TableSort } from "./columns";
import styles from "./Table.module.scss";

interface SortableTableProps extends ComponentProps<"table"> {
  columns: TableColumn[];
  rows: NormalCell[][];
  caption?: ReactNode;
  defaultSort?: TableSort;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function sortKey(cell: NormalCell | undefined) {
  if (!cell) return "";
  if (cell.value !== undefined) return cell.value;
  // Plain text and numbers sort as themselves; anything richer needs a value
  return typeof cell.display === "string" || typeof cell.display === "number" ? cell.display : "";
}

function compare(a: string | number, b: string | number) {
  return typeof a === "number" && typeof b === "number" ? a - b : collator.compare(String(a), String(b));
}

/**
 * Table's client half, used when a column is sortable. Headings become
 * buttons; numeric columns sort descending first, others ascending.
 */
export function SortableTable({ columns, rows, caption, defaultSort, className, ...props }: SortableTableProps) {
  const [sort, setSort] = useState<TableSort | undefined>(defaultSort);

  // Rows keep their original index as a key, so React moves them rather
  // than rewriting them
  const sorted = useMemo(() => {
    const indexed = rows.map((cells, key) => ({ cells, key }));
    if (!sort) return indexed;
    const sign = sort.direction === "ascending" ? 1 : -1;
    const key = (row: (typeof indexed)[number]) => sortKey(row.cells[sort.column]);
    return indexed.sort((a, b) => sign * compare(key(a), key(b)));
  }, [rows, sort]);

  const sortBy = (column: number) => {
    const first: SortDirection = columns[column]?.numeric ? "descending" : "ascending";
    setSort((current) =>
      current?.column === column
        ? { column, direction: current.direction === "ascending" ? "descending" : "ascending" }
        : { column, direction: first },
    );
  };

  return (
    <div className={styles.scroller}>
      <table className={cx(styles.table, className)} {...props}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column, i) => {
              const direction = sort?.column === i ? sort.direction : undefined;
              return (
                <th key={i} scope="col" className={alignClass(column)} aria-sort={direction}>
                  {column.sortable ? (
                    <button type="button" className={styles.sort} onClick={() => sortBy(i)}>
                      {column.label}
                      <span className={styles.arrow} data-direction={direction} aria-hidden />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell, j) => (
                <td key={j} className={alignClass(columns[j])}>
                  {cell.display ?? cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
