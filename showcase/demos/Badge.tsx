import { Badge } from "gui-mellow/Badge";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";

export default function BadgeDemo() {
  return (
    <>
      <Example title="Tones">
        <Stack direction="row" gap={3}>
          <Badge>Accent</Badge>
          <Badge tone="primary">Primary</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="neutral">Neutral</Badge>
        </Stack>
      </Example>
      <Example title="With a status dot" description="The dot can take its own tone.">
        <Stack direction="row" gap={3}>
          <Badge dot="success">Now accepting members</Badge>
          <Badge tone="warning" dot>
            Degraded
          </Badge>
        </Stack>
      </Example>
      <Example title="Keeping case" description="uppercase={false} for text whose case matters.">
        <Stack direction="row" gap={3}>
          <Badge tone="neutral" uppercase={false}>
            rev 9f3c2ab
          </Badge>
        </Stack>
      </Example>
    </>
  );
}
