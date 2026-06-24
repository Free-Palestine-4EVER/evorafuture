"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { PAGE_COUNT, PDF_HREF, pageSrc } from "./data";
import BookMode from "./BookMode";
import ReelMode from "./ReelMode";
import GalleryMode from "./GalleryMode";
import StripMode from "./StripMode";
import MosaicMode from "./MosaicMode";
import StackMode from "./StackMode";
import SpotlightMode from "./SpotlightMode";
import TiltMode from "./TiltMode";
import CylinderMode from "./CylinderMode";
import CubeMode from "./CubeMode";

type Mode = "book" | "reel" | "gallery" | "strip" | "mosaic" | "stack" | "spotlight" | "tilt" | "cylinder" | "cube";
const MODE_IDS: Mode[] = ["book", "reel", "gallery", "strip", "mosaic", "stack", "spotlight", "tilt", "cylinder", "cube"];

const MODES: { id: Mode; en: string; ar: string; icon: React.ReactNode }[] = [
  { id: "book", en: "Book", ar: "كتاب", icon: <BookIcon /> },
  { id: "reel", en: "Reel", ar: "شريط", icon: <ReelIcon /> },
  { id: "gallery", en: "Gallery", ar: "معرض", icon: <GalleryIcon /> },
  { id: "strip", en: "Strip", ar: "صفّ", icon: <StripIcon /> },
  { id: "mosaic", en: "Mosaic", ar: "فسيفساء", icon: <MosaicIcon /> },
  { id: "stack", en: "Stack", ar: "رزمة", icon: <StackIcon /> },
  { id: "spotlight", en: "Spotlight", ar: "عرض", icon: <SpotlightIcon /> },
  { id: "tilt", en: "Tilt", ar: "إمالة", icon: <TiltIcon /> },
  { id: "cylinder", en: "Carousel", ar: "دوّار", icon: <CylinderIcon /> },
  { id: "cube", en: "Cube", ar: "مكعّب", icon: <CubeIcon /> },
];

const MODE_HINTS: Record<Mode, [string, string]> = {
  book: ["Drag or tap to turn the page", "اسحب أو انقر لتقليب الصفحة"],
  reel: ["Scroll to explore", "مرّر للاستكشاف"],
  gallery: ["Drag, scroll or tap a plate", "اسحب أو مرّر أو انقر لوحة"],
  strip: ["Scroll sideways", "مرّر جانبيًا"],
  mosaic: ["Tap any plate to open", "انقر أي لوحة لفتحها"],
  stack: ["Flick the top card", "اسحب البطاقة العلوية"],
  spotlight: ["Click the sides or scrub", "انقر الجوانب أو اسحب الشريط"],
  tilt: ["Move your pointer · swipe to change", "حرّك المؤشّر · اسحب للتغيير"],
  cylinder: ["Spin the drum", "أدِر الأسطوانة"],
  cube: ["Rotate the cube", "أدِر المكعّب"],
};

export default function LookbookApp() {
  const { lang, dir } = useT();
  const en = lang === "en";
  const [mode, setMode] = useState<Mode>("book");
  const [page, setPage] = useState(0);
  const [fs, setFs] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLDivElement>(null);

  const go = useCallback((n: number) => setPage(Math.max(0, Math.min(PAGE_COUNT - 1, n))), []);

  // deep-link the view (?view=book|reel|gallery)
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("view") as Mode | null;
    if (v && MODE_IDS.includes(v)) setMode(v);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const on = () => setNarrow(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // keep the active mode chip in view
  useEffect(() => {
    const i = MODE_IDS.indexOf(mode);
    (switchRef.current?.children[i] as HTMLElement | undefined)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [mode]);

  // keep the active thumbnail in view
  useEffect(() => {
    const strip = filmRef.current;
    const thumb = strip?.children[page] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [page]);

  // fullscreen
  const toggleFs = () => {
    const el = rootRef.current;
    if (!document.fullscreenElement) el?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  useEffect(() => {
    const on = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  return (
    <div className={`lb ${fs ? "is-fs" : ""}`} ref={rootRef} lang={lang} dir={dir}>
      <LookbookStyles />

      <header className="lb-bar">
        <div className="lb-brand">
          <span className="lb-brand__name">EVORA</span>
          <span className="lb-brand__sep" />
          <span className="lb-brand__sub">{en ? "ARGOS Lookbook" : "كتالوج أرغوس"}</span>
        </div>

        <div className="lb-switch" role="tablist" aria-label={en ? "View mode" : "نمط العرض"} ref={switchRef}>
          {MODES.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              className={`lb-switch__btn ${mode === m.id ? "is-on" : ""}`}
              onClick={() => setMode(m.id)}
            >
              {m.icon}<span>{en ? m.en : m.ar}</span>
            </button>
          ))}
        </div>

        <div className="lb-tools">
          <span className="lb-counter">{String(page + 1).padStart(2, "0")}<i>/{PAGE_COUNT}</i></span>
          <button className="lb-icon" onClick={toggleFs} aria-label={en ? "Fullscreen" : "ملء الشاشة"} title={en ? "Fullscreen" : "ملء الشاشة"}>
            {fs ? <FsExitIcon /> : <FsIcon />}
          </button>
          <a className="lb-dl" href={PDF_HREF} download="Evora-ARGOS-Lookbook.pdf">
            <DlIcon /><span>{en ? "Download" : "تنزيل"}</span>
          </a>
        </div>
      </header>

      <main className="lb-stage" data-mode={mode}>
        {mode === "book" && <BookMode page={page} setPage={go} lang={lang} dir={dir} mono={narrow} />}
        {mode === "reel" && <ReelMode page={page} setPage={go} lang={lang} dir={dir} />}
        {mode === "gallery" && <GalleryMode page={page} setPage={go} lang={lang} dir={dir} />}
        {mode === "strip" && <StripMode page={page} setPage={go} lang={lang} dir={dir} />}
        {mode === "mosaic" && <MosaicMode page={page} setPage={go} lang={lang} dir={dir} />}
        {mode === "stack" && <StackMode page={page} setPage={go} lang={lang} dir={dir} />}
        {mode === "spotlight" && <SpotlightMode page={page} setPage={go} lang={lang} dir={dir} />}
        {mode === "tilt" && <TiltMode page={page} setPage={go} lang={lang} dir={dir} />}
        {mode === "cylinder" && <CylinderMode page={page} setPage={go} lang={lang} dir={dir} />}
        {mode === "cube" && <CubeMode page={page} setPage={go} lang={lang} dir={dir} />}
        <span className="lb-modehint">{MODE_HINTS[mode][en ? 0 : 1]}</span>
      </main>

      <div className="lb-film" ref={filmRef} aria-label={en ? "All pages" : "كل الصفحات"}>
        {Array.from({ length: PAGE_COUNT }).map((_, i) => (
          <button
            key={i}
            className={`lb-thumb ${i === page ? "is-on" : ""}`}
            onClick={() => go(i)}
            aria-label={en ? `Go to page ${i + 1}` : `اذهب إلى صفحة ${i + 1}`}
          >
            <img src={pageSrc(i)} alt="" loading="lazy" draggable={false} />
            <i>{i + 1}</i>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- icons ---------- */
function BookIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5c-1.5-1-4-1.5-6.5-1.2C4.6 3.9 4 4.6 4 5.4v11.8c0 .9.8 1.6 1.7 1.5C8 18.5 10.6 19 12 20m0-15c1.5-1 4-1.5 6.5-1.2.9.1 1.5.8 1.5 1.6v11.8c0 .9-.8 1.6-1.7 1.5C16 18.5 13.4 19 12 20m0-15v15"/></svg>; }
function ReelIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16M16 4v16"/></svg>; }
function GalleryIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="8" y="5" width="8" height="14" rx="1.5"/><path d="M5 7.5v9M2.5 10v4M19 7.5v9M21.5 10v4"/></svg>; }
function FsIcon() { return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4"/></svg>; }
function FsExitIcon() { return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 4v3a2 2 0 0 1-2 2H4M15 4v3a2 2 0 0 0 2 2h3M9 20v-3a2 2 0 0 0-2-2H4M15 20v-3a2 2 0 0 1 2-2h3"/></svg>; }
function DlIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"/></svg>; }
function StripIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2.5" y="7" width="6" height="10" rx="1"/><rect x="9.5" y="5" width="5" height="14" rx="1"/><rect x="15.5" y="7" width="6" height="10" rx="1"/></svg>; }
function MosaicIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>; }
function StackIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="6" y="6" width="12" height="14" rx="2"/><path d="M9 4h8a2 2 0 0 1 2 2v9"/></svg>; }
function SpotlightIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></svg>; }
function TiltIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 8l14-3v11L5 19z"/></svg>; }
function CylinderIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12a8 3 0 0 0 16 0V6"/></svg>; }
function CubeIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 3v18M4 7.5l8 4.5 8-4.5"/></svg>; }

/* =====================  STYLES  ===================== */
function LookbookStyles() {
  return (
    <style>{`
    .lb { --bar: 60px; --film: 92px; --stageH: min(72svh, 760px);
      position: relative; min-height: 100svh; overflow-x: clip; color: var(--paper);
      background:
        radial-gradient(120% 80% at 50% -10%, rgba(197,160,106,0.12), transparent 55%),
        linear-gradient(180deg, #131210, #1b1916 55%, #100f0c);
      display: flex; flex-direction: column; padding-top: clamp(4.6rem, 8vw, 6.2rem); }
    .lb.is-fs { padding-top: 0; }

    /* ---- app bar ---- */
    .lb-bar { position: sticky; top: 0; z-index: 30; height: var(--bar);
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
      gap: 0.5rem; padding: 0 clamp(0.9rem, 3vw, 2rem);
      background: rgba(16,15,12,0.66); backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(251,247,240,0.08); }
    .lb-brand { display:flex; align-items:center; gap:0.6rem; min-width:0; }
    .lb-brand__name { font-family: var(--f-display); letter-spacing:0.22em; text-indent:0.22em; font-size:0.96rem; }
    .lb-brand__sep { width:1px; height:14px; background: rgba(197,160,106,0.5); }
    .lb-brand__sub { font-size:0.64rem; letter-spacing:0.22em; text-transform:uppercase; color: var(--brass-2); white-space:nowrap; }
    html[dir="rtl"] .lb-brand__sub { letter-spacing:0.06em; }

    .lb-switch { display:flex; gap:3px; padding:4px; border-radius:100px; justify-self:center;
      max-width: min(64vw, 760px); overflow-x:auto; scrollbar-width:none; flex-wrap:nowrap;
      background: rgba(251,247,240,0.06); border:1px solid rgba(251,247,240,0.1); }
    .lb-switch::-webkit-scrollbar { display:none; }
    .lb-switch__btn { flex:0 0 auto; display:flex; align-items:center; gap:0.4rem; cursor:pointer;
      padding:0.42em 0.9em; border-radius:100px; font-size:0.74rem; letter-spacing:0.04em;
      color: rgba(251,247,240,0.66); background: transparent; transition: color .25s, background .25s; }
    .lb-switch__btn svg { opacity:0.85; }
    .lb-switch__btn:hover { color: var(--paper); }
    .lb-switch__btn.is-on { background: var(--brass-2); color:#191712; font-weight:600; }
    .lb-switch__btn.is-on svg { opacity:1; }

    .lb-tools { display:flex; align-items:center; gap:0.6rem; justify-self:end; }
    .lb-counter { font-size:0.82rem; letter-spacing:0.08em; font-variant-numeric: tabular-nums; }
    .lb-counter i { color: rgba(251,247,240,0.5); font-style:normal; }
    .lb-icon { width:34px; height:34px; display:grid; place-items:center; border-radius:50%; cursor:pointer;
      color: var(--paper); background: rgba(251,247,240,0.07); border:1px solid rgba(251,247,240,0.14); transition: background .25s; }
    .lb-icon:hover { background: rgba(251,247,240,0.16); }
    .lb-dl { display:flex; align-items:center; gap:0.4rem; padding:0.5em 0.9em; border-radius:100px;
      font-size:0.76rem; letter-spacing:0.04em; background: var(--paper); color:#191712; font-weight:600; transition: background .25s; }
    .lb-dl:hover { background: var(--brass-2); }

    /* ---- stage ---- */
    .lb-stage { position: relative; height: var(--stageH); margin-top: clamp(0.6rem,2vw,1.4rem);
      display: flex; align-items: center; justify-content: center; }
    .lb.is-fs .lb-stage { height: calc(100svh - var(--bar) - var(--film)); }
    .lb-modehint { position:absolute; bottom: 0.3rem; left:50%; transform:translateX(-50%);
      font-size:0.64rem; letter-spacing:0.2em; text-transform:uppercase; color: rgba(251,247,240,0.36); pointer-events:none; }

    /* ===== v1 BOOK ===== */
    .lbk { width:100%; height:100%; display:flex; align-items:center; justify-content:center; gap: clamp(0.4rem,2vw,1.6rem); }
    .lbk-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; background:#fff; -webkit-user-drag:none; user-select:none; }
    .lbk-blank { position:absolute; inset:0; background: var(--paper-2); }
    .lbk-book { position: relative; width: min(82vw, 1080px, calc((var(--stageH) - 2rem) * 2)); aspect-ratio: 2 / 1;
      perspective: 3000px; transform-style: preserve-3d; cursor: grab; touch-action: pan-y;
      transition: transform .9s cubic-bezier(.22,1,.36,1); }
    .lbk-book.is-dragging { cursor: grabbing; }
    .lbk-book.is-closed { transform: translateX(-25%); }
    .lbk-book.is-end { transform: translateX(25%); }
    html[dir="rtl"] .lbk-book.is-closed { transform: translateX(25%); }
    html[dir="rtl"] .lbk-book.is-end { transform: translateX(-25%); }
    /* mono (mobile): one larger, rounded square page per leaf */
    .lbk-book.is-mono { width: min(86vmin, calc(var(--stageH) - 1rem)); aspect-ratio: 1 / 1; }
    .lbk-book.is-mono .lbk-leaf { left:0; width:100%; transform-origin:left center; }
    html[dir="rtl"] .lbk-book.is-mono .lbk-leaf { left:auto; right:0; transform-origin:right center; }
    .lbk-book.is-mono .lbk-face { border-radius:12px; box-shadow: 0 26px 56px -34px rgba(0,0,0,.7); }
    .lbk-spine { position:absolute; top:0; bottom:0; left:50%; width:46px; transform:translateX(-23px);
      background: linear-gradient(90deg, transparent, rgba(0,0,0,.07) 44%, rgba(0,0,0,.11) 50%, rgba(0,0,0,.07) 56%, transparent);
      z-index:9999; pointer-events:none; }
    .lbk-floor { position:absolute; left:11%; right:11%; bottom:-5%; height:9%; z-index:0; pointer-events:none;
      background: radial-gradient(50% 100% at 50% 0%, rgba(0,0,0,.42), transparent 70%); filter: blur(24px); }
    .lbk-leaf { position:absolute; top:0; left:50%; width:50%; height:100%; transform-origin:left center;
      transform-style:preserve-3d; transition: transform .95s cubic-bezier(.62,.04,.3,1); }
    html[dir="rtl"] .lbk-leaf { left:auto; right:50%; transform-origin:right center; }
    .lbk-leaf.is-flipped { transform: rotateY(-180deg); }
    html[dir="rtl"] .lbk-leaf.is-flipped { transform: rotateY(180deg); }
    .lbk-leaf.is-live { transition:none; will-change:transform; }
    .lbk-face { position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
      overflow:hidden; background: var(--paper); box-shadow: 0 24px 50px -38px rgba(0,0,0,.6); }
    .lbk-face--back { transform: rotateY(180deg); }
    .lbk-sheet { position:absolute; inset:0; }
    .lbk-shade { position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity .9s ease; z-index:5; }
    .lbk-shade--front { background: linear-gradient(90deg, rgba(0,0,0,.12), transparent 11%); }
    html[dir="rtl"] .lbk-shade--front { background: linear-gradient(270deg, rgba(0,0,0,.12), transparent 11%); }
    .lbk-shade--back { background: linear-gradient(270deg, rgba(0,0,0,.1), transparent 11%); }
    html[dir="rtl"] .lbk-shade--back { background: linear-gradient(90deg, rgba(0,0,0,.1), transparent 11%); }
    .lbk-leaf:not(.is-flipped) .lbk-shade--front { opacity:1; }
    .lbk-leaf.is-live .lbk-shade { transition:none; }
    .lbk-leaf.is-live .lbk-shade--front { opacity: calc(0.12 + 0.45 * var(--cp,0)); }
    .lbk-leaf.is-live .lbk-shade--back { opacity: calc(0.4 * var(--cp,0)); }
    .lbk-nav { flex:none; width:44px; height:44px; border-radius:50%; cursor:pointer; font-size:1.35rem; line-height:1;
      display:grid; place-items:center; color:rgba(251,247,240,0.78); background:transparent;
      border:1px solid rgba(251,247,240,0.16); transition: background .3s, transform .3s, opacity .3s, border-color .3s, color .3s; }
    .lbk-nav:hover:not(:disabled) { background:rgba(251,247,240,0.1); border-color:rgba(251,247,240,0.36); color:var(--paper); transform:scale(1.06); }
    .lbk-nav:disabled { opacity:0.18; cursor:default; }
    html[dir="rtl"] .lbk-nav { transform: scaleX(-1); }
    html[dir="rtl"] .lbk-nav:hover:not(:disabled) { transform: scaleX(-1) scale(1.08); }

    /* ===== v2 REEL ===== */
    .lbr { width:100%; height:100%; overflow-y:auto; scroll-snap-type:y mandatory; scrollbar-width:none; }
    .lbr::-webkit-scrollbar { display:none; }
    .lbr-panel { position:relative; height:100%; scroll-snap-align:center; display:flex; align-items:center; justify-content:center; }
    .lbr-index { position:absolute; top:50%; left:clamp(1rem,5vw,4rem); transform:translateY(-50%);
      font-family:var(--f-display); font-size:clamp(7rem,22vw,18rem); line-height:0.8; color: rgba(197,160,106,0.1);
      pointer-events:none; user-select:none; z-index:0; }
    html[dir="rtl"] .lbr-index { left:auto; right:clamp(1rem,5vw,4rem); }
    .lbr-figure { position:relative; z-index:1; width:min(80vw, 64svh); height:auto; aspect-ratio:1/1;
      border-radius:6px; overflow:hidden; box-shadow: 0 50px 90px -50px rgba(0,0,0,.9), 0 0 0 1px rgba(251,247,240,0.05);
      animation: lbrFloat 8s ease-in-out infinite; }
    .lbr-img { width:100%; height:100%; object-fit:cover; transform:scale(1.04); animation: lbrKen 14s ease-in-out infinite alternate; -webkit-user-drag:none; }
    .lbr-meta { position:absolute; z-index:1; bottom:clamp(1.2rem,5vw,3rem); right:clamp(1.2rem,6vw,5rem); text-align:right; display:flex; flex-direction:column; gap:0.3rem; }
    html[dir="rtl"] .lbr-meta { right:auto; left:clamp(1.2rem,6vw,5rem); text-align:left; }
    .lbr-chapter { font-family:var(--f-display); font-size:clamp(1.1rem,2.4vw,1.9rem); }
    .lbr-count { font-size:0.66rem; letter-spacing:0.24em; text-transform:uppercase; color:var(--brass-2); }
    .lbr-end { height:40%; display:flex; align-items:center; justify-content:center; scroll-snap-align:center;
      font-size:0.7rem; letter-spacing:0.3em; text-transform:uppercase; color:rgba(251,247,240,0.4); }
    @keyframes lbrFloat { 0%,100%{ transform: translateY(-6px) } 50%{ transform: translateY(6px) } }
    @keyframes lbrKen { from{ transform:scale(1.04) } to{ transform:scale(1.12) } }

    /* ===== v3 GALLERY (coverflow) ===== */
    .lbg { width:100%; height:100%; position:relative; perspective:1800px; overflow:hidden;
      cursor:grab; touch-action:pan-y; }
    .lbg.is-dragging { cursor:grabbing; }
    .lbg-stage { position:absolute; inset:0; transform-style:preserve-3d; display:flex; align-items:center; justify-content:center; }
    .lbg-card { position:absolute; padding:0; border:none; background:transparent; cursor:pointer;
      transform-style:preserve-3d; transition: transform .5s cubic-bezier(.22,1,.36,1), opacity .5s ease; }
    .lbg-card.no-anim { transition:none; }
    .lbg-img { width:100%; height:100%; object-fit:cover; border-radius:6px; background:#fff; display:block;
      box-shadow: 0 40px 70px -40px rgba(0,0,0,.9); -webkit-user-drag:none; }
    .lbg-card.is-active .lbg-img { box-shadow: 0 50px 90px -42px rgba(0,0,0,.95), 0 0 0 1px rgba(197,160,106,0.3); }
    .lbg-reflect { position:absolute; top:100%; left:0; width:100%; height:60%; object-fit:cover; object-position:bottom;
      transform: scaleY(-1); opacity:0.18; -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 75%);
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 75%); border-radius:6px; pointer-events:none; }
    .lbg-caption { position:absolute; left:0; right:0; bottom: clamp(0.6rem,3vw,1.6rem); z-index:50;
      display:flex; flex-direction:column; align-items:center; gap:0.2rem; pointer-events:none; }
    .lbg-chapter { font-family:var(--f-display); font-size:clamp(1.1rem,2.4vw,1.8rem); }
    .lbg-count { font-size:0.66rem; letter-spacing:0.24em; color:var(--brass-2); font-variant-numeric:tabular-nums; }

    /* ---- filmstrip ---- */
    .lb-film { height: var(--film); display:flex; gap:8px; align-items:center; overflow-x:auto; scrollbar-width:none;
      padding: 0.7rem clamp(0.9rem,4vw,2.5rem); border-top:1px solid rgba(251,247,240,0.08);
      background: rgba(16,15,12,0.5); scroll-snap-type:x proximity; }
    .lb-film::-webkit-scrollbar { display:none; }
    .lb-thumb { position:relative; flex:0 0 auto; width:62px; height:62px; border-radius:4px; overflow:hidden; cursor:pointer;
      border:1px solid rgba(251,247,240,0.12); opacity:0.5; transition: opacity .25s, transform .25s, border-color .25s; scroll-snap-align:center; padding:0; background:#fff; }
    .lb-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
    .lb-thumb i { position:absolute; bottom:2px; right:3px; font-style:normal; font-size:0.58rem; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,.8); }
    .lb-thumb:hover { opacity:0.85; }
    .lb-thumb.is-on { opacity:1; border-color: var(--brass-2); transform: translateY(-2px); box-shadow:0 8px 18px -10px rgba(0,0,0,.8); }

    @keyframes lbFade { from { opacity:0 } to { opacity:1 } }

    /* ===== v4 STRIP ===== */
    .lbst { width:100%; height:100%; display:flex; align-items:center; }
    .lbst-track { display:flex; align-items:center; gap: clamp(1rem,4vw,3rem); width:100%; height:100%;
      overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none;
      padding-inline: calc(50% - min(60vh, 72vw) / 2); }
    .lbst-track::-webkit-scrollbar { display:none; }
    .lbst-cell { flex:0 0 auto; scroll-snap-align:center; display:flex; flex-direction:column; align-items:center; gap:0.9rem;
      opacity:0.4; transform:scale(0.82); transition: opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1); }
    .lbst-cell.is-on { opacity:1; transform:scale(1); }
    .lbst-card { width:min(60vh, 72vw); aspect-ratio:1/1; border-radius:6px; overflow:hidden; background:#fff;
      box-shadow:0 40px 70px -38px rgba(0,0,0,.85); }
    .lbst-card img { width:100%; height:100%; object-fit:cover; -webkit-user-drag:none; }
    .lbst-cap { font-size:0.66rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--brass-2); }

    /* ===== v5 MOSAIC ===== */
    .lbmo { width:100%; height:100%; overflow-y:auto; scrollbar-width:none; padding: 0.6rem clamp(0.5rem,3vw,2rem) 1.4rem; }
    .lbmo::-webkit-scrollbar { display:none; }
    .lbmo-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(132px,1fr)); gap:10px; }
    .lbmo-tile { position:relative; aspect-ratio:1/1; border-radius:5px; overflow:hidden; cursor:pointer; padding:0;
      border:1px solid rgba(251,247,240,0.1); background:#fff; opacity:0.9;
      transition: transform .35s cubic-bezier(.22,1,.36,1), opacity .35s, box-shadow .35s; }
    .lbmo-tile img { width:100%; height:100%; object-fit:cover; }
    .lbmo-tile:hover { transform: translateY(-4px) scale(1.03); opacity:1; box-shadow:0 22px 44px -22px rgba(0,0,0,.85); z-index:2; }
    .lbmo-tile.is-on { outline:2px solid var(--brass-2); outline-offset:-2px; opacity:1; }
    .lbmo-no { position:absolute; bottom:4px; inset-inline-end:6px; font-size:0.6rem; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,.8); }
    .lbmo-light { position:fixed; inset:0; z-index:60; background:rgba(10,9,7,0.93); backdrop-filter:blur(10px);
      display:flex; align-items:center; justify-content:center; gap:clamp(0.4rem,2vw,1.4rem); animation:lbFade .3s ease; }
    .lbmo-figure { position:relative; }
    .lbmo-figure img { width:min(82vw,78vh); height:auto; aspect-ratio:1/1; object-fit:cover; border-radius:6px;
      box-shadow:0 50px 100px -40px rgba(0,0,0,.95); animation: lbspIn .4s cubic-bezier(.22,1,.36,1); }
    .lbmo-figure figcaption { text-align:center; margin-top:0.9rem; font-size:0.72rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--brass-2); }
    .lbmo-x { position:absolute; top:1rem; inset-inline-end:1rem; width:40px; height:40px; border-radius:50%; cursor:pointer; z-index:2;
      color:var(--paper); background:rgba(251,247,240,0.1); border:1px solid rgba(251,247,240,0.2); font-size:1rem; }
    .lbmo-x:hover { background:rgba(251,247,240,0.2); }
    .lbmo-arrow { flex:none; width:48px; height:48px; border-radius:50%; cursor:pointer; font-size:1.5rem; color:var(--paper);
      background:rgba(251,247,240,0.08); border:1px solid rgba(251,247,240,0.22); display:grid; place-items:center; transition:background .3s; }
    .lbmo-arrow:hover:not(:disabled) { background:var(--brass-2); color:#191712; }
    .lbmo-arrow:disabled { opacity:0.25; cursor:default; }
    html[dir="rtl"] .lbmo-arrow { transform:scaleX(-1); }

    /* ===== v6 STACK ===== */
    .lbsk { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.4rem; }
    .lbsk-deck { position:relative; width:min(58vh, 80vw); aspect-ratio:1/1; }
    .lbsk-card { position:absolute; inset:0; border-radius:9px; overflow:hidden; background:#fff;
      box-shadow:0 40px 70px -34px rgba(0,0,0,.85); }
    .lbsk-card img { width:100%; height:100%; object-fit:cover; -webkit-user-drag:none; pointer-events:none; }
    .lbsk-card.is-top { cursor:grab; touch-action:none; }
    .lbsk-card.is-top:active { cursor:grabbing; }
    .lbsk-cap { position:absolute; left:0; right:0; bottom:0; padding:0.9rem; text-align:center; font-size:0.66rem;
      letter-spacing:0.18em; text-transform:uppercase; color:#fff; background:linear-gradient(transparent, rgba(0,0,0,.55)); }
    .lbsk-hint { font-size:0.64rem; letter-spacing:0.2em; text-transform:uppercase; color:rgba(251,247,240,0.4); }

    /* ===== v7 SPOTLIGHT ===== */
    .lbsp { position:relative; width:100%; height:100%; overflow:hidden; display:flex; align-items:center; justify-content:center; }
    .lbsp-bloom { position:absolute; inset:-12%; width:124%; height:124%; object-fit:cover; filter:blur(60px) saturate(1.25);
      opacity:0.45; z-index:0; animation:lbFade .8s ease; }
    .lbsp-vignette { position:absolute; inset:0; z-index:1; pointer-events:none;
      background: radial-gradient(58% 60% at 50% 46%, transparent, rgba(8,7,5,0.82)); }
    .lbsp-figure { position:relative; z-index:2; width:min(64vh, 86vw); aspect-ratio:1/1; border-radius:6px; overflow:hidden;
      box-shadow:0 50px 100px -40px rgba(0,0,0,.95); }
    .lbsp-img { width:100%; height:100%; object-fit:cover; animation: lbspIn .7s cubic-bezier(.22,1,.36,1); }
    @keyframes lbspIn { from { opacity:0; transform:scale(1.06) } to { opacity:1; transform:scale(1) } }
    .lbsp-zone { position:absolute; top:0; bottom:0; width:34%; z-index:3; background:transparent; border:none; cursor:pointer; }
    .lbsp-zone--l { inset-inline-start:0; } .lbsp-zone--r { inset-inline-end:0; }
    .lbsp-hud { position:absolute; z-index:4; left:0; right:0; bottom:clamp(0.6rem,3vw,1.6rem);
      display:flex; align-items:center; gap:clamp(0.6rem,2vw,1.2rem); padding:0 clamp(1rem,5vw,3rem); }
    .lbsp-chapter { font-family:var(--f-display); font-size:clamp(0.95rem,2vw,1.4rem); white-space:nowrap; }
    .lbsp-seek { position:relative; flex:1; height:3px; background:rgba(251,247,240,0.2); border-radius:3px; cursor:pointer; }
    .lbsp-seek__fill { position:absolute; inset-inline-start:0; top:0; height:100%; background:var(--brass-2); border-radius:3px; }
    .lbsp-seek__knob { position:absolute; top:50%; width:11px; height:11px; border-radius:50%; background:var(--paper); transform:translate(-50%,-50%); }
    .lbsp-count { font-size:0.74rem; color:rgba(251,247,240,0.7); font-variant-numeric:tabular-nums; white-space:nowrap; }

    /* ===== v8 TILT ===== */
    .lbt { width:100%; height:100%; display:flex; align-items:center; justify-content:center; gap:clamp(0.4rem,2vw,1.4rem); perspective:1100px; }
    .lbt-card { position:relative; width:min(62vh, 84vw); aspect-ratio:1/1; border-radius:9px; overflow:hidden; transform-style:preserve-3d;
      box-shadow:0 55px 95px -40px rgba(0,0,0,.92); transition: transform .35s ease; touch-action:none; cursor:grab; }
    .lbt-card.is-live { transition: transform .08s ease; }
    .lbt-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; -webkit-user-drag:none; }
    .lbt-glare { position:absolute; inset:0; mix-blend-mode:screen; pointer-events:none; opacity:0; transition:opacity .3s; }
    .lbt-card.is-live .lbt-glare { opacity:1; }
    .lbt-cap { position:absolute; left:0; right:0; bottom:0; padding:0.9rem; text-align:center; font-size:0.66rem;
      letter-spacing:0.18em; text-transform:uppercase; color:#fff; background:linear-gradient(transparent, rgba(0,0,0,.55)); }
    .lbt-nav { position:relative; z-index:2; }

    /* ===== v9 CAROUSEL (cylinder) ===== */
    .lbcy { width:100%; height:100%; position:relative; perspective:1300px; overflow:hidden; cursor:grab; touch-action:pan-y; }
    .lbcy.is-dragging { cursor:grabbing; }
    .lbcy-stage { position:absolute; inset:0; transform-style:preserve-3d; }
    .lbcy-card { position:absolute; inset-inline-start:50%; top:46%; padding:0; border:none; background:transparent; cursor:pointer;
      transform-style:preserve-3d; transition: transform .5s cubic-bezier(.22,1,.36,1), opacity .5s ease; }
    .lbcy-card.no-anim { transition:none; }
    .lbcy-card img { width:100%; height:100%; object-fit:cover; border-radius:6px; background:#fff; display:block;
      box-shadow:0 30px 60px -34px rgba(0,0,0,.9); -webkit-user-drag:none; }
    .lbcy-card.is-active img { box-shadow:0 40px 80px -36px rgba(0,0,0,.95), 0 0 0 1px rgba(197,160,106,0.3); }
    .lbcy-caption, .lbcu-caption { position:absolute; left:0; right:0; bottom:clamp(0.6rem,3vw,1.6rem); z-index:50;
      display:flex; flex-direction:column; align-items:center; gap:0.2rem; pointer-events:none; }
    .lbcy-chapter, .lbcu-chapter { font-family:var(--f-display); font-size:clamp(1rem,2.2vw,1.6rem); }
    .lbcy-count, .lbcu-count { font-size:0.66rem; letter-spacing:0.24em; color:var(--brass-2); font-variant-numeric:tabular-nums; }

    /* ===== v10 CUBE ===== */
    .lbcu { width:100%; height:100%; position:relative; perspective:1500px; overflow:hidden; cursor:grab; touch-action:pan-y; }
    .lbcu.is-dragging { cursor:grabbing; }
    .lbcu-scene { position:absolute; inset:0; display:grid; place-items:center; transform-style:preserve-3d; }
    .lbcu-cube { position:relative; transform-style:preserve-3d; transition: transform .7s cubic-bezier(.7,0,.2,1); }
    .lbcu-cube.no-anim { transition:none; }
    .lbcu-face { position:absolute; inset:0; overflow:hidden; border-radius:4px; backface-visibility:hidden; background:#100f0c;
      box-shadow:0 0 0 1px rgba(251,247,240,0.06); }
    .lbcu-face img { width:100%; height:100%; object-fit:cover; -webkit-user-drag:none; }
    .lbcu-blank { position:absolute; inset:0; background:var(--paper-2); }
    .lbcu-nav { position:absolute; top:50%; transform:translateY(-50%); z-index:5; }
    .lbcu-nav--l { inset-inline-start:clamp(0.5rem,3vw,2rem); } .lbcu-nav--r { inset-inline-end:clamp(0.5rem,3vw,2rem); }
    .lbcu-nav:hover:not(:disabled) { transform:translateY(-50%) scale(1.07); }
    html[dir="rtl"] .lbcu-nav { transform:translateY(-50%) scaleX(-1); }
    html[dir="rtl"] .lbcu-nav:hover:not(:disabled) { transform:translateY(-50%) scaleX(-1) scale(1.07); }

    /* ---- responsive ---- */
    @media (max-width: 860px) {
      .lb { --bar: 54px; --film: 74px; --stageH: 62svh; }
      .lb-bar { grid-template-columns: auto 1fr auto; gap:0.4rem; }
      .lb-brand__sub { display:none; }
      .lb-switch__btn span { display:none; }
      .lb-switch__btn { padding:0.5em 0.7em; }
      .lb-dl span { display:none; }
      .lb-dl { padding:0.5em; border-radius:50%; }
      .lb-counter { display:none; }
      .lbk > .lbk-nav { display:none; }
      .lb-thumb { width:50px; height:50px; }
      .lbr-meta { right:0; left:0; width:100%; align-items:center; text-align:center; bottom:1rem; }
      html[dir="rtl"] .lbr-meta { right:0; left:0; align-items:center; text-align:center; }
      .lbr-index { font-size:7rem; opacity:0.06; top:18%; }
    }

    @media (prefers-reduced-motion: reduce) {
      .lbk-leaf, .lbk-book, .lbg-card, .lbk-shade { transition:none; }
      .lbr-figure, .lbr-img { animation:none; }
    }
    `}</style>
  );
}
