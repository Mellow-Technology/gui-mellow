import type { ComponentProps } from "react";
import { cx } from "../../utils";
import styles from "./Terminal.module.scss";

export interface TerminalProps extends ComponentProps<"div"> {
  /** Commands, one per line. Lines starting with `#` are comments. */
  lines: string[];
  /** Shown in the window's title bar. */
  label?: string;
  prompt?: string;
}

/**
 * Split a trailing "  # comment" off a command so it can be dimmed.
 */
function splitComment(line: string): [string, string | undefined] {
  const match = line.match(/^(.*?\S)(\s+#\s.*)$/);
  return match ? [match[1]!, match[2]] : [line, undefined];
}

/**
 * Shell commands in a terminal window, for install instructions and the like.
 */
export function Terminal({ lines, label, prompt = "$", className, ...props }: TerminalProps) {
  return (
    <div className={cx(styles.terminal, className)} {...props}>
      <div className={styles.titleBar} aria-hidden={!label}>
        <span className={styles.light} />
        <span className={styles.light} />
        <span className={styles.light} />
        {label && <span className={styles.label}>{label}</span>}
      </div>
      <pre className={styles.body}>
        {lines.map((line, i) => {
          if (!line.trim()) {
            return <span className={styles.blank} key={i} />;
          }
          if (line.startsWith("#")) {
            return (
              <span className={cx(styles.line, styles.comment)} key={i}>
                {line}
              </span>
            );
          }

          // A line continuing the one before it has no prompt of its own
          const continued = lines[i - 1]?.trimEnd().endsWith("\\");
          const [command, comment] = splitComment(line);
          return (
            <span className={styles.line} key={i}>
              <span className={styles.prompt} aria-hidden>
                {continued ? "  " : `${prompt} `}
              </span>
              <code>{command}</code>
              {comment && <span className={styles.comment}>{comment}</span>}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
