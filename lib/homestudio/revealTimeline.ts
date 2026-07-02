// Showroom reveal timeline — pure math, no React/three rendering.
// A single scroll-progress value `p` in [0,1] drives the whole cinematic reveal.
// Everything here is a pure function of `p` so the scene and the text overlay
// stay in lock-step from one source of truth.

import { Vector3 } from "three";

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const invlerp = (a: number, b: number, x: number) => clamp01((x - a) / (b - a || 1e-6));
// smoothstep — soft ease in/out (gives motion its weighty, architectural feel)
export const smooth = (t: number) => t * t * (3 - 2 * t);
// eased progress through a [a,b] window of the global scroll
export const seg = (p: number, a: number, b: number) => smooth(invlerp(a, b, p));

// ── beat windows (global scroll progress 0..1) ──────────────────────────────
export const BEATS = {
  trace: [0.10, 0.26] as [number, number], // walls draw themselves on the floor
  rise: [0.24, 0.46] as [number, number], // walls extrude upward to true height
  furnish: [0.44, 0.66] as [number, number], // furniture materialises & settles
  material: [0.62, 0.80] as [number, number], // blueprint floor → real oak; light warms
};

// ── on-screen text beats (DOM overlay) ──────────────────────────────────────
export interface TextBeat {
  id: string;
  kicker: string;
  title: string;
  sub?: string;
  at: [number, number]; // visible window in scroll progress
}
export const TEXT_BEATS: TextBeat[] = [
  { id: "b1", kicker: "01", title: "This is a plan.", sub: "A flat drawing. Nothing more.", at: [0.015, 0.10] },
  { id: "b2", kicker: "02", title: "Now watch.", sub: "The walls find themselves.", at: [0.13, 0.225] },
  { id: "b3", kicker: "03", title: "The room stands up.", sub: "Walls rise to true height.", at: [0.30, 0.43] },
  { id: "b4", kicker: "04", title: "It furnishes itself.", sub: "Every piece at its real size — never stretched to fit.", at: [0.49, 0.63] },
  { id: "b5", kicker: "05", title: "Warm light. Real materials.", sub: "Oak underfoot, soft walls.", at: [0.66, 0.77] },
  { id: "b6", kicker: "06", title: "You're standing inside.", sub: "Look around — then place it in your own room.", at: [0.90, 0.998] },
];

// ── camera path keyframes (metres; +Y up, room centred on origin) ───────────
export interface CamKey {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
}
export const CAM_KEYS: CamKey[] = [
  { p: 0.00, pos: [0.0, 9.8, 1.0], look: [0, 0.0, 0], fov: 40 },   // top-down on the blueprint
  { p: 0.20, pos: [1.0, 9.2, 3.0], look: [0, 0.2, 0], fov: 41 },   // begin tilting as walls trace
  { p: 0.42, pos: [5.6, 8.4, 7.8], look: [0, 0.3, 0], fov: 44 },   // high dollhouse as walls finish rising
  { p: 0.66, pos: [5.2, 7.4, 7.2], look: [0, 0.4, 0], fov: 46 },   // high dollhouse over the furnishing room
  { p: 0.84, pos: [2.6, 4.0, 4.6], look: [0, 0.8, 0], fov: 54 },   // swooping down toward the doorway
  { p: 1.00, pos: [0.0, 1.55, 1.5], look: [0, 0.75, -2.8], fov: 70 }, // standing inside, looking across the room
];

// Sample the camera path at progress `p`, writing into reusable vectors.
// Returns the field-of-view at `p`. (Reuses out-vectors to avoid per-frame allocs.)
export function sampleCam(p: number, outPos: Vector3, outLook: Vector3): number {
  const k = CAM_KEYS;
  if (p <= k[0].p) {
    outPos.set(k[0].pos[0], k[0].pos[1], k[0].pos[2]);
    outLook.set(k[0].look[0], k[0].look[1], k[0].look[2]);
    return k[0].fov;
  }
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i], b = k[i + 1];
    if (p <= b.p) {
      const t = smooth(invlerp(a.p, b.p, p));
      outPos.set(lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t));
      outLook.set(lerp(a.look[0], b.look[0], t), lerp(a.look[1], b.look[1], t), lerp(a.look[2], b.look[2], t));
      return lerp(a.fov, b.fov, t);
    }
  }
  const last = k[k.length - 1];
  outPos.set(last.pos[0], last.pos[1], last.pos[2]);
  outLook.set(last.look[0], last.look[1], last.look[2]);
  return last.fov;
}
