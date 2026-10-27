import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Switch.module.scss";

export interface SwitchProps extends Omit<ComponentProps<"input">, "type"> {
  /** Always required: with `hideLabel` it still names the switch to screen readers. */
  label: ReactNode;
  /** Help shown under the label. */
  description?: ReactNode;
  /**
   * Hides the label and description visually, for when something nearby
   * already says what the switch is, such as a table's column heading.
   */
  hideLabel?: boolean;
}

/**
 * An on/off setting. A styled checkbox, so it works in forms without
 * JavaScript; use `checked` and `onChange`, or `defaultChecked`.
 */
export function Switch({ label, description, hideLabel = false, className, ...input }: SwitchProps) {
  return (
    <label className={cx(styles.switch, className)}>
      <input type="checkbox" role="switch" className={styles.input} {...input} />
      <span className={styles.track} aria-hidden />
      <span className={cx(styles.text, hideLabel && styles.hidden)}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </label>
  );
}
