"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { cx } from "../../utils";
import styles from "./CodeBlock.module.scss";

export interface CopyButtonProps extends Omit<ComponentProps<"button">, "onClick"> {
  /** What to put on the clipboard. */
  text: string;
  label?: string;
  copiedLabel?: string;
}

/**
 * Copies text to the clipboard, confirming briefly in its label.
 */
export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className={cx(styles.copyButton, className)}
      onClick={() => navigator.clipboard.writeText(text).then(() => setCopied(true), () => {})}
      aria-live="polite"
      {...props}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
