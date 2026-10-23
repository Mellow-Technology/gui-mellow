import type { ComponentProps, ReactNode } from "react";
import { cx, headingTag, type HeadingLevel } from "../../utils";
import { Eyebrow } from "../Eyebrow";
import { Pattern, type PatternName } from "../Pattern";
import styles from "./Hero.module.scss";

export interface HeroProps extends Omit<ComponentProps<"section">, "title"> {
  title: ReactNode;
  eyebrow?: ReactNode;
  /** Set above the title, such as a Badge. */
  badge?: ReactNode;
  subtitle?: ReactNode;
  /** Buttons under the subtitle. */
  actions?: ReactNode;
  /** A background image URL, faded into the page. */
  image?: string;
  /**
   * `page` is a modest banner for inner pages; `full` fills the screen, for
   * a home page.
   */
  size?: "page" | "full";
  align?: "start" | "center";
  /** The faint background texture: the theme's, a named one, or none. */
  pattern?: PatternName | "theme" | "none";
  level?: HeadingLevel;
}

/**
 * The opening of a page: its title, and what it's about.
 */
export function Hero({
  title,
  eyebrow,
  badge,
  subtitle,
  actions,
  image,
  size = "page",
  align = "start",
  pattern = "theme",
  level = 1,
  className,
  children,
  ...props
}: HeroProps) {
  const Heading = headingTag(level);

  return (
    <section
      className={cx(styles.hero, styles[size], align === "center" && styles.center, className)}
      {...props}
    >
      {image && (
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${JSON.stringify(image)})` }}
          aria-hidden
        />
      )}
      {pattern !== "none" && <Pattern pattern={pattern} />}
      <div className={styles.inner}>
        {badge && <div className={styles.badge}>{badge}</div>}
        {eyebrow && <Eyebrow tone="accent">{eyebrow}</Eyebrow>}
        <Heading className={styles.title}>{title}</Heading>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
        {children}
      </div>
    </section>
  );
}
