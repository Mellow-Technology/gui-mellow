"use client";

import {
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import type { Editor, Extensions } from "@tiptap/core";
import { Placeholder, Selection } from "@tiptap/extensions";
import type { EditorView } from "@tiptap/pm/view";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { normaliseUrl, richTextExtensions, storedDocument, type RichTextDocument } from "../../richTextSchema";
import { cx, vars } from "../../utils";
import { Button } from "../Button";
import { Field } from "../Field";
import fieldStyles from "../Field/Field.module.scss";
import richTextStyles from "../RichText/RichText.module.scss";
import { defaultRichTextTools, toolDefinitions, type RichTextTool } from "./tools";
import styles from "./RichTextEditor.module.scss";

export { defaultRichTextTools, type RichTextTool };

export interface RichTextEditorHandle {
  /** Puts the caret at the end of the document. */
  focus: () => void;
  clear: () => void;
  /** The current document, or `null` when it's empty. */
  getJSON: () => RichTextDocument | null;
}

export interface RichTextEditorProps {
  label: ReactNode;
  /** The document, for a controlled editor; `null` is empty. */
  value?: RichTextDocument | null;
  /** The document to start from, for an uncontrolled one. */
  defaultValue?: RichTextDocument | null;
  /** Called with the document as it should be stored: `null` when empty. */
  onChange?: (document: RichTextDocument | null) => void;
  /** Called when focus leaves the editor, its toolbar and its link panel. */
  onBlur?: (document: RichTextDocument | null) => void;
  /** Called on ⌘/Ctrl+Enter, for sending a comment. */
  onSubmit?: () => void;
  placeholder?: string;
  /** The writing area's height to begin with; it grows from there. */
  minHeight?: string;
  /** Which tools the toolbar shows, in order. Empty hides it. */
  tools?: RichTextTool[];
  /** Extra TipTap extensions. Read once, when the editor starts. */
  extensions?: Extensions;
  hint?: ReactNode;
  error?: ReactNode;
  hideLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  /** Styles the whole field: label, control and message. */
  className?: string;
  /** Styles only the control: toolbar and writing area. */
  controlClassName?: string;
  ref?: Ref<RichTextEditorHandle>;
}

const documentOf = (editor: Editor) => storedDocument(editor.getJSON());

/**
 * Whether the editor already shows a document. Stored documents can't be
 * compared as JSON: a database may reorder their keys, and a server drop
 * attributes left at their defaults.
 */
function shows(editor: Editor, document: RichTextDocument | null) {
  const current = documentOf(editor);
  const wanted = document && storedDocument(document);
  if (!current || !wanted) return !current && !wanted;
  try {
    return editor.schema.nodeFromJSON(current).eq(editor.schema.nodeFromJSON(wanted));
  } catch {
    return false;
  }
}

/** Pasted headings at the nearest level we have, rather than as paragraphs. */
function nearestHeadings(html: string) {
  return html.replace(/<(\/?)h1\b/gi, "<$1h2").replace(/<(\/?)h[4-6]\b/gi, "<$1h3");
}

/**
 * ProseMirror cancels Escape whether or not anything uses it, which stops a
 * dialog around the editor closing. Extensions still get it first.
 */
function passOnEscape(view: EditorView, event: globalThis.KeyboardEvent) {
  if (event.key !== "Escape" || event.isComposing) return false;
  if (view.someProp("handleKeyDown", (handler) => handler(view, event))) event.preventDefault();
  return true;
}

/** How a tool's shortcut reads in a tooltip. */
function shortcutHint(shortcut: string) {
  return shortcut.replace("Mod", "⌘/Ctrl");
}

/** And to assistive technology, which wants each platform's keys spelt out. */
function keyShortcuts(shortcut: string) {
  return `${shortcut.replace("Mod", "Control")} ${shortcut.replace("Mod", "Meta")}`;
}

/**
 * Rich text, on TipTap. Its value is the document tree rather than HTML: store
 * that, and show it with RichText.
 */
export function RichTextEditor({
  label,
  value,
  defaultValue,
  onChange,
  onBlur,
  onSubmit,
  placeholder = "",
  minHeight = "8rem",
  tools = defaultRichTextTools,
  extensions,
  hint,
  error,
  hideLabel,
  disabled = false,
  required,
  id,
  className,
  controlClassName,
  ref,
}: RichTextEditorProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const labelId = `${controlId}-label`;
  const messageId = `${controlId}-message`;
  const linkPanelId = `${controlId}-link`;
  const linkErrorId = `${controlId}-link-error`;

  const control = useRef<HTMLDivElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);

  // The editor's options are set up once, so what they call has to be looked
  // up as it's needed
  const latest = useRef({ onChange, onSubmit, placeholder, openLink: () => {} });
  useLayoutEffect(() => {
    latest.current = { onChange, onSubmit, placeholder, openLink };
  });
  /** The document last passed to onChange, which needn't be taken back in. */
  const reported = useRef<RichTextDocument | null | undefined>(undefined);

  const [initialContent] = useState(() => value ?? defaultValue ?? "");
  // Once only: a schema can't change under a running editor
  const [allExtensions] = useState(() => [
    ...richTextExtensions,
    Placeholder.configure({
      placeholder: () => latest.current.placeholder,
      emptyNodeClass: styles.placeholder,
    }),
    Selection.configure({ className: styles.selection }),
    ...(extensions ?? []),
  ]);

  const hasMessage = Boolean(error || hint);
  const invalid = Boolean(error);
  const editorProps = useMemo(
    () => ({
      attributes: {
        id: controlId,
        class: cx(richTextStyles.richText, styles.surface),
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": labelId,
        // ProseMirror would write out undefined, so these are left off instead
        ...(placeholder && { "aria-placeholder": placeholder }),
        ...(hasMessage && { "aria-describedby": messageId }),
        ...(invalid && { "aria-invalid": "true" }),
        ...(required && { "aria-required": "true" }),
        ...(disabled && { "aria-disabled": "true" }),
      },
      transformPastedHTML: nearestHeadings,
      handleDOMEvents: { keydown: passOnEscape },
      handleKeyDown: (_: unknown, event: globalThis.KeyboardEvent) => {
        if (!(event.metaKey || event.ctrlKey)) return false;
        if (event.key === "Enter" && latest.current.onSubmit) {
          latest.current.onSubmit();
          return true;
        }
        if (event.key.toLowerCase() === "k" && !event.shiftKey && !event.altKey) {
          latest.current.openLink();
          return true;
        }
        return false;
      },
    }),
    [controlId, labelId, messageId, placeholder, hasMessage, invalid, required, disabled],
  );

  const editor = useEditor({
    // Nothing to render on the server, or in a static export
    immediatelyRender: false,
    extensions: allExtensions,
    content: initialContent,
    editable: !disabled,
    editorProps,
    onUpdate: ({ editor }) => {
      const document = documentOf(editor);
      reported.current = document;
      latest.current.onChange?.(document);
    },
  });

  useEffect(() => {
    editor?.setEditable(!disabled, false);
  }, [editor, disabled]);

  // Take in a document from outside, such as a saved version or a reset after
  // sending, without treating it as an edit that could be undone
  useEffect(() => {
    if (!editor || value === undefined || value === reported.current || shows(editor, value)) return;
    editor
      .chain()
      .setMeta("addToHistory", false)
      .setContent(value ?? "", { emitUpdate: false })
      .run();
  }, [editor, value]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        editor?.commands.focus("end");
      },
      clear: () => {
        editor?.commands.clearContent(true);
      },
      getJSON: () => (editor ? documentOf(editor) : null),
    }),
    [editor],
  );

  const toolStates = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? Object.fromEntries(
            tools.map((tool) => [
              tool,
              { active: toolDefinitions[tool].active(editor), available: toolDefinitions[tool].available(editor) },
            ]),
          )
        : {},
  });

  // Only one tool is in the tab order, and the arrow keys move between them
  const [rovingTool, setRovingTool] = useState<RichTextTool | undefined>(undefined);
  const tabStop = rovingTool && tools.includes(rovingTool) ? rovingTool : tools[0];

  function handleToolbarKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = [...(toolbar.current?.querySelectorAll("button") ?? [])];
    const current = buttons.indexOf(event.target as HTMLButtonElement);
    const target = {
      ArrowRight: buttons[(current + 1) % buttons.length],
      ArrowLeft: buttons[(current - 1 + buttons.length) % buttons.length],
      Home: buttons[0],
      End: buttons.at(-1),
    }[event.key];
    if (target) {
      event.preventDefault();
      target.focus();
    }
  }

  const [linkDraft, setLinkDraft] = useState<string | null>(null);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const linkOpen = linkDraft !== null && !disabled;
  const inLink = Boolean(toolStates?.link?.active);

  function openLink() {
    if (!editor || !tools.includes("link") || !toolDefinitions.link.available(editor)) return;
    setLinkInvalid(false);
    setLinkDraft(editor.getAttributes("link").href ?? "");
  }

  function closeLink() {
    setLinkDraft(null);
    editor?.commands.focus();
  }

  function applyLink() {
    if (!editor || linkDraft === null) return;
    if (!linkDraft.trim()) {
      removeLink();
      return;
    }
    const href = normaliseUrl(linkDraft);
    if (!href) {
      setLinkInvalid(true);
      return;
    }
    const chain = editor.chain().focus().extendMarkRange("link");
    if (editor.state.selection.empty && !toolDefinitions.link.active(editor)) {
      // Nothing to link, so the address is its own text. Typing on from it
      // shouldn't carry on the link.
      chain
        .insertContent({ type: "text", text: linkDraft.trim(), marks: [{ type: "link", attrs: { href } }] })
        .unsetMark("link")
        .run();
    } else {
      chain.setLink({ href }).run();
    }
    setLinkDraft(null);
  }

  function removeLink() {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkDraft(null);
  }

  function handleLinkKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      // There's no form of our own, and an app's around us mustn't submit
      event.preventDefault();
      applyLink();
    } else if (event.key === "Escape") {
      // Or a dialog around us close
      event.preventDefault();
      event.stopPropagation();
      closeLink();
    }
  }

  function handleToolClick(tool: RichTextTool, withPointer: boolean) {
    if (!editor || !toolStates?.[tool]?.available) return;
    if (tool === "link") {
      if (linkOpen) closeLink();
      else openLink();
      return;
    }
    // From the keyboard, stay in the toolbar to reach for the next tool
    const chain = withPointer ? editor.chain().focus() : editor.chain();
    toolDefinitions[tool].apply?.(chain).run();
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!editor || control.current?.contains(event.relatedTarget)) return;
    onBlur?.(documentOf(editor));
  }

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      hideLabel={hideLabel}
      required={required}
      htmlFor={controlId}
      messageId={messageId}
      labelId={labelId}
      onLabelClick={() => editor?.commands.focus("end")}
      className={className}
    >
      <div
        ref={control}
        className={cx(styles.control, disabled && styles.disabled, invalid && styles.invalid, controlClassName)}
        style={vars({ "--rich-text-min-height": minHeight })}
        onBlur={handleBlur}
      >
        {tools.length > 0 && (
          <div
            ref={toolbar}
            className={styles.toolbar}
            role="toolbar"
            aria-label={typeof label === "string" ? `${label} formatting` : "Formatting"}
            aria-controls={controlId}
            onKeyDown={handleToolbarKeyDown}
          >
            {tools.map((tool) => {
              const { label: toolLabel, icon, shortcut } = toolDefinitions[tool];
              const state = toolStates?.[tool];
              return (
                <button
                  key={tool}
                  type="button"
                  className={styles.tool}
                  title={shortcut ? `${toolLabel} (${shortcutHint(shortcut)})` : toolLabel}
                  aria-label={toolLabel}
                  aria-pressed={Boolean(state?.active)}
                  aria-keyshortcuts={shortcut && keyShortcuts(shortcut)}
                  aria-disabled={state && !state.available ? true : undefined}
                  {...(tool === "link" && {
                    "aria-expanded": linkOpen,
                    "aria-controls": linkOpen ? linkPanelId : undefined,
                  })}
                  disabled={disabled || !editor}
                  tabIndex={tool === tabStop ? 0 : -1}
                  onFocus={() => setRovingTool(tool)}
                  // Keeps the selection, and the focus, in the writing area
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={(event) => handleToolClick(tool, event.detail > 0)}
                >
                  {icon}
                </button>
              );
            })}
          </div>
        )}

        {linkOpen && (
          <div id={linkPanelId} className={styles.linkPanel} role="group" aria-label="Link">
            <input
              autoFocus
              type="text"
              inputMode="url"
              className={cx(fieldStyles.control, styles.linkInput)}
              aria-label="Link address"
              aria-invalid={linkInvalid || undefined}
              aria-describedby={linkInvalid ? linkErrorId : undefined}
              placeholder="https://… or someone@example.com"
              value={linkDraft}
              onChange={(event) => {
                setLinkDraft(event.target.value);
                setLinkInvalid(false);
              }}
              onKeyDown={handleLinkKeyDown}
            />
            <Button type="button" variant="secondary" size="sm" onClick={applyLink}>
              Apply
            </Button>
            {inLink && (
              <Button type="button" variant="ghost" size="sm" onClick={removeLink}>
                Remove
              </Button>
            )}
            {linkInvalid && (
              <p id={linkErrorId} className={styles.linkError} role="alert">
                Enter a web or email address.
              </p>
            )}
          </div>
        )}

        <EditorContent editor={editor} className={styles.host} />
      </div>
    </Field>
  );
}
