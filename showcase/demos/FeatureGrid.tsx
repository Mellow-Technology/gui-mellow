import { Feature, FeatureGrid } from "gui-mellow/FeatureGrid";
import { Example } from "../lib/Example";

const services = [
  ["Development", "Websites, apps and the tooling around them."],
  ["Performance", "Find what's slow, and make it fast."],
  ["Infrastructure", "Servers, networks and clusters that stay up."],
  ["Operations", "Deploys, monitoring and on-call that don't hurt."],
  ["User experience", "Interfaces people understand the first time."],
  ["Tech meets business", "Turning plans into systems, and back again."],
];

export default function FeatureGridDemo() {
  return (
    <>
      <Example title="Numbered features">
        <FeatureGrid>
          {services.map(([title, body], i) => (
            <Feature key={title} index={String(i + 1).padStart(2, "0")} title={title}>
              {body}
            </Feature>
          ))}
        </FeatureGrid>
      </Example>
      <Example title="Single column list" description='min="100%" gives one item per row.'>
        <FeatureGrid min="100%">
          <Feature index="01">Host a community website</Feature>
          <Feature index="02">Back up a school's files</Feature>
          <Feature index="03">Run a local chat server</Feature>
        </FeatureGrid>
      </Example>
    </>
  );
}
