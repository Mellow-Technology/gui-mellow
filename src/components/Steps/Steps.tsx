import type { ComponentProps, ReactNode } from "react";
import { cx, headingTag, type HeadingLevel } from "../../utils";
import styles from "./Steps.module.scss";

export interface Step {
  title: ReactNode;
  body?: ReactNode;
  /** Defaults to the step's number, zero-padded. */
  marker?: ReactNode;
}

export interface StepsProps extends ComponentProps<"ol"> {
  steps: Step[];
  level?: HeadingLevel;
}

/**
 * A numbered sequence, such as how to get started.
 */
export function Steps({ steps, level = 3, className, ...props }: StepsProps) {
  const Heading = headingTag(level);

  return (
    <ol className={cx(styles.steps, className)} {...props}>
      {steps.map((step, i) => (
        <li className={styles.step} key={i}>
          <span className={styles.marker} aria-hidden>
            {step.marker ?? String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <Heading className={styles.title}>{step.title}</Heading>
            {step.body && <div className={styles.body}>{step.body}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
