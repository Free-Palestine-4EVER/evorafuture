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
import { FloorZone, Product, Rect, Wall, wallHeightOf, wallThicknessMm } from "./types";
import { wallPanels } from "./wallGeometry";
import { resolveProduct } from "./catalog";
import { materialDef } from "./textures";
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

export type ExportFormat = "dae" | "obj" | "stl" | "glb" | "dxf" | "skp";

interface MeshTri { name: string; color: string; verts: number[] } // triangle-soup, world metres, Y-up

// Pull the REAL furniture geometry (loaded GLBs, fitted + placed) from the live scene
// as world-space triangles — so furniture exports as its true shape, not a box.
// Each placed piece's group is named "furn:<product>" by SceneView.
function furnitureMeshesFromLive(): MeshTri[] {
  const root = sceneRef.current?.getObjectByName("exportRoot");
  if (!root) return [];
  root.updateWorldMatrix(true, true);
  const out: MeshTri[] = [];
  const v = new THREE.Vector3();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    let p: THREE.Object3D | null = mesh, label: string | null = null;
    while (p) { if (p.name?.startsWith("furn:")) { label = p.name.slice(5); break; } p = p.parent; }
    if (label == null) return;
    const geo = mesh.geometry as THREE.BufferGeometry;
    const g = geo.index ? geo.toNonIndexed() : geo;
    const pos = g.getAttribute("position");
    if (pos) {
      const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial | undefined;
      const color = mat?.color ? "#" + mat.color.getHexString() : "#9aa0aa";
      const verts: number[] = [];
      for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld); verts.push(v.x, v.y, v.z); }
      out.push({ name: label || "Furniture", color, verts });
    }
    if (g !== geo) g.dispose();
  });
  return out;
}

interface BoxSpec {
  cx: number; cy: number; cz: number; // centre, metres (Y up)
  w: number; h: number; d: number;    // size, metres
  rotY: number;                        // radians
  layer: string;
  name: string;                        // editable group name (in SketchUp etc.)
  color: string;                       // hex
}

// Collect every solid in the scene (walls + furniture + floor zones) as positioned
// true-size boxes, each with a name + colour for grouped, editable CAD export.
function collectBoxes(walls: Wall[], rects: Rect[], imgW: number, imgH: number, s: number, userProducts: Product[], floorZones: FloorZone[] = []): BoxSpec[] {
  const boxes: BoxSpec[] = [];
  let wn = 0;

  for (const z of floorZones) {
    const cx = z.x + z.w / 2, cy = z.y + z.h / 2;
    boxes.push({
      cx: (cx - imgW / 2) * s, cy: 0.005, cz: (cy - imgH / 2) * s,
      w: z.w * s, h: 0.01, d: z.h * s, rotY: 0,
      layer: "FLOORS", name: `Floor — ${materialDef(z.matId)?.name ?? "zone"}`, color: materialDef(z.matId)?.base ?? "#cccccc",
    });
  }

  for (const wl of walls) {
    const hM = wallHeightOf(wl) / 1000;
    if (hM <= 0) continue;
    const lenPx = Math.hypot(wl.x2 - wl.x1, wl.y2 - wl.y1);
    if (lenPx < 1) continue;
    const lengthM = lenPx * s;
    const thickM = wallThicknessMm(wl) / 1000;
    const sxw = (wl.x1 - imgW / 2) * s, szw = (wl.y1 - imgH / 2) * s;
    const dirX = ((wl.x2 - imgW / 2) * s - sxw) / lengthM, dirZ = ((wl.y2 - imgH / 2) * s - szw) / lengthM;
    const rotY = Math.atan2(-(wl.y2 - wl.y1), wl.x2 - wl.x1);
    wn++;
    const panels = wallPanels(wl.openings, lengthM, hM);
    const cornerExt = Math.max(thickM, 0.2) / 2; // close mixed-thickness corners
    panels.forEach((p, i) => {
      let x0 = p.x0, x1 = p.x1;
      if (x0 <= 1e-3) x0 -= cornerExt;
      if (x1 >= lengthM - 1e-3) x1 += cornerExt;
      const aC = (x0 + x1) / 2;
      boxes.push({
        cx: sxw + dirX * aC, cy: (p.y0 + p.y1) / 2, cz: szw + dirZ * aC,
        w: x1 - x0, h: p.y1 - p.y0, d: thickM, rotY,
        layer: "WALLS", name: panels.length > 1 ? `Wall ${wn}.${i + 1}` : `Wall ${wn}`, color: "#dddddd",
      });
    });
  }

  for (const r of rects) {
    const p = resolveProduct(r.productId, userProducts);
    if (!p) continue;
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    boxes.push({
      cx: (cx - imgW / 2) * s, cy: p.dimensions_mm.h / 2000, cz: (cy - imgH / 2) * s,
      w: p.dimensions_mm.w / 1000, h: p.dimensions_mm.h / 1000, d: p.dimensions_mm.d / 1000,
      rotY: (-r.rotationDeg * Math.PI) / 180, layer: "FURNITURE", name: p.name, color: p.color,
    });
  }

  return boxes;
}

function buildGroup(boxes: BoxSpec[]): THREE.Group {
  const group = new THREE.Group();
  for (const b of boxes) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(b.w, b.h, b.d),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(b.color) }),
    );
    mesh.position.set(b.cx, b.cy, b.cz);
    mesh.rotation.y = b.rotY;
    mesh.name = b.name;
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
  g(0, "TABLE"); g(2, "LAYER"); g(70, 4);
  for (const [name, color] of [["0", 7], ["WALLS", 8], ["FURNITURE", 5], ["FLOORS", 3]] as const) {
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

// world-space corners of a box, in METRES, Y-up (matches the live scene)
function boxCornersM(b: BoxSpec): [number, number, number][] {
  const hw = b.w / 2, hh = b.h / 2, hd = b.d / 2;
  const c = Math.cos(b.rotY), sn = Math.sin(b.rotY);
  const pts: [number, number, number][] = [];
  // order: 0..3 bottom (y-), 4..7 top (y+), each ring: (-x-z)(+x-z)(+x+z)(-x+z)
  const ring: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  for (const sy of [-1, 1]) for (const [sx, sz] of ring) {
    const lx = sx * hw, lz = sz * hd;
    pts.push([b.cx + lx * c + lz * sn, b.cy + sy * hh, b.cz - lx * sn + lz * c]);
  }
  return pts;
}

const hexToRgb01 = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]!));

// Collada (.dae) — the most SketchUp-friendly format: each box is its own named
// node (→ an editable group in SketchUp) with its own colour, at true metric scale.
// SketchUp merges the 6 quad faces into a clean box on import.
function dae(boxes: BoxSpec[], furn: MeshTri[] = []): string {
  // one material per unique colour (boxes + real furniture meshes)
  const colors = Array.from(new Set([...boxes.map((b) => b.color.toLowerCase()), ...furn.map((f) => f.color.toLowerCase())]));
  const matId = (hex: string) => `mat_${colors.indexOf(hex.toLowerCase())}`;

  const effects = colors.map((hex, i) => {
    const [r, g, b] = hexToRgb01(hex);
    return `    <effect id="fx_${i}"><profile_COMMON><technique sid="t"><lambert>` +
      `<diffuse><color>${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} 1</color></diffuse>` +
      `</lambert></technique></profile_COMMON></effect>`;
  }).join("\n");
  const materials = colors.map((_, i) => `    <material id="mat_${i}" name="mat_${i}"><instance_effect url="#fx_${i}"/></material>`).join("\n");

  // 6 quad faces (CCW), referencing the 8 corners from boxCornersM
  const FACES = [
    [0, 1, 2, 3], [7, 6, 5, 4], [3, 2, 6, 7], [1, 0, 4, 5], [2, 1, 5, 6], [0, 3, 7, 4],
  ];
  const geometries: string[] = [];
  const nodes: string[] = [];
  boxes.forEach((b, i) => {
    const pts = boxCornersM(b);
    const pos = pts.map((p) => `${p[0].toFixed(4)} ${p[1].toFixed(4)} ${p[2].toFixed(4)}`).join(" ");
    const p = FACES.flat().join(" ");
    geometries.push(
      `    <geometry id="geo_${i}" name="${esc(b.name)}"><mesh>` +
      `<source id="geo_${i}_p"><float_array id="geo_${i}_pa" count="24">${pos}</float_array>` +
      `<technique_common><accessor source="#geo_${i}_pa" count="8" stride="3">` +
      `<param name="X" type="float"/><param name="Y" type="float"/><param name="Z" type="float"/></accessor></technique_common></source>` +
      `<vertices id="geo_${i}_v"><input semantic="POSITION" source="#geo_${i}_p"/></vertices>` +
      `<polylist material="sym" count="6"><input semantic="VERTEX" source="#geo_${i}_v" offset="0"/>` +
      `<vcount>4 4 4 4 4 4</vcount><p>${p}</p></polylist></mesh></geometry>`,
    );
    nodes.push(
      `      <node id="node_${i}" name="${esc(b.name)}" type="NODE"><instance_geometry url="#geo_${i}">` +
      `<bind_material><technique_common><instance_material symbol="sym" target="#${matId(b.color)}"/>` +
      `</technique_common></bind_material></instance_geometry></node>`,
    );
  });

  // real furniture meshes (triangle soup) — exported as their true shape, not a box
  furn.forEach((f, i) => {
    const n = f.verts.length / 3;            // vertex count
    const tris = Math.floor(n / 3);
    const pos = f.verts.map((x) => x.toFixed(4)).join(" ");
    const p = Array.from({ length: n }, (_, k) => k).join(" ");
    geometries.push(
      `    <geometry id="fgeo_${i}" name="${esc(f.name)}"><mesh>` +
      `<source id="fgeo_${i}_p"><float_array id="fgeo_${i}_pa" count="${f.verts.length}">${pos}</float_array>` +
      `<technique_common><accessor source="#fgeo_${i}_pa" count="${n}" stride="3">` +
      `<param name="X" type="float"/><param name="Y" type="float"/><param name="Z" type="float"/></accessor></technique_common></source>` +
      `<vertices id="fgeo_${i}_v"><input semantic="POSITION" source="#fgeo_${i}_p"/></vertices>` +
      `<triangles material="sym" count="${tris}"><input semantic="VERTEX" source="#fgeo_${i}_v" offset="0"/><p>${p}</p></triangles></mesh></geometry>`,
    );
    nodes.push(
      `      <node id="fnode_${i}" name="${esc(f.name)}" type="NODE"><instance_geometry url="#fgeo_${i}">` +
      `<bind_material><technique_common><instance_material symbol="sym" target="#${matId(f.color)}"/>` +
      `</technique_common></bind_material></instance_geometry></node>`,
    );
  });

  return `<?xml version="1.0" encoding="utf-8"?>
<COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">
  <asset><up_axis>Y_UP</up_axis><unit name="meter" meter="1"/></asset>
  <library_effects>
${effects}
  </library_effects>
  <library_materials>
${materials}
  </library_materials>
  <library_geometries>
${geometries.join("\n")}
  </library_geometries>
  <library_visual_scenes><visual_scene id="scene" name="Puffer">
${nodes.join("\n")}
  </visual_scene></library_visual_scenes>
  <scene><instance_visual_scene url="#scene"/></scene>
</COLLADA>`;
}

// A SketchUp Ruby script: rebuilds walls/floor as editable boxes + the REAL furniture
// meshes as named, coloured groups at true scale, then optionally saves a native .skp.
// Run in SketchUp 2024: Window ▸ Ruby Console →  load "/path/to/puffer-sketchup.rb"
function skpRuby(boxes: BoxSpec[], furn: MeshTri[], savePath?: string): string {
  const FACES = [[0, 1, 2, 3], [7, 6, 5, 4], [3, 2, 6, 7], [1, 0, 4, 5], [2, 1, 5, 6], [0, 3, 7, 4]];
  const data = {
    boxes: boxes.map((b) => ({ name: b.name, color: b.color, corners: boxCornersM(b).map((c) => c.map((n) => +n.toFixed(4))) })),
    furn: furn.map((f) => ({ name: f.name, color: f.color, verts: f.verts.map((n) => +n.toFixed(4)) })),
    faces: FACES,
    save: savePath ?? null,
  };
  const json = JSON.stringify(data);
  return `# Puffer → SketchUp. In SketchUp 2024: Window > Ruby Console, then:  load "<this file>"
require 'sketchup.rb'
require 'json'

DATA = JSON.parse(<<'PUFFER_JSON')
${json}
PUFFER_JSON

model = Sketchup.active_model
model.start_operation('Puffer import', true)
ents = model.active_entities
# Puffer is Y-up metres; SketchUp is Z-up -> map (x, y, z) to (x, z, y)
def _pt(c) Geom::Point3d.new(c[0].m, c[2].m, c[1].m) end

DATA['boxes'].each do |b|
  g = ents.add_group
  cs = b['corners']
  DATA['faces'].each do |q|
    begin; g.entities.add_face(_pt(cs[q[0]]), _pt(cs[q[1]]), _pt(cs[q[2]]), _pt(cs[q[3]])); rescue StandardError; end
  end
  g.name = b['name'] || 'Wall'
  begin; g.material = b['color']; rescue StandardError; end
end

DATA['furn'].each do |f|
  g = ents.add_group
  v = f['verts']
  (0...(v.length / 9)).each do |t|
    o = t * 9
    begin
      g.entities.add_face(_pt([v[o], v[o + 1], v[o + 2]]), _pt([v[o + 3], v[o + 4], v[o + 5]]), _pt([v[o + 6], v[o + 7], v[o + 8]]))
    rescue StandardError
    end
  end
  g.name = f['name'] || 'Furniture'
  begin; g.material = f['color']; rescue StandardError; end
end

model.commit_operation
model.save(DATA['save']) if DATA['save']
puts "Puffer: built #{DATA['boxes'].length} wall pieces + #{DATA['furn'].length} furniture items"
`;
}

function download(data: BlobPart, filename: string, mime: string) {
  const url = URL.createObjectURL(new Blob([data], { type: mime }));
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// The live furnished scene as a GLB Blob (real geometry) — used to feed the AR
// viewer "view in your room". Falls back to box geometry if the scene isn't ready.
export async function sceneToGlbBlob(
  walls: Wall[], rects: Rect[], imgW: number, imgH: number, mmPerPx: number, userProducts: Product[] = [],
): Promise<Blob | null> {
  const s = mmPerPx * 0.001;
  const group = getExportGroup() ?? buildGroup(collectBoxes(walls, rects, imgW, imgH, s, userProducts));
  if (!group) return null;
  const result: ArrayBuffer = await new Promise((resolve, reject) =>
    new GLTFExporter().parse(group, (r) => resolve(r as ArrayBuffer), reject, { binary: true }),
  );
  return new Blob([result], { type: "model/gltf-binary" });
}

export async function exportPlan(
  format: ExportFormat,
  walls: Wall[], rects: Rect[], imgW: number, imgH: number, mmPerPx: number,
  userProducts: Product[] = [], floorZones: FloorZone[] = [],
): Promise<void> {
  const s = mmPerPx * 0.001;
  const boxes = collectBoxes(walls, rects, imgW, imgH, s, userProducts, floorZones);

  if (format === "dxf") {
    download(dxf(boxes), "puffer-plan.dxf", "application/dxf");
    return;
  }
  if (format === "dae" || format === "skp") {
    // walls + floor as editable boxes; furniture as its REAL mesh from the live scene
    const shell = collectBoxes(walls, [], imgW, imgH, s, userProducts, floorZones);
    const furn = furnitureMeshesFromLive();
    const furnBoxes = furn.length ? [] : collectBoxes([], rects, imgW, imgH, s, userProducts, []); // box fallback if scene not ready
    const fileBoxes = [...shell, ...furnBoxes];
    if (format === "dae") { download(dae(fileBoxes, furn), "puffer-plan.dae", "model/vnd.collada+xml"); return; }
    download(skpRuby(fileBoxes, furn), "puffer-sketchup.rb", "text/x-ruby");
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
