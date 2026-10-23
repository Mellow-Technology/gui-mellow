import { useId, type ComponentProps, type ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./SegmentedControl.module.scss";

export interface Segment<T extends string> {
  value: T;
  label: ReactNode;
}

export interface SegmentedControlProps<T extends string>
  extends Omit<ComponentProps<"fieldset">, "onChange" | "defaultValue"> {
  options: Segment<T>[];
  /** Names the group for assistive technology. */
  label: string;
  /** The radio inputs' name, for forms. */
  name?: string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: "sm" | "md";
}

/**
 * Pick one of a few options, shown side by side. Native radio buttons, so
 * it's keyboard accessible and works in forms without JavaScript.
 */
export function SegmentedControl<T extends string>({
  options,
  label,
  name,
  value,
  defaultValue,
  onChange,
  size = "md",
  className,
  ...props
}: SegmentedControlProps<T>) {
  const generatedName = useId();

  return (
    <fieldset className={cx(styles.control, styles[size], className)} {...props}>
      <legend className={styles.legend}>{label}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            type="radio"
            className={styles.input}
            name={name ?? generatedName}
            value={option.value}
            checked={value === undefined ? undefined : value === option.value}
            defaultChecked={defaultValue === undefined ? undefined : defaultValue === option.value}
            onChange={onChange && (() => onChange(option.value))}
          />
          <span className={styles.segment}>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
