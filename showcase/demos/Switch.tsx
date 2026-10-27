import { Stack } from "gui-mellow/Stack";
import { Switch } from "gui-mellow/Switch";
import { Table } from "gui-mellow/Table";
import { Example } from "../lib/Example";

export default function SwitchDemo() {
  return (
    <>
      <Example title="Settings" description="Styled checkboxes: no JavaScript needed.">
        <Stack gap={4}>
          <Switch label="Email me about updates" name="updates" defaultChecked />
          <Switch label="Weekly digest" description="A summary every Monday morning." name="digest" />
          <Switch label="Beta features" disabled />
        </Stack>
      </Example>
      <Example
        title="Without a visible label"
        description="hideLabel, for when a column heading already says what the switch is. The label is still read by screen readers."
      >
        <Table
          columns={["Namespace", "Postgres", "S3 buckets"]}
          rows={[
            [
              "team-website",
              <Switch key="pg" label="Postgres for team-website" hideLabel defaultChecked />,
              <Switch key="s3" label="S3 buckets for team-website" hideLabel />,
            ],
            [
              "analytics",
              <Switch key="pg" label="Postgres for analytics" hideLabel defaultChecked />,
              <Switch key="s3" label="S3 buckets for analytics" hideLabel defaultChecked />,
            ],
          ]}
        />
      </Example>
    </>
  );
}
