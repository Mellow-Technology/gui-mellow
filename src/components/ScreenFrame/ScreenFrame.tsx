import type { ReactNode } from "react";
import { cx } from "../../utils";
import { Figure, type FigureProps } from "../Figure";
import { WindowDots } from "../Terminal/WindowDots";
import styles from "./ScreenFrame.module.scss";

export interface ScreenFrameProps extends FigureProps {
  /** The site shown, such as `app.example.org`. */
  host?: string;
  /** The page shown, such as `/apps/new`. Dimmed after the host. */
  path?: string;
  /**
   * The right of the title bar, usually a logo and a name. On narrow screens
   * a `<span>` directly inside is hidden, so wrap the name in one to leave
   * the address more room.
   */
  brand?: ReactNode;
}

function Lock() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={styles.lock}>
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2m-7.5 0h9v6.5h-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A screenshot of an app, in a window with a title bar and the address it
 * lives at, so it reads as an interface rather than a picture.
 */
export function ScreenFrame({
  media,
  alt = "",
  host,
  path,
  brand,
  className,
  ...props
}: ScreenFrameProps) {
  return (
    <Figure
      className={cx(styles.frame, className)}
      mediaClassName={styles.window}
      media={
        <>
          <div className={styles.bar}>
            <WindowDots />
            {(host || path) && (
              <div className={styles.address}>
                {host && <Lock />}
                <span className={styles.url}>
                  {host && <span className={styles.host}>{host}</span>}
                  {path && <span className={styles.path}>{path}</span>}
                </span>
              </div>
            )}
            {brand && <div className={styles.brand}>{brand}</div>}
          </div>
          <div className={styles.screen}>
            {typeof media === "string" ? <img src={media} alt={alt} loading="lazy" /> : media}
          </div>
        </>
      }
      {...props}
    />
  );
}
