// Ranger: thruster exhaust trailing the pointer, and on click twin laser
// beams from the corners of the screen, striking with a flash, a shockwave,
// sparks and crackling arcs of lightning

import { between, pick, prune, type CursorEffectFactory } from "./types";

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  age: number;
  life: number;
}

interface Beam {
  fromX: number;
  fromY: number;
  x: number;
  y: number;
  age: number;
  life: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  age: number;
  life: number;
}

interface Impact {
  x: number;
  y: number;
  /** Directions of the lightning arcs, in radians. */
  arcs: number[];
  age: number;
  life: number;
}

const MAX_EMBERS = 90;
const MAX_SPARKS = 160;

/** A jagged line out from (x, y), different every frame so it crackles. */
function arc(context: CanvasRenderingContext2D, x: number, y: number, angle: number, length: number) {
  const steps = 5;
  context.beginPath();
  context.moveTo(x, y);
  for (let i = 1; i <= steps; i++) {
    const along = (length * i) / steps;
    const off = i === steps ? 0 : between(-0.35, 0.35) * (length / steps);
    context.lineTo(
      x + Math.cos(angle) * along - Math.sin(angle) * off,
      y + Math.sin(angle) * along + Math.cos(angle) * off,
    );
  }
  context.stroke();
}

const laser: CursorEffectFactory = (theme) => {
  const dark = theme.scheme === "dark";
  // White hot cores read on the dark theme; on the light one they'd vanish
  const core = dark ? "#ffffff" : theme.heading;
  const embers: Ember[] = [];
  const beams: Beam[] = [];
  const sparks: Spark[] = [];
  const impacts: Impact[] = [];
  let lastX = 0;
  let lastY = 0;
  let placed = false;
  let travelled = 0;

  return {
    move(x, y) {
      const dx = placed ? x - lastX : 0;
      const dy = placed ? y - lastY : 0;
      placed = true;
      lastX = x;
      lastY = y;
      travelled += Math.hypot(dx, dy);
      while (travelled > 9) {
        travelled -= 9;
        if (embers.length >= MAX_EMBERS) embers.shift();
        // Blown back the way the pointer came, like exhaust
        embers.push({
          x: x + between(-2, 2),
          y: y + between(-2, 2),
          vx: -dx * between(4, 9) + between(-15, 15),
          vy: -dy * between(4, 9) + between(-15, 15),
          size: between(1.2, 3),
          color: pick(theme.colors),
          age: 0,
          life: between(0.25, 0.5),
        });
      }
    },
    down(x, y) {
      const bottom = innerHeight + 10;
      beams.push(
        { fromX: -10, fromY: bottom, x, y, age: 0, life: 0.2 },
        { fromX: innerWidth + 10, fromY: bottom, x, y, age: -0.05, life: 0.2 },
      );
      impacts.push({
        x,
        y,
        arcs: Array.from({ length: 3 }, (_, i) => (i / 3) * Math.PI * 2 + between(-0.6, 0.6)),
        age: 0,
        life: 0.5,
      });
      for (let i = 0; i < 18; i++) {
        if (sparks.length >= MAX_SPARKS) sparks.shift();
        const angle = Math.random() * Math.PI * 2;
        const speed = between(120, 380);
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 60,
          color: pick([...theme.colors, core]),
          age: 0,
          life: between(0.3, 0.6),
        });
      }
    },
    frame(context, seconds) {
      context.save();
      if (dark) context.globalCompositeOperation = "lighter";
      context.lineCap = "round";
      context.lineJoin = "round";

      for (const e of embers) {
        e.age += seconds;
        e.vx *= 0.9;
        e.vy *= 0.9;
        e.x += e.vx * seconds;
        e.y += e.vy * seconds;
        const t = e.age / e.life;
        context.globalAlpha = (1 - t) * 0.85;
        context.fillStyle = e.color;
        context.beginPath();
        context.arc(e.x, e.y, e.size * (1 - t * 0.6), 0, Math.PI * 2);
        context.fill();
      }

      for (const b of beams) {
        b.age += seconds;
        if (b.age < 0) continue;
        const t = b.age / b.life;
        // A glow around a hot core, thinning out as it fades
        context.globalAlpha = (1 - t) * 0.35;
        context.strokeStyle = theme.accent;
        context.lineWidth = 9 * (1 - t) + 2;
        context.beginPath();
        context.moveTo(b.fromX, b.fromY);
        context.lineTo(b.x, b.y);
        context.stroke();
        context.globalAlpha = 1 - t;
        context.strokeStyle = core;
        context.lineWidth = 2.5 * (1 - t) + 0.5;
        context.stroke();
      }

      for (const impact of impacts) {
        impact.age += seconds;
        const t = impact.age / impact.life;

        // The flash, then a shockwave ring
        if (t < 0.3) {
          context.globalAlpha = 1 - t / 0.3;
          context.fillStyle = core;
          context.beginPath();
          context.arc(impact.x, impact.y, 12 * (1 - t / 0.3) + 2, 0, Math.PI * 2);
          context.fill();
        }
        context.globalAlpha = (1 - t) * 0.9;
        context.strokeStyle = theme.link;
        context.lineWidth = 2.5 * (1 - t) + 0.5;
        context.beginPath();
        context.arc(impact.x, impact.y, 4 + t * 46, 0, Math.PI * 2);
        context.stroke();

        if (t < 0.55) {
          context.globalAlpha = 1 - t / 0.55;
          context.strokeStyle = theme.primary;
          context.lineWidth = 1.5;
          for (const angle of impact.arcs) arc(context, impact.x, impact.y, angle, 18 + t * 50);
        }
      }

      for (const s of sparks) {
        s.age += seconds;
        s.vy += 500 * seconds;
        s.vx *= 0.97;
        s.x += s.vx * seconds;
        s.y += s.vy * seconds;
        const t = s.age / s.life;
        context.globalAlpha = 1 - t;
        context.strokeStyle = s.color;
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(s.x, s.y);
        context.lineTo(s.x - s.vx * 0.025, s.y - s.vy * 0.025);
        context.stroke();
      }

      context.restore();
      prune(embers);
      prune(beams);
      prune(sparks);
      prune(impacts);
      return embers.length + beams.length + sparks.length + impacts.length > 0;
    },
  };
};

export default laser;
