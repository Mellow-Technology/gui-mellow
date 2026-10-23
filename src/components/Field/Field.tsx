import { useId, type ComponentProps, type ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Field.module.scss";

interface FieldOwnProps {
  label: ReactNode;
  /** Help shown under the control. */
  hint?: ReactNode;
  /** An error message; marks the control invalid. */
  error?: ReactNode;
  /** Styles the whole field: label, control and message. */
  className?: string;
}

interface ControlClassProps {
  /** Styles only the input, textarea or select. */
  controlClassName?: string;
}

export interface FieldProps extends FieldOwnProps {
  /** The id of the control the label is for. */
  htmlFor: string;
  required?: boolean;
  /** The id for the hint or error, to point the control's aria-describedby at. */
  messageId?: string;
  children: ReactNode;
}

/**
 * Label, control and message, laid out together. TextField and SelectField
 * cover most needs; use this directly to wrap a control of your own.
 */
export function Field({ label, hint, error, required, htmlFor, messageId, className, children }: FieldProps) {
  const message = error || hint;

  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {message && (
        <p id={messageId} className={cx(styles.message, error ? styles.error : undefined)}>
          {message}
        </p>
      )}
    </div>
  );
}

/**
 * Ids and ARIA wiring shared by the field components.
 */
function useFieldIds(id: string | undefined, hint: ReactNode, error: ReactNode) {
  const generated = useId();
  const controlId = id ?? generated;
  const messageId = `${controlId}-message`;
  return {
    controlId,
    messageId,
    aria: {
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error || hint ? messageId : undefined,
    },
  };
}

type InputProps = FieldOwnProps &
  ControlClassProps & { multiline?: false } & Omit<ComponentProps<"input">, keyof FieldOwnProps>;
type TextareaProps = FieldOwnProps &
  ControlClassProps & { multiline: true } & Omit<ComponentProps<"textarea">, keyof FieldOwnProps>;

export type TextFieldProps = InputProps | TextareaProps;

/**
 * A labelled text input, or a textarea when `multiline`. Takes the usual
 * input attributes: name, type, value, onChange, placeholder and so on.
 */
export function TextField({ label, hint, error, className, controlClassName, ...control }: TextFieldProps) {
  const { controlId, messageId, aria } = useFieldIds(control.id, hint, error);
  const field = { label, hint, error, className, required: control.required, htmlFor: controlId, messageId };

  if (control.multiline) {
    const { multiline: _, ...textarea } = control;
    return (
      <Field {...field}>
        <textarea
          {...aria}
          {...textarea}
          id={controlId}
          className={cx(styles.control, styles.textarea, controlClassName)}
        />
      </Field>
    );
  }

  const { multiline: _, type = "text", ...input } = control;
  return (
    <Field {...field}>
      <input {...aria} {...input} type={type} id={controlId} className={cx(styles.control, controlClassName)} />
    </Field>
  );
}

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export type SelectFieldProps = FieldOwnProps &
  ControlClassProps &
  Omit<ComponentProps<"select">, keyof FieldOwnProps> & {
    /** The choices; or pass <option> elements as children. */
    options?: SelectOption[];
  };

/**
 * A labelled drop-down.
 */
export function SelectField({
  label,
  hint,
  error,
  className,
  controlClassName,
  options,
  children,
  ...select
}: SelectFieldProps) {
  const { controlId, messageId, aria } = useFieldIds(select.id, hint, error);

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      className={className}
      required={select.required}
      htmlFor={controlId}
      messageId={messageId}
    >
      <select {...aria} {...select} id={controlId} className={cx(styles.control, styles.select, controlClassName)}>
        {options?.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    </Field>
  );
}
