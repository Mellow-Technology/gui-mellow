import { Button } from "gui-mellow/Button";
import { CursorToggle } from "gui-mellow/CursorEffects";
import { Stack } from "gui-mellow/Stack";
import { Table } from "gui-mellow/Table";
import { PaletteToggle } from "gui-mellow/ThemeToggle";
import { Example } from "../lib/Example";
import { palettes } from "../lib/palettes";

export default function CursorEffectsDemo() {
  return (
    <>
      <Example
        title="Try it"
        description="This site renders <CursorEffects /> once, in its layout. Move around, hover the buttons and click; then switch palettes."
      >
        <Stack gap={5}>
          <PaletteToggle palettes={palettes} size="md" />
          <Stack direction="row" gap={3}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost" href="/tokens">
              A link
            </Button>
          </Stack>
          <CursorToggle description="Remembered in this browser. The footer has one too." />
        </Stack>
      </Example>
      <Example title="By palette" description="Each palette picks its effect with the --gm-cursor-effect token.">
        <Table
          columns={["Palette", "Cursor", "Effect"]}
          rows={[
            ["Cloud", "The system's", "A ripple from each click"],
            ["Solarpunk", "The system's", "Pollen by day, fireflies by night; leaves fall when you click"],
            ["Magazine", "A chunky comic arrow; red over links", "Comic starbursts: POW! BAM! ZAP!"],
            ["Cyberpunk", "A targeting reticle, locking on over links", "Trailing brackets with a coordinate readout, locking on to buttons"],
            ["Kawaii", "A magic wand; a heart over links", "Twinkling sparkles, and sparkles and hearts on click"],
          ]}
        />
      </Example>
    </>
  );
}
