import { Grid } from "gui-mellow/Grid";
import { Pattern, type PatternName } from "gui-mellow/Pattern";
import { Section } from "gui-mellow/Section";
import { Example } from "../lib/Example";

const names: PatternName[] = ["grid", "hex", "dots", "leaves", "halftone", "circuit", "petals"];

const tile = {
  position: "relative",
  isolation: "isolate",
  display: "grid",
  placeItems: "center",
  height: "180px",
  border: "1px solid var(--gm-color-border)",
  borderRadius: "var(--gm-radius-md)",
  fontFamily: "var(--gm-font-mono)",
  fontSize: "var(--gm-text-sm)",
} as const;

export default function PatternDemo() {
  return (
    <>
      <Example
        title="Patterns"
        description="Coloured by --gm-pattern-color, so each follows the theme and palette."
      >
        <Grid min="200px" gap={4}>
          {names.map((name) => (
            <div key={name} style={tile}>
              <Pattern pattern={name} fade="none" />
              {name}
            </div>
          ))}
        </Grid>
      </Example>
      <Example
        title="The theme's pattern"
        description='pattern="theme", the default, uses --gm-pattern: a grid normally, leaves in solarpunk, halftone dots in magazine, circuits in cyberpunk and petals in kawaii.'
      >
        <div style={tile}>
          <Pattern fade="none" />
          theme
        </div>
      </Example>
      <Example title="Behind a section" description='Fading downwards with fade="bottom".' bleed>
        <div style={{ position: "relative", isolation: "isolate" }}>
          <Pattern pattern="hex" fade="bottom" />
          <Section title="Hexagons" align="center" description="Any positioned element can carry a pattern." />
        </div>
      </Example>
    </>
  );
}
