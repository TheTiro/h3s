"use client";

import { useEffect, useRef, type RefObject } from "react";
import { curlNoise } from "@/lib/curl-noise";
import {
  buildWaypoints,
  createPathSampler,
  particleBudget,
  pixelRatioCap,
} from "@/lib/enter-particle-path";
import { h3MorphWeight, sampleH3Points } from "@/lib/h3-glyph";

const ENTER_CYAN = { r: 58 / 255, g: 212 / 255, b: 232 / 255 };

const VERT = /* glsl */ `
attribute float aSize;
attribute float aSeed;
uniform float uPixelRatio;
varying float vAlpha;
varying float vSeed;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float att = 320.0 / max(-mv.z, 48.0);
  gl_PointSize = clamp(aSize * att * uPixelRatio, 2.0, 42.0);
  float depthFade = smoothstep(-40.0, 90.0, mv.z);
  vAlpha = mix(0.22, 0.95, 1.0 - depthFade);
  vSeed = aSeed;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
varying float vSeed;
void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv) * 2.0;
  if (d > 1.0) discard;
  float core = exp(-d * d * 10.0);
  float halo = exp(-d * d * 2.15);
  float spark = mix(0.72, 1.18, fract(vSeed * 13.37));
  float alpha = (core * 0.92 + halo * 0.38) * vAlpha * spark;
  vec3 col = uColor * (0.48 + core * 1.35);
  gl_FragColor = vec4(col, alpha);
}
`;

type Sampler = ReturnType<typeof createPathSampler>;

export function EnterParticles({
  logoRef,
  enterRef,
}: {
  logoRef: RefObject<Element | null>;
  enterRef: RefObject<Element | null>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const count = particleBudget();
    if (count <= 0) return;

    let disposed = false;
    let stop = () => {};

    void import("three").then((THREE) => {
      if (disposed || !hostRef.current) return;
      stop = boot(THREE, host, logoRef, enterRef, count);
    });

    return () => {
      disposed = true;
      stop();
    };
  }, [logoRef, enterRef]);

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    />
  );
}

function boot(
  THREE: typeof import("three"),
  host: HTMLDivElement,
  logoRef: RefObject<Element | null>,
  enterRef: RefObject<Element | null>,
  count: number
) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
    premultipliedAlpha: false,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = true;
  renderer.domElement.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0;";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 1, 2400);
  camera.position.set(0, 0, 900);

  const RIBBON = 1;
  const LEADER_SPEED = 0.056;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const lag = new Float32Array(count);
  const sizes = new Float32Array(count);
  const baseSize = new Float32Array(count);
  const seeds = new Float32Array(count);
  const radius = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    seeds[i] = Math.random();
    baseSize[i] = 5 + Math.random() * 8;
    sizes[i] = baseSize[i]!;
    lag[i] = Math.random();
    radius[i] = 3 + Math.random() * 7;
  }

  const geometry = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
  const sizeAttr = new THREE.BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", posAttr);
  geometry.setAttribute("aSize", sizeAttr);
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(ENTER_CYAN.r, ENTER_CYAN.g, ENTER_CYAN.b) },
      uPixelRatio: { value: 1 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  const mouse = { x: 0, y: 0, active: false };
  const curl = { x: 0, y: 0, z: 0 };
  let sampler: Sampler | null = null;
  const h3X = new Float32Array(count);
  const h3Y = new Float32Array(count);
  let h3Ready = false;
  let h3Key = "";
  let spawned = false;
  let leader = 0;
  const bootAt = performance.now();
  let liveCount = count;
  let slowFrames = 0;
  let viewW = 1;
  let viewH = 1;
  let scale = 1;
  let raf = 0;
  let last = performance.now();
  let lastPath = 0;

  const toWorld = (sx: number, sy: number, z: number) => {
    return {
      x: (sx - viewW * 0.5) * scale,
      y: (viewH * 0.5 - sy) * scale,
      z,
    };
  };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    viewW = Math.max(1, rect.width);
    viewH = Math.max(1, rect.height);
    const dpr = pixelRatioCap();
    renderer.setPixelRatio(dpr);
    renderer.setSize(viewW, viewH, false);
    camera.aspect = viewW / viewH;
    camera.updateProjectionMatrix();
    const vFov = (camera.fov * Math.PI) / 180;
    const worldH = 2 * camera.position.z * Math.tan(vFov / 2);
    scale = worldH / viewH;
    material.uniforms.uPixelRatio!.value = dpr;
    rebuildPath(true);
  };

  const rebuildPath = (force = false) => {
    const now = performance.now();
    if (!force && now - lastPath < 80) return;
    const enter = enterRef.current?.getBoundingClientRect();
    const logo = logoRef.current?.getBoundingClientRect();
    const hostBox = host.getBoundingClientRect();
    if (!enter || enter.width < 8) return;
    lastPath = now;
    const localEnter = new DOMRect(
      enter.left - hostBox.left,
      enter.top - hostBox.top,
      enter.width,
      enter.height
    );
    sampler = createPathSampler(buildWaypoints(localEnter));

    const logoBottom = logo ? logo.bottom - hostBox.top : 24;
    const gapTop = logoBottom + 10;
    const gapBottom = localEnter.top - 10;
    const h3H = Math.max(36, gapBottom - gapTop);
    const h3W = Math.min(localEnter.width * 1.65, Math.max(h3H * 1.72, 150));
    const box = {
      left: localEnter.left + localEnter.width / 2 - h3W / 2,
      top: gapTop + Math.max(0, (gapBottom - gapTop - h3H) / 2),
      width: h3W,
      height: Math.min(h3H, gapBottom - gapTop),
    };
    const key = `${Math.round(box.left / 16)}:${Math.round(box.top / 16)}:${Math.round(box.width / 16)}:${Math.round(box.height / 16)}:${count}`;
    if (key !== h3Key && box.height >= 28) {
      const pts = sampleH3Points(count, box);
      if (pts.length === count) {
        for (let i = 0; i < count; i++) {
          h3X[i] = pts[i]!.x;
          h3Y[i] = pts[i]!.y;
        }
        h3Ready = true;
        h3Key = key;
      }
    }
  };

  const onPointer = (e: PointerEvent) => {
    const box = host.getBoundingClientRect();
    mouse.x = e.clientX - box.left;
    mouse.y = e.clientY - box.top;
    mouse.active = true;
  };
  const onLeave = () => {
    mouse.active = false;
  };

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    if (document.hidden) {
      last = now;
      return;
    }
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.05) dt = 0.05;

    if (dt > 0.033) slowFrames += 1;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 50 && liveCount > 400) {
      liveCount = Math.max(400, Math.floor(liveCount * 0.72));
      slowFrames = 0;
    }

    rebuildPath();
    if (!sampler) return;

    if (!spawned) {
      for (let i = 0; i < count; i++) {
        const here = sampler.sample(lag[i]!);
        const ang = seeds[i]! * Math.PI * 2;
        const spawn = toWorld(
          here.x + Math.cos(ang) * 4,
          here.y + Math.sin(ang) * 3,
          Math.sin(ang * 2) * 8
        );
        const i3 = i * 3;
        positions[i3] = spawn.x;
        positions[i3 + 1] = spawn.y;
        positions[i3 + 2] = spawn.z;
      }
      spawned = true;
    }

    const morphElapsed = (now - bootAt) / 1000;
    leader = (leader + LEADER_SPEED * dt * (1 - h3MorphWeight(morphElapsed) * 0.85)) % 1;
    const morph = h3Ready ? h3MorphWeight(morphElapsed) : 0;
    const t = now * 0.001;
    const mouseW = toWorld(mouse.x, mouse.y, 0);
    const repelR = 150 * scale;
    const repelR2 = repelR * repelR;
    const follow = 1 - Math.exp(-(6.8 + morph * 26) * dt);
    const damp = Math.exp(-5.4 * dt);
    const curlAmt = 14 * (1 - morph);

    for (let i = 0; i < liveCount; i++) {
      const seed = seeds[i]!;
      const u = lag[i]! / RIBBON;
      const taper = 0.85 + 0.15 * Math.sin(u * Math.PI * 2);
      const s = (leader + lag[i]!) % 1;
      const look = sampler.sample(s + 0.01);
      const ang = seed * Math.PI * 2;
      const rad = radius[i]! * taper * (1 - morph);
      const nx = -look.ty;
      const ny = look.tx;
      const ox = (nx * Math.cos(ang) + look.tx * Math.sin(ang) * 0.2) * rad;
      const oy = (ny * Math.cos(ang) + look.ty * Math.sin(ang) * 0.2) * rad;
      const oz = Math.sin(ang * 1.8 + s * 14.0) * 10 * (1 - morph);
      sizes[i] = baseSize[i]!;

      const circle = toWorld(look.x + ox, look.y + oy, oz);
      const glyph = toWorld(h3X[i]!, h3Y[i]!, 0);
      const target = {
        x: circle.x + (glyph.x - circle.x) * morph,
        y: circle.y + (glyph.y - circle.y) * morph,
        z: circle.z + (glyph.z - circle.z) * morph,
      };
      const i3 = i * 3;
      let px = positions[i3]!;
      let py = positions[i3 + 1]!;
      let pz = positions[i3 + 2]!;

      curlNoise(px * 0.008, py * 0.008, t * 0.11 + seed * 4, curl);

      px += (target.x - px) * follow + curl.x * curlAmt * dt;
      py += (target.y - py) * follow + curl.y * curlAmt * dt;
      pz += (target.z - pz) * follow + curl.z * (curlAmt * 0.55) * dt;

      let vx = velocities[i3]!;
      let vy = velocities[i3 + 1]!;
      let vz = velocities[i3 + 2]!;

      if (mouse.active && morph < 0.4) {
        const dx = px - mouseW.x;
        const dy = py - mouseW.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < repelR2) {
          const d = Math.sqrt(d2) + 1e-4;
          const f = 1 - d / repelR;
          const mag = f * f * 2400 * dt;
          vx += (dx / d) * mag;
          vy += (dy / d) * mag;
          vx += (-dy / d) * f * 580 * dt;
          vy += (dx / d) * f * 580 * dt;
        }
      }

      vx *= damp;
      vy *= damp;
      vz *= damp;
      px += vx * dt;
      py += vy * dt;
      pz += vz * dt;

      positions[i3] = px;
      positions[i3 + 1] = py;
      positions[i3 + 2] = pz;
      velocities[i3] = vx;
      velocities[i3 + 1] = vy;
      velocities[i3 + 2] = vz;
    }

    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    geometry.setDrawRange(0, liveCount);
    renderer.render(scene, camera);
  };

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  window.addEventListener("pointerleave", onLeave);
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("pointerdown", onPointer);
    window.removeEventListener("pointerleave", onLeave);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
