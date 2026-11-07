import { Card } from "gui-mellow/Card";
import { Grid } from "gui-mellow/Grid";
import { vars } from "gui-mellow/utils";
import { Example } from "../lib/Example";
import { asset } from "../lib/asset";

export default function CardDemo() {
  return (
    <>
      <Example title="With icons">
        <Grid min="220px" gap={5}>
          <Card title="Painless" icon={<img src={asset("/painless.png")} alt="" />}>
            Set up in an afternoon, without a platform team.
          </Card>
          <Card title="Distributed" icon={<img src={asset("/distributed.png")} alt="" />}>
            Nodes in many places, working as one.
          </Card>
          <Card title="Bare metal" icon={<img src={asset("/metal.png")} alt="" />}>
            Your hardware, at full speed.
          </Card>
        </Grid>
      </Example>
      <Example title="Glow" description="A light that follows the pointer, with GlowTracker on the page.">
        <Grid min="220px" gap={5}>
          <Card title="Follow me" glow>
            Move the pointer across this card.
          </Card>
          <Card title="Tinted" glow style={vars({ "--frost-tint": "var(--gm-color-accent)" })}>
            The glow takes the card&rsquo;s tint.
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
