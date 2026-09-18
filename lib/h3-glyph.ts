import type { Vec2 } from "@/lib/enter-particle-path";

function shufflePick(hits: Vec2[], count: number): Vec2[] {
  if (hits.length === 0) return [];
  const copy = hits.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  const out: Vec2[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const base = copy[i % copy.length]!;
    const jitter = i >= copy.length ? 1.1 : 0;
    out[i] = {
      x: base.x + (Math.random() - 0.5) * jitter,
      y: base.y + (Math.random() - 0.5) * jitter,
    };
  }
  return out;
}

/** Sample filled “H3” glyph points inside a host-space box. */
export function sampleH3Points(
  count: number,
  box: { left: number; top: number; width: number; height: number }
): Vec2[] {
  const w = Math.max(32, Math.round(box.width));
  const h = Math.max(24, Math.round(box.height));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  const family = getComputedStyle(document.body).fontFamily || "sans-serif";
  const fontSize = Math.floor(h * 0.9);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${fontSize}px ${family}`;
  const hWidth = ctx.measureText("H").width;
  const threeWidth = ctx.measureText("3").width;
  const letterGap = fontSize * 0.08;
  const total = hWidth + letterGap + threeWidth;
  const start = (w - total) / 2;
  ctx.fillText("H", start, h * 0.52);
  ctx.fillText("3", start + hWidth + letterGap, h * 0.52);

  const data = ctx.getImageData(0, 0, w, h).data;
  const hits: Vec2[] = [];
  const step = w * h > 80_000 ? 2 : 1;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3]! > 90) {
        hits.push({ x: box.left + x, y: box.top + y });
      }
    }
  }
  return shufflePick(hits, count);
}

export function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** 0 = circle, 1 = H3. Cycle: 30s circle, morph in, 3s hold, morph out. */
export function h3MorphWeight(elapsed: number) {
  const circle = 30;
  const morph = 1.6;
  const hold = 3;
  const cycle = circle + morph + hold + morph;
  const u = ((elapsed % cycle) + cycle) % cycle;
  if (u < circle) return 0;
  if (u < circle + morph) return smoothstep((u - circle) / morph);
  if (u < circle + morph + hold) return 1;
  return 1 - smoothstep((u - circle - morph - hold) / morph);
}
