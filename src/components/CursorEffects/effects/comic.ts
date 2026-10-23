// Magazine: a comic-book starburst with a sound effect on every click

import { between, pick, prune, type CursorEffectFactory } from "./types";

const WORDS = ["POW!", "BAM!", "ZAP!", "WOW!", "POP!", "BOOM!", "WHAM!"];

interface Burst {
  x: number;
  y: number;
  word: string;
  fill: string;
  text: string;
  angle: number;
  points: [number, number][];
  age: number;
  life: number;
}

/** Light text on dark fills, dark on light. */
function textFor(fill: string) {
  const [r = 0, g = 0, b = 0] = fill.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#161616" : "#ffffff";
}

/** A jagged star, its spikes uneven like a hand-inked one. */
function starburst(spikes: number, outer: number, inner: number): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 ? inner : outer * between(0.82, 1.1);
    const angle = (i / (spikes * 2)) * Math.PI * 2;
    points.push([Math.cos(angle) * radius * 1.25, Math.sin(angle) * radius]);
  }
  return points;
}

/** Overshoots, then settles, like something popping out. */
function easeOutBack(t: number) {
  const c = 2.2;
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
}

const comic: CursorEffectFactory = (theme) => {
  const bursts: Burst[] = [];
  const ink = "#161616";
  const shadow = theme.scheme === "dark" ? theme.accent : ink;

  return {
    down(x, y) {
      const fill = pick(theme.colors);
      bursts.push({
        x,
        y,
        word: pick(WORDS),
        fill,
        text: textFor(fill),
        angle: between(-0.25, 0.25),
        points: starburst(Math.round(between(11, 15)), 30, 19),
        age: 0,
        life: 0.75,
      });
      if (bursts.length > 6) bursts.shift();
    },
    frame(context, seconds) {
      for (const burst of bursts) {
        burst.age += seconds;
        const t = burst.age / burst.life;
        const scale = t < 0.25 ? easeOutBack(t / 0.25) : 1 + (t - 0.25) * 0.15;
        context.globalAlpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        context.save();
        context.translate(burst.x, burst.y - 6);
        context.rotate(burst.angle);
        context.scale(scale, scale);

        const trace = (dx: number, dy: number) => {
          context.beginPath();
          for (const [px, py] of burst.points) context.lineTo(px + dx, py + dy);
          context.closePath();
        };
        trace(4, 4);
        context.fillStyle = shadow;
        context.fill();
        trace(0, 0);
        context.fillStyle = burst.fill;
        context.fill();
        context.lineWidth = 2.5;
        context.lineJoin = "round";
        context.strokeStyle = ink;
        context.stroke();

        context.font = `italic 900 17px ${theme.displayFont}`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineWidth = 3;
        context.strokeStyle = burst.text === ink ? "#ffffff" : ink;
        context.strokeText(burst.word, 0, 1);
        context.fillStyle = burst.text;
        context.fillText(burst.word, 0, 1);
        context.restore();
      }
      prune(bursts);
      return bursts.length > 0;
    },
  };
};

export default comic;
