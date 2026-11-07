import Link from "next/link";
import type { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./ButtonGroup.module.scss";

interface CommonItem {
  id: string;
  label: ReactNode;
  /** Shown before the label. */
  icon?: ReactNode;
  tone?: "default" | "danger";
  disabled?: boolean;
}

interface LinkItem extends CommonItem {
  href: string;
  target?: string;
  rel?: string;
  onClick?: undefined;
}

interface ActionItem extends CommonItem {
  onClick: MouseEventHandler<HTMLButtonElement>;
  href?: undefined;
}

export type ButtonGroupItem = LinkItem | ActionItem;

export interface ButtonGroupProps extends Omit<ComponentProps<"div">, "children" | "role"> {
  items: ButtonGroupItem[];
  /** Names the group for assistive technology. */
  label: string;
  size?: "sm" | "md";
}

/**
 * A row of related actions, drawn like SegmentedControl. Each item is a real
 * link or button with its own Tab stop: nothing happens until one is pressed,
 * and nothing stays selected. For choosing between options, where one is
 * always selected and arrow keys move it, use SegmentedControl.
 */
export function ButtonGroup({ items, label, size = "md", className, ...props }: ButtonGroupProps) {
  return (
    <div {...props} role="group" aria-label={label} className={cx(styles.group, styles[size], className)}>
      {items.map((item) => {
        const classes = cx(styles.item, item.tone === "danger" && styles.danger);
        const content = (
          <>
            {item.icon}
            {item.label}
          </>
        );

        // A link can't be disabled, so a disabled one becomes a button
        if (item.href !== undefined && !item.disabled) {
          return (
            <Link key={item.id} href={item.href} target={item.target} rel={item.rel} className={classes}>
              {content}
            </Link>
          );
        }
        return (
          <button key={item.id} type="button" className={classes} onClick={item.onClick} disabled={item.disabled}>
            {content}
          </button>
        );
      })}
    </div>
  );
}
