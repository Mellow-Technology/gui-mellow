import { Grid } from "gui-mellow/Grid";
import { Meter, Stat } from "gui-mellow/Stat";
import type { MeterSegment } from "gui-mellow/Stat";
import { Example } from "../lib/Example";

const workItems: MeterSegment[] = [
  { value: 1, label: "Backlog", tone: "neutral" },
  { value: 3, label: "Todo", tone: "primary" },
  { value: 4, label: "In Progress", tone: "warning" },
  { value: 2, label: "Done", tone: "success" },
  { value: 1, label: "Cancelled", tone: "danger" },
];

export default function StatDemo() {
  return (
    <>
      <Example title="Against a total" description="A meter shows when value and total are both numbers.">
        <Grid min="185px" gap={4}>
          <Stat label="CPU" value={12.4} total={48} unit="cores" precision={1} />
          <Stat label="Memory" value={182} total={512} unit="GB" />
          <Stat label="Healthy pods" value={96} total={97} unit="pods" />
        </Grid>
      </Example>
      <Example title="Pair without a meter">
        <Grid min="185px" gap={4}>
          <Stat label="Network" value={4.2} unit="Rx: TB" total={1.8} totalUnit="Tx: TB" separator="/" precision={1} />
          <Stat label="Uptime" value="99.98%" />
        </Grid>
      </Example>
      <Example title="Meter alone">
        <Meter value={0.62} label="Disk used" />
      </Example>
      <Example
        title="Work items by state"
        description="Given segments, the meter shows what a whole is made of. Hover, tap or tab to a segment for its share; the arrow keys move along the bar."
      >
        <Grid min="280px" gap={4}>
          <Stat label="Work items" value={8} total={11} unit="open" totalUnit="total" segments={workItems} meterHeight={6} legend />
          <Stat
            label="Test results"
            value="1,204"
            unit="tests"
            popover={{ showTotal: true }}
            legend
            segments={[
              { value: 1187, label: "Passed", tone: "success" },
              { value: 3, label: "Failed", tone: "danger" },
              { value: 14, label: "Skipped", tone: "neutral" },
            ]}
          />
        </Grid>
      </Example>
      <Example title="Part of a larger whole" description="With max, what the segments don't use is left as empty track.">
        <Meter
          label="Disk"
          max={512}
          height={6}
          legend
          segments={[
            { value: 182, label: "Photos", color: "#c2569b" },
            { value: 96, label: "Video", tone: "accent" },
            { value: 0, label: "Music", tone: "warning" },
          ]}
        />
      </Example>
      <Example
        title="Inside a link"
        description="Nothing in a link may take focus, so there the bar reads as one summary, and on touch a first tap shows the popover rather than following the link."
      >
        <a href="#work-items" style={{ display: "block" }}>
          <Stat label="Work items" value={8} total={11} unit="open" totalUnit="total" segments={workItems} meterHeight={6} />
        </a>
      </Example>
      <Example title="Without popovers, and empty" description="popover={false} suits dense layouts; a bar with nothing in it is bare track.">
        <Grid min="185px" gap={4}>
          <Meter popover={false} height={6} segments={workItems} label="Work items" />
          <Meter height={6} segments={[{ value: 0, label: "Done" }]} label="Work items" />
        </Grid>
      </Example>
    </>
  );
}
