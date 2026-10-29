"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils";
import { Field } from "../Field";
import fieldStyles from "../Field/Field.module.scss";
import styles from "./Combobox.module.scss";

export interface ComboboxOption {
  value: string;
  /** What's shown in the list, and in the input once chosen. */
  label: string;
  /** A second, quieter line under the label. */
  description?: ReactNode;
  disabled?: boolean;
}

export interface ComboboxFieldProps
  extends Omit<ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "type" | "role"> {
  label: ReactNode;
  options: ComboboxOption[];
  /** The chosen option's value; empty for none. */
  value?: string;
  onChange?: (value: string, option: ComboboxOption | undefined) => void;
  /**
   * Called as the text changes, for searching elsewhere: fetch matches and
   * pass them back as `options`, with `filter={false}`.
   */
  onInputChange?: (text: string) => void;
  /**
   * How options are matched to the text. By default, any whose label or
   * value contains it, ignoring case; `false` shows every option given,
   * for options already searched for.
   */
  filter?: false | ((option: ComboboxOption, text: string) => boolean);
  /** Says a search is under way, in place of the empty message. */
  loading?: boolean;
  /** Shown when nothing matches. */
  emptyMessage?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  hideLabel?: boolean;
  /** Styles the whole field: label, control and message. */
  className?: string;
  /** Styles only the input. */
  controlClassName?: string;
}

const defaultFilter = (option: ComboboxOption, text: string) => {
  const needle = text.trim().toLowerCase();
  return needle === "" || option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle);
};

/**
 * A labelled text input that suggests options as you type, and chooses one.
 * Follows the ARIA combobox pattern: the arrow keys move through the list,
 * Enter chooses, Escape closes it. Filters `options` itself, or, with
 * `onInputChange` and `filter={false}`, shows the matches you fetch.
 *
 * Only an option can be chosen: leaving the input with other text puts the
 * chosen option's label back.
 */
export function ComboboxField({
  label,
  options,
  value = "",
  onChange,
  onInputChange,
  filter = defaultFilter,
  loading = false,
  emptyMessage = "Nothing matches.",
  hint,
  error,
  hideLabel,
  className,
  controlClassName,
  id,
  disabled,
  required,
  onBlur,
  onFocus,
  onKeyDown,
  ...input
}: ComboboxFieldProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const listId = `${controlId}-list`;
  const messageId = `${controlId}-message`;
  const list = useRef<HTMLUListElement>(null);

  // The chosen option may come from an earlier search, so its label is
  // kept rather than looked up in today's options
  const [chosenLabel, setChosenLabel] = useState(() => options.find((option) => option.value === value)?.label ?? value);
  const [text, setText] = useState(chosenLabel);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [lastValue, setLastValue] = useState(value);

  // A value changed from outside shows its label
  if (value !== lastValue) {
    const label = options.find((option) => option.value === value)?.label ?? value;
    setLastValue(value);
    setChosenLabel(label);
    setText(label);
  }

  const shown = filter === false ? options : options.filter((option) => filter(option, text === chosenLabel ? "" : text));
  const enabled = shown.map((option, index) => (option.disabled ? -1 : index)).filter((index) => index >= 0);

  useEffect(() => {
    if (open && active >= 0) {
      list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
    }
  }, [open, active]);

  const choose = (option: ComboboxOption) => {
    setChosenLabel(option.label);
    setText(option.label);
    setLastValue(option.value);
    setOpen(false);
    setActive(-1);
    onChange?.(option.value, option);
  };

  const move = (step: number) => {
    if (enabled.length === 0) return;
    const at = enabled.indexOf(active);
    const next = at === -1 ? (step > 0 ? 0 : enabled.length - 1) : (at + step + enabled.length) % enabled.length;
    setActive(enabled[next]!);
  };

  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      move(event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Enter" && open) {
      // Never submits the form while the list is open
      event.preventDefault();
      const option = shown[active];
      if (option && !option.disabled) choose(option);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  };

  const message = error || hint;
  const activeId = open && active >= 0 ? `${controlId}-option-${active}` : undefined;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      hideLabel={hideLabel}
      className={className}
      required={required}
      htmlFor={controlId}
      messageId={messageId}
    >
      <div className={styles.combobox}>
        <input
          {...input}
          id={controlId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          disabled={disabled}
          required={required}
          value={text}
          className={cx(fieldStyles.control, styles.input, controlClassName)}
          onChange={(event) => {
            setText(event.target.value);
            setOpen(true);
            setActive(-1);
            onInputChange?.(event.target.value);
          }}
          onFocus={(event) => {
            onFocus?.(event);
            setOpen(true);
          }}
          onBlur={(event) => {
            onBlur?.(event);
            setOpen(false);
            setActive(-1);
            setText(chosenLabel);
          }}
          onKeyDown={keyDown}
        />
        <ul
          ref={list}
          id={listId}
          role="listbox"
          aria-label={typeof label === "string" ? label : undefined}
          className={styles.list}
          hidden={!open}
        >
          {shown.map((option, index) => (
            <li
              key={option.value}
              id={`${controlId}-option-${index}`}
              role="option"
              data-index={index}
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              className={cx(styles.option, index === active && styles.active)}
              // Keeps focus in the input, so the blur doesn't close the
              // list before the click lands
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => !option.disabled && setActive(index)}
              onClick={() => !option.disabled && choose(option)}
            >
              <span className={styles.label}>{option.label}</span>
              {option.description && <span className={styles.description}>{option.description}</span>}
            </li>
          ))}
          {shown.length === 0 && (
            <li className={styles.empty} role="presentation">
              {loading ? "Searching…" : emptyMessage}
            </li>
          )}
        </ul>
      </div>
    </Field>
  );
}
