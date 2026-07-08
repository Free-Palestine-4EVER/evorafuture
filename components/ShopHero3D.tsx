"use client";

import { Suspense, useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { Rise, RevealLines } from "@/components/motion";

const EASE = [0.22, 1, 0.36, 1] as const;
type Bi = { en: string; ar: string };

/* ── the colour-changing hero sofa ── */
const SOFA = {
  model: "/models/featured/blue-sofa.glb",
  name: { en: "Dune Curved Sofa", ar: "كنبة ديون المنحنية" },
  tag: { en: "Three-seater · changeable fabric", ar: "ثلاثة مقاعد · قماش قابل للتغيير" },
};
const SWATCHES: { name: Bi; hex: string }[] = [
  { name: { en: "Champagne", ar: "شمبانيا" }, hex: "#d8c4a0" },
  { name: { en: "Emerald", ar: "زمردي" }, hex: "#2f5d4a" },
  { name: { en: "Royal Blue", ar: "أزرق ملكي" }, hex: "#2f4d8a" },
  { name: { en: "Clay", ar: "طيني" }, hex: "#a8624a" },
  { name: { en: "Charcoal", ar: "فحمي" }, hex: "#33312e" },
];

/* shared model — optionally recolours every material (only the sofa uses tint) */
function Model({ url, tint, onReady }: { url: string; tint?: string; onReady?: () => void }) {
  const { scene } = useGLTF(url);
  useEffect(() => { onReady?.(); }, [onReady]);
  const model = useMemo(() => scene.clone(true), [scene]);
  useEffect(() => {
    const color = tint ? new THREE.Color(tint) : null;
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (!color) return;
      const mat = mesh.material;
      if (!mat) return;
      const applyTint = (m: THREE.Material) => {
        const cloned = m.clone() as THREE.Material & { color?: THREE.Color };
        if ("color" in cloned && cloned.color) cloned.color = color.clone();
        return cloned;
      };
      mesh.material = Array.isArray(mat) ? mat.map(applyTint) : applyTint(mat);
    });
  }, [model, tint]);
  return (
    <Bounds fit clip observe margin={1.12}>
      <Center>
        <primitive object={model} />
      </Center>
    </Bounds>
  );
}

function SofaStage({ color, onReady }: { color: string; onReady: () => void }) {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ position: [3, 1.5, 4], fov: 35 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-6, 4, -4]} intensity={0.5} />
      <Suspense fallback={null}>
        <Model url={SOFA.model} tint={color} onReady={onReady} />
      </Suspense>
      <Suspense fallback={null}>
        <ContactShadows position={[0, -1.18, 0]} opacity={0.4} scale={10} blur={2.8} far={4} resolution={512} color="#2a2622" />
      </Suspense>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.85} enablePan={false} enableZoom minDistance={3} maxDistance={7} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.9} />
    </Canvas>
  );
}

export default function ShopHero3D() {
  const { lang } = useT();
  const en = lang === "en";
  const [color, setColor] = useState(SWATCHES[0].hex);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const swName = SWATCHES.find((s) => s.hex === color) ?? SWATCHES[0];

  // Mount the sofa's WebGL canvas ONLY while this section is on (or near) screen.
  // It auto-rotates with shadows and would otherwise render every frame from page
  // load, starving the hero/kitchen frame-scrub on real phones (the scrub freezes
  // on frame 1). The section's DOM keeps its fixed sizes, so there's no layout jump.
  const sectionRef = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="shop-hero" className="sh3" lang={lang} ref={sectionRef}>
      <div className="container sh3__head">
        <div className="sh3__headl">
          <div className="sh3__kick">
            <motion.span className="sh3__rule" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.9, ease: EASE }} />
            <Rise as="span" className="eyebrow sh3__eyebrow">{en ? "Shop the collection" : "تسوّق المجموعة"}</Rise>
          </div>
          <RevealLines lines={en ? ["Make the sofa", "yours."] : ["اجعل الكنبة", "لك."]} className="display sh3__title" delay={0.06} />
          <Rise delay={0.12} as="p" className="sh3__sub">
            {en ? "Spin it, change the fabric in real time — then upload your plan and watch your whole home come to life, designed with you, under one roof." : "أدِرها، غيّر القماش لحظيًّا — ثم ارفع مخطّطك وشاهد بيتك كاملًا ينبض بالحياة، مُصمَّمًا معك، تحت سقف واحد."}
          </Rise>
        </div>
        <Rise delay={0.16} className="sh3__viewall-wrap">
          <a href="/shop/sofas" className="sh3__viewall" data-cursor="hover">{en ? "View all sofas" : "كل الكنب"}<span className="sh3__va-arrow" aria-hidden>→</span></a>
        </Rise>
      </div>

      {/* hero — colour-changing sofa */}
      <div className="container sh3__hero">
        <div className="sh3__viewer">
          {live && <SofaStage color={color} onReady={onReady} />}
          {(!ready || !live) && <span className="sh3__loader">{en ? "Loading 3D…" : "جارٍ التحميل…"}</span>}
          <span className="sh3__badge">{en ? "Live 3D" : "ثلاثي الأبعاد"}</span>
        </div>
        <div className="sh3__panel">
          <span className="sh3__ptag">{SOFA.tag[lang]}</span>
          <h3 className="sh3__pname display">{SOFA.name[lang]}</h3>
          <span className="sh3__swlabel">{en ? "Fabric" : "القماش"} — <b>{swName.name[lang]}</b></span>
          <div className="sh3__swatches" role="radiogroup" aria-label={en ? "Fabric" : "القماش"}>
            {SWATCHES.map((s) => (
              <button key={s.hex} type="button" role="radio" aria-checked={color === s.hex} aria-label={s.name[lang]} title={s.name[lang]}
                className={`sh3__sw ${color === s.hex ? "is-active" : ""}`} style={{ ["--sw" as string]: s.hex }} onClick={() => setColor(s.hex)}>
                <span className="sh3__sw-dot" />
              </button>
            ))}
          </div>
          <div className="sh3__pcta">
            <a href="/shop/sofas" className="sh3__btn" data-cursor="hover">{en ? "Shop this sofa" : "تسوّق هذه الكنبة"}<span aria-hidden>↗</span></a>
            <a href="/shop/sofas" className="sh3__link" data-cursor="hover">{en ? "Try it in your home" : "جرّبها في بيتك"}</a>
          </div>
        </div>
      </div>

      <div className="container sh3__foot">
        <a href="/shop" className="sh3__viewallbtn" data-cursor="hover">{en ? "View all products" : "كل المنتجات"}<span aria-hidden>→</span></a>
      </div>

      <style>{`
        .sh3 { position: relative; background: var(--paper); padding-block: clamp(3.5rem, 8vw, 7rem); }
        .sh3__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; margin-bottom: clamp(1.8rem, 3.6vw, 3rem); }
        .sh3__headl { min-width: 0; }
        .sh3__kick { display: flex; align-items: center; gap: 1rem; }
        .sh3__rule { display: block; width: 64px; height: 1px; background: var(--brass); transform-origin: left; flex-shrink: 0; }
        html[dir="rtl"] .sh3__rule { transform-origin: right; }
        .sh3__eyebrow { color: var(--brass); display: block; }
        .sh3__title { font-size: clamp(2.2rem, 5.2vw, 4.4rem); line-height: 1.0; margin: 1rem 0 0; color: var(--ink); }
        .sh3__sub { color: var(--ink-soft); max-width: 50ch; margin: 1rem 0 0; font-size: 1rem; }
        .sh3__viewall-wrap { flex-shrink: 0; }
        .sh3__viewall { display: inline-flex; align-items: center; gap: 0.55rem; white-space: nowrap; font-size: 0.78rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink); border-bottom: 1px solid var(--ink); padding-bottom: 4px; transition: gap .4s var(--ease), color .3s var(--ease); }
        .sh3__viewall:hover { gap: 0.9rem; color: var(--brass); border-color: var(--brass); }
        html[dir="rtl"] .sh3__va-arrow { transform: scaleX(-1); }

        /* hero */
        .sh3__hero { display: grid; grid-template-columns: 1.25fr 1fr; gap: clamp(20px, 3vw, 48px); align-items: center; }
        .sh3__viewer { position: relative; aspect-ratio: 4 / 3.3; border-radius: 14px; overflow: hidden;
          background: radial-gradient(120% 95% at 50% 16%, var(--paper-2), #efe9df 78%); border: 1px solid rgba(16,15,13,0.08);
          box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset, 0 36px 80px -50px rgba(16,15,13,0.45); }
        .sh3__viewer canvas { display: block; touch-action: pan-y; }
        .sh3__loader { position: absolute; inset: 0; display: grid; place-items: center; color: var(--brass); font-size: 0.85rem; pointer-events: none; }
        .sh3__badge { position: absolute; top: 1rem; inset-inline-start: 1rem; background: rgba(255,255,255,0.85); color: var(--brass); font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.45em 0.85em; border-radius: 100px; backdrop-filter: blur(5px); }

        .sh3__panel { display: flex; flex-direction: column; }
        .sh3__ptag { font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-faint); }
        html[dir="rtl"] .sh3__ptag { letter-spacing: 0.06em; }
        .sh3__pname { font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1.0; color: var(--ink); margin: 0.5rem 0 0; }
        .sh3__swlabel { font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); margin: 1.6rem 0 0.7rem; }
        .sh3__swlabel b { color: var(--ink); font-weight: 600; }
        .sh3__swatches { display: flex; gap: 12px; flex-wrap: wrap; }
        .sh3__sw { --size: 40px; width: var(--size); height: var(--size); border-radius: 999px; padding: 0; cursor: pointer; background: transparent; border: 1px solid rgba(16,15,13,0.14); display: grid; place-items: center; transition: transform .25s var(--ease), box-shadow .25s var(--ease), border-color .25s var(--ease); }
        .sh3__sw-dot { width: calc(var(--size) - 12px); height: calc(var(--size) - 12px); border-radius: 999px; background: var(--sw); box-shadow: 0 2px 6px -1px rgba(0,0,0,0.35) inset; }
        .sh3__sw:hover { transform: translateY(-2px); }
        .sh3__sw.is-active { border-color: var(--brass); box-shadow: 0 0 0 3px rgba(138,106,60,0.28); }
        .sh3__pcta { display: flex; align-items: center; gap: 1.4rem; flex-wrap: wrap; margin-top: 1.8rem; }
        .sh3__btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.95rem 1.6rem; border-radius: 100px; background: var(--ink); color: var(--paper); font-size: 0.85rem; letter-spacing: 0.04em; transition: transform .3s var(--ease), background .3s var(--ease); }
        .sh3__btn:hover { transform: translateY(-2px); background: var(--brass); }
        html[dir="rtl"] .sh3__btn span { transform: scaleX(-1); }
        .sh3__link { font-size: 0.84rem; color: var(--ink); border-bottom: 1px solid var(--brass); padding-bottom: 3px; transition: color .3s var(--ease); }
        .sh3__link:hover { color: var(--brass); }

        .sh3__foot { display: flex; justify-content: center; margin-top: clamp(2rem, 4vw, 3.2rem); }
        .sh3__viewallbtn { display: inline-flex; align-items: center; gap: 0.6rem; padding: 1rem 2.2rem; border: 1px solid var(--ink); border-radius: 100px; color: var(--ink); font-size: 0.82rem; letter-spacing: 0.14em; text-transform: uppercase; transition: gap .4s var(--ease), background .3s var(--ease), color .3s var(--ease); }
        .sh3__viewallbtn:hover { gap: 1rem; background: var(--ink); color: var(--paper); }
        html[dir="rtl"] .sh3__viewallbtn span { transform: scaleX(-1); }

        @media (max-width: 900px) {
          .sh3__head { flex-direction: column; align-items: flex-start; gap: 1.2rem; }
          .sh3__hero { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          /* size the sofa stage for a phone viewport + give the swatches a ≥44px tap target */
          .sh3__viewer { aspect-ratio: 1 / 1; }
          .sh3__sw { --size: 46px; }
          .sh3__swatches { gap: 14px; }
          .sh3__pcta { gap: 1rem 1.4rem; }
          .sh3__btn, .sh3__viewallbtn { min-height: 48px; }
        }
      `}</style>
    </section>
  );
}

useGLTF.preload(SOFA.model);
