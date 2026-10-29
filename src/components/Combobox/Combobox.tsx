"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
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
  /** What's shown in the list, and in the input (or a tag) once chosen. */
  label: string;
  /** A second, quieter line under the label. */
  description?: ReactNode;
  disabled?: boolean;
}

interface ComboboxCommonProps
  extends Omit<ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "type" | "role" | "multiple"> {
  label: ReactNode;
  options: ComboboxOption[];
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
  /** Styles only the control. */
  controlClassName?: string;
}

export interface ComboboxFieldProps extends ComboboxCommonProps {
  multiple?: false;
  /** The chosen option's value; empty for none. */
  value?: string;
  onChange?: (value: string, option: ComboboxOption | undefined) => void;
}

export interface MultiComboboxFieldProps extends ComboboxCommonProps {
  /** Chooses any number of options, shown as tags before the input. */
  multiple: true;
  /** The chosen options' values, in the order they were chosen. */
  value?: string[];
  onChange?: (values: string[], options: ComboboxOption[]) => void;
}

const defaultFilter = (option: ComboboxOption, text: string) => {
  const needle = text.trim().toLowerCase();
  return needle === "" || option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle);
};

// Space kept between the list and the input, and from the window's edge
const GAP_PX = 4;
const EDGE_PX = 8;

// The list's height when there's room; it shrinks, or opens upward, when
// there isn't
const MAX_HEIGHT_PX = 288;

const NO_VALUES: string[] = [];

/**
 * Places a list under its control, or over it when there's more room there.
 */
function place(popup: HTMLElement | null, control: HTMLElement | null) {
  if (!popup || !control) return;
  const rect = control.getBoundingClientRect();
  const below = window.innerHeight - rect.bottom - GAP_PX - EDGE_PX;
  const above = rect.top - GAP_PX - EDGE_PX;
  const upward = below < Math.min(MAX_HEIGHT_PX, popup.scrollHeight) && above > below;
  popup.style.left = `${rect.left}px`;
  popup.style.width = `${rect.width}px`;
  popup.style.maxHeight = `${Math.min(MAX_HEIGHT_PX, upward ? above : below)}px`;
  popup.style.top = upward ? "auto" : `${rect.bottom + GAP_PX}px`;
  popup.style.bottom = upward ? `${window.innerHeight - rect.top + GAP_PX}px` : "auto";
}

/**
 * A labelled text input that suggests options as you type, and chooses one,
 * or with `multiple`, several. Follows the ARIA combobox pattern: the arrow
 * keys move through the list, Enter chooses, Escape closes it. Filters
 * `options` itself, or, with `onInputChange` and `filter={false}`, shows the
 * matches you fetch.
 *
 * Only an option can be chosen: leaving the input with other text puts the
 * chosen option's label back, or with `multiple`, clears it. With
 * `multiple`, choosing an option again unchooses it, and Backspace in the
 * empty input removes the last one.
 *
 * The list opens in the browser's top layer, so a container that clips its
 * overflow, or a dialog, doesn't cut it off.
 */
export function ComboboxField(props: ComboboxFieldProps | MultiComboboxFieldProps) {
  const {
    label,
    options,
    value: _value,
    onChange: _onChange,
    multiple = false,
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
    name,
    disabled,
    required,
    onBlur,
    onFocus,
    onKeyDown,
    ...input
  } = props;

  // Both modes work on a list of values; single mode's has one at most
  const values = props.multiple ? (props.value ?? NO_VALUES) : props.value ? [props.value] : NO_VALUES;
  const valuesKey = values.join("\u0000");

  const generated = useId();
  const controlId = id ?? generated;
  const listId = `${controlId}-list`;
  const messageId = `${controlId}-message`;
  const anchor = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const field = useRef<HTMLInputElement>(null);

  // Chosen options may come from earlier searches, so their labels are
  // kept rather than looked up in today's options
  const labelsFor = (chosen: string[], known: Record<string, string>) =>
    Object.fromEntries(
      chosen.map((value) => [value, options.find((option) => option.value === value)?.label ?? known[value] ?? value]),
    );
  const [labels, setLabels] = useState<Record<string, string>>(() => labelsFor(values, {}));
  const chosenLabel = multiple ? "" : (labels[values[0] ?? ""] ?? "");
  const [text, setText] = useState(chosenLabel);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [lastValues, setLastValues] = useState(valuesKey);

  // Values changed from outside show their labels
  if (valuesKey !== lastValues) {
    const next = labelsFor(values, labels);
    setLastValues(valuesKey);
    setLabels(next);
    if (!multiple) setText(next[values[0] ?? ""] ?? "");
  }

  const query = multiple || text !== chosenLabel ? text : "";
  const shown = filter === false ? options : options.filter((option) => filter(option, query));
  const enabled = shown.map((option, index) => (option.disabled ? -1 : index)).filter((index) => index >= 0);

  useEffect(() => {
    if (open && active >= 0) {
      list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
    }
  }, [open, active]);

  // Shows the list in the top layer, and keeps it with the control as the
  // page scrolls or resizes
  useLayoutEffect(() => {
    const popup = list.current;
    if (!popup || !open) return;
    popup.showPopover();
    const follow = () => place(popup, anchor.current);
    // Capturing, so scrolling any container the field sits in moves it too
    window.addEventListener("scroll", follow, true);
    window.addEventListener("resize", follow);
    return () => {
      window.removeEventListener("scroll", follow, true);
      window.removeEventListener("resize", follow);
      if (popup.matches(":popover-open")) popup.hidePopover();
    };
  }, [open]);

  // Again after every render while open, as the matches, and so the list's
  // height, or the tags, and so the control's, change
  useLayoutEffect(() => {
    if (open) place(list.current, anchor.current);
  });

  const emit = (next: string[], nextLabels: Record<string, string>) => {
    setLastValues(next.join("\u0000"));
    setLabels(nextLabels);
    const chosen = next.map(
      (value) => options.find((option) => option.value === value) ?? { value, label: nextLabels[value] ?? value },
    );
    if (props.multiple) props.onChange?.(next, chosen);
    else props.onChange?.(next[0] ?? "", chosen[0]);
  };

  const choose = (option: ComboboxOption) => {
    if (multiple) {
      // Stays open, for choosing the next
      const next = values.includes(option.value)
        ? values.filter((value) => value !== option.value)
        : [...values, option.value];
      emit(next, { ...labels, [option.value]: option.label });
      if (text !== "") {
        setText("");
        onInputChange?.("");
        setActive(-1);
      }
      return;
    }
    setText(option.label);
    setOpen(false);
    setActive(-1);
    emit([option.value], { [option.value]: option.label });
  };

  const remove = (value: string) => {
    emit(
      values.filter((chosen) => chosen !== value),
      labels,
    );
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
    } else if (event.key === "Backspace" && multiple && text === "" && values.length > 0) {
      event.preventDefault();
      remove(values[values.length - 1]!);
    }
  };

  const message = error || hint;
  const activeId = open && active >= 0 ? `${controlId}-option-${active}` : undefined;

  const textInput = (
    <input
      {...input}
      ref={field}
      id={controlId}
      // In multiple mode the values are submitted from hidden inputs, not
      // the text
      name={multiple ? undefined : name}
      type="text"
      role="combobox"
      autoComplete="off"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-controls={listId}
      aria-activedescendant={activeId}
      aria-invalid={error ? true : undefined}
      aria-describedby={message ? messageId : undefined}
      aria-required={multiple && required ? true : undefined}
      disabled={disabled}
      required={multiple ? undefined : required}
      value={text}
      className={multiple ? styles.text : cx(fieldStyles.control, styles.input, controlClassName)}
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
        if (text !== chosenLabel) {
          setText(chosenLabel);
          if (multiple) onInputChange?.("");
        }
      }}
      onKeyDown={keyDown}
    />
  );

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
      {multiple ? (
        <div
          ref={anchor}
          className={cx(fieldStyles.control, styles.input, styles.multiple, controlClassName)}
          aria-invalid={error ? true : undefined}
          data-disabled={disabled || undefined}
          // Clicking the box, around the tags, types in the input
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              event.preventDefault();
              field.current?.focus();
            }
          }}
        >
          {values.map((value) => (
            <span key={value} className={styles.tag}>
              {labels[value] ?? value}
              <button
                type="button"
                className={styles.remove}
                aria-label={`Remove ${labels[value] ?? value}`}
                disabled={disabled}
                // Keeps focus in the input, as with the options
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => remove(value)}
              >
                ×
              </button>
            </span>
          ))}
          {textInput}
          {name && values.map((value) => <input key={value} type="hidden" name={name} value={value} />)}
        </div>
      ) : (
        <div ref={anchor} className={styles.combobox}>
          {textInput}
        </div>
      )}
      <ul
        ref={list}
        id={listId}
        role="listbox"
        popover="manual"
        aria-label={typeof label === "string" ? label : undefined}
        aria-multiselectable={multiple || undefined}
        className={styles.list}
      >
        {shown.map((option, index) => (
          <li
            key={option.value}
            id={`${controlId}-option-${index}`}
            role="option"
            data-index={index}
            aria-selected={values.includes(option.value)}
            aria-disabled={option.disabled || undefined}
            className={cx(styles.option, multiple && styles.check, index === active && styles.active)}
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
    </Field>
  );
}
