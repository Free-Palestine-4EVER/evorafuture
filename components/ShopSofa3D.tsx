"use client";

import { Suspense, useState, useMemo, useEffect, useCallback } from "react";
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

/* ------------------------------------------------------------------ *
 * THE SHOP — the sofa + 3 best pieces, all live & viewable at once.
 *
 * One big interactive stage shows the selected piece (spin + recolour),
 * and a rail of four live mini-viewers sits beneath it so every piece is
 * visible in real 3D in the same section. Click a mini-viewer to promote
 * it to the big stage with its own fabric swatches.
 * ------------------------------------------------------------------ */

type Swatch = { en: string; ar: string; hex: string };
type Item = {
  id: string;
  en: string;
  ar: string;
  tagEn: string;
  tagAr: string;
  model: string;
  swatches: Swatch[];
};

const ITEMS: Item[] = [
  {
    id: "azur",
    en: "Azur",
    ar: "أزور",
    tagEn: "Sofa",
    tagAr: "كنبة",
    model: "/models/featured/blue-sofa.glb",
    swatches: [
      { en: "Royal Blue", ar: "أزرق ملكي", hex: "#2f4d8a" },
      { en: "Champagne", ar: "شمبانيا", hex: "#d8c4a0" },
      { en: "Emerald", ar: "زمردي", hex: "#2f5d4a" },
      { en: "Charcoal", ar: "فحمي", hex: "#33312e" },
      { en: "Pale Pink", ar: "وردي فاتح", hex: "#d8a8ad" },
    ],
  },
  {
    id: "castello",
    en: "Castello",
    ar: "كاستيلو",
    tagEn: "Lounge chair",
    tagAr: "كرسي استرخاء",
    model: "/models/featured/src-chair.glb",
    swatches: [
      { en: "Mango Velvet", ar: "مخمل مانجو", hex: "#c8502a" },
      { en: "Peacock Velvet", ar: "مخمل طاووسي", hex: "#1f5a5e" },
      { en: "Sand", ar: "رملي", hex: "#c9b79a" },
      { en: "Charcoal", ar: "فحمي", hex: "#33312e" },
    ],
  },
  {
    id: "carrara",
    en: "Carrara",
    ar: "كرارا",
    tagEn: "Coffee table",
    tagAr: "طاولة قهوة",
    model: "/models/featured/hd-coffee-table.glb",
    swatches: [
      { en: "Carrara", ar: "كرارا", hex: "#e8e4dc" },
      { en: "Sand", ar: "رملي", hex: "#d8cdb8" },
      { en: "Sage", ar: "مريمي", hex: "#aab0a0" },
      { en: "Graphite", ar: "غرافيت", hex: "#5a5a5c" },
      { en: "Onyx", ar: "أونيكس", hex: "#2c2b2a" },
    ],
  },
  {
    id: "laurel",
    en: "Laurel",
    ar: "لورِل",
    tagEn: "Bed",
    tagAr: "سرير",
    model: "/models/furni/bed.glb",
    swatches: [
      { en: "Beige Velvet", ar: "مخمل بيج", hex: "#b9a596" },
      { en: "Warm Sand", ar: "رملي دافئ", hex: "#cdbfa6" },
      { en: "Sage", ar: "مريمي", hex: "#9aa089" },
      { en: "Charcoal", ar: "فحمي", hex: "#33312e" },
    ],
  },
];

/* ------------------------------------------------------------------ */

function Model({
  url,
  color,
  onReady,
}: {
  url: string;
  color: string;
  onReady?: () => void;
}) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  // Clone once per loaded scene so we never mutate the cached original.
  const model = useMemo(() => scene.clone(true), [scene]);

  // Recolour every mesh material whenever the swatch changes.
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
        const cloned = m.clone() as THREE.Material & { color?: THREE.Color };
        if ("color" in cloned && cloned.color) cloned.color = tint.clone();
        return cloned;
      };
      mesh.material = Array.isArray(mat) ? mat.map(applyTint) : applyTint(mat);
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

/* The big interactive stage — orbit + autorotate. */
function Stage({ url, color, onReady }: { url: string; color: string; onReady: () => void }) {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ position: [3, 1.5, 4], fov: 35 }}>
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
        <Model url={url} color={color} onReady={onReady} />
      </Suspense>
      <Suspense fallback={null}>
        <ContactShadows position={[0, -1.18, 0]} opacity={0.45} scale={10} blur={2.6} far={4} resolution={512} color="#2a2622" />
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
  );
}

/* A small always-on mini-viewer — slow autorotate, no controls. */
function Mini({ url, color }: { url: string; color: string }) {
  return (
    <Canvas dpr={[1, 1.5]} shadows camera={{ position: [2.6, 1.4, 3.6], fov: 34 }}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 7, 4]} intensity={1.05} castShadow shadow-mapSize-width={512} shadow-mapSize-height={512} />
      <directionalLight position={[-5, 3, -3]} intensity={0.4} />
      <Suspense fallback={null}>
        <Model url={url} color={color} />
      </Suspense>
      <Suspense fallback={null}>
        <ContactShadows position={[0, -1.15, 0]} opacity={0.4} scale={9} blur={2.6} far={4} resolution={256} color="#2a2622" />
      </Suspense>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={1.1} enablePan={false} enableZoom={false} enableRotate={false} minPolarAngle={Math.PI / 3.4} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}

function Loader() {
  const { lang } = useT();
  return <div className="ss3-loader">{lang === "ar" ? "جارٍ التحميل…" : "Loading 3D…"}</div>;
}

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2l1.2-1.8A1 1 0 0 1 8.5 5h7a1 1 0 0 1 .83.45L17.5 7h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.4" />
    </svg>
  );
}

export default function ShopSofa3D() {
  const { lang } = useT();
  const ar = lang === "ar";
  const T = (en: string, arT: string) => (ar ? arT : en);

  const [activeId, setActiveId] = useState<string>(ITEMS[0].id);
  // Selected swatch per item (default = first swatch of each).
  const [colorByItem, setColorByItem] = useState<Record<string, string>>(
    () => Object.fromEntries(ITEMS.map((it) => [it.id, it.swatches[0].hex]))
  );
  const [ready, setReady] = useState(false);

  const item = useMemo(() => ITEMS.find((i) => i.id === activeId) ?? ITEMS[0], [activeId]);
  const activeColor = colorByItem[item.id];

  const onStageReady = useCallback(() => setReady(true), []);
  const select = (id: string) => {
    setReady(false);
    setActiveId(id);
  };
  const setColor = (hex: string) =>
    setColorByItem((m) => ({ ...m, [item.id]: hex }));

  return (
    <section className="ss3" dir={ar ? "rtl" : "ltr"}>
      <div className="ss3-wrap">
        {/* LEFT — big live stage for the selected piece */}
        <div className="ss3-viewer">
          <div className="ss3-canvas">
            <Stage url={item.model} color={activeColor} onReady={onStageReady} />
            {!ready && <Loader />}
            <span className="ss3-stage-tag">{ar ? item.tagAr : item.tagEn}</span>
          </div>

          {/* Swatches for the selected piece */}
          <div className="ss3-swatches" role="radiogroup" aria-label={T("Fabric", "القماش")}>
            {item.swatches.map((s) => (
              <button
                key={s.hex}
                type="button"
                role="radio"
                aria-checked={activeColor === s.hex}
                aria-label={ar ? s.ar : s.en}
                title={ar ? s.ar : s.en}
                className={`ss3-sw ${activeColor === s.hex ? "is-active" : ""}`}
                style={{ ["--sw" as string]: s.hex }}
                onClick={() => setColor(s.hex)}
              >
                <span className="ss3-sw-dot" />
              </button>
            ))}
          </div>
          <p className="ss3-sw-name">
            {(() => {
              const sw = item.swatches.find((s) => s.hex === activeColor) ?? item.swatches[0];
              return ar ? sw.ar : sw.en;
            })()}
          </p>
        </div>

        {/* RIGHT — editorial */}
        <div className="ss3-copy">
          <span className="ss3-eyebrow">{T("The Shop", "المتجر")}</span>
          <h2 className="ss3-title">
            {T("The sofa and our three best pieces.", "الكنبة وأفضل ثلاث قطع لدينا.")}
          </h2>
          <p className="ss3-lede">
            {T(
              "Every piece below is a real 3D model — all four spinning live in this one section. Pick one to bring it to the big stage, change its fabric, then point your phone at the floor to place it in your room, to scale. No app to install.",
              "كل قطعة في الأسفل نموذج ثلاثي الأبعاد حقيقي — أربعتها تدور مباشرةً في هذا القسم. اختر واحدة لعرضها على المسرح الكبير، غيّر قماشها، ثم وجّه هاتفك نحو الأرض لتضعها في غرفتك بالمقاس الحقيقي. دون تثبيت أي تطبيق."
            )}
          </p>

          {/* The 4 live mini-viewers — sofa + 3 best pieces, all viewable */}
          <div className="ss3-rail">
            {ITEMS.map((it) => (
              <button
                key={it.id}
                type="button"
                className={`ss3-tile ${activeId === it.id ? "is-active" : ""}`}
                onClick={() => select(it.id)}
                aria-pressed={activeId === it.id}
              >
                <span className="ss3-tile-canvas">
                  <Suspense fallback={null}>
                    <Mini url={it.model} color={colorByItem[it.id]} />
                  </Suspense>
                  <span className="ss3-tile-tag">{ar ? it.tagAr : it.tagEn}</span>
                </span>
                <span className="ss3-tile-name">{ar ? it.ar : it.en}</span>
                <span className="ss3-tile-ar">
                  <CameraIcon />
                  {T("View in AR", "في الواقع المعزّز")}
                </span>
              </button>
            ))}
          </div>

          <div className="ss3-actions">
            <a className="ss3-btn" href="/shop">
              <CameraIcon />
              {T("Try it in your home", "جرّبها في منزلك")}
            </a>
            <a className="ss3-link" href="/shop">
              {T("Browse the shop", "تصفّح المتجر")}
              <span aria-hidden="true">{ar ? " ←" : " →"}</span>
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
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: 1.05fr 1fr;
          gap: clamp(32px, 5vw, 72px); align-items: center;
        }
        @media (max-width: 900px) { .ss3-wrap { grid-template-columns: 1fr; gap: 40px; } }

        /* Stage */
        .ss3-viewer { display: flex; flex-direction: column; gap: 18px; }
        .ss3-canvas {
          position: relative; width: 100%; aspect-ratio: 4 / 3.4;
          border-radius: 20px; overflow: hidden;
          background: radial-gradient(120% 90% at 50% 18%, var(--paper), var(--bone) 70%);
          border: 1px solid var(--line);
          box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset, 0 30px 60px -32px rgba(30,27,23,0.4);
        }
        .ss3-canvas canvas { display: block; touch-action: pan-y; }
        .ss3-stage-tag {
          position: absolute; top: 14px; inset-inline-start: 14px;
          font: 600 0.64rem/1 inherit; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 6px 11px; border-radius: 999px;
          background: rgba(255,255,255,0.8); color: var(--brass-2); backdrop-filter: blur(5px);
        }
        .ss3-loader {
          position: absolute; inset: 0; display: grid; place-items: center;
          font: 500 0.86rem/1.4 var(--f-display); letter-spacing: 0.02em;
          color: var(--brass-2); pointer-events: none;
        }

        /* Swatches */
        .ss3-swatches { display: flex; gap: 12px; flex-wrap: wrap; }
        .ss3-sw {
          --size: 38px; width: var(--size); height: var(--size);
          border-radius: 999px; padding: 0; cursor: pointer; background: transparent;
          border: 1px solid var(--line); display: grid; place-items: center;
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .ss3-sw-dot {
          width: calc(var(--size) - 12px); height: calc(var(--size) - 12px);
          border-radius: 999px; background: var(--sw);
          box-shadow: 0 2px 6px -1px rgba(0,0,0,0.35) inset;
        }
        .ss3-sw:hover { transform: translateY(-1px); }
        .ss3-sw.is-active { border-color: var(--brass); box-shadow: 0 0 0 3px rgba(176,141,87,0.28); }
        .ss3-sw-name {
          margin: -4px 0 0; font: 500 0.8rem/1 inherit; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--brass-2);
        }

        /* Copy */
        .ss3-copy { display: flex; flex-direction: column; }
        .ss3-eyebrow {
          font: 600 0.74rem/1 inherit; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--brass-2); margin-bottom: 16px;
        }
        .ss3-title { font: 400 clamp(1.9rem, 3.6vw, 3rem)/1.08 var(--f-display); margin: 0 0 18px; letter-spacing: -0.01em; }
        .ss3-lede {
          margin: 0 0 26px; max-width: 48ch;
          font-size: clamp(0.98rem, 1.4vw, 1.08rem); line-height: 1.65;
          color: color-mix(in srgb, var(--ink) 82%, transparent);
        }

        /* Live mini-viewer rail */
        .ss3-rail {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin: 4px 0 30px;
        }
        @media (max-width: 1100px) { .ss3-rail { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 380px) { .ss3-rail { grid-template-columns: 1fr 1fr; } }
        .ss3-tile {
          display: flex; flex-direction: column; gap: 8px; padding: 10px;
          border-radius: 14px; border: 1px solid var(--line); background: var(--paper);
          cursor: pointer; text-align: start; color: inherit;
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .ss3-tile:hover { transform: translateY(-3px); border-color: var(--brass); box-shadow: 0 18px 36px -24px rgba(30,27,23,0.5); }
        .ss3-tile.is-active { border-color: var(--brass); box-shadow: 0 0 0 2px rgba(176,141,87,0.35), 0 18px 36px -24px rgba(30,27,23,0.5); }
        .ss3-tile-canvas {
          position: relative; display: block; aspect-ratio: 1 / 1; border-radius: 9px; overflow: hidden;
          background: radial-gradient(120% 90% at 50% 20%, var(--bone), color-mix(in srgb, var(--brass) 14%, var(--bone)) 80%);
        }
        .ss3-tile-canvas canvas { display: block; }
        .ss3-tile-tag {
          position: absolute; top: 7px; inset-inline-start: 7px;
          font: 600 0.56rem/1 inherit; letter-spacing: 0.07em; text-transform: uppercase;
          padding: 3px 7px; border-radius: 999px;
          background: rgba(255,255,255,0.8); color: var(--brass-2); backdrop-filter: blur(4px);
        }
        .ss3-tile-name { font: 500 0.9rem/1.2 var(--f-display); }
        .ss3-tile-ar {
          display: inline-flex; align-items: center; gap: 5px;
          font: 500 0.68rem/1 inherit; letter-spacing: 0.03em; color: var(--brass-2);
        }
        .ss3-tile-ar svg { flex: none; }

        /* Actions */
        .ss3-actions { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
        .ss3-btn {
          display: inline-flex; align-items: center; gap: 9px; padding: 14px 24px;
          border-radius: 999px; background: var(--ink); color: var(--paper); text-decoration: none;
          font: 600 0.9rem/1 inherit; letter-spacing: 0.02em;
          transition: transform .25s ease, background .25s ease;
        }
        .ss3-btn:hover { transform: translateY(-2px); background: var(--brass-2); }
        .ss3-btn svg { flex: none; }
        .ss3-link {
          font: 600 0.86rem/1 inherit; letter-spacing: 0.02em; color: var(--ink); text-decoration: none;
          border-bottom: 1px solid var(--brass); padding-bottom: 3px;
          transition: color .25s ease, border-color .25s ease;
        }
        .ss3-link:hover { color: var(--brass-2); }
      `}</style>
    </section>
  );
}

ITEMS.forEach((i) => useGLTF.preload(i.model));
