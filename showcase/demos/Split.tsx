import { Button } from "gui-mellow/Button";
import { Split } from "gui-mellow/Split";
import { Example } from "../lib/Example";

export default function SplitDemo() {
  return (
    <>
      <Example title="Media first">
        <Split media="/sovereignty.jpg" mediaAlt="Mountains at dusk">
          <h2>Data sovereignty</h2>
          <p>Keep your data where your community is, under rules it agrees to.</p>
          <Button href="#" variant="secondary">
            Learn more
          </Button>
        </Split>
      </Example>
      <Example title="Reversed">
        <Split media="/storage.jpg" reverse>
          <h2>Storage that scales</h2>
          <p>Add disks as you grow. Nothing to migrate.</p>
        </Split>
      </Example>
    </>
  );
}
