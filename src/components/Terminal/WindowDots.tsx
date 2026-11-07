import styles from "./WindowDots.module.scss";

/**
 * The three dots at the left of a window's title bar. Internal, for the
 * components that draw a window.
 */
export function WindowDots() {
  return (
    <span className={styles.dots} aria-hidden>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
}
