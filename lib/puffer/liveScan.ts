// Web "LiDAR-style" live room scanner — the math behind the in-browser clone of
// pCon.scan / Apple RoomPlan.
//
// HONEST CONSTRAINT: a browser on iPhone cannot read the LiDAR depth stream
// (Apple does not expose it to Safari/WebKit). So we reconstruct the floor plan
// the way magicplan / CamToPlan do — from the camera + the device IMU:
//
//   The user stands roughly in one spot and aims the phone at each floor corner
//   (and at each piece of furniture), tapping "capture". For every tap we read
//   the compass HEADING (φ) and the camera's downward PITCH below the horizon
//   (θ). With an assumed camera height H, the aimed ground point lies at a
//   horizontal distance  d = H / tan(θ)  along heading φ:
//
//        x = d·sin(φ)        z = d·cos(φ)
//
//   Corners → walls (closed polygon). Furniture taps → ScanObjects sized from
//   the detector's box + distance, with sensible per-class fallbacks.
//
// The output is a ScanFile — the SAME shape the native RoomPlan import uses — so
// it flows straight through scanToProject() into an editable Puffer plan + 3D
// room. Dimensions are estimates (no laser), so the plan is meant to be nudged
// in the editor afterwards; the geometry is good enough to lay out furniture.

import type { ScanFile, ScanObject, ScanWall } from "./importScan";

export interface AimSample {
  /** compass heading in radians (0 = north, clockwise) at capture time */
  heading: number;
  /** camera pitch BELOW the horizon, radians (clamped to a sane window) */
  pitch: number;
}

export interface CornerTap extends AimSample {}

export interface ItemTap extends AimSample {
  /** normalised furniture label, e.g. "sofa", "chair", "table" */
  label: string;
  /** detector box width as a fraction of the frame (0–1), for size estimation */
  boxWFrac?: number;
}

export const DEFAULT_CAMERA_HEIGHT_M = 1.45; // chest height, phone held normally
const V_FOV = (60 * Math.PI) / 180;          // typical phone vertical FOV
const H_FOV = (50 * Math.PI) / 180;          // typical phone horizontal FOV
const MIN_PITCH = (6 * Math.PI) / 180;       // avoid d → ∞ near the horizon
const MAX_PITCH = (84 * Math.PI) / 180;      // avoid d → 0 straight down

// COCO-SSD class → Evora-friendly furniture label. Anything not here is ignored
// for geometry but can still be surfaced to the user.
export const COCO_TO_FURNITURE: Record<string, string> = {
  couch: "sofa",
  chair: "chair",
  bench: "bench",
  bed: "bed",
  "dining table": "table",
  tv: "tv",
  refrigerator: "fridge",
  oven: "oven",
  sink: "sink",
  toilet: "toilet",
  "potted plant": "plant",
  vase: "decor",
  book: "shelf",
  laptop: "desk",
  "wine glass": "decor",
  clock: "decor",
};

// Real-world footprint fallbacks (metres) when the box estimate is unreliable.
const FOOTPRINT: Record<string, { w: number; d: number; h: number }> = {
  sofa: { w: 2.0, d: 0.9, h: 0.85 },
  chair: { w: 0.6, d: 0.6, h: 0.9 },
  bench: { w: 1.4, d: 0.5, h: 0.45 },
  bed: { w: 2.0, d: 1.6, h: 0.6 },
  table: { w: 1.4, d: 0.8, h: 0.75 },
  desk: { w: 1.2, d: 0.6, h: 0.75 },
  tv: { w: 1.2, d: 0.1, h: 0.7 },
  fridge: { w: 0.7, d: 0.7, h: 1.8 },
  oven: { w: 0.6, d: 0.6, h: 0.9 },
  sink: { w: 0.6, d: 0.5, h: 0.9 },
  toilet: { w: 0.4, d: 0.6, h: 0.8 },
  plant: { w: 0.4, d: 0.4, h: 0.9 },
  shelf: { w: 0.8, d: 0.35, h: 1.8 },
  decor: { w: 0.3, d: 0.3, h: 0.3 },
};

export function clampPitch(p: number): number {
  return Math.min(MAX_PITCH, Math.max(MIN_PITCH, p));
}

/** Project an aimed sample to a ground point (metres) around the operator at origin. */
export function aimToGround(s: AimSample, cameraHeight: number): { x: number; z: number; d: number } {
  const d = cameraHeight / Math.tan(clampPitch(s.pitch));
  return { x: d * Math.sin(s.heading), z: d * Math.cos(s.heading), d };
}

/** Estimate a furniture footprint from its detector box + distance, falling back to class defaults. */
function itemFootprint(it: ItemTap, dist: number): { w: number; d: number; h: number } {
  const def = FOOTPRINT[it.label] ?? { w: 0.6, d: 0.6, h: 0.7 };
  if (it.boxWFrac && it.boxWFrac > 0.02) {
    // angular width → metric width at this distance
    const widthM = 2 * dist * Math.tan((it.boxWFrac * H_FOV) / 2);
    if (widthM > 0.15 && widthM < 6) {
      const ratio = def.d / def.w; // keep the class aspect for depth
      return { w: widthM, d: Math.max(0.2, widthM * ratio), h: def.h };
    }
  }
  return def;
}

/** Build a RoomPlan-compatible ScanFile from the captured corners + items. */
export function buildScanFile(
  corners: CornerTap[],
  items: ItemTap[],
  cameraHeight = DEFAULT_CAMERA_HEIGHT_M,
): ScanFile {
  const pts = corners.map((c) => aimToGround(c, cameraHeight));

  const walls: ScanWall[] = [];
  if (pts.length >= 2) {
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      // skip the closing segment if the room was left open (only 2 corners)
      if (pts.length === 2 && i === 1) break;
      walls.push({ x1: a.x, z1: a.z, x2: b.x, z2: b.z, height: 2.7 });
    }
  }

  const objects: ScanObject[] = items.map((it) => {
    const g = aimToGround(it, cameraHeight);
    const fp = itemFootprint(it, g.d);
    return { type: it.label, cx: g.x, cz: g.z, w: fp.w, d: fp.d, h: fp.h, angle: it.heading };
  });

  if (walls.length === 0 && objects.length === 0) throw new Error("empty scan");
  return { version: 1, units: "m", walls, objects };
}

/** Quick m² estimate of the captured polygon (shoelace), for the live HUD. */
export function polygonAreaM2(corners: CornerTap[], cameraHeight = DEFAULT_CAMERA_HEIGHT_M): number {
  const p = corners.map((c) => aimToGround(c, cameraHeight));
  if (p.length < 3) return 0;
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length;
    a += p[i].x * p[j].z - p[j].x * p[i].z;
  }
  return Math.abs(a) / 2;
}

/**
 * Turn a ScanFile into a real .glb (extruded walls + furniture boxes) so the
 * dashboards can show it in <model-viewer>. Three is imported lazily to keep it
 * out of the main bundle.
 */
export async function buildRoomGlbBlob(scan: ScanFile): Promise<Blob> {
  const THREE = await import("three");
  const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");

  const scene = new THREE.Scene();

  // floor — bounding box of everything
  const xs: number[] = [], zs: number[] = [];
  for (const w of scan.walls) { xs.push(w.x1, w.x2); zs.push(w.z1, w.z2); }
  for (const o of scan.objects ?? []) { xs.push(o.cx - o.w / 2, o.cx + o.w / 2); zs.push(o.cz - o.d / 2, o.cz + o.d / 2); }
  if (xs.length) {
    const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
    const fw = Math.max(0.5, maxX - minX), fd = Math.max(0.5, maxZ - minZ);
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(fw + 0.2, 0.04, fd + 0.2),
      new THREE.MeshStandardMaterial({ color: 0xe7ded0, roughness: 1 }),
    );
    floor.position.set((minX + maxX) / 2, -0.02, (minZ + maxZ) / 2);
    scene.add(floor);
  }

  // walls — thin extruded boxes between endpoints
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf3efe7, roughness: 0.95 });
  for (const w of scan.walls) {
    const dx = w.x2 - w.x1, dz = w.z2 - w.z1;
    const len = Math.hypot(dx, dz);
    if (len < 0.05) continue;
    const h = w.height ?? 2.7;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(len, h, 0.1), wallMat);
    wall.position.set((w.x1 + w.x2) / 2, h / 2, (w.z1 + w.z2) / 2);
    wall.rotation.y = -Math.atan2(dz, dx);
    scene.add(wall);
  }

  // furniture — clay boxes at true footprint
  const objMat = new THREE.MeshStandardMaterial({ color: 0xb27457, roughness: 0.7 });
  for (const o of scan.objects ?? []) {
    const h = o.h ?? 0.7;
    const box = new THREE.Mesh(new THREE.BoxGeometry(o.w, h, o.d), objMat);
    box.position.set(o.cx, h / 2, o.cz);
    if (o.angle) box.rotation.y = -o.angle;
    scene.add(box);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(3, 6, 4);
  scene.add(dir);

  const exporter = new GLTFExporter();
  const glb = await new Promise<ArrayBuffer>((resolve, reject) => {
    exporter.parse(scene, (r) => resolve(r as ArrayBuffer), (e) => reject(e), { binary: true });
  });
  return new Blob([glb], { type: "model/gltf-binary" });
}
