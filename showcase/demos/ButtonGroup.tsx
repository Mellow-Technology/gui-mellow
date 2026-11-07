"use client";

import { useState } from "react";
import { ButtonGroup } from "gui-mellow/ButtonGroup";
import { SegmentedControl } from "gui-mellow/SegmentedControl";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";
import { PillGuidance } from "../lib/PillGuidance";

export default function ButtonGroupDemo() {
  const [pressed, setPressed] = useState("nothing yet");

  return (
    <>
      <PillGuidance current="ButtonGroup" />
      <Example
        title="Links and buttons"
        description={`Tab reaches each item, arrow keys do nothing, and Enter or Space act. Pressed: ${pressed}`}
      >
        <ButtonGroup
          label="Application actions"
          items={[
            { id: "open", label: "Open ↗", href: "https://example.com", target: "_blank", rel: "noreferrer" },
            { id: "edit", label: "Edit", href: "/components/button" },
            { id: "delete", label: "Delete", tone: "danger", onClick: () => setPressed("Delete") },
          ]}
        />
      </Example>
      <Example title="Sizes">
        <Stack direction="row" gap={3}>
          <ButtonGroup
            label="Small actions"
            size="sm"
            items={[
              { id: "copy", label: "Copy", onClick: () => setPressed("Copy") },
              { id: "share", label: "Share", onClick: () => setPressed("Share") },
            ]}
          />
          <ButtonGroup
            label="Medium actions"
            items={[
              { id: "copy", label: "Copy", onClick: () => setPressed("Copy") },
              { id: "share", label: "Share", onClick: () => setPressed("Share") },
            ]}
          />
        </Stack>
      </Example>
      <Example title="Icons">
        <ButtonGroup
          label="Document actions"
          items={[
            { id: "download", label: "Download", icon: <span aria-hidden>↓</span>, onClick: () => setPressed("Download") },
            { id: "print", label: "Print", icon: <span aria-hidden>⎙</span>, onClick: () => setPressed("Print") },
          ]}
        />
      </Example>
      <Example title="Disabled" description="Skipped by Tab. A disabled link renders as a disabled button.">
        <ButtonGroup
          label="Limited actions"
          items={[
            { id: "edit", label: "Edit", href: "/components/button", disabled: true },
            { id: "restart", label: "Restart", onClick: () => setPressed("Restart") },
            { id: "delete", label: "Delete", tone: "danger", disabled: true, onClick: () => setPressed("Delete") },
          ]}
        />
      </Example>
      <Example title="Beside a SegmentedControl" description="The same pills, without a selection.">
        <Stack direction="row" gap={3}>
          <ButtonGroup
            label="Actions"
            items={[
              { id: "open", label: "Open", onClick: () => setPressed("Open") },
              { id: "edit", label: "Edit", onClick: () => setPressed("Edit") },
            ]}
          />
          <SegmentedControl
            label="View"
            defaultValue="list"
            options={[
              { value: "list", label: "List" },
              { value: "grid", label: "Grid" },
            ]}
          />
        </Stack>
      </Example>
    </>
  );
}
