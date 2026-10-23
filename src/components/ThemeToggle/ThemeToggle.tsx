"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import {
  getThemePreference,
  setThemePreference,
  subscribeToThemePreference,
  type ThemePreference,
} from "../../theme";
import { SegmentedControl } from "../SegmentedControl";

export interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
  /** Override the option labels, e.g. with icons. */
  labels?: Partial<Record<ThemePreference, ReactNode>>;
}

const DEFAULT_LABELS: Record<ThemePreference, ReactNode> = {
  light: "Light",
  dark: "Dark",
  system: "Auto",
};

/**
 * Lets visitors pin light or dark mode, or follow their system. Pair with
 * ThemeScript, so a pinned choice applies before the page paints.
 */
export function ThemeToggle({ className, size = "sm", labels }: ThemeToggleProps) {
  const preference = useSyncExternalStore(
    subscribeToThemePreference,
    getThemePreference,
    () => "system" as const,
  );
  const text = { ...DEFAULT_LABELS, ...labels };

  return (
    <SegmentedControl<ThemePreference>
      label="Colour theme"
      size={size}
      className={className}
      value={preference}
      onChange={setThemePreference}
      options={[
        { value: "light", label: text.light },
        { value: "dark", label: text.dark },
        { value: "system", label: text.system },
      ]}
    />
  );
}
