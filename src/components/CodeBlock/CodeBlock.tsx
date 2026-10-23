import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import { CopyButton } from "./CopyButton";
import styles from "./CodeBlock.module.scss";

export interface CodeBlockProps extends Omit<ComponentProps<"figure">, "title"> {
  /** The source, shown as is and copied by the copy button. */
  code: string;
  /**
   * The same code already highlighted, as HTML, e.g. from Shiki at build
   * time. Shown in place of `code`; it must be trusted markup.
   */
  html?: string;
  /** Labels the block, such as its file name. */
  title?: ReactNode;
  /** Shown in the corner, and set as `data-language` for highlighters' CSS. */
  language?: string;
  /** Shows a copy button. */
  copy?: boolean;
  /** Breaks long lines rather than scrolling them. */
  wrap?: boolean;
}

/**
 * A block of source code, with an optional title and copy button. Brings no
 * highlighter: pass highlighted HTML if you want colour.
 */
export function CodeBlock({
  code,
  html,
  title,
  language,
  copy = true,
  wrap = false,
  className,
  ...props
}: CodeBlockProps) {
  const header = title || language || copy;

  return (
    <figure className={cx(styles.block, className)} {...props}>
      {header && (
        <figcaption className={styles.header}>
          <span className={styles.title}>{title}</span>
          {language && <span className={styles.language}>{language}</span>}
          {copy && <CopyButton text={code} />}
        </figcaption>
      )}
      <pre className={cx(styles.pre, wrap && styles.wrap)} data-language={language} tabIndex={0}>
        {html ? <code dangerouslySetInnerHTML={{ __html: html }} /> : <code>{code}</code>}
      </pre>
    </figure>
  );
}
