import type { ComponentProps } from "react";
import { cx, toneColor, vars, type Tone } from "../../utils";
import styles from "./StatusDot.module.scss";

export interface StatusDotProps extends ComponentProps<"span"> {
  tone?: Tone;
  /** Pulse, for something live or in progress. */
  pulse?: boolean;
}

/**
 * A coloured dot with an optional message beside it, such as a service's
 * health.
 */
export function StatusDot({
  tone = "success",
  pulse = false,
  className,
  style,
  children,
  ...props
}: StatusDotProps) {
  return (
    <span
      className={cx(styles.status, className)}
      style={vars({ "--gm-status-color": toneColor(tone) }, style)}
      {...props}
    >
      <span className={cx(styles.dot, pulse && styles.pulse)} aria-hidden />
      {children}
    </span>
  );
}
