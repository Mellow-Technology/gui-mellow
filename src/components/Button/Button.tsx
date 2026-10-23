import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Button.module.scss";

interface CommonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  /** Shown before the label. */
  icon?: ReactNode;
  /** Shows a spinner in place of the icon and disables the button. */
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

type LinkProps = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps | "href"> & { href: string };

type NativeButtonProps = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };

export type ButtonProps = LinkProps | NativeButtonProps;

/**
 * A button, or a link styled as one when given an `href`.
 */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cx(styles.button, styles[variant], styles[size], className);
  const content = (
    <>
      {loading ? <span className={styles.spinner} aria-hidden /> : icon}
      {children}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <Link {...rest} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...button } = rest;
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...button}
      className={classes}
    >
      {content}
    </button>
  );
}
