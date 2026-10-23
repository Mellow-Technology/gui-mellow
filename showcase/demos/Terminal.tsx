import { Terminal } from "gui-mellow/Terminal";
import { Example } from "../lib/Example";

export default function TerminalDemo() {
  return (
    <Example title="Install">
      <Terminal
        label="install"
        lines={[
          "# Join an existing cluster",
          "curl -fsSL https://example.com/install.sh | sh",
          "",
          "cc join \\",
          "  --token $TOKEN  # from the dashboard",
        ]}
      />
    </Example>
  );
}
