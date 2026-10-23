import { Card } from "gui-mellow/Card";
import { Grid } from "gui-mellow/Grid";
import { Example } from "../lib/Example";

export default function CardDemo() {
  return (
    <>
      <Example title="With icons">
        <Grid min="220px" gap={5}>
          <Card title="Painless" icon={<img src="/painless.png" alt="" />}>
            Set up in an afternoon, without a platform team.
          </Card>
          <Card title="Distributed" icon={<img src="/distributed.png" alt="" />}>
            Nodes in many places, working as one.
          </Card>
          <Card title="Bare metal" icon={<img src="/metal.png" alt="" />}>
            Your hardware, at full speed.
          </Card>
        </Grid>
      </Example>
      <Example title="Linked" description="The title is the link; its click area covers the card.">
        <Grid min="220px" gap={5}>
          <Card title="Read the guide" href="#guide" footer="Read more →">
            Everything from first install to production.
          </Card>
          <Card title="See pricing" href="#pricing" footer="Compare plans →">
            Free for communities, fair for everyone else.
          </Card>
        </Grid>
      </Example>
    </>
  );
}
