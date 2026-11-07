"use client";

import { useState } from "react";
import { Badge } from "gui-mellow/Badge";
import { Button } from "gui-mellow/Button";
import { Card } from "gui-mellow/Card";
import { Chip } from "gui-mellow/Chip";
import { CodeBlock } from "gui-mellow/CodeBlock";
import { Dialog } from "gui-mellow/Dialog";
import { Drawer } from "gui-mellow/Drawer";
import { TextField } from "gui-mellow/Field";
import { Grid } from "gui-mellow/Grid";
import { SegmentedControl } from "gui-mellow/SegmentedControl";
import { Stack } from "gui-mellow/Stack";
import { TagList } from "gui-mellow/Tag";
import { vars } from "gui-mellow/utils";
import { Example } from "../lib/Example";
import { asset } from "../lib/asset";
import styles from "./GlowTracker.module.scss";

const scene = { backgroundImage: `url(${asset("/northern-mountains.jpg")})` };

export default function GlowTrackerDemo() {
  const [panel, setPanel] = useState<"drawer" | "dialog" | null>(null);
  const [chosen, setChosen] = useState(true);
  const close = () => setPanel(null);

  return (
    <>
      <Example
        title="Glass"
        description="frost blurs what's behind it; tile looks the same without the blur, for things that repeat. Either takes a tint."
        bleed
      >
        <div className={styles.scene} style={scene}>
          <div className={styles.frost}>
            <strong>frost</strong>
            <span>Blurred and saturated, with a sheen and a bright top edge.</span>
          </div>
          <div className={styles.tile}>
            <strong>tile</strong>
            <span>No backdrop filter, so it&rsquo;s cheap to repeat.</span>
          </div>
          <div className={styles.tinted}>
            <strong>Tinted</strong>
            <span>The accent colour, passed as $tint.</span>
          </div>
          <div className={styles.frost} style={vars({ "--frost-tint": "var(--gm-color-success)" })}>
            <strong>--frost-tint</strong>
            <span>Set from outside, on this element or around it.</span>
          </div>
        </div>
      </Example>
      <Example
        title="Controls"
        description="Fields, buttons and the like are glass because --gm-color-surface is see-through, and pills use the bead mixin. Over a picture, sit them on a frost panel."
        bleed
      >
        <div className={styles.scene} style={scene}>
          <div className={styles.panel}>
            <strong>Find a trail</strong>
            <Stack gap={4}>
              <TextField label="Search" placeholder="Name or region" />
              <SegmentedControl
                label="Difficulty"
                options={[
                  { value: "easy", label: "Easy" },
                  { value: "hard", label: "Hard" },
                ]}
                defaultValue="easy"
              />
              <Stack direction="row" gap={3}>
                <Button>Search</Button>
                <Button variant="secondary">Clear</Button>
              </Stack>
            </Stack>
          </div>
          <div className={styles.panel}>
            <strong>Pills</strong>
            <Stack gap={4}>
              <Stack direction="row" gap={2}>
                <Badge tone="success">Open</Badge>
                <Badge tone="warning">Icy</Badge>
                <Badge tone="danger">Closed</Badge>
              </Stack>
              <TagList tags={["Lakes", "Forest"]} />
              <Stack direction="row" gap={2}>
                <Chip selected={chosen} onClick={() => setChosen(!chosen)}>
                  Dogs welcome
                </Chip>
                <Chip>Parking</Chip>
              </Stack>
            </Stack>
          </div>
        </div>
      </Example>
      <Example title="Glow" description="Render GlowTracker once, in the root layout, then give cards the glow prop.">
        <Grid min="220px" gap={5}>
          <Card title="Follow the pointer" glow>
            Move across this card.
          </Card>
          <Card title="Tinted" glow style={vars({ "--frost-tint": "var(--gm-color-accent)" })}>
            The glow takes the card&rsquo;s tint.
          </Card>
        </Grid>
      </Example>
      <Example title="Tinted panels" description="Drawer's accent and Dialog's tint colour their glass.">
        <Stack direction="row" gap={3}>
          <Button variant="secondary" onClick={() => setPanel("drawer")}>
            Open a drawer
          </Button>
          <Button variant="secondary" onClick={() => setPanel("dialog")}>
            Open a dialog
          </Button>
        </Stack>
        <Drawer open={panel === "drawer"} onClose={close} title="Forest Park" accent="#3fa34d">
          <p>1,300 acres of trails, museums and lakes in the middle of the city.</p>
        </Drawer>
        <Dialog open={panel === "dialog"} onClose={close} title="Close the trail?" tint="var(--gm-color-danger)">
          Walkers will see a warning until it reopens.
        </Dialog>
      </Example>
      <Example title="In your own components">
        <CodeBlock
          language="scss"
          code={`@use "gui-mellow/styles/mixins" as gm;

.panel { @include gm.frost; }
.sheet { @include gm.frost(var(--gm-color-accent), 80%, 28px); }
.row { @include gm.tile; }
.label { @include gm.bead(var(--gm-color-success)); }`}
        />
      </Example>
    </>
  );
}
