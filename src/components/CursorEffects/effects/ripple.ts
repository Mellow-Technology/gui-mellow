// Cloud: a ring spreading from each click, and nothing while moving

import { prune, type CursorEffectFactory } from "./types";

interface Ring {
  x: number;
  y: number;
  age: number;
  life: number;
}

const ripple: CursorEffectFactory = (theme) => {
  const rings: Ring[] = [];

  return {
    down(x, y) {
      rings.push({ x, y, age: 0, life: 0.55 }, { x, y, age: -0.08, life: 0.55 });
    },
    frame(context, seconds) {
      for (const ring of rings) {
        ring.age += seconds;
        if (ring.age < 0) continue;
        const t = ring.age / ring.life;
        const eased = 1 - (1 - t) ** 3;
        context.globalAlpha = 1 - t;
        context.strokeStyle = theme.primary;
        context.lineWidth = 2 * (1 - t) + 0.5;
        context.beginPath();
        context.arc(ring.x, ring.y, 4 + eased * 26, 0, Math.PI * 2);
        context.stroke();
      }
      prune(rings);
      return rings.length > 0;
    },
  };
};

export default ripple;
