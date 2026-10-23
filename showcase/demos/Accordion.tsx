import { Accordion, Disclosure } from "gui-mellow/Accordion";
import { Example } from "../lib/Example";

export default function AccordionDemo() {
  return (
    <>
      <Example title="FAQ" description="Built on <details>: no JavaScript, and searchable with find-in-page.">
        <Accordion
          items={[
            { title: "Do I need my own hardware?", content: "No. Start on shared nodes and bring hardware later." },
            { title: "What does it cost?", content: <p>Free for community groups. Otherwise, see pricing.</p> },
            { title: "Can I leave?", content: "Yes. Everything exports in open formats." },
          ]}
        />
      </Example>
      <Example title="Exclusive" description="With a name, opening one item closes the others.">
        <Accordion
          name="exclusive-demo"
          items={[
            { title: "First", content: "Opening another closes this one." },
            { title: "Second", content: "Only one stays open." },
            { title: "Third", content: "Handy for long answers." },
          ]}
        />
      </Example>
      <Example title="Single disclosure">
        <Disclosure title="Show details" open>
          Starts open with the <code>open</code> attribute.
        </Disclosure>
      </Example>
    </>
  );
}
