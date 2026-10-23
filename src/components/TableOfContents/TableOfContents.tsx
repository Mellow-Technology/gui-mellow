"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { cx } from "../../utils";
import styles from "./TableOfContents.module.scss";

export interface TocHeading {
  /** The heading element's id. */
  id: string;
  text: string;
  /** 2 for an h2, 3 for an h3, and so on. Deeper headings are indented. */
  depth: number;
}

export interface TableOfContentsProps extends ComponentProps<"nav"> {
  headings: TocHeading[];
  /**
   * How far below the top of the viewport, in pixels, a heading counts as
   * the current one. Clear any sticky header.
   */
  offset?: number;
}

/**
 * Links to each section of the page, highlighting the one being read.
 */
export function TableOfContents({
  headings,
  offset = 120,
  className,
  "aria-label": ariaLabel = "On this page",
  ...props
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id);
  const topDepth = Math.min(...headings.map((heading) => heading.depth));

  useEffect(() => {
    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    let frame = 0;
    const update = () => {
      frame = 0;
      let current = elements[0];
      for (const el of elements) {
        if (el.getBoundingClientRect().top > offset) break;
        current = el;
      }
      // At the bottom of the page the last sections may never reach the
      // top, so the final one wins
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = elements[elements.length - 1];
      if (current) setActiveId(current.id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [headings, offset]);

  if (!headings.length) return null;

  return (
    <nav className={cx(styles.toc, className)} aria-label={ariaLabel} {...props}>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.depth - topDepth) * 0.75}rem` }}>
            <a
              href={`#${heading.id}`}
              className={styles.link}
              aria-current={heading.id === activeId ? "location" : undefined}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
