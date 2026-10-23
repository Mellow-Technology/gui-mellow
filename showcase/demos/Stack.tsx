import { Button } from "gui-mellow/Button";
import { Stack } from "gui-mellow/Stack";
import { Tag } from "gui-mellow/Tag";
import { Example } from "../lib/Example";

export default function StackDemo() {
  return (
    <>
      <Example title="Column">
        <Stack gap={3}>
          <Tag>First</Tag>
          <Tag>Second</Tag>
          <Tag>Third</Tag>
        </Stack>
      </Example>
      <Example title="Wrapping row" description="Rows wrap when they run out of room.">
        <Stack direction="row" gap={3}>
          <Button>Get started</Button>
          <Button variant="secondary">Read the docs</Button>
          <Button variant="ghost">Contact us</Button>
        </Stack>
      </Example>
      <Example title="Spread out">
        <Stack direction="row" justify="space-between">
          <span>Left</span>
          <span>Right</span>
        </Stack>
      </Example>
    </>
  );
}
