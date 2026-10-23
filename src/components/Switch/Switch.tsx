import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Switch.module.scss";

export interface SwitchProps extends Omit<ComponentProps<"input">, "type"> {
  label: ReactNode;
  /** Help shown under the label. */
  description?: ReactNode;
}

/**
 * An on/off setting. A styled checkbox, so it works in forms without
 * JavaScript; use `checked` and `onChange`, or `defaultChecked`.
 */
export function Switch({ label, description, className, ...input }: SwitchProps) {
  return (
    <label className={cx(styles.switch, className)}>
      <input type="checkbox" role="switch" className={styles.input} {...input} />
      <span className={styles.track} aria-hidden />
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </label>
  );
}
