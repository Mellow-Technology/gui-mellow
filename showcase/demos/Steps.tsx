import { Steps } from "gui-mellow/Steps";
import { Example } from "../lib/Example";

export default function StepsDemo() {
  return (
    <Example title="Getting started">
      <Steps
        steps={[
          { title: "Get a machine", body: "Anything with 8GB of memory will do to start." },
          { title: "Run the installer", body: "One command sets up the node and joins it to the cluster." },
          { title: "Deploy something", body: "Pick an app from the catalogue, or bring your own." },
        ]}
      />
    </Example>
  );
}
