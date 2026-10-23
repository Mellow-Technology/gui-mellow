import { themeScript } from "../../theme";

/**
 * Applies a visitor's pinned theme and palette before first paint, so there's
 * no flash of the others. Render it in the root layout's <head>, and put
 * `suppressHydrationWarning` on <html>, whose data-theme and data-palette it
 * sets.
 */
export function ThemeScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
