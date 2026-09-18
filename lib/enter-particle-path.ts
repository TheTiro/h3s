export type Vec2 = { x: number; y: number };

export type PathSample = {
  x: number;
  y: number;
  tx: number;
  ty: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function catmull(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

/** Closed circle around the Enter label. */
export function buildWaypoints(enter: DOMRect): Vec2[] {
  const cx = enter.left + enter.width / 2;
  const cy = enter.top + enter.height / 2;
  const r = Math.max(enter.width * 0.48, enter.height * 0.9) + 10;
  const steps = 28;
  const pts: Vec2[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

export function createPathSampler(waypoints: Vec2[]) {
  const n = waypoints.length;
  const dense: Vec2[] = [];
  const segs = 12;
  for (let i = 0; i < n; i++) {
    const p0 = waypoints[(i - 1 + n) % n]!;
    const p1 = waypoints[i]!;
    const p2 = waypoints[(i + 1) % n]!;
    const p3 = waypoints[(i + 2) % n]!;
    for (let s = 0; s < segs; s++) {
      const t = s / segs;
      dense.push({
        x: catmull(p0.x, p1.x, p2.x, p3.x, t),
        y: catmull(p0.y, p1.y, p2.y, p3.y, t),
      });
    }
  }

  const m = dense.length;
  const cum = new Float32Array(m + 1);
  for (let i = 0; i < m; i++) {
    const a = dense[i]!;
    const b = dense[(i + 1) % m]!;
    cum[i + 1] = cum[i]! + Math.hypot(b.x - a.x, b.y - a.y);
  }
  const total = cum[m]!;

  const sample = (s: number): PathSample => {
    const d = (((s % 1) + 1) % 1) * total;
    let lo = 0;
    let hi = m;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid]! < d) lo = mid + 1;
      else hi = mid;
    }
    const i = Math.max(1, lo) - 1;
    const span = cum[i + 1]! - cum[i]!;
    const u = span > 1e-6 ? (d - cum[i]!) / span : 0;
    const a = dense[i]!;
    const b = dense[(i + 1) % m]!;
    let tx = b.x - a.x;
    let ty = b.y - a.y;
    const len = Math.hypot(tx, ty) || 1;
    return {
      x: lerp(a.x, b.x, u),
      y: lerp(a.y, b.y, u),
      tx: tx / len,
      ty: ty / len,
    };
  };

  return { sample, length: total };
}

export function particleBudget() {
  if (typeof window === "undefined") return 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  return 1000;
}

export function pixelRatioCap() {
  if (typeof window === "undefined") return 1;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const dpr = window.devicePixelRatio || 1;
  if (coarse || window.innerWidth < 768) return 1;
  return Math.min(dpr, 1.75);
}
