"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import ProductDialog from "./ProductDialog";
import { formatPrice, type Product } from "@/lib/products";
import { vantages, type Vantage } from "@/lib/showroomLayout";
import type { ViewerEl } from "./ModelViewer";

// R3F must not server-render — load the canvas on the client only.
const VirtualShowroom = dynamic(() => import("./VirtualShowroom"), {
  ssr: false,
  loading: () => (
    <div className="room-loading">
      <span>Preparing the showroom…</span>
    </div>
  ),
});

const ROOM_MODEL = "/models/showroom-room.glb";

export default function ShowroomExperience() {
  const [active, setActive] = useState<Product | null>(null);
  const [hover, setHover] = useState<Product | null>(null);
  const [goal, setGoal] = useState<Vantage | null>(null);
  const [arReady, setArReady] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const roomRef = useRef<ViewerEl | null>(null);
  const activeVantage = goal?.id ?? "overview";

  const enterRoomAR = () => {
    const el = roomRef.current;
    if (el && el.canActivateAR) el.activateAR();
    else setShowQR(true);
  };

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}#room`
      : "";
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&color=1c1815&bgcolor=fbf9f4&data=${encodeURIComponent(
    pageUrl
  )}`;

  return (
    <section id="room" className="room shell">
      <div className="room-head">
        <div>
          <p className="eyebrow">The virtual showroom</p>
          <h2 className="display-lg">
            Walk the whole floor.
            <br />
            <span className="italic">Every piece,</span> staged.
          </h2>
        </div>
        <p className="room-sub">
          A complete furnished room you can orbit, explore and inspect. Click any
          piece to open it — then place that exact item in your own home in AR.
        </p>
      </div>

      <div className="room-stage">
        <VirtualShowroom
          onSelect={setActive}
          onHover={setHover}
          goal={goal}
          onGoto={setGoal}
        />

        <div className="room-nav">
          <span className="room-nav-label">Move to</span>
          {vantages.map((v) => (
            <button
              key={v.id}
              className={`room-nav-btn${activeVantage === v.id ? " on" : ""}`}
              onClick={() => setGoal(v)}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="room-chip">
          {activeVantage === "overview"
            ? "Drag to orbit · or tap a spot to walk in"
            : "Look around · drag to turn · tap a marker to move"}
        </div>

        <AnimatePresence>
          {hover && (
            <motion.div
              className="room-hud"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <span className="eyebrow">{hover.category}</span>
              <strong>{hover.name}</strong>
              <span className="room-hud-price">{formatPrice(hover)}</span>
              <span className="room-hud-cta">Click to view & try in AR →</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="btn btn-clay room-ar" onClick={enterRoomAR}>
          <RoomIcon />
          View the whole room in AR
        </button>

        <AnimatePresence>
          {showQR && (
            <motion.div
              className="room-qr"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <button className="qr-x" onClick={() => setShowQR(false)}>
                ×
              </button>
              <p className="eyebrow">Take the room with you</p>
              <img src={qrSrc} alt="Scan to enter the room in AR" width={172} height={172} />
              <p>
                AR needs a phone camera. Scan with your iPhone or Android to drop
                the entire 15-piece room set onto your real floor.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="room-note">
        {arReady
          ? "Your device supports AR — tap above to place the full room set in your space."
          : "Tip: open this page on a phone to drop the entire room set into your space, or tap any piece to place it individually."}
      </p>

      {/* Hidden viewer that owns the merged-room AR session. */}
      <RoomAR onReady={(el) => ((roomRef.current = el), setArReady(Boolean(el.canActivateAR)))} src={ROOM_MODEL} />

      <AnimatePresence>
        {active && (
          <ProductDialog product={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function RoomAR({
  src,
  onReady,
}: {
  src: string;
  onReady: (el: ViewerEl) => void;
}) {
  const Hidden = dynamic(() => import("./RoomARViewer"), { ssr: false });
  return <Hidden src={src} onReady={onReady} />;
}

function RoomIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9l9-6 9 6v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
