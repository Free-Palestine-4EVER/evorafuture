"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import ModelViewer, { type ViewerEl } from "./ModelViewer";
import { applyFinish, pickUpholsteryIndices, type MVElement } from "@/lib/recolor";
import { type Category, type Product } from "@/lib/products";

interface Props {
  product: Product;
  onClose: () => void;
}

const T = {
  stage_hint: { en: "Drag to rotate · pinch to zoom", ar: "اسحب للتدوير · قرّص للتكبير" },
  qr_eyebrow: { en: "Open on your phone", ar: "افتح على هاتفك" },
  qr_alt: { en: "Scan to view in AR", ar: "امسح الرمز للعرض بالواقع المعزّز" },
  qr_pre: {
    en: "AR needs a phone camera. Scan this code with your iPhone or Android to place the ",
    ar: "الواقع المعزّز يحتاج كاميرا هاتف. امسح هذا الرمز بآيفونك أو أندرويد لتضع ",
  },
  qr_post: { en: " in your room.", ar: " في غرفتك." },
};

const CAT_AR: Record<Category, string> = {
  Sofas: "كنب",
  Seating: "مقاعد",
  Tables: "طاولات",
  Storage: "تخزين",
  Bedroom: "غرف نوم",
};

export default function ProductDialog({ product, onClose }: Props) {
  const { lang, t } = useT();
  const tl = (k: keyof typeof T) => T[k][lang];
  const [viewer, setViewer] = useState<ViewerEl | null>(null);
  const [arReady, setArReady] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [color, setColor] = useState(0);
  const targetIdx = useRef<number[]>([]);
  const anchorHex = product.colorways[0].hex;

  const onReady = useCallback(
    (el: ViewerEl) => {
      setViewer(el);
      setArReady(Boolean(el.canActivateAR));
      const mv = el as unknown as MVElement;
      targetIdx.current = pickUpholsteryIndices(mv, anchorHex);
      const c = product.colorways[color];
      applyFinish(mv, c.name, c.hex, targetIdx.current);
    },
    [anchorHex, color, product.colorways]
  );

  const pickColor = (i: number) => {
    const c = product.colorways[i];
    setColor(i);
    applyFinish(viewer as unknown as MVElement | null, c.name, c.hex, targetIdx.current);
  };

  // Lock body scroll + close on Escape while the dialog is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const tryInRoom = () => {
    if (viewer && arReady) viewer.activateAR();
    else setShowQR(true);
  };

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}?p=${product.id}`
      : "";
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&color=16150F&bgcolor=fbf9f4&data=${encodeURIComponent(
    pageUrl
  )}`;

  return (
    <motion.div
      className="dlg-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="dlg"
        initial={{ y: 36, opacity: 0, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.99 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="dlg-close" onClick={onClose} aria-label={t("qv_close")}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M1 1l16 16M17 1L1 17"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </button>

        {/* 3D stage ------------------------------------------------------ */}
        <div className="dlg-stage">
          <ModelViewer product={product} onReady={onReady} autoRotate />
          <div className="dlg-stage-hint">{tl("stage_hint")}</div>

          {showQR && (
            <motion.div
              className="qr"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <button className="qr-x" onClick={() => setShowQR(false)}>
                ×
              </button>
              <p className="eyebrow">{tl("qr_eyebrow")}</p>
              <img src={qrSrc} alt={tl("qr_alt")} width={180} height={180} />
              <p>
                {tl("qr_pre")}
                <strong>{product.name}</strong>
                {tl("qr_post")}
              </p>
            </motion.div>
          )}
        </div>

        {/* Info --------------------------------------------------------- */}
        <div className="dlg-info">
          <div>
            {product.badge && <span className="tag">{product.badge}</span>}
            <p className="eyebrow" style={{ marginTop: product.badge ? 14 : 0 }}>
              {lang === "ar" ? CAT_AR[product.category] : product.category}
            </p>
            <h2 className="display-lg dlg-name">{product.name}</h2>
            <p className="dlg-tagline">{product.tagline}</p>
            <p className="dlg-desc">{product.description}</p>

            <div className="dlg-swatches">
              <span className="dlg-label">
                {t("qv_finish")} — {product.colorways[color].name}
              </span>
              <div className="dlg-dots">
                {product.colorways.map((c, i) => (
                  <button
                    key={c.name}
                    className={`dot${i === color ? " on" : ""}`}
                    style={{ background: c.hex }}
                    onClick={() => pickColor(i)}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            <dl className="dlg-specs">
              <div>
                <dt>{t("qv_dims")}</dt>
                <dd>
                  {product.dimensions.w} × {product.dimensions.d} ×{" "}
                  {product.dimensions.h} cm
                </dd>
              </div>
              <div>
                <dt>{t("qv_materials")}</dt>
                <dd>{product.materials.join(" · ")}</dd>
              </div>
            </dl>
          </div>

          <div className="dlg-foot">
            <div className="dlg-cta">
              <button className="btn btn-clay" onClick={tryInRoom}>
                <ArIcon />
                {t("qv_try")}
              </button>
              <a className="btn btn-ghost" href="/visit">{t("consult")}</a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ArIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 7.5l8 4.5 8-4.5M12 12v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
