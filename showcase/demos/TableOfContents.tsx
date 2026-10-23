import { TableOfContents } from "gui-mellow/TableOfContents";
import { Example, exampleId } from "../lib/Example";

const titles = ["Contents of this page", "A second section", "A third section"];

export default function TableOfContentsDemo() {
  return (
    <>
      <Example title={titles[0]!} description="Tracks these examples' headings as you scroll.">
        <TableOfContents
          headings={titles.map((text) => ({ id: exampleId(text), text, depth: 2 }))}
          style={{ maxWidth: "16rem" }}
        />
      </Example>
      <Example title={titles[1]!}>
        <div style={{ height: "60vh" }}>Scroll on.</div>
      </Example>
      <Example title={titles[2]!}>
        <div style={{ height: "60vh" }}>The last section wins at the bottom of the page.</div>
      </Example>
    </>
  );
}
