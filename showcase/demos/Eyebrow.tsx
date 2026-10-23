import { Eyebrow } from "gui-mellow/Eyebrow";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";

export default function EyebrowDemo() {
  return (
    <Example title="Tones">
      <Stack gap={5}>
        <Stack gap={2}>
          <Eyebrow>Muted</Eyebrow>
          <h3>Sits back from the heading</h3>
        </Stack>
        <Stack gap={2}>
          <Eyebrow tone="accent">Accent</Eyebrow>
          <h3>Draws the eye</h3>
        </Stack>
      </Stack>
    </Example>
  );
}
