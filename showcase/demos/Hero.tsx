import { Badge } from "gui-mellow/Badge";
import { Button } from "gui-mellow/Button";
import { Hero } from "gui-mellow/Hero";
import { Example } from "../lib/Example";
import { asset } from "../lib/asset";

export default function HeroDemo() {
  return (
    <>
      <Example title="Page banner with image" bleed>
        <Hero level={2} title="Documentation" image={asset("/northern-mountains.jpg")} align="center" />
      </Example>
      <Example title="Home page" description='size="full" fills the screen below the header.' bleed>
        <Hero
          level={2}
          size="full"
          image={asset("/northern-mountains.jpg")}
          badge={
            <Badge dot="success" tone="accent">
              Now accepting members
            </Badge>
          }
          title={
            <>
              Your cloud, <em>your</em> control.
            </>
          }
          subtitle="Infrastructure owned by the communities it serves."
          actions={
            <>
              <Button size="lg">Join</Button>
              <Button size="lg" variant="secondary">
                Learn more
              </Button>
            </>
          }
        />
      </Example>
      <Example title="Plain intro" description="No image: the theme's pattern alone." bleed>
        <Hero level={2} eyebrow="Projects" title="Things we've made" subtitle="Tools, sites and experiments." />
      </Example>
      <Example title="Another pattern" description='pattern="hex" overrides the theme’s.' bleed>
        <Hero level={2} pattern="hex" align="center" title="Built in cells" subtitle="Hexagons, for a change." />
      </Example>
    </>
  );
}
