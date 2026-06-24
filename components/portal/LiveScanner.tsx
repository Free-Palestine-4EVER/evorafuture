"use client";

// LiveScanner — the in-browser clone of pCon.scan / RoomPlan.
//
// Opens the rear camera, identifies furniture in real time (coco-ssd, loaded
// from CDN), and lets the operator reconstruct the room by aiming at each floor
// corner + item and tapping "capture". Heading/pitch come from the device IMU;
// the geometry math lives in lib/puffer/liveScan.ts. On Finish it returns a
// ScanFile, which scanToProject() turns into an editable plan + 3D room.
//
// Depth is estimated (browsers can't read iPhone LiDAR), so the plan is a strong
// starting point meant to be nudged in the editor — but the live feel, the item
// labels and the 3D plan building up all mirror the native app.

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import {
  COCO_TO_FURNITURE,
  DEFAULT_CAMERA_HEIGHT_M,
  aimToGround,
  buildScanFile,
  polygonAreaM2,
  type CornerTap,
  type ItemTap,
} from "@/lib/puffer/liveScan";
import type { ScanFile } from "@/lib/puffer/importScan";

type Detection = { bbox: [number, number, number, number]; class: string; score: number };

declare global {
  interface Window {
    cocoSsd?: { load: (cfg?: unknown) => Promise<{ detect: (el: HTMLVideoElement) => Promise<Detection[]> }> };
    tf?: unknown;
  }
}

const CDN_TF = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js";
const CDN_COCO = "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("load failed: " + src));
    document.head.appendChild(s);
  });
}

export default function LiveScanner({
  onClose, onComplete,
}: {
  onClose: () => void;
  onComplete: (scan: ScanFile) => void | Promise<void>;
}) {
  const { lang, dir } = useT();
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const planRef = useRef<HTMLCanvasElement>(null);

  const [phase, setPhase] = useState<"intro" | "scanning">("intro");
  const [err, setErr] = useState<string>("");
  const [modelReady, setModelReady] = useState(false);
  const [sensorsOn, setSensorsOn] = useState(false);

  const [corners, setCorners] = useState<CornerTap[]>([]);
  const [items, setItems] = useState<ItemTap[]>([]);
  const [height, setHeight] = useState(DEFAULT_CAMERA_HEIGHT_M);
  const [busy, setBusy] = useState(false);

  // live aim readout (throttled from refs to avoid render storms)
  const [aim, setAim] = useState<{ heading: number; pitch: number; dist: number; label: string | null }>({ heading: 0, pitch: 0, dist: 0, label: null });

  const headingRef = useRef(0);
  const pitchRef = useRef(0);
  const detsRef = useRef<Detection[]>([]);
  const centerLabelRef = useRef<{ label: string; boxWFrac: number } | null>(null);
  const heightRef = useRef(height);
  useEffect(() => { heightRef.current = height; }, [height]);

  // ---- sensors + camera --------------------------------------------------
  const orient = useCallback((e: DeviceOrientationEvent) => {
    const anyE = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
    const headingDeg = typeof anyE.webkitCompassHeading === "number"
      ? anyE.webkitCompassHeading
      : (e.alpha != null ? 360 - e.alpha : 0);
    headingRef.current = (headingDeg * Math.PI) / 180;
    // portrait: camera pitch below horizon ≈ 90° − beta
    const beta = e.beta ?? 90;
    pitchRef.current = ((90 - beta) * Math.PI) / 180;
  }, []);

  const begin = useCallback(async () => {
    setErr("");
    try {
      // 1) motion permission (iOS 13+ gate behind a user gesture)
      const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (DOE && typeof DOE.requestPermission === "function") {
        try { await DOE.requestPermission(); } catch { /* user may decline; plan still works, less accurate */ }
      }
      window.addEventListener("deviceorientation", orient, true);
      setSensorsOn(true);

      // 2) camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setPhase("scanning");

      // 3) detector (best-effort — scanning still works without it)
      loadScript(CDN_TF)
        .then(() => loadScript(CDN_COCO))
        .then(() => window.cocoSsd!.load())
        .then((model) => {
          setModelReady(true);
          let alive = true;
          const tick = async () => {
            if (!alive) return;
            const v = videoRef.current;
            if (v && v.readyState >= 2) {
              try { detsRef.current = await model.detect(v); } catch { /* skip frame */ }
            }
            if (alive) setTimeout(tick, 550);
          };
          tick();
          stopDetect.current = () => { alive = false; };
        })
        .catch(() => setModelReady(false));
    } catch (e) {
      setErr(t("Could not access the camera. Allow camera access and use HTTPS.", "تعذّر الوصول للكاميرا. اسمح بالوصول واستخدم HTTPS."));
      console.error(e);
    }
  }, [orient, t]);

  const stopDetect = useRef<() => void>(() => {});
  useEffect(() => {
    return () => {
      stopDetect.current?.();
      window.removeEventListener("deviceorientation", orient, true);
      const s = videoRef.current?.srcObject as MediaStream | null;
      s?.getTracks().forEach((tk) => tk.stop());
    };
  }, [orient]);

  // ---- draw loop: detection boxes + reticle + HUD + mini plan -------------
  useEffect(() => {
    if (phase !== "scanning") return;
    let raf = 0;
    const draw = () => {
      const v = videoRef.current, ov = overlayRef.current;
      if (v && ov && v.videoWidth) {
        const rect = v.getBoundingClientRect();
        if (ov.width !== rect.width) ov.width = rect.width;
        if (ov.height !== rect.height) ov.height = rect.height;
        const ctx = ov.getContext("2d")!;
        ctx.clearRect(0, 0, ov.width, ov.height);

        // cover-fit transform: intrinsic px → displayed px
        const scale = Math.max(ov.width / v.videoWidth, ov.height / v.videoHeight);
        const offX = (ov.width - v.videoWidth * scale) / 2;
        const offY = (ov.height - v.videoHeight * scale) / 2;
        const cx = ov.width / 2, cy = ov.height / 2;

        // detection boxes + identify the item under the reticle
        let centered: { label: string; boxWFrac: number } | null = null;
        for (const d of detsRef.current) {
          const label = COCO_TO_FURNITURE[d.class];
          const [bx, by, bw, bh] = d.bbox;
          const x = bx * scale + offX, y = by * scale + offY, w = bw * scale, h = bh * scale;
          const known = !!label;
          ctx.lineWidth = 2;
          ctx.strokeStyle = known ? "#b27457" : "rgba(255,255,255,0.5)";
          ctx.strokeRect(x, y, w, h);
          const name = (label || d.class).toUpperCase();
          ctx.font = "600 12px system-ui, sans-serif";
          const tw = ctx.measureText(name).width + 12;
          ctx.fillStyle = known ? "#b27457" : "rgba(0,0,0,0.55)";
          ctx.fillRect(x, y - 18, tw, 18);
          ctx.fillStyle = "#fff";
          ctx.fillText(name, x + 6, y - 5);
          if (label && cx >= x && cx <= x + w && cy >= y && cy <= y + h) {
            centered = { label, boxWFrac: bw / v.videoWidth };
          }
        }
        centerLabelRef.current = centered;

        // reticle
        ctx.strokeStyle = centered ? "#b27457" : "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 26, cy); ctx.lineTo(cx - 6, cy);
        ctx.moveTo(cx + 6, cy); ctx.lineTo(cx + 26, cy);
        ctx.moveTo(cx, cy - 26); ctx.lineTo(cx, cy - 6);
        ctx.moveTo(cx, cy + 6); ctx.lineTo(cx, cy + 26);
        ctx.stroke();
      }

      // HUD readout
      const g = aimToGround({ heading: headingRef.current, pitch: pitchRef.current }, heightRef.current);
      setAim((a) => {
        const lbl = centerLabelRef.current?.label ?? null;
        if (Math.abs(a.dist - g.d) < 0.03 && a.label === lbl) return a;
        return { heading: headingRef.current, pitch: pitchRef.current, dist: g.d, label: lbl };
      });

      drawPlan();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, corners, items]);

  // mini top-down plan (the "dollhouse")
  const drawPlan = useCallback(() => {
    const cv = planRef.current; if (!cv) return;
    const ctx = cv.getContext("2d")!; const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(20,18,14,0.72)"; ctx.fillRect(0, 0, W, H);
    const cpts = corners.map((c) => aimToGround(c, heightRef.current));
    const opts = items.map((it) => aimToGround(it, heightRef.current));
    const all = [...cpts, ...opts, { x: 0, z: 0 } as { x: number; z: number }];
    if (all.length < 2) return;
    const xs = all.map((p) => p.x), zs = all.map((p) => p.z);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
    const span = Math.max(maxX - minX, maxZ - minZ, 1);
    const pad = 14;
    const sc = (W - pad * 2) / span;
    const PX = (p: { x: number; z: number }) => ({ x: pad + (p.x - minX) * sc, y: pad + (p.z - minZ) * sc });

    // walls
    ctx.strokeStyle = "#e7ded0"; ctx.lineWidth = 2; ctx.lineJoin = "round";
    if (cpts.length >= 2) {
      ctx.beginPath();
      cpts.forEach((p, i) => { const q = PX(p); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); });
      if (cpts.length >= 3) ctx.closePath();
      ctx.stroke();
    }
    // corner dots
    ctx.fillStyle = "#fff";
    cpts.forEach((p) => { const q = PX(p); ctx.beginPath(); ctx.arc(q.x, q.y, 3, 0, Math.PI * 2); ctx.fill(); });
    // items
    ctx.fillStyle = "#b27457";
    opts.forEach((p) => { const q = PX(p); ctx.fillRect(q.x - 4, q.y - 4, 8, 8); });
    // operator
    const me = PX({ x: 0, z: 0 });
    ctx.fillStyle = "#7fd1a8"; ctx.beginPath(); ctx.arc(me.x, me.y, 4, 0, Math.PI * 2); ctx.fill();
  }, [corners, items]);

  // ---- capture actions ---------------------------------------------------
  const markCorner = () => setCorners((c) => [...c, { heading: headingRef.current, pitch: pitchRef.current }]);
  const markItem = () => {
    const cur = centerLabelRef.current; if (!cur) return;
    setItems((it) => [...it, { heading: headingRef.current, pitch: pitchRef.current, label: cur.label, boxWFrac: cur.boxWFrac }]);
  };
  const undo = () => {
    if (items.length) setItems((it) => it.slice(0, -1));
    else setCorners((c) => c.slice(0, -1));
  };

  async function finish() {
    setBusy(true);
    try {
      const scan = buildScanFile(corners, items, height);
      await onComplete(scan);
    } catch {
      setErr(t("Capture at least 2 corners or one item first.", "التقط زاويتين على الأقل أو عنصراً واحداً."));
      setBusy(false);
    }
  }

  const area = polygonAreaM2(corners, height);

  // ---- UI ----------------------------------------------------------------
  const pill: React.CSSProperties = { padding: "0.3rem 0.7rem", borderRadius: 999, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: "0.72rem", fontWeight: 600, backdropFilter: "blur(6px)" };

  return (
    <div dir={dir} style={{ position: "fixed", inset: 0, zIndex: 400, background: "#000", overflow: "hidden" }}>
      <video ref={videoRef} playsInline muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", background: "#111" }} />
      <canvas ref={overlayRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />

      {/* top bar */}
      <div style={{ position: "absolute", top: "max(0.8rem, env(safe-area-inset-top))", left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0.9rem", gap: "0.5rem" }}>
        <span style={pill}>{t("Live room scan", "مسح الغرفة")}</span>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <span style={pill}>⌗ {corners.length} {t("corners", "زوايا")}</span>
          <span style={pill}>▢ {items.length} {t("items", "عناصر")}</span>
          {area > 0 && <span style={pill}>{area.toFixed(1)} m²</span>}
          <button onClick={() => { stopDetect.current?.(); onClose(); }} aria-label="Close"
            style={{ width: 36, height: 36, borderRadius: 999, border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "1rem", cursor: "pointer" }}>✕</button>
        </div>
      </div>

      {/* mini plan */}
      {phase === "scanning" && (
        <canvas ref={planRef} width={150} height={150}
          style={{ position: "absolute", top: "calc(max(0.8rem, env(safe-area-inset-top)) + 3rem)", insetInlineEnd: "0.9rem", width: 130, height: 130, borderRadius: 14, border: "1px solid rgba(255,255,255,0.18)" }} />
      )}

      {/* intro / permission gate */}
      {phase === "intro" && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: "1.5rem", background: "rgba(10,9,7,0.82)", backdropFilter: "blur(4px)" }}>
          <div style={{ maxWidth: 380, textAlign: "center", color: "#fff" }}>
            <h2 className="display" style={{ fontSize: "1.7rem", margin: "0 0 0.6rem" }}>{t("Scan the room", "امسح الغرفة")}</h2>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1rem" }}>
              {t("Stand near the middle of the room. Aim the centre dot at each floor corner and tap “Corner”. Point at furniture and tap “Add item”. Tap Finish to build the plan.",
                 "قف في منتصف الغرفة تقريباً. وجّه النقطة المركزية إلى كل زاوية أرضية واضغط «زاوية». وجّه نحو الأثاث واضغط «إضافة عنصر». اضغط «إنهاء» لبناء المخطط.")}
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.74rem", lineHeight: 1.5, margin: "0 0 1.3rem" }}>
              {t("Uses the camera + motion sensors. Measurements are estimated and editable afterwards.",
                 "يستخدم الكاميرا وحساسات الحركة. القياسات تقديرية وقابلة للتعديل لاحقاً.")}
            </p>
            {err && <p style={{ color: "#ff9d8a", fontSize: "0.82rem", marginBottom: "0.8rem" }}>{err}</p>}
            <button onClick={begin}
              style={{ padding: "0.85rem 2rem", borderRadius: 999, border: "none", background: "#b27457", color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
              {t("Enable camera & start", "تفعيل الكاميرا والبدء")}
            </button>
          </div>
        </div>
      )}

      {/* aim readout */}
      {phase === "scanning" && (
        <div style={{ position: "absolute", insetInlineStart: "50%", transform: "translateX(-50%)", bottom: "calc(env(safe-area-inset-bottom) + 9.5rem)", ...pill, padding: "0.35rem 0.9rem" }}>
          {aim.label ? `▢ ${aim.label} · ` : ""}{t("aim", "المسافة")} ≈ {aim.dist > 0 && aim.dist < 30 ? aim.dist.toFixed(1) + " m" : "—"}
          {!modelReady && " · " + t("loading AI…", "تحميل…")}
        </div>
      )}

      {/* bottom controls */}
      {phase === "scanning" && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "1rem 0.9rem calc(env(safe-area-inset-bottom) + 1rem)", background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem", color: "#fff" }}>
            <span style={{ fontSize: "0.7rem", opacity: 0.8, whiteSpace: "nowrap" }}>{t("Phone height", "ارتفاع الهاتف")}</span>
            <input type="range" min={1.0} max={1.8} step={0.05} value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} style={{ flex: 1, accentColor: "#b27457" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, width: 48, textAlign: "end" }}>{height.toFixed(2)}m</span>
          </div>
          <div style={{ display: "flex", gap: "0.55rem", alignItems: "stretch" }}>
            <button onClick={undo} disabled={!corners.length && !items.length}
              style={{ padding: "0.9rem 0.9rem", borderRadius: 14, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.4)", color: "#fff", fontSize: "0.8rem", cursor: "pointer", opacity: (!corners.length && !items.length) ? 0.4 : 1 }}>↶</button>
            <button onClick={markItem} disabled={!aim.label}
              style={{ flex: 1, padding: "0.9rem", borderRadius: 14, border: "none", background: aim.label ? "rgba(178,116,87,0.95)" : "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: aim.label ? "pointer" : "default" }}>
              ＋ {aim.label ? t(`Add ${aim.label}`, `إضافة ${aim.label}`) : t("Add item", "إضافة عنصر")}
            </button>
            <button onClick={markCorner}
              style={{ flex: 1, padding: "0.9rem", borderRadius: 14, border: "none", background: "#fff", color: "#16150f", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer" }}>
              ⌗ {t("Corner", "زاوية")}
            </button>
            <button onClick={finish} disabled={busy || (corners.length < 2 && !items.length)}
              style={{ padding: "0.9rem 1.1rem", borderRadius: 14, border: "none", background: "#7a3", backgroundColor: "#3f8f5b", color: "#fff", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", opacity: (busy || (corners.length < 2 && !items.length)) ? 0.5 : 1 }}>
              {busy ? "…" : t("Finish", "إنهاء")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
