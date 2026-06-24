// Export the furnished 3D plan to editable files.
//
// OBJ / STL / GLB are produced with three.js's own exporters from a clean group we
// rebuild from the plan data (walls + furniture at true size) — so the output has no
// grid/lights/floor junk. DXF (the open, AutoCAD/SketchUp-readable CAD format, the
// practical stand-in for DWG) is written by hand as 3DFACE solids.
//
// SKP (native SketchUp) and true DWG need a server-side step (SketchUp C SDK / ODA)
// — that's a later phase; OBJ + DXF already open as editable geometry in SketchUp.

import * as THREE from "three";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { Product, Rect, Wall, wallHeightMm, WALL } from "./types";
import { resolveProduct } from "./catalog";
import { sceneRef } from "./sceneRef";

// Pull the REAL geometry from the live scene (detailed furniture + loaded product
// GLBs), cloned and made opaque so it imports cleanly into Blender/SketchUp.
function getExportGroup(): THREE.Object3D | null {
  const scene = sceneRef.current;
  const root = scene?.getObjectByName("exportRoot");
  if (!root || root.children.length === 0) return null;
  const clone = root.clone(true);
  clone.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && m.material) {
      const fix = (mat: THREE.Material) => {
        const c = mat.clone();
        c.transparent = false;
        (c as THREE.Material & { opacity: number }).opacity = 1;
        c.depthWrite = true;
        return c;
      };
      m.material = Array.isArray(m.material) ? m.material.map(fix) : fix(m.material);
    }
  });
  return clone;
}

export type ExportFormat = "obj" | "stl" | "glb" | "dxf";

interface BoxSpec {
  cx: number; cy: number; cz: number; // centre, metres (Y up)
  w: number; h: number; d: number;    // size, metres
  rotY: number;                        // radians
  layer: string;
}

// Collect every solid in the scene (walls + furniture) as positioned boxes.
function collectBoxes(walls: Wall[], rects: Rect[], imgW: number, imgH: number, s: number, userProducts: Product[]): BoxSpec[] {
  const boxes: BoxSpec[] = [];

  for (const wl of walls) {
    const hM = wallHeightMm(wl.height) / 1000;
    if (hM <= 0) continue;
    const lenPx = Math.hypot(wl.x2 - wl.x1, wl.y2 - wl.y1);
    if (lenPx < 1) continue;
    const mx = (wl.x1 + wl.x2) / 2, my = (wl.y1 + wl.y2) / 2;
    boxes.push({
      cx: (mx - imgW / 2) * s, cy: hM / 2, cz: (my - imgH / 2) * s,
      w: lenPx * s + WALL.thicknessMm / 1000, h: hM, d: WALL.thicknessMm / 1000,
      rotY: Math.atan2(-(wl.y2 - wl.y1), wl.x2 - wl.x1), layer: "WALLS",
    });
  }

  for (const r of rects) {
    const p = resolveProduct(r.productId, userProducts);
    if (!p) continue;
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    boxes.push({
      cx: (cx - imgW / 2) * s, cy: p.dimensions_mm.h / 2000, cz: (cy - imgH / 2) * s,
      w: p.dimensions_mm.w / 1000, h: p.dimensions_mm.h / 1000, d: p.dimensions_mm.d / 1000,
      rotY: (-r.rotationDeg * Math.PI) / 180, layer: "FURNITURE",
    });
  }

  return boxes;
}

function buildGroup(boxes: BoxSpec[]): THREE.Group {
  const group = new THREE.Group();
  for (const b of boxes) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(b.w, b.h, b.d),
      new THREE.MeshStandardMaterial({ color: b.layer === "WALLS" ? 0xdddddd : 0x9aa0aa }),
    );
    mesh.position.set(b.cx, b.cy, b.cz);
    mesh.rotation.y = b.rotY;
    mesh.name = b.layer;
    group.add(mesh);
  }
  return group;
}

// 8 corners of a box, in DXF space (X right, Y = -worldZ so the plan reads
// top-down, Z up), in millimetres.
function boxCornersMm(b: BoxSpec): [number, number, number][] {
  const hw = b.w / 2, hh = b.h / 2, hd = b.d / 2;
  const c = Math.cos(b.rotY), sn = Math.sin(b.rotY);
  const out: [number, number, number][] = [];
  for (const sy of [-1, 1]) for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const lx = sx * hw, lz = sz * hd;
    const wx = b.cx + lx * c + lz * sn;
    const wz = b.cz - lx * sn + lz * c;
    const wy = b.cy + sy * hh;
    out.push([wx * 1000, -wz * 1000, wy * 1000]); // → mm, Z up
  }
  // index order: [yLow(zN,zP per xN,xP) , yHigh(...)] → we sort below by helper
  return out;
}

function dxf(boxes: BoxSpec[]): string {
  const L: string[] = [];
  const g = (code: number, val: string | number) => L.push(String(code), String(val));

  // HEADER — an R12 DXF with a version + units is what importers (SketchUp/AutoCAD)
  // actually require; a bare entities-only file gets rejected.
  g(0, "SECTION"); g(2, "HEADER");
  g(9, "$ACADVER"); g(1, "AC1009");
  g(9, "$INSUNITS"); g(70, 4); // 4 = millimetres
  g(0, "ENDSEC");

  // TABLES — declare the layers the entities reference.
  g(0, "SECTION"); g(2, "TABLES");
  g(0, "TABLE"); g(2, "LAYER"); g(70, 3);
  for (const [name, color] of [["0", 7], ["WALLS", 8], ["FURNITURE", 5]] as const) {
    g(0, "LAYER"); g(2, name); g(70, 0); g(62, color); g(6, "CONTINUOUS");
  }
  g(0, "ENDTAB"); g(0, "ENDSEC");

  // ENTITIES
  g(0, "SECTION"); g(2, "ENTITIES");
  const face = (layer: string, q: [number, number, number][]) => {
    g(0, "3DFACE"); g(8, layer);
    for (let i = 0; i < 4; i++) {
      const [x, y, z] = q[i];
      g(10 + i, x.toFixed(2)); g(20 + i, y.toFixed(2)); g(30 + i, z.toFixed(2));
    }
  };
  for (const b of boxes) {
    const [b0, b1, b2, b3, t0, t1, t2, t3] = boxCornersMm(b);
    face(b.layer, [b0, b1, b3, b2]); // bottom
    face(b.layer, [t0, t1, t3, t2]); // top
    face(b.layer, [b0, b1, t1, t0]); // side xN
    face(b.layer, [b2, b3, t3, t2]); // side xP
    face(b.layer, [b0, b2, t2, t0]); // side zN
    face(b.layer, [b1, b3, t3, t1]); // side zP
  }
  g(0, "ENDSEC");
  g(0, "EOF");
  return L.join("\n");
}

function download(data: BlobPart, filename: string, mime: string) {
  const url = URL.createObjectURL(new Blob([data], { type: mime }));
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Build the furnished scene as a binary GLB and return the raw bytes (instead
// of triggering a download). Used to push the real 3D room to the Evora portal.
export async function buildGlbBuffer(
  walls: Wall[], rects: Rect[], imgW: number, imgH: number, mmPerPx: number,
  userProducts: Product[] = [],
): Promise<ArrayBuffer> {
  const s = mmPerPx * 0.001;
  const boxes = collectBoxes(walls, rects, imgW, imgH, s, userProducts);
  const group = getExportGroup() ?? buildGroup(boxes);
  return new Promise<ArrayBuffer>((resolve, reject) =>
    new GLTFExporter().parse(group, (r) => resolve(r as ArrayBuffer), reject, { binary: true }),
  );
}

export async function exportPlan(
  format: ExportFormat,
  walls: Wall[], rects: Rect[], imgW: number, imgH: number, mmPerPx: number,
  userProducts: Product[] = [],
): Promise<void> {
  const s = mmPerPx * 0.001;
  const boxes = collectBoxes(walls, rects, imgW, imgH, s, userProducts);

  if (format === "dxf") {
    download(dxf(boxes), "puffer-plan.dxf", "application/dxf");
    return;
  }

  // mesh formats: real scene geometry when available, else fall back to boxes
  const group = getExportGroup() ?? buildGroup(boxes);

  if (format === "obj") {
    download(new OBJExporter().parse(group), "puffer-plan.obj", "text/plain");
  } else if (format === "stl") {
    download(new STLExporter().parse(group), "puffer-plan.stl", "text/plain");
  } else if (format === "glb") {
    const result: ArrayBuffer = await new Promise((resolve, reject) =>
      new GLTFExporter().parse(group, (r) => resolve(r as ArrayBuffer), reject, { binary: true }),
    );
    download(result, "puffer-plan.glb", "model/gltf-binary");
  }
}
