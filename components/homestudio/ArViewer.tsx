"use client";

import React, { useEffect } from "react";

// lazy-load the model-viewer web component once (bundled — works offline)
let mvLoaded = false;

export default function ArViewer({ open, url, onClose }: {
  open: boolean;
  url: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!mvLoaded) { mvLoaded = true; import("@google/model-viewer"); }
  }, []);

  if (!open || !url) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/85 p-4" onClick={onClose}>
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between text-white">
          <h2 className="font-display text-lg">View in your room — AR</h2>
          <button onClick={onClose} className="rounded px-2 py-1 hover:bg-white/15" aria-label="Close">✕</button>
        </div>
        {React.createElement("model-viewer", {
          src: url,
          ar: true,
          "ar-modes": "webxr scene-viewer quick-look",
          "ar-scale": "fixed",
          "camera-controls": true,
          "shadow-intensity": "1",
          "touch-action": "pan-y",
          autoplay: true,
          style: { width: "100%", flex: 1, background: "#1a1714", borderRadius: "12px" },
        })}
        <p className="mx-auto mt-2 max-w-xl text-center text-xs leading-relaxed text-amber-300/90">
          Drag to orbit the room. On a phone, tap <b>AR</b> to place it at true size in your space.
          <br />
          <span className="text-white/60">
            AR launch needs the app opened on a phone over HTTPS. Android uses this GLB directly;
            iPhone AR also needs a USDZ file (a future add) — on iPhone you’ll see the 3D preview.
          </span>
        </p>
      </div>
    </div>
  );
}
