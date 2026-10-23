import { Stack } from "gui-mellow/Stack";
import { Switch } from "gui-mellow/Switch";
import { Example } from "../lib/Example";

export default function SwitchDemo() {
  return (
    <Example title="Settings" description="Styled checkboxes: no JavaScript needed.">
      <Stack gap={4}>
        <Switch label="Email me about updates" name="updates" defaultChecked />
        <Switch label="Weekly digest" description="A summary every Monday morning." name="digest" />
        <Switch label="Beta features" disabled />
      </Stack>
    </Example>
  );
}
