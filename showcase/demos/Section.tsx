import { Card } from "gui-mellow/Card";
import { Grid } from "gui-mellow/Grid";
import { Section } from "gui-mellow/Section";
import { Example } from "../lib/Example";

export default function SectionDemo() {
  return (
    <>
      <Example title="With eyebrow and description" bleed>
        <Section
          eyebrow="Why it matters"
          title="Your cloud, your control"
          description="Run the services your community depends on, on hardware it owns."
        >
          <p>Section content follows the header.</p>
        </Section>
      </Example>
      <Example title="Centred and wide" bleed>
        <Section title="What people build" align="center" size="wide">
          <Grid min="200px" gap={4}>
            <Card title="Storage">Files and backups.</Card>
            <Card title="Compute">Apps and jobs.</Card>
            <Card title="Edge">Close to users.</Card>
          </Grid>
        </Section>
      </Example>
    </>
  );
}
