"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Float,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

const SOFA = "/models/furni/bed.glb";

function Sofa() {
  const { scene } = useGLTF(SOFA);

  const model = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = 4.5 / Math.max(size.x, size.y, size.z);
    s.position.set(-center.x, -center.y, -center.z);
    const wrap = new THREE.Group();
    wrap.add(s);
    wrap.scale.setScalar(scale);
    return wrap;
  }, [scene]);

  return <primitive object={model} />;
}

export default function SofaScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.7, 6.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.32} />
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      >
        <orthographicCamera attach="shadow-camera" args={[-6, 6, 6, -6, 0.1, 30]} />
      </directionalLight>
      <spotLight position={[-7, 5, -2]} angle={0.6} penumbra={0.9} intensity={90} color="#fff1da" castShadow />
      <pointLight position={[6, 1.5, 3]} intensity={28} color="#e6b877" />
      <pointLight position={[0, -1.5, 2]} intensity={10} color="#ffe9c8" />

      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.4} floatingRange={[-0.05, 0.05]}>
          <group position={[0, -0.15, 0]}>
            <Sofa />
          </group>
        </Float>

        {/* soft grounding shadow only — no reflective plane (that read as a black square) */}
        <ContactShadows
          position={[0, -2.16, 0]}
          opacity={0.45}
          scale={13}
          blur={3}
          far={5}
          color="#060912"
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={0.15}
        maxPolarAngle={1.7}
      />
    </Canvas>
  );
}

useGLTF.preload(SOFA);
