// Import a LiDAR room scan (from the iOS RoomPlan "Puffer Scan" app) into the studio.
// The scan is real-world geometry (metres, top-down X/Z) in the scanner's arbitrary
// world frame — so the room usually sits at a diagonal. We:
//   1. auto-straighten it (rotate to the dominant wall axis) so the room is upright,
//   2. cut the scan's doors & windows into the walls as real openings,
//   3. render a clean architectural 2D plan (filled floor, thick walls, door/window
//      gaps, subtle furniture footprints) as the studio backdrop,
//   4. turn walls → editable studio walls and detected objects → furniture slots.

import { ProjectFile } from "./store";
import { Rect, Wall, Opening } from "./types";

export interface ScanWall { x1: number; z1: number; x2: number; z2: number; height?: number }
export interface ScanObject { type?: string; cx: number; cz: number; w: number; d: number; h?: number; angle?: number }
export interface ScanFile {
  version?: number; units?: string;
  walls: ScanWall[]; objects?: ScanObject[];
  doors?: ScanWall[]; windows?: ScanWall[]; openings?: ScanWall[];
}

const MM_PER_PX = 10; // 10 mm per pixel → 1 m = 100 px
const MARGIN = 48;    // px border around the room

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

type P = { x: number; z: number };
const segLen = (ax: number, az: number, bx: number, bz: number) => Math.hypot(bx - ax, bz - az);

// ---- 1. auto-straighten: find the dominant wall angle & rotate the whole scan --

function dominantAngle(walls: ScanWall[]): number {
  // the longest wall is the most reliable reference for "which way is straight"
  let best = 0, bestLen = 0;
  for (const w of walls) {
    const l = segLen(w.x1, w.z1, w.x2, w.z2);
    if (l > bestLen) { bestLen = l; best = Math.atan2(w.z2 - w.z1, w.x2 - w.x1); }
  }
  // how far that wall is off the nearest 90° axis — that's the tilt to remove
  const step = Math.PI / 2;
  return best - Math.round(best / step) * step;
}

function rotator(cx: number, cz: number, theta: number) {
  const cos = Math.cos(-theta), sin = Math.sin(-theta);
  return (x: number, z: number): P => ({
    x: cx + (x - cx) * cos - (z - cz) * sin,
    z: cz + (x - cx) * sin + (z - cz) * cos,
  });
}

// ---- 2. map a door/window segment onto the wall it lies along ----------------

function openingForWall(seg: ScanWall, kind: Opening["kind"], wall: ScanWall): Opening | null {
  const ax = wall.x1, az = wall.z1, bx = wall.x2, bz = wall.z2;
  const wlen = segLen(ax, az, bx, bz);
  if (wlen < 0.1) return null;
  const cx = (seg.x1 + seg.x2) / 2, cz = (seg.z1 + seg.z2) / 2;
  const t = ((cx - ax) * (bx - ax) + (cz - az) * (bz - az)) / (wlen * wlen);
  if (t < 0.02 || t > 0.98) return null;
  const px = ax + t * (bx - ax), pz = az + t * (bz - az);
  if (Math.hypot(cx - px, cz - pz) > 0.35) return null; // not on this wall
  const widthMm = Math.max(500, Math.min(segLen(seg.x1, seg.z1, seg.x2, seg.z2), wlen * 0.95) * 1000);
  return {
    id: uid(), kind, pos: t, widthMm,
    sillMm: kind === "window" ? 900 : 0,
    heightMm: kind === "window" ? 1200 : 2100,
  };
}

export function scanToProject(scan: ScanFile): ProjectFile {
  const wallsIn = scan.walls ?? [];
  const objects = scan.objects ?? [];
  if (wallsIn.length === 0 && objects.length === 0) throw new Error("empty scan");

  // centroid of all wall endpoints → rotate the room straight about it
  const allX: number[] = [], allZ: number[] = [];
  for (const w of wallsIn) { allX.push(w.x1, w.x2); allZ.push(w.z1, w.z2); }
  const cX = allX.reduce((a, b) => a + b, 0) / (allX.length || 1);
  const cZ = allZ.reduce((a, b) => a + b, 0) / (allZ.length || 1);
  const theta = wallsIn.length ? dominantAngle(wallsIn) : 0;
  const rot = rotator(cX, cZ, theta);
  const rotSeg = (s: ScanWall): ScanWall => {
    const a = rot(s.x1, s.z1), b = rot(s.x2, s.z2);
    return { x1: a.x, z1: a.z, x2: b.x, z2: b.z, height: s.height };
  };

  const walls = wallsIn.map(rotSeg);
  const doors = [...(scan.doors ?? []), ...(scan.openings ?? [])].map(rotSeg);
  const windows = (scan.windows ?? []).map(rotSeg);
  const objs = objects.map((o) => {
    const c = rot(o.cx, o.cz);
    return { ...o, cx: c.x, cz: c.z, angle: (o.angle ?? 0) - theta };
  });

  // bounds (rotated frame) → pixel projection
  const xs: number[] = [], zs: number[] = [];
  for (const w of walls) { xs.push(w.x1, w.x2); zs.push(w.z1, w.z2); }
  for (const o of objs) { xs.push(o.cx - o.w / 2, o.cx + o.w / 2); zs.push(o.cz - o.d / 2, o.cz + o.d / 2); }
  const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);

  const m2px = (m: number) => (m * 1000) / MM_PER_PX;
  const PX = (x: number, z: number) => ({ x: m2px(x - minX) + MARGIN, y: m2px(z - minZ) + MARGIN });
  const planW = Math.max(1, Math.ceil(m2px(maxX - minX) + 2 * MARGIN));
  const planH = Math.max(1, Math.ceil(m2px(maxZ - minZ) + 2 * MARGIN));

  // walls → studio walls, with doors/windows cut in as openings
  const wallsOut: Wall[] = walls.map((w) => {
    const a = PX(w.x1, w.z1), b = PX(w.x2, w.z2);
    const openings: Opening[] = [];
    for (const d of doors) { const op = openingForWall(d, "door", w); if (op) openings.push(op); }
    for (const win of windows) { const op = openingForWall(win, "window", w); if (op) openings.push(op); }
    return {
      id: uid(), x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      height: "full", source: "manual", kind: "exterior",
      openings: openings.length ? openings : undefined,
    };
  });

  const rectsOut: Rect[] = objs.map((o) => {
    const c = PX(o.cx, o.cz), wpx = m2px(o.w), dpx = m2px(o.d);
    return { id: uid(), x: c.x - wpx / 2, y: c.y - dpx / 2, w: wpx, h: dpx, rotationDeg: -((o.angle ?? 0) * 180) / Math.PI, productId: null };
  });

  return {
    version: 1,
    planImage: renderPlan(planW, planH, wallsOut, rectsOut),
    imgW: planW, imgH: planH, mmPerPx: MM_PER_PX,
    rects: rectsOut, walls: wallsOut,
    floorMat: { kind: "plan" }, wallMat: { kind: "color", color: "#eae4da" },
  };
}

// ---- 3. clean architectural 2D plan render ----------------------------------

// Order the walls into a closed ring by chaining shared endpoints, so we can fill
// the real floor polygon (not the bounding box). Null if they don't form a ring.
function floorLoop(walls: Wall[]): { x: number; y: number }[] | null {
  if (walls.length < 3) return null;
  const TOL = 6; // px
  const near = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by) <= TOL;
  const used = new Array(walls.length).fill(false);
  const start = walls[0];
  const pts = [{ x: start.x1, y: start.y1 }];
  let cx = start.x2, cy = start.y2;
  used[0] = true;
  for (let step = 0; step < walls.length; step++) {
    pts.push({ x: cx, y: cy });
    let found = -1, nx = 0, ny = 0;
    for (let i = 0; i < walls.length; i++) {
      if (used[i]) continue;
      const w = walls[i];
      if (near(cx, cy, w.x1, w.y1)) { found = i; nx = w.x2; ny = w.y2; break; }
      if (near(cx, cy, w.x2, w.y2)) { found = i; nx = w.x1; ny = w.y1; break; }
    }
    if (found === -1) break;
    used[found] = true; cx = nx; cy = ny;
    if (near(cx, cy, start.x1, start.y1)) return pts; // closed ring
  }
  return used.every(Boolean) ? pts : null;
}

function renderPlan(planW: number, planH: number, walls: Wall[], rects: Rect[]): string {
  const cv = document.createElement("canvas");
  cv.width = planW; cv.height = planH;
  const ctx = cv.getContext("2d")!;

  // paper
  ctx.fillStyle = "#faf7f2";
  ctx.fillRect(0, 0, planW, planH);

  // filled floor (if the walls form a clean ring)
  const loop = floorLoop(walls);
  if (loop && loop.length > 2) {
    ctx.beginPath();
    ctx.moveTo(loop[0].x, loop[0].y);
    for (const p of loop.slice(1)) ctx.lineTo(p.x, p.y);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }

  // furniture footprints — subtle warm clay, under the walls
  for (const r of rects) {
    ctx.save();
    ctx.translate(r.x + r.w / 2, r.y + r.h / 2);
    ctx.rotate((-r.rotationDeg * Math.PI) / 180);
    ctx.fillStyle = "rgba(196,120,90,0.14)";
    ctx.strokeStyle = "rgba(196,120,90,0.55)";
    ctx.lineWidth = 1.5;
    ctx.fillRect(-r.w / 2, -r.h / 2, r.w, r.h);
    ctx.strokeRect(-r.w / 2, -r.h / 2, r.w, r.h);
    ctx.restore();
  }

  // walls — thick, with door/window gaps cut out
  const WALL_W = Math.max(6, planW / 130);
  ctx.lineCap = "butt";
  for (const w of walls) {
    const dx = w.x2 - w.x1, dy = w.y2 - w.y1;
    const wlenPx = Math.hypot(dx, dy) || 1;
    const openings = (w.openings ?? []).slice().sort((a, b) => a.pos - b.pos);
    const halfFrac = (o: Opening) => (o.widthMm / MM_PER_PX) / 2 / wlenPx;

    // solid spans = [0,1] minus each opening interval
    let spans: [number, number][] = [[0, 1]];
    for (const o of openings) {
      const s = Math.max(0, o.pos - halfFrac(o)), e = Math.min(1, o.pos + halfFrac(o));
      spans = spans.flatMap(([a, b]): [number, number][] => {
        if (e <= a || s >= b) return [[a, b]];
        const out: [number, number][] = [];
        if (s > a) out.push([a, s]);
        if (e < b) out.push([e, b]);
        return out;
      });
    }
    ctx.strokeStyle = "#2c2a27";
    ctx.lineWidth = WALL_W;
    for (const [a, b] of spans) {
      ctx.beginPath();
      ctx.moveTo(w.x1 + dx * a, w.y1 + dy * a);
      ctx.lineTo(w.x1 + dx * b, w.y1 + dy * b);
      ctx.stroke();
    }

    // opening markers: window = sill line, door = leaf + swing arc
    const ux = dx / wlenPx, uy = dy / wlenPx;   // along the wall
    const nx = -uy, ny = ux;                     // wall normal
    for (const o of openings) {
      const cxp = w.x1 + dx * o.pos, cyp = w.y1 + dy * o.pos;
      const halfPx = (o.widthMm / MM_PER_PX) / 2;
      if (o.kind === "window") {
        ctx.strokeStyle = "#7fb0c8"; ctx.lineWidth = Math.max(2, WALL_W * 0.4);
        ctx.beginPath();
        ctx.moveTo(cxp - ux * halfPx, cyp - uy * halfPx);
        ctx.lineTo(cxp + ux * halfPx, cyp + uy * halfPx);
        ctx.stroke();
      } else {
        const hx = cxp - ux * halfPx, hy = cyp - uy * halfPx; // hinge
        ctx.strokeStyle = "#9a8f80"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + nx * halfPx * 2, hy + ny * halfPx * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(hx, hy, halfPx * 2, Math.atan2(uy, ux), Math.atan2(ny, nx), false);
        ctx.stroke();
      }
    }
  }

  return cv.toDataURL("image/png");
}
