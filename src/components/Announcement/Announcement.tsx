import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Announcement.module.scss";

export interface AnnouncementProps extends ComponentProps<"div"> {
  /** A short label ahead of the message, such as "New". */
  label?: ReactNode;
  /** Makes the message a link to here. */
  href?: string;
}

/**
 * A slim, full-width bar for news worth a visitor's attention.
 */
export function Announcement({ label, href, className, children, ...props }: AnnouncementProps) {
  const message = <span className={styles.message}>{children}</span>;

  return (
    <div className={cx(styles.announcement, className)} {...props}>
      {label && <span className={styles.label}>{label}</span>}
      {href ? (
        <Link href={href} className={styles.link}>
          {message}
          <span aria-hidden>→</span>
        </Link>
      ) : (
        message
      )}
    </div>
  );
}
