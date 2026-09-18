/** Improved Perlin 3D + curl field for organic particle drift. */

const perm = new Uint8Array(512);

(function seedPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let n = 256;
  let s = 16807;
  while (n > 0) {
    s = (s * 16807) % 2147483647;
    const r = s % n;
    n -= 1;
    const tmp = p[n]!;
    p[n] = p[r]!;
    p[r] = tmp;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]!;
})();

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number, z: number) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

export function perlin3(x: number, y: number, z: number) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const zf = z - Math.floor(z);
  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);
  const A = perm[X]! + Y;
  const AA = perm[A]! + Z;
  const AB = perm[A + 1]! + Z;
  const B = perm[X + 1]! + Y;
  const BA = perm[B]! + Z;
  const BB = perm[B + 1]! + Z;
  return lerp(
    lerp(
      lerp(grad(perm[AA]!, xf, yf, zf), grad(perm[BA]!, xf - 1, yf, zf), u),
      lerp(grad(perm[AB]!, xf, yf - 1, zf), grad(perm[BB]!, xf - 1, yf - 1, zf), u),
      v
    ),
    lerp(
      lerp(grad(perm[AA + 1]!, xf, yf, zf - 1), grad(perm[BA + 1]!, xf - 1, yf, zf - 1), u),
      lerp(
        grad(perm[AB + 1]!, xf, yf - 1, zf - 1),
        grad(perm[BB + 1]!, xf - 1, yf - 1, zf - 1),
        u
      ),
      v
    ),
    w
  );
}

const CURL_EPS = 0.14;

/** 2D curl of a Perlin potential, plus a light Z wobble. */
export function curlNoise(
  x: number,
  y: number,
  z: number,
  out: { x: number; y: number; z: number }
) {
  const nY1 = perlin3(x, y + CURL_EPS, z);
  const nY0 = perlin3(x, y - CURL_EPS, z);
  const nX1 = perlin3(x + CURL_EPS, y, z);
  const nX0 = perlin3(x - CURL_EPS, y, z);
  const inv = 0.5 / CURL_EPS;
  out.x = (nY1 - nY0) * inv;
  out.y = -(nX1 - nX0) * inv;
  out.z = perlin3(x + 19.1, y + 5.7, z + 8.3) * 0.65;
}
