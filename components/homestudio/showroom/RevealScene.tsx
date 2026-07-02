"use client";

// The animated 3D scene for the Showroom reveal. Reads a single smoothed scroll
// progress (a ref, so no React re-renders per frame) and drives everything off it:
// walls trace then rise, furniture materialises, the floor turns from blueprint to
// oak, the light warms, and the camera descends from top-down to standing inside.

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, useTexture, useGLTF } from "@react-three/drei";
import {
  Box3, Color, Group, Mesh, MeshStandardMaterial, PerspectiveCamera, Vector3,
} from "three";
import { getProduct } from "@/lib/homestudio/catalog";
import { proceduralTexture, materialTileM } from "@/lib/homestudio/textures";
import { wallHeightMm } from "@/lib/homestudio/types";
import { sceneRef } from "@/lib/homestudio/sceneRef";
import { DEMO } from "@/lib/homestudio/showroomDemo";
import { BEATS, seg, smooth, invlerp, lerp, sampleCam } from "@/lib/homestudio/revealTimeline";

const S = DEMO.mmPerPx * 0.001;       // metres per plan-pixel (0.01)
const W = DEMO.imgW * S;              // room width in metres (7.0)
const H = DEMO.imgH * S;              // room depth in metres (4.5)
const SPAN = Math.max(W, H);

// preload every demo model so the reveal never pops in mid-scroll
DEMO.rects.forEach((r) => {
  const p = getProduct(r.productId);
  if (p?.glbUrl) useGLTF.preload(p.glbUrl);
});

type Progress = RefObject<number>;

// keep a handle to the live scene so the AR exporter can pull real geometry
function SceneCapture() {
  const scene = useThree((s) => s.scene);
  sceneRef.current = scene;
  return null;
}

// ── camera: scripted path + gentle pointer parallax once we're inside ───────
const tmpPos = new Vector3();
const tmpLook = new Vector3();
function CameraRig({ progress }: { progress: Progress }) {
  const cam = useThree((s) => s.camera) as PerspectiveCamera;
  useFrame((state) => {
    const p = progress.current ?? 0;
    const fov = sampleCam(p, tmpPos, tmpLook);
    // parallax look-around ramps in only near the end (the "stand and look" moment)
    const end = smooth(invlerp(0.84, 1, p));
    tmpLook.x += state.pointer.x * 1.7 * end;
    tmpLook.y += -state.pointer.y * 0.9 * end;
    cam.position.copy(tmpPos);
    cam.lookAt(tmpLook);
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); }
  });
  return null;
}

// ── atmosphere: cool blueprint daylight → warm interior ─────────────────────
const COOL_BG = new Color("#5f7d99");
const WARM_BG = new Color("#efe6d6");
const COOL_SUN = new Color("#dfe9f2");
const WARM_SUN = new Color("#ffedcf");
function Atmosphere({ progress }: { progress: Progress }) {
  const { scene } = useThree();
  const bg = useMemo(() => new Color().copy(COOL_BG), []);
  const dir = useRef<import("three").DirectionalLight>(null);
  const amb = useRef<import("three").AmbientLight>(null);
  const hemi = useRef<import("three").HemisphereLight>(null);
  useEffect(() => { scene.background = bg; }, [scene, bg]);
  useFrame(() => {
    const p = progress.current ?? 0;
    const warm = smooth(invlerp(0.55, 0.95, p)); // warm up across material → walk-in
    bg.copy(COOL_BG).lerp(WARM_BG, warm);
    if (dir.current) { dir.current.intensity = lerp(2.1, 2.7, warm); dir.current.color.copy(COOL_SUN).lerp(WARM_SUN, warm); }
    if (amb.current) amb.current.intensity = lerp(0.55, 0.42, warm);
    if (hemi.current) hemi.current.intensity = lerp(0.85, 0.5, warm);
  });
  return (
    <>
      <hemisphereLight ref={hemi} args={["#e7f0f7", "#c9b79a", 0.85]} />
      <ambientLight ref={amb} intensity={0.55} />
      <directionalLight
        ref={dir}
        position={[SPAN * 0.9, SPAN * 1.9, SPAN * 0.8]}
        intensity={2.1}
        color={COOL_SUN}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={6}
        shadow-bias={-0.0002}
        shadow-camera-near={0.1}
        shadow-camera-far={SPAN * 5}
        shadow-camera-left={-SPAN * 1.4}
        shadow-camera-right={SPAN * 1.4}
        shadow-camera-top={SPAN * 1.4}
        shadow-camera-bottom={-SPAN * 1.4}
      />
    </>
  );
}

// ── floor: blueprint plan image crossfading up into real oak ────────────────
function Floor({ progress }: { progress: Progress }) {
  const planTex = useTexture(DEMO.planSrc);
  const oakTex = useMemo(() => {
    const t = proceduralTexture(DEMO.floorMatId);
    if (t) { const m = materialTileM(DEMO.floorMatId); t.repeat.set(W / m, H / m); }
    return t;
  }, []);
  useEffect(() => () => oakTex?.dispose(), [oakTex]);
  const oakMat = useRef<MeshStandardMaterial>(null);
  useFrame(() => {
    const a = seg(progress.current ?? 0, BEATS.material[0], BEATS.material[1]);
    if (oakMat.current) oakMat.current.opacity = a;
  });
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={planTex} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial ref={oakMat} map={oakTex ?? undefined} transparent opacity={0} roughness={0.6} />
      </mesh>
    </>
  );
}

// ── a wall: a glowing line that draws itself, then extrudes upward ──────────
function RevealWall({ wall, index, count, progress }: {
  wall: (typeof DEMO.walls)[number]; index: number; count: number; progress: Progress;
}) {
  const dx = wall.x2 - wall.x1, dy = wall.y2 - wall.y1;
  const lenPx = Math.hypot(dx, dy);
  const lengthM = lenPx * S;
  const thick = 0.1;
  const fullH = wallHeightMm(wall.height) / 1000;
  const startX = (wall.x1 - DEMO.imgW / 2) * S;
  const startZ = (wall.y1 - DEMO.imgH / 2) * S;
  const angleY = Math.atan2(-dy, dx);

  const grp = useRef<Group>(null);
  const mat = useRef<MeshStandardMaterial>(null);
  useFrame(() => {
    const p = progress.current ?? 0;
    // each wall traces in a slightly staggered slice of the trace beat
    const span = 0.09;
    const t0 = lerp(BEATS.trace[0], BEATS.trace[1] - span, count > 1 ? index / (count - 1) : 0);
    const len = smooth(invlerp(t0, t0 + span, p));
    const rise = seg(p, BEATS.rise[0], BEATS.rise[1]);
    if (grp.current) {
      grp.current.scale.x = Math.max(0.0001, len);
      grp.current.scale.y = Math.max(0.0001, rise);
    }
    if (mat.current) {
      // glow while it's a flat drawn line; fade the glow out as it rises
      const glow = len * (1 - seg(p, BEATS.rise[0], (BEATS.rise[0] + BEATS.rise[1]) / 2));
      mat.current.emissiveIntensity = glow * 0.9;
      // frosted glass from outside (so the room visibly fills with furniture),
      // turning solid only as we step inside for the walk-in
      mat.current.opacity = lerp(0.3, 0.97, seg(p, 0.84, 0.985));
    }
  });

  if (fullH <= 0 || lenPx < 1) return null;
  return (
    <group ref={grp} position={[startX, 0, startZ]} rotation={[0, angleY, 0]}>
      <mesh position={[lengthM / 2, fullH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[lengthM + thick, fullH, thick]} />
        <meshStandardMaterial
          ref={mat}
          color={DEMO.wallColor}
          emissive="#6fd2ff"
          emissiveIntensity={0}
          roughness={0.9}
          metalness={0}
          transparent
          opacity={0.3}
          depthWrite={false}
          side={2}
        />
      </mesh>
    </group>
  );
}

// auto-fit a catalog GLB to its true mm dimensions, base on the floor
function FitGlb({ url, dims }: { url: string; dims: { w: number; d: number; h: number } }) {
  const { scene } = useGLTF(url);
  const node = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => { const m = o as Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    const box = new Box3().setFromObject(c);
    const size = new Vector3(); box.getSize(size);
    const center = new Vector3(); box.getCenter(center);
    const tw = dims.w / 1000, th = dims.h / 1000, td = dims.d / 1000;
    const scale = Math.min(tw / (size.x || 1), th / (size.y || 1), td / (size.z || 1)) || 1;
    c.position.set(-center.x, size.y / 2 - center.y, -center.z); // base → y=0
    const g = new Group(); g.add(c); g.scale.setScalar(scale);
    return g;
  }, [scene, dims.w, dims.h, dims.d]);
  return <primitive object={node} />;
}

// a furniture piece: drops in and settles during the furnish beat
function RevealItem({ rect, index, count, progress }: {
  rect: (typeof DEMO.rects)[number]; index: number; count: number; progress: Progress;
}) {
  const product = getProduct(rect.productId);
  const grp = useRef<Group>(null);
  const dims = product?.dimensions_mm;
  const worldX = (rect.x + rect.w / 2 - DEMO.imgW / 2) * S;
  const worldZ = (rect.y + rect.h / 2 - DEMO.imgH / 2) * S;
  useFrame(() => {
    const p = progress.current ?? 0;
    const span = 0.11;
    const t0 = lerp(BEATS.furnish[0], BEATS.furnish[1] - span, count > 1 ? index / (count - 1) : 0);
    const a = smooth(invlerp(t0, t0 + span, p));
    if (grp.current) {
      grp.current.scale.setScalar(Math.max(0.0001, a));
      grp.current.position.y = (1 - a) * 0.45; // settle down from above
    }
  });
  if (!product?.glbUrl || !dims) return null;
  return (
    <group position={[worldX, 0, worldZ]} rotation={[0, (-rect.rotationDeg * Math.PI) / 180, 0]}>
      <group ref={grp} scale={0.0001}>
        <Suspense fallback={null}>
          <FitGlb url={product.glbUrl} dims={dims} />
        </Suspense>
      </group>
    </group>
  );
}

export default function RevealScene({ progress }: { progress: Progress }) {
  return (
    <>
      <SceneCapture />
      <Atmosphere progress={progress} />
      <Environment resolution={256}>
        <Lightformer intensity={1.4} position={[0, SPAN * 2.2, 0]} scale={[SPAN * 2.5, SPAN * 2.5, 1]} rotation={[Math.PI / 2, 0, 0]} />
        <Lightformer intensity={1.0} position={[SPAN * 2, SPAN, SPAN * 2]} scale={[SPAN, SPAN * 1.5, 1]} />
        <Lightformer intensity={0.7} position={[-SPAN * 2, SPAN, -SPAN]} scale={[SPAN, SPAN * 1.5, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Floor progress={progress} />
      </Suspense>
      <ContactShadows position={[0, 0.003, 0]} scale={SPAN * 2.2} blur={2.6} opacity={0.34} far={SPAN} resolution={1024} color="#2b2218" />

      {/* exportRoot: what the AR exporter pulls (walls + real furniture) */}
      <group name="exportRoot">
        {DEMO.walls.map((w, i) => (
          <RevealWall key={w.id} wall={w} index={i} count={DEMO.walls.length} progress={progress} />
        ))}
        {DEMO.rects.map((r, i) => (
          <RevealItem key={r.id} rect={r} index={i} count={DEMO.rects.length} progress={progress} />
        ))}
      </group>

      <CameraRig progress={progress} />
    </>
  );
}
