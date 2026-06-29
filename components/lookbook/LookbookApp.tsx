"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Rise, Magnetic } from "@/components/motion";
import { WHATSAPP } from "@/lib/brand";
import { PAGE_COUNT, PDF_HREF, pageSrc } from "./data";
import BookMode from "./BookMode";
import ZoomMode from "./ZoomMode";
import TourMode from "./TourMode";

type Mode = "book" | "read" | "tour";
const MODE_IDS: Mode[] = ["book", "read", "tour"];

const MODES: { id: Mode; en: string; ar: string; icon: React.ReactNode }[] = [
  { id: "book", en: "Book", ar: "كتاب", icon: <BookIcon /> },
  { id: "read", en: "Read", ar: "قراءة", icon: <ReadIcon /> },
  { id: "tour", en: "Tour", ar: "جولة", icon: <TourIcon /> },
];

const MODE_HINTS: Record<Mode, [string, string]> = {
  book: ["Drag or tap to turn the page", "اسحب أو انقر لتقليب الصفحة"],
  read: ["Scroll, pinch or double-tap to zoom · drag to pan", "مرّر أو اقرص للتكبير · اسحب للتحريك"],
  tour: ["Tap to play or pause", "انقر للتشغيل أو الإيقاف"],
};

/* New user-facing copy for the intro band + showroom CTA (bilingual, RTL-ready). */
const T = {
  kicker: { en: "ARGOS · Interior Design by Evora", ar: "أرغوس · تصميم داخلي من إيفورا" },
  title: { en: "The Lookbook", ar: "الكتالوج" },
  lead: {
    en: "Thirty-one pages of bedrooms, dressing rooms, majlis and lounges — turn each leaf the way you would the real book.",
    ar: "واحدة وثلاثون صفحة من غرف النوم وغرف الملابس والمجالس والاستراحات — قلّب كل ورقة كأنك تتصفّح الكتاب على الطبيعة.",
  },
  cta_kicker: { en: "From the showroom", ar: "من المعرض" },
  cta_title: { en: "See these rooms in person.", ar: "شاهد هذه الغرف على الطبيعة." },
  cta_lead: {
    en: "Visit us in Khalda, or send a quick message — we'll help you bring the book home.",
    ar: "زرنا في خلدا، أو راسلنا برسالة سريعة — نساعدك لتنقل الكتاب إلى بيتك.",
  },
  cta_visit: { en: "Plan a visit", ar: "خطّط لزيارتك" },
  cta_wa: { en: "Message on WhatsApp", ar: "راسلنا على واتساب" },
  wa_text: {
    en: "Hi Evora — I just browsed the ARGOS lookbook and I'd love to know more.",
    ar: "مرحبًا إيفورا — تصفّحت كتالوج أرغوس وأودّ معرفة المزيد.",
  },
};

export default function LookbookApp() {
  const { lang, dir } = useT();
  const en = lang === "en";
  const tl = (k: keyof typeof T) => T[k][lang];
  const waHref = `${WHATSAPP}?text=${encodeURIComponent(T.wa_text[lang])}`;
  const [mode, setMode] = useState<Mode>("book");
  const [page, setPage] = useState(0);
  const [fs, setFs] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLDivElement>(null);

  const go = useCallback((n: number) => setPage(Math.max(0, Math.min(PAGE_COUNT - 1, n))), []);

  // deep-link the view (?view=book|read|tour)
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
    <>
      <LookbookStyles />

      {/* Light intro band — gives the pinnedSolid Nav a surface to sit on. */}
      <section className="lb-intro" lang={lang} dir={dir}>
        <Rise as="p" className="lb-intro__kicker">{tl("kicker")}</Rise>
        <Rise as="h1" delay={0.06} className="lb-intro__title display">{tl("title")}</Rise>
        <Rise as="p" delay={0.12} className="lb-intro__lead">{tl("lead")}</Rise>
      </section>

      <div className={`lb ${fs ? "is-fs" : ""}`} ref={rootRef} lang={lang} dir={dir}>
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
        {mode === "read" && <ZoomMode page={page} setPage={go} lang={lang} dir={dir} />}
        {mode === "tour" && <TourMode page={page} setPage={go} lang={lang} dir={dir} />}
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

      {/* Slim "From the showroom" CTA — closes the page → /visit + WhatsApp. */}
      <section className="lb-cta" lang={lang} dir={dir}>
        <Rise className="lb-cta__inner">
          <div className="lb-cta__copy">
            <span className="lb-cta__kicker">{tl("cta_kicker")}</span>
            <h2 className="lb-cta__title display">{tl("cta_title")}</h2>
            <p className="lb-cta__lead">{tl("cta_lead")}</p>
          </div>
          <div className="lb-cta__actions">
            <Magnetic strength={0.2}>
              <Link href="/visit" className="lb-cta__btn lb-cta__btn--solid">{tl("cta_visit")}</Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="lb-cta__btn lb-cta__btn--ghost">{tl("cta_wa")}</a>
            </Magnetic>
          </div>
        </Rise>
      </section>
    </>
  );
}

/* ---------- icons ---------- */
function BookIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5c-1.5-1-4-1.5-6.5-1.2C4.6 3.9 4 4.6 4 5.4v11.8c0 .9.8 1.6 1.7 1.5C8 18.5 10.6 19 12 20m0-15c1.5-1 4-1.5 6.5-1.2.9.1 1.5.8 1.5 1.6v11.8c0 .9-.8 1.6-1.7 1.5C16 18.5 13.4 19 12 20m0-15v15"/></svg>; }
function FsIcon() { return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4"/></svg>; }
function FsExitIcon() { return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 4v3a2 2 0 0 1-2 2H4M15 4v3a2 2 0 0 0 2 2h3M9 20v-3a2 2 0 0 0-2-2H4M15 20v-3a2 2 0 0 1 2-2h3"/></svg>; }
function DlIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"/></svg>; }
function ReadIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-4-4"/></svg>; }
function TourIcon() { return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none"/></svg>; }

/* =====================  STYLES  ===================== */
function LookbookStyles() {
  return (
    <style>{`
    .lb { --bar: 60px; --film: 92px; --stageH: min(72svh, 760px);
      position: relative; min-height: 100svh; overflow-x: clip; color: var(--paper);
      background:
        radial-gradient(120% 80% at 50% -10%, rgba(197,160,106,0.12), transparent 55%),
        linear-gradient(180deg, #131210, #1b1916 55%, #100f0c);
      display: flex; flex-direction: column; padding-top: 0; }
    .lb.is-fs { padding-top: 0; }

    /* ---- intro band (light — seats the pinnedSolid Nav above the dark app) ---- */
    .lb-intro { background: var(--paper); color: var(--ink); text-align: center;
      padding: clamp(7rem,13vw,9.5rem) clamp(1.2rem,5vw,2rem) clamp(2.4rem,5vw,3.6rem);
      border-bottom: 1px solid var(--line); }
    .lb-intro__kicker { margin: 0; font-size: 0.72rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--clay); }
    html[dir="rtl"] .lb-intro__kicker { letter-spacing: 0.08em; }
    .lb-intro__title { margin: 0.8rem 0; font-size: clamp(2.4rem,6vw,4.2rem); line-height: 1.02; color: var(--ink); }
    .lb-intro__lead { margin: 0 auto; max-width: 48ch; font-size: clamp(1rem,2.2vw,1.16rem); line-height: 1.62; color: var(--ink-soft); }

    /* ---- "From the showroom" CTA strip (closes the page → /visit + WhatsApp) ---- */
    .lb-cta { background: var(--paper); color: var(--ink); border-top: 1px solid var(--line);
      padding: clamp(2.6rem,6vw,4.4rem) clamp(1.2rem,5vw,2rem); }
    .lb-cta__inner { max-width: 1080px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center;
      justify-content: space-between; gap: clamp(1.4rem,4vw,2.6rem); }
    .lb-cta__kicker { font-size: 0.7rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--clay); }
    html[dir="rtl"] .lb-cta__kicker { letter-spacing: 0.08em; }
    .lb-cta__title { margin: 0.6rem 0 0.5rem; font-size: clamp(1.7rem,3.6vw,2.6rem); line-height: 1.06; color: var(--ink); }
    .lb-cta__lead { margin: 0; max-width: 44ch; color: var(--ink-soft); line-height: 1.6; }
    .lb-cta__actions { display: flex; flex-wrap: wrap; gap: 0.8rem; }
    .lb-cta__btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
      padding: 0.95em 1.7em; border-radius: 100px; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.02em; white-space: nowrap;
      transition: background .3s var(--ease), color .3s var(--ease), border-color .3s var(--ease); }
    .lb-cta__btn--solid { background: var(--ink); color: var(--paper); }
    .lb-cta__btn--solid:hover { background: var(--clay); }
    .lb-cta__btn--ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
    .lb-cta__btn--ghost:hover { border-color: var(--ink); background: rgba(22,21,15,0.04); }
    @media (max-width: 560px) { .lb-cta__actions { width: 100%; } .lb-cta__btn { flex: 1 1 auto; } }

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

    /* ===== READ (zoom inspector) ===== */
    .lbz { width:100%; height:100%; position:relative; display:flex; align-items:center; justify-content:center; }
    .lbz-frame { position:relative; width:min(72svh, 88%); aspect-ratio:1/1; overflow:hidden; border-radius:8px;
      background:#fff; box-shadow:0 40px 80px -42px rgba(0,0,0,.85); touch-action:none; cursor:zoom-in; }
    .lbz-frame.is-zoomed { cursor:grab; }
    .lbz-frame.is-zoomed:active { cursor:grabbing; }
    .lbz-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transform-origin:center center; -webkit-user-drag:none; }
    .lbz-tools { position:absolute; bottom:clamp(0.6rem,3vw,1.5rem); left:50%; transform:translateX(-50%); z-index:5;
      display:flex; align-items:center; gap:0.5rem; padding:0.35rem 0.5rem; border-radius:100px;
      background:rgba(16,15,12,0.6); backdrop-filter:blur(10px); border:1px solid rgba(251,247,240,0.12); }
    .lbz-btn { width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:1.2rem; line-height:1; color:rgba(251,247,240,0.85);
      background:transparent; border:1px solid rgba(251,247,240,0.16); display:grid; place-items:center; transition:background .25s,border-color .25s,color .25s; }
    .lbz-btn:hover:not(:disabled) { background:rgba(251,247,240,0.12); border-color:rgba(251,247,240,0.36); color:var(--paper); }
    .lbz-btn:disabled { opacity:0.25; cursor:default; }
    .lbz-level { min-width:46px; text-align:center; font-size:0.74rem; color:rgba(251,247,240,0.8); font-variant-numeric:tabular-nums; }
    .lbz-cap { position:absolute; top:clamp(0.4rem,2vw,1rem); left:50%; transform:translateX(-50%); z-index:5;
      font-size:0.64rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--brass-2); white-space:nowrap; }

    /* ===== TOUR (guided autoplay) ===== */
    .lbtour { width:100%; height:100%; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; }
    .lbtour-bloom { position:absolute; inset:-12%; width:124%; height:124%; object-fit:cover; filter:blur(64px) saturate(1.25);
      opacity:0.4; z-index:0; animation:lbFade .9s ease; }
    .lbtour-vignette { position:absolute; inset:0; z-index:1; pointer-events:none;
      background: radial-gradient(58% 60% at 50% 46%, transparent, rgba(8,7,5,0.82)); }
    .lbtour-stage { position:relative; z-index:2; padding:0; border:none; background:transparent; cursor:pointer;
      width:min(66svh, 86%); aspect-ratio:1/1; }
    .lbtour-figure { width:100%; height:100%; aspect-ratio:1/1; border-radius:8px; overflow:hidden; margin:0;
      box-shadow:0 50px 100px -42px rgba(0,0,0,.95); }
    .lbtour-img { width:100%; height:100%; object-fit:cover; transform-origin:center; }
    .lbtour-figure.kb-a .lbtour-img { animation: kbA 7s ease-out both; }
    .lbtour-figure.kb-b .lbtour-img { animation: kbB 7s ease-out both; }
    @keyframes kbA { from { transform:scale(1.02) translate(0,0) } to { transform:scale(1.13) translate(-2%,-2%) } }
    @keyframes kbB { from { transform:scale(1.02) translate(0,0) } to { transform:scale(1.13) translate(2%,2%) } }
    .lbtour-play { position:absolute; inset:0; display:grid; place-items:center; z-index:3; pointer-events:none; }
    .lbtour-play span, .lbtour-play svg { color:var(--paper); }
    .lbtour-play { color:var(--paper); }
    .lbtour-play > svg { width:60px; height:60px; padding:18px; border-radius:50%; background:rgba(16,15,12,0.55); backdrop-filter:blur(6px);
      opacity:1; transition:opacity .4s ease; }
    .lbtour-play.is-playing > svg { opacity:0; }
    .lbtour-stage:hover .lbtour-play.is-playing > svg { opacity:0.85; }
    .lbtour-hud { position:absolute; z-index:4; left:0; right:0; bottom:clamp(0.6rem,3vw,1.6rem);
      display:flex; align-items:center; gap:clamp(0.5rem,2vw,1.2rem); padding:0 clamp(1rem,5vw,3rem); }
    .lbtour-meta { flex:1; display:flex; align-items:center; gap:clamp(0.6rem,2vw,1.2rem); }
    .lbtour-chapter { font-family:var(--f-display); font-size:clamp(0.95rem,2vw,1.4rem); white-space:nowrap; }
    .lbtour-track { flex:1; height:2px; background:rgba(251,247,240,0.2); border-radius:2px; overflow:hidden; }
    .lbtour-fill { display:block; height:100%; background:var(--brass-2); }
    .lbtour-count { font-size:0.72rem; color:rgba(251,247,240,0.72); font-variant-numeric:tabular-nums; white-space:nowrap; }
    @keyframes lbFade { from { opacity:0 } to { opacity:1 } }

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
    }

    /* phone: ≥44px touch targets for every reachable control */
    @media (max-width: 560px) {
      .lb { --bar: 60px; }
      .lb-icon { width:44px; height:44px; }
      .lb-dl { width:44px; height:44px; padding:0; justify-content:center; border-radius:50%; }
      .lb-switch { padding:5px; }
      .lb-switch__btn { min-height:44px; padding:0 0.85em; }
      .lbz-tools { padding:0.4rem 0.55rem; gap:0.4rem; }
      .lbz-btn { width:44px; height:44px; font-size:1.3rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .lbk-leaf, .lbk-book, .lbk-shade { transition:none; }
      .lbtour-img { animation:none; }
    }
    `}</style>
  );
}
