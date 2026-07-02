// Bridge an imported room-scan mesh (.obj/.glb) into Puffer's plan-based furnishing.
// We project the mesh straight down onto the floor (XZ) and draw a top-down "plan"
// at true scale, using the SAME coordinate mapping as the 3D floor (plan-centre →
// world origin), so furniture placed on the plan lands correctly inside the real
// scanned room in 3D. Floor/ceiling faces fill light; wall faces draw as dark lines.

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Box3, Vector3, Mesh, BufferGeometry, Triangle, Object3D } from "three";
import { RoomScan } from "./types";

async function loadMesh(scan: RoomScan): Promise<Object3D> {
  if (scan.format === "obj") return await new OBJLoader().loadAsync(scan.url);
  const g = await new GLTFLoader().loadAsync(scan.url);
  return g.scene;
}

export interface ScanPlan { planImage: string; imgW: number; imgH: number; mmPerPx: number }

export async function meshToPlan(scan: RoomScan): Promise<ScanPlan> {
  const root = await loadMesh(scan);
  // centre on origin XZ, base on the floor — identical to how RoomScanModel renders it
  const b0 = new Box3().setFromObject(root);
  const c = new Vector3(); b0.getCenter(c);
  root.position.set(-c.x, -b0.min.y, -c.z);
  root.updateMatrixWorld(true);

  const wb = new Box3().setFromObject(root);
  const W = Math.max(0.5, wb.max.x - wb.min.x);
  const D = Math.max(0.5, wb.max.z - wb.min.z);
  const mmPerPx = 10;             // 1 m = 100 px
  const s = mmPerPx / 1000;
  const MARGIN = 30;
  const imgW = Math.ceil(W / s) + 2 * MARGIN;
  const imgH = Math.ceil(D / s) + 2 * MARGIN;
  // world (x,z) → plan px, with origin at the plan centre (matches PlanFloor mapping)
  const PX = (x: number, z: number) => ({ x: x / s + imgW / 2, y: z / s + imgH / 2 });

  const cv = document.createElement("canvas");
  cv.width = imgW; cv.height = imgH;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, imgW, imgH);

  const a = new Vector3(), b = new Vector3(), cc = new Vector3(), n = new Vector3();
  const tri = new Triangle();
  const wallW = Math.max(2, imgW / 240);
  root.traverse((o: Object3D) => {
    const m = o as Mesh;
    if (!m.isMesh || !m.geometry) return;
    const geo = m.geometry as BufferGeometry;
    const pos = geo.attributes.position;
    if (!pos) return;
    const idx = geo.index;
    const mw = m.matrixWorld;
    const face = (i0: number, i1: number, i2: number) => {
      a.fromBufferAttribute(pos, i0).applyMatrix4(mw);
      b.fromBufferAttribute(pos, i1).applyMatrix4(mw);
      cc.fromBufferAttribute(pos, i2).applyMatrix4(mw);
      tri.set(a, b, cc); tri.getNormal(n);
      const pa = PX(a.x, a.z), pb = PX(b.x, b.z), pc = PX(cc.x, cc.z);
      if (Math.abs(n.y) > 0.6) {
        ctx.fillStyle = "rgba(226,232,240,0.7)";
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.lineTo(pc.x, pc.y); ctx.closePath(); ctx.fill();
      } else {
        ctx.strokeStyle = "#334155"; ctx.lineWidth = wallW;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.lineTo(pc.x, pc.y); ctx.stroke();
      }
    };
    if (idx) for (let i = 0; i < idx.count; i += 3) face(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
    else for (let i = 0; i < pos.count; i += 3) face(i, i + 1, i + 2);
  });

  return { planImage: cv.toDataURL("image/png"), imgW, imgH, mmPerPx };
}
