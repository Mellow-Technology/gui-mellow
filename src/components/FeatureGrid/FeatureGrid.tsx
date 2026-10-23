import type { ComponentProps, ReactNode } from "react";
import { cx, headingTag, vars, type HeadingLevel } from "../../utils";
import styles from "./FeatureGrid.module.scss";

export interface FeatureGridProps extends ComponentProps<"div"> {
  /** The narrowest a column may get, as a CSS length. */
  min?: string;
}

/**
 * Features divided by hairlines in one panel, rather than as separate cards.
 */
export function FeatureGrid({ min = "260px", className, style, ...props }: FeatureGridProps) {
  return (
    <div
      className={cx(styles.grid, className)}
      style={vars({ "--gm-feature-min": min }, style)}
      {...props}
    />
  );
}

export interface FeatureProps extends Omit<ComponentProps<"div">, "title"> {
  title?: ReactNode;
  /** A number or short marker, such as "01". */
  index?: ReactNode;
  level?: HeadingLevel;
}

export function Feature({ title, index, level = 3, className, children, ...props }: FeatureProps) {
  const Heading = headingTag(level);

  return (
    <div className={cx(styles.feature, className)} {...props}>
      {index && <span className={styles.index}>{index}</span>}
      {title && <Heading className={styles.title}>{title}</Heading>}
      {children && <div className={styles.body}>{children}</div>}
    </div>
  );
}
