import { Figure } from "gui-mellow/Figure";
import { Example } from "../lib/Example";

export default function FigureDemo() {
  return (
    <Example title="With caption">
      <Figure
        media="/northern-mountains.jpg"
        alt="Snow-covered peaks"
        caption="The northern range, where our first nodes went live."
      />
    </Example>
  );
}
