// Import a LiDAR room scan (from the iOS RoomPlan "Puffer Scan" app) into Puffer.
// The scan is real-world geometry (metres, top-down X/Z). We project it to Puffer's
// plan-pixel coordinate system, generate a plan image with the wall outline, and turn
// the scan's walls + detected objects into Puffer walls + furniture slots.

import { ProjectFile } from "./store";
import { Rect, Wall } from "./types";

export interface ScanWall { x1: number; z1: number; x2: number; z2: number; height?: number }
export interface ScanObject { type?: string; cx: number; cz: number; w: number; d: number; h?: number; angle?: number }
export interface ScanFile { version?: number; units?: string; walls: ScanWall[]; objects?: ScanObject[] }

const MM_PER_PX = 10; // 10 mm per pixel → 1 m = 100 px
const MARGIN = 40;    // px border around the room

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

export function scanToProject(scan: ScanFile): ProjectFile {
  const walls = scan.walls ?? [];
  const objects = scan.objects ?? [];
  if (walls.length === 0 && objects.length === 0) throw new Error("empty scan");

  const xs: number[] = [], zs: number[] = [];
  for (const w of walls) { xs.push(w.x1, w.x2); zs.push(w.z1, w.z2); }
  for (const o of objects) { xs.push(o.cx - o.w / 2, o.cx + o.w / 2); zs.push(o.cz - o.d / 2, o.cz + o.d / 2); }
  const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);

  const m2px = (m: number) => (m * 1000) / MM_PER_PX;
  const PX = (x: number, z: number) => ({ x: m2px(x - minX) + MARGIN, y: m2px(z - minZ) + MARGIN });
  const planW = Math.max(1, Math.ceil(m2px(maxX - minX) + 2 * MARGIN));
  const planH = Math.max(1, Math.ceil(m2px(maxZ - minZ) + 2 * MARGIN));

  const wallsOut: Wall[] = walls.map((w) => {
    const a = PX(w.x1, w.z1), b = PX(w.x2, w.z2);
    return { id: uid(), x1: a.x, y1: a.y, x2: b.x, y2: b.y, height: "full", source: "manual" };
  });
  const rectsOut: Rect[] = objects.map((o) => {
    const c = PX(o.cx, o.cz), wpx = m2px(o.w), dpx = m2px(o.d);
    return { id: uid(), x: c.x - wpx / 2, y: c.y - dpx / 2, w: wpx, h: dpx, rotationDeg: o.angle ? -(o.angle * 180) / Math.PI : 0, productId: null };
  });

  // plan image: white floor + wall outline + faint object footprints (used as the 2D backdrop)
  const cv = document.createElement("canvas");
  cv.width = planW; cv.height = planH;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, planW, planH);
  ctx.strokeStyle = "#334155"; ctx.lineWidth = Math.max(3, planW / 220); ctx.lineCap = "round";
  for (const w of wallsOut) { ctx.beginPath(); ctx.moveTo(w.x1, w.y1); ctx.lineTo(w.x2, w.y2); ctx.stroke(); }
  ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5;
  for (const r of rectsOut) ctx.strokeRect(r.x, r.y, r.w, r.h);

  return {
    version: 1,
    planImage: cv.toDataURL("image/png"),
    imgW: planW, imgH: planH, mmPerPx: MM_PER_PX,
    rects: rectsOut, walls: wallsOut,
    floorMat: { kind: "plan" }, wallMat: { kind: "color", color: "#eef2f7" },
  };
}
