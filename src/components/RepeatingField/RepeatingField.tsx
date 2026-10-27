"use client";

import { useEffect, useId, useRef, type ComponentProps, type ReactNode } from "react";
import { cx, vars } from "../../utils";
import { Button } from "../Button";
import { TextField } from "../Field";
import styles from "./RepeatingField.module.scss";

interface RepeatingOwnProps<Row> {
  /** The legend, naming the whole list. */
  label: ReactNode;
  rows: Row[];
  onChange: (rows: Row[]) => void;
  /** Help shown under the rows. */
  hint?: ReactNode;
  /** An error message for the list as a whole. */
  error?: ReactNode;
  /** The add button's text. */
  addLabel?: ReactNode;
  /** Shown in place of the rows when there are none. */
  empty?: ReactNode;
  /** Adds buttons to move rows up and down. */
  reorderable?: boolean;
  /** No add button once there are this many rows. */
  max?: number;
}

export interface RepeatingFieldProps<Row>
  extends RepeatingOwnProps<Row>,
    Omit<ComponentProps<"fieldset">, keyof RepeatingOwnProps<Row> | "children"> {
  /** Makes the row the add button appends. */
  newRow: () => Row;
  /**
   * Draws a row's controls, one per column. Give each a label, hidden if
   * the column headings say enough, and call `update` with the changed row.
   */
  renderRow: (row: Row, index: number, update: (row: Row) => void) => ReactNode;
  /** Headings over the columns; also sets how many columns `renderRow` fills. */
  columns?: ReactNode[];
  /** Names a row on its buttons for screen readers, as in "Remove app.example.org". */
  rowLabel?: (row: Row, index: number) => ReactNode;
}

/**
 * Rows of fields that can be added, removed and reordered, such as
 * hostnames or environment variables. Controlled: pass `rows` and
 * `onChange`. ListField and KeyValueField cover the common cases; use this
 * directly for rows of your own.
 */
export function RepeatingField<Row>({
  label,
  rows,
  onChange,
  newRow,
  renderRow,
  columns,
  rowLabel = (_, index) => `row ${index + 1}`,
  hint,
  error,
  addLabel = "Add",
  empty,
  reorderable = false,
  max,
  className,
  ...props
}: RepeatingFieldProps<Row>) {
  const messageId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  // Where focus goes once a change has rendered: a row's first control, or the add button
  const focusNext = useRef<number | "add" | null>(null);

  // Stable keys, so a row's inputs and focus move with it. Rebuilt when the
  // rows change from outside.
  const nextKey = useRef(0);
  const keys = useRef<number[]>([]);
  if (keys.current.length !== rows.length) {
    keys.current = rows.map(() => nextKey.current++);
  }

  useEffect(() => {
    const target = focusNext.current;
    focusNext.current = null;
    if (target === "add") {
      addRef.current?.focus();
    } else if (target !== null) {
      const row = listRef.current?.querySelectorAll<HTMLElement>(`.${styles.row}`)[target];
      row?.querySelector<HTMLElement>("input, select, textarea, button")?.focus();
    }
  }, [rows]);

  const change = (next: Row[], nextKeys: number[], focus: number | "add" | null = null) => {
    keys.current = nextKeys;
    focusNext.current = focus;
    onChange(next);
  };

  const add = () =>
    change([...rows, newRow()], [...keys.current, nextKey.current++], rows.length);

  const remove = (index: number) => {
    const left = rows.length - 1;
    change(
      rows.filter((_, at) => at !== index),
      keys.current.filter((_, at) => at !== index),
      left === 0 ? "add" : Math.min(index, left - 1),
    );
  };

  const move = (index: number, by: -1 | 1) => {
    const to = index + by;
    if (to < 0 || to >= rows.length) return;
    const swap = <T,>(list: T[]) => {
      const next = [...list];
      [next[index], next[to]] = [next[to]!, next[index]!];
      return next;
    };
    change(swap(rows), swap(keys.current));
  };

  const canAdd = max === undefined || rows.length < max;
  const style = vars({ "--gm-repeating-columns": columns?.length ?? 1 }, props.style);

  return (
    <fieldset
      {...props}
      className={cx(styles.field, className)}
      style={style}
      aria-describedby={error || hint ? messageId : undefined}
    >
      <legend className={styles.legend}>{label}</legend>
      {rows.length > 0 ? (
        <div className={styles.rows} ref={listRef}>
          {columns && (
            <div className={cx(styles.row, styles.columns)} aria-hidden>
              {columns.map((column, i) => (
                <span key={i}>{column}</span>
              ))}
            </div>
          )}
          {rows.map((row, index) => {
            const name = rowLabel(row, index);
            return (
              <div className={styles.row} key={keys.current[index]}>
                {renderRow(row, index, (updated) =>
                  onChange(rows.map((old, at) => (at === index ? updated : old))),
                )}
                <div className={styles.controls}>
                  {reorderable && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={styles.icon}
                        // aria-disabled rather than disabled, so focus stays on it at the ends
                        aria-disabled={index === 0 || undefined}
                        onClick={() => move(index, -1)}
                      >
                        <span aria-hidden>↑</span>
                        <span className={styles.hidden}>Move {name} up</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={styles.icon}
                        aria-disabled={index === rows.length - 1 || undefined}
                        onClick={() => move(index, 1)}
                      >
                        <span aria-hidden>↓</span>
                        <span className={styles.hidden}>Move {name} down</span>
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => remove(index)}>
                    Remove<span className={styles.hidden}> {name}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        empty && <p className={styles.empty}>{empty}</p>
      )}
      {(error || hint) && (
        <p id={messageId} className={cx(styles.message, error ? styles.error : undefined)}>
          {error || hint}
        </p>
      )}
      {canAdd && (
        <div>
          <Button ref={addRef} variant="secondary" size="sm" onClick={add}>
            {addLabel}
          </Button>
        </div>
      )}
    </fieldset>
  );
}

type ListOwnProps = Omit<RepeatingOwnProps<string>, "rows"> & {
  values: string[];
  /** Each input's name, so the list submits with a form; read it with `formData.getAll(name)`. */
  name?: string;
  placeholder?: string;
  type?: ComponentProps<"input">["type"];
};

export type ListFieldProps = ListOwnProps & Omit<ComponentProps<"fieldset">, keyof ListOwnProps | "children">;

/**
 * A list of single values, one text box to a row, such as hostnames.
 */
export function ListField({ label, values, name, placeholder, type, ...props }: ListFieldProps) {
  return (
    <RepeatingField
      {...props}
      label={label}
      rows={values}
      newRow={() => ""}
      rowLabel={(value, index) =>
        value || (
          <>
            {label} {index + 1}
          </>
        )
      }
      renderRow={(value, index, update) => (
        <TextField
          label={
            <>
              {label} {index + 1}
            </>
          }
          hideLabel
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => update(event.target.value)}
        />
      )}
    />
  );
}

export interface KeyValue {
  key: string;
  value: string;
}

type KeyValueOwnProps = RepeatingOwnProps<KeyValue> & {
  /** The first column's heading. */
  keyLabel?: string;
  /** The second column's heading. */
  valueLabel?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
};

export type KeyValueFieldProps = KeyValueOwnProps &
  Omit<ComponentProps<"fieldset">, keyof KeyValueOwnProps | "children">;

/**
 * Pairs of a key and a value, such as environment variables or labels.
 */
export function KeyValueField({
  keyLabel = "Key",
  valueLabel = "Value",
  keyPlaceholder,
  valuePlaceholder,
  ...props
}: KeyValueFieldProps) {
  return (
    <RepeatingField
      {...props}
      columns={[keyLabel, valueLabel]}
      newRow={() => ({ key: "", value: "" })}
      rowLabel={(row, index) => row.key || `row ${index + 1}`}
      renderRow={(row, index, update) => (
        <>
          <TextField
            label={`${keyLabel} ${index + 1}`}
            hideLabel
            placeholder={keyPlaceholder}
            value={row.key}
            onChange={(event) => update({ ...row, key: event.target.value })}
          />
          <TextField
            label={`${valueLabel} ${index + 1}`}
            hideLabel
            placeholder={valuePlaceholder}
            value={row.value}
            onChange={(event) => update({ ...row, value: event.target.value })}
          />
        </>
      )}
    />
  );
}
