import { Grid } from "gui-mellow/Grid";
import { Meter, Stat } from "gui-mellow/Stat";
import { Example } from "../lib/Example";

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
    </>
  );
}
