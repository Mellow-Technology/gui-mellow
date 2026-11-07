"use client";

import { useState } from "react";
import { Avatar } from "gui-mellow/Avatar";
import { Button } from "gui-mellow/Button";
import { Popover, type PopoverPlacement } from "gui-mellow/Popover";
import { Stack } from "gui-mellow/Stack";
import { StackedMeter } from "gui-mellow/Stat";
import { toneColor } from "gui-mellow/utils";
import { Example } from "../lib/Example";

const placements: PopoverPlacement[] = [
  "top-start",
  "top",
  "top-end",
  "bottom-start",
  "bottom",
  "bottom-end",
  "left-start",
  "left",
  "left-end",
  "right-start",
  "right",
  "right-end",
];

export default function PopoverDemo() {
  const [open, setOpen] = useState(false);
  const [renamed, setRenamed] = useState("nothing yet");

  return (
    <>
      <Example
        title="Hint"
        description="Opens on hover after a moment, at once on keyboard focus, and on a tap. Escape closes it."
      >
        <Stack direction="row" gap={3}>
          <Popover content="Restarts every pod, one at a time.">
            <Button variant="secondary">Rolling restart</Button>
          </Popover>
          <Popover content="Warnings stop the deploy." placement="bottom" arrow>
            <Button variant="secondary">With an arrow</Button>
          </Popover>
          <Popover content="Tinted with the danger colour." tint={toneColor("danger")} arrow>
            <Button variant="danger">Tinted</Button>
          </Popover>
        </Stack>
      </Example>
      <Example
        title="Rich content"
        description="With interactive, a hover popover can hold links: the pointer can travel into it, and Tab goes from the trigger into it."
      >
        <Popover
          interactive
          placement="bottom-start"
          aria-label="About Ada Moss"
          content={
            <Stack gap={2}>
              <Stack direction="row" gap={3}>
                <Avatar name="Ada Moss" size={40} />
                <span>
                  <strong>Ada Moss</strong>
                  <br />
                  Platform team, Lisbon
                </span>
              </Stack>
              <a href="#rich-content">View profile</a>
            </Stack>
          }
        >
          <Button variant="ghost" icon={<Avatar name="Ada Moss" size={24} />}>
            Ada Moss
          </Button>
        </Popover>
      </Example>
      <Example
        title="Click"
        description="Focus moves inside, and returns to the trigger on Escape. A click outside closes it too."
      >
        <Stack direction="row" gap={4}>
          <Popover
            trigger="click"
            placement="bottom-start"
            aria-label="Project actions"
            content={
              <Stack gap={1}>
                {["Rename", "Duplicate", "Archive"].map((action) => (
                  <Button key={action} variant="ghost" size="sm" onClick={() => setRenamed(action)}>
                    {action}
                  </Button>
                ))}
              </Stack>
            }
          >
            <Button variant="secondary">Actions</Button>
          </Popover>
          <span>Last chosen: {renamed}</span>
        </Stack>
      </Example>
      <Example
        title="Controlled"
        description="With trigger manual, open decides. Nothing outside dismisses it, so a button elsewhere can toggle it."
      >
        <Stack direction="row" gap={4}>
          <Popover
            trigger="manual"
            open={open}
            onOpenChange={setOpen}
            placement="right"
            arrow
            aria-label="New this week"
            content={
              <Stack gap={2}>
                <span>Deploys now roll back on their own.</span>
                <Button size="sm" onClick={() => setOpen(false)}>
                  Got it
                </Button>
              </Stack>
            }
          >
            <Button variant="secondary" onClick={() => setOpen(!open)}>
              {open ? "Hide" : "Show"} what's new
            </Button>
          </Popover>
        </Stack>
      </Example>
      <Example title="Placement" description="Twelve placements, each flipping when there's no room near the window's edge.">
        <Stack direction="row" gap={2}>
          {placements.map((placement) => (
            <Popover key={placement} content={placement} placement={placement} arrow>
              <Button variant="secondary" size="sm">
                {placement}
              </Button>
            </Popover>
          ))}
        </Stack>
      </Example>
      <Example
        title="Stacked meter"
        description="Each segment opens a popover with its label, count and share. The bar is one Tab stop, and the arrow keys step through it."
      >
        <StackedMeter
          label="Issues by state"
          showTotal
          segments={[
            { label: "Done", value: 5, color: toneColor("success") },
            { label: "In Progress", value: 3, color: toneColor("primary") },
            { label: "To Do", value: 3, color: toneColor("accent") },
          ]}
        />
      </Example>
    </>
  );
}
