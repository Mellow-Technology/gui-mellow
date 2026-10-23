import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./SiteFooter.module.scss";

export interface FooterColumn {
  heading: ReactNode;
  links: { href: string; label: ReactNode }[];
}

export interface SiteFooterProps extends ComponentProps<"footer"> {
  /** The logo or site name. */
  brand?: ReactNode;
  columns?: FooterColumn[];
}

/**
 * The site's footer: brand and fine print on one side, columns of links on
 * the other. Children are the fine print, such as a copyright line.
 */
export function SiteFooter({ brand, columns = [], className, children, ...props }: SiteFooterProps) {
  return (
    <footer className={cx(styles.footer, className)} {...props}>
      <div className={styles.inner}>
        <div className={styles.about}>
          {brand && <div className={styles.brand}>{brand}</div>}
          {children && <div className={styles.fineprint}>{children}</div>}
        </div>
        {columns.length > 0 && (
          <div className={styles.columns}>
            {columns.map((column, i) => (
              <nav key={i} className={styles.column}>
                <div className={styles.heading}>{column.heading}</div>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
