import type { ReactNode } from "react";
import styles from "./showcase.module.scss";

export function exampleId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * One titled example on a component's page.
 */
export function Example({
  title,
  description,
  bleed = false,
  children,
}: {
  title: string;
  description?: ReactNode;
  /** Let the example run to the frame's edges. */
  bleed?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={styles.example}>
      <h2 id={exampleId(title)} className={styles.exampleTitle}>
        {title}
      </h2>
      {description && <p className={styles.exampleDescription}>{description}</p>}
      <div className={bleed ? styles.stageBleed : styles.stage}>{children}</div>
    </section>
  );
}
