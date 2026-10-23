import type { ComponentProps } from "react";
import { cx, toneColor, vars, type Tone } from "../../utils";
import styles from "./Badge.module.scss";

export interface BadgeProps extends ComponentProps<"span"> {
  tone?: Tone;
  /** Show a status dot, in the badge's tone or one of its own. */
  dot?: boolean | Tone;
  /** Set in capitals. Turn off for text whose case matters, such as IDs. */
  uppercase?: boolean;
}

/**
 * A short, prominent status or announcement, such as "Now in beta".
 */
export function Badge({
  tone = "accent",
  dot = false,
  uppercase = true,
  className,
  style,
  children,
  ...props
}: BadgeProps) {
  const dotTone = dot === true ? tone : dot;

  return (
    <span
      className={cx(styles.badge, uppercase && styles.uppercase, className)}
      style={vars({ "--gm-badge-color": toneColor(tone) }, style)}
      {...props}
    >
      {dotTone && (
        <span className={styles.dot} style={{ background: toneColor(dotTone) }} aria-hidden />
      )}
      {children}
    </span>
  );
}
