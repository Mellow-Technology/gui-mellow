import Link from "next/link";
import { Prose } from "gui-mellow/Prose";
import { Example } from "./Example";

const pages = {
  ButtonGroup: "/components/button-group",
  SegmentedControl: "/components/segmented-control",
};

/**
 * Which of two lookalikes to use, on both of their pages. Each page links
 * to the other.
 */
export function PillGuidance({ current }: { current: keyof typeof pages }) {
  const name = (component: keyof typeof pages) =>
    component === current ? <strong>{component}</strong> : <Link href={pages[component]}>{component}</Link>;

  return (
    <Example title="ButtonGroup or SegmentedControl?" description="The two look the same and do different things.">
      <Prose>
        <ul>
          <li>
            {name("ButtonGroup")} is a collection of related <em>actions</em>: each one does something (navigate, open
            a dialog, run a command) when pressed. Nothing is current. For example, Open, Edit and Delete on an
            application.
          </li>
          <li>
            {name("SegmentedControl")} is for switching between <em>options</em>: exactly one is selected, the choice
            persists, and moving between them (including with arrow keys) is safe. For example, picking an image
            source, or switching between views.
          </li>
        </ul>
        <p>
          The rule of thumb: if picking an item again does nothing new, and something is always selected, it&apos;s a
          SegmentedControl; otherwise it&apos;s a ButtonGroup.
        </p>
      </Prose>
    </Example>
  );
}
