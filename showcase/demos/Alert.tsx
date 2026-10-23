import { Alert } from "gui-mellow/Alert";
import { Button } from "gui-mellow/Button";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";

export default function AlertDemo() {
  return (
    <>
      <Example title="Tones">
        <Stack gap={4}>
          <Alert title="Heads up">Maintenance is scheduled for Sunday at 02:00 UTC.</Alert>
          <Alert tone="success" title="Saved">Your changes are live.</Alert>
          <Alert tone="warning" title="Quota at 90%">New deployments will queue once it's full.</Alert>
          <Alert tone="danger" title="Build failed">The image couldn't be pulled from the registry.</Alert>
        </Stack>
      </Example>
      <Example title="With an icon and actions" description='Pass role="status" or role="alert" when it appears in response to something.'>
        <Alert
          tone="warning"
          icon="⚠"
          title="This node is draining"
          actions={
            <Button size="sm" variant="secondary">
              Cancel drain
            </Button>
          }
        >
          Workloads are moving to other nodes. It'll be safe to remove in about 4 minutes.
        </Alert>
      </Example>
      <Example title="Text only">
        <Alert tone="neutral">Times are shown in your local time zone.</Alert>
      </Example>
    </>
  );
}
