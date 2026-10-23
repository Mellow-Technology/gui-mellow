"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "gui-mellow/Button";
import { CodeBlock } from "gui-mellow/CodeBlock";
import { Drawer } from "gui-mellow/Drawer";
import { TextField } from "gui-mellow/Field";
import { Tabs } from "gui-mellow/Tabs";
import { getPalette, THEME_CHANGE_EVENT } from "gui-mellow/theme";
import styles from "./showcase.module.scss";

/** Fired on window to open the editor, by ThemeEditorButton. */
export const OPEN_EDITOR_EVENT = "showcase:open-theme-editor";
const STORAGE_KEY = "gm-showcase-theme-edits";

type Scheme = "light" | "dark";
type Edits = Record<Scheme | "tokens", Record<string, string>>;

const noEdits: Edits = { light: {}, dark: {}, tokens: {} };

interface Preset {
  label: string;
  values: Record<string, string>;
}

type Control =
  | { kind: "color"; token: string; label: string }
  | { kind: "range"; token: string; label: string; min: number; max: number; step: number; unit: string }
  | { kind: "preset"; label: string; options: Preset[] };

const fonts: [string, string][] = [
  ["Space Grotesk", "var(--font-display), sans-serif"],
  ["IBM Plex Sans", "var(--font-body), sans-serif"],
  ["IBM Plex Mono", "var(--font-mono), monospace"],
  ["Fraunces", "var(--font-solar-display), serif"],
  ["Figtree", "var(--font-solar-body), sans-serif"],
  ["Archivo", "var(--font-magazine), sans-serif"],
  ["Chakra Petch", "var(--font-cyber), sans-serif"],
  ["Fredoka", "var(--font-kawaii-display), sans-serif"],
  ["Nunito", "var(--font-kawaii-body), sans-serif"],
  ["System", "system-ui, sans-serif"],
];

const fontPreset = (label: string, token: string): Control => ({
  kind: "preset",
  label,
  options: fonts.map(([name, value]) => ({ label: name, values: { [token]: value } })),
});

const px = (token: string, label: string, max = 32, step = 1): Control => ({
  kind: "range",
  token,
  label,
  min: 0,
  max,
  step,
  unit: "px",
});

const groups: { title: string; scheme?: boolean; controls: Control[] }[] = [
  {
    title: "Colours",
    scheme: true,
    controls: [
      ["color-bg", "Background"],
      ["color-surface", "Surface"],
      ["color-heading", "Headings"],
      ["color-text", "Text"],
      ["color-text-muted", "Muted text"],
      ["color-primary", "Primary"],
      ["color-on-primary", "On primary"],
      ["color-accent", "Accent"],
      ["color-link", "Links"],
      ["color-border", "Border"],
      ["color-border-strong", "Strong border"],
      ["pattern-color", "Pattern"],
    ].map(([token, label]) => ({ kind: "color", token: token!, label: label! })),
  },
  {
    title: "Type",
    controls: [
      fontPreset("Display font", "font-display"),
      fontPreset("Body font", "font-body"),
      { kind: "range", token: "weight-heading", label: "Heading weight", min: 300, max: 900, step: 100, unit: "" },
      { kind: "range", token: "tracking-tight", label: "Heading tracking", min: -0.05, max: 0.05, step: 0.005, unit: "em" },
      {
        kind: "preset",
        label: "Heading case",
        options: [
          { label: "As written", values: { "heading-transform": "none" } },
          { label: "Capitals", values: { "heading-transform": "uppercase" } },
        ],
      },
    ],
  },
  {
    title: "Shape",
    controls: [
      px("radius-sm", "Small radius"),
      px("radius-md", "Medium radius"),
      px("radius-lg", "Large radius", 40),
      px("border-width", "Border width", 4, 0.5),
      px("notch", "Corner notch", 24),
      { kind: "range", token: "tilt", label: "Badge tilt", min: -6, max: 6, step: 0.5, unit: "deg" },
      {
        kind: "preset",
        label: "Button corners",
        options: [
          { label: "As the radius", values: { "clip-control": "none" } },
          {
            label: "Cut",
            values: {
              "clip-control":
                "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
            },
          },
        ],
      },
    ],
  },
  {
    title: "Depth and motion",
    controls: [
      {
        kind: "preset",
        label: "Panel shadow",
        options: [
          { label: "None", values: { "shadow-pop": "none", "shadow-pop-hover": "none" } },
          {
            label: "Soft",
            values: {
              "shadow-pop": "0 2px 6px rgb(0 0 0 / 0.06)",
              "shadow-pop-hover": "0 14px 32px rgb(0 0 0 / 0.14)",
            },
          },
          {
            label: "Offset ink",
            values: {
              "shadow-pop": "5px 5px 0 var(--gm-color-heading)",
              "shadow-pop-hover": "8px 8px 0 var(--gm-color-primary)",
            },
          },
          {
            label: "Puffy",
            values: {
              "shadow-pop": "0 5px 0 var(--gm-color-border-strong)",
              "shadow-pop-hover": "0 8px 0 var(--gm-color-primary)",
            },
          },
          {
            label: "Glow",
            values: {
              "shadow-pop": "none",
              "shadow-pop-hover":
                "0 0 0 1px var(--gm-color-primary), 0 0 28px color-mix(in srgb, var(--gm-color-primary) 35%, transparent)",
            },
          },
        ],
      },
      {
        kind: "preset",
        label: "Button shadow",
        options: [
          { label: "None", values: { "shadow-control": "none", "shadow-control-hover": "none" } },
          {
            label: "Offset ink",
            values: {
              "shadow-control": "3px 3px 0 var(--gm-color-heading)",
              "shadow-control-hover": "5px 5px 0 var(--gm-color-heading)",
            },
          },
          {
            label: "Candy",
            values: {
              "shadow-control": "0 4px 0 color-mix(in srgb, var(--gm-color-primary) 60%, black)",
              "shadow-control-hover": "0 6px 0 color-mix(in srgb, var(--gm-color-primary) 60%, black)",
            },
          },
        ],
      },
      {
        kind: "preset",
        label: "Hover and press",
        options: [
          { label: "Still", values: { lift: "none", press: "none" } },
          { label: "Rise", values: { lift: "translateY(-3px)", press: "translateY(3px)" } },
          { label: "Jump", values: { lift: "translate(-3px, -3px)", press: "translate(3px, 3px)" } },
        ],
      },
      {
        kind: "preset",
        label: "Title effect",
        options: [
          { label: "None", values: { "display-shadow": "none", highlight: "none" } },
          {
            label: "Offset",
            values: {
              "display-shadow": "0.05em 0.05em 0 var(--gm-color-accent)",
              highlight: "none",
            },
          },
          {
            label: "Marker",
            values: {
              "display-shadow": "none",
              highlight:
                "linear-gradient(transparent 58%, color-mix(in srgb, var(--gm-color-accent) 30%, transparent) 58%)",
            },
          },
          {
            label: "Glitch",
            values: {
              "display-shadow": "-0.035em 0 0 #ff2a6d, 0.035em 0 0 #00f0ff",
              highlight: "none",
            },
          },
        ],
      },
    ],
  },
  {
    title: "Cursor",
    controls: [
      {
        kind: "preset",
        label: "Cursor effect",
        options: ["none", "ripple", "fireflies", "comic", "reticle", "sparkle"].map((effect) => ({
          label: effect[0]!.toUpperCase() + effect.slice(1),
          values: { "cursor-effect": effect },
        })),
      },
    ],
  },
];

const allTokens = groups.flatMap((group) =>
  group.controls.flatMap((control) =>
    control.kind === "preset" ? control.options.flatMap((option) => Object.keys(option.values)) : [control.token],
  ),
);

let probe: CanvasRenderingContext2D | null | undefined;

/** Any CSS colour as #rrggbb, for <input type="color">. Alpha is dropped. */
function toHex(color: string) {
  probe ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!probe) return "#000000";
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = "#000000";
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0] = probe.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function declarations(values: Record<string, string>, indent = "  ") {
  return Object.entries(values)
    .map(([token, value]) => `${indent}--gm-${token}: ${value};`)
    .join("\n");
}

/** The edits as unlayered CSS, which outranks the library's layered tokens. */
function toCss(edits: Edits) {
  const blocks: string[] = [];
  if (Object.keys(edits.tokens).length) blocks.push(`:root {\n${declarations(edits.tokens)}\n}`);
  for (const [scheme, other] of [
    ["light", "dark"],
    ["dark", "light"],
  ] as const) {
    const values = edits[scheme];
    if (!Object.keys(values).length) continue;
    blocks.push(
      `@media (prefers-color-scheme: ${scheme}) {\n  :root:not([data-theme="${other}"]) {\n${declarations(values, "    ")}\n  }\n}`,
      `:root[data-theme="${scheme}"] {\n${declarations(values)}\n}`,
    );
  }
  return blocks.join("\n\n");
}

/** Whether a value has a comma outside brackets, so needs parentheses in a Sass map. */
function hasTopLevelComma(value: string) {
  let depth = 0;
  for (const char of value) {
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === "," && depth === 0) return true;
  }
  return false;
}

function sassMap(values: Record<string, string>) {
  const entries = Object.entries(values).map(
    ([token, value]) => `      "${token}": ${hasTopLevelComma(value) ? `(${value})` : value},`,
  );
  return entries.length ? `(\n${entries.join("\n")}\n    )` : "()";
}

function toScss(edits: Edits, name: string, palette: string) {
  return `// ${name}.scss — import after "gui-mellow/styles.scss", then set
// data-palette="${name}". Edited over the ${palette === "default" ? "default" : palette} palette;
// tokens you didn't change come from the default theme.
@use "gui-mellow/styles/theme";

@layer gm.tokens, gm.base;

@layer gm.tokens {
  @include theme.palette(
    "${name}",
    $light: ${sassMap(edits.light)},
    $dark: ${sassMap(edits.dark)},
    $tokens: ${sassMap(edits.tokens)}
  );
}`;
}

function readStored(): Edits {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Edits | null;
    return stored ? { ...noEdits, ...stored } : noEdits;
  } catch {
    return noEdits;
  }
}

/**
 * A panel for trying out theme tokens on the live site. Edits are written
 * into a stylesheet of their own, kept for the visit in localStorage, and
 * can be exported as a palette.
 */
export function ThemeEditor() {
  const [open, setOpen] = useState(false);
  const [edits, setEdits] = useState<Edits>(noEdits);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("my-theme");
  // The live values, re-read whenever the theme changes
  const [computed, setComputed] = useState<{ scheme: Scheme; palette: string; values: Record<string, string> }>({
    scheme: "light",
    palette: "default",
    values: {},
  });

  useEffect(() => {
    setEdits(readStored());
    setLoaded(true);
    const onOpen = () => setOpen(true);
    addEventListener(OPEN_EDITOR_EVENT, onOpen);
    return () => removeEventListener(OPEN_EDITOR_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      setComputed({
        scheme: style.colorScheme === "dark" ? "dark" : "light",
        palette: getPalette(),
        values: Object.fromEntries(allTokens.map((token) => [token, style.getPropertyValue(`--gm-${token}`).trim()])),
      });
    };
    read();
    const dark = matchMedia("(prefers-color-scheme: dark)");
    addEventListener(THEME_CHANGE_EVENT, read);
    dark.addEventListener("change", read);
    return () => {
      removeEventListener(THEME_CHANGE_EVENT, read);
      dark.removeEventListener("change", read);
    };
  }, []);

  const css = useMemo(() => toCss(edits), [edits]);

  // Save, and tell theme-aware components (particles, cursor effects) to
  // re-read the tokens once the new stylesheet is in place
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
    } catch {
      // Edits still apply for this page
    }
    dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, [css, loaded, edits]);

  const { scheme } = computed;
  const bucketOf = (scheme: Scheme, isScheme?: boolean) => (isScheme ? scheme : "tokens");

  const set = (bucket: keyof Edits, values: Record<string, string | undefined>) =>
    setEdits((current) => {
      const next = { ...current[bucket] };
      for (const [token, value] of Object.entries(values)) {
        if (value === undefined) delete next[token];
        else next[token] = value;
      }
      return { ...current, [bucket]: next };
    });

  const changed = Object.values(edits).some((values) => Object.keys(values).length > 0);

  const renderControl = (control: Control, bucket: keyof Edits): ReactNode => {
    const values = edits[bucket];

    if (control.kind === "preset") {
      const chosen = control.options.findIndex((option) =>
        Object.entries(option.values).every(([token, value]) => values[token] === value),
      );
      const tokens = [...new Set(control.options.flatMap((option) => Object.keys(option.values)))];
      return (
        <label key={control.label} className={styles.editorRow}>
          <span>{control.label}</span>
          <select
            className={styles.editorSelect}
            value={chosen}
            onChange={(event) => {
              const option = control.options[Number(event.target.value)];
              set(
                bucket,
                option
                  ? option.values
                  : Object.fromEntries(tokens.map((token) => [token, undefined])),
              );
            }}
          >
            <option value={-1}>Theme&rsquo;s</option>
            {control.options.map((option, i) => (
              <option key={option.label} value={i}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      );
    }

    const edited = values[control.token];
    const value = edited ?? computed.values[control.token] ?? "";
    const reset = edited !== undefined && (
      <button
        type="button"
        className={styles.editorReset}
        onClick={() => set(bucket, { [control.token]: undefined })}
        aria-label={`Reset ${control.label}`}
        title="Reset"
      >
        ↺
      </button>
    );

    if (control.kind === "color") {
      return (
        <div key={control.token} className={styles.editorRow}>
          <span>
            {control.label}
            {reset}
          </span>
          <span className={styles.editorColor}>
            {/* The native picker can't show transparency, so it sits invisibly
                over a swatch of the real colour */}
            <span className={styles.editorSwatch} style={{ "--swatch": value } as CSSProperties}>
              <input
                type="color"
                aria-label={control.label}
                value={value ? toHex(value) : "#000000"}
                onChange={(event) => set(bucket, { [control.token]: event.target.value })}
              />
            </span>
            <input
              // Re-created when the value changes elsewhere; applied on Enter or blur
              key={value}
              className={styles.editorText}
              defaultValue={value}
              aria-label={`${control.label}, as CSS`}
              spellCheck={false}
              onBlur={(event) => {
                const text = event.target.value.trim();
                if (text && text !== value) set(bucket, { [control.token]: text });
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
            />
          </span>
        </div>
      );
    }

    const number = Number.parseFloat(value);
    return (
      <label key={control.token} className={styles.editorRow}>
        <span>
          {control.label}
          {reset}
        </span>
        <span className={styles.editorRange}>
          <input
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={Number.isFinite(number) ? number : control.min}
            onChange={(event) => set(bucket, { [control.token]: `${event.target.value}${control.unit}` })}
          />
          <output>{value}</output>
        </span>
      </label>
    );
  };

  return (
    <>
      {css && <style>{css}</style>}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Theme editor"
        subtitle={`${computed.palette === "default" ? "Cloud" : computed.palette}, ${scheme}`}
        className={styles.editor}
      >
        <p className={styles.editorIntro}>
          Changes apply to the whole site as you make them. Colours belong to the current scheme: switch
          light and dark to set both.
        </p>
        {groups.map((group) => (
          <section key={group.title} className={styles.editorGroup}>
            <h3 className={styles.editorHeading}>
              {group.scheme ? `${group.title}, ${scheme}` : group.title}
            </h3>
            {group.controls.map((control) => renderControl(control, bucketOf(scheme, group.scheme)))}
          </section>
        ))}
        <section className={styles.editorGroup}>
          <h3 className={styles.editorHeading}>Export</h3>
          <TextField
            label="Palette name"
            value={name}
            onChange={(event) => setName(event.target.value.replace(/[^a-z0-9-]/g, "") || "my-theme")}
            controlClassName={styles.mono}
          />
          <Tabs
            label="Format"
            tabs={[
              {
                value: "scss",
                label: "SCSS palette",
                content: <CodeBlock title={`${name}.scss`} language="scss" code={toScss(edits, name, computed.palette)} />,
              },
              {
                value: "css",
                label: "CSS overrides",
                content: <CodeBlock title="overrides.css" language="css" code={css || "/* No changes yet */"} />,
              },
            ]}
          />
        </section>
        <Button variant="secondary" size="sm" disabled={!changed} onClick={() => setEdits(noEdits)}>
          Reset everything
        </Button>
      </Drawer>
    </>
  );
}

/** Opens the theme editor. */
export function ThemeEditorButton({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <Button
      variant={children ? "primary" : "ghost"}
      size="sm"
      className={className}
      aria-label={children ? undefined : "Edit theme"}
      title="Edit theme"
      onClick={() => dispatchEvent(new Event(OPEN_EDITOR_EVENT))}
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M2 4h7M13 4h1M2 12h2M8 12h6" strokeLinecap="round" />
          <circle cx="11" cy="4" r="2" />
          <circle cx="6" cy="12" r="2" />
        </svg>
      }
    >
      {children}
    </Button>
  );
}
