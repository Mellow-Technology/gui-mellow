import { Figure } from "gui-mellow/Figure";
import { Example } from "../lib/Example";
import { asset } from "../lib/asset";

export default function FigureDemo() {
  return (
    <Example title="With caption">
      <Figure
        media={asset("/northern-mountains.jpg")}
        alt="Snow-covered peaks"
        caption="The northern range, where our first nodes went live."
      />
    </Example>
  );
}
