// Cyberpunk: targeting brackets that trail the reticle cursor with a
// coordinate readout, and lock on around links and buttons

import { approach, prune, type CursorEffectFactory } from "./types";

const TARGETS = "a[href], button:not(:disabled), [role='button'], [role='tab'], summary, label, input, select, textarea";
const FREE_SIZE = 30;
const PAD = 6;

interface Ping {
  x: number;
  y: number;
  age: number;
  life: number;
}

const reticle: CursorEffectFactory = (theme) => {
  let pointerX = 0;
  let pointerY = 0;
  let visible = false;
  let target: Element | null = null;
  // The brackets' current box, easing towards the wanted one
  let box = { left: 0, top: 0, right: 0, bottom: 0 };
  let placed = false;
  const pings: Ping[] = [];
  const font = `600 9px ${theme.monoFont}`;

  const wanted = () => {
    if (target?.isConnected) {
      const rect = target.getBoundingClientRect();
      return { left: rect.left - PAD, top: rect.top - PAD, right: rect.right + PAD, bottom: rect.bottom + PAD };
    }
    const half = FREE_SIZE / 2;
    return { left: pointerX - half, top: pointerY - half, right: pointerX + half, bottom: pointerY + half };
  };

  return {
    move(x, y, eventTarget) {
      pointerX = x;
      pointerY = y;
      visible = true;
      target = eventTarget instanceof Element ? eventTarget.closest(TARGETS) : null;
      if (!placed) {
        box = wanted();
        placed = true;
      }
    },
    down(x, y) {
      pings.push({ x, y, age: 0, life: 0.45 });
    },
    leave() {
      visible = false;
    },
    frame(context, seconds) {
      let moving = false;

      if (visible) {
        const goal = wanted();
        const rate = target ? 22 : 16;
        let settled = true;
        for (const side of ["left", "top", "right", "bottom"] as const) {
          box[side] = approach(box[side], goal[side], rate, seconds);
          if (Math.abs(box[side] - goal[side]) > 0.3) settled = false;
        }
        moving = !settled;

        const { left, top, right, bottom } = box;
        const arm = Math.min(10, (right - left) / 3, (bottom - top) / 3);
        context.globalAlpha = 1;
        context.strokeStyle = target ? theme.accent : theme.link;
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(left, top + arm);
        context.lineTo(left, top);
        context.lineTo(left + arm, top);
        context.moveTo(right - arm, top);
        context.lineTo(right, top);
        context.lineTo(right, top + arm);
        context.moveTo(right, bottom - arm);
        context.lineTo(right, bottom);
        context.lineTo(right - arm, bottom);
        context.moveTo(left + arm, bottom);
        context.lineTo(left, bottom);
        context.lineTo(left, bottom - arm);
        context.stroke();

        context.font = font;
        context.textBaseline = "bottom";
        if (target) {
          // A tag on the locked box's top edge
          const label = "LOCK";
          const width = context.measureText(label).width + 8;
          context.fillStyle = theme.accent;
          context.fillRect(left, top - 13, width, 12);
          context.fillStyle = theme.bg;
          context.fillText(label, left + 4, top - 2);
        } else {
          const pad = (n: number) => String(Math.round(n)).padStart(4, "0");
          context.fillStyle = theme.link;
          context.globalAlpha = 0.8;
          context.fillText(`X${pad(pointerX)} Y${pad(pointerY)}`, right + 4, bottom + 2);
        }
      }

      for (const ping of pings) {
        ping.age += seconds;
        const t = ping.age / ping.life;
        const size = 6 + t * 26;
        context.globalAlpha = 1 - t;
        context.strokeStyle = theme.accent;
        context.lineWidth = 1.5;
        context.save();
        context.translate(ping.x, ping.y);
        context.rotate(Math.PI / 4);
        context.strokeRect(-size / 2, -size / 2, size, size);
        context.restore();
      }
      prune(pings);

      return moving || pings.length > 0;
    },
  };
};

export default reticle;
