import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Stat.module.scss";

export interface MeterProps extends ComponentProps<"div"> {
  value: number;
  max?: number;
  /** What's being measured, for assistive technology. */
  label?: string;
}

/**
 * A thin bar showing how much of something is used.
 */
export function Meter({ value, max = 1, label, className, ...props }: MeterProps) {
  const fraction = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cx(styles.meter, className)}
      {...props}
    >
      <div className={styles.fill} style={{ width: `${fraction * 100}%` }} />
    </div>
  );
}

export interface StatProps extends ComponentProps<"div"> {
  label: ReactNode;
  value: number | string;
  unit?: ReactNode;
  /** Shows the value as a part of this total. */
  total?: number | string;
  totalUnit?: ReactNode;
  /** Word between value and total. */
  separator?: ReactNode;
  /** Decimal places for numeric values. */
  precision?: number;
  /** Show a meter of value against total. On by default when both are numbers. */
  meter?: boolean;
}

function format(value: number | string, precision: number) {
  return typeof value === "number" ? value.toFixed(precision) : value;
}

/**
 * A figure with its label, optionally against a total: disk used, people
 * signed up, uptime.
 */
export function Stat({
  label,
  value,
  unit,
  total,
  totalUnit = unit,
  separator = "of",
  precision = 0,
  meter,
  className,
  ...props
}: StatProps) {
  const hasTotal = total !== undefined;
  const showMeter =
    meter ?? (hasTotal && typeof value === "number" && typeof total === "number");

  return (
    <div className={cx(styles.stat, className)} {...props}>
      <div className={styles.label}>{label}</div>
      <div className={styles.figures}>
        <div className={styles.figure}>
          <span className={styles.value}>{format(value, precision)}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
        {hasTotal && (
          <>
            <span className={styles.separator}>{separator}</span>
            <div className={cx(styles.figure, styles.total)}>
              <span className={styles.value}>{format(total, precision)}</span>
              {totalUnit && <span className={styles.unit}>{totalUnit}</span>}
            </div>
          </>
        )}
      </div>
      {showMeter && (
        <Meter
          className={styles.statMeter}
          value={Number(value)}
          max={Number(total)}
          label={typeof label === "string" ? label : undefined}
        />
      )}
    </div>
  );
}
