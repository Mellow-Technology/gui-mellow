# gui-mellow

Shared React components for Next.js sites. TypeScript and SCSS modules,
themed by CSS custom properties, light and dark, after
[community-cloud.technology](https://community-cloud.technology/).

- **Light by default.** Most components are server components; only those that
  need state ship JavaScript. Native elements do the work where they can:
  `<details>` accordions, checkbox switches, radio segmented controls.
- **No bundler.** The package ships its `.tsx` and `.scss` sources and the
  consuming Next.js app compiles them.
- **Static-export safe.** No server APIs, no runtime CSS-in-JS, no `next/image`.
  Everything builds with `output: "export"`.

## Using it in an app

```sh
bun add github:Mellow-Technology/gui-mellow sass
```

```ts
// next.config.ts
const config: NextConfig = {
  transpilePackages: ["gui-mellow"],
  // Only needed if you import from the package root (see "Page weight")
  experimental: { optimizePackageImports: ["gui-mellow"] },
};
```

```tsx
// app/layout.tsx
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { ThemeScript } from "gui-mellow/ThemeToggle";
import "gui-mellow/styles.scss";

const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"] });
const body = IBM_Plex_Sans({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Font variables go on <html>, where the tokens that read them live.
    // ThemeScript sets data-theme on <html> before paint, hence the warning suppression.
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Fonts are optional. Without them the tokens fall back to the named families,
then system fonts.

## Theming

Tokens are `--gm-*` custom properties: colours, fonts, type scale, spacing,
radii, shadows, layout widths, motion. The [showcase](#showcase) lists them all.

**Light and dark.** The light theme applies by default and the dark one when
the OS prefers it. `data-theme="light" | "dark"` on `<html>` pins the theme,
which is what `ThemeToggle` does, storing the choice in `localStorage`.
`data-theme` also works on any element, forcing the theme for that subtree,
for example a dark band on a light page.

**Re-theming.** Load the global stylesheet through SCSS with your own values,
merged over the defaults:

```scss
// app/theme.scss — import this instead of "gui-mellow/styles.scss"
@use "gui-mellow/styles/global" with (
  $light: ("color-primary": #e31d2d, "color-accent": #dc1d95),
  $dark: ("color-primary": #ff4b57),
  $tokens: ("radius-md": 4px, "container": 1040px),
);
```

Plain CSS overrides also work. The tokens sit in a cascade layer
(`gm.tokens`), so any unlayered rule wins whatever the load order:
`:root { --gm-radius-md: 4px; }`.

**Palettes.** A palette is a whole alternative theme, with its own light and
dark variants, applied with `data-palette` on `<html>` or any element. It's
independent of `data-theme`, so light, dark and auto still work. Four ship
with the library, each opt-in, so apps that don't import one pay nothing:

| Palette | Look | Font variable on `<html>` |
| --- | --- | --- |
| `solarpunk` | Parchment, leaf green and copper by day; deep forest and sun gold by night. Rounder corners, leaf pattern. | `--font-solar-display` (Fraunces), `--font-solar-body` (Figtree) |
| `magazine` | Pop-art print: cream paper, ink outlines, red, blue and highlighter yellow. Heavy uppercase headlines, panels on hard offset shadows that jump on hover and press flat on click, tilted badges, Ben-Day dots. | `--font-magazine` (Archivo) |
| `cyberpunk` | Neon on black at night, a hazard-yellow HUD by day. Square corners, cut-corner buttons, a coloured notch on panels, red/cyan split headlines, circuit traces, scanlines. | `--font-cyber` (Chakra Petch) |
| `kawaii` | Sakura by day, with a cherry-red bow accent; black, lavender and hot pink by night. Big radii, chunky borders, candy buttons that bounce up on hover and squash down when pressed, cherry-blossom pattern. | `--font-kawaii-display` (Fredoka), `--font-kawaii-body` (Nunito) |

```tsx
import "gui-mellow/styles.scss";
import "gui-mellow/styles/themes/magazine.scss";

// Let visitors switch; ThemeScript restores the choice before paint
<PaletteToggle palettes={[{ value: "default", label: "Cloud" }, { value: "magazine", label: "Pop" }]} />
```

Load their fonts through next/font with `preload: false`, so pages on
another palette don't download them; without them the tokens fall back to
the families by name. To make your own palette, copy one of
`src/styles/themes/*.scss`: `theme.palette(name, $light, $dark, $tokens)`
takes the same maps as the default theme. Use `data-palette="default"` to
return a section to the base theme.

**Making your own theme.** Pick the lightest way that does the job:

1. **A few CSS overrides.** Unlayered rules beat the library's tokens, so
   `:root { --gm-color-primary: #7c3aed; }` in your own stylesheet is
   enough. For a colour that differs in the dark, repeat it under
   `[data-theme="dark"]` and
   `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`.
2. **Re-theme the defaults with SCSS.** `@use "gui-mellow/styles/global"
   with ($light: (…), $dark: (…), $tokens: (…))`, shown above. Name only
   what changes: colours and anything else that differs by scheme go in
   `$light`/`$dark`, everything else in `$tokens`.
3. **Add a palette.** Write a file like the built-in ones in
   `src/styles/themes/`: `@include theme.palette("ocean", $light, $dark,
   $tokens)` inside `@layer gm.tokens`. Import it after the global
   stylesheet, then set `data-palette="ocean"` on `<html>` or offer it in a
   `PaletteToggle`. Tokens you leave out come from the default theme.
4. **Finishing touches.** Fonts through next/font variables with
   `preload: false`, the shape tokens below, `cursor-effect` and custom
   cursors, and a background pattern, built-in or your own tile drawn with
   `patterns.svg-url()`.

The showcase's **Theming** page walks through each with examples, and its
**theme editor** (the sliders button in the header) changes tokens across
the site live, then exports your changes as an SCSS palette or plain CSS.

**Shape tokens.** Beyond colour, type and radii, a few tokens change how
surfaces and controls carry themselves. All are off in the default theme:

| Token | Does | Used by |
| --- | --- | --- |
| `shadow-pop`, `shadow-pop-hover` | A shadow under surfaces: a hard offset block, or a glow | Card, MediaCard, Stat, CtaBanner, Terminal, CodeBlock, Dialog |
| `shadow-control`, `shadow-control-hover` | The same for buttons | Button, Pager |
| `lift`, `press` | Transforms on hover and on click | Surfaces, buttons |
| `clip-control` | A `clip-path` for buttons, such as cut corners | Button |
| `notch` | The size of a triangle of primary colour in a panel's top right | Surfaces, Terminal, CodeBlock, Dialog |
| `display-shadow`, `highlight` | A text shadow on hero and banner titles, and a background behind their `<em>` | Hero, CtaBanner |
| `weight-heading`, `heading-transform` | Heading weight and case | All headings |
| `tilt` | A rotation, for a stuck-on look | Badge |
| `focus-offset` | The focus ring's offset; negative where controls are clipped | Everything focusable |
| `cursor-custom`, `cursor-custom-pointer` | `cursor` values for the page, and for links and buttons | CursorEffects |
| `cursor-effect` | Which effect CursorEffects draws: `ripple`, `fireflies`, `comic`, `reticle`, `sparkle` or `none` | CursorEffects |

**Cursor effects.** Render `<CursorEffects />` once in the root layout to
opt in. Each palette then brings its own cursor and an effect around the
pointer:

- Cloud: a ripple from each click.
- Solarpunk: pollen by day and fireflies by night, rising from the pointer,
  with leaves on click.
- Magazine: a comic arrow, and starbursts on click (POW! BAM!).
- Cyberpunk: a reticle cursor, and brackets that trail it with a coordinate
  readout, then lock on around links and buttons.
- Kawaii: a magic wand (a heart over links), trailing sparkles, and
  sparkles and hearts on click.

The effects are drawn on one fixed canvas that only animates while
something moves, and each effect's code loads only when its palette is in
use. Nothing runs on touch screens. Visitors who prefer reduced motion get
the cursors but no effects. `<CursorToggle />` lets visitors switch it all
off, remembered in `localStorage`. Pass `effect` to use one effect
everywhere, or `enabled={false}` to wire it to a setting of your own.

**Patterns.** Faint background textures (`grid`, `hex`, `dots`, `leaves`,
`halftone`, `circuit` and `petals`) drawn as SVG tiles and painted in
`--gm-pattern-color`, so they follow the theme. Each theme picks one through
the `--gm-pattern` and `--gm-pattern-size` tokens: a grid by default, leaves
in solarpunk, halftone dots in magazine, circuits in cyberpunk, cherry
blossoms in kawaii. `Hero` uses the theme's, or the one named by its
`pattern` prop. Put `<Pattern />`
inside any positioned element to texture it. In your own modules,
`@use "gui-mellow/styles/patterns"` gives `patterns.apply(patterns.$hex)` and
`patterns.svg-url()` for tiles of your own.

**Mixins.** Breakpoints and a few shared patterns are available to your own
modules: `@use "gui-mellow/styles/mixins" as gm;` then `@include gm.below(md)`,
`gm.label`, `gm.surface`, `gm.notch`, `gm.glass`, `gm.visually-hidden`.

**Utilities.** `gui-mellow/utils` (also re-exported from the root) has `cx`
for joining class names, `toneColor(tone)` for a tone's colour variable,
`vars({ "--x": … })` for typed inline custom properties, and `space(step)`.

## Page weight

Each component imports only its own stylesheet, so a page carries CSS for just
the components it renders. Either import per component:

```ts
import { Button } from "gui-mellow/Button";
```

or import from the root and keep `optimizePackageImports` (above). Turbopack
tree-shakes root imports either way. Webpack doesn't: without the option, a
root import pulls every component's CSS onto every page (about 9 KB gzipped
rather than about 2.5 KB).

Measured in a test app with static export: a page with a Button and the theme
toggle loads **2.6 KB gzipped CSS**, including tokens and reset.

## Components

`●` marks client components, which ship JavaScript. Everything else renders on
the server.

| Group | Components | Mostly from |
| --- | --- | --- |
| Layout | Container, Stack, Grid, Section, Split, SidebarLayout ● (toggle only) | community-cloud-hq, code-hq, stl-urgent-dental |
| Page | Hero, CtaBanner, Announcement, Alert, SiteHeader ● (nav only), SiteFooter, Credit | community-cloud-hq, code-hq, stl-urgent-dental |
| Content | Card, MediaCard, FeatureGrid/Feature, Steps, PairList, PostList, Accordion/Disclosure, Testimonial, LogoCloud, Prose, Figure, Table ● (when sortable), Terminal, CodeBlock ● (copy button only), Tabs ● | all four |
| Indicators | Badge, Tag/TagList, StatusDot, Stat/Meter, Avatar, Eyebrow | community-cloud-hq, code-hq |
| Controls | Button, Chip, SegmentedControl, Field (TextField, SelectField), Switch, ThemeToggle ●, PaletteToggle ● | all four |
| Navigation | TableOfContents ●, Pager, Drawer ●, Dialog/ConfirmDialog ● | community-cloud-hq, a-bright-blue-dot |
| Effects | ParticleField ●, Pattern, CursorEffects ●, CursorToggle ● | community-cloud-hq |

A few details worth knowing:

- **Table** columns can be plain headings or `{ label, numeric, align,
  sortable }`. Numeric columns align right in even-width figures. A cell can
  be `{ value, display }` to sort by one thing and show another, such as a
  formatted date. A table with no sortable column renders entirely on the
  server.
- **TextField and SelectField** take `className` for the whole field and
  `controlClassName` for just the input, textarea or select.
- **Badge** sets its text in capitals; `uppercase={false}` keeps the case,
  for IDs and hashes.
- **Dialog** is the native `<dialog>`, so focus trapping, the inert page and
  Escape come from the browser. **ConfirmDialog** replaces `window.confirm`,
  with `destructive` and `busy` states.
- **Tabs** render every panel into the HTML, hidden until chosen, and their
  row scrolls sideways on narrow screens. SegmentedControl scrolls too,
  though Tabs suit more than three or four options.
- **CodeBlock** brings no highlighter. Pass `html` from one that runs at
  build time, such as Shiki, and keep `code` for copying.

Site-specific pieces stayed behind: maps and Hidden Gems, the k8s StatPanel's
data fetching, LocalMed widgets, docs content loading. So did dependencies
that native elements or CSS replace: framer-motion, react-imask,
react-responsive, react-grid-gallery, lodash, classnames.

## Licence and attribution

gui-mellow is [MIT licensed](LICENSE): use it in anything, commercial or
not, and change it however you like. The one condition is attribution: keep
the copyright and licence notice with copies of the code.

**Installing the package does that for you.** `LICENSE` ships in the
package, so an app that depends on gui-mellow carries the notice in its
dependencies.

**On a website**, your build compiles and minifies the library into your
own bundles, and Next.js strips licence comments as it goes. To credit it
where people can see it, any one of these is plenty:

- **A credit line.** `<Credit />` renders "Built with gui-mellow" with a
  link, unstyled so it fits your footer's fine print. `variant="full"` adds
  the copyright and licence.

  ```tsx
  import { Credit } from "gui-mellow/Credit";

  <SiteFooter brand="Your site">
    <p>© 2026 Your Company</p>
    <Credit />
  </SiteFooter>
  ```

- **A credits or third-party licences page.** Add the details from the
  `ATTRIBUTION` export (name, link, copyright, licence), or paste:

  ```text
  gui-mellow — https://github.com/Mellow-Technology/gui-mellow
  Copyright (c) 2026 Code Incarnate Technologies, LLC
  MIT License
  ```

  If you already generate that page from your dependencies, gui-mellow is
  picked up like any other package.

**Copying code into your project**, such as a component or a palette to
start your own theme from, keep a note at the top of the file:

```scss
// Adapted from gui-mellow (https://github.com/Mellow-Technology/gui-mellow)
// Copyright (c) 2026 Code Incarnate Technologies, LLC. MIT License
```

**Forking**, keep `LICENSE` and add your own copyright line under ours.

Themes and components you write yourself, on top of the library, are
entirely yours, under any licence you like.

## Showcase

`showcase/` is a Next.js app that demonstrates every component in every
palette, light and dark, with a guide to theming and a live theme editor.
It builds as a static export, which doubles as a check that the library
exports cleanly.

```sh
bun install
bun dev            # http://localhost:3000
bun run build      # static export to showcase/out
bun start          # serve the export
bun typecheck
```

It imports the library through tsconfig paths, the same specifiers an app
uses, and shares the root's `node_modules` so there's only one copy of React.

## Adding a component

1. `src/components/Name/Name.tsx`, `Name.module.scss` and an `index.ts` that
   re-exports it. Then add it to `src/index.ts`.
2. Use named exports. Extend the native element's props
   (`ComponentProps<"div">`) and pass the rest through, merging `className`.
3. Read only `--gm-*` tokens, never literal colours, and keep selectors to a
   single class where possible so apps can override them. Clickable things
   take `cursor: var(--gm-cursor-pointer)` rather than `pointer`, so themed
   cursors reach them.
4. Stay a server component unless state is unavoidable. If it is, put
   `"use client"` on the smallest piece (see `SiteHeader/SiteNav.tsx`).
5. Add a demo in `showcase/demos/Name.tsx` and list it in
   `showcase/lib/catalog.ts` and `showcase/lib/registry.ts`.

## Browser support

Current evergreen browsers. A few touches are progressive: `::details-content`
animation, `interpolate-size` and `text-wrap: balance` simply don't apply
where unsupported. `color-mix()` is required (Safari 16.2+, Chrome 111+,
Firefox 113+).
