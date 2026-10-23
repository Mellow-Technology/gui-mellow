"use client";

import { useEffect, useId, useRef, type ComponentProps, type ReactNode } from "react";
import { cx } from "../../utils";
import { Button } from "../Button";
import styles from "./Dialog.module.scss";

export interface DialogProps extends Omit<ComponentProps<"dialog">, "open" | "title" | "onClose"> {
  open: boolean;
  /** Called on Escape, the close button or a click outside; set `open` false in response. */
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** Buttons along the bottom, the main action last. */
  actions?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Closes on a click outside the panel. */
  dismissible?: boolean;
}

/**
 * A modal dialog, built on the native <dialog>: the browser traps focus,
 * makes the page behind it inert and handles Escape.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  actions,
  size = "md",
  dismissible = true,
  className,
  children,
  ...props
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx(styles.dialog, styles[size], className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Escape: leave closing to the parent, so `open` stays the truth
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // A click on the dialog itself, not its panel, is on the backdrop
      onClick={(event) => {
        if (dismissible && event.target === event.currentTarget) onClose();
      }}
      {...props}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        {description && (
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        )}
        {children && <div className={styles.body}>{children}</div>}
        {actions && <footer className={styles.actions}>{actions}</footer>}
      </div>
    </dialog>
  );
}

export interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  /** What will happen, and whether it can be undone. */
  children?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** Styles the confirm button as dangerous, for deletes and the like. */
  destructive?: boolean;
  /** Disables the buttons and shows a spinner while the action runs. */
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Asks before going ahead: a styled replacement for `window.confirm`.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={busy ? () => {} : onCancel}
      title={title}
      description={children}
      size="sm"
      role="alertdialog"
      actions={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? "danger" : "primary"} onClick={onConfirm} loading={busy} autoFocus>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
