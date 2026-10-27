import { Badge } from "gui-mellow/Badge";
import { Button } from "gui-mellow/Button";
import { DetailList } from "gui-mellow/DetailList";
import { PageHeader } from "gui-mellow/PageHeader";
import { Example } from "../lib/Example";

export default function PageHeaderDemo() {
  return (
    <>
      <Example title="An index page" description="Actions sit at the end of the title's line, and wrap under it when narrow.">
        <PageHeader
          title="Applications"
          description="Everything running in your namespaces, and how it's reached."
          actions={<Button href="#">New application</Button>}
        />
      </Example>
      <Example title="A detail page" description="An eyebrow for the parent, and a link back up to it.">
        <PageHeader
          back={{ href: "#", label: "Applications" }}
          eyebrow="team-website"
          title="shop"
          description="The storefront, and its admin at /manage."
          actions={
            <>
              <Button variant="secondary" href="#">
                Edit
              </Button>
              <Button variant="danger">Delete</Button>
            </>
          }
        >
          <div>
            <Badge tone="success">Running</Badge>
          </div>
        </PageHeader>
        <DetailList
          items={[
            { label: "Image", value: <code>registry.gitlab.com/team/shop:4f2a9c1</code> },
            { label: "Replicas", value: "2 of 2 ready" },
          ]}
        />
      </Example>
    </>
  );
}
