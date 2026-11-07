import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx, headingTag, type HeadingLevel } from "../../utils";
import styles from "./Card.module.scss";

export interface CardProps extends Omit<ComponentProps<"div">, "title"> {
  title?: ReactNode;
  /** An icon or small image above the title. */
  icon?: ReactNode;
  /** Makes the whole card a link to here. */
  href?: string;
  /** A soft light under the pointer. Render GlowTracker to have it follow. */
  glow?: boolean;
  /** Closing line, such as "Read more →". */
  footer?: ReactNode;
  level?: HeadingLevel;
}

/**
 * A bordered panel holding a short piece of content.
 */
export function Card({
  title,
  icon,
  href,
  footer,
  glow,
  level = 3,
  className,
  children,
  ...props
}: CardProps) {
  const Heading = headingTag(level);

  return (
    <div className={cx(styles.card, href && styles.linked, className)} data-glow={glow || undefined} {...props}>
      {icon && <div className={styles.icon}>{icon}</div>}
      {title && (
        <Heading className={styles.title}>
          {href ? (
            <Link href={href} className={styles.link}>
              {title}
            </Link>
          ) : (
            title
          )}
        </Heading>
      )}
      {children && <div className={styles.body}>{children}</div>}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
