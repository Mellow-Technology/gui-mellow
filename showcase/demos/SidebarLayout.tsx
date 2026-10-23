import { Prose } from "gui-mellow/Prose";
import { SidebarLayout, sidebarLinkClass } from "gui-mellow/SidebarLayout";
import { TableOfContents } from "gui-mellow/TableOfContents";
import { Example } from "../lib/Example";

const pages = ["Overview", "Install", "Configure", "Deploy"];

export default function SidebarLayoutDemo() {
  return (
    <Example
      title="Docs page"
      description="With an `aside` rail on wide screens. Narrow the window to see the sidebar fold away."
      bleed
    >
      <SidebarLayout
        style={{ paddingBlock: "var(--gm-space-5)" }}
        sidebarTitle="Guide"
        sidebar={
          <ul style={{ listStyle: "none", padding: 0 }}>
            {pages.map((page, i) => (
              <li key={page}>
                <a href="#" className={sidebarLinkClass} aria-current={i === 1 ? "page" : undefined}>
                  {page}
                </a>
              </li>
            ))}
          </ul>
        }
        aside={
          <TableOfContents
            headings={[
              { id: "demo-requirements", text: "Requirements", depth: 2 },
              { id: "demo-steps", text: "Steps", depth: 2 },
            ]}
          />
        }
      >
        <Prose>
          <h1>Install</h1>
          <p>Everything you need to get a node running.</p>
          <h2 id="demo-requirements">Requirements</h2>
          <p>A machine with 8GB of memory and a network connection.</p>
          <h2 id="demo-steps">Steps</h2>
          <p>Run the installer and follow the prompts.</p>
        </Prose>
      </SidebarLayout>
    </Example>
  );
}
