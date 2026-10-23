import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import { SidebarToggle } from "./SidebarToggle";
import styles from "./SidebarLayout.module.scss";

export interface SidebarLayoutProps extends ComponentProps<"div"> {
  /** Navigation for the section, such as a list of pages. */
  sidebar: ReactNode;
  /** Heads the sidebar, and labels it when folded away on small screens. */
  sidebarTitle?: ReactNode;
  /** A second rail on the far side on wide screens, such as a TableOfContents. */
  aside?: ReactNode;
}

/**
 * A page with a sticky sidebar beside its content, for documentation and
 * the like. On small screens the sidebar folds into a toggle above the
 * content.
 */
export function SidebarLayout({
  sidebar,
  sidebarTitle = "Contents",
  aside,
  className,
  children,
  ...props
}: SidebarLayoutProps) {
  return (
    <div className={cx(styles.layout, aside ? styles.withAside : undefined, className)} {...props}>
      <div className={styles.sidebar}>
        <SidebarToggle title={sidebarTitle}>{sidebar}</SidebarToggle>
      </div>
      <div className={styles.content}>{children}</div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  );
}

/** Styles a sidebar's links; mark the current one with aria-current="page". */
export const sidebarLinkClass = styles.link;
