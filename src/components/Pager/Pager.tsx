import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Pager.module.scss";

export interface PagerLink {
  href: string;
  title: ReactNode;
}

export interface PagerProps extends ComponentProps<"nav"> {
  previous?: PagerLink;
  next?: PagerLink;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
}

/**
 * Links to the previous and next pages of a sequence, such as documentation.
 */
export function Pager({
  previous,
  next,
  previousLabel = "Previous",
  nextLabel = "Next",
  className,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: PagerProps) {
  if (!previous && !next) return null;

  return (
    <nav className={cx(styles.pager, className)} aria-label={ariaLabel} {...props}>
      {previous && (
        <Link href={previous.href} className={styles.link} rel="prev">
          <span className={styles.label}>← {previousLabel}</span>
          {previous.title}
        </Link>
      )}
      {next && (
        <Link href={next.href} className={cx(styles.link, styles.next)} rel="next">
          <span className={styles.label}>{nextLabel} →</span>
          {next.title}
        </Link>
      )}
    </nav>
  );
}
