import type { ComponentProps } from "react";
import { cx } from "../../utils";
import styles from "./LogoCloud.module.scss";

export interface Logo {
  src: string;
  /** The organisation's name. */
  alt: string;
  href?: string;
}

export interface LogoCloudProps extends ComponentProps<"ul"> {
  logos: Logo[];
}

/**
 * A row of client, partner or sponsor logos. Logos are shown in their
 * original colours, muted; provide ones that suit both themes.
 */
export function LogoCloud({ logos, className, ...props }: LogoCloudProps) {
  return (
    <ul className={cx(styles.cloud, className)} {...props}>
      {logos.map((logo) => {
        const image = <img src={logo.src} alt={logo.alt} loading="lazy" />;
        return (
          <li key={logo.src}>
            {logo.href ? <a href={logo.href}>{image}</a> : image}
          </li>
        );
      })}
    </ul>
  );
}
