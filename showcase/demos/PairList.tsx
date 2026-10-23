import { PairList } from "gui-mellow/PairList";
import { Example } from "../lib/Example";

export default function PairListDemo() {
  return (
    <Example title="Problems and answers">
      <PairList
        labels={["The problem", "How we answer it"]}
        items={[
          {
            title: "Cloud bills grow faster than usage",
            body: "Flat costs on hardware you own, shared across the community.",
            tags: ["Cost", "Ownership"],
          },
          {
            title: "Data leaves the region",
            body: "Storage stays on nodes in the places you choose.",
            tags: ["Sovereignty"],
          },
          {
            title: "Nobody to call when it breaks",
            body: "A network of operators who know your setup.",
          },
        ]}
      />
    </Example>
  );
}
