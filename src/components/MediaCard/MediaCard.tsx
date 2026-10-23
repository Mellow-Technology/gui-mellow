import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx, headingTag, type HeadingLevel } from "../../utils";
import { Eyebrow } from "../Eyebrow";
import styles from "./MediaCard.module.scss";

export interface MediaCardProps extends Omit<ComponentProps<"article">, "title"> {
  title: ReactNode;
  /** An image URL, or any element such as a next/image. */
  media: ReactNode;
  /** Alternative text, when `media` is a URL. */
  mediaAlt?: string;
  eyebrow?: ReactNode;
  /** Makes the whole card a link to here. */
  href?: string;
  level?: HeadingLevel;
}

/**
 * A card led by an image, for case studies, projects and posts.
 */
export function MediaCard({
  title,
  media,
  mediaAlt = "",
  eyebrow,
  href,
  level = 3,
  className,
  children,
  ...props
}: MediaCardProps) {
  const Heading = headingTag(level);

  return (
    <article className={cx(styles.card, href && styles.linked, className)} {...props}>
      <div className={styles.media}>
        {typeof media === "string" ? <img src={media} alt={mediaAlt} loading="lazy" /> : media}
      </div>
      <div className={styles.content}>
        {eyebrow && <Eyebrow tone="accent">{eyebrow}</Eyebrow>}
        <Heading className={styles.title}>
          {href ? (
            <Link href={href} className={styles.link}>
              {title}
            </Link>
          ) : (
            title
          )}
        </Heading>
        {children && <div className={styles.body}>{children}</div>}
      </div>
    </article>
  );
}
