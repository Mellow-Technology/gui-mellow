"use client";

import { useState } from "react";
import { Button } from "gui-mellow/Button";
import { Drawer } from "gui-mellow/Drawer";
import { Stack } from "gui-mellow/Stack";
import { Table } from "gui-mellow/Table";
import { Example } from "../lib/Example";

export default function DrawerDemo() {
  const [open, setOpen] = useState<"right" | "left" | null>(null);
  const close = () => setOpen(null);

  return (
    <Example title="Side panel" description="Slides over the page without blocking it. Escape closes it.">
      <Stack direction="row" gap={3}>
        <Button onClick={() => setOpen("right")}>Open on the right</Button>
        <Button variant="secondary" onClick={() => setOpen("left")}>
          Open on the left
        </Button>
      </Stack>
      <Drawer
        open={open === "right"}
        onClose={close}
        title="Forest Park"
        subtitle="Park · Open until 10 PM"
        accent="#3fa34d"
      >
        <p>1,300 acres of trails, museums and lakes in the middle of the city.</p>
        <Table
          columns={["", ""]}
          rows={[
            ["Address", "5595 Grand Dr"],
            ["Parking", "Free"],
          ]}
        />
      </Drawer>
      <Drawer open={open === "left"} onClose={close} side="left" title="Filters">
        <p>Anything can go in a drawer.</p>
      </Drawer>
    </Example>
  );
}
