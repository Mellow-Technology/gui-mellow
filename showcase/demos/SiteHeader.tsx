import Link from "next/link";
import { Button } from "gui-mellow/Button";
import { SiteHeader } from "gui-mellow/SiteHeader";
import { Example } from "../lib/Example";
import { asset } from "../lib/asset";

export default function SiteHeaderDemo() {
  return (
    <Example
      title="Brand, links, actions"
      description="Sticks to the top of the screen. Below 760px the links fold into a menu."
      bleed
    >
      <SiteHeader
        style={{ position: "relative" }}
        brand={
          <Link href="/">
            <img src={asset("/cloud-logo-color.png")} alt="" width={56} height={34} />
            Community Cloud
          </Link>
        }
        items={[
          { href: "/", label: "Home" },
          { href: "/components/site-header", label: "Products" },
          { href: "/tokens", label: "Docs" },
        ]}
        actions={
          <Button size="sm" href="#">
            Join
          </Button>
        }
      />
      <div style={{ height: "8rem" }} />
    </Example>
  );
}
