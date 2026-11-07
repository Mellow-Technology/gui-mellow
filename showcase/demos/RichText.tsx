import { RichText, type RichTextDocument } from "gui-mellow/RichText";
import { Example } from "../lib/Example";

const note: RichTextDocument = {
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Release notes" }] },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "This page ships " },
        { type: "text", marks: [{ type: "bold" }], text: "no editor" },
        { type: "text", text: ": it's rendered on the server, from the " },
        {
          type: "text",
          marks: [{ type: "link", attrs: { href: "https://tiptap.dev/docs" } }],
          text: "same schema",
        },
        { type: "text", text: " the editor writes. " },
        { type: "text", marks: [{ type: "strike" }], text: "Sanitizing" },
        { type: "text", text: " isn't needed, and neither is " },
        { type: "text", marks: [{ type: "code" }], text: "dangerouslySetInnerHTML" },
        { type: "text", text: "." },
      ],
    },
    { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "What changed" }] },
    {
      type: "bulletList",
      content: [
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Documents, not HTML" }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "One set of styles" }] }] },
      ],
    },
    {
      type: "orderedList",
      content: [
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Write" }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Store" }] }] },
      ],
    },
    {
      type: "blockquote",
      content: [{ type: "paragraph", content: [{ type: "text", text: "Store the tree, render what you need from it." }] }],
    },
    {
      type: "codeBlock",
      content: [{ type: "text", text: 'const doc = schema.nodeFromJSON(json);\ndoc.check();' }],
    },
  ],
};

const unsafe: RichTextDocument = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "A stored " },
        {
          type: "text",
          marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
          text: "javascript: link",
        },
        { type: "text", text: " loses its address." },
      ],
    },
  ],
};

export default function RichTextDemo() {
  return (
    <>
      <Example title="A stored document" description="A server component: there's no editor on this page.">
        <RichText value={note} />
      </Example>
      <Example title="Safe by construction" description="Addresses other than http, https and mailto are dropped.">
        <RichText value={unsafe} />
      </Example>
    </>
  );
}
