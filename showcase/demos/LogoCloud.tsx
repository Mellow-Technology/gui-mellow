import { LogoCloud } from "gui-mellow/LogoCloud";
import { Example } from "../lib/Example";
import { asset } from "../lib/asset";

export default function LogoCloudDemo() {
  return (
    <Example title="Partners" description="Muted until hovered, when linked.">
      <LogoCloud
        logos={[
          { src: asset("/logos/northwind.svg"), alt: "Northwind", href: "#northwind" },
          { src: asset("/logos/fieldstone.svg"), alt: "Fieldstone", href: "#fieldstone" },
          { src: asset("/logos/lumen.svg"), alt: "Lumen Co-op" },
          { src: asset("/logos/orbit.svg"), alt: "Orbit Labs" },
        ]}
      />
    </Example>
  );
}
