"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Clone,
  useGLTF,
  useTexture,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import type { Lang } from "@/lib/i18n";
import { getProduct, type Product } from "@/lib/products";
import {
  ROOM,
  showroomLayout,
  vantages,
  type Placement,
  type Vantage,
} from "@/lib/showroomLayout";

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function Piece({
  placement,
  product,
  onSelect,
  onHover,
}: {
  placement: Placement;
  product: Product;
  onSelect: (p: Product) => void;
  onHover: (p: Product | null) => void;
}) {
  const { scene } = useGLTF(product.model, true);

  // Cast/receive shadows on every mesh of the shared source scene.
  useEffect(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [scene]);

  // Scale the model so its longest axis matches the product's real size,
  // and lift it so it sits exactly on the floor (or pedestal top).
  const { scale, yOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z) || 1;
    const realMax =
      Math.max(
        product.dimensions.w,
        product.dimensions.d,
        product.dimensions.h
      ) / 100;
    const s = realMax / longest;
    return { scale: s, yOffset: -box.min.y * s };
  }, [scene, product]);

  const ped = placement.pedestal ?? 0;

  return (
    <group position={[placement.x, 0, placement.z]} rotation={[0, placement.rotY, 0]}>
      {ped > 0 && (
        <mesh position={[0, ped / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.19, 0.22, ped, 28]} />
          <meshStandardMaterial color="#e9e2d3" roughness={0.85} metalness={0} />
        </mesh>
      )}
      <group
        position={[0, ped + yOffset, 0]}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(product);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(product);
        }}
        onPointerOut={() => onHover(null)}
      >
        <Clone object={scene} />
      </group>
    </group>
  );
}

function Room() {
  const logo = useTexture("/textures/evora-logo.png");
  logo.anisotropy = 8;
  return (
    <group>
      {/* brand logo on the back wall */}
      <mesh position={[0, 2.5, -ROOM.d / 2 + 0.06]}>
        <planeGeometry args={[6.2, 6.2]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>
      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
        <meshStandardMaterial color="#d9cfba" roughness={0.96} />
      </mesh>
      {/* rug under the lounge */}
      <mesh rotation-x={-Math.PI / 2} position={[-0.6, 0.012, -0.4]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#b1794f" roughness={1} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, ROOM.wallH / 2, -ROOM.d / 2]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.wallH]} />
        <meshStandardMaterial color="#efe9dd" roughness={1} />
      </mesh>
      {/* left wall */}
      <mesh
        position={[-ROOM.w / 2, ROOM.wallH / 2, 0]}
        rotation-y={Math.PI / 2}
        receiveShadow
      >
        <planeGeometry args={[ROOM.d, ROOM.wallH]} />
        <meshStandardMaterial color="#e7e1d4" roughness={1} />
      </mesh>
    </group>
  );
}

// Smoothly flies the camera + orbit target to the selected vantage, then hands
// control back to the user so they can still orbit freely from that spot.
function CameraRig({ goal }: { goal: Vantage | null }) {
  const three = useThree() as unknown as {
    camera: THREE.PerspectiveCamera;
    controls: { target: THREE.Vector3; update: () => void } | null;
  };
  const prog = useRef(1);
  const fromPos = useRef(new THREE.Vector3());
  const fromTgt = useRef(new THREE.Vector3());
  const last = useRef<string | null>(null);
  const goalPos = useMemo(() => (goal ? new THREE.Vector3(...goal.cam) : null), [goal]);
  const goalTgt = useMemo(() => (goal ? new THREE.Vector3(...goal.target) : null), [goal]);

  useFrame((_, dt) => {
    const { camera, controls } = three;
    if (!controls || !goal || !goalPos || !goalTgt) return;
    if (last.current !== goal.id) {
      last.current = goal.id;
      prog.current = 0;
      fromPos.current.copy(camera.position);
      fromTgt.current.copy(controls.target);
    }
    if (prog.current < 1) {
      prog.current = Math.min(1, prog.current + dt / 1.3);
      const p = prog.current;
      const t = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      camera.position.lerpVectors(fromPos.current, goalPos, t);
      controls.target.lerpVectors(fromTgt.current, goalTgt, t);
      controls.update();
    }
  });
  return null;
}

// Clickable spots on the floor — "move to certain places".
function Markers({
  onGoto,
  activeId,
}: {
  onGoto: (v: Vantage) => void;
  activeId: string | null;
}) {
  return (
    <>
      {vantages
        .filter((v) => v.id !== "overview")
        .map((v) => (
          <group
            key={v.id}
            position={[v.cam[0], 0.02, v.cam[2]]}
            onClick={(e) => {
              e.stopPropagation();
              onGoto(v);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          >
            <mesh rotation-x={-Math.PI / 2}>
              <ringGeometry args={[0.26, 0.36, 44]} />
              <meshBasicMaterial
                color={activeId === v.id ? "#b27457" : "#16150f"}
                transparent
                opacity={0.5}
              />
            </mesh>
            <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]}>
              <circleGeometry args={[0.09, 24]} />
              <meshBasicMaterial color="#b27457" />
            </mesh>
          </group>
        ))}
    </>
  );
}

function Loader({ lang }: { lang: Lang }) {
  return (
    <Html center>
      <div className="mv-load" style={{ position: "static" }}>
        <span>{lang === "ar" ? "نبني الغرفة…" : "Building the room…"}</span>
      </div>
    </Html>
  );
}

export default function VirtualShowroom({
  onSelect,
  onHover,
  goal,
  onGoto,
  lang = "en",
}: {
  onSelect: (p: Product) => void;
  onHover: (p: Product | null) => void;
  goal: Vantage | null;
  onGoto: (v: Vantage) => void;
  lang?: Lang;
}) {
  const inside = goal != null && goal.id !== "overview";
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [16, 10, 20], fov: 40 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={() => onHover(null)}
    >
      <color attach="background" args={["#f1ebdf"]} />
      <fog attach="fog" args={["#f1ebdf", 34, 64]} />

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[12, 16, 10]}
        intensity={1.45}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-18, 18, 18, -18, 0.1, 55]} />
      </directionalLight>

      <CameraRig goal={goal} />

      <Suspense fallback={<Loader lang={lang} />}>
        <Room />
        <Markers onGoto={onGoto} activeId={goal?.id ?? null} />
        {showroomLayout.map((pl) => {
          const product = getProduct(pl.id);
          if (!product) return null;
          return (
            <Piece
              key={pl.id}
              placement={pl}
              product={product}
              onSelect={onSelect}
              onHover={onHover}
            />
          );
        })}
        <ContactShadows
          position={[0, 0.02, 0]}
          opacity={0.38}
          scale={46}
          blur={2.6}
          far={7}
          resolution={1024}
          color="#3a2f22"
        />
        <Environment preset="apartment" />
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        enablePan={false}
        target={[0, 0.7, 0]}
        minDistance={inside ? 0.5 : 8}
        maxDistance={36}
        maxPolarAngle={Math.PI / 2.08}
        autoRotate={!prefersReduced && !inside}
        autoRotateSpeed={0.32}
      />
    </Canvas>
  );
}

// Preload the unique models staged in the room.
showroomLayout.forEach((pl) => {
  const p = getProduct(pl.id);
  if (p) useGLTF.preload(p.model, true);
});
