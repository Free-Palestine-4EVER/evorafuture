"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import ProductDialog from "./ProductDialog";
import { type Category, type Product } from "@/lib/products";
import { vantages, type Vantage } from "@/lib/showroomLayout";
import type { ViewerEl } from "./ModelViewer";

const T = {
  eyebrow: { en: "The virtual showroom", ar: "المعرض الافتراضي" },
  heading_a: { en: "Walk the whole floor.", ar: "تجوّل في الطابق كاملًا." },
  heading_em: { en: "Every piece,", ar: "كل قطعة،" },
  heading_b: { en: "staged.", ar: "في مكانها." },
  sub: {
    en: "A complete furnished room you can orbit, explore and inspect. Click any piece to open it — then place that exact item in your own home in AR.",
    ar: "غرفة مفروشة بالكامل يمكنك تدويرها واستكشافها وتفحّصها. انقر أي قطعة لتفتحها — ثم ضع القطعة نفسها في بيتك بالواقع المعزّز.",
  },
  move_to: { en: "Move to", ar: "انتقل إلى" },
  chip_overview: {
    en: "Drag to orbit · or tap a spot to walk in",
    ar: "اسحب للتدوير · أو انقر مكانًا لتدخل إليه",
  },
  chip_inside: {
    en: "Look around · drag to turn · tap a marker to move",
    ar: "انظر حولك · اسحب للالتفات · انقر علامة للتنقّل",
  },
  hud_cta: {
    en: "Click to view & try in AR",
    ar: "انقر للعرض والتجربة بالواقع المعزّز",
  },
  room_ar: { en: "View the whole room in AR", ar: "اعرض الغرفة كاملة بالواقع المعزّز" },
  qr_eyebrow: { en: "Take the room with you", ar: "خذ الغرفة معك" },
  qr_alt: { en: "Scan to enter the room in AR", ar: "امسح الرمز لدخول الغرفة بالواقع المعزّز" },
  qr_body: {
    en: "AR needs a phone camera. Scan with your iPhone or Android to drop the entire 15-piece room set onto your real floor.",
    ar: "الواقع المعزّز يحتاج كاميرا هاتف. امسح الرمز بآيفونك أو أندرويد لتضع طقم الغرفة كاملًا (١٥ قطعة) على أرضك الحقيقية.",
  },
  note_ready: {
    en: "Your device supports AR — tap above to place the full room set in your space.",
    ar: "جهازك يدعم الواقع المعزّز — انقر بالأعلى لتضع طقم الغرفة كاملًا في مساحتك.",
  },
  note_tip: {
    en: "Tip: open this page on a phone to drop the entire room set into your space, or tap any piece to place it individually.",
    ar: "نصيحة: افتح هذه الصفحة على الهاتف لتضع طقم الغرفة كاملًا في مساحتك، أو انقر أي قطعة لتضعها وحدها.",
  },
  loading: { en: "Preparing the showroom…", ar: "نُجهّز المعرض…" },
};

const CAT_AR: Record<Category, string> = {
  Sofas: "كنب",
  Seating: "مقاعد",
  Tables: "طاولات",
  Storage: "تخزين",
  Bedroom: "غرف نوم",
};

const VANTAGE_AR: Record<string, string> = {
  overview: "نظرة عامة",
  entrance: "ادخل",
  left: "الجناح الأيسر",
  right: "الجناح الأيمن",
  back: "الصف الخلفي",
};

function RoomLoading() {
  const { lang } = useT();
  return (
    <div className="room-loading">
      <span>{T.loading[lang]}</span>
    </div>
  );
}

// R3F must not server-render — load the canvas on the client only.
const VirtualShowroom = dynamic(() => import("./VirtualShowroom"), {
  ssr: false,
  loading: () => <RoomLoading />,
});

const ROOM_MODEL = "/models/showroom-room.glb";

export default function ShowroomExperience() {
  const { lang } = useT();
  const t = (k: keyof typeof T) => T[k][lang];
  const arrow = lang === "ar" ? "←" : "→";
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
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&color=16150F&bgcolor=fbf9f4&data=${encodeURIComponent(
    pageUrl
  )}`;

  return (
    <section id="room" className="room shell">
      <div className="room-head">
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="display-lg">
            {t("heading_a")}
            <br />
            <span className="italic">{t("heading_em")}</span> {t("heading_b")}
          </h2>
        </div>
        <p className="room-sub">{t("sub")}</p>
      </div>

      <div className="room-stage">
        <VirtualShowroom
          onSelect={setActive}
          onHover={setHover}
          goal={goal}
          onGoto={setGoal}
          lang={lang}
        />

        <div className="room-nav">
          <span className="room-nav-label">{t("move_to")}</span>
          {vantages.map((v) => (
            <button
              key={v.id}
              className={`room-nav-btn${activeVantage === v.id ? " on" : ""}`}
              onClick={() => setGoal(v)}
            >
              {lang === "ar" ? VANTAGE_AR[v.id] ?? v.label : v.label}
            </button>
          ))}
        </div>

        <div className="room-chip">
          {activeVantage === "overview" ? t("chip_overview") : t("chip_inside")}
        </div>

        <AnimatePresence>
          {hover && (
            <motion.div
              className="room-hud"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <span className="eyebrow">
                {lang === "ar" ? CAT_AR[hover.category] : hover.category}
              </span>
              <strong>{hover.name}</strong>
              <span className="room-hud-cta">
                {t("hud_cta")} {arrow}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="btn btn-clay room-ar" onClick={enterRoomAR}>
          <RoomIcon />
          {t("room_ar")}
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
              <p className="eyebrow">{t("qr_eyebrow")}</p>
              <img src={qrSrc} alt={t("qr_alt")} width={172} height={172} />
              <p>{t("qr_body")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="room-note">{arReady ? t("note_ready") : t("note_tip")}</p>

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
