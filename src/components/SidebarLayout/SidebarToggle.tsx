"use client";

import { useId, useState, type ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./SidebarLayout.module.scss";

export function SidebarToggle({ title, children }: { title: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        {title}
      </button>
      <div id={panelId} className={cx(styles.panel, open && styles.open)}>
        <div className={styles.title}>{title}</div>
        {children}
      </div>
    </>
  );
}
