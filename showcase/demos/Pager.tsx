import { Pager } from "gui-mellow/Pager";
import { Example } from "../lib/Example";

export default function PagerDemo() {
  return (
    <>
      <Example title="Both ways">
        <Pager previous={{ href: "#install", title: "Install" }} next={{ href: "#deploy", title: "Deploy" }} />
      </Example>
      <Example title="First page">
        <Pager next={{ href: "#install", title: "Install" }} />
      </Example>
    </>
  );
}
