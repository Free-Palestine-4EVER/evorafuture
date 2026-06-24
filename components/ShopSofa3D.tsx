"use client";

import { Suspense, useState, useMemo, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  useGLTF,
  Center,
  Bounds,
} from "@react-three/drei";
import * as THREE from "three";
import { useT } from "@/lib/i18n";

const MODEL = "/models/sofa.glb";

type Swatch = {
  id: string;
  en: string;
  ar: string;
  hex: string;
};

const SWATCHES: Swatch[] = [
  { id: "royal", en: "Royal Blue", ar: "أزرق ملكي", hex: "#2f4d8a" },
  { id: "emerald", en: "Emerald", ar: "زمردي", hex: "#2f5d4a" },
  { id: "terracotta", en: "Terracotta", ar: "طيني محروق", hex: "#9c4f38" },
  { id: "charcoal", en: "Charcoal", ar: "فحمي", hex: "#33312e" },
  { id: "sand", en: "Sand", ar: "رملي", hex: "#c9b79a" },
];

type Product = {
  id: string;
  en: string;
  ar: string;
  tagEn: string;
  tagAr: string;
};

const PRODUCTS: Product[] = [
  { id: "royal-sofa", en: "Royal Sofa", ar: "كنبة رويال", tagEn: "Sofa", tagAr: "كنبة" },
  { id: "lounge-chair", en: "Lounge Chair", ar: "كرسي استرخاء", tagEn: "Chair", tagAr: "كرسي" },
  { id: "bed", en: "Atlas Bed", ar: "سرير أطلس", tagEn: "Bed", tagAr: "سرير" },
];

function Sofa({ color, onReady }: { color: string; onReady: () => void }) {
  const { scene } = useGLTF(MODEL);

  useEffect(() => {
    onReady();
  }, [onReady]);

  // Clone once per loaded scene so we don't mutate the cached original.
  const model = useMemo(() => scene.clone(true), [scene]);

  // Reactively recolor every mesh material whenever the swatch changes.
  useEffect(() => {
    const tint = new THREE.Color(color);
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const mat = mesh.material;
      if (!mat) return;

      const applyTint = (m: THREE.Material) => {
        const cloned = m.clone() as THREE.Material & {
          color?: THREE.Color;
        };
        if ("color" in cloned && cloned.color) {
          cloned.color = tint.clone();
        }
        return cloned;
      };

      if (Array.isArray(mat)) {
        mesh.material = mat.map((m) => applyTint(m));
      } else {
        mesh.material = applyTint(mat);
      }
    });
  }, [model, color]);

  return (
    <Bounds fit clip observe margin={1.1}>
      <Center>
        <primitive object={model} />
      </Center>
    </Bounds>
  );
}

function Loader() {
  const { lang } = useT();
  return (
    <div className="ss3-loader">
      {lang === "ar" ? "جارٍ تحميل النموذج ثلاثي الأبعاد…" : "Loading 3D…"}
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2l1.2-1.8A1 1 0 0 1 8.5 5h7a1 1 0 0 1 .83.45L17.5 7h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.4" />
    </svg>
  );
}

export default function ShopSofa3D() {
  const { lang } = useT();
  const [active, setActive] = useState<string>("royal");
  const [ready, setReady] = useState(false);
  const reduceRef = useRef(false);

  const current = useMemo(
    () => SWATCHES.find((s) => s.id === active) ?? SWATCHES[0],
    [active]
  );

  useEffect(() => {
    reduceRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const T = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <section className="ss3" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="ss3-wrap">
        {/* LEFT — live 3D viewer */}
        <div className="ss3-viewer">
          <div className="ss3-canvas">
            <Canvas
              dpr={[1, 2]}
              shadows
              camera={{ position: [3, 1.5, 4], fov: 35 }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[5, 8, 5]}
                intensity={1.15}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <directionalLight position={[-6, 4, -4]} intensity={0.45} />
              <Suspense fallback={null}>
                <Sofa color={current.hex} onReady={() => setReady(true)} />
              </Suspense>
              <Suspense fallback={null}>
                <ContactShadows
                  position={[0, -1.18, 0]}
                  opacity={0.45}
                  scale={10}
                  blur={2.6}
                  far={4}
                  resolution={512}
                  color="#2a2622"
                />
              </Suspense>
              <OrbitControls
                makeDefault
                autoRotate
                autoRotateSpeed={0.8}
                enablePan={false}
                enableZoom
                minDistance={3}
                maxDistance={7}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.9}
              />
            </Canvas>

            {!ready && <Loader />}
          </div>

          {/* Swatches under the canvas */}
          <div className="ss3-swatches" role="radiogroup" aria-label={T("Sofa colour", "لون الكنبة")}>
            {SWATCHES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={active === s.id}
                aria-label={lang === "ar" ? s.ar : s.en}
                title={lang === "ar" ? s.ar : s.en}
                className={`ss3-sw ${active === s.id ? "is-active" : ""}`}
                style={{ ["--sw" as string]: s.hex }}
                onClick={() => setActive(s.id)}
              >
                <span className="ss3-sw-dot" />
              </button>
            ))}
          </div>
          <p className="ss3-sw-name">
            {lang === "ar" ? current.ar : current.en}
          </p>
        </div>

        {/* RIGHT — editorial */}
        <div className="ss3-copy">
          <span className="ss3-eyebrow">{T("The Shop", "المتجر")}</span>
          <h2 className="ss3-title">
            {T("Try any piece in your own room.", "جرّب أي قطعة في غرفتك أنت.")}
          </h2>
          <p className="ss3-lede">
            {T(
              "Every piece in our shop is a real 3D model. Spin it, change its colour, then point your phone at the floor and place it in your room — to scale, with just your camera. No app to install.",
              "كل قطعة في متجرنا هي نموذج ثلاثي الأبعاد حقيقي. حرّكها، غيّر لونها، ثم وجّه هاتفك نحو الأرض وضعها في غرفتك — بالمقاس الحقيقي، بكاميرتك فقط. دون تثبيت أي تطبيق."
            )}
          </p>

          <span className="ss3-swlabel">{T("Choose a colour", "اختر لوناً")}</span>
          <div className="ss3-swatches ss3-swatches--inline">
            {SWATCHES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-label={lang === "ar" ? s.ar : s.en}
                title={lang === "ar" ? s.ar : s.en}
                className={`ss3-sw ss3-sw--sm ${active === s.id ? "is-active" : ""}`}
                style={{ ["--sw" as string]: s.hex }}
                onClick={() => setActive(s.id)}
              >
                <span className="ss3-sw-dot" />
              </button>
            ))}
          </div>

          <div className="ss3-cards">
            {PRODUCTS.map((p) => (
              <a key={p.id} href="/shop" className="ss3-card">
                <span className="ss3-card-thumb" aria-hidden="true">
                  <span className="ss3-card-tag">
                    {lang === "ar" ? p.tagAr : p.tagEn}
                  </span>
                </span>
                <span className="ss3-card-name">
                  {lang === "ar" ? p.ar : p.en}
                </span>
                <span className="ss3-card-ar">
                  <CameraIcon />
                  {T("View in AR", "في الواقع المعزّز")}
                </span>
              </a>
            ))}
          </div>

          <div className="ss3-actions">
            <a className="ss3-btn" href="/shop">
              <CameraIcon />
              {T("Try it in your home", "جرّبها في منزلك")}
            </a>
            <a className="ss3-link" href="/shop">
              {T("Browse the shop", "تصفّح المتجر")}
              <span aria-hidden="true">{lang === "ar" ? " ←" : " →"}</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .ss3 {
          --ink: var(--ink, #1e1b17);
          --paper: var(--paper, #f7f3ec);
          --bone: var(--bone, #efe8dc);
          --brass: var(--brass, #b08d57);
          --brass-2: var(--brass-2, #8a6d3f);
          --clay: var(--clay, #9c4f38);
          --ever: var(--ever, #2f5d4a);
          --line: var(--line, rgba(30,27,23,0.14));
          --f-display: var(--f-display, "Playfair Display", Georgia, serif);
          background: var(--bone);
          color: var(--ink);
          padding: clamp(64px, 9vw, 140px) clamp(20px, 5vw, 80px);
        }
        .ss3-wrap {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: clamp(32px, 5vw, 72px);
          align-items: center;
        }
        @media (max-width: 900px) {
          .ss3-wrap { grid-template-columns: 1fr; gap: 40px; }
        }

        /* Viewer */
        .ss3-viewer { display: flex; flex-direction: column; gap: 18px; }
        .ss3-canvas {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3.4;
          border-radius: 20px;
          overflow: hidden;
          background:
            radial-gradient(120% 90% at 50% 18%, var(--paper), var(--bone) 70%);
          border: 1px solid var(--line);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.5) inset,
            0 30px 60px -32px rgba(30,27,23,0.4);
        }
        .ss3-canvas canvas { display: block; touch-action: pan-y; }
        .ss3-loader {
          position: absolute; inset: 0;
          display: grid; place-items: center;
          font: 500 0.86rem/1.4 var(--f-display);
          letter-spacing: 0.02em;
          color: var(--brass-2);
          pointer-events: none;
        }

        /* Swatches */
        .ss3-swatches { display: flex; gap: 12px; flex-wrap: wrap; }
        .ss3-swatches--inline { margin: 6px 0 4px; }
        .ss3-sw {
          --size: 38px;
          width: var(--size); height: var(--size);
          border-radius: 999px;
          padding: 0; cursor: pointer;
          background: transparent;
          border: 1px solid var(--line);
          display: grid; place-items: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .ss3-sw--sm { --size: 30px; }
        .ss3-sw-dot {
          width: calc(var(--size) - 12px);
          height: calc(var(--size) - 12px);
          border-radius: 999px;
          background: var(--sw);
          box-shadow: 0 2px 6px -1px rgba(0,0,0,0.35) inset;
        }
        .ss3-sw:hover { transform: translateY(-1px); }
        .ss3-sw.is-active {
          border-color: var(--brass);
          box-shadow: 0 0 0 3px rgba(176,141,87,0.28);
        }
        .ss3-sw-name {
          margin: -4px 0 0;
          font: 500 0.8rem/1 inherit;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--brass-2);
        }

        /* Copy */
        .ss3-copy { display: flex; flex-direction: column; }
        .ss3-eyebrow {
          font: 600 0.74rem/1 inherit;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--brass-2);
          margin-bottom: 16px;
        }
        .ss3-title {
          font: 400 clamp(1.9rem, 3.6vw, 3rem)/1.08 var(--f-display);
          margin: 0 0 18px;
          letter-spacing: -0.01em;
        }
        .ss3-lede {
          margin: 0 0 26px;
          max-width: 46ch;
          font-size: clamp(0.98rem, 1.4vw, 1.08rem);
          line-height: 1.65;
          color: color-mix(in srgb, var(--ink) 82%, transparent);
        }
        .ss3-swlabel {
          font: 600 0.72rem/1 inherit;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--brass-2);
          margin-bottom: 12px;
        }

        /* Cards */
        .ss3-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin: 26px 0 30px;
        }
        @media (max-width: 480px) {
          .ss3-cards { grid-template-columns: repeat(2, 1fr); }
        }
        .ss3-card {
          display: flex; flex-direction: column; gap: 8px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid var(--line);
          background: var(--paper);
          text-decoration: none; color: inherit;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .ss3-card:hover {
          transform: translateY(-3px);
          border-color: var(--brass);
          box-shadow: 0 18px 36px -24px rgba(30,27,23,0.5);
        }
        .ss3-card-thumb {
          position: relative;
          display: block;
          aspect-ratio: 4 / 3;
          border-radius: 9px;
          background:
            linear-gradient(135deg, var(--bone), color-mix(in srgb, var(--brass) 22%, var(--bone)));
          overflow: hidden;
        }
        .ss3-card-tag {
          position: absolute;
          top: 8px;
          inset-inline-start: 8px;
          font: 600 0.62rem/1 inherit;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.78);
          color: var(--brass-2);
          backdrop-filter: blur(4px);
        }
        .ss3-card-name {
          font: 500 0.92rem/1.2 var(--f-display);
        }
        .ss3-card-ar {
          display: inline-flex; align-items: center; gap: 5px;
          font: 500 0.7rem/1 inherit;
          letter-spacing: 0.04em;
          color: var(--brass-2);
        }
        .ss3-card-ar svg { flex: none; }

        /* Actions */
        .ss3-actions {
          display: flex; align-items: center;
          gap: 22px; flex-wrap: wrap;
        }
        .ss3-btn {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 14px 24px;
          border-radius: 999px;
          background: var(--ink);
          color: var(--paper);
          text-decoration: none;
          font: 600 0.9rem/1 inherit;
          letter-spacing: 0.02em;
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .ss3-btn:hover { transform: translateY(-2px); background: var(--brass-2); }
        .ss3-btn svg { flex: none; }
        .ss3-link {
          font: 600 0.86rem/1 inherit;
          letter-spacing: 0.02em;
          color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--brass);
          padding-bottom: 3px;
          transition: color 0.25s ease, border-color 0.25s ease;
        }
        .ss3-link:hover { color: var(--brass-2); }
      `}</style>
    </section>
  );
}

useGLTF.preload(MODEL);
