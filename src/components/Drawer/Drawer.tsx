"use client";

import { useEffect, type ComponentProps, type ReactNode } from "react";
import { cx, vars } from "../../utils";
import styles from "./Drawer.module.scss";

export interface DrawerProps extends Omit<ComponentProps<"aside">, "title"> {
  open: boolean;
  /** Shows a close button, and closes on Escape. */
  onClose?: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** A colour to edge the panel with, such as the selected item's category. */
  accent?: string;
  side?: "left" | "right";
}

/**
 * A panel that slides in from the side of the screen over the page, without
 * blocking it: details of a selected map marker, filters and so on.
 */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  accent,
  side = "right",
  className,
  style,
  children,
  ...props
}: DrawerProps) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <aside
      className={cx(styles.drawer, styles[side], open && styles.open, className)}
      style={accent ? vars({ "--gm-drawer-accent": accent }, style) : style}
      aria-hidden={!open}
      inert={!open}
      {...props}
    >
      {(title || onClose) && (
        <header className={styles.header}>
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {onClose && (
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              ×
            </button>
          )}
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
