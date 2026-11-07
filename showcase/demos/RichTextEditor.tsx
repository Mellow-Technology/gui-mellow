"use client";

import { useRef, useState } from "react";
import { Button } from "gui-mellow/Button";
import { CodeBlock } from "gui-mellow/CodeBlock";
import { RichText } from "gui-mellow/RichText";
import { RichTextEditor, type RichTextDocument, type RichTextEditorHandle } from "gui-mellow/RichTextEditor";
import { Stack } from "gui-mellow/Stack";
import { Example } from "../lib/Example";

const start: RichTextDocument = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Try " },
        { type: "text", marks: [{ type: "bold" }], text: "**bold**" },
        { type: "text", text: ", a line starting with " },
        { type: "text", marks: [{ type: "code" }], text: "- " },
        { type: "text", text: " or " },
        { type: "text", marks: [{ type: "code" }], text: "> " },
        { type: "text", text: ", or ⌘/Ctrl+K for a link." },
      ],
    },
  ],
};

export default function RichTextEditorDemo() {
  const [document, setDocument] = useState<RichTextDocument | null>(start);
  const [comment, setComment] = useState<RichTextDocument | null>(null);
  const [sent, setSent] = useState<RichTextDocument[]>([]);
  const commentEditor = useRef<RichTextEditorHandle>(null);

  function send() {
    if (!comment) return;
    setSent((previous) => [...previous, comment]);
    setComment(null);
    commentEditor.current?.focus();
  }

  return (
    <>
      <Example
        title="Written, and rendered"
        description="The value is the document tree; RichText shows the same one, without an editor."
      >
        <Stack gap={5}>
          <RichTextEditor
            label="Description"
            hint="Pasted text keeps its structure and loses its styling."
            value={document}
            onChange={setDocument}
          />
          <RichText value={document} />
          <CodeBlock code={JSON.stringify(document, null, 2)} language="json" />
        </Stack>
      </Example>
      <Example title="For comments" description="Fewer tools, a smaller start, and ⌘/Ctrl+Enter to send.">
        <Stack gap={4}>
          {sent.map((message, index) => (
            <RichText key={index} value={message} />
          ))}
          <RichTextEditor
            ref={commentEditor}
            label="Comment"
            hideLabel
            placeholder="Leave a comment…"
            minHeight="4rem"
            tools={["bold", "italic", "code", "link"]}
            value={comment}
            onChange={setComment}
            onSubmit={send}
          />
          <div>
            <Button onClick={send} disabled={!comment}>
              Send
            </Button>
          </div>
        </Stack>
      </Example>
      <Example title="States">
        <Stack gap={4}>
          <RichTextEditor label="Summary" required error="A summary is required." />
          <RichTextEditor label="Locked" disabled defaultValue={start} />
        </Stack>
      </Example>
    </>
  );
}
