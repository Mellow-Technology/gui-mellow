import { Button } from "gui-mellow/Button";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";

export default function ButtonDemo() {
  return (
    <>
      <Example title="Variants">
        <Stack direction="row" gap={3}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Delete</Button>
        </Stack>
      </Example>
      <Example title="Sizes">
        <Stack direction="row" gap={3}>
          <Button size="sm">Small</Button>
          <Button>Medium</Button>
          <Button size="lg">Large</Button>
        </Stack>
      </Example>
      <Example title="States">
        <Stack direction="row" gap={3}>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
          <Button icon={<span aria-hidden>↓</span>} variant="secondary">
            With icon
          </Button>
        </Stack>
      </Example>
      <Example title="As a link" description="Given an href, it renders a Next.js Link.">
        <Button href="/components/card" variant="secondary">
          Go to Card →
        </Button>
      </Example>
    </>
  );
}
