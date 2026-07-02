// Surface materials for floors and walls. A material is the blueprint (floor only),
// a flat paint colour, a built-in procedural material (from the MATERIALS registry
// below), or a user-uploaded photo. Procedural textures tile at real-world scale.

import * as THREE from "three";

export type SurfaceMat =
  | { kind: "plan" }
  | { kind: "color"; color: string }
  | { kind: "material"; id: string }
  | { kind: "image"; src: string };

function canvas(size = 256): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return [c, c.getContext("2d")!];
}

function noise(ctx: CanvasRenderingContext2D, n: number, alpha: number, color: string) {
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    ctx.globalAlpha = Math.random() * alpha;
    const x = Math.random() * 256, y = Math.random() * 256, r = Math.random() * 2 + 0.5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── procedural pattern painters (each fills a 256×256 canvas) ───────────────
function planks(ctx: CanvasRenderingContext2D, base: string, grainA: string, grainB: string) {
  ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 42) {
    ctx.fillStyle = "rgba(40,25,10,0.45)"; ctx.fillRect(0, y, 256, 2);
    ctx.fillStyle = "rgba(255,235,200,0.12)"; ctx.fillRect(0, y + 3, 256, 1);
  }
  for (let i = 0; i < 44; i++) {
    ctx.strokeStyle = i % 2 ? grainA : grainB;
    ctx.globalAlpha = 0.22; ctx.lineWidth = Math.random() * 1.5 + 0.4;
    const y = Math.random() * 256; ctx.beginPath(); ctx.moveTo(0, y);
    ctx.bezierCurveTo(85, y + (Math.random() - 0.5) * 10, 170, y + (Math.random() - 0.5) * 10, 256, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function tiles(ctx: CanvasRenderingContext2D, base: string, grout: string, n: number, jitter = 0) {
  ctx.fillStyle = grout; ctx.fillRect(0, 0, 256, 256);
  const step = 256 / n, gap = Math.max(3, step * 0.06);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (jitter) {
      const j = 1 + (Math.random() - 0.5) * jitter;
      ctx.fillStyle = shade(base, j);
    } else ctx.fillStyle = base;
    ctx.fillRect(c * step + gap / 2, r * step + gap / 2, step - gap, step - gap);
  }
  noise(ctx, 1200, 0.04, "#ffffff");
}

function checker(ctx: CanvasRenderingContext2D, a: string, b: string) {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    ctx.fillStyle = (r + c) % 2 ? a : b;
    ctx.fillRect(c * 64, r * 64, 64, 64);
  }
}

function veins(ctx: CanvasRenderingContext2D, base: string, vein: string, count: number) {
  ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < count; i++) {
    ctx.strokeStyle = vein; ctx.globalAlpha = 0.1 + Math.random() * 0.3; ctx.lineWidth = Math.random() * 2 + 0.4;
    ctx.beginPath(); ctx.moveTo(Math.random() * 256, 0);
    ctx.bezierCurveTo(Math.random() * 256, 85, Math.random() * 256, 170, Math.random() * 256, 256); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// soft mottled wash — the look of plaster / lime / clay
function mottle(ctx: CanvasRenderingContext2D, base: string, blobs: string[]) {
  ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
  ctx.save(); ctx.filter = "blur(10px)";
  for (let i = 0; i < 26; i++) {
    ctx.globalAlpha = 0.05 + Math.random() * 0.13;
    ctx.fillStyle = blobs[i % blobs.length];
    const x = Math.random() * 256, y = Math.random() * 256, rr = 20 + Math.random() * 60;
    ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore(); ctx.globalAlpha = 1;
  noise(ctx, 900, 0.04, "#ffffff"); noise(ctx, 700, 0.04, "#000000");
}

// vertical brushy streaks — limewash
function limewash(ctx: CanvasRenderingContext2D, base: string, streak: string) {
  ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
  ctx.save(); ctx.filter = "blur(3px)";
  for (let i = 0; i < 70; i++) {
    ctx.globalAlpha = 0.03 + Math.random() * 0.08;
    ctx.strokeStyle = streak; ctx.lineWidth = 2 + Math.random() * 9;
    const x = Math.random() * 256; ctx.beginPath(); ctx.moveTo(x, -10);
    ctx.lineTo(x + (Math.random() - 0.5) * 22, 266); ctx.stroke();
  }
  ctx.restore(); ctx.globalAlpha = 1;
}

// earthy mottle + fine cracks — mud / clay
function mud(ctx: CanvasRenderingContext2D, base: string) {
  mottle(ctx, base, ["#7d5532", "#b88a5c", "#6b4a2c"]);
  ctx.strokeStyle = "rgba(60,40,22,0.4)"; ctx.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    ctx.globalAlpha = 0.4; ctx.beginPath();
    let x = Math.random() * 256, y = Math.random() * 256; ctx.moveTo(x, y);
    for (let s = 0; s < 4; s++) { x += (Math.random() - 0.5) * 60; y += (Math.random() - 0.5) * 60; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function bricks(ctx: CanvasRenderingContext2D, base: string, mortar: string) {
  ctx.fillStyle = mortar; ctx.fillRect(0, 0, 256, 256);
  const bh = 32, bw = 64, gap = 4;
  for (let r = 0; r < 8; r++) {
    const off = (r % 2) * (bw / 2);
    for (let c = -1; c < 5; c++) {
      ctx.fillStyle = shade(base, 1 + (Math.random() - 0.5) * 0.18);
      ctx.fillRect(c * bw + off + gap / 2, r * bh + gap / 2, bw - gap, bh - gap);
    }
  }
}

function speckle(ctx: CanvasRenderingContext2D, base: string, a: string, b: string) {
  ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
  noise(ctx, 5000, 0.18, a); noise(ctx, 3000, 0.14, b);
}

// multiply a hex colour by a factor (for per-tile/brick variation)
function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * f));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * f));
  const b = Math.min(255, Math.round((n & 255) * f));
  return `rgb(${r},${g},${b})`;
}

// ── the material registry ───────────────────────────────────────────────────
export type MatCategory = "Wood" | "Tile" | "Stone" | "Concrete" | "Plaster & Lime" | "Brick";

export interface MaterialDef {
  id: string;
  name: string;
  category: MatCategory;
  base: string;       // swatch / fallback colour
  roughness: number;
  metalness?: number;
  tileM: number;      // real-world metres per texture tile
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export const MATERIALS: MaterialDef[] = [
  // Wood
  { id: "oak", name: "Oak", category: "Wood", base: "#c09255", roughness: 0.6, tileM: 1.2, draw: (c) => planks(c, "#c09255", "#8a6230", "#d8b07e") },
  { id: "walnut", name: "Walnut", category: "Wood", base: "#6b4a2f", roughness: 0.55, tileM: 1.2, draw: (c) => planks(c, "#6b4a2f", "#3f2a18", "#8a6240") },
  { id: "ash", name: "Pale Ash", category: "Wood", base: "#d8c2a0", roughness: 0.6, tileM: 1.2, draw: (c) => planks(c, "#d8c2a0", "#b09a76", "#efe3cc") },
  { id: "ebony", name: "Dark Wood", category: "Wood", base: "#3b2a1f", roughness: 0.5, tileM: 1.2, draw: (c) => planks(c, "#3b2a1f", "#211710", "#54392a") },
  // Tile
  { id: "tile-white", name: "White Tile", category: "Tile", base: "#dadbdd", roughness: 0.35, tileM: 0.45, draw: (c) => tiles(c, "#e6e7e9", "#a7a9ad", 2) },
  { id: "tile-terracotta", name: "Terracotta", category: "Tile", base: "#b5654a", roughness: 0.7, tileM: 0.4, draw: (c) => tiles(c, "#b5654a", "#7d4632", 3, 0.18) },
  { id: "tile-slate", name: "Slate Tile", category: "Tile", base: "#454b52", roughness: 0.6, tileM: 0.5, draw: (c) => tiles(c, "#454b52", "#2c3036", 2, 0.2) },
  { id: "tile-checker", name: "Checkerboard", category: "Tile", base: "#cccccc", roughness: 0.3, tileM: 0.5, draw: (c) => checker(c, "#ededed", "#2c2c2c") },
  // Stone
  { id: "marble-white", name: "White Marble", category: "Stone", base: "#eef0f2", roughness: 0.25, tileM: 2.0, draw: (c) => veins(c, "#eef0f2", "#9aa0aa", 16) },
  { id: "marble-grey", name: "Grey Marble", category: "Stone", base: "#cdd2d6", roughness: 0.25, tileM: 2.0, draw: (c) => veins(c, "#cdd2d6", "#6b7178", 18) },
  { id: "travertine", name: "Travertine", category: "Stone", base: "#d8c8a8", roughness: 0.6, tileM: 1.6, draw: (c) => mottle(c, "#d8c8a8", ["#c2ad86", "#e7dcc4"]) },
  { id: "granite", name: "Granite", category: "Stone", base: "#6b6e72", roughness: 0.4, tileM: 1.4, draw: (c) => speckle(c, "#6b6e72", "#3a3c40", "#cfd2d6") },
  // Concrete
  { id: "concrete", name: "Concrete", category: "Concrete", base: "#c4c5c2", roughness: 0.85, tileM: 1.5, draw: (c) => speckle(c, "#c4c5c2", "#8f9089", "#e6e7e3") },
  { id: "concrete-polished", name: "Polished Concrete", category: "Concrete", base: "#b8b9b6", roughness: 0.45, tileM: 2.2, draw: (c) => mottle(c, "#b8b9b6", ["#a4a5a2", "#cccdca"]) },
  // Plaster & Lime
  { id: "plaster-white", name: "White Plaster", category: "Plaster & Lime", base: "#ece8e0", roughness: 0.92, tileM: 2.6, draw: (c) => mottle(c, "#ece8e0", ["#ddd8cd", "#f6f3ec"]) },
  { id: "lime-plaster", name: "Lime Plaster", category: "Plaster & Lime", base: "#e3ddcf", roughness: 0.95, tileM: 2.8, draw: (c) => mottle(c, "#e3ddcf", ["#d2cab7", "#f0ebdd"]) },
  { id: "limewash-white", name: "Limewash White", category: "Plaster & Lime", base: "#eae6dd", roughness: 0.95, tileM: 2.6, draw: (c) => limewash(c, "#eae6dd", "#d3ccbd") },
  { id: "limewash-ochre", name: "Limewash Ochre", category: "Plaster & Lime", base: "#c9a96e", roughness: 0.95, tileM: 2.6, draw: (c) => limewash(c, "#c9a96e", "#a8853f") },
  { id: "limewash-terra", name: "Limewash Terracotta", category: "Plaster & Lime", base: "#bd7d5e", roughness: 0.95, tileM: 2.6, draw: (c) => limewash(c, "#bd7d5e", "#9a5b3e") },
  { id: "tadelakt", name: "Tadelakt", category: "Plaster & Lime", base: "#c9b9a3", roughness: 0.4, tileM: 2.4, draw: (c) => mottle(c, "#c9b9a3", ["#b6a589", "#dccdb5"]) },
  { id: "venetian", name: "Venetian Plaster", category: "Plaster & Lime", base: "#d9cfc0", roughness: 0.5, tileM: 2.6, draw: (c) => mottle(c, "#d9cfc0", ["#c6baa6", "#ece3d4"]) },
  { id: "clay", name: "Clay / Mud", category: "Plaster & Lime", base: "#a9794f", roughness: 0.95, tileM: 2.2, draw: (c) => mud(c, "#a9794f") },
  // Brick
  { id: "brick-red", name: "Red Brick", category: "Brick", base: "#9e5b43", roughness: 0.85, tileM: 0.9, draw: (c) => bricks(c, "#9e5b43", "#cabfae") },
  { id: "brick-white", name: "Whitewashed Brick", category: "Brick", base: "#d8d2c8", roughness: 0.9, tileM: 0.9, draw: (c) => bricks(c, "#d8d2c8", "#efebe3") },
];

export const MATERIAL_CATEGORIES: MatCategory[] = ["Wood", "Tile", "Stone", "Concrete", "Plaster & Lime", "Brick"];

const MAT_BY_ID = new Map(MATERIALS.map((m) => [m.id, m]));
export function materialDef(id: string): MaterialDef | undefined { return MAT_BY_ID.get(id); }
export function materialTileM(id: string): number { return MAT_BY_ID.get(id)?.tileM ?? 1.5; }

function configure(t: THREE.Texture): THREE.Texture {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function proceduralTexture(id: string): THREE.Texture | null {
  const def = MAT_BY_ID.get(id);
  if (!def) return null;
  const [c, ctx] = canvas();
  def.draw(ctx);
  return configure(new THREE.CanvasTexture(c));
}

// A soft outdoor lawn texture for the world ground plane (mottled greens).
export function grassTexture(): THREE.Texture {
  const [c, ctx] = canvas(256);
  ctx.fillStyle = "#7e9b5b"; ctx.fillRect(0, 0, 256, 256);
  noise(ctx, 6000, 0.22, "#6b8a49");
  noise(ctx, 4000, 0.18, "#90ab6a");
  noise(ctx, 1500, 0.12, "#586f3c");
  return configure(new THREE.CanvasTexture(c));
}

export function imageTexture(src: string): THREE.Texture {
  return configure(new THREE.TextureLoader().load(src));
}
