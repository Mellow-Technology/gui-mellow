"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_PALETTE,
  getPalette,
  setPalette,
  subscribeToThemePreference,
} from "../../theme";
import { SegmentedControl, type Segment } from "../SegmentedControl";

export interface PaletteToggleProps {
  /** The palettes to offer. Use "default" for the base theme. */
  palettes: Segment<string>[];
  className?: string;
  size?: "sm" | "md";
}

/**
 * Lets visitors switch between palettes, remembering the choice. Each
 * palette's stylesheet must be loaded; pair with ThemeScript to apply the
 * choice before the page paints.
 */
export function PaletteToggle({ palettes, className, size = "sm" }: PaletteToggleProps) {
  const palette = useSyncExternalStore(
    subscribeToThemePreference,
    getPalette,
    () => DEFAULT_PALETTE,
  );

  return (
    <SegmentedControl
      label="Palette"
      size={size}
      className={className}
      value={palette}
      onChange={setPalette}
      options={palettes}
    />
  );
}
