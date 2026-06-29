"use client";

/* ============================================================
   EVORA FUTURE STUDIO — public presentation page (client)
   Sells the 3D design experience, not features. Four-beat
   narrative: bring your plan → watch it become a room → walk
   inside before it's yours → approve it, then we build it.
   Reuses existing /evora media; copy comes from the studio_*
   i18n keys (Stream A) plus the bilingual studioSpec features.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import Monogram from "@/components/brand/Monogram";
import {
  Rise,
  RevealWords,
  ParallaxImage,
  CountUp,
  useReducedMotion,
} from "@/components/motion";

/* ---------- the 360° walk-in orbit (reused from the configurator) ---------- */
const ORBIT_TOTAL = 169;
const ORBIT_VH = 360; // scrub length of the pinned section
const orbitPad = (n: number) => String(n).padStart(4, "0");
const orbitSrc = (i: number) => `/evora/config-frames/frame_${orbitPad(i)}.webp`;

/* ============================================================
   FrameScrub — sticky, scroll-scrubbed canvas of the orbit.
   Mirrors the proven ConfiguratorScroll scrubber. Reduced
   motion renders a single still instead of the canvas.
   ============================================================ */
function WalkInside() {
  const { t, lang } = useT();
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrame = useRef(1);
  const currentFrame = useRef(1);
  const ticking = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let mounted = true;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (i: number) => {
      const img = imagesRef.current[i];
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let w = cw, h = ch, x = 0, y = 0;
      if (ir > cr) { h = ch; w = ch * ir; x = (cw - w) / 2; }
      else { w = cw; h = cw / ir; y = (ch - h) / 2; }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, w, h);
    };

    const render = () => {
      ticking.current = false;
      const cur = currentFrame.current;
      const tgt = targetFrame.current;
      const next = cur + (tgt - cur) * 0.18;
      currentFrame.current = Math.abs(tgt - next) < 0.4 ? tgt : next;
      draw(Math.round(currentFrame.current));
      if (Math.round(currentFrame.current) !== tgt) requestTick();
    };
    const requestTick = () => {
      if (!ticking.current) { ticking.current = true; requestAnimationFrame(render); }
    };

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / scrollable)); // 0..1
      targetFrame.current = Math.min(ORBIT_TOTAL, Math.max(1, Math.round(p * (ORBIT_TOTAL - 1)) + 1));
      requestTick();
    };

    let loaded = 0;
    for (let i = 1; i <= ORBIT_TOTAL; i++) {
      const img = new Image();
      img.src = orbitSrc(i);
      img.onload = () => {
        loaded++;
        if (i === 1 && mounted) { sizeCanvas(); draw(1); setReady(true); }
        if (loaded === ORBIT_TOTAL && mounted) onScroll();
      };
      imagesRef.current[i] = img;
    }

    const onResize = () => { sizeCanvas(); draw(Math.round(currentFrame.current)); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      mounted = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      className="studio-walk"
      style={{ height: reduce ? "100svh" : `${ORBIT_VH}vh` }}
    >
      <div className="studio-walk__sticky">
        {!reduce && (
          <canvas
            ref={canvasRef}
            className="studio-walk__canvas"
            role="img"
            aria-label={lang === "en" ? "Walk through your room in 3D" : "تجوّل في غرفتك بالأبعاد الثلاثية"}
          />
        )}
        {(!ready || reduce) && (
          <img src={orbitSrc(1)} alt="" className="studio-walk__poster" aria-hidden />
        )}

        <div className="studio-walk__scrim" />

        <Rise className="studio-walk__copy" y={30}>
          <span className="studio-num">03</span>
          <h2 className="display studio-walk__t">{t("studio_b3_t")}</h2>
          <p className="studio-walk__b">{t("studio_b3_b")}</p>
          {!reduce && (
            <span className="studio-walk__hint">
              <i />
              {lang === "en" ? "Scroll to look around" : "مرّر لتنظر حولك"}
            </span>
          )}
        </Rise>
      </div>
    </section>
  );
}

/* ============================================================
   The presentation page
   ============================================================ */
export default function StudioPresentation() {
  const { t, lang } = useT();
  const en = lang === "en";
  const reduce = useReducedMotion();

  // staff tool + portal links sell the experience without a price anywhere.
  const openStudio = en ? "Open the Studio" : "افتح الاستوديو";
  const seeDesigns = en ? "See your designs" : "شاهد تصاميمك";

  // What the Studio does — verbatim from studioSpec.featuresEN / featuresAR
  const features = en
    ? [
        "From a 2D plan to a furnished, walk-through 3D room",
        "True-to-size models — every piece in real millimetres",
        "Choose finishes live: marble, wood, fabric, metal",
        "Step inside with a 360 walk-in before anything is made",
        "Import a LiDAR room scan from Evora Scan",
        "Approve a photoreal render, then track the build live",
      ]
    : [
        "من مخطّط ثنائي الأبعاد إلى غرفة مؤثّثة تتجوّل فيها بالأبعاد الثلاثية",
        "نماذج بالحجم الحقيقي — كل قطعة بالمليمتر الصحيح",
        "اختر التشطيبات مباشرةً: رخام، خشب، قماش، معدن",
        "ادخل الغرفة بجولة ٣٦٠ قبل أن تُصنع أي قطعة",
        "استورد مسح الغرفة بتقنية الليدار من تطبيق Evora Scan",
        "وافِق على تصميمٍ واقعي، ثم تابع التنفيذ مباشرةً",
      ];

  return (
    <div className="studio" lang={lang}>
      {/* ======================= HERO ======================= */}
      <header className="studio-hero">
        <div
          className="studio-hero__bg"
          style={{ backgroundImage: "url(/evora/room-living.jpg)" }}
        >
          {reduce ? (
            <img src="/evora/room-living.jpg" alt="" aria-hidden />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/evora/room-living.jpg"
              aria-hidden
            >
              <source src="/evora/room-living.mp4" type="video/mp4" />
            </video>
          )}
        </div>
        <div className="studio-hero__scrim" />

        <div className="studio-hero__inner container">
          <Rise className="studio-hero__lockup" y={20}>
            <Monogram tone="brass" className="studio-hero__mono" />
            <span className="eyebrow studio-hero__eyebrow">{t("studio_eyebrow")}</span>
          </Rise>

          <Rise as="h1" className="display studio-hero__title" delay={0.08}>
            {t("studio_hero_title")}
          </Rise>

          <p className="studio-hero__sub">
            <RevealWords text={t("studio_hero_sub")} delay={0.2} />
          </p>

          <Rise className="studio-hero__cta" delay={0.32} y={20}>
            <a href="/visit" className="btn btn-brass">
              {t("studio_cta")} <span className="arrow">→</span>
            </a>
            <a href="/pufferweb" className="studio-quiet">
              {openStudio} <span className="arrow">→</span>
            </a>
          </Rise>
        </div>

        <div className="studio-hero__scrollcue" aria-hidden>
          <i />
          {en ? "Scroll" : "مرّر"}
        </div>
      </header>

      {/* =============== FOUR-MOVES FRAMING =============== */}
      <section className="studio-section studio-bone" style={{ paddingBlock: "clamp(3.4rem,7vw,5.5rem)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "62ch", marginInline: "auto" }}>
          <Rise>
            <span className="eyebrow">{en ? "Four moves" : "أربع خطوات"}</span>
            <p className="studio-body" style={{ maxWidth: "100%", marginTop: "1rem", marginInline: "auto", fontSize: "clamp(1.2rem,2.4vw,1.7rem)", color: "var(--ink)", lineHeight: 1.5 }}>
              {en
                ? "From a flat plan to a home you've already walked through — this is how your space comes to life."
                : "من مخطّطٍ مسطّح إلى بيتٍ تجوّلت فيه سلفًا — هكذا تنبض مساحتك بالحياة."}
            </p>
          </Rise>
        </div>
      </section>

      {/* =============== BEAT 1 — bring your plan =============== */}
      <section className="studio-section">
        <div className="container">
          <div className="studio-beat">
            <Rise className="studio-beat__media" y={30}>
              <span className="studio-beat__tag">{en ? "Your plan" : "مخطّطك"}</span>
              <img src="/evora/kitchen/stage-1.jpg" alt={en ? "A 2D Evora floor plan" : "مخطّط إيفورا ثنائي الأبعاد"} />
            </Rise>
            <div className="studio-beat__copy">
              <span className="studio-num">01</span>
              <div className="studio-beat__hr" />
              <Rise as="h2" className="display studio-beat__t">{t("studio_b1_t")}</Rise>
              <p className="studio-body studio-beat__b">
                <RevealWords text={t("studio_b1_b")} />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =============== BEAT 2 — watch it become a room =============== */}
      <section className="studio-section studio-bone">
        <div className="container">
          <div className="studio-beat rev">
            <Rise className="studio-beat__media" y={30}>
              <span className="studio-beat__tag">{en ? "In 3D" : "بالأبعاد الثلاثية"}</span>
              {reduce ? (
                <img src="/evora/kitchen/stage-4.jpg" alt={en ? "The plan rebuilt as a furnished 3D room" : "المخطّط بعد بنائه غرفةً مؤثّثة بالأبعاد الثلاثية"} />
              ) : (
                <video autoPlay muted loop playsInline poster="/evora/kitchen/stage-4.jpg" aria-label={en ? "The plan rebuilt as a furnished 3D room" : "المخطّط بعد بنائه غرفةً مؤثّثة بالأبعاد الثلاثية"}>
                  <source src="/evora/kitchen/reveal.mp4" type="video/mp4" />
                </video>
              )}
            </Rise>
            <div className="studio-beat__copy">
              <span className="studio-num">02</span>
              <div className="studio-beat__hr" />
              <Rise as="h2" className="display studio-beat__t">{t("studio_b2_t")}</Rise>
              <p className="studio-body studio-beat__b">
                <RevealWords text={t("studio_b2_b")} />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =============== BEAT 3 — walk inside (pinned orbit) =============== */}
      <WalkInside />

      {/* =============== BEAT 4 — approve, then we build =============== */}
      <section className="studio-section">
        <div className="container">
          <div className="studio-beat">
            <ParallaxImage
              src="/evora/kitchen/stage-4.jpg"
              alt={en ? "The photoreal render you sign off on" : "التصميم الواقعي الذي توافق عليه"}
              amount={10}
              className="studio-beat__media"
            />
            <div className="studio-beat__copy">
              <span className="studio-num">04</span>
              <div className="studio-beat__hr" />
              <Rise as="h2" className="display studio-beat__t">{t("studio_b4_t")}</Rise>
              <p className="studio-body studio-beat__b">
                <RevealWords text={t("studio_b4_b")} />
              </p>
              <Rise delay={0.1} y={18} style={{ marginTop: "2rem" }}>
                <a href="/visit" className="btn btn-ink">
                  {t("studio_cta")} <span className="arrow">→</span>
                </a>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* =============== FEATURE STRIP =============== */}
      <section className="studio-section studio-dark">
        <div className="container">
          <div className="studio-features__head">
            <span className="eyebrow">{en ? "Inside the Studio" : "داخل الاستوديو"}</span>
            <Rise as="h2" className="display studio-features__h">
              {en ? "One studio, your whole home." : "استوديو واحد، بيتك بالكامل."}
            </Rise>
          </div>
          <div className="studio-features__grid">
            {features.map((f, i) => (
              <Rise key={i} className="studio-feature" delay={i * 0.05} y={24}>
                <span className="studio-feature__n">{orbitPad(i + 1).slice(2)}</span>
                <h3 className="studio-feature__t">{f}</h3>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* =============== PROOF =============== */}
      <section className="studio-section studio-bone">
        <div className="container">
          <div className="studio-proof__grid">
            <Rise>
              <div className="studio-proof__stats">
                <div>
                  <div className="studio-proof__num">
                    {en ? <CountUp value="2,400+" /> : "+٢٤٠٠"}
                  </div>
                  <div className="studio-proof__label">{en ? "homes furnished" : "بيتًا أثّثناه"}</div>
                </div>
                <div>
                  <div className="studio-proof__num">{en ? "2017" : "٢٠١٧"}</div>
                  <div className="studio-proof__label">{en ? "designing since" : "نصمّم منذ"}</div>
                </div>
              </div>
            </Rise>
            <div>
              <span className="eyebrow">{en ? "From Abdoun to Khalda" : "من عبدون إلى خلدا"}</span>
              <Rise as="h2" className="display studio-proof__h">
                {en ? "2,400+ homes, designed in 3D first." : "أكثر من ٢٤٠٠ بيت، صُمّمت بالأبعاد الثلاثية أوّلًا."}
              </Rise>
              <p className="studio-body">
                {en
                  ? "We don't just sell furniture — we design the whole space. And the complete interior-design service is yours, free, when you furnish with Evora."
                  : "نحن لا نبيع الأثاث فحسب — نصمّم المساحة بأكملها. وخدمة التصميم الداخلي الكاملة هديّتنا لك عند التأثيث مع إيفورا."}
              </p>
              <p className="studio-proof__cap">
                {en ? "Furnishing Jordan's homes since 2017." : "نؤثّث بيوت الأردن منذ ٢٠١٧."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =============== CLOSE =============== */}
      <section className="studio-section studio-dark studio-close">
        <div className="container">
          <div className="studio-close__inner">
            <span className="eyebrow">{en ? "Visit the Khalda showroom" : "زُر معرض خلدا"}</span>
            <Rise as="h2" className="display studio-close__h">
              {en ? "It starts with your floor plan." : "كل شيء يبدأ بمخطّطك."}
            </Rise>
            <p className="studio-close__b">
              {en
                ? "Bring your plan to our Khalda showroom — Wasfi Al-Tal St, opposite Paradise Bakeries — and watch your home take shape in 3D, with our design team beside you."
                : "أحضر مخطّطك إلى معرضنا في خلدا — شارع وصفي التل، مقابل أفران الجنّة — وشاهد بيتك يتشكّل بالأبعاد الثلاثية، وفريق التصميم بجانبك."}
            </p>

            <Rise className="studio-close__ctas" delay={0.08} y={20}>
              <a href="/visit" className="btn btn-brass">
                {t("studio_cta")} <span className="arrow">→</span>
              </a>
              <a href="/login" className="btn btn-outline-light">
                {seeDesigns} <span className="arrow">→</span>
              </a>
            </Rise>

            <div className="studio-close__staff">
              <span>{en ? "Evora team" : "فريق إيفورا"}</span>
              <a href="/pufferweb" className="studio-quiet">
                {openStudio} <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
