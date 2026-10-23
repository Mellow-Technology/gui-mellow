import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Testimonial.module.scss";

export interface TestimonialProps extends ComponentProps<"figure"> {
  quote: ReactNode;
  author: ReactNode;
  /** The author's job or organisation. */
  authorTitle?: ReactNode;
  /** An Avatar, or other image of the author. */
  avatar?: ReactNode;
  /** Out of five. */
  rating?: number;
}

/**
 * A quotation from a customer or reviewer, with who said it.
 */
export function Testimonial({
  quote,
  author,
  authorTitle,
  avatar,
  rating,
  className,
  ...props
}: TestimonialProps) {
  return (
    <figure className={cx(styles.testimonial, className)} {...props}>
      {rating !== undefined && (
        <div className={styles.rating} role="img" aria-label={`${rating} out of 5`}>
          {"★".repeat(Math.round(rating))}
          <span className={styles.unrated}>{"★".repeat(5 - Math.round(rating))}</span>
        </div>
      )}
      <blockquote className={styles.quote}>{quote}</blockquote>
      <figcaption className={styles.caption}>
        {avatar}
        <span>
          <span className={styles.author}>{author}</span>
          {authorTitle && <span className={styles.authorTitle}>{authorTitle}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
