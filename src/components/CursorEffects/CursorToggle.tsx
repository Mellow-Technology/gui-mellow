"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { getCursorEffectsEnabled, setCursorEffectsEnabled, subscribeToCursorEffects } from "../../theme";
import { Switch } from "../Switch";

export interface CursorToggleProps {
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
}

/**
 * Lets visitors switch CursorEffects off and on, remembering the choice.
 */
export function CursorToggle({ label = "Cursor effects", description, className }: CursorToggleProps) {
  const enabled = useSyncExternalStore(subscribeToCursorEffects, getCursorEffectsEnabled, () => true);

  return (
    <Switch
      label={label}
      description={description}
      className={className}
      checked={enabled}
      onChange={(event) => setCursorEffectsEnabled(event.target.checked)}
    />
  );
}
