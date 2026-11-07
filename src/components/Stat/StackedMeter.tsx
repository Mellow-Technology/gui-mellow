"use client";

import { useState, type ComponentProps, type KeyboardEvent } from "react";
import { cx, vars } from "../../utils";
import { Popover } from "../Popover";
import styles from "./StackedMeter.module.scss";

export interface MeterSegment {
  label: string;
  value: number;
  /** Any CSS colour; `toneColor()` gives a theme's. Keep the status tones for status. */
  color: string;
}

export interface StackedMeterProps extends ComponentProps<"div"> {
  segments: MeterSegment[];
  /** What's being measured, for assistive technology. */
  label: string;
  /** What the segments are shares of; by default their sum. A larger total leaves the rest of the bar empty. */
  total?: number;
  /** Adds the total to each segment's popover. */
  showTotal?: boolean;
  /** Lists the segments under the bar, so they don't rest on colour alone. */
  legend?: boolean;
}

/**
 * A thin bar split into segments, each opening a popover with its label,
 * count and share on hover, focus or a tap. The bar is one Tab stop, and the
 * arrow keys step through the segments.
 */
export function StackedMeter({
  segments,
  label,
  total,
  showTotal = false,
  legend = true,
  className,
  ...props
}: StackedMeterProps) {
  const shown = segments.filter((segment) => segment.value > 0);
  const sum = shown.reduce((all, segment) => all + segment.value, 0);
  const whole = Math.max(total ?? sum, sum);
  const [current, setCurrent] = useState(0);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = shown.length - 1;
    const next = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    event.currentTarget.querySelectorAll("button")[next]?.focus();
  };

  return (
    <div className={cx(styles.stacked, className)} {...props}>
      <div role="group" aria-label={label} className={styles.bar} onKeyDown={onKeyDown}>
        {shown.map((segment, index) => (
          <Popover
            key={segment.label}
            tint={segment.color}
            content={
              <span className={styles.detail}>
                <span className={styles.swatch} style={vars({ "--segment": segment.color })} />
                <span>
                  <span className={styles.name}>{segment.label}</span> · {segment.value} ·{" "}
                  {Math.round((segment.value / whole) * 100)}%{showTotal && ` of ${whole}`}
                </span>
              </span>
            }
          >
            <button
              type="button"
              className={styles.segment}
              style={vars({ "--segment": segment.color }, { flexGrow: segment.value })}
              tabIndex={index === current ? 0 : -1}
              aria-label={segment.label}
              onFocus={() => setCurrent(index)}
            />
          </Popover>
        ))}
        {whole > sum && <span className={styles.rest} style={{ flexGrow: whole - sum }} />}
      </div>
      {legend && (
        <ul className={styles.legend}>
          {shown.map((segment) => (
            <li key={segment.label} className={styles.key}>
              <span className={styles.swatch} style={vars({ "--segment": segment.color })} />
              {segment.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
