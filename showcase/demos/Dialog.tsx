"use client";

import { useState } from "react";
import { Button } from "gui-mellow/Button";
import { ConfirmDialog, Dialog } from "gui-mellow/Dialog";
import { TextField } from "gui-mellow/Field";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";

export default function DialogDemo() {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const remove = () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setConfirming(false);
      setDeleted(true);
    }, 900);
  };

  return (
    <>
      <Example
        title="Dialog"
        description="Native <dialog>: focus stays inside, the page behind is inert, and Escape or a click outside closes it."
      >
        <Button onClick={() => setEditing(true)}>Rename project</Button>
        <Dialog
          open={editing}
          onClose={() => setEditing(false)}
          title="Rename project"
          description="The new name shows everywhere the project appears."
          actions={
            <>
              <Button variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={() => setEditing(false)}>Save</Button>
            </>
          }
        >
          <TextField label="Name" defaultValue="community-cloud" />
        </Dialog>
      </Example>
      <Example title="Confirming" description="ConfirmDialog in place of window.confirm, here for a destructive action.">
        <Stack direction="row" gap={4}>
          <Button variant="danger" onClick={() => setConfirming(true)} disabled={deleted}>
            Delete node
          </Button>
          {deleted && (
            <Button variant="ghost" onClick={() => setDeleted(false)}>
              Undo
            </Button>
          )}
        </Stack>
        <ConfirmDialog
          open={confirming}
          title="Delete atlas-01?"
          destructive
          busy={deleting}
          confirmLabel="Delete"
          onConfirm={remove}
          onCancel={() => setConfirming(false)}
        >
          Its workloads will be rescheduled. This can't be undone.
        </ConfirmDialog>
      </Example>
    </>
  );
}
