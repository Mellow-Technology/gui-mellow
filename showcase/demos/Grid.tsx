import { Grid } from "gui-mellow/Grid";
import { Example } from "../lib/Example";

const cell = { padding: "1.5rem", background: "var(--gm-color-surface-sunken)", borderRadius: "var(--gm-radius-sm)" };

export default function GridDemo() {
  return (
    <>
      <Example title="Default" description="Columns at least 260px wide. Resize the window to see it reflow.">
        <Grid>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={cell}>
              {i + 1}
            </div>
          ))}
        </Grid>
      </Example>
      <Example title="Denser" description='min="140px" gap={3}'>
        <Grid min="140px" gap={3}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={cell}>
              {i + 1}
            </div>
          ))}
        </Grid>
      </Example>
    </>
  );
}
