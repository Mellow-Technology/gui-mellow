import type { ComponentProps } from "react";
import { cx } from "../../utils";
import styles from "./Prose.module.scss";

export interface ProseProps extends Omit<ComponentProps<"div">, "dangerouslySetInnerHTML"> {
  /** Trusted HTML, such as rendered Markdown, in place of children. */
  html?: string;
  size?: "md" | "lg";
}

/**
 * Styles long-form content written as plain elements, such as Markdown
 * rendered to HTML: headings, lists, tables, code, quotes.
 */
export function Prose({ html, size = "md", className, children, ...props }: ProseProps) {
  const classes = cx(styles.prose, size === "lg" && styles.lg, className);

  if (html !== undefined) {
    return <div className={classes} dangerouslySetInnerHTML={{ __html: html }} {...props} />;
  }
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
