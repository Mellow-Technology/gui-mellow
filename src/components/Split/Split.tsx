import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Split.module.scss";

export interface SplitProps extends ComponentProps<"div"> {
  /** An image URL, or any element such as a next/image or a video. */
  media: ReactNode;
  /** Alternative text, when `media` is a URL. */
  mediaAlt?: string;
  /** Put the media on the right rather than the left. */
  reverse?: boolean;
}

/**
 * Media and text side by side in one panel, stacking on narrow screens.
 */
export function Split({
  media,
  mediaAlt = "",
  reverse = false,
  className,
  children,
  ...props
}: SplitProps) {
  return (
    <div className={cx(styles.split, reverse && styles.reverse, className)} {...props}>
      <div className={styles.media}>
        {typeof media === "string" ? <img src={media} alt={mediaAlt} loading="lazy" /> : media}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
