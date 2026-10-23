import type { ComponentProps } from "react";
import { cx, vars } from "../../utils";
import styles from "./Avatar.module.scss";

export interface AvatarProps extends Omit<ComponentProps<"span">, "children"> {
  /** The person's name: the image's alt text, and initials when there's no image. */
  name: string;
  src?: string;
  /** Diameter in pixels. */
  size?: number;
}

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  const letters = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return letters.map((word) => word?.[0]?.toUpperCase() ?? "").join("");
}

/**
 * A round portrait, falling back to initials.
 */
export function Avatar({ name, src, size = 48, className, style, ...props }: AvatarProps) {
  return (
    <span
      className={cx(styles.avatar, className)}
      style={vars({ "--gm-avatar-size": `${size}px` }, style)}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} width={size} height={size} loading="lazy" />
      ) : (
        <span role="img" aria-label={name}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}
