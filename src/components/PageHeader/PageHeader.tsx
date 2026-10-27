import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx, headingTag, type HeadingLevel } from "../../utils";
import { Eyebrow } from "../Eyebrow";
import styles from "./PageHeader.module.scss";

export interface PageHeaderProps extends Omit<ComponentProps<"header">, "title"> {
  title: ReactNode;
  /** The small label above the title, such as the parent's name. */
  eyebrow?: ReactNode;
  /** A line or two under the title. */
  description?: ReactNode;
  /** Buttons at the end of the title's line, wrapping under it when narrow. */
  actions?: ReactNode;
  /** A link up to the page this one sits under. */
  back?: { href: string; label: ReactNode };
  level?: HeadingLevel;
}

/**
 * The title of an app's page, with what can be done from it and the way
 * back up. Hero and Section suit marketing pages; this suits the pages
 * behind them, where the title and its actions share a line.
 */
export function PageHeader({
  title,
  eyebrow,
  description,
  actions,
  back,
  level = 1,
  className,
  children,
  ...props
}: PageHeaderProps) {
  const Heading = headingTag(level);

  return (
    <header className={cx(styles.header, className)} {...props}>
      {back && (
        <Link href={back.href} className={styles.back}>
          <span aria-hidden>←</span> {back.label}
        </Link>
      )}
      <div className={styles.row}>
        <div className={styles.text}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <Heading className={styles.title}>{title}</Heading>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {children}
    </header>
  );
}
