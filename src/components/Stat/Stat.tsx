import type { ComponentProps, ReactNode } from "react";
import { cx, vars } from "../../utils";
import { SegmentedMeter, type MeterSegment, type SegmentedMeterProps } from "./SegmentedMeter";
import styles from "./Stat.module.scss";

export type { MeterSegment, SegmentedMeterProps };

export interface SingleMeterProps extends Omit<ComponentProps<"div">, "popover"> {
  value: number;
  max?: number;
  /** What's being measured, for assistive technology. */
  label?: string;
  /** The bar's thickness: a number of pixels, or any CSS length. */
  height?: number | string;
  segments?: undefined;
}

export type MeterProps =
  | SingleMeterProps
  | (SegmentedMeterProps & { value?: undefined; height?: number | string });

/**
 * A thin bar showing how much of something is used, or, given `segments`,
 * what a whole is made up of.
 */
export function Meter({ height, style, ...props }: MeterProps) {
  const sized =
    height === undefined
      ? style
      : vars({ "--gm-meter-height": typeof height === "number" ? `${height}px` : height }, style);

  if (props.segments) return <SegmentedMeter {...props} style={sized} />;

  const { value, max = 1, label, className, ...rest } = props;
  const fraction = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cx(styles.meter, className)}
      style={sized}
      {...rest}
    >
      <div className={styles.fill} style={{ width: `${fraction * 100}%` }} />
    </div>
  );
}

export interface StatProps extends Omit<ComponentProps<"div">, "popover"> {
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
  /** Show a meter of value against total. On by default when both are numbers, or with `segments`. */
  meter?: boolean;
  /** The meter's thickness: a number of pixels, or any CSS length. */
  meterHeight?: number | string;
  /** Splits the meter into these, as a share of a numeric `total` if there is one. */
  segments?: MeterSegment[];
  /** Shows a swatch, label and count for each segment, under the meter. */
  legend?: boolean;
  /** The popover on each segment; see Meter. */
  popover?: SegmentedMeterProps["popover"];
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
  meterHeight,
  segments,
  legend,
  popover,
  className,
  ...props
}: StatProps) {
  const hasTotal = total !== undefined;
  const showMeter =
    meter ?? (segments !== undefined || (hasTotal && typeof value === "number" && typeof total === "number"));
  const meterLabel = typeof label === "string" ? label : undefined;

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
      {showMeter &&
        (segments ? (
          <Meter
            className={styles.statMeter}
            segments={segments}
            max={typeof total === "number" ? total : undefined}
            label={meterLabel}
            height={meterHeight}
            legend={legend}
            popover={popover}
          />
        ) : (
          <Meter
            className={styles.statMeter}
            value={Number(value)}
            max={Number(total)}
            label={meterLabel}
            height={meterHeight}
          />
        ))}
    </div>
  );
}
