import type { Metadata } from "next";
import { Alert } from "gui-mellow/Alert";
import { CodeBlock } from "gui-mellow/CodeBlock";
import { Prose } from "gui-mellow/Prose";
import { Section } from "gui-mellow/Section";
import { Stack } from "gui-mellow/Stack";
import { ThemeEditorButton } from "../../lib/ThemeEditor";

export const metadata: Metadata = { title: "Theming" };

const css = `/* app/globals.css, imported after "gui-mellow/styles.scss" */
:root {
  --gm-color-primary: #7c3aed;
  --gm-radius-md: 4px;
}

/* Per scheme, if a colour should differ in the dark */
[data-theme="dark"] { --gm-color-primary: #a78bfa; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --gm-color-primary: #a78bfa; }
}`;

const scssWith = `// app/theme.scss, imported in place of "gui-mellow/styles.scss"
@use "gui-mellow/styles/global" with (
  $light: ("color-primary": #7c3aed, "color-accent": #db2777),
  $dark: ("color-primary": #a78bfa, "color-accent": #f472b6),
  $tokens: (
    "font-display": (var(--font-display, "Inter"), sans-serif),
    "radius-md": 4px,
    "shadow-pop": none,
  ),
);`;

const palette = `// app/themes/ocean.scss
@use "sass:map";
@use "gui-mellow/styles/patterns";
@use "gui-mellow/styles/theme";

@layer gm.tokens, gm.base;

@layer gm.tokens {
  @include theme.palette(
    "ocean",
    $light: (
      "color-bg": #f2f8fb,
      "color-primary": #0e7490,
      "color-accent": #f97316,
      "pattern-color": rgba(14, 116, 144, 0.12),
    ),
    $dark: (
      "color-bg": #04161d,
      "color-primary": #22d3ee,
      "color-on-primary": #04161d,
    ),
    $tokens: (
      "radius-lg": 20px,
      "shadow-pop": 0 5px 0 var(--gm-color-border-strong),
      "lift": translateY(-3px),
      "pattern": map.get(patterns.$hex, image),
      "pattern-size": map.get(patterns.$hex, size),
      "cursor-effect": ripple,
    )
  );
}`;

const layout = `// app/layout.tsx
import "gui-mellow/styles.scss";
import "./themes/ocean.scss";

// Always on:
<html lang="en" data-palette="ocean">

// Or let visitors choose:
<PaletteToggle
  palettes={[
    { value: "default", label: "Classic" },
    { value: "ocean", label: "Ocean" },
  ]}
/>`;

const pattern = `@use "gui-mellow/styles/patterns";

$waves: (
  image: patterns.svg-url(
    "<svg xmlns='http://www.w3.org/2000/svg' width='40' height='20'>" +
      "<path d='M0 10q10-8 20 0t20 0' fill='none' stroke='black'/></svg>"
  ),
  size: 40px 20px,
);

// …then in the palette's $tokens:
"pattern": map.get($waves, image),
"pattern-size": map.get($waves, size),`;

export default function ThemingPage() {
  return (
    <>
      <Section
        level={1}
        title="Theming"
        description="Every colour, font, radius, shadow and motion is a --gm-* token. Change a few with CSS, re-theme the library with SCSS, or add whole palettes alongside the built-in ones."
        size="narrow"
      >
        <Alert
          title="Try it live"
          actions={<ThemeEditorButton>Open the editor</ThemeEditorButton>}
        >
          The theme editor changes tokens across this site as you go, and exports what you made as a palette.
        </Alert>
      </Section>

      <Section title="1. Override a few tokens with CSS" size="narrow">
        <Stack gap={4}>
          <Prose>
            <p>
              The library&rsquo;s tokens live in a cascade layer, so any ordinary rule beats them, whatever
              order the stylesheets load in. Fine for a handful of changes. The <a href="/tokens">tokens
              page</a> lists them all.
            </p>
          </Prose>
          <CodeBlock title="globals.css" language="css" code={css} />
        </Stack>
      </Section>

      <Section title="2. Re-theme the defaults with SCSS" size="narrow">
        <Stack gap={4}>
          <Prose>
            <p>
              Load the global stylesheet through Sass and pass maps of your values. They&rsquo;re merged over
              the defaults, so name only what changes. <code>$light</code> and <code>$dark</code> hold the
              colours and anything else that differs by scheme; <code>$tokens</code> holds the rest.
            </p>
          </Prose>
          <CodeBlock title="app/theme.scss" language="scss" code={scssWith} />
        </Stack>
      </Section>

      <Section title="3. Add a palette" size="narrow">
        <Stack gap={4}>
          <Prose>
            <p>
              A palette is a complete alternative theme, switched with <code>data-palette</code> on{" "}
              <code>&lt;html&gt;</code> or any element, with light and dark variants of its own.{" "}
              <code>theme.palette()</code> takes the same three maps. Anything you leave out falls back to the
              default theme, not to whichever palette was active.
            </p>
          </Prose>
          <CodeBlock title="app/themes/ocean.scss" language="scss" code={palette} />
          <Prose>
            <p>
              Import it after the global stylesheet. Then turn it on for good, or let visitors pick it:{" "}
              <code>ThemeScript</code> applies their choice before the page paints.
            </p>
          </Prose>
          <CodeBlock title="app/layout.tsx" language="tsx" code={layout} />
        </Stack>
      </Section>

      <Section title="4. Finishing touches" size="narrow">
        <Stack gap={4}>
          <Prose>
            <ul>
              <li>
                <strong>Fonts.</strong> Give the font tokens a next/font variable with a fallback by name, e.g.{" "}
                <code>(var(--font-ocean, &quot;Outfit&quot;), sans-serif)</code>, and load the font with{" "}
                <code>preload: false</code> so other palettes don&rsquo;t download it.
              </li>
              <li>
                <strong>Shape.</strong> <code>shadow-pop</code>, <code>shadow-control</code>, <code>lift</code>,{" "}
                <code>press</code>, <code>clip-control</code>, <code>notch</code>, <code>display-shadow</code>,{" "}
                <code>highlight</code>, <code>heading-transform</code> and <code>tilt</code> set how panels and
                buttons carry themselves. The built-in palettes use them heavily; see{" "}
                <code>src/styles/themes</code>.
              </li>
              <li>
                <strong>Cursor.</strong> <code>cursor-effect</code> picks what CursorEffects draws, and{" "}
                <code>cursor-custom</code> and <code>cursor-custom-pointer</code> take any CSS{" "}
                <code>cursor</code> value, such as an SVG made with <code>patterns.svg-url()</code>.
              </li>
              <li>
                <strong>Pattern.</strong> Use a built-in one, or draw your own tile. It&rsquo;s used as a mask,
                so only its shape matters: draw in black.
              </li>
            </ul>
          </Prose>
          <CodeBlock title="A pattern of your own" language="scss" code={pattern} />
        </Stack>
      </Section>
    </>
  );
}
