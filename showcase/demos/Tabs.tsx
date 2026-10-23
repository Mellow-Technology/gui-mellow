import { CodeBlock } from "gui-mellow/CodeBlock";
import { Tabs } from "gui-mellow/Tabs";
import { Example } from "../lib/Example";

const managers = ["bun", "npm", "pnpm", "yarn"] as const;
const install = { bun: "bun add", npm: "npm install", pnpm: "pnpm add", yarn: "yarn add" };

export default function TabsDemo() {
  return (
    <>
      <Example title="Install commands" description="Arrow keys, Home and End move between tabs.">
        <Tabs
          label="Package manager"
          tabs={managers.map((manager) => ({
            value: manager,
            label: manager,
            content: <CodeBlock code={`${install[manager]} github:Mellow-Technology/gui-mellow sass`} />,
          }))}
        />
      </Example>
      <Example title="Many tabs" description="The row scrolls sideways when it's wider than the screen.">
        <Tabs
          label="Node"
          defaultValue="metrics"
          tabs={["Overview", "Metrics", "Workloads", "Events", "Logs", "Settings", "Billing"].map((name) => ({
            value: name.toLowerCase(),
            label: name,
            content: <p>The {name.toLowerCase()} panel.</p>,
            disabled: name === "Billing",
          }))}
        />
      </Example>
    </>
  );
}
