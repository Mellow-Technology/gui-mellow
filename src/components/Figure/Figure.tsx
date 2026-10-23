import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Figure.module.scss";

export interface FigureProps extends ComponentProps<"figure"> {
  /** An image URL, or any element such as a next/image or a video. */
  media: ReactNode;
  /** Alternative text, when `media` is a URL. */
  alt?: string;
  caption?: ReactNode;
}

/**
 * An image with an optional caption.
 */
export function Figure({ media, alt = "", caption, className, ...props }: FigureProps) {
  return (
    <figure className={cx(styles.figure, className)} {...props}>
      <div className={styles.media}>
        {typeof media === "string" ? <img src={media} alt={alt} loading="lazy" /> : media}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
