import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import { SiteNav, type NavItem } from "./SiteNav";
import styles from "./SiteHeader.module.scss";

export interface SiteHeaderProps extends ComponentProps<"header"> {
  /** The logo or site name, normally linking home. */
  brand: ReactNode;
  items?: NavItem[];
  /** Controls at the far end, such as a ThemeToggle or a sign-in button. */
  actions?: ReactNode;
}

/**
 * The site's header: brand, navigation and actions, sticking to the top of
 * the screen. The navigation folds into a menu on small screens.
 */
export function SiteHeader({ brand, items = [], actions, className, ...props }: SiteHeaderProps) {
  return (
    <header className={cx(styles.header, className)} {...props}>
      <div className={styles.inner}>
        <div className={styles.brand}>{brand}</div>
        <SiteNav items={items} />
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
}

export type { NavItem };
