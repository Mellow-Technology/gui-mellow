// What a rich text document may contain. No React or styles here, so a server
// can import it to validate documents against what the editor produces.

import { getSchema, type Attributes, type Extensions, type JSONContent } from "@tiptap/core";
import { Link } from "@tiptap/extension-link";
import { StarterKit } from "@tiptap/starter-kit";

/**
 * TipTap's JSON document tree, the ProseMirror document. This is what's
 * stored, in place of HTML; `null` stands for an empty document.
 */
export type RichTextDocument = JSONContent;

const SAFE_URL = /^(https?:|mailto:)/i;

/** Only web and mail links; anything else (javascript:, data:, …) is refused. */
export function isSafeUrl(url: string) {
  return SAFE_URL.test(url.trim());
}

/**
 * Turns what someone typed into a link target, or `null` if it can't be one.
 * Bare domains get https://, and email addresses mailto:.
 */
export function normaliseUrl(input: string) {
  const text = input.trim();
  if (!text) return null;
  if (isSafeUrl(text)) return text;
  if (/^[^\s@/:]+@[^\s@/]+\.[^\s@/]+$/.test(text)) return `mailto:${text}`;
  // A scheme other than ours (though not the port of `example.com:8080`), or a path
  if (/^[a-z][a-z0-9+.-]*:(?!\d)/i.test(text) || text.startsWith("/")) return null;
  const url = `https://${text}`;
  return URL.canParse(url) ? url : null;
}

/**
 * Links keep only their address. By default the mark also takes `class`,
 * `target`, `rel` and `title` from pasted HTML; these come from the options
 * instead, when rendering.
 */
const AddressOnlyLink = Link.extend({
  addAttributes() {
    const { href } = this.parent?.() as Attributes;
    return { href: href! };
  },
});

/** The schema, shared by the editor and the read-only renderer. */
export const richTextExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: false,
  }),
  AddressOnlyLink.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    isAllowedUri: (url) => isSafeUrl(url),
    HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
  }),
];

/**
 * The ProseMirror schema, to check a document on a server:
 * `richTextSchema.nodeFromJSON(document).check()` throws if it doesn't fit.
 */
export const richTextSchema = getSchema(richTextExtensions);

/** Every node name a document can contain. */
export const richTextNodes = Object.keys(richTextSchema.nodes);

/** Every mark name a document can contain. */
export const richTextMarks = Object.keys(richTextSchema.marks);

/** Nodes that say nothing with no text in them, unlike a rule or a mention. */
const EMPTY_WITHOUT_TEXT = new Set([
  "doc",
  "paragraph",
  "heading",
  "blockquote",
  "bulletList",
  "orderedList",
  "listItem",
  "codeBlock",
  "hardBreak",
]);

/** True when a document has nothing worth keeping, such as blank paragraphs. */
export function isEmptyDocument(document: RichTextDocument | null | undefined): boolean {
  if (!document) return true;
  if (document.type === "text") return !document.text?.trim();
  if (document.content?.length) return document.content.every(isEmptyDocument);
  return EMPTY_WITHOUT_TEXT.has(document.type ?? "");
}

/**
 * A document as it should be stored: `null` when empty, and without the blank
 * paragraphs the editor keeps at the end for the caret.
 */
export function storedDocument(document: RichTextDocument): RichTextDocument | null {
  if (isEmptyDocument(document)) return null;
  const content = [...(document.content ?? [])];
  while (content.at(-1)?.type === "paragraph" && !content.at(-1)?.content?.length) content.pop();
  return { ...document, content };
}
