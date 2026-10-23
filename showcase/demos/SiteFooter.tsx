import { SiteFooter } from "gui-mellow/SiteFooter";
import { Example } from "../lib/Example";

export default function SiteFooterDemo() {
  return (
    <Example title="With columns" bleed>
      <SiteFooter
        brand="Community Cloud"
        columns={[
          {
            heading: "Product",
            links: [
              { href: "#products", label: "Products" },
              { href: "#use-cases", label: "Use cases" },
              { href: "#docs", label: "Documentation" },
            ],
          },
          {
            heading: "Company",
            links: [
              { href: "#about", label: "About" },
              { href: "#github", label: "GitHub" },
            ],
          },
        ]}
      >
        © Code Incarnate Technologies, LLC.
      </SiteFooter>
    </Example>
  );
}
