"use client";

import { toast } from "@/lib/homestudio/toast";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, useTexture, Environment, Lightformer, ContactShadows, useGLTF, Sky } from "@react-three/drei";
import { EffectComposer, N8AO, SMAA, Vignette } from "@react-three/postprocessing";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import type { Texture, Material } from "three";
import { ACESFilmicToneMapping, Box3, Vector3, Group, Color, Mesh, MeshStandardMaterial, DoubleSide, Object3D, MOUSE, TOUCH } from "three";
import { FINISHES, RoomScan } from "@/lib/homestudio/types";
import { useStudio } from "@/lib/homestudio/store";
import { resolveProduct } from "@/lib/homestudio/catalog";
import { FloorZone, Product, Rect, Wall, wallThicknessMm, wallHeightOf } from "@/lib/homestudio/types";
import { SurfaceMat, proceduralTexture, imageTexture, grassTexture, materialTileM, materialDef } from "@/lib/homestudio/textures";
import { wallPanels } from "@/lib/homestudio/wallGeometry";
import { sceneRef } from "@/lib/homestudio/sceneRef";
import { sceneToGlbBlob } from "@/lib/homestudio/exporters";
import { ProductModel } from "./furniture/models";
import ArViewer from "./ArViewer";

// keep a handle to the live scene for the exporter
function SceneCapture() {
  const scene = useThree((s) => s.scene);
  sceneRef.current = scene;
  return null;
}

const EYE_HEIGHT = 1.6; // metres — standing eye level for the walk-in 360 view

// metres per plan-pixel
function metresPerPx(mmPerPx: number) {
  return mmPerPx * 0.001;
}

// a tiled texture from a surface material (null for plain colour / blueprint)
function buildTexture(mat: SurfaceMat): Texture | null {
  if (mat.kind === "image") return imageTexture(mat.src);
  if (mat.kind === "material") return proceduralTexture(mat.id);
  return null;
}
const tileMetres = (mat: SurfaceMat) => (mat.kind === "material" ? materialTileM(mat.id) : 1.5);
const matRoughness = (mat: SurfaceMat) => (mat.kind === "material" ? materialDef(mat.id)?.roughness ?? 0.85 : 0.85);

// a rectangular region of the plan, in plan-image pixels (the building footprint)
type Footprint = { x: number; y: number; w: number; h: number };

// floor with the blueprint plan image (kind === "plan"), clipped to the footprint
// so empty white page-margin never becomes floor.
function PlanFloor({ url, imgW, imgH, s, fp }: { url: string; imgW: number; imgH: number; s: number; fp: Footprint }) {
  const tex = useTexture(url);
  const cropped = useMemo(() => {
    const t = tex.clone();
    t.needsUpdate = true;
    t.repeat.set(fp.w / imgW, fp.h / imgH);                  // show only the footprint sub-rect…
    t.offset.set(fp.x / imgW, 1 - (fp.y + fp.h) / imgH);     // …(texture Y runs bottom-up)
    return t;
  }, [tex, fp.x, fp.y, fp.w, fp.h, imgW, imgH]);
  useEffect(() => () => cropped.dispose(), [cropped]);
  const px = (fp.x + fp.w / 2 - imgW / 2) * s, pz = (fp.y + fp.h / 2 - imgH / 2) * s;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[px, 0, pz]} receiveShadow>
      <planeGeometry args={[fp.w * s, fp.h * s]} />
      <meshStandardMaterial map={cropped} envMapIntensity={0.4} />
    </mesh>
  );
}

// the outdoor lawn the house sits on (orbit "world" view) — broad enough to read as
// real ground meeting the sky at the horizon
function Ground({ spanM }: { spanM: number }) {
  const span = spanM * 20;
  const tex = useMemo(() => {
    const t = grassTexture();
    const tiles = Math.max(8, span / 1.5);
    t.repeat.set(tiles, tiles);
    return t;
  }, [span]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[span, span]} />
      <meshStandardMaterial map={tex} roughness={1} />
    </mesh>
  );
}

// floor with a real material (colour / wood / tile / uploaded photo), clipped to
// the building footprint so it doesn't carpet the whole page.
function MaterialFloor({ mat, fp, imgW, imgH, s }: { mat: SurfaceMat; fp: Footprint; imgW: number; imgH: number; s: number }) {
  const W = fp.w * s, H = fp.h * s;
  const tex = useMemo(() => {
    const t = buildTexture(mat);
    if (t) { const m = tileMetres(mat); t.repeat.set(W / m, H / m); }
    return t;
  }, [mat, W, H]);
  useEffect(() => () => tex?.dispose(), [tex]);
  const px = (fp.x + fp.w / 2 - imgW / 2) * s, pz = (fp.y + fp.h / 2 - imgH / 2) * s;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[px, 0, pz]} receiveShadow>
      <planeGeometry args={[W, H]} />
      <meshStandardMaterial map={tex ?? undefined} color={mat.kind === "color" ? mat.color : "#ffffff"} roughness={matRoughness(mat)} envMapIntensity={0.6} />
    </mesh>
  );
}

// a per-room floor zone — its own material painted over the base floor at true size
function FloorZoneMesh({ zone, imgW, imgH, s }: { zone: FloorZone; imgW: number; imgH: number; s: number }) {
  const W = zone.w * s, H = zone.h * s;
  const tex = useMemo(() => {
    const t = proceduralTexture(zone.matId);
    if (t) { const m = materialTileM(zone.matId); t.repeat.set(W / m, H / m); }
    return t;
  }, [zone.matId, W, H]);
  useEffect(() => () => tex?.dispose(), [tex]);
  const worldX = (zone.x + zone.w / 2 - imgW / 2) * s;
  const worldZ = (zone.y + zone.h / 2 - imgH / 2) * s;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[worldX, 0.006, worldZ]} receiveShadow>
      <planeGeometry args={[W, H]} />
      <meshStandardMaterial map={tex ?? undefined} color={tex ? "#ffffff" : materialDef(zone.matId)?.base ?? "#ccc"} roughness={materialDef(zone.matId)?.roughness ?? 0.7} envMapIntensity={0.6} />
    </mesh>
  );
}

// ── imported real-space scan mesh (from a free LiDAR scanner app) ───────────
function RoomMesh({ source, scan }: { source: Object3D; scan: RoomScan }) {
  const node = useMemo(() => {
    const root = source.clone(true);
    const box = new Box3().setFromObject(root);
    const c = new Vector3(); box.getCenter(c);
    root.position.set(-c.x, -box.min.y, -c.z); // centre on origin, base on floor
    root.traverse((o: Object3D) => {
      const m = o as Mesh;
      if (m.isMesh && m.material) {
        const fix = (mt: Material) => { const x = mt.clone(); x.side = DoubleSide; return x; };
        m.material = Array.isArray(m.material) ? m.material.map(fix) : fix(m.material);
      }
    });
    const g = new Group(); g.add(root); return g;
  }, [source]);
  useEffect(() => {
    node.traverse((o: Object3D) => {
      const m = o as Mesh;
      if (m.isMesh && m.material) {
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt: Material) => {
          mt.transparent = scan.opacity < 0.99; mt.opacity = scan.opacity; mt.depthWrite = scan.opacity >= 0.99;
        });
      }
    });
  }, [node, scan.opacity]);
  return (
    <group rotation={[0, (scan.rotYdeg * Math.PI) / 180, 0]} position={[0, scan.yOffset, 0]} scale={scan.scale}>
      <primitive object={node} />
    </group>
  );
}
function ObjRoom({ scan }: { scan: RoomScan }) {
  const obj = useLoader(OBJLoader, scan.url);
  return <RoomMesh source={obj} scan={scan} />;
}
function GlbRoom({ scan }: { scan: RoomScan }) {
  const { scene } = useGLTF(scan.url);
  return <RoomMesh source={scene} scan={scan} />;
}
function RoomScanModel({ scan }: { scan: RoomScan }) {
  return <Suspense fallback={null}>{scan.format === "obj" ? <ObjRoom scan={scan} /> : <GlbRoom scan={scan} />}</Suspense>;
}

// a real product model (.glb), auto-fitted to the product's TRUE dimensions and sat
// on the floor — so any model (whatever scale it was authored at) shows at real size.
function GlbModel({ url, dims, tint }: { url: string; dims: { w: number; d: number; h: number }; tint?: string }) {
  const { scene } = useGLTF(url);
  const node = useMemo(() => {
    const c = scene.clone(true);
    // Clone every material (never mutate useGLTF's cache) so we can: cast/receive
    // shadows for grounding, crank envMapIntensity for realistic reflections, and
    // optionally recolour to a finish (same model shown in a different wood/fabric).
    const finish = tint ? FINISHES.find((f) => f.color.toLowerCase() === tint.toLowerCase()) : undefined;
    c.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const src = mesh.material as MeshStandardMaterial;
      const m = (src?.clone?.() ?? new MeshStandardMaterial()) as MeshStandardMaterial;
      if (tint) {
        m.color = new Color(tint);
        if (m.map) m.map = null; // drop baked colour map so the tint shows true
        if (finish) { m.roughness = finish.roughness; m.metalness = finish.metalness ?? 0; }
      }
      m.envMapIntensity = Math.max(m.envMapIntensity ?? 1, 1.1);
      mesh.material = m;
    });
    const box = new Box3().setFromObject(c);
    const size = new Vector3(); box.getSize(size);
    const center = new Vector3(); box.getCenter(center);
    const tw = dims.w / 1000, th = dims.h / 1000, td = dims.d / 1000;
    const scale = Math.min(tw / (size.x || 1), th / (size.y || 1), td / (size.z || 1)) || 1;
    c.position.set(-center.x, size.y / 2 - center.y, -center.z); // footprint→origin, base→y=0
    const g = new Group();
    g.add(c);
    g.scale.setScalar(scale);
    return g;
  }, [scene, dims.w, dims.h, dims.d, tint]);
  return <primitive object={node} />;
}

function Furniture({ rect, imgW, imgH, s, selected, userProducts }: {
  rect: Rect; imgW: number; imgH: number; s: number; selected: boolean; userProducts: Product[];
}) {
  const product = resolveProduct(rect.productId, userProducts);
  if (!product) return null;

  const { w, d } = product.dimensions_mm;

  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const worldX = (cx - imgW / 2) * s;
  const worldZ = (cy - imgH / 2) * s;

  // true footprint vs drawn slot → flag oversize (geometry is sacred: never scale to fit)
  const slotW = rect.w * (s / 0.001); // back to mm
  const slotD = rect.h * (s / 0.001);
  const oversize = w > slotW + 1 || d > slotD + 1;

  return (
    <group
      name={`furn:${product.name}`}
      position={[worldX, 0, worldZ]}
      rotation={[0, (-rect.rotationDeg * Math.PI) / 180, 0]}
    >
      {product.glbUrl ? (
        <Suspense fallback={<ProductModel product={product} oversize={oversize} selected={selected} />}>
          <GlbModel url={product.glbUrl} dims={product.dimensions_mm} tint={rect.tint} />
        </Suspense>
      ) : (
        <ProductModel product={product} oversize={oversize} selected={selected} />
      )}
    </group>
  );
}

function WallMesh({ wall, imgW, imgH, s, selected, solid, wallTex, wallTileM, wallColor }: {
  wall: Wall; imgW: number; imgH: number; s: number; selected: boolean; solid: boolean;
  wallTex: Texture | null; wallTileM: number; wallColor: string;
}) {
  const heightM = wallHeightOf(wall) / 1000;
  const dx = wall.x2 - wall.x1;
  const dy = wall.y2 - wall.y1;
  const lenPx = Math.hypot(dx, dy);
  const lengthM = lenPx * s;
  const thickM = wallThicknessMm(wall) / 1000;
  const angleY = Math.atan2(-dy, dx);
  const sx = (wall.x1 - imgW / 2) * s, sz = (wall.y1 - imgH / 2) * s; // start (world)
  const dirX = lengthM ? ((wall.x2 - imgW / 2) * s - sx) / lengthM : 0;
  const dirZ = lengthM ? ((wall.y2 - imgH / 2) * s - sz) / lengthM : 0;

  // the solid panels left after cutting doors/windows (shared with the exporter)
  const panels = useMemo(
    () => (heightM > 0 && lengthM > 0 ? wallPanels(wall.openings, lengthM, heightM) : []),
    [wall.openings, lengthM, heightM],
  );
  // a tiled wall-texture copy per panel
  const texes = useMemo(() => {
    if (!wallTex) return panels.map(() => null);
    return panels.map((p) => { const t = wallTex.clone(); t.needsUpdate = true; t.repeat.set(Math.max(1, (p.x1 - p.x0) / wallTileM), Math.max(1, (p.y1 - p.y0) / wallTileM)); return t; });
  }, [panels, wallTex, wallTileM]);
  useEffect(() => () => { texes.forEach((t) => { if (t && t !== wallTex) t.dispose(); }); }, [texes, wallTex]);

  if (heightM <= 0 || lenPx < 1 || !panels.length) return null;

  const opacity = solid ? 0.97 : selected ? 0.85 : 0.6;

  return (
    <group>
      {panels.map((p, i) => {
        // extend end-touching panels so corners close cleanly even where a thin
        // interior wall meets a thick exterior one (use the larger half-thickness)
        const cornerExt = Math.max(thickM, 0.2) / 2;
        let x0 = p.x0, x1 = p.x1;
        if (x0 <= 1e-3) x0 -= cornerExt;
        if (x1 >= lengthM - 1e-3) x1 += cornerExt;
        const aC = (x0 + x1) / 2;
        const tex = texes[i];
        const color = tex ? (selected ? "#bae6fd" : "#ffffff") : selected ? "#7dd3fc" : wallColor;
        return (
          <mesh key={i} position={[sx + dirX * aC, (p.y0 + p.y1) / 2, sz + dirZ * aC]} rotation={[0, angleY, 0]} receiveShadow castShadow>
            <boxGeometry args={[x1 - x0, p.y1 - p.y0, thickM]} />
            <meshStandardMaterial map={tex ?? undefined} color={color} transparent opacity={opacity} depthWrite roughness={0.82} metalness={0} envMapIntensity={0.5} side={solid ? 2 : 0} />
          </mesh>
        );
      })}
    </group>
  );
}

// Moves the camera between the outside orbit view and the walk-in 360 view (eye
// height at the room centre, looking around in place).
function CameraRig({ view360, spanM }: { view360: boolean; spanM: number }) {
  const camera = useThree((s) => s.camera);
  // OrbitControls registers itself here via makeDefault
  const controls = useThree((s) => s.controls) as { target: { set: (x: number, y: number, z: number) => void }; update: () => void } | null;

  useEffect(() => {
    const cam = camera as typeof camera & { fov: number; near: number };
    if (view360) {
      cam.position.set(0, EYE_HEIGHT, 0.1);
      cam.fov = 75;
      cam.near = 0.01;
    } else {
      cam.position.set(spanM * 0.6, spanM * 1.15, spanM * 1.0);
      cam.fov = 42;
      cam.near = 0.1;
    }
    cam.updateProjectionMatrix();
    if (controls) {
      controls.target.set(0, view360 ? EYE_HEIGHT : 0, 0);
      controls.update();
    }
  }, [view360, spanM, camera, controls]);

  return null;
}

export default function SceneView() {
  const { planImage, imgW, imgH, mmPerPx, rects, selectedId, walls, selectedWallId, floorZones, floorMat, wallMat, userProducts, quality, setQuality, roomScan } = useStudio();
  const ready = planImage && mmPerPx;
  const s = mmPerPx ? metresPerPx(mmPerPx) : 0.01;
  const spanM = ready ? Math.max(imgW, imgH) * s : roomScan ? 10 : 8;
  const [view360, setView360] = useState(false);
  // 3D navigation (no mode button): drag = orbit, but hold Space or Shift and a
  // drag pans instead — the Blender/SketchUp standard.
  const [panKey, setPanKey] = useState(false);
  useEffect(() => {
    const typing = (t: EventTarget | null) => t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    const down = (e: KeyboardEvent) => { if ((e.code === "Space" || e.key === "Shift") && !typing(e.target)) setPanKey(true); };
    const up = (e: KeyboardEvent) => { if (e.code === "Space" || e.key === "Shift") setPanKey(false); };
    const blur = () => setPanKey(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); };
  }, []);
  const [arUrl, setArUrl] = useState<string | null>(null);
  const [arBusy, setArBusy] = useState(false);

  // The drawing's ink bounding-box in plan pixels — so the floor clips to the
  // actual plan, not the white page margins, even before any walls are raised.
  const [contentBox, setContentBox] = useState<Footprint | null>(null);
  useEffect(() => {
    if (!planImage) { setContentBox(null); return; }
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (cancelled) return;
      const cap = 700;
      const sc = Math.min(1, cap / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * sc));
      const h = Math.max(1, Math.round(img.naturalHeight * sc));
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      const cx = cv.getContext("2d", { willReadFrequently: true });
      if (!cx) return;
      cx.fillStyle = "#fff"; cx.fillRect(0, 0, w, h);
      cx.drawImage(img, 0, 0, w, h);
      const d = cx.getImageData(0, 0, w, h).data;
      let minX = w, minY = h, maxX = -1, maxY = -1;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (d[i + 3] < 10) continue;                                 // transparent → treat as page
        const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        if (lum < 238) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
      }
      if (maxX < minX || maxY < minY) { setContentBox(null); return; }
      const inv = 1 / sc;
      const pad = Math.max(img.naturalWidth, img.naturalHeight) * 0.006;
      setContentBox({
        x: Math.max(0, minX * inv - pad), y: Math.max(0, minY * inv - pad),
        w: (maxX - minX) * inv + 2 * pad, h: (maxY - minY) * inv + 2 * pad,
      });
    };
    img.src = planImage;
    return () => { cancelled = true; };
  }, [planImage]);

  async function openAr() {
    if (!mmPerPx) return;
    setArBusy(true);
    try {
      const blob = await sceneToGlbBlob(walls, rects, imgW, imgH, mmPerPx, userProducts);
      if (!blob) { toast.error("Add some furniture or walls first, then try AR."); return; }
      setArUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("AR export failed", err);
      toast.error("Couldn't build the AR model. Check the console.");
    } finally {
      setArBusy(false);
    }
  }
  function closeAr() {
    if (arUrl) URL.revokeObjectURL(arUrl);
    setArUrl(null);
  }

  // shared wall texture (cloned + tiled per wall inside WallMesh)
  const wallTex = useMemo(() => buildTexture(wallMat), [wallMat]);
  useEffect(() => () => wallTex?.dispose(), [wallTex]);
  const wallTileM = tileMetres(wallMat);
  const wallColor = wallMat.kind === "color" ? wallMat.color : "#ffffff";

  // The building footprint (plan-image px). Floors clip to this so empty white
  // page-margin never becomes floor. Priority: exterior walls (truest) → the
  // drawing's ink box (works with NO walls) → the whole image (last resort).
  const footprint = useMemo<Footprint>(() => {
    const box = (ws: typeof walls): Footprint => {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const w of ws) {
        minX = Math.min(minX, w.x1, w.x2); minY = Math.min(minY, w.y1, w.y2);
        maxX = Math.max(maxX, w.x1, w.x2); maxY = Math.max(maxY, w.y1, w.y2);
      }
      const pad = Math.max(imgW, imgH) * 0.004; // hug the outer wall centrelines
      return { x: minX - pad, y: minY - pad, w: maxX - minX + 2 * pad, h: maxY - minY + 2 * pad };
    };
    const ext = walls.filter((w) => w.kind === "exterior");
    if (ext.length) return box(ext);
    if (contentBox) return contentBox;
    if (walls.length) return box(walls);
    return { x: 0, y: 0, w: imgW, h: imgH };
  }, [walls, contentBox, imgW, imgH]);

  return (
    <div className="relative h-full w-full bg-canvas">
      {!ready && !roomScan && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-center text-sm text-white/45">
          <p>The 3D view appears once you upload a plan and set its scale.</p>
        </div>
      )}

      {(ready || roomScan) && (
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <button
            onClick={() => setQuality(quality === "high" ? "lite" : "high")}
            title={quality === "high" ? "High quality (ambient occlusion). Tap for faster Lite mode." : "Lite mode (fast). Tap for High-quality ambient occlusion."}
            className="rounded-md px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm transition bg-white/12 text-white ring-1 ring-white/25 hover:bg-white/20"
          >
            {quality === "high" ? "✦ HQ" : "⚡ Lite"}
          </button>
          <button
            onClick={openAr}
            disabled={arBusy}
            title="View the furnished room in AR at true size on your phone"
            className={`rounded-md px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm transition bg-white/12 text-white ring-1 ring-white/25 hover:bg-white/20 ${arBusy ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {arBusy ? "Preparing…" : "📱 AR"}
          </button>
          <button
            onClick={() => setView360((v) => !v)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm transition ${
              view360 ? "bg-white text-ink hover:bg-white/90" : "bg-white/12 text-white ring-1 ring-white/25 hover:bg-white/20"
            }`}
          >
            {view360 ? "✕ Exit 360" : "⦿ 360 view"}
          </button>
        </div>
      )}

      <ArViewer open={!!arUrl} url={arUrl} onClose={closeAr} />

      {ready && view360 && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-neutral-200">
          Drag to look around · standing inside the room
        </div>
      )}

      {(ready || roomScan) && !view360 && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-black/45 px-3 py-1 text-[11px] text-neutral-200 backdrop-blur-sm">
          {panKey ? "✋ panning — drag to slide the view" : "drag rotates · hold Space/Shift + drag to pan · scroll zooms"}
        </div>
      )}

      {/* Free the main WebGL context while the AR viewer (its own WebGL canvas) is
          open — two live contexts can exhaust the GPU on low-RAM machines. */}
      {!arUrl && (
      <Canvas
        shadows dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, antialias: false }}
        camera={{ position: [spanM * 0.6, spanM * 1.15, spanM * 1.0], fov: 42, far: Math.max(2000, spanM * 50) }}
        onCreated={({ gl }) => { gl.toneMapping = ACESFilmicToneMapping; gl.toneMappingExposure = 1.16; }}
      >
        {/* warm interior backdrop for the 360 walk-in view */}
        {view360 && <color attach="background" args={["#e8e3d8"]} />}
        {/* a real daylight sky dome for the outside (orbit) view */}
        {!view360 && (
          <Sky distance={450000} sunPosition={[spanM * 0.9, spanM * 1.9, spanM * 0.8]} turbidity={5} rayleigh={1.4} mieCoefficient={0.006} mieDirectionalG={0.85} />
        )}
        {/* gentle haze fades the far lawn into the horizon (kept well back so the sky shows) */}
        {!view360 && <fog attach="fog" args={["#dbe7f2", spanM * 8, spanM * 22]} />}
        {/* soft image-based lighting built in-memory (no external HDRI download) */}
        <Environment resolution={384}>
          <Lightformer intensity={view360 ? 1.3 : 1.8} position={[0, spanM * 2.2, 0]} scale={[spanM * 2.5, spanM * 2.5, 1]} rotation={[Math.PI / 2, 0, 0]} />
          <Lightformer intensity={1.0} position={[spanM * 2, spanM, spanM * 2]} scale={[spanM, spanM * 1.5, 1]} />
          <Lightformer intensity={0.7} position={[-spanM * 2, spanM, -spanM]} scale={[spanM, spanM * 1.5, 1]} />
        </Environment>
        {/* outdoor ambient: pale sky above, soft lawn bounce below */}
        <hemisphereLight args={["#eaf2fb", "#8f9c6e", view360 ? 0.45 : 0.95]} />
        <ambientLight intensity={view360 ? 0.32 : 0.36} />
        {/* warm key (sun) — casts the shadows */}
        <directionalLight
          position={[spanM * 0.9, spanM * 1.9, spanM * 0.8]}
          intensity={view360 ? 2.3 : 3.0}
          color="#ffe7c2"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-radius={7}
          shadow-bias={-0.0002}
          shadow-camera-near={0.1}
          shadow-camera-far={spanM * 5}
          shadow-camera-left={-spanM * 1.4}
          shadow-camera-right={spanM * 1.4}
          shadow-camera-top={spanM * 1.4}
          shadow-camera-bottom={-spanM * 1.4}
        />
        {/* cool sky fill from the opposite side (no shadow) — softens dark faces */}
        <directionalLight position={[-spanM * 1.2, spanM * 1.1, -spanM * 0.9]} intensity={view360 ? 0.35 : 0.6} color="#cfe0f2" />
        {!view360 && <Ground spanM={spanM} />}
        {!view360 && (
          <ContactShadows position={[0, 0.004, 0]} scale={spanM * 2.8} blur={3.6} opacity={0.5} far={spanM} resolution={1024} color="#1c180f" />
        )}

        {ready && (floorMat.kind === "plan" ? (
          <Suspense fallback={null}>
            <PlanFloor url={planImage!} imgW={imgW} imgH={imgH} s={s} fp={footprint} />
          </Suspense>
        ) : (
          <MaterialFloor mat={floorMat} fp={footprint} imgW={imgW} imgH={imgH} s={s} />
        ))}

        {roomScan && <RoomScanModel scan={roomScan} />}

        <SceneCapture />

        {/* everything under exportRoot is what the exporter pulls (real geometry) */}
        {ready && (
          <group name="exportRoot">
            {floorZones.map((z) => (
              <FloorZoneMesh key={z.id} zone={z} imgW={imgW} imgH={imgH} s={s} />
            ))}
            {walls.map((w) => (
              <WallMesh
                key={w.id} wall={w} imgW={imgW} imgH={imgH} s={s}
                selected={w.id === selectedWallId} solid={view360}
                wallTex={wallTex} wallTileM={wallTileM} wallColor={wallColor}
              />
            ))}
            {rects.map((r) => (
              <Furniture key={r.id} rect={r} imgW={imgW} imgH={imgH} s={s} selected={r.id === selectedId} userProducts={userProducts} />
            ))}
          </group>
        )}

        <CameraRig view360={view360} spanM={spanM} />
        <OrbitControls
          makeDefault
          enablePan={!view360}
          enableZoom={!view360}
          screenSpacePanning
          panSpeed={1.1}
          rotateSpeed={view360 ? -0.4 : 0.5}
          // drag = orbit; hold Space/Shift and drag = pan; right-drag always pans
          mouseButtons={{ LEFT: panKey ? MOUSE.PAN : MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }}
          touches={{ ONE: panKey ? TOUCH.PAN : TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
          minDistance={view360 ? 0.01 : spanM * 0.08}
          maxDistance={view360 ? 10 : spanM * 16}
          maxPolarAngle={view360 ? Math.PI : Math.PI * 0.498}
        />

        {/* Realism pass: ambient occlusion grounds objects + softens contact, SMAA
            anti-aliasing, subtle vignette. Orbit view + High quality only. */}
        {!view360 && quality === "high" && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <N8AO aoRadius={0.45} intensity={2.4} distanceFalloff={1} quality="performance" color="#1a1f12" />
            <SMAA />
            <Vignette eskil={false} offset={0.55} darkness={0.22} />
          </EffectComposer>
        )}
      </Canvas>
      )}
    </div>
  );
}
