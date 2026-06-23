"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useT } from "@/lib/i18n";

/* ------------------------------------------------------------------ *
 *  Evora — The Lookbook
 *  A premium digital catalogue. Desktop: a real 3D page-flip book.
 *  Mobile: a snap carousel of single pages. Bilingual (EN / AR).
 * ------------------------------------------------------------------ */

type Bi = { en: string; ar: string };
const bi = (en: string, ar: string): Bi => ({ en, ar });

type Signature = { name: Bi; cat: Bi; price: string; img: string };

const SIGNATURE: Signature[] = [
  { name: bi("Aspen Oak Bed", "سرير أسبن البلوط"), cat: bi("Bedroom", "غرف النوم"), price: "1,290 JOD", img: "/evora/c-bedrooms.jpg" },
  { name: bi("Dune Curved Sofa", "كنبة ديون المنحنية"), cat: bi("Living", "المعيشة"), price: "1,640 JOD", img: "/evora/p08.jpg" },
  { name: bi("Helios Brass Table", "طاولة هيليوس النحاسية"), cat: bi("Tables", "الطاولات"), price: "360 JOD", img: "/evora/p11.jpg" },
  { name: bi("Linen Nightstand", "كومودينو لينين"), cat: bi("Bedroom", "غرف النوم"), price: "210 JOD", img: "/evora/p02.jpg" },
];

const MATERIALS: { name: Bi; note: Bi; img: string }[] = [
  { name: bi("Solid Oak & Walnut", "بلوط وجوز صلب"), note: bi("Kiln-dried hardwood, built to outlast trends.", "خشب صلب مجفّف، يدوم أطول من الموضة."), img: "/evora/p02.jpg" },
  { name: bi("Velvet & Linen", "مخمل وكتان"), note: bi("Soft to touch, engineered for daily life.", "ناعم الملمس، مصمّم للحياة اليومية."), img: "/evora/p09.jpg" },
  { name: bi("Hand-finished Brass", "نحاس مشغول يدويًا"), note: bi("Warm metal, patinated and sealed by hand.", "معدن دافئ، مصقول ومحميّ باليد."), img: "/evora/p10.jpg" },
];

export default function CatalogBook() {
  const { t, lang, dir } = useT();
  const en = lang === "en";
  const L = (b: Bi) => (en ? b.en : b.ar);

  // ----- page content -----
  const pages = useMemo(() => {
    const room = (img: string, no: string, name: Bi, count: Bi, copy: Bi) => (
      <PageRoom img={img} no={no} name={L(name)} count={L(count)} copy={L(copy)} />
    );
    const list: React.ReactNode[] = [
      // 0 — cover
      <PageCover key="cover" en={en} />,
      // 1 — welcome
      <PageText
        key="welcome"
        eyebrow={en ? "The Lookbook · 2026" : "الكتالوج · ٢٠٢٦"}
        title={en ? "Welcome to your future home." : "أهلًا بك في بيت المستقبل."}
        body={[
          en
            ? "Evora is more than a showroom. We compose spaces — warm woods, soft tones and quiet luxury — brought together for the way you actually live."
            : "إيفورا أكثر من معرض. نحن نصمّم المساحات — أخشاب دافئة، ألوان ناعمة، وفخامة هادئة — مجتمعة لتناسب أسلوب حياتك.",
          en
            ? "From a single statement piece to a fully designed home, every Evora interior is crafted, delivered and styled by one team — from concept to the last cushion."
            : "من قطعة واحدة مميّزة إلى منزل متكامل التصميم، يُصنع كل تصميم من إيفورا ويُسلّم ويُنسّق بفريق واحد — من الفكرة حتى آخر وسادة.",
        ]}
        pageNo="01"
      />,
      // 2-6 — rooms
      room("/evora/c-bedrooms.jpg", "02", bi("Bedrooms", "غرف النوم"), bi("42 pieces", "٤٢ قطعة"),
        bi("Beds, wardrobes and the calm that holds a room together.", "أسرّة، خزائن، والهدوء الذي يجمع الغرفة معًا.")),
      room("/evora/p06.jpg", "03", bi("Living", "غرف المعيشة"), bi("31 pieces", "٣١ قطعة"),
        bi("Sofas and seating that invite you to stay a while longer.", "كنب ومقاعد تدعوك للبقاء وقتًا أطول.")),
      room("/evora/p08.jpg", "04", bi("Sofa Sets", "أطقم الكنب"), bi("28 pieces", "٢٨ قطعة"),
        bi("Channel-stitched, deep-seated and made to your fabric.", "بحياكة مميّزة، عميقة الجلسة، وبالقماش الذي تختاره.")),
      room("/evora/p03.jpg", "05", bi("Dining", "غرف الطعام"), bi("36 pieces", "٣٦ قطعة"),
        bi("Tables built to host, for decades of long evenings.", "طاولات مصنوعة للضيافة، لعقود من الأمسيات الطويلة.")),
      // 6 — signature pieces
      <PageSignature key="sig" en={en} L={L} items={SIGNATURE} />,
      // 7 — materials
      <PageMaterials key="mat" en={en} L={L} items={MATERIALS} />,
      // 8 — design service
      <PageText
        key="design"
        eyebrow={en ? "Design & Execution" : "تصميم وتنفيذ"}
        title={en ? "We design whole homes." : "نصمّم المنازل بالكامل."}
        body={[
          en
            ? "Built-in closets, full interiors and turn-key fit-outs. Our in-house studio returns a complete concept — 3D visuals, materials and a fixed, transparent quote."
            : "خزائن حائطية، تصاميم داخلية كاملة، وتجهيز جاهز للسكن. يعيد لك استوديونا تصميمًا متكاملًا — مشاهد ثلاثية الأبعاد، مواد، وعرض سعر ثابت وواضح.",
          en
            ? "Pay at the cash price and spread it over up to three years through Safwa Islamic Bank — with fast in-showroom approval."
            : "ادفع بسعر الكاش وقسّطه حتى ثلاث سنوات عبر بنك صفوة الإسلامي — مع موافقة سريعة داخل المعرض.",
        ]}
        pageNo="08"
        img="/evora/concept.png"
      />,
      // 9 — back cover / contact
      <PageBack key="back" en={en} addr={t("visit_addr")} hours={t("visit_hours")} />,
    ];
    // pad to an even number of pages for clean leaves
    if (list.length % 2 !== 0) list.push(<PageBlank key="blank" />);
    return list;
  }, [en, lang, t]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = pages.length;
  const leaves = total / 2;
  const [flipped, setFlipped] = useState(0); // number of leaves turned (0..leaves)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const next = useCallback(() => setFlipped((f) => Math.min(f + 1, leaves)), [leaves]);
  const prev = useCallback(() => setFlipped((f) => Math.max(f - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const fwd = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
      const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
      if (e.key === fwd) next();
      else if (e.key === back) prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, dir]);

  // mobile carousel ----------------------------------------------------
  const trackRef = useRef<HTMLDivElement>(null);
  const [mPage, setMPage] = useState(0);
  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setMPage(Math.round(el.scrollLeft / el.clientWidth) * (dir === "rtl" ? -1 : 1));
  };

  if (isMobile) {
    return (
      <div className="cat" lang={lang}>
        <CatStyle />
        <div className="cat__head">
          <span className="cat__eyebrow">{en ? "The Evora Lookbook" : "كتالوج إيفورا"}</span>
          <h1 className="cat__title display">{en ? "Browse the collection" : "تصفّح المجموعة"}</h1>
        </div>
        <div className="cat__mtrack" ref={trackRef} onScroll={onTrackScroll}>
          {pages.map((p, i) => (
            <div className="cat__mpage" key={i}>
              <div className="leaf__sheet">{p}</div>
            </div>
          ))}
        </div>
        <div className="cat__dots">
          {pages.map((_, i) => (
            <span key={i} className={`cat__dot ${i === Math.abs(mPage) ? "is-on" : ""}`} />
          ))}
        </div>
        <p className="cat__hint">{en ? "Swipe to turn the page" : "اسحب لتقليب الصفحة"}</p>
        <a className="btn cat__dl" href="/catalog.pdf">{en ? "Download PDF" : "تنزيل الكتالوج"} ↓</a>
      </div>
    );
  }

  // desktop flipbook ---------------------------------------------------
  const atStart = flipped === 0;
  const atEnd = flipped === leaves;

  return (
    <div className="cat" lang={lang}>
      <CatStyle />
      <div className="cat__head">
        <span className="cat__eyebrow">{en ? "The Evora Lookbook · 2026" : "كتالوج إيفورا · ٢٠٢٦"}</span>
        <h1 className="cat__title display">{en ? "Turn the pages" : "قلّب الصفحات"}</h1>
      </div>

      <div className="cat__stage">
        <button className="cat__nav cat__nav--prev" aria-label={en ? "Previous page" : "الصفحة السابقة"} onClick={prev} disabled={atStart}>‹</button>

        <div className={`book ${atStart ? "is-closed" : ""} ${atEnd ? "is-end" : ""}`}>
          {Array.from({ length: leaves }).map((_, i) => {
            const isFlipped = i < flipped;
            const z = isFlipped ? i : leaves - i;
            return (
              <div className={`leaf ${isFlipped ? "is-flipped" : ""}`} key={i} style={{ zIndex: z }}>
                <div className="leaf__face leaf__face--front">
                  <div className="leaf__sheet">{pages[i * 2]}</div>
                  <span className="leaf__shade leaf__shade--front" />
                </div>
                <div className="leaf__face leaf__face--back">
                  <div className="leaf__sheet">{pages[i * 2 + 1]}</div>
                  <span className="leaf__shade leaf__shade--back" />
                </div>
              </div>
            );
          })}
          <span className="book__spine" />
        </div>

        <button className="cat__nav cat__nav--next" aria-label={en ? "Next page" : "الصفحة التالية"} onClick={next} disabled={atEnd}>›</button>
      </div>

      <div className="cat__foot">
        <div className="cat__progress">
          <span className="cat__bar" style={{ transform: `scaleX(${flipped / leaves})` }} />
        </div>
        <div className="cat__count">
          {atStart ? (en ? "Cover" : "الغلاف") : `${Math.min(flipped * 2, total)} / ${total}`}
        </div>
        <a className="btn cat__dl" href="/catalog.pdf">{en ? "Download PDF" : "تنزيل الكتالوج"} ↓</a>
      </div>
    </div>
  );
}

/* =====================  PAGE TEMPLATES  ===================== */

function PageCover({ en }: { en: boolean }) {
  return (
    <div className="pg pg--cover">
      <span className="pg-cover__frame" />
      <div className="pg-cover__top">
        <span className="pg-cover__eyebrow">{en ? "Future Home · Khalda, Amman" : "بيت المستقبل · خلدا، عمّان"}</span>
      </div>
      <div className="pg-cover__mark">
        <span className="pg-cover__name">EVORA</span>
        <span className="pg-cover__rule" />
        <span className="pg-cover__sub">{en ? "The Lookbook" : "الكتالوج"}</span>
      </div>
      <div className="pg-cover__bottom">
        <span>2026 / 2027</span>
        <span>{en ? "Volume I" : "المجلّد الأول"}</span>
      </div>
    </div>
  );
}

function PageText({
  eyebrow, title, body, pageNo, img,
}: { eyebrow: string; title: string; body: string[]; pageNo: string; img?: string }) {
  return (
    <div className="pg pg--text">
      {img && <div className="pg-text__img" style={{ backgroundImage: `url(${img})` }} />}
      <span className="pg__eyebrow">{eyebrow}</span>
      <h2 className="pg__h display">{title}</h2>
      <div className="pg__body">
        {body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <span className="pg__no">{pageNo}</span>
    </div>
  );
}

function PageRoom({ img, no, name, count, copy }: { img: string; no: string; name: string; count: string; copy: string }) {
  return (
    <div className="pg pg--room">
      <div className="pg-room__img" style={{ backgroundImage: `url(${img})` }}>
        <span className="pg-room__no">{no}</span>
      </div>
      <div className="pg-room__cap">
        <div>
          <h2 className="pg-room__name display">{name}</h2>
          <span className="pg-room__count">{count}</span>
        </div>
        <p className="pg-room__copy">{copy}</p>
      </div>
    </div>
  );
}

function PageSignature({ en, L, items }: { en: boolean; L: (b: Bi) => string; items: Signature[] }) {
  return (
    <div className="pg pg--sig">
      <span className="pg__eyebrow">{en ? "Signature Pieces" : "قطع مميّزة"}</span>
      <h2 className="pg__h display">{en ? "A few of our favourites" : "بعض من قطعنا المفضّلة"}</h2>
      <div className="pg-sig__grid">
        {items.map((s) => (
          <div className="pg-sig__card" key={s.name.en}>
            <div className="pg-sig__img" style={{ backgroundImage: `url(${s.img})` }} />
            <div className="pg-sig__row">
              <span className="pg-sig__name">{L(s.name)}</span>
              <span className="pg-sig__price">{s.price}</span>
            </div>
            <span className="pg-sig__cat">{L(s.cat)}</span>
          </div>
        ))}
      </div>
      <span className="pg__no">06</span>
    </div>
  );
}

function PageMaterials({ en, L, items }: { en: boolean; L: (b: Bi) => string; items: { name: Bi; note: Bi; img: string }[] }) {
  return (
    <div className="pg pg--mat">
      <span className="pg__eyebrow">{en ? "Craftsmanship" : "الحرفية"}</span>
      <h2 className="pg__h display">{en ? "Made to be lived with" : "صُنع ليُعاش معه"}</h2>
      <ul className="pg-mat__list">
        {items.map((m) => (
          <li className="pg-mat__item" key={m.name.en}>
            <span className="pg-mat__swatch" style={{ backgroundImage: `url(${m.img})` }} />
            <span className="pg-mat__txt">
              <span className="pg-mat__name">{L(m.name)}</span>
              <span className="pg-mat__note">{L(m.note)}</span>
            </span>
          </li>
        ))}
      </ul>
      <span className="pg__no">07</span>
    </div>
  );
}

function PageBack({ en, addr, hours }: { en: boolean; addr: string; hours: string }) {
  return (
    <div className="pg pg--back">
      <span className="pg-back__frame" />
      <span className="pg-back__name">EVORA</span>
      <span className="pg-back__tag">{en ? "Your Future Home" : "بيت المستقبل"}</span>
      <div className="pg-back__info">
        <p>{addr}</p>
        <p>{hours}</p>
        <p>@evorafuturehome</p>
      </div>
      <a className="pg-back__cta" href="/visit">{en ? "Book a Visit →" : "احجز زيارة →"}</a>
    </div>
  );
}

function PageBlank() {
  return <div className="pg pg--blank" />;
}

/* =====================  STYLES  ===================== */

function CatStyle() {
  return (
    <style>{`
    .cat { min-height: 100svh; padding: clamp(6rem,11vw,9rem) var(--gut) clamp(2.5rem,5vw,4rem);
      background:
        radial-gradient(120% 80% at 50% -10%, rgba(197,160,106,0.10), transparent 55%),
        linear-gradient(180deg, #14130f, #1d1b16 60%, #14130f);
      color: var(--paper); display: flex; flex-direction: column; align-items: center; }
    .cat__head { text-align: center; margin-bottom: clamp(1.5rem,3vw,2.6rem); }
    .cat__eyebrow { display:block; font-size:0.68rem; letter-spacing:0.34em; text-transform:uppercase; color: var(--brass-2); }
    html[dir="rtl"] .cat__eyebrow { letter-spacing:0.12em; }
    .cat__title { font-size: clamp(2rem,4.5vw,3.4rem); font-weight:360; margin:0.5rem 0 0; }

    /* ---- desktop book ---- */
    .cat__stage { display:flex; align-items:center; gap: clamp(0.5rem,2vw,2rem); width:100%; justify-content:center; }
    .book { position: relative; width: min(78vw, 1040px); aspect-ratio: 2 / 1.32;
      perspective: 2600px; transform-style: preserve-3d;
      transition: transform .9s cubic-bezier(.22,1,.36,1); }
    /* when closed only the right (cover) half should sit centered */
    .book.is-closed { transform: translateX(-25%); }
    .book.is-end { transform: translateX(25%); }
    html[dir="rtl"] .book.is-closed { transform: translateX(25%); }
    html[dir="rtl"] .book.is-end { transform: translateX(-25%); }
    .book__spine { position:absolute; top:0; bottom:0; left:50%; width:2px; transform:translateX(-1px);
      background: linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.12)); z-index:9999; pointer-events:none; }

    .leaf { position:absolute; top:0; left:50%; width:50%; height:100%;
      transform-origin: left center; transform-style: preserve-3d;
      transition: transform .95s cubic-bezier(.62,.04,.3,1); }
    html[dir="rtl"] .leaf { left:auto; right:50%; transform-origin: right center; }
    .leaf.is-flipped { transform: rotateY(-180deg); }
    html[dir="rtl"] .leaf.is-flipped { transform: rotateY(180deg); }
    .leaf__face { position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
      overflow:hidden; background: var(--paper);
      box-shadow: 0 30px 60px -40px rgba(0,0,0,.7); }
    .leaf__face--back { transform: rotateY(180deg); }
    .leaf__sheet { position:absolute; inset:0; }
    .leaf__shade { position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity .9s ease; z-index:5; }
    .leaf__shade--front { background: linear-gradient(90deg, rgba(0,0,0,.22), transparent 18%); }
    html[dir="rtl"] .leaf__shade--front { background: linear-gradient(270deg, rgba(0,0,0,.22), transparent 18%); }
    .leaf__shade--back { background: linear-gradient(270deg, rgba(0,0,0,.18), transparent 18%); }
    html[dir="rtl"] .leaf__shade--back { background: linear-gradient(90deg, rgba(0,0,0,.18), transparent 18%); }
    .leaf:not(.is-flipped) .leaf__shade--front { opacity:1; }

    .cat__nav { flex:none; width:54px; height:54px; border-radius:50%; cursor:pointer;
      background: rgba(251,247,240,0.08); border:1px solid rgba(251,247,240,0.25); color: var(--paper);
      font-size:1.6rem; line-height:1; display:grid; place-items:center;
      transition: background .3s, transform .3s, opacity .3s; }
    .cat__nav:hover:not(:disabled) { background: var(--brass-2); color:#1a1813; transform:scale(1.07); }
    .cat__nav:disabled { opacity:0.25; cursor:default; }
    html[dir="rtl"] .cat__nav--prev, html[dir="rtl"] .cat__nav--next { transform: scaleX(-1); }
    html[dir="rtl"] .cat__nav:hover:not(:disabled) { transform: scaleX(-1) scale(1.07); }

    .cat__foot { display:flex; align-items:center; gap: clamp(1rem,3vw,2.2rem); margin-top: clamp(1.4rem,3vw,2.4rem); }
    .cat__progress { width: clamp(120px,22vw,260px); height:2px; background: rgba(251,247,240,0.18); overflow:hidden; border-radius:2px; }
    .cat__bar { display:block; width:100%; height:100%; background: var(--brass-2); transform-origin:left; transition: transform .8s cubic-bezier(.22,1,.36,1); }
    html[dir="rtl"] .cat__bar { transform-origin:right; }
    .cat__count { font-size:0.82rem; letter-spacing:0.14em; color: rgba(251,247,240,0.75); min-width:64px; text-align:center; }
    .cat__dl { background: var(--paper); color:#1a1813; padding:0.7em 1.2em; }
    .cat__dl:hover { background: var(--brass-2); }

    /* ---- mobile carousel ---- */
    .cat__mtrack { display:flex; width:100%; max-width:520px; overflow-x:auto; scroll-snap-type:x mandatory;
      gap:0; border-radius:4px; -webkit-overflow-scrolling:touch; scrollbar-width:none; aspect-ratio: 1 / 1.34; background: var(--paper);
      box-shadow: 0 40px 80px -50px rgba(0,0,0,.8); }
    .cat__mtrack::-webkit-scrollbar { display:none; }
    .cat__mpage { position:relative; flex:0 0 100%; scroll-snap-align:center; aspect-ratio:1/1.34; }
    .cat__mpage .leaf__sheet { position:absolute; inset:0; }
    .cat__dots { display:flex; gap:7px; margin:1.2rem 0 0.4rem; flex-wrap:wrap; justify-content:center; max-width:300px; }
    .cat__dot { width:6px; height:6px; border-radius:50%; background: rgba(251,247,240,0.3); transition:background .3s,transform .3s; }
    .cat__dot.is-on { background: var(--brass-2); transform:scale(1.4); }
    .cat__hint { font-size:0.74rem; letter-spacing:0.16em; text-transform:uppercase; color: rgba(251,247,240,0.5); margin:0.4rem 0 1.4rem; }

    /* =========== page interiors =========== */
    .pg { position:absolute; inset:0; overflow:hidden; background: var(--paper); color: var(--ink);
      display:flex; flex-direction:column; }
    .pg__eyebrow { font-size:0.6rem; letter-spacing:0.26em; text-transform:uppercase; color: var(--brass);
      padding: clamp(1.4rem,4%,2.4rem) clamp(1.4rem,5%,2.6rem) 0; }
    html[dir="rtl"] .pg__eyebrow { letter-spacing:0.08em; }
    .pg__h { font-size: clamp(1.3rem,2.4vw,2.1rem); font-weight:380; line-height:1.12; margin:0.7rem 0 0;
      padding: 0 clamp(1.4rem,5%,2.6rem); max-width: 18ch; }
    .pg__body { padding: clamp(1rem,3%,1.6rem) clamp(1.4rem,5%,2.6rem); display:flex; flex-direction:column; gap:0.8rem; }
    .pg__body p { font-size: clamp(0.8rem,1vw,0.95rem); line-height:1.65; color: var(--ink-soft); margin:0; max-width:46ch; }
    .pg__no { position:absolute; bottom: clamp(1rem,4%,1.8rem); inset-inline-end: clamp(1.4rem,5%,2.6rem);
      font-family: var(--font-display); font-style:italic; color: var(--ink-faint); font-size:0.9rem; }

    /* cover */
    .pg--cover { background: linear-gradient(155deg,#26241d 0%, #36412f 60%, #1d1b15 100%); color: var(--paper); }
    .pg-cover__frame { position:absolute; inset: clamp(0.7rem,3%,1.4rem); border:1px solid rgba(197,160,106,0.4); pointer-events:none; }
    .pg-cover__top, .pg-cover__bottom { position:relative; z-index:1; padding: clamp(1.6rem,7%,2.6rem); display:flex; justify-content:space-between;
      font-size:0.62rem; letter-spacing:0.24em; text-transform:uppercase; color: rgba(251,247,240,0.7); }
    html[dir="rtl"] .pg-cover__top, html[dir="rtl"] .pg-cover__bottom { letter-spacing:0.08em; }
    .pg-cover__eyebrow { color: var(--brass-2); }
    .pg-cover__mark { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.9rem; z-index:1; }
    .pg-cover__name { font-family: var(--f-display); font-size: clamp(2.4rem,6vw,4.2rem); letter-spacing:0.28em; text-indent:0.28em; }
    .pg-cover__rule { width:60px; height:1px; background: var(--brass-2); }
    .pg-cover__sub { font-size:0.74rem; letter-spacing:0.4em; text-transform:uppercase; color: rgba(251,247,240,0.8); text-indent:0.4em; }
    html[dir="rtl"] .pg-cover__sub { letter-spacing:0.12em; }
    .pg-cover__bottom { margin-top:auto; }

    /* text page image strip */
    .pg-text__img { height: 38%; background-size:cover; background-position:center; margin-bottom:0.4rem; }
    .pg--text .pg__eyebrow { padding-top: clamp(1rem,3%,1.6rem); }

    /* room page */
    .pg-room__img { position:relative; height:62%; background-size:cover; background-position:center; }
    .pg-room__no { position:absolute; top:1rem; inset-inline-start:1.1rem; font-family:var(--f-display); font-style:italic;
      color: var(--paper); font-size:1rem; text-shadow:0 2px 12px rgba(0,0,0,.5); }
    .pg-room__cap { flex:1; padding: clamp(1rem,4%,1.8rem) clamp(1.4rem,5%,2.6rem); display:flex; flex-direction:column; justify-content:center; gap:0.7rem; }
    .pg-room__name { font-size: clamp(1.4rem,2.6vw,2.2rem); font-weight:380; margin:0; }
    .pg-room__count { font-size:0.66rem; letter-spacing:0.2em; text-transform:uppercase; color: var(--brass); }
    .pg-room__copy { font-size: clamp(0.8rem,1vw,0.94rem); line-height:1.6; color: var(--ink-soft); margin:0; max-width:34ch; }

    /* signature grid */
    .pg-sig__grid { flex:1; display:grid; grid-template-columns:1fr 1fr; gap: clamp(0.6rem,2%,1rem);
      padding: clamp(0.8rem,3%,1.4rem) clamp(1.4rem,5%,2.6rem) clamp(2rem,6%,2.8rem); }
    .pg-sig__card { display:flex; flex-direction:column; min-height:0; }
    .pg-sig__img { flex:1; background-size:cover; background-position:center; border-radius:2px; min-height:0; }
    .pg-sig__row { display:flex; justify-content:space-between; align-items:baseline; gap:0.5rem; margin-top:0.45rem; }
    .pg-sig__name { font-family:var(--f-display); font-size:0.92rem; }
    .pg-sig__price { font-size:0.78rem; color: var(--brass); white-space:nowrap; }
    .pg-sig__cat { font-size:0.58rem; letter-spacing:0.16em; text-transform:uppercase; color: var(--ink-faint); }

    /* materials */
    .pg-mat__list { list-style:none; margin:0; padding: clamp(1rem,3%,1.6rem) clamp(1.4rem,5%,2.6rem); display:flex; flex-direction:column; gap: clamp(0.8rem,2.4%,1.4rem); flex:1; justify-content:center; }
    .pg-mat__item { display:flex; align-items:center; gap:1rem; }
    .pg-mat__swatch { flex:none; width: clamp(54px,16%,84px); aspect-ratio:1; background-size:cover; background-position:center; border-radius:3px; box-shadow:0 8px 18px -12px rgba(0,0,0,.5); }
    .pg-mat__txt { display:flex; flex-direction:column; gap:0.25rem; }
    .pg-mat__name { font-family:var(--f-display); font-size: clamp(0.95rem,1.3vw,1.15rem); }
    .pg-mat__note { font-size:0.8rem; line-height:1.5; color: var(--ink-soft); }

    /* back cover */
    .pg--back { background: linear-gradient(155deg,#1d1b15 0%, #26241d 100%); color: var(--paper); align-items:center; justify-content:center; text-align:center; gap:0.8rem; padding: clamp(1.6rem,7%,2.6rem); }
    .pg-back__frame { position:absolute; inset: clamp(0.7rem,3%,1.4rem); border:1px solid rgba(197,160,106,0.4); pointer-events:none; }
    .pg-back__name { font-family:var(--f-display); font-size: clamp(1.8rem,4vw,2.8rem); letter-spacing:0.26em; text-indent:0.26em; z-index:1; }
    .pg-back__tag { font-size:0.7rem; letter-spacing:0.34em; text-transform:uppercase; color: var(--brass-2); z-index:1; }
    html[dir="rtl"] .pg-back__tag { letter-spacing:0.1em; }
    .pg-back__info { z-index:1; display:flex; flex-direction:column; gap:0.35rem; margin-top:1rem; font-size:0.84rem; color: rgba(251,247,240,0.8); line-height:1.5; }
    .pg-back__cta { z-index:1; margin-top:1.4rem; color:#1a1813; background: var(--brass-2); padding:0.6em 1.3em; border-radius:100px; font-size:0.84rem; font-weight:600; }
    .pg--blank { background: var(--paper-2); }

    @media (prefers-reduced-motion: reduce) {
      .leaf, .book, .cat__bar { transition: none; }
    }
    `}</style>
  );
}
