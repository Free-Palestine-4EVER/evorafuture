"use client";

import { useEffect, useRef, useState } from "react";
import type { ViewerEl } from "./ModelViewer";

// A non-visual <model-viewer> that owns the AR session for the whole room set.
// Kept mounted (1px, offscreen) so a button elsewhere can call activateAR().
export default function RoomARViewer({
  src,
  onReady,
}: {
  src: string;
  onReady: (el: ViewerEl) => void;
}) {
  const ref = useRef<ViewerEl | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    import("@google/model-viewer").then(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !loaded) return;
    const fire = () => onReady(el);
    el.addEventListener("load", fire);
    if ((el as unknown as { loaded?: boolean }).loaded) onReady(el);
    return () => el.removeEventListener("load", fire);
  }, [loaded, onReady]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      <model-viewer
        ref={ref as never}
        src={src}
        alt="Evora showroom room"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        ar-placement="floor"
        loading="eager"
        reveal="manual"
      />
    </div>
  );
}
