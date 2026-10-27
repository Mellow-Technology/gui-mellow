import { Badge } from "gui-mellow/Badge";
import { DetailList } from "gui-mellow/DetailList";
import { StatusDot } from "gui-mellow/StatusDot";
import { Example } from "../lib/Example";

export default function DetailListDemo() {
  return (
    <>
      <Example title="An application" description="A label and its value to a row, stacking on narrow screens.">
        <DetailList
          items={[
            { label: "Status", value: <StatusDot tone="success">Running</StatusDot> },
            { label: "Image", value: <code>registry.gitlab.com/team/shop:4f2a9c1</code> },
            { label: "Address", value: <a href="#">https://shop.example.org</a> },
            { label: "Replicas", value: "2" },
            {
              label: "Services",
              value: (
                <>
                  <Badge uppercase={false}>Postgres</Badge> <Badge uppercase={false}>S3 bucket</Badge>
                </>
              ),
            },
          ]}
        />
      </Example>
      <Example title="Empty values" description="Details with nothing to say are left out: the bucket quota below isn't shown.">
        <DetailList
          items={[
            { label: "Bucket", value: "shop-uploads" },
            { label: "Quota", value: undefined },
            { label: "Region", value: "us-central" },
          ]}
        />
      </Example>
    </>
  );
}
