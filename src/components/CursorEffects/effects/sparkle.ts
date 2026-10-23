// Kawaii: twinkling four-pointed sparkles trailing the pointer, as in anime,
// and a burst of sparkles and hearts on click

import { between, pick, prune, type CursorEffectFactory } from "./types";

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  color: string;
  heart: boolean;
  age: number;
  life: number;
}

const MAX_SPARKLES = 120;

function star(context: CanvasRenderingContext2D, size: number) {
  // Four points with concave sides
  context.beginPath();
  context.moveTo(0, -size);
  context.quadraticCurveTo(0, 0, size, 0);
  context.quadraticCurveTo(0, 0, 0, size);
  context.quadraticCurveTo(0, 0, -size, 0);
  context.quadraticCurveTo(0, 0, 0, -size);
  context.fill();
}

function heart(context: CanvasRenderingContext2D, size: number) {
  const s = size / 8;
  context.beginPath();
  context.moveTo(0, 6 * s);
  context.bezierCurveTo(-9 * s, 0, -6 * s, -7 * s, 0, -3 * s);
  context.bezierCurveTo(6 * s, -7 * s, 9 * s, 0, 0, 6 * s);
  context.fill();
}

const sparkle: CursorEffectFactory = (theme) => {
  const sparkles: Sparkle[] = [];
  // White reads on the dark theme; on the light one it would vanish
  const colors = theme.scheme === "dark" ? [...theme.colors, "#ffffff"] : theme.colors;
  let lastX = 0;
  let lastY = 0;
  let travelled = 0;

  const add = (x: number, y: number, burst = 0, isHeart = false) => {
    if (sparkles.length >= MAX_SPARKLES) sparkles.shift();
    const angle = Math.random() * Math.PI * 2;
    sparkles.push({
      x,
      y,
      vx: Math.cos(angle) * burst + between(-10, 10),
      vy: Math.sin(angle) * burst + between(-20, 5),
      size: isHeart ? between(7, 10) : between(3.5, 8),
      angle: isHeart ? between(-0.3, 0.3) : Math.random() * Math.PI,
      spin: isHeart ? 0 : between(-2, 2),
      color: isHeart ? theme.accent : pick(colors),
      heart: isHeart,
      age: 0,
      life: between(0.55, 0.95) + (burst ? 0.3 : 0),
    });
  };

  return {
    move(x, y) {
      travelled += Math.hypot(x - lastX, y - lastY);
      lastX = x;
      lastY = y;
      while (travelled > 11) {
        travelled -= 11;
        add(x + between(-6, 6), y + between(-6, 6));
      }
    },
    down(x, y) {
      for (let i = 0; i < 14; i++) add(x, y, between(60, 140));
      for (let i = 0; i < 3; i++) add(x, y, between(40, 80), true);
    },
    frame(context, seconds, now) {
      for (const s of sparkles) {
        s.age += seconds;
        s.vy += 60 * seconds;
        s.vx *= 0.96;
        s.vy *= 0.97;
        s.x += s.vx * seconds;
        s.y += s.vy * seconds;
        s.angle += s.spin * seconds;
        const t = s.age / s.life;
        // Pops in, twinkles, shrinks away
        const grow = t < 0.2 ? t / 0.2 : 1 - ((t - 0.2) / 0.8) ** 2;
        const twinkle = s.heart ? 1 : 0.75 + 0.25 * Math.sin(now / 50 + s.x);
        context.globalAlpha = Math.min(1, grow * 1.4);
        context.fillStyle = s.color;
        context.save();
        context.translate(s.x, s.y);
        context.rotate(s.angle);
        if (s.heart) heart(context, s.size * grow);
        else star(context, s.size * grow * twinkle);
        context.restore();
      }
      prune(sparkles);
      return sparkles.length > 0;
    },
  };
};

export default sparkle;
