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
  level = 3,
  className,
  children,
  ...props
}: CardProps) {
  const Heading = headingTag(level);

  return (
    <div className={cx(styles.card, href && styles.linked, className)} {...props}>
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
