"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ShopHero3D = dynamic(() => import("@/components/ShopHero3D"), { ssr: false });

/**
 * Keeps three.js + R3F + drei (~1MB raw / ~260KB gz) and the sofa GLB entirely
 * out of the homepage's hydration-critical bundle. The JS chunk only loads when
 * the visitor scrolls within ~1200px of the section (ShopHero3D's own observer
 * then gates the WebGL canvas). The placeholder reserves ~100vh so the swap
 * doesn't jolt the scroll position of sections below.
 */
export default function ShopHero3DLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setWanted(true);
          io.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return wanted ? <ShopHero3D /> : <div ref={ref} style={{ minHeight: "100vh" }} aria-hidden />;
}
