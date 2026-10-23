import { Grid } from "gui-mellow/Grid";
import { MediaCard } from "gui-mellow/MediaCard";
import { Example } from "../lib/Example";
import { asset } from "../lib/asset";

export default function MediaCardDemo() {
  return (
    <Example title="Case studies">
      <Grid min="260px" gap={6}>
        <MediaCard eyebrow="Edge" title="A town's own CDN" media={asset("/edge-infrastructure.jpg")} href="#edge">
          Serving the library's catalogue from three local nodes.
        </MediaCard>
        <MediaCard eyebrow="Storage" title="Archives that last" media={asset("/storage.jpg")} href="#storage">
          Twenty years of newspaper scans, replicated across the county.
        </MediaCard>
        <MediaCard eyebrow="Sovereignty" title="Health data at home" media={asset("/sovereignty.jpg")}>
          Records that never leave the region.
        </MediaCard>
      </Grid>
    </Example>
  );
}
