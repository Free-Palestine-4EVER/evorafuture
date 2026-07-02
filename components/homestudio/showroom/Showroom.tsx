"use client";

import { toast } from "@/lib/homestudio/toast";

// Puffer Showroom — "the plan you walk into".
// A tall scroll track (700vh) behind a fixed full-screen stage. Page scroll maps
// to a target 0..1; we smooth it every frame into `progressRef`, which both the
// 3D scene and the text overlay read. One unbroken cinematic reveal.

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import RevealScene from "./RevealScene";
import BeatOverlay from "./BeatOverlay";
import ArViewer from "@/components/homestudio/ArViewer";
import { sceneToGlbBlob } from "@/lib/homestudio/exporters";
import { DEMO } from "@/lib/homestudio/showroomDemo";

export default function Showroom() {
  const targetRef = useRef(0);   // raw scroll position 0..1
  const progressRef = useRef(0); // smoothed value the scene + overlay read
  const [scrolled, setScrolled] = useState(false);
  const [arUrl, setArUrl] = useState<string | null>(null);
  const [arBusy, setArBusy] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      targetRef.current = Math.min(1, Math.max(0, p));
      if (window.scrollY > 8) setScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    // jump straight to a progress value (deep-linking / QA capture). Harmless in prod.
    (window as unknown as { __reveal?: (p: number) => void }).__reveal = (p: number) => {
      const v = Math.max(0, Math.min(1, p));
      targetRef.current = v;
      progressRef.current = v;
    };
    let raf = 0;
    const tick = () => {
      // critically-damped-ish smoothing toward the scroll target
      progressRef.current += (targetRef.current - progressRef.current) * 0.09;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  async function openAr() {
    setArBusy(true);
    try {
      const blob = await sceneToGlbBlob(DEMO.walls, DEMO.rects, DEMO.imgW, DEMO.imgH, DEMO.mmPerPx, []);
      if (!blob) { toast.error("The room isn't ready yet — scroll to the end, then try again."); return; }
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

  return (
    <main className="relative w-full shrink-0 bg-black" style={{ height: "700vh" }}>
      <div className="fixed inset-0 overflow-hidden">
        {/* free the WebGL context while the AR viewer (its own canvas) is open */}
        {!arUrl && (
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            camera={{ position: [0, 9.8, 1.0], fov: 40, near: 0.01, far: 200 }}
            onCreated={({ gl }) => { gl.toneMapping = ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }}
          >
            <RevealScene progress={progressRef} />
          </Canvas>
        )}

        <BeatOverlay progress={progressRef} onAr={openAr} arBusy={arBusy} />

        {/* scroll hint (fades once they start) */}
        <div
          className="pointer-events-none fixed inset-x-0 top-8 z-10 flex flex-col items-center text-center text-white/85 transition-opacity duration-700"
          style={{ opacity: scrolled ? 0 : 1 }}
        >
          <div className="font-display text-2xl">Puffer Showroom</div>
          <div className="mt-1 text-xs uppercase tracking-[0.3em] text-white/55">scroll to begin ↓</div>
        </div>
      </div>

      <ArViewer open={!!arUrl} url={arUrl} onClose={closeAr} />
    </main>
  );
}
