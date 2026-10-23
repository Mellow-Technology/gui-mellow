import { LogoCloud } from "gui-mellow/LogoCloud";
import { Example } from "../lib/Example";

export default function LogoCloudDemo() {
  return (
    <Example title="Partners" description="Muted until hovered, when linked.">
      <LogoCloud
        logos={[
          { src: "/logos/northwind.svg", alt: "Northwind", href: "#northwind" },
          { src: "/logos/fieldstone.svg", alt: "Fieldstone", href: "#fieldstone" },
          { src: "/logos/lumen.svg", alt: "Lumen Co-op" },
          { src: "/logos/orbit.svg", alt: "Orbit Labs" },
        ]}
      />
    </Example>
  );
}
