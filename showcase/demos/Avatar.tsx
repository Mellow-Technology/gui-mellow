import { Avatar } from "gui-mellow/Avatar";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";

export default function AvatarDemo() {
  return (
    <Example title="Image and initials">
      <Stack direction="row" gap={4}>
        <Avatar name="Northern Range" src="/northern-mountains.jpg" size={96} />
        <Avatar name="Kai Ortega" size={64} />
        <Avatar name="Robin" />
        <Avatar name="Ada Lovelace" size={32} />
      </Stack>
    </Example>
  );
}
