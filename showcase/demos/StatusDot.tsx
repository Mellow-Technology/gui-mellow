import { Stack } from "gui-mellow/Stack";
import { StatusDot } from "gui-mellow/StatusDot";
import { Example } from "../lib/Example";

export default function StatusDotDemo() {
  return (
    <Example title="Service health">
      <Stack gap={3}>
        <StatusDot pulse>All systems operational</StatusDot>
        <StatusDot tone="warning">Elevated latency in eu-west</StatusDot>
        <StatusDot tone="danger">Storage node offline</StatusDot>
      </Stack>
    </Example>
  );
}
