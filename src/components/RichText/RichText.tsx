import { useMemo, type ComponentProps } from "react";
import type { Extensions } from "@tiptap/core";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import { isEmptyDocument, richTextExtensions, type RichTextDocument } from "../../richTextSchema";
import { cx } from "../../utils";
import styles from "./RichText.module.scss";

export interface RichTextProps extends Omit<ComponentProps<"div">, "children" | "dangerouslySetInnerHTML"> {
  /** The stored document; `null` renders nothing. */
  value: RichTextDocument | null | undefined;
  /** Extra TipTap extensions, the same ones given to RichTextEditor. */
  extensions?: Extensions;
}

/** Each block's text, for a document the schema can't read. */
function textBlocks(node: RichTextDocument): string[] {
  const children = node.content ?? [];
  if (children.some((child) => child.text !== undefined)) {
    return [children.map((child) => child.text ?? "").join("")];
  }
  return children.flatMap(textBlocks);
}

function render(value: RichTextDocument, extensions: Extensions | undefined) {
  try {
    return renderToReactElement({
      content: value,
      extensions: extensions ? [...richTextExtensions, ...extensions] : richTextExtensions,
    });
  } catch {
    // A node or mark from another version of the schema: keep the words
    return textBlocks(value).map((text, index) => <p key={index}>{text}</p>);
  }
}

/**
 * A stored document as React elements, without starting an editor. It renders
 * on the server, and links are only ever http, https or mailto, so there's no
 * HTML to sanitize.
 */
export function RichText({ value, extensions, className, ...props }: RichTextProps) {
  const content = useMemo(
    () => (value && !isEmptyDocument(value) ? render(value, extensions) : null),
    [value, extensions],
  );
  if (!content) return null;

  return (
    <div className={cx(styles.richText, className)} {...props}>
      {content}
    </div>
  );
}
