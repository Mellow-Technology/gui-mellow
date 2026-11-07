"use client";

import {
  cloneElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cx, vars } from "../../utils";
import styles from "./Popover.module.scss";

type Side = "top" | "bottom" | "left" | "right";

export type PopoverPlacement = Side | `${Side}-start` | `${Side}-end`;

type TriggerProps = HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> };

export interface PopoverProps extends Omit<ComponentProps<"span">, "content" | "children"> {
  /** What opens it: one element that passes its props on to the DOM, and can take focus. */
  children: ReactElement<TriggerProps>;
  content: ReactNode;
  /** Which side of the trigger, and which edge to line up with. Flips near the window's edge. */
  placement?: PopoverPlacement;
  /**
   * What opens it. `hover` also opens on keyboard focus and on a tap. `manual`
   * leaves it to `open`, and to you to close it: nothing outside it dismisses it.
   */
  trigger?: "hover" | "click" | "manual";
  /** Controls it; leave unset to let it manage itself. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Adds an arrow pointing at the trigger. */
  arrow?: boolean;
  /** A colour to tint the glass with, such as a segment's. */
  tint?: string;
  /**
   * Whether it holds controls or links, rather than only describing the
   * trigger. It then gets `aria-expanded` and `aria-controls` in place of
   * `aria-describedby`, and takes focus on opening, except on hover, where
   * Tab reaches it from the trigger. Off for `hover`, on otherwise.
   */
  interactive?: boolean;
}

const OPEN_DELAY_MS = 150;

// Long enough to carry the pointer across the gap into the popover
const CLOSE_GRACE_MS = 200;

// The space kept from the trigger, as in Popover.module.scss, and from the
// window's edge
const GAP_PX = 8;
const EDGE_PX = 8;

// How close the arrow comes to the popover's corners
const ARROW_INSET_PX = 14;

const FOCUSABLE =
  "a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex='-1'])";

const OPPOSITE: Record<Side, Side> = { top: "bottom", bottom: "top", left: "right", right: "left" };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)));

/**
 * Places a popover by hand, for browsers without CSS anchor positioning:
 * flips it if there's more room on the far side, and keeps it in the window.
 */
function place(popup: HTMLElement, rect: DOMRect, placement: PopoverPlacement) {
  const [wanted, align] = placement.split("-") as [Side, "start" | "end" | undefined];
  const width = popup.offsetWidth;
  const height = popup.offsetHeight;
  const room = {
    top: rect.top,
    bottom: window.innerHeight - rect.bottom,
    left: rect.left,
    right: window.innerWidth - rect.right,
  };
  const vertical = wanted === "top" || wanted === "bottom";
  const needed = (vertical ? height : width) + GAP_PX + EDGE_PX;
  const side = room[wanted] < needed && room[OPPOSITE[wanted]] > room[wanted] ? OPPOSITE[wanted] : wanted;

  const along = (start: number, end: number, size: number) =>
    align === "start" ? start : align === "end" ? end - size : (start + end - size) / 2;
  const left = vertical
    ? along(rect.left, rect.right, width)
    : side === "left"
      ? rect.left - GAP_PX - width
      : rect.right + GAP_PX;
  const top = !vertical
    ? along(rect.top, rect.bottom, height)
    : side === "top"
      ? rect.top - GAP_PX - height
      : rect.bottom + GAP_PX;

  popup.style.left = `${clamp(left, EDGE_PX, window.innerWidth - width - EDGE_PX)}px`;
  popup.style.top = `${clamp(top, EDGE_PX, window.innerHeight - height - EDGE_PX)}px`;
}

/**
 * Points the arrow at the trigger, wherever the popover ended up. CSS can't
 * yet tell every browser which side a popover flipped to. Measures from the
 * centre, which stays put while it scales in.
 */
function aim(popup: HTMLElement, rect: DOMRect) {
  const box = popup.getBoundingClientRect();
  const side: Side =
    box.bottom <= rect.top + 1 ? "top" : box.top >= rect.bottom - 1 ? "bottom" : box.right <= rect.left + 1 ? "left" : "right";
  const x = (rect.left + rect.right - box.left - box.right + popup.offsetWidth) / 2;
  const y = (rect.top + rect.bottom - box.top - box.bottom + popup.offsetHeight) / 2;
  popup.dataset.side = side;
  popup.style.setProperty("--arrow-x", `${clamp(x, ARROW_INSET_PX, popup.offsetWidth - ARROW_INSET_PX)}px`);
  popup.style.setProperty("--arrow-y", `${clamp(y, ARROW_INSET_PX, popup.offsetHeight - ARROW_INSET_PX)}px`);
}

/**
 * A small floating panel anchored to its trigger, for hints, previews and
 * small menus. Built on the native `popover` attribute: it opens in the top
 * layer, so no container clips it, and the browser closes it on Escape or a
 * click outside. CSS anchor positioning places it and flips it near the
 * window's edge, with a JavaScript fallback where that isn't supported.
 *
 * Its content is always in the page, for `aria-describedby`, and comes right
 * after the trigger, which is where Tab goes next.
 */
export function Popover({
  children,
  content,
  placement = "top",
  trigger = "hover",
  open,
  onOpenChange,
  arrow = false,
  tint,
  interactive = trigger !== "hover",
  id,
  role = interactive ? "dialog" : "tooltip",
  className,
  style,
  ...props
}: PopoverProps) {
  const [internal, setInternal] = useState(false);
  const isOpen = open ?? internal;

  const generated = useId();
  const popoverId = id ?? `${generated}-popover`;
  const triggerId = children.props.id ?? `${generated}-trigger`;
  const anchorName = `--gm-popover-${generated.replace(/\W/g, "")}`;

  const popover = useRef<HTMLElement>(null);
  const anchor = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // What timers and the browser's events see, as they outlive a render
  const live = useRef(isOpen);
  const notify = useRef(onOpenChange);
  // Set between a press on the trigger and its click, which comes after the
  // browser has dismissed an open popover: otherwise the click reopens it
  const press = useRef<{ type: string; wasOpen: boolean } | null>(null);

  const hover = trigger === "hover";

  const change = (next: boolean) => {
    clearTimeout(timer.current);
    if (next === live.current) return;
    live.current = next;
    setInternal(next);
    notify.current?.(next);
  };

  const changeAfter = (next: boolean, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => change(next), ms);
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (!hover || event.pointerType === "touch") return;
    const focused = anchor.current?.matches(":focus-visible") || popover.current?.matches(":focus-within");
    if (focused) clearTimeout(timer.current);
    else changeAfter(false, CLOSE_GRACE_MS);
  };

  // Tabbing on past it. Without a next element, focus is leaving the window
  const onBlur = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (trigger === "manual" || !next) return;
    if (!anchor.current?.contains(next) && !popover.current?.contains(next)) change(false);
  };

  const triggerHandlers: TriggerProps = {
    onPointerEnter: (event) => {
      if (hover && event.pointerType !== "touch") changeAfter(true, live.current ? 0 : OPEN_DELAY_MS);
    },
    onPointerLeave,
    onPointerDown: (event) => {
      press.current = { type: event.pointerType, wasOpen: live.current };
    },
    onClick: (event) => {
      // A click from the keyboard has no press, and a press may have no click
      const { type, wasOpen } = (event.detail > 0 && press.current) || { type: "", wasOpen: live.current };
      press.current = null;
      if (trigger === "click" || (hover && type === "touch")) change(!wasOpen);
    },
    onFocus: (event) => {
      // Not focus from a click, or returning from inside the popover
      const from = event.relatedTarget as Node | null;
      if (hover && event.currentTarget.matches(":focus-visible") && !popover.current?.contains(from)) change(true);
    },
    onBlur,
  };

  const moveFocus = interactive && !hover;

  useLayoutEffect(() => {
    live.current = isOpen;
    notify.current = onOpenChange;
  });

  useLayoutEffect(() => {
    const popup = popover.current;
    const target = anchor.current;
    if (!popup || !target) return;

    if (popup.matches(":popover-open") !== isOpen) {
      if (isOpen) popup.showPopover();
      else popup.hidePopover();
    }
    if (!isOpen) return;

    const anchored = CSS.supports("position-area", "top") && CSS.supports("position-try-fallbacks", "flip-block");
    if (anchored && !arrow) return;

    const follow = () => {
      const rect = target.getBoundingClientRect();
      if (!anchored) place(popup, rect, placement);
      if (arrow) aim(popup, rect);
    };
    follow();
    window.addEventListener("scroll", follow, { capture: true, passive: true });
    window.addEventListener("resize", follow);
    return () => {
      window.removeEventListener("scroll", follow, { capture: true });
      window.removeEventListener("resize", follow);
    };
  }, [isOpen, placement, arrow]);

  useEffect(() => {
    const popup = popover.current;
    if (!popup || !isOpen || !moveFocus) return;
    if (!popup.contains(document.activeElement)) (popup.querySelector<HTMLElement>(FOCUSABLE) ?? popup).focus();

    // The browser hands focus back, but Safari doesn't focus a button on
    // click, so has nowhere to hand it, and a click on nothing drops it
    return () => {
      const active = document.activeElement;
      if (!active || active === document.body || popup.contains(active)) anchor.current?.focus({ preventScroll: true });
    };
  }, [isOpen, moveFocus]);

  // The browser's own closing, on Escape or a click outside
  useEffect(() => {
    const popup = popover.current;
    const onToggle = (event: Event) => {
      if ((event as ToggleEvent).newState === "closed") change(false);
    };
    popup?.addEventListener("toggle", onToggle);
    return () => {
      popup?.removeEventListener("toggle", onToggle);
      clearTimeout(timer.current);
    };
    // `change` only works through refs, so the first one will do
  }, []);

  const child = children.props;
  const merged: TriggerProps = {};
  for (const name of Object.keys(triggerHandlers) as Array<keyof typeof triggerHandlers>) {
    const ours = triggerHandlers[name] as (event: unknown) => void;
    const theirs = child[name] as ((event: unknown) => void) | undefined;
    (merged[name] as unknown) = (event: unknown) => {
      theirs?.(event);
      ours(event);
    };
  }

  const wiring: TriggerProps = interactive
    ? {
        id: triggerId,
        "aria-expanded": isOpen,
        "aria-controls": popoverId,
        "aria-haspopup": role === "menu" ? "menu" : role === "listbox" ? "listbox" : "dialog",
      }
    : { "aria-describedby": cx(child["aria-describedby"], popoverId) };

  return (
    <>
      {cloneElement(children, {
        ...merged,
        ...wiring,
        style: { ...child.style, anchorName } as CSSProperties,
        ref: (node: HTMLElement | null) => {
          anchor.current = node;
          const { ref } = child;
          if (typeof ref === "function") return ref(node);
          if (ref) ref.current = node;
        },
      })}
      <span
        ref={popover}
        id={popoverId}
        role={role}
        popover={trigger === "manual" ? "manual" : "auto"}
        data-placement={placement}
        tabIndex={interactive ? -1 : undefined}
        aria-labelledby={interactive && !props["aria-label"] ? triggerId : undefined}
        className={cx(styles.popover, className)}
        style={vars({ "--frost-tint": tint }, { ...style, positionAnchor: anchorName } as CSSProperties)}
        onPointerEnter={(event) => {
          if (hover && event.pointerType !== "touch") clearTimeout(timer.current);
        }}
        onPointerLeave={onPointerLeave}
        onBlur={onBlur}
        onKeyDown={(event) => {
          // `auto` popovers get this from the browser
          if (trigger === "manual" && event.key === "Escape") change(false);
        }}
        {...props}
      >
        <span className={styles.body}>{content}</span>
        {arrow && <span className={styles.arrow} aria-hidden />}
      </span>
    </>
  );
}
