"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useTexture, Environment, Lightformer, ContactShadows, useGLTF } from "@react-three/drei";
import type { Texture } from "three";
import { Box3, Vector2, Vector3, Group, TOUCH, MOUSE } from "three";
import { useStudio } from "@/lib/puffer/store";
import { resolveProduct } from "@/lib/puffer/catalog";
import { Product, Rect, Wall, wallHeightMm, WALL } from "@/lib/puffer/types";
import { SurfaceMat, proceduralTexture, imageTexture, TILE_METRES } from "@/lib/puffer/textures";
import { sceneRef } from "@/lib/puffer/sceneRef";
import { ProductModel } from "./furniture/models";

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
  if (mat.kind === "wood" || mat.kind === "tile" || mat.kind === "marble" || mat.kind === "concrete") {
    return proceduralTexture(mat.kind);
  }
  return null;
}
const tileMetres = (mat: SurfaceMat) => (mat.kind in TILE_METRES ? TILE_METRES[mat.kind] : 1.5);

// floor with the blueprint plan image (kind === "plan")
function PlanFloor({ url, imgW, imgH, s }: { url: string; imgW: number; imgH: number; s: number }) {
  const tex = useTexture(url);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[imgW * s, imgH * s]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  );
}

// floor with a real material (colour / wood / tile / uploaded photo)
function MaterialFloor({ mat, W, H }: { mat: SurfaceMat; W: number; H: number }) {
  const tex = useMemo(() => {
    const t = buildTexture(mat);
    if (t) { const m = tileMetres(mat); t.repeat.set(W / m, H / m); }
    return t;
  }, [mat, W, H]);
  useEffect(() => () => tex?.dispose(), [tex]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[W, H]} />
      <meshStandardMaterial map={tex ?? undefined} color={mat.kind === "color" ? mat.color : "#ffffff"} roughness={0.85} />
    </mesh>
  );
}

// a real product model (.glb), auto-fitted to the product's TRUE dimensions and sat
// on the floor — so any model (whatever scale it was authored at) shows at real size.
function GlbModel({ url, dims }: { url: string; dims: { w: number; d: number; h: number } }) {
  const { scene } = useGLTF(url);
  const node = useMemo(() => {
    const c = scene.clone(true);
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
  }, [scene, dims.w, dims.h, dims.d]);
  return <primitive object={node} />;
}

function Furniture({ rect, imgW, imgH, s, selected, userProducts }: {
  rect: Rect; imgW: number; imgH: number; s: number; selected: boolean; userProducts: Product[];
}) {
  const product = resolveProduct(rect.productId, userProducts);

  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const worldX = (cx - imgW / 2) * s;
  const worldZ = (cy - imgH / 2) * s;

  // Imported scan furniture with no product yet → solid placeholder box at the
  // scanned footprint + height (matches the app's 3D dollhouse look).
  if (!product) {
    if (!rect.scanType) return null;
    const boxW = rect.w * s;
    const boxD = rect.h * s;
    const boxH = (rect.scanHmm ?? 700) / 1000;
    return (
      <group position={[worldX, 0, worldZ]} rotation={[0, (-rect.rotationDeg * Math.PI) / 180, 0]}>
        <mesh position={[0, boxH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[boxW, boxH, boxD]} />
          <meshStandardMaterial color={selected ? "#C5A06A" : "#b27457"} roughness={0.75} transparent opacity={0.92} />
        </mesh>
      </group>
    );
  }

  const { w, d } = product.dimensions_mm;

  // true footprint vs drawn slot → flag oversize (geometry is sacred: never scale to fit)
  const slotW = rect.w * (s / 0.001); // back to mm
  const slotD = rect.h * (s / 0.001);
  const oversize = w > slotW + 1 || d > slotD + 1;

  return (
    <group
      position={[worldX, 0, worldZ]}
      rotation={[0, (-rect.rotationDeg * Math.PI) / 180, 0]}
    >
      {product.glbUrl ? (
        <Suspense fallback={<ProductModel product={product} oversize={oversize} selected={selected} />}>
          <GlbModel url={product.glbUrl} dims={product.dimensions_mm} />
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
  const heightM = wallHeightMm(wall.height) / 1000;
  const dx = wall.x2 - wall.x1;
  const dy = wall.y2 - wall.y1;
  const lenPx = Math.hypot(dx, dy);
  const lengthM = lenPx * s;
  const thickM = WALL.thicknessMm / 1000;

  // a per-wall copy of the wall texture, tiled to this wall's real size
  const tex = useMemo(() => {
    if (!wallTex) return null;
    const t = wallTex.clone();
    t.needsUpdate = true;
    t.repeat.set(Math.max(1, lengthM / wallTileM), Math.max(1, heightM / wallTileM));
    return t;
  }, [wallTex, wallTileM, lengthM, heightM]);
  useEffect(() => () => { if (tex && tex !== wallTex) tex.dispose(); }, [tex, wallTex]);

  if (heightM <= 0 || lenPx < 1) return null; // "no wall" / degenerate

  const mx = (wall.x1 + wall.x2) / 2;
  const my = (wall.y1 + wall.y2) / 2;
  const worldX = (mx - imgW / 2) * s;
  const worldZ = (my - imgH / 2) * s;
  const angleY = Math.atan2(-dy, dx);

  // Frosted-glass from outside (translucent, depthWrite keeps them solid & flicker-
  // free); near-opaque when standing inside (360) so the room encloses you.
  const opacity = solid ? 0.97 : selected ? 0.85 : 0.6;
  const color = tex ? (selected ? "#E7D3AC" : "#ffffff") : selected ? "#C5A06A" : wallColor;
  return (
    <mesh position={[worldX, heightM / 2, worldZ]} rotation={[0, angleY, 0]} receiveShadow>
      <boxGeometry args={[lengthM + thickM, heightM, thickM]} />
      <meshStandardMaterial
        map={tex ?? undefined}
        color={color}
        transparent
        opacity={opacity}
        depthWrite
        roughness={0.85}
        metalness={0}
        side={solid ? 2 : 0}
      />
    </mesh>
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

// Double-tap / double-click a piece of furniture to recentre the orbit on it
// (the touch equivalent of "click to focus"). Long-press on empty space frames
// the whole room. Additive — desktop mouse orbit/pan/zoom is untouched.
function FocusControls({ enabled }: { enabled: boolean }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  const raycaster = useThree((s) => s.raycaster);
  const controls = useThree((s) => s.controls) as { target: Vector3; update: () => void } | null;
  const goal = useRef<Vector3 | null>(null);

  // raycast a screen point into the export root → world hit point
  const pick = useCallback((clientX: number, clientY: number) => {
    const el = gl.domElement;
    const r = el.getBoundingClientRect();
    const ndc = new Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const root = scene.getObjectByName("exportRoot");
    const hits = root ? raycaster.intersectObject(root, true) : [];
    if (hits.length) goal.current = hits[0].point.clone();
  }, [gl, camera, scene, raycaster]);

  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;
    let lastTap = 0, lastX = 0, lastY = 0, downX = 0, downY = 0;
    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    const clearPress = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };

    const onDblClick = (e: MouseEvent) => pick(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        const now = performance.now();
        if (now - lastTap < 300 && Math.hypot(e.clientX - lastX, e.clientY - lastY) < 24) {
          pick(e.clientX, e.clientY); // synthesised double-tap → focus
          lastTap = 0;
        } else {
          lastTap = now; lastX = e.clientX; lastY = e.clientY;
        }
      }
      downX = e.clientX; downY = e.clientY;
      clearPress();
      pressTimer = setTimeout(() => { goal.current = new Vector3(0, 0, 0); }, 500); // long-press → frame all
    };
    const onPointerMove = (e: PointerEvent) => {
      if (pressTimer && Math.hypot(e.clientX - downX, e.clientY - downY) > 14) clearPress();
    };

    el.addEventListener("dblclick", onDblClick);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", clearPress);
    el.addEventListener("pointercancel", clearPress);
    return () => {
      el.removeEventListener("dblclick", onDblClick);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", clearPress);
      el.removeEventListener("pointercancel", clearPress);
      clearPress();
    };
  }, [enabled, gl, pick]);

  useFrame(() => {
    if (!goal.current || !controls) return;
    controls.target.lerp(goal.current, 0.15);
    if (controls.target.distanceTo(goal.current) < 0.01) goal.current = null;
  });

  return null;
}

export default function SceneView() {
  const { planImage, imgW, imgH, mmPerPx, rects, selectedId, walls, selectedWallId, floorMat, wallMat, userProducts } = useStudio();
  const ready = planImage && mmPerPx;
  const s = mmPerPx ? metresPerPx(mmPerPx) : 0.01;
  const spanM = ready ? Math.max(imgW, imgH) * s : 8;
  const [view360, setView360] = useState(false);

  // shared wall texture (cloned + tiled per wall inside WallMesh)
  const wallTex = useMemo(() => buildTexture(wallMat), [wallMat]);
  useEffect(() => () => wallTex?.dispose(), [wallTex]);
  const wallTileM = tileMetres(wallMat);
  const wallColor = wallMat.kind === "color" ? wallMat.color : "#ffffff";

  return (
    <div className="relative h-full w-full bg-[var(--ink)]">
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-center text-sm text-neutral-500">
          <p>The 3D view appears once you upload a plan and set its scale.</p>
        </div>
      )}

      {ready && (
        <div
          className="absolute right-0 top-0 z-10 flex gap-2"
          style={{
            paddingTop: "max(0.75rem, env(safe-area-inset-top))",
            paddingRight: "max(0.75rem, env(safe-area-inset-right))",
          }}
        >
          <button
            onClick={() => setView360((v) => !v)}
            style={{ touchAction: "manipulation" }}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-lg transition ${
              view360 ? "bg-white text-neutral-900 hover:bg-neutral-200" : "bg-[var(--brass-2)] text-[var(--ink)] hover:bg-[var(--brass-2-hi)]"
            }`}
          >
            {view360 ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden className="shrink-0">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
                Exit 360
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
                  <path d="M21 12c0 2.2-4 4-9 4s-9-1.8-9-4 4-4 9-4M3 12c0-2.2 4-4 9-4M14 5l3 3-3 3" />
                  <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
                </svg>
                360 view
              </>
            )}
          </button>
        </div>
      )}

      {ready && view360 && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-neutral-200">
          Drag to look around · standing inside the room
        </div>
      )}

      <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }} camera={{ position: [spanM * 0.6, spanM * 1.15, spanM * 1.0], fov: 42 }}>
        <color attach="background" args={[view360 ? "#cfd6de" : "#e7ebf0"]} />
        {/* soft image-based lighting built in-memory (no external HDRI download) */}
        <Environment resolution={256}>
          <Lightformer intensity={1.3} position={[0, spanM * 2.2, 0]} scale={[spanM * 2.5, spanM * 2.5, 1]} rotation={[Math.PI / 2, 0, 0]} />
          <Lightformer intensity={0.7} position={[spanM * 2, spanM, spanM * 2]} scale={[spanM, spanM * 1.5, 1]} />
          <Lightformer intensity={0.5} position={[-spanM * 2, spanM, -spanM]} scale={[spanM, spanM * 1.5, 1]} />
        </Environment>
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[spanM * 0.9, spanM * 1.8, spanM * 0.7]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
          shadow-camera-near={0.1}
          shadow-camera-far={spanM * 5}
          shadow-camera-left={-spanM * 1.2}
          shadow-camera-right={spanM * 1.2}
          shadow-camera-top={spanM * 1.2}
          shadow-camera-bottom={-spanM * 1.2}
        />
        {!view360 && (
          <ContactShadows position={[0, 0.004, 0]} scale={spanM * 3} blur={2.4} opacity={0.45} far={spanM} resolution={1024} color="#11161d" />
        )}

        {ready && (floorMat.kind === "plan" ? (
          <Suspense fallback={null}>
            <PlanFloor url={planImage!} imgW={imgW} imgH={imgH} s={s} />
          </Suspense>
        ) : (
          <MaterialFloor mat={floorMat} W={imgW * s} H={imgH * s} />
        ))}

        <SceneCapture />

        {/* everything under exportRoot is what the exporter pulls (real geometry) */}
        {ready && (
          <group name="exportRoot">
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

        {!view360 && (
          <Grid
            args={[spanM * 3, spanM * 3]}
            cellSize={0.5}
            cellThickness={0.5}
            sectionSize={1}
            sectionThickness={1}
            sectionColor="#3f3f46"
            cellColor="#2a2a2a"
            fadeDistance={spanM * 4}
            position={[0, -0.001, 0]}
            infiniteGrid
          />
        )}

        <CameraRig view360={view360} spanM={spanM} />
        <FocusControls enabled={!view360} />
        <OrbitControls
          makeDefault
          enablePan={!view360}
          enableZoom={!view360}
          rotateSpeed={view360 ? -0.4 : 0.5}
          enableDamping
          dampingFactor={0.08}
          zoomToCursor
          minDistance={0.5}
          maxDistance={spanM * 4}
          touches={{ ONE: TOUCH.ROTATE, TWO: view360 ? TOUCH.ROTATE : TOUCH.DOLLY_PAN }}
          mouseButtons={{ LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }}
        />
      </Canvas>
    </div>
  );
}
