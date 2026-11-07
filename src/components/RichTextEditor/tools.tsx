import type { ReactNode } from "react";
import type { ChainedCommands, Editor } from "@tiptap/core";

export type RichTextTool =
  | "bold"
  | "italic"
  | "strike"
  | "code"
  | "heading"
  | "subheading"
  | "bulletList"
  | "orderedList"
  | "blockquote"
  | "codeBlock"
  | "link";

/** The toolbar, unless given `tools`. */
export const defaultRichTextTools: RichTextTool[] = [
  "bold",
  "italic",
  "strike",
  "code",
  "heading",
  "subheading",
  "bulletList",
  "orderedList",
  "blockquote",
  "codeBlock",
  "link",
];

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

interface ToolDefinition {
  label: string;
  /** In aria-keyshortcuts' terms, with `Mod` for ⌘ or Ctrl. */
  shortcut?: string;
  icon: ReactNode;
  active: (editor: Editor) => boolean;
  available: (editor: Editor) => boolean;
  /** Applies the tool. The link tool opens its panel instead. */
  apply?: (chain: ChainedCommands) => ChainedCommands;
}

export const toolDefinitions: Record<RichTextTool, ToolDefinition> = {
  bold: {
    label: "Bold",
    shortcut: "Mod+B",
    icon: <strong>B</strong>,
    active: (editor) => editor.isActive("bold"),
    available: (editor) => editor.can().toggleBold(),
    apply: (chain) => chain.toggleBold(),
  },
  italic: {
    label: "Italic",
    shortcut: "Mod+I",
    icon: <em>I</em>,
    active: (editor) => editor.isActive("italic"),
    available: (editor) => editor.can().toggleItalic(),
    apply: (chain) => chain.toggleItalic(),
  },
  strike: {
    label: "Strikethrough",
    shortcut: "Mod+Shift+S",
    icon: <s>S</s>,
    active: (editor) => editor.isActive("strike"),
    available: (editor) => editor.can().toggleStrike(),
    apply: (chain) => chain.toggleStrike(),
  },
  code: {
    label: "Inline code",
    shortcut: "Mod+E",
    icon: (
      <Icon>
        <path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5" />
      </Icon>
    ),
    active: (editor) => editor.isActive("code"),
    available: (editor) => editor.can().toggleCode(),
    apply: (chain) => chain.toggleCode(),
  },
  heading: {
    label: "Heading",
    shortcut: "Mod+Alt+2",
    icon: "H2",
    active: (editor) => editor.isActive("heading", { level: 2 }),
    available: (editor) => editor.can().toggleHeading({ level: 2 }),
    apply: (chain) => chain.toggleHeading({ level: 2 }),
  },
  subheading: {
    label: "Subheading",
    shortcut: "Mod+Alt+3",
    icon: "H3",
    active: (editor) => editor.isActive("heading", { level: 3 }),
    available: (editor) => editor.can().toggleHeading({ level: 3 }),
    apply: (chain) => chain.toggleHeading({ level: 3 }),
  },
  bulletList: {
    label: "Bulleted list",
    shortcut: "Mod+Shift+8",
    icon: (
      <Icon>
        <path d="M6 4h8M6 8h8M6 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01" />
      </Icon>
    ),
    active: (editor) => editor.isActive("bulletList"),
    available: (editor) => editor.can().toggleBulletList(),
    apply: (chain) => chain.toggleBulletList(),
  },
  orderedList: {
    label: "Numbered list",
    shortcut: "Mod+Shift+7",
    icon: (
      <Icon>
        <path d="M7 4h7M7 8h7M7 12h7M2 3l1.25-.75V6M2 9.75C2.25 9 4 9 4 10c0 .75-2 1.5-2 2.75h2" />
      </Icon>
    ),
    active: (editor) => editor.isActive("orderedList"),
    available: (editor) => editor.can().toggleOrderedList(),
    apply: (chain) => chain.toggleOrderedList(),
  },
  blockquote: {
    label: "Quote",
    shortcut: "Mod+Shift+B",
    icon: (
      <Icon>
        <path d="M3 3v10M6.5 5H14M6.5 8H14M6.5 11h5" />
      </Icon>
    ),
    active: (editor) => editor.isActive("blockquote"),
    available: (editor) => editor.can().toggleBlockquote(),
    apply: (chain) => chain.toggleBlockquote(),
  },
  codeBlock: {
    label: "Code block",
    shortcut: "Mod+Alt+C",
    icon: (
      <Icon>
        <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.5" />
        <path d="M6 6.25 4.25 8 6 9.75M10 6.25 11.75 8 10 9.75" />
      </Icon>
    ),
    active: (editor) => editor.isActive("codeBlock"),
    available: (editor) => editor.can().toggleCodeBlock(),
    apply: (chain) => chain.toggleCodeBlock(),
  },
  link: {
    label: "Link",
    shortcut: "Mod+K",
    icon: (
      <Icon>
        <path d="M6.75 9.25a2.75 2.75 0 0 0 4 0l2-2a2.83 2.83 0 0 0-4-4l-.75.75" />
        <path d="M9.25 6.75a2.75 2.75 0 0 0-4 0l-2 2a2.83 2.83 0 0 0 4 4l.75-.75" />
      </Icon>
    ),
    // Unlike isActive, also true just after a link, where the caret is left
    // once one is inserted, and where extendMarkRange still finds it
    active: (editor) => Boolean(editor.getAttributes("link").href),
    available: (editor) => editor.can().setMark("link"),
  },
};
