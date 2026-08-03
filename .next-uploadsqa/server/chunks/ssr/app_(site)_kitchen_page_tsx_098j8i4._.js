module.exports=[77850,a=>{"use strict";var b=a.i(187924),c=a.i(807998),d=a.i(600783),e=a.i(368196),f=a.i(635577),g=a.i(668222),h=a.i(417989),i=a.i(922723);let j={eyebrow:{en:"The Stone Library",ar:"مكتبة الحجر"},heading:{en:"Five stones, five kitchens",ar:"خمسة أحجار، خمسة مطابخ"},lead:{en:"Every finish here is a real option, shown in a kitchen built around it. From storm-grey Patagonia to sand-toned Travertine — scroll back up to try one live on your own island.",ar:"كل تشطيب هنا خيارٌ حقيقي، معروضٌ في مطبخٍ صُمّم حوله. من باتاغونيا الرمادي كالعاصفة إلى الترافرتين الرملي — عد إلى الأعلى لتجرّبه مباشرة على جزيرتك."},cta:{en:"Try them live in the configurator",ar:"جرّبها مباشرة في المُصمِّم"},hint:{en:"Send your plan",ar:"أرسل مخططك"},card_aria:{en:"{stone} — send us your floor plan and we'll design your kitchen",ar:"{stone} — أرسل لنا مخطط منزلك ونصمّم مطبخك"}},k={patagonia:"/evora/kitchens/patagonia","calacatta-gold":"/evora/kitchens/calacatta-gold",emperador:"/evora/kitchens/emperador","verde-alpi":"/evora/kitchens/verde-alpi",travertine:"/evora/kitchens/travertine"};function l(){let{t:a,lang:c,dir:d}=(0,f.useT)(),e=a=>j[a][c];return(0,b.jsxs)("section",{id:"kitchen-materials",className:"kmat",dir:d,lang:c,children:[(0,b.jsxs)("div",{className:"container",children:[(0,b.jsxs)("div",{className:"kmat__head",children:[(0,b.jsx)(g.Rise,{as:"span",className:"eyebrow kmat__eyebrow",children:e("eyebrow")}),(0,b.jsx)(g.Rise,{as:"h2",delay:.06,className:"display kmat__h",children:e("heading")}),(0,b.jsx)(g.Rise,{as:"p",delay:.12,className:"kmat__lead",children:e("lead")})]}),(0,b.jsx)(g.Stagger,{className:"kmat__grid",gap:.07,children:h.SURFACES.filter(a=>k[a.id]).map(a=>(0,b.jsx)(g.StaggerItem,{className:"kmat__item",children:(0,b.jsxs)("a",{href:"/start",className:"kmat__card","data-cursor":"hover","aria-label":e("card_aria").replace("{stone}",a.label[c]),onClick:a=>{a.metaKey||a.ctrlKey||a.shiftKey||0!==a.button||(a.preventDefault(),(0,i.openStartProject)())},children:[(0,b.jsxs)("span",{className:"kmat__imgwrap",children:[(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{srcSet:`${k[a.id]}.avif`,type:"image/avif"}),(0,b.jsx)("img",{src:`${k[a.id]}.webp`,alt:a.label[c],className:"kmat__img",loading:"lazy",decoding:"async"})]}),(0,b.jsx)("span",{className:"kmat__scrim","aria-hidden":!0})]}),(0,b.jsx)("span",{className:"kmat__swatch","aria-hidden":!0,style:{backgroundImage:`url(${a.swatch})`}}),(0,b.jsxs)("span",{className:"kmat__meta",children:[(0,b.jsx)("h3",{className:"kmat__name display",children:a.label[c]}),a.note&&(0,b.jsx)("span",{className:"kmat__note",children:a.note[c]}),(0,b.jsxs)("span",{className:"kmat__hint",children:[e("hint")," ",(0,b.jsx)("span",{className:"kmat__hintarrow","aria-hidden":!0,children:"→"})]})]})]})},a.id))}),(0,b.jsx)(g.Rise,{delay:.1,className:"kmat__foot",children:(0,b.jsxs)("a",{href:"#configurator",className:"kmat__more","data-cursor":"hover",children:[(0,b.jsx)("span",{children:e("cta")}),(0,b.jsx)("span",{className:"kmat__morearrow","aria-hidden":!0,children:"↑"})]})})]}),(0,b.jsx)("style",{children:m})]})}let m=`
  .kmat { position: relative; background: var(--paper); padding-block: clamp(4rem, 9vw, 7.5rem); }

  .kmat__head { max-width: 62ch; margin-bottom: clamp(2.2rem, 5vw, 3.6rem); }
  .kmat__eyebrow { color: var(--brass); display: block; }
  .kmat__h { font-size: clamp(2.1rem, 4.6vw, 3.6rem); line-height: 1.04; margin: 0.9rem 0 0; color: var(--ink); }
  .kmat__lead { color: var(--ink-soft); font-size: clamp(0.98rem, 1.2vw, 1.1rem); line-height: 1.65; margin: 1.1rem 0 0; max-width: 58ch; }

  .kmat__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(14px, 1.8vw, 24px); }
  .kmat__item { display: flex; }
  .kmat__card {
    position: relative; display: flex; flex-direction: column; width: 100%;
    border-radius: 8px; overflow: hidden; background: var(--bone);
    box-shadow: 0 20px 50px -32px rgba(22,21,15,0.35);
    transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease);
  }
  .kmat__card:hover { transform: translateY(-4px); box-shadow: 0 34px 70px -34px rgba(22,21,15,0.45); }

  .kmat__imgwrap { position: relative; aspect-ratio: 4 / 3; overflow: hidden; }
  .kmat__img { width: 100%; height: 100%; object-fit: cover; display: block;
    transform: scale(1.03); transition: transform 1.1s var(--ease); }
  .kmat__card:hover .kmat__img { transform: scale(1.09); }
  .kmat__scrim { position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 48%, rgba(16,15,13,0.72) 100%); }

  .kmat__swatch {
    position: absolute; top: 0.85rem; inset-inline-start: 0.85rem; z-index: 2;
    width: 34px; height: 34px; border-radius: 9px;
    background-size: cover; background-position: center;
    border: 2px solid rgba(251,247,240,0.85);
    box-shadow: 0 6px 16px rgba(0,0,0,0.35);
  }

  .kmat__meta { position: absolute; inset-inline: 0; bottom: 0; z-index: 2;
    padding: 1rem 1.1rem 1.05rem; display: flex; flex-direction: column; gap: 0.2rem; }
  .kmat__name { color: var(--paper); font-size: clamp(1.1rem, 1.6vw, 1.35rem); line-height: 1.08; }
  .kmat__note { color: rgba(251,247,240,0.82); font-size: 0.84rem; line-height: 1.45; max-width: 32ch; }

  /* "Send your plan →" — the card's actual action. Held back until hover on
     pointer devices so the card stays photographic, but ALWAYS visible on
     touch, where there is no hover to reveal it. */
  .kmat__hint {
    display: inline-flex; align-items: center; gap: 0.45em; margin-top: 0.5rem;
    color: var(--brass-2); font-size: 0.7rem; letter-spacing: 0.14em;
    text-transform: uppercase; font-weight: 500;
  }
  .kmat__hintarrow { transition: transform 0.4s var(--ease); }
  [dir="rtl"] .kmat__hintarrow { transform: scaleX(-1); }
  .kmat__card:hover .kmat__hintarrow { transform: translateX(4px); }
  [dir="rtl"] .kmat__card:hover .kmat__hintarrow { transform: scaleX(-1) translateX(4px); }
  @media (hover: hover) and (pointer: fine) {
    .kmat__hint { opacity: 0; transform: translateY(4px);
      transition: opacity 0.4s var(--ease), transform 0.4s var(--ease); }
    .kmat__card:hover .kmat__hint,
    .kmat__card:focus-visible .kmat__hint { opacity: 1; transform: none; }
  }
  .kmat__card:focus-visible { outline: 2px solid var(--brass); outline-offset: 3px; }

  .kmat__foot { margin-top: clamp(2rem, 4vw, 3rem); display: flex; justify-content: center; }
  .kmat__more {
    display: inline-flex; align-items: center; gap: 0.6em;
    font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink); border-bottom: 1px solid var(--brass); padding-bottom: 0.35em;
    transition: color 0.35s var(--ease), gap 0.35s var(--ease);
  }
  .kmat__more:hover { color: var(--brass); gap: 0.9em; }
  .kmat__morearrow { color: var(--brass); font-size: 1rem; transition: transform 0.4s var(--ease); }
  .kmat__more:hover .kmat__morearrow { transform: translateY(-3px); }

  @media (max-width: 900px) {
    .kmat__grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .kmat__grid { grid-template-columns: 1fr; }
    .kmat__imgwrap { aspect-ratio: 16 / 11; }
  }
`;var n=a.i(785466);let o={eyebrow:{en:"Why a bespoke Evora kitchen",ar:"لماذا مطبخ إيفورا حسب الطلب"},heading:{en:"One workshop, start to finish",ar:"ورشة واحدة، من الفكرة حتى التسليم"},lead:{en:"Your island isn't picked off a shelf. The same studio that designs it also cuts, finishes and installs it — under one roof, in Amman.",ar:"جزيرتك لا تُنتقى من على رف. الاستوديو نفسه الذي يصمّمها يقصّها ويشطّبها ويركّبها — تحت سقف واحد، في عمّان."},photoCaption:{en:"An Evora kitchen island, built in Amman",ar:"جزيرة مطبخ من إيفورا، صُنعت في عمّان"},f1_t:{en:"Cut to order, in our workshop",ar:"تُقصّ حسب الطلب، في ورشتنا"},f1_b:{en:"No catalogue numbers — one slab, measured and finished by hand by our own makers in Amman.",ar:"بلا أرقام كتالوج — لوحٌ واحد، يُقاس ويُشطَّب يدويًا على أيدي صنّاعنا في عمّان."},f2_t:{en:"One design team, start to finish",ar:"فريق تصميم واحد، من البداية للنهاية"},f2_b:{en:"The same team that helps you choose the stone sees the project through to delivery — part of Evora's complimentary design service.",ar:"الفريق نفسه الذي يساعدك على اختيار الحجر يرافق مشروعك حتى التسليم — ضمن خدمة التصميم المجانية من إيفورا."},f3_t:{en:"Delivered and installed by us",ar:"نوصّلها ونركّبها بأنفسنا"},f3_b:{en:"Our own team fits every island in place, so nothing is lost between the workshop and your kitchen.",ar:"فريقنا نفسه يركّب كل جزيرة في مكانها، حتى لا يضيع شيء بين الورشة ومطبخك."}},p="/evora/config-frames/frame_0001.webp";function q(){let{t:a,lang:c,dir:d}=(0,f.useT)(),e=a=>o[a][c],h=[{n:"01",t:e("f1_t"),b:e("f1_b")},{n:"02",t:e("f2_t"),b:e("f2_b")},{n:"03",t:e("f3_t"),b:e("f3_b")},{n:"04",t:a("fin_title"),b:a("fin_body")}];return(0,b.jsxs)("section",{id:"kitchen-craft",className:"kcr",dir:d,lang:c,children:[(0,b.jsxs)("div",{className:"container kcr__grid",children:[(0,b.jsxs)(g.Rise,{className:"kcr__photo",children:[(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{srcSet:(0,n.avifSrc)(p),type:"image/avif"}),(0,b.jsx)("img",{src:p,alt:e("photoCaption"),className:"kcr__img",loading:"lazy",decoding:"async"})]}),(0,b.jsx)("span",{className:"kcr__photoscrim","aria-hidden":!0}),(0,b.jsx)("span",{className:"kcr__photocap",children:e("photoCaption")})]}),(0,b.jsxs)("div",{className:"kcr__body",children:[(0,b.jsx)("span",{className:"eyebrow kcr__eyebrow",children:e("eyebrow")}),(0,b.jsx)(g.Rise,{as:"h2",delay:.06,className:"display kcr__h",children:e("heading")}),(0,b.jsx)(g.Rise,{as:"p",delay:.12,className:"kcr__lead",children:e("lead")}),(0,b.jsx)(g.Stagger,{className:"kcr__list",gap:.08,delay:.1,children:h.map(a=>(0,b.jsxs)(g.StaggerItem,{className:"kcr__item",children:[(0,b.jsx)("span",{className:"kcr__n",children:a.n}),(0,b.jsxs)("span",{className:"kcr__itembody",children:[(0,b.jsx)("strong",{className:"kcr__itemt",children:a.t}),(0,b.jsx)("span",{className:"kcr__itemb",children:a.b})]})]},a.n))})]})]}),(0,b.jsx)("style",{children:r})]})}let r=`
  .kcr { position: relative; background: var(--bone); padding-block: clamp(4rem, 9vw, 7.5rem); }

  .kcr__grid { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(2rem, 5vw, 4.5rem); align-items: center; }
  [dir="rtl"] .kcr__grid { direction: rtl; }

  .kcr__photo { position: relative; overflow: hidden; border-radius: 8px;
    aspect-ratio: 4 / 5; box-shadow: 0 30px 80px -44px rgba(16,15,13,0.5); }
  .kcr__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    transform: scale(1.02); transition: transform 1.3s var(--ease); }
  .kcr__photo:hover .kcr__img { transform: scale(1.07); }
  .kcr__photoscrim { position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 55%, rgba(16,15,13,0.72) 100%); }
  .kcr__photocap { position: absolute; z-index: 1; bottom: 1.1rem; inset-inline-start: 1.2rem;
    inset-inline-end: 1.2rem; color: rgba(251,247,240,0.9);
    font-size: 0.78rem; letter-spacing: 0.04em; line-height: 1.4; }

  .kcr__body { min-width: 0; }
  .kcr__eyebrow { color: var(--brass); display: block; }
  .kcr__h { font-size: clamp(2rem, 4.2vw, 3.2rem); line-height: 1.05; margin: 0.9rem 0 0; color: var(--ink); }
  .kcr__lead { color: var(--ink-soft); font-size: clamp(0.98rem, 1.2vw, 1.1rem); line-height: 1.65;
    margin: 1.1rem 0 0; max-width: 52ch; }

  .kcr__list { list-style: none; margin: clamp(2rem, 4vw, 2.8rem) 0 0; padding: 0;
    display: flex; flex-direction: column; }
  .kcr__item { display: grid; grid-template-columns: auto 1fr; gap: clamp(1rem, 2vw, 1.6rem);
    padding: clamp(1rem, 1.8vw, 1.4rem) 0; border-top: 1px solid var(--line); }
  .kcr__n { font-family: var(--font-display); font-size: clamp(1.2rem, 1.8vw, 1.5rem);
    line-height: 1.4; color: var(--brass); letter-spacing: 0.02em; }
  .kcr__itembody { display: flex; flex-direction: column; gap: 0.3rem; }
  .kcr__itemt { font-size: 1.02rem; color: var(--ink); font-weight: 600; line-height: 1.3; }
  .kcr__itemb { font-size: 0.92rem; color: var(--ink-faint); line-height: 1.55; max-width: 52ch; }

  @media (max-width: 860px) {
    .kcr__grid { grid-template-columns: 1fr; }
    .kcr__photo { aspect-ratio: 16 / 11; }
  }
`;var s=a.i(572131),t=a.i(346271),u=a.i(262036);let v=[.22,1,.36,1],w={cta:{en:"Book a kitchen consultation",ar:"احجز استشارة مطبخك"},q1:{en:"Is every kitchen island really made to order?",ar:"هل كل جزيرة مطبخ تُصنع فعلًا حسب الطلب؟"},a1:{en:"Yes. Every Evora island is built to order in our own workshop — one slab, measured and finished by hand, not a stock item off a shelf.",ar:"نعم. كل جزيرة من إيفورا تُصنع خصيصًا في ورشتنا — لوحٌ واحد، يُقاس ويُشطَّب يدويًا، وليست قطعة جاهزة من مخزن."},q2:{en:"Which stones can I choose from?",ar:"من أي حجر يمكنني الاختيار؟"},a2:{en:"Six, so far — Patagonia, Calacatta Gold, Emperador, Nero Marquina, Verde Alpi and Travertine. Scroll up to preview each on the island live.",ar:"ستة حتى الآن — باتاغونيا، وكالاكاتا غولد، وإمبرادور، ونيرو مركينا، وفيردي ألبي، وترافرتين. عد إلى الأعلى لمعاينة كل واحد على الجزيرة مباشرة."},q3:{en:"Do you install the island yourselves?",ar:"هل تركّبون الجزيرة بأنفسكم؟"},a3:{en:"Yes — our own team delivers and installs every island, so nothing is handed off to a third party between the workshop and your kitchen.",ar:"نعم — فريقنا نفسه يوصّل ويركّب كل جزيرة، فلا شيء يُسلَّم لطرف ثالث بين الورشة ومطبخك."},q4:{en:"Can I pay in installments?",ar:"هل يمكنني التقسيط؟"},a4:{en:"Yes — buy at the cash price and spread it over up to 36 months through Safwa Islamic Bank, with no interest and no hidden cost.",ar:"نعم — اشترِ بسعر الكاش وقسّطه على مدى ٣٦ شهرًا عبر بنك صفوة الإسلامي، بدون فوائد وبدون أي تكلفة خفية."},q5:{en:"Is design help included?",ar:"هل خدمة التصميم مشمولة؟"},a5:{en:"Yes — our design studio guides the marble, finish and proportions with you, as part of Evora's complimentary interior-design service.",ar:"نعم — يرافقك استوديو التصميم لدينا في اختيار الرخام والتشطيب والمقاسات، ضمن خدمة التصميم الداخلي المجانية من إيفورا."},q6:{en:"How do I start?",ar:"كيف أبدأ؟"},a6:{en:"Book a consultation below, visit our Khalda showroom, or message us on WhatsApp — whichever is easiest for you.",ar:"احجز استشارة أدناه، أو زُر معرضنا في خلدا، أو راسلنا عبر واتساب — أيّهما أسهل لك."}};function x(){let{t:a,lang:c,dir:d}=(0,f.useT)(),e=a=>w[a][c],[h,j]=(0,s.useState)(0),k=[{q:e("q1"),a:e("a1")},{q:e("q2"),a:e("a2")},{q:e("q3"),a:e("a3")},{q:e("q4"),a:e("a4")},{q:e("q5"),a:e("a5")},{q:e("q6"),a:e("a6")}];return(0,b.jsxs)("section",{id:"kitchen-faq",className:"section kfaq",dir:d,lang:c,children:[(0,b.jsxs)("div",{className:"container",children:[(0,b.jsxs)("div",{className:"kfaq__head",children:[(0,b.jsx)(g.Rise,{children:(0,b.jsx)("span",{className:"eyebrow",style:{color:"var(--brass)"},children:a("faq_eyebrow")})}),(0,b.jsx)("h2",{className:"kfaq__titlewrap",children:(0,b.jsx)(g.RevealLines,{lines:[a("faq_title")],className:"display kfaq__title",delay:.08})})]}),(0,b.jsx)(g.Rise,{delay:.1,children:(0,b.jsx)("div",{className:"kfaq__list",children:k.map((a,c)=>{let d=h===c,e=`kfaq-panel-${c}`,f=`kfaq-q-${c}`;return(0,b.jsxs)("div",{className:"kfaq__row",children:[(0,b.jsx)("h3",{className:"kfaq__qheading",children:(0,b.jsxs)("button",{type:"button",id:f,className:"kfaq__q","data-cursor":"hover","aria-expanded":d,"aria-controls":e,onClick:()=>j(d?null:c),children:[(0,b.jsx)("span",{className:"kfaq__qtext",children:a.q}),(0,b.jsx)(t.motion.span,{className:"kfaq__icon","aria-hidden":"true",animate:{rotate:45*!!d},transition:{duration:.4,ease:v},children:"+"})]})}),(0,b.jsx)(u.AnimatePresence,{initial:!1,children:d&&(0,b.jsx)(t.motion.div,{id:e,role:"region","aria-labelledby":f,className:"kfaq__awrap",initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.4,ease:v},style:{overflow:"hidden"},children:(0,b.jsx)("p",{className:"kfaq__a",children:a.a})})})]},c)})})}),(0,b.jsx)(g.Rise,{delay:.16,className:"kfaq__cta",children:(0,b.jsxs)("button",{type:"button",className:"btn btn-solid",onClick:i.openStartProject,children:[e("cta")," ",(0,b.jsx)("span",{className:"arrow",children:"→"})]})})]}),(0,b.jsx)("style",{children:`
        .kfaq { background: var(--paper); }
        .kfaq__head { text-align: center; max-width: 760px; margin: 0 auto clamp(2.4rem, 5vw, 3.4rem); }
        .kfaq__titlewrap { margin: 0; font-weight: inherit; }
        .kfaq__title { font-size: clamp(2rem, 4.5vw, 3.6rem); margin: 1rem 0 0; }

        .kfaq__list { max-width: 820px; margin: 0 auto; }
        .kfaq__row { border-block-end: 1px solid var(--line); }
        .kfaq__row:first-child { border-block-start: 1px solid var(--line); }
        .kfaq__qheading { margin: 0; }
        .kfaq__q {
          inline-size: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: 1.5rem; padding: 1.5rem 0; background: none; border: 0; cursor: none;
          text-align: start; color: var(--ink); font-family: var(--font-display);
          font-size: 1.1rem; line-height: 1.3;
        }
        .kfaq__qtext { flex: 1 1 auto; }
        .kfaq__icon {
          flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center;
          inline-size: 1.4rem; block-size: 1.4rem; font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 300; line-height: 1; color: var(--brass);
        }
        .kfaq__a {
          margin: 0; padding-block-end: 1.6rem; padding-inline-end: 2.9rem;
          max-width: 62ch; color: var(--ink-soft); font-size: 0.98rem; line-height: 1.65;
        }
        .kfaq__cta { display: flex; justify-content: center; margin-top: clamp(2.4rem, 5vw, 3.4rem); }
      `})]})}var y=a.i(936059);let z={eyebrow:{en:"Start your kitchen",ar:"ابدأ مطبخك"},heading:{en:"Let's design your kitchen.",ar:"لنصمّم مطبخك."},lead:{en:"Book a consultation at our Khalda showroom, or send us a message — we'll walk you through the stone, proportions and finish, then take it from your idea to installed.",ar:"احجز استشارة في معرضنا بخلدا، أو راسلنا مباشرة — نأخذك خطوة بخطوة في اختيار الحجر والمقاسات والتشطيب، ثم ننقل فكرتك من الورشة حتى التركيب."},wa_msg:{en:"Hi Evora! I'd like to discuss a bespoke kitchen island for my home.",ar:"مرحبًا إيفورا! أودّ التحدث عن جزيرة مطبخ حسب الطلب لمنزلي."},visit_label:{en:"Visit the showroom",ar:"زُر المعرض"},call_label:{en:"Call us",ar:"اتصل بنا"},wa_label2:{en:"Message us",ar:"راسلنا"},visit_link:{en:"Full showroom details",ar:"تفاصيل المعرض كاملة"}};function A(){let{t:a,lang:c,dir:d}=(0,f.useT)(),e=a=>z[a][c],h=`${y.WHATSAPP}?text=${encodeURIComponent(e("wa_msg"))}`,j=[{k:e("visit_label"),v:a("visit_addr"),sub:a("visit_hours"),href:"https://www.google.com/maps/dir/?api=1&destination=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman"},{k:e("call_label"),v:y.PHONE_PRIMARY,sub:y.PHONE_SECONDARY,href:`tel:${y.PHONE_PRIMARY_TEL}`},{k:e("wa_label2"),v:a("wa_label"),sub:y.PHONE_SECONDARY,href:h}];return(0,b.jsxs)("section",{id:"kitchen-enquiry",className:"keq",dir:d,lang:c,children:[(0,b.jsxs)("div",{className:"container keq__inner",children:[(0,b.jsxs)(g.Rise,{as:"header",className:"keq__head",children:[(0,b.jsx)("span",{className:"eyebrow keq__eyebrow",children:e("eyebrow")}),(0,b.jsx)("h2",{className:"display keq__h",children:e("heading")}),(0,b.jsx)("p",{className:"keq__lead",children:e("lead")}),(0,b.jsxs)("div",{className:"keq__cta",children:[(0,b.jsx)(g.Magnetic,{strength:.28,children:(0,b.jsxs)("button",{type:"button",className:"btn keq__cta-1",onClick:i.openStartProject,children:[a("cfg_cta")," ",(0,b.jsx)("span",{className:"arrow",children:"→"})]})}),(0,b.jsx)("a",{href:h,target:"_blank",rel:"noopener noreferrer",className:"keq__cta-wa",children:a("wa_label")})]})]}),(0,b.jsx)(g.Rise,{delay:.12,as:"ul",className:"keq__info",children:j.map((a,c)=>(0,b.jsx)("li",{className:"keq__row",children:(0,b.jsxs)("a",{className:"keq__rowlink",href:a.href,target:a.href.startsWith("http")?"_blank":void 0,rel:a.href.startsWith("http")?"noopener noreferrer":void 0,children:[(0,b.jsx)("span",{className:"keq__rowk",children:a.k}),(0,b.jsx)("span",{className:"keq__rowv",children:a.v}),(0,b.jsx)("span",{className:"keq__rowsub",children:a.sub})]})},c))}),(0,b.jsx)(g.Rise,{delay:.18,className:"keq__foot",children:(0,b.jsxs)("a",{href:"/visit",className:"keq__more",children:[e("visit_link")," ",(0,b.jsx)("span",{"aria-hidden":!0,children:"↗"})]})})]}),(0,b.jsx)("style",{children:B})]})}let B=`
  .keq { position: relative; background: #0d0b09; color: #fbf7f0; padding-block: clamp(4.5rem, 10vw, 8.5rem); }
  .keq__inner { display: flex; flex-direction: column; gap: clamp(2.4rem, 5vw, 3.6rem); }

  .keq__head { max-width: 62ch; }
  .keq__eyebrow { color: var(--brass-2); display: block; }
  .keq__h { font-size: clamp(2.4rem, 5.4vw, 4.4rem); line-height: 1.03; margin: 1rem 0 0; color: #fbf7f0; }
  .keq__lead { color: rgba(251,247,240,0.78); font-size: clamp(1rem, 1.3vw, 1.16rem);
    line-height: 1.65; margin: 1.2rem 0 0; max-width: 56ch; }

  .keq__cta { margin-top: clamp(1.6rem, 3vw, 2.2rem); display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
  .keq__cta-1 { background: var(--brass-2, #c8a972); color: #16140f; border-color: var(--brass-2, #c8a972);
    display: inline-flex; align-items: center; gap: 0.6em; }
  .keq__cta-1:hover { transform: translateY(-2px); filter: brightness(1.05); }
  .keq__cta-wa { color: rgba(251,247,240,0.85); font-size: 0.95rem; text-decoration: none;
    border-bottom: 1px solid rgba(251,247,240,0.32); padding-bottom: 2px; min-height: 44px;
    display: inline-flex; align-items: center; transition: color 0.3s var(--ease), border-color 0.3s var(--ease); }
  .keq__cta-wa:hover { color: #fbf7f0; border-color: var(--brass-2, #c8a972); }

  /* keyboard focus on this dark band: the page's brass ring reads better here
     in the lighter on-dark brass, same convention as ConfiguratorScroll's panel */
  .keq .keq__cta-1:focus-visible,
  .keq .keq__cta-wa:focus-visible,
  .keq .keq__rowlink:focus-visible,
  .keq .keq__more:focus-visible {
    outline: 2px solid var(--brass-2, #c8a972); outline-offset: 3px;
  }

  .keq__info { list-style: none; margin: 0; padding: clamp(1.6rem, 3vw, 2.2rem) 0 0;
    border-top: 1px solid rgba(251,247,240,0.16);
    display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1rem, 2.4vw, 2rem); }
  .keq__row { position: relative; }
  .keq__row + .keq__row::before {
    content: ""; position: absolute; inset-inline-start: calc(-1 * clamp(0.5rem, 1.2vw, 1rem));
    top: 8%; bottom: 8%; width: 1px; background: rgba(251,247,240,0.14);
  }
  .keq__rowlink { display: flex; flex-direction: column; gap: 0.35rem; padding: 0.4rem 0;
    border-radius: 6px; transition: opacity 0.3s var(--ease); }
  .keq__rowlink:hover { opacity: 0.78; }
  .keq__rowk { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass-2); }
  html[dir="rtl"] .keq__rowk { letter-spacing: 0.05em; }
  .keq__rowv { font-family: var(--font-display); font-size: clamp(1.05rem, 1.5vw, 1.28rem);
    color: #fbf7f0; line-height: 1.25; }
  .keq__rowsub { font-size: 0.84rem; color: rgba(251,247,240,0.6); }

  .keq__foot { display: flex; }
  .keq__more { display: inline-flex; align-items: center; gap: 0.5em; color: rgba(251,247,240,0.72);
    font-size: 0.86rem; text-decoration: none; border-bottom: 1px solid rgba(251,247,240,0.26);
    padding-bottom: 2px; min-height: 44px; transition: color 0.3s var(--ease), border-color 0.3s var(--ease); }
  .keq__more:hover { color: #fbf7f0; border-color: var(--brass-2, #c8a972); }

  @media (max-width: 760px) {
    .keq__info { grid-template-columns: 1fr; gap: 1.3rem; }
    .keq__row + .keq__row::before { display: none; }
    .keq__row + .keq__row { padding-top: 1.1rem; border-top: 1px solid rgba(251,247,240,0.12); }
    .keq__cta { width: 100%; }
    .keq__cta-1 { width: 100%; justify-content: center; min-height: 46px; }
  }
`;a.s(["default",0,function(){return(0,b.jsxs)("main",{children:[(0,b.jsx)(c.default,{}),(0,b.jsx)(e.default,{}),(0,b.jsx)(l,{}),(0,b.jsx)(q,{}),(0,b.jsx)(x,{}),(0,b.jsx)(A,{}),(0,b.jsx)(d.default,{})]})}],77850)}];

//# sourceMappingURL=app_%28site%29_kitchen_page_tsx_098j8i4._.js.map