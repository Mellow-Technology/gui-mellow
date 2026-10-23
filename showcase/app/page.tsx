import { Badge } from "gui-mellow/Badge";
import { Button } from "gui-mellow/Button";
import { Container } from "gui-mellow/Container";
import { CtaBanner } from "gui-mellow/CtaBanner";
import { Feature, FeatureGrid } from "gui-mellow/FeatureGrid";
import { Hero } from "gui-mellow/Hero";
import { ParticleField } from "gui-mellow/ParticleField";
import { Section } from "gui-mellow/Section";
import { Steps } from "gui-mellow/Steps";
import { Terminal } from "gui-mellow/Terminal";
import { demos } from "../lib/catalog";

export default function Home() {
  return (
    <>
      <ParticleField />
      <Hero
        size="full"
        badge={
          <Badge tone="accent" dot="success">
            {demos.length} components
          </Badge>
        }
        title={
          <>
            Small pages, <em>shared</em> parts.
          </>
        }
        subtitle="A deliciously gooey set of react components for Next.js sites: server-rendered by default, styled with SCSS modules, themed by tokens, light and dark. Roasted over a warm campfire until they're just right."
        actions={
          <>
            <Button href="/components" size="lg">
              Browse components
            </Button>
            <Button href="/tokens" size="lg" variant="secondary">
              See the tokens
            </Button>
          </>
        }
      />

      <Section eyebrow="Principles" title="Built to weigh little" size="wide">
        <FeatureGrid>
          <Feature index="01" title="Server first">
            Most components are plain server components. Only the few that need
            state ship JavaScript.
          </Feature>
          <Feature index="02" title="Native where possible">
            Accordions are &lt;details&gt;, switches are checkboxes, segmented
            controls are radios. They work before hydration.
          </Feature>
          <Feature index="03" title="Tokens, not overrides">
            Colours, type, spacing and radii are custom properties. Theme a site by
            redefining them.
          </Feature>
          <Feature index="04" title="Static friendly">
            No server APIs, no runtime CSS. Everything exports with{" "}
            <code>output: &quot;export&quot;</code>.
          </Feature>
        </FeatureGrid>
      </Section>

      <Section eyebrow="Getting started" title="Use it in a Next.js app">
        <Steps
          steps={[
            {
              title: "Install it",
              body: <Terminal lines={["bun add github:Mellow-Technology/gui-mellow sass"]} />,
            },
            {
              title: "Let Next compile it",
              body: <Terminal label="next.config.ts" prompt="" lines={['transpilePackages: ["gui-mellow"]']} />,
            },
            {
              title: "Load the tokens once",
              body: <Terminal label="app/layout.tsx" prompt="" lines={['import "gui-mellow/styles.scss";']} />,
            },
          ]}
        />
      </Section>

      <Container>
        <CtaBanner
          title="Make it yours"
          actions={<Button href="/tokens">Theme tokens</Button>}
          style={{ marginBlock: "var(--gm-space-7) var(--gm-space-9)" }}
        >
          Every colour, font, space and radius is a token. Override one in your
          stylesheet and every component follows.
        </CtaBanner>
      </Container>
    </>
  );
}
