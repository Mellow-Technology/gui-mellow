import type { Metadata } from "next";
import { Card } from "gui-mellow/Card";
import { Grid } from "gui-mellow/Grid";
import { Section } from "gui-mellow/Section";
import { groups } from "../../lib/catalog";

export const metadata: Metadata = { title: "Components" };

export default function ComponentsPage() {
  return (
    <>
      {groups.map(({ group, demos }, i) => (
        <Section key={group} title={group} level={i === 0 ? 1 : 2} size="wide">
          <Grid min="220px" gap={4}>
            {demos.map((demo) => (
              <Card key={demo.slug} title={demo.name} href={`/components/${demo.slug}`}>
                {demo.summary}
              </Card>
            ))}
          </Grid>
        </Section>
      ))}
    </>
  );
}
