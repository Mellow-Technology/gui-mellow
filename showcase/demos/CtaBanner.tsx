import { Button } from "gui-mellow/Button";
import { CtaBanner } from "gui-mellow/CtaBanner";
import { Example } from "../lib/Example";

export default function CtaBannerDemo() {
  return (
    <Example title="Default">
      <CtaBanner
        title="Ready to run your own cloud?"
        actions={
          <>
            <Button size="lg">Join the community</Button>
            <Button size="lg" variant="secondary">
              Talk to us
            </Button>
          </>
        }
      >
        Start with one machine. Grow when you need to.
      </CtaBanner>
    </Example>
  );
}
