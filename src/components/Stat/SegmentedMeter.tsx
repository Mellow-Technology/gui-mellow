"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { cx, toneColor, vars, type Tone } from "../../utils";
import styles from "./Stat.module.scss";

export interface MeterSegment {
  value: number;
  label: string;
  /** Falls back to a fixed order of tones, by the segment's place in the list. */
  tone?: Tone;
  /** Any CSS colour, in place of a tone. */
  color?: string;
}

export interface SegmentedMeterProps extends Omit<ComponentProps<"div">, "popover"> {
  /** One bar split into these, in order. Those with no value aren't drawn. */
  segments: MeterSegment[];
  /** What the segments are a share of, when that's more than their total. The rest is empty track. */
  max?: number;
  /** What's being measured, leading the summary given to assistive technology. */
  label?: string;
  /** Shows a swatch, label and count for each segment, under the bar. */
  legend?: boolean;
  /** The popover on each segment. `false` turns it off; `showTotal` adds "of 11" to the count. */
  popover?: boolean | { showTotal?: boolean };
}

// Accent and danger are close in some palettes, so they're kept apart
const TONES: Tone[] = ["primary", "success", "warning", "danger", "neutral", "accent"];

const OPEN_DELAY = 120; // ms of hover before the first popover, so crossing the bar shows nothing
const CLOSE_GRACE = 140; // ms before closing, so the pointer can reach the popover
const GAP = 8; // px between the bar and the popover
const MARGIN = 8; // px kept clear of the window's edges

function percentage(share: number) {
  const percent = share * 100;
  return percent > 0 && percent < 1 ? "<1%" : `${Math.round(percent)}%`;
}

function summarise(
  label: string | undefined,
  visible: Array<{ value: number; label: string }>,
  total: number,
  whole: number,
) {
  if (visible.length === 0) return label ? `${label}: none` : "No items";
  const parts = visible.map((segment) => `${segment.value} ${segment.label}`).join(", ");
  // Adding up decimals leaves dust behind: 0.1 + 0.2
  const sum = Number(total.toFixed(2));
  const count = whole > total ? `${sum} of ${whole}` : `${sum}`;
  if (label) return `${label}: ${whole > total ? count : `${count} total`}, ${parts}`;
  return `${count} ${sum === 1 ? "item" : "items"}: ${parts}`;
}

// Above the bar, or below it near the top of the window, and centred on the
// segment as far as the window's sides allow. The bar gives the height as a
// raised segment is taller than it
function place(popup: HTMLElement, segment: Element, bar: Element) {
  const { left, width } = segment.getBoundingClientRect();
  const { top, bottom } = bar.getBoundingClientRect();
  const above = top - GAP - popup.offsetHeight;
  const centred = left + width / 2 - popup.offsetWidth / 2;
  popup.style.top = `${above < MARGIN ? bottom + GAP : above}px`;
  popup.style.left = `${Math.max(MARGIN, Math.min(centred, window.innerWidth - popup.offsetWidth - MARGIN))}px`;
}

/**
 * The stateful half of Meter, kept apart so a plain meter ships no JavaScript.
 * Reached through `<Meter segments={…} />`.
 */
export function SegmentedMeter({
  segments,
  max = 0,
  label,
  legend,
  popover = true,
  className,
  "aria-label": ariaLabel,
  ...props
}: SegmentedMeterProps) {
  const entries = segments.map((segment, index) => ({
    ...segment,
    index,
    value: Number.isFinite(segment.value) ? Math.max(segment.value, 0) : 0,
    color: segment.color ?? toneColor(segment.tone ?? TONES[index % TONES.length]!),
  }));
  const visible = entries.filter((entry) => entry.value > 0);
  const total = visible.reduce((sum, entry) => sum + entry.value, 0);
  const whole = Math.max(total, max);

  const popoverId = useId();
  const track = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastPointer = useRef("mouse");
  // Segments go by their index in `segments`, which stays put when a
  // neighbour drops to zero
  const [active, setActive] = useState<number | null>(null);
  const [rover, setRover] = useState(0);
  const [inLink, setInLink] = useState(false);

  const interactive = popover !== false && visible.length > 0;
  // Nothing inside a link may take focus, so there the bar is one image,
  // read out through its summary
  const focusable = interactive && !inLink;
  const current = interactive ? visible.find((entry) => entry.index === active) : undefined;
  const open = current !== undefined;
  const tabStop = visible.some((entry) => entry.index === rover) ? rover : visible[0]?.index;
  const showTotal = typeof popover === "object" && popover.showTotal;

  const settle = (next: number | null, delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(next), delay);
  };

  const show = (index: number | null) => {
    clearTimeout(timer.current);
    setActive(index);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  useLayoutEffect(() => {
    setInLink(track.current?.closest("a[href], button") != null);
  }, []);

  // After every render, as the values, and so the widths, may have changed.
  // Only a popover already open glides to its new place; a new one just
  // appears there
  useLayoutEffect(() => {
    const popup = bubble.current;
    if (!popup) return;
    const shown = popup.matches(":popover-open");
    const segment = track.current?.children[visible.findIndex((entry) => entry.index === active)];
    if (!open || !segment) {
      if (shown) popup.hidePopover();
      return;
    }
    popup.classList.toggle(styles.following!, shown);
    if (!shown) popup.showPopover();
    place(popup, segment, track.current!);
  });

  // While open, it stays with the bar and closes on Escape or a press elsewhere
  useEffect(() => {
    if (!open) return;
    const follow = () => {
      const popup = bubble.current;
      const segment = track.current?.querySelector("[data-active]");
      if (popup && segment) place(popup, segment, track.current!);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") show(null);
    };
    const onPointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Node;
      if (!track.current?.contains(target) && !bubble.current?.contains(target)) show(null);
    };
    // Capturing, so scrolling any container the bar sits in moves it too
    window.addEventListener("scroll", follow, true);
    window.addEventListener("resize", follow);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("scroll", follow, true);
      window.removeEventListener("resize", follow);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Once one's open it follows the pointer at once. Touch pointers "leave" as
  // the finger lifts, so only a mouse gets here; touch goes through clicks
  const onSegmentEnter = (event: PointerEvent, index: number) => {
    if (event.pointerType !== "mouse") return;
    if (open) show(index);
    else settle(index, OPEN_DELAY);
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "mouse") settle(null, CLOSE_GRACE);
  };

  // A first tap shows the popover, rather than following a surrounding link.
  // A second follows it, or, with no link, closes the popover again
  const onSegmentClick = (event: MouseEvent, index: number) => {
    if (lastPointer.current === "mouse") return;
    if (active !== index) {
      event.preventDefault();
      show(index);
    } else if (!inLink) {
      show(null);
    }
  };

  // The bar is one tab stop; the arrow keys move along it
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const position = visible.findIndex((entry) => entry.index === tabStop);
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const moves: Record<string, number> = {
      ArrowRight: rtl ? position - 1 : position + 1,
      ArrowLeft: rtl ? position + 1 : position - 1,
      Home: 0,
      End: visible.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const wrapped = (next + visible.length) % visible.length;
    (event.currentTarget.children[wrapped] as HTMLElement).focus();
  };

  return (
    <div className={cx(styles.segmented, className)} {...props}>
      <div
        ref={track}
        role={focusable ? "group" : "img"}
        aria-label={ariaLabel ?? summarise(label, visible, total, whole)}
        className={cx(styles.meter, styles.track)}
        onKeyDown={focusable ? onKeyDown : undefined}
        onBlur={
          focusable
            ? (event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) show(null);
              }
            : undefined
        }
      >
        {visible.map((entry) => (
          <div
            key={entry.index}
            className={styles.segment}
            data-active={entry === current || undefined}
            style={vars({ "--gm-meter-color": entry.color }, { flexBasis: `${(entry.value / whole) * 100}%` })}
            {...(focusable && {
              role: "img",
              "aria-label": `${entry.label}: ${entry.value}`,
              "aria-describedby": entry === current ? popoverId : undefined,
              tabIndex: entry.index === tabStop ? 0 : -1,
              onFocus: (event) => {
                setRover(entry.index);
                // Not for a press, which has its own say above
                if (event.currentTarget.matches(":focus-visible")) show(entry.index);
              },
            } satisfies ComponentProps<"div">)}
            {...(interactive && {
              onPointerDown: (event) => {
                lastPointer.current = event.pointerType;
              },
              onPointerEnter: (event) => onSegmentEnter(event, entry.index),
              onPointerLeave,
              onClick: (event) => onSegmentClick(event, entry.index),
            } satisfies ComponentProps<"div">)}
          />
        ))}
      </div>
      {interactive && (
        <div
          ref={bubble}
          id={popoverId}
          role="tooltip"
          popover="manual"
          className={styles.popover}
          style={current && vars({ "--gm-meter-color": current.color })}
          onPointerEnter={(event) => event.pointerType === "mouse" && clearTimeout(timer.current)}
          onPointerLeave={onPointerLeave}
          // It's in the DOM of any link around the bar, though it doesn't look it
          onClick={(event) => event.preventDefault()}
        >
          {current && (
            <>
              <span className={styles.swatch} aria-hidden />
              <span className={styles.popoverLabel}>{current.label}</span>
              <strong className={styles.count}>
                {current.value}
                {showTotal && ` of ${whole}`}
              </strong>
              <span className={styles.share}>{percentage(current.value / whole)}</span>
            </>
          )}
        </div>
      )}
      {legend && (
        <ul className={styles.legend}>
          {entries.map((entry) => (
            <li
              key={entry.index}
              className={styles.legendItem}
              style={vars({ "--gm-meter-color": entry.color })}
            >
              <span className={styles.swatch} aria-hidden />
              {entry.label}
              <span className={styles.count}>{entry.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
