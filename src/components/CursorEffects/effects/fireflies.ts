// Solarpunk: motes rising from the pointer, pollen by day and glowing
// fireflies by night; a click shakes loose a few leaves

import { between, pick, prune, type CursorEffectFactory } from "./types";

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  phase: number;
  age: number;
  life: number;
}

interface Leaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  size: number;
  color: string;
  age: number;
  life: number;
}

const MAX_MOTES = 70;

const fireflies: CursorEffectFactory = (theme) => {
  const motes: Mote[] = [];
  const leaves: Leaf[] = [];
  const glow = theme.scheme === "dark";
  let lastX = 0;
  let lastY = 0;
  let travelled = 0;

  const addMote = (x: number, y: number, speed = 1) => {
    if (motes.length >= MAX_MOTES) motes.shift();
    motes.push({
      x,
      y,
      vx: between(-12, 12) * speed,
      vy: between(-34, -12) * speed,
      radius: between(1.2, glow ? 2.6 : 2.2),
      color: pick(theme.colors),
      phase: Math.random() * Math.PI * 2,
      age: 0,
      life: between(1.1, 2),
    });
  };

  return {
    move(x, y) {
      travelled += Math.hypot(x - lastX, y - lastY);
      lastX = x;
      lastY = y;
      // One mote for every so many pixels travelled, not every event
      while (travelled > 16) {
        travelled -= 16;
        addMote(x + between(-4, 4), y + between(-4, 4));
      }
    },
    down(x, y) {
      for (let i = 0; i < 8; i++) addMote(x, y, 2);
      for (let i = 0; i < 3; i++) {
        leaves.push({
          x,
          y,
          vx: between(-50, 50),
          vy: between(-90, -40),
          angle: Math.random() * Math.PI * 2,
          spin: between(-4, 4),
          size: between(5, 8),
          color: theme.primary,
          age: 0,
          life: between(1.2, 1.7),
        });
      }
    },
    frame(context, seconds, now) {
      context.globalCompositeOperation = glow ? "lighter" : "source-over";
      for (const mote of motes) {
        mote.age += seconds;
        // Wander side to side as they rise
        mote.x += (mote.vx + Math.sin(now / 300 + mote.phase) * 14) * seconds;
        mote.y += mote.vy * seconds;
        const t = mote.age / mote.life;
        const twinkle = 0.6 + 0.4 * Math.sin(now / 120 + mote.phase);
        context.globalAlpha = Math.sin(Math.PI * t) * twinkle * (glow ? 0.9 : 0.7);
        context.fillStyle = mote.color;
        if (glow) {
          context.shadowColor = mote.color;
          context.shadowBlur = 10;
        }
        context.beginPath();
        context.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.shadowBlur = 0;
      context.globalCompositeOperation = "source-over";

      for (const leaf of leaves) {
        leaf.age += seconds;
        leaf.vy += 140 * seconds;
        leaf.vx *= 0.97;
        leaf.x += (leaf.vx + Math.sin(leaf.age * 5) * 30) * seconds;
        leaf.y += leaf.vy * seconds * 0.6;
        leaf.angle += leaf.spin * seconds;
        context.globalAlpha = 1 - (leaf.age / leaf.life) ** 2;
        context.fillStyle = leaf.color;
        context.save();
        context.translate(leaf.x, leaf.y);
        context.rotate(leaf.angle);
        context.beginPath();
        context.ellipse(0, 0, leaf.size, leaf.size * 0.45, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      prune(motes);
      prune(leaves);
      return motes.length + leaves.length > 0;
    },
  };
};

export default fireflies;
