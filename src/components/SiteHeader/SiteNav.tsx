"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./SiteHeader.module.scss";

export interface NavItem {
  href: string;
  label: ReactNode;
}

function trimSlash(path: string) {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

function isCurrent(pathname: string, href: string) {
  const path = trimSlash(pathname);
  const target = trimSlash(href);
  return target === "/" ? path === "/" : path === target || path.startsWith(`${target}/`);
}

/**
 * The header's links: a row on wide screens, a menu behind a toggle on
 * narrow ones. Marks the link to the current page.
 */
export function SiteNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!items.length) return <div className={styles.nav} />;

  return (
    <nav className={styles.nav} aria-label="Main">
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.toggleIcon} aria-hidden />
        <span className={styles.toggleLabel}>Menu</span>
      </button>
      <ul id={menuId} className={cx(styles.links, open && styles.open)}>
        {items.map((item) => {
          const current = isCurrent(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.link}
                aria-current={current ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
