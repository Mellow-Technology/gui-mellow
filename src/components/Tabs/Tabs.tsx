"use client";

import { useId, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Tabs.module.scss";

export interface Tab<T extends string = string> {
  value: T;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps<T extends string> extends Omit<ComponentProps<"div">, "onChange" | "defaultValue"> {
  tabs: Tab<T>[];
  /** Names the tab list for assistive technology. */
  label: string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

/**
 * Panels behind a row of tabs. The row scrolls sideways when it's wider
 * than the screen, and the arrow keys, Home and End move between tabs.
 * Every panel renders, hidden until chosen, so their content is in the
 * page's HTML.
 */
export function Tabs<T extends string>({
  tabs,
  label,
  value,
  defaultValue,
  onChange,
  className,
  ...props
}: TabsProps<T>) {
  const id = useId();
  const [own, setOwn] = useState(defaultValue ?? tabs.find((tab) => !tab.disabled)?.value);
  const selected = value ?? own;
  const list = useRef<HTMLDivElement>(null);

  const select = (next: T) => {
    setOwn(next);
    onChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const enabled = tabs.filter((tab) => !tab.disabled);
    const at = enabled.findIndex((tab) => tab.value === selected);
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    let next: Tab<T> | undefined;
    if (step) next = enabled[(at + step + enabled.length) % enabled.length];
    else if (event.key === "Home") next = enabled[0];
    else if (event.key === "End") next = enabled.at(-1);
    if (!next) return;

    event.preventDefault();
    select(next.value);
    const button = list.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`);
    button?.focus();
    button?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <div className={cx(styles.tabs, className)} {...props}>
      <div ref={list} role="tablist" aria-label={label} className={styles.list} onKeyDown={onKeyDown}>
        {tabs.map((tab) => {
          const active = tab.value === selected;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              id={`${id}-tab-${tab.value}`}
              aria-controls={`${id}-panel-${tab.value}`}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              disabled={tab.disabled}
              data-value={tab.value}
              className={styles.tab}
              onClick={() => select(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.value}
          role="tabpanel"
          id={`${id}-panel-${tab.value}`}
          aria-labelledby={`${id}-tab-${tab.value}`}
          hidden={tab.value !== selected}
          tabIndex={0}
          className={styles.panel}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
