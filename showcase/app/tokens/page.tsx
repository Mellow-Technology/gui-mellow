import type { Metadata } from "next";
import { Button } from "gui-mellow/Button";
import { Card } from "gui-mellow/Card";
import { Section } from "gui-mellow/Section";
import { Stack } from "gui-mellow/Stack";
import { PaletteToggle } from "gui-mellow/ThemeToggle";
import { palettes } from "../../lib/palettes";
import styles from "../../lib/showcase.module.scss";

export const metadata: Metadata = { title: "Tokens" };

const colorGroups = {
  Surfaces: ["bg", "surface", "surface-hover", "surface-sunken", "overlay"],
  Text: ["heading", "text", "text-muted", "text-subtle", "text-faint"],
  Brand: ["primary", "primary-hover", "accent", "link", "link-hover"],
  Status: ["success", "warning", "danger"],
  Borders: ["border-subtle", "border", "border-strong", "border-hover"],
};

const textSizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];
const spaces = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const radii = ["sm", "md", "lg", "pill"];

function ThemeSample({ theme, palette }: { theme: "light" | "dark"; palette: string }) {
  const name = palettes.find((p) => p.value === palette)?.label;
  return (
    <div data-theme={theme} data-palette={palette}>
      <Stack gap={4}>
        <Card title={`${name}, ${theme}`}>
          Forced with <code>data-palette</code> and <code>data-theme</code> on any element.
        </Card>
        <Stack direction="row" gap={3}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </Stack>
      </Stack>
    </div>
  );
}

export default function TokensPage() {
  return (
    <>
      <Section
        level={1}
        title="Tokens"
        description="Custom properties, declared for each palette in light and dark, on the page or any element with data-palette or data-theme. Re-theme with SCSS maps, or override them in unlayered CSS."
        size="wide"
      >
        <Stack gap={5}>
          <Stack direction="row" gap={3}>
            <span>Palette for the whole site:</span>
            <PaletteToggle palettes={palettes} size="md" />
          </Stack>
          <div className={styles.themes}>
            {palettes.flatMap(({ value }) =>
              (["light", "dark"] as const).map((theme) => (
                <ThemeSample key={`${value}-${theme}`} palette={value} theme={theme} />
              )),
            )}
          </div>
        </Stack>
      </Section>

      {Object.entries(colorGroups).map(([group, names]) => (
        <Section key={group} title={group} size="wide">
          <div className={styles.swatches}>
            {names.map((name) => (
              <div key={name} className={styles.swatch}>
                <div className={styles.chip} style={{ background: `var(--gm-color-${name})` }} />
                --gm-color-{name}
              </div>
            ))}
          </div>
        </Section>
      ))}

      <Section title="Type" size="wide">
        {textSizes.map((size) => (
          <div key={size} className={styles.scaleRow}>
            <code>--gm-text-{size}</code>
            <span style={{ fontSize: `var(--gm-text-${size})`, fontFamily: "var(--gm-font-display)" }}>
              Community cloud
            </span>
          </div>
        ))}
        <div className={styles.scaleRow}>
          <code>--gm-font-body</code>
          <span>The quick brown fox jumps over the lazy dog.</span>
        </div>
        <div className={styles.scaleRow}>
          <code>--gm-font-mono</code>
          <span style={{ fontFamily: "var(--gm-font-mono)" }}>npm install gui-mellow</span>
        </div>
      </Section>

      <Section title="Space" size="wide">
        {spaces.map((step) => (
          <div key={step} className={styles.scaleRow}>
            <code>--gm-space-{step}</code>
            <div className={styles.bar} style={{ width: `var(--gm-space-${step})` }} />
          </div>
        ))}
      </Section>

      <Section title="Radii" size="wide">
        <Stack direction="row" gap={5}>
          {radii.map((radius) => (
            <div key={radius} className={styles.swatch}>
              <div className={styles.radius} style={{ borderRadius: `var(--gm-radius-${radius})` }} />
              --gm-radius-{radius}
            </div>
          ))}
        </Stack>
      </Section>
    </>
  );
}
