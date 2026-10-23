import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import { alignClass, toCell, toColumn, type TableCell, type TableColumn, type TableSort } from "./columns";
import { SortableTable } from "./SortableTable";
import styles from "./Table.module.scss";

export type { SortDirection, TableCell, TableColumn, TableSort } from "./columns";

export interface TableProps extends ComponentProps<"table"> {
  /** Headings, or columns with options. */
  columns: Array<ReactNode | TableColumn>;
  rows: Array<Array<ReactNode | TableCell>>;
  /** Describes the table; visible above it. */
  caption?: ReactNode;
  /** The sort applied at first, when columns are sortable. */
  defaultSort?: TableSort;
}

/**
 * Rows of data under column headings, scrolling sideways on small screens
 * rather than squashing. Sortable columns make it a client component;
 * otherwise it renders on the server.
 */
export function Table({ columns, rows, caption, defaultSort, className, ...props }: TableProps) {
  const cols = columns.map(toColumn);

  if (cols.some((column) => column.sortable)) {
    return (
      <SortableTable
        columns={cols}
        rows={rows.map((row) => row.map(toCell))}
        caption={caption}
        defaultSort={defaultSort}
        className={className}
        {...props}
      />
    );
  }

  return (
    <div className={styles.scroller}>
      <table className={cx(styles.table, className)} {...props}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {cols.map((column, i) => (
              <th key={i} scope="col" className={alignClass(column)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => {
                const { value, display } = toCell(cell);
                return (
                  <td key={j} className={alignClass(cols[j])}>
                    {display ?? value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
