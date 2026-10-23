import { Tag, TagList } from "gui-mellow/Tag";
import { Example } from "../lib/Example";

export default function TagDemo() {
  return (
    <>
      <Example title="Tag list">
        <TagList tags={["kubernetes", "storage", "edge", "self-hosted"]} />
      </Example>
      <Example title="Single tag">
        <Tag>beta</Tag>
      </Example>
    </>
  );
}
