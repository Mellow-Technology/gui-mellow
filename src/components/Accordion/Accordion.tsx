import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Accordion.module.scss";

export interface DisclosureProps extends Omit<ComponentProps<"details">, "title"> {
  title: ReactNode;
}

/**
 * A title that expands to show more. Built on <details>, so it needs no
 * JavaScript and its contents are found by the browser's find-in-page.
 */
export function Disclosure({ title, className, children, ...props }: DisclosureProps) {
  return (
    <details className={cx(styles.disclosure, className)} {...props}>
      <summary className={styles.summary}>
        {title}
        <span className={styles.marker} aria-hidden />
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}

export interface AccordionItem {
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps extends ComponentProps<"div"> {
  items: AccordionItem[];
  /**
   * Opening one item closes the others. Give each accordion on a page its
   * own `name` for this to work.
   */
  name?: string;
}

/**
 * A set of disclosures, for FAQs and the like.
 */
export function Accordion({ items, name, className, ...props }: AccordionProps) {
  return (
    <div className={cx(styles.accordion, className)} {...props}>
      {items.map((item, i) => (
        <Disclosure key={i} title={item.title} name={name}>
          {item.content}
        </Disclosure>
      ))}
    </div>
  );
}
