"use client";

import { useState } from "react";
import { Chip } from "gui-mellow/Chip";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";

const categories = [
  { name: "Cafés", color: "#e8833a" },
  { name: "Parks", color: "#3fa34d" },
  { name: "Museums", color: "#8a5cf5" },
  { name: "Bars", color: "#e2416c" },
];

export default function ChipDemo() {
  const [on, setOn] = useState(new Set(["Parks"]));
  const toggle = (name: string) => {
    const next = new Set(on);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setOn(next);
  };

  return (
    <>
      <Example title="Filter toggles" description="A colour adds a swatch and lights the chip when on.">
        <Stack direction="row" gap={2}>
          {categories.map(({ name, color }) => (
            <Chip key={name} color={color} selected={on.has(name)} onClick={() => toggle(name)}>
              {name}
            </Chip>
          ))}
        </Stack>
      </Example>
      <Example title="Plain">
        <Stack direction="row" gap={2}>
          <Chip selected>Open now</Chip>
          <Chip>Wheelchair access</Chip>
          <Chip disabled>Delivery</Chip>
        </Stack>
      </Example>
    </>
  );
}
