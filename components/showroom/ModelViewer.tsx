"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import type { Product } from "@/lib/products";

// Imperative handle the page can call to launch AR from any button.
export interface ViewerEl extends HTMLElement {
  activateAR: () => void;
  canActivateAR: boolean;
}

interface Props {
  product: Product;
  /** Receives the live element so a parent button can launch AR. */
  onReady?: (el: ViewerEl) => void;
  autoRotate?: boolean;
}

export default function ModelViewer({ product, onReady, autoRotate }: Props) {
  const { lang } = useT();
  const ref = useRef<ViewerEl | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load the web component once, on the client only.
  useEffect(() => {
    let active = true;
    import("@google/model-viewer").then(() => {
      if (active) setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !loaded) return;
    const handleLoad = () => onReady?.(el);
    el.addEventListener("load", handleLoad);
    // If it's already loaded by the time we attach, fire immediately.
    if ((el as unknown as { loaded?: boolean }).loaded) onReady?.(el);
    return () => el.removeEventListener("load", handleLoad);
  }, [loaded, onReady]);

  return (
    <model-viewer
      ref={ref as never}
      src={product.model}
      ios-src={product.iosModel}
      alt={`${product.name} — ${product.tagline}`}
      ar
      ar-modes="webxr scene-viewer quick-look"
      ar-scale="fixed"
      ar-placement={product.arPlacement}
      camera-controls
      touch-action="pan-y"
      {...(autoRotate ? { "auto-rotate": true } : {})}
      auto-rotate-delay="600"
      rotation-per-second="14deg"
      interaction-prompt="none"
      shadow-intensity="1.1"
      shadow-softness="1"
      exposure="1.05"
      environment-image="neutral"
      min-camera-orbit="auto auto 4%"
      loading="eager"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Suppress model-viewer's default chrome; we drive AR ourselves. */}
      <div slot="ar-button" style={{ display: "none" }} />
      <div slot="progress-bar" style={{ display: "none" }} />
      {!loaded && (
        <div className="mv-load">
          <span>{lang === "ar" ? "جارٍ تحميل النموذج…" : "Loading model…"}</span>
        </div>
      )}
    </model-viewer>
  );
}
