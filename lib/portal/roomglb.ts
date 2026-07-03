// Build a web-viewable GLB room model from a RoomPlan scan (walls + furniture).
// A .usdz is great for iOS AR Quick Look but cannot render inline in a browser;
// <model-viewer> needs a .glb. We already capture full geometry in scanData, so
// we extrude walls into thin boxes and furniture into oriented boxes, and emit a
// single-mesh binary glTF. No external deps — hand-rolled GLB.

type Seg = { x1: number; z1: number; x2: number; z2: number; height?: number };
type Obj = { cx: number; cz: number; w: number; d: number; h: number; angle?: number };
type Scan = { walls?: Seg[]; objects?: Obj[]; windows?: Seg[]; doors?: Seg[]; openings?: Seg[] };

const WALL_THICK = 0.1;

// Two materials: architecture (walls/floor) and furniture (clay).
const MATERIALS = [
  { name: "shell", baseColorFactor: [0.92, 0.90, 0.86, 1], metallic: 0, rough: 0.9 },
  { name: "furniture", baseColorFactor: [0.78, 0.47, 0.36, 1], metallic: 0, rough: 0.75 },
];

class MeshBuilder {
  pos: number[] = [];
  nrm: number[] = [];
  idx: number[] = [];
  // one index range per material
  ranges: { start: number; count: number }[] = [{ start: 0, count: 0 }, { start: 0, count: 0 }];

  // add an oriented box (yaw about +Y) to the given material group
  box(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, yaw: number, mat: number) {
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const rot = (x: number, z: number): [number, number] => [x * c - z * s, x * s + z * c];
    // 6 faces: [normal, 4 CCW corners]
    const faces: [number[], number[][]][] = [
      [[1, 0, 0], [[hx, -hy, -hz], [hx, hy, -hz], [hx, hy, hz], [hx, -hy, hz]]],
      [[-1, 0, 0], [[-hx, -hy, hz], [-hx, hy, hz], [-hx, hy, -hz], [-hx, -hy, -hz]]],
      [[0, 1, 0], [[-hx, hy, -hz], [-hx, hy, hz], [hx, hy, hz], [hx, hy, -hz]]],
      [[0, -1, 0], [[-hx, -hy, hz], [-hx, -hy, -hz], [hx, -hy, -hz], [hx, -hy, hz]]],
      [[0, 0, 1], [[-hx, -hy, hz], [hx, -hy, hz], [hx, hy, hz], [-hx, hy, hz]]],
      [[0, 0, -1], [[hx, -hy, -hz], [-hx, -hy, -hz], [-hx, hy, -hz], [hx, hy, -hz]]],
    ];
    for (const [n, corners] of faces) {
      const base = this.pos.length / 3;
      const [nx, nz] = rot(n[0], n[2]);
      for (const [x, y, z] of corners) {
        const [rx, rz] = rot(x, z);
        this.pos.push(rx + cx, y + cy, rz + cz);
        this.nrm.push(nx, n[1], nz);
      }
      this.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
      this.ranges[mat].count += 6;
    }
  }

  // set each material range's start offset into the shared index array.
  // Boxes are always emitted material-0 first (floor+walls) then material-1
  // (furniture), so the index array is contiguous per material.
  finalize() {
    let cur = 0;
    for (const r of this.ranges) { r.start = cur; cur += r.count; }
  }
}

export function scanDataToGLB(scan: Scan): Buffer {
  const b = new MeshBuilder();
  const walls = scan.walls || [];
  const objects = scan.objects || [];

  // floor slab from bounding box of wall endpoints
  const xs: number[] = [], zs: number[] = [];
  for (const w of walls) { xs.push(w.x1, w.x2); zs.push(w.z1, w.z2); }
  if (xs.length) {
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minZ = Math.min(...zs), maxZ = Math.max(...zs);
    b.box((minX + maxX) / 2, -0.02, (minZ + maxZ) / 2, (maxX - minX) + 0.2, 0.04, (maxZ - minZ) + 0.2, 0, 0);
  }

  // walls → thin extruded boxes
  for (const w of walls) {
    const len = Math.hypot(w.x2 - w.x1, w.z2 - w.z1);
    if (len < 0.05) continue;
    const h = w.height && w.height > 0.1 ? w.height : 2.5;
    const yaw = Math.atan2(w.z2 - w.z1, w.x2 - w.x1);
    b.box((w.x1 + w.x2) / 2, h / 2, (w.z1 + w.z2) / 2, len, h, WALL_THICK, yaw, 0);
  }

  // furniture → oriented boxes resting on the floor
  for (const o of objects) {
    if (!(o.w > 0 && o.d > 0)) continue;
    const h = o.h && o.h > 0.05 ? o.h : 0.6;
    b.box(o.cx, h / 2, o.cz, o.w, h, o.d, o.angle || 0, 1);
  }

  b.finalize();
  return encodeGLB(b);
}

// ---- GLB encoding -----------------------------------------------------------

function encodeGLB(b: MeshBuilder): Buffer {
  const positions = Float32Array.from(b.pos);
  const normals = Float32Array.from(b.nrm);
  const indices = Uint32Array.from(b.idx);

  // bounds for POSITION accessor (required by glTF)
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < positions.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], positions[i + k]);
      max[k] = Math.max(max[k], positions[i + k]);
    }
  }

  // Build binary buffer: positions | normals | (index sub-buffers per primitive)
  const parts: { data: ArrayBufferView; comp: number; type: string; target: number; count: number; isIdx?: boolean; accMin?: number[]; accMax?: number[] }[] = [];
  parts.push({ data: positions, comp: 5126, type: "VEC3", target: 34962, count: positions.length / 3, accMin: min, accMax: max });
  parts.push({ data: normals, comp: 5126, type: "VEC3", target: 34962, count: normals.length / 3 });

  const activePrims = b.ranges.map((r, mat) => ({ r, mat })).filter((x) => x.r.count > 0);
  for (const p of activePrims) {
    const sub = indices.slice(p.r.start, p.r.start + p.r.count);
    parts.push({ data: sub, comp: 5125, type: "SCALAR", target: 34963, count: sub.length, isIdx: true });
  }

  // pad each part to 4 bytes, assemble bin
  const bufferViews: any[] = [];
  const accessors: any[] = [];
  let offset = 0;
  const chunks: Buffer[] = [];
  parts.forEach((part, i) => {
    const buf = Buffer.from(part.data.buffer, part.data.byteOffset, part.data.byteLength);
    const pad = (4 - (buf.length % 4)) % 4;
    bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: buf.length, target: part.target });
    const acc: any = { bufferView: i, componentType: part.comp, count: part.count, type: part.type };
    if (part.accMin) { acc.min = part.accMin; acc.max = part.accMax; }
    accessors.push(acc);
    chunks.push(buf);
    if (pad) chunks.push(Buffer.alloc(pad));
    offset += buf.length + pad;
  });

  const meshPrims = activePrims.map((p, i) => ({
    attributes: { POSITION: 0, NORMAL: 1 },
    indices: 2 + i,
    material: p.mat,
  }));

  const gltf = {
    asset: { version: "2.0", generator: "evora-roomglb" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: "Room" }],
    meshes: [{ primitives: meshPrims }],
    materials: activePrims.map((p) => {
      const m = MATERIALS[p.mat];
      return { name: m.name, doubleSided: true, pbrMetallicRoughness: { baseColorFactor: m.baseColorFactor, metallicFactor: m.metallic, roughnessFactor: m.rough } };
    }),
    accessors,
    bufferViews,
    buffers: [{ byteLength: offset }],
  };

  const bin = Buffer.concat(chunks);
  let json = Buffer.from(JSON.stringify(gltf), "utf8");
  const jsonPad = (4 - (json.length % 4)) % 4;
  if (jsonPad) json = Buffer.concat([json, Buffer.alloc(jsonPad, 0x20)]);

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // "glTF"
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + json.length + 8 + bin.length, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(json.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4); // "JSON"

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(bin.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4); // "BIN\0"

  return Buffer.concat([header, jsonHeader, json, binHeader, bin]);
}
