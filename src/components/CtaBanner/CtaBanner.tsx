import type { ComponentProps, ReactNode } from "react";
import { cx, headingTag, type HeadingLevel } from "../../utils";
import styles from "./CtaBanner.module.scss";

export interface CtaBannerProps extends Omit<ComponentProps<"section">, "title"> {
  title: ReactNode;
  /** Buttons to act on. */
  actions: ReactNode;
  level?: HeadingLevel;
}

/**
 * A closing call to action: a heading, a line of copy, and what to do next.
 */
export function CtaBanner({
  title,
  actions,
  level = 2,
  className,
  children,
  ...props
}: CtaBannerProps) {
  const Heading = headingTag(level);

  return (
    <section className={cx(styles.banner, className)} {...props}>
      <div className={styles.copy}>
        <Heading className={styles.title}>{title}</Heading>
        {children && <div className={styles.body}>{children}</div>}
      </div>
      <div className={styles.actions}>{actions}</div>
    </section>
  );
}
