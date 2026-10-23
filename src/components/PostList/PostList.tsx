import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx, headingTag, type HeadingLevel } from "../../utils";
import styles from "./PostList.module.scss";

export interface PostListItem {
  href: string;
  title: ReactNode;
  description?: ReactNode;
  /** Shown beside the title: usually a date, already formatted. */
  meta?: ReactNode;
}

export interface PostListProps extends ComponentProps<"ul"> {
  items: PostListItem[];
  level?: HeadingLevel;
}

/**
 * A list of linked entries, such as blog posts or changelog releases.
 */
export function PostList({ items, level = 2, className, ...props }: PostListProps) {
  const Heading = headingTag(level);

  return (
    <ul className={cx(styles.list, className)} {...props}>
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={styles.item}>
            {item.meta && <span className={styles.meta}>{item.meta}</span>}
            <div>
              <Heading className={styles.title}>{item.title}</Heading>
              {item.description && <p className={styles.description}>{item.description}</p>}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
