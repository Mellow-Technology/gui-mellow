/**
 * Light and dark mode, and palettes. With no preference stored the page
 * follows the OS and uses the default palette; otherwise `data-theme` and
 * `data-palette` on <html> pin them.
 */

export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "gm-theme";
export const PALETTE_STORAGE_KEY = "gm-palette";

/** The palette in use when none is set. */
export const DEFAULT_PALETTE = "default";

/** Fired on window when the theme or palette changes. */
export const THEME_CHANGE_EVENT = "gm-theme-change";

function isPinned(value: unknown): value is "light" | "dark" {
  return value === "light" || value === "dark";
}

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private windows, blocked cookies); the
    // choice still holds for this page
  }
}

/** The theme pinned on the page, which ThemeScript set from storage. */
export function getThemePreference(): ThemePreference {
  const pinned = document.documentElement.dataset.theme;
  return isPinned(pinned) ? pinned : "system";
}

export function setThemePreference(preference: ThemePreference) {
  const root = document.documentElement;
  if (isPinned(preference)) root.dataset.theme = preference;
  else delete root.dataset.theme;
  write(THEME_STORAGE_KEY, isPinned(preference) ? preference : null);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/** The palette set on the page, which ThemeScript set from storage. */
export function getPalette(): string {
  return document.documentElement.dataset.palette ?? DEFAULT_PALETTE;
}

/**
 * Switch palette. The palette's stylesheet must be loaded, e.g.
 * "gui-mellow/styles/themes/solarpunk.scss".
 */
export function setPalette(palette: string) {
  const root = document.documentElement;
  const isDefault = palette === DEFAULT_PALETTE;
  if (isDefault) delete root.dataset.palette;
  else root.dataset.palette = palette;
  write(PALETTE_STORAGE_KEY, isDefault ? null : palette);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function subscribeToThemePreference(onChange: () => void) {
  // Keep other tabs in step
  const onStorage = (event: StorageEvent) => {
    const stored = read(event.key ?? "");
    if (event.key === THEME_STORAGE_KEY) setThemePreference(isPinned(stored) ? stored : "system");
    if (event.key === PALETTE_STORAGE_KEY) setPalette(stored ?? DEFAULT_PALETTE);
  };
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Applies stored preferences before first paint. Kept tiny and
 * self-contained because it is inlined into every page.
 */
export const themeScript = `try{var d=document.documentElement,t=localStorage.getItem("${THEME_STORAGE_KEY}"),p=localStorage.getItem("${PALETTE_STORAGE_KEY}");if(t==="light"||t==="dark")d.dataset.theme=t;if(p&&/^[a-z0-9-]+$/.test(p))d.dataset.palette=p}catch(e){}`;

/**
 * Cursor effects, which visitors can switch off. They're on unless turned
 * off, wherever the app renders CursorEffects.
 */
export const CURSOR_STORAGE_KEY = "gm-cursor";
export const CURSOR_CHANGE_EVENT = "gm-cursor-change";

export function getCursorEffectsEnabled(): boolean {
  return read(CURSOR_STORAGE_KEY) !== "off";
}

export function setCursorEffectsEnabled(enabled: boolean) {
  write(CURSOR_STORAGE_KEY, enabled ? null : "off");
  window.dispatchEvent(new Event(CURSOR_CHANGE_EVENT));
}

export function subscribeToCursorEffects(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CURSOR_STORAGE_KEY) onChange();
  };
  window.addEventListener(CURSOR_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CURSOR_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
