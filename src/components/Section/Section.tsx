import type { ComponentProps, ReactNode } from "react";
import { cx, headingTag, type HeadingLevel } from "../../utils";
import { Container } from "../Container";
import { Eyebrow } from "../Eyebrow";
import styles from "./Section.module.scss";

export interface SectionProps extends Omit<ComponentProps<"section">, "title"> {
  title?: ReactNode;
  eyebrow?: ReactNode;
  /** A short introduction under the title. */
  description?: ReactNode;
  /** The title's heading level. */
  level?: HeadingLevel;
  align?: "start" | "center";
  /** `narrow` suits running text; `wide` suits grids. */
  size?: "narrow" | "wide";
}

/**
 * A titled band of the page, centred in a column.
 */
export function Section({
  title,
  eyebrow,
  description,
  level = 2,
  align = "start",
  size = "narrow",
  className,
  children,
  ...props
}: SectionProps) {
  const Heading = headingTag(level);
  const hasHeader = title || eyebrow || description;

  return (
    <section className={cx(styles.section, className)} {...props}>
      <Container size={size}>
        {hasHeader && (
          <header className={cx(styles.header, align === "center" && styles.center)}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <Heading className={styles.title}>{title}</Heading>}
            {description && <p className={styles.description}>{description}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
