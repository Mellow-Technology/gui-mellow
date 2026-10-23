// Shared by Table and its client half, SortableTable

import { isValidElement, type ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Table.module.scss";

export interface TableColumn {
  label: ReactNode;
  /** Right-aligns the column with figures of even width, for amounts and counts. */
  numeric?: boolean;
  align?: "start" | "center" | "end";
  /** Lets readers sort the rows by this column. */
  sortable?: boolean;
}

/** A cell shown one way and sorted by another, such as a formatted date. */
export interface TableCell {
  value: string | number;
  display?: ReactNode;
}

export type SortDirection = "ascending" | "descending";

export interface TableSort {
  column: number;
  direction: SortDirection;
}

/** A cell as the components use it: a value to sort by, or something to show, or both. */
export interface NormalCell {
  value?: string | number;
  display?: ReactNode;
}

function isPlainObject(value: unknown): value is object {
  return typeof value === "object" && value !== null && !isValidElement(value) && !Array.isArray(value);
}

export function toColumn(column: ReactNode | TableColumn): TableColumn {
  return isPlainObject(column) && "label" in column ? (column as TableColumn) : { label: column as ReactNode };
}

export function toCell(cell: ReactNode | TableCell): NormalCell {
  return isPlainObject(cell) && "value" in cell ? (cell as TableCell) : { display: cell as ReactNode };
}

export function alignClass(column: TableColumn | undefined) {
  return cx(column?.numeric && styles.numeric, column?.align && styles[column.align]);
}
