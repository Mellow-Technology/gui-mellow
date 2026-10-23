import type { ComponentProps, ReactNode } from "react";
import { cx, toneColor, vars, type Tone } from "../../utils";
import styles from "./Alert.module.scss";

export interface AlertProps extends Omit<ComponentProps<"div">, "title"> {
  tone?: Tone;
  title?: ReactNode;
  /** Shown before the text, such as an icon. */
  icon?: ReactNode;
  /** Buttons or links, after the text. */
  actions?: ReactNode;
}

/**
 * A notice set into the page: a saved form, a warning before a risky
 * action, an error. Static by default; for one that appears in response to
 * something, pass `role="status"`, or `role="alert"` when it's urgent, so
 * screen readers announce it.
 */
export function Alert({
  tone = "primary",
  title,
  icon,
  actions,
  className,
  style,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      className={cx(styles.alert, className)}
      style={vars({ "--gm-alert-color": toneColor(tone) }, style)}
      {...props}
    >
      {icon && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.body}>{children}</div>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
