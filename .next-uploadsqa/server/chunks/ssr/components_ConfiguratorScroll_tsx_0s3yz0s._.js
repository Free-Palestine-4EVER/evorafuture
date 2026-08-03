module.exports=[368196,417989,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(262036),e=a.i(346271),f=a.i(621216),g=a.i(635577),h=a.i(668222),i=a.i(922723),j=a.i(936059);let k="/evora/configurator/base.webp",l=[{id:"patagonia",label:{en:"Patagonia",ar:"باتاغونيا"},swatch:"/evora/configurator/swatches/patagonia.jpg",image:"/evora/configurator/base.webp",note:{en:"Storm-grey movement, a statement island",ar:"حركة رماديّة كالعاصفة، جزيرة تلفت الأنظار"}},{id:"calacatta-gold",label:{en:"Calacatta Gold",ar:"كالاكاتا غولد"},swatch:"/evora/configurator/swatches/calacatta-gold.jpg",image:"/evora/configurator/surface-calacatta-gold.webp",note:{en:"Warm gold veining, quiet wealth",ar:"عروقٌ ذهبية دافئة، ثراءٌ هادئ"}},{id:"emperador",label:{en:"Emperador",ar:"إمبرادور"},swatch:"/evora/configurator/swatches/emperador.jpg",image:"/evora/configurator/surface-emperador.webp",note:{en:"Deep brown, soft light",ar:"بنيٌّ عميق وضوءٌ ناعم"}},{id:"nero-marquina",label:{en:"Nero Marquina",ar:"نيرو مركينا"},swatch:"/evora/configurator/swatches/nero-marquina.jpg",image:"/evora/configurator/surface-nero-marquina.webp",note:{en:"Black marble, white lightning, for the bold",ar:"رخامٌ أسود ببرقٍ أبيض، لمن يجرؤ"}},{id:"verde-alpi",label:{en:"Verde Alpi",ar:"فيردي ألبي"},swatch:"/evora/configurator/swatches/verde-alpi.jpg",image:"/evora/configurator/surface-verde-alpi.webp",note:{en:"Forest green, rare and alive",ar:"أخضرُ غابيٌّ نادر وحيّ"}},{id:"travertine",label:{en:"Travertine",ar:"ترافرتين"},swatch:"/evora/configurator/swatches/travertine.jpg",image:"/evora/configurator/surface-travertine.webp",note:{en:"Sand-toned, honest stone",ar:"حجرٌ رمليٌّ صادق"}}];a.s(["CONFIG_BASE",0,k,"SURFACES",0,l],417989);var m=a.i(679016),n=a.i(478033);let o={wa:{en:"Ask on WhatsApp",ar:"اسأل عبر واتساب"},wa_msg:{en:"Hi Evora — I'd like to talk about a bespoke kitchen island.",ar:"مرحبًا إيفورا — أودّ التحدث عن جزيرة مطبخ حسب الطلب."},cfg_instruct:{en:"Pick a stone — your island re-renders live.",ar:"اختر حجرًا — تتبدّل الجزيرة أمامك."},cfg_active_label:{en:"Selected stone",ar:"الحجر المختار"},make_eyebrow:{en:"From plan to kitchen",ar:"من المخطط إلى المطبخ"},make_heading:{en:"How a bespoke island is made",ar:"كيف تُصنع جزيرة حسب الطلب"},make_lead:{en:"No catalogue numbers, no guesswork — three steps from the stone you choose to the island standing in your home.",ar:"لا أرقام كتالوج ولا تخمين — ثلاث خطوات من الحجر الذي تختاره إلى الجزيرة في منزلك."},s1_n:{en:"01",ar:"٠١"},s1_t:{en:"Choose your stone",ar:"اختر حجرك"},s1_b:{en:"Sit with our designers in Khalda and settle the marble, finish and proportions — exactly as you saw them on screen.",ar:"اجلس مع مصمّمينا في خلدا واختر الرخام والتشطيب والمقاسات — تمامًا كما رأيتها على الشاشة."},s2_n:{en:"02",ar:"٠٢"},s2_t:{en:"We cut it in our workshop",ar:"نصنعها في ورشتنا"},s2_b:{en:"Your island is built to order by our own makers in Amman — one slab, measured and finished by hand.",ar:"تُصنع جزيرتك خصيصًا على أيدي صنّاعنا في عمّان — لوحٌ واحد، يُقاس ويُشطَّب يدويًا."},s3_n:{en:"03",ar:"٠٣"},s3_t:{en:"We fit it in your home",ar:"نركّبها في منزلك"},s3_b:{en:"We deliver and install it ourselves, then leave the room looking exactly the way you decided it would.",ar:"نوصّلها ونركّبها بأنفسنا، ثم نترك الغرفة كما قرّرتها أنت تمامًا."}},p=a=>String(a).padStart(4,"0"),q=`
  /* Scroll LENGTH set here, per breakpoint, so there is no JS/hydration branch
     that changes document height after load (see the note in the JSX). */
  .cfg { position: relative; background: #0d0b09; height: 420vh; }
  @media (max-width: 768px) { .cfg { height: 300svh; } }
  .cfg__sticky { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
  .cfg__stage { position: absolute; inset: 0; z-index: 1; opacity: 0; transition: opacity .35s ease; }
  .cfg__stage.is-painted { opacity: 1; }
  .cfg__canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .cfg__canvas, .cfg__poster, .cfg__variant {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; display: block; z-index: 0;
  }
  .cfg__variant { z-index: 1; }
  .cfg__scrim { position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background:
      linear-gradient(0deg, rgba(8,6,4,0.55) 0%, rgba(8,6,4,0) 34%),
      linear-gradient(90deg, rgba(8,6,4,0.45) 0%, rgba(8,6,4,0) 30%); }

  .cfg__intro { position: absolute; z-index: 3; left: clamp(1.4rem, 5vw, 5rem);
    top: 50%; transform: translateY(-50%); max-width: 30ch; pointer-events: none; }
  .cfg__h { color: #fbf7f0; font-size: clamp(2.4rem, 6vw, 5rem); line-height: 0.98; margin: 0.3rem 0; }
  .cfg__lead { color: rgba(251,247,240,0.82); font-size: clamp(1rem, 1.4vw, 1.2rem); }

  .cfg__panel { position: absolute; z-index: 4;
    left: clamp(1.4rem, 5vw, 5rem); bottom: clamp(1.6rem, 6vh, 4rem);
    background: rgba(18,14,11,0.78); backdrop-filter: blur(16px) saturate(1.1);
    -webkit-backdrop-filter: blur(16px) saturate(1.1);
    border: 1px solid rgba(251,247,240,0.14); border-radius: 18px;
    padding: clamp(1rem, 2vw, 1.6rem); width: min(92vw, 460px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.45); }
  .cfg__panel-eyebrow { display: block; }
  .cfg__instruct { color: rgba(251,247,240,0.82); font-size: clamp(0.9rem, 1.1vw, 1rem);
    line-height: 1.5; margin: 0.4rem 0 0.9rem; max-width: 34ch; }
  .cfg__panel-head { display: flex; flex-direction: column; gap: 0.12rem; margin-bottom: 0.5rem; }
  .cfg__active-kicker { color: rgba(251,247,240,0.55); font-size: 0.72rem;
    letter-spacing: 0.16em; text-transform: uppercase; }
  .cfg__active-name { color: #fbf7f0; font-size: clamp(1.6rem, 4.4vw, 2.1rem);
    line-height: 1.05; letter-spacing: 0.005em; font-weight: 600; }
  .cfg__note { color: rgba(251,247,240,0.74); font-size: clamp(0.88rem, 1vw, 0.95rem); line-height: 1.5;
    margin: 0 0 0.9rem; max-width: 34ch; }
  [dir="rtl"] .cfg__note { letter-spacing: 0; }

  .cfg__swatches { display: flex; gap: 0.7rem; flex-wrap: wrap; }
  .cfg__swatch { width: 46px; height: 46px; border-radius: 12px; flex: 0 0 auto;
    border: 2px solid rgba(251,247,240,0.25); cursor: pointer; padding: 0;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    background-position: center; background-size: cover; }
  .cfg__swatch:hover { transform: translateY(-2px) scale(1.05); }
  .cfg__swatch.is-active { border-color: var(--brass-2, #c8a972);
    box-shadow: 0 0 0 3px rgba(200,169,114,0.4); transform: scale(1.06); }
  /* keyboard focus on the dark glass panel: the page's dark-brass ring is hard
     to see here, so use the lighter on-dark brass + offset for clear contrast */
  .cfg__panel .cfg__swatch:focus-visible,
  .cfg__panel .cfg__cta-wa:focus-visible {
    outline: 2px solid var(--brass-2, #c8a972); outline-offset: 3px; }
  .cfg__upload { display: grid; place-items: center; color: #fbf7f0;
    background: rgba(251,247,240,0.08); border-style: dashed; font-size: 1.3rem; }
  .cfg__upload:hover { background: rgba(251,247,240,0.16); }
    .cfg__canvas { position: absolute; inset: 0; width: 100%; height: 100%;
    display: block; z-index: 0; }

  .cfg__cta { margin-top: 1.1rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .cfg__cta-1 { display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; }
  .cfg__cta-wa { color: rgba(251,247,240,0.82); font-size: 0.92rem; text-decoration: none;
    border-bottom: 1px solid rgba(251,247,240,0.3); padding-bottom: 1px; transition: color 0.2s ease, border-color 0.2s ease; }
  .cfg__cta-wa:hover { color: #fbf7f0; border-color: var(--brass-2, #c8a972); }

  [dir="rtl"] .cfg__intro, [dir="rtl"] .cfg__panel { left: auto; right: clamp(1.4rem, 5vw, 5rem); }

  /* ── MOBILE (≤768px): full-bleed video beat + bottom-sheet panel ──────── */
  .cfg--mobile .cfg__sticky { height: 100svh; }
  .cfg--mobile .cfg__intro { display: none; } /* the panel carries the explanation */

  .cfg--mobile .cfg__panel,
  [dir="rtl"] .cfg--mobile .cfg__panel {
    left: 0; right: 0; bottom: 0; top: auto; transform: none;
    width: 100%; max-width: none;
    border-radius: 20px 20px 0 0;
    border-width: 1px 0 0 0;
    background: rgba(14,11,9,0.8);
    box-shadow: 0 -18px 50px rgba(0,0,0,0.5);
    padding: 0.6rem 1.15rem;
    padding-top: 0.6rem;
    padding-bottom: calc(0.55rem + env(safe-area-inset-bottom));
    padding-left: max(1.15rem, env(safe-area-inset-left));
    padding-right: max(1.15rem, env(safe-area-inset-right));
  }
  /* keep the bottom sheet as small as possible so the kitchen fills the screen:
     drop the instruction, eyebrow and note lines; compact header + swatches */
  .cfg--mobile .cfg__instruct,
  .cfg--mobile .cfg__panel-eyebrow,
  .cfg--mobile .cfg__note { display: none; }
  .cfg--mobile .cfg__panel-head { flex-direction: row; align-items: baseline; gap: 0.5rem; margin-bottom: 0.4rem; }
  .cfg--mobile .cfg__active-kicker { font-size: 0.58rem; }
  .cfg--mobile .cfg__active-name { font-size: clamp(1rem, 4.4vw, 1.25rem); }

  /* swatch row scrolls horizontally instead of wrapping; chips ≥44px */
  .cfg--mobile .cfg__swatches {
    flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch;
    padding-bottom: 0.35rem; scrollbar-width: none;
    scroll-snap-type: x proximity;
  }
  .cfg--mobile .cfg__swatches::-webkit-scrollbar { display: none; }
  .cfg--mobile .cfg__swatch { width: 42px; height: 42px; scroll-snap-align: start; }

  /* full-width, finger-friendly CTAs */
  .cfg--mobile .cfg__cta { gap: 0.6rem; margin-top: 0.55rem; }
  .cfg--mobile .cfg__cta-1 { width: 100%; justify-content: center; min-height: 44px; }
  .cfg--mobile .cfg__cta-wa { min-height: 44px; display: inline-flex; align-items: center; }

  /* ── closing "how it's made" beat ───────────────────────────────── */
  .cfg-make { background: #0d0b09; color: #fbf7f0; padding: clamp(4rem, 10vh, 8rem) 0; }
  .cfg-make__inner { max-width: 1100px; margin: 0 auto; padding: 0 clamp(1.4rem, 5vw, 3rem); }
  .cfg-make__head { max-width: 40ch; }
  .cfg-make__h { font-size: clamp(2rem, 4.6vw, 3.4rem); line-height: 1.02; margin: 0.4rem 0 0.8rem; color: #fbf7f0; }
  .cfg-make__lead { color: rgba(251,247,240,0.74); font-size: clamp(1rem, 1.3vw, 1.15rem); line-height: 1.6; }
  .cfg-make__grid { display: grid; grid-template-columns: repeat(3, 1fr);
    gap: clamp(1.4rem, 3vw, 2.6rem); margin-top: clamp(2.4rem, 5vh, 3.6rem); }
  .cfg-make__step { border-top: 1px solid rgba(251,247,240,0.16); padding-top: 1.2rem; }
  .cfg-make__num { display: block; font-size: 0.85rem; letter-spacing: 0.18em;
    color: var(--brass-2, #c8a972); margin-bottom: 0.7rem; }
  .cfg-make__step-t { font-size: 1.25rem; margin: 0 0 0.5rem; color: #fbf7f0; }
  .cfg-make__step-b { color: rgba(251,247,240,0.72); font-size: 0.98rem; line-height: 1.6; margin: 0; }
  .cfg-make__cta { margin-top: clamp(2.4rem, 5vh, 3.6rem); display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
  .cfg-make__cta-1 { display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; }
  .cfg-make__cta-wa { color: rgba(251,247,240,0.82); font-size: 0.95rem; text-decoration: none;
    border-bottom: 1px solid rgba(251,247,240,0.3); padding-bottom: 1px; transition: color 0.2s ease, border-color 0.2s ease; }
  .cfg-make__cta-wa:hover { color: #fbf7f0; border-color: var(--brass-2, #c8a972); }

  @media (max-width: 820px) {
    .cfg-make__grid { grid-template-columns: 1fr; gap: 1.6rem; }
  }
`;a.s(["default",0,function(){let{t:a,lang:r}=(0,g.useT)(),s=a=>o[a][r],t=(0,f.useReducedMotion)(),u=[.22,1,.36,1],v=`${j.WHATSAPP}?text=${encodeURIComponent(o.wa_msg[r])}`,w=(0,c.useRef)(null),x=(0,c.useRef)(null),y=(0,c.useRef)(null),[z,A]=(0,c.useState)(!1),[B,C]=(0,c.useState)(!1),[D,E]=(0,c.useState)(!1),[F,G]=(0,c.useState)(!1),[H,I]=(0,c.useState)(null),J=a=>{let b=H??m.SAFE_FRAME_EXT;return F?`/evora/config-frames-mobile/frame_${p(a)}.${b}`:`/evora/config-frames/frame_${p(a)}.${b}`};(0,c.useEffect)(()=>{let a=window.matchMedia("(max-width: 768px)"),b=()=>G(a.matches);return b(),a.addEventListener("change",b),()=>a.removeEventListener("change",b)},[]),(0,c.useEffect)(()=>{(0,m.resolveFrameExt)().then(I)},[]),(0,c.useEffect)(()=>{if(!H)return;let a=a=>"avif"===H?a.replace(/\.webp$/i,".avif"):a,b=new Set;for(let c of l)b.add(a(c.image)),/^\/evora\/configurator\/surface-[a-z0-9-]+\.webp$/.test(c.image)&&b.add(a(c.image.replace(/\.webp$/,"-mobile.webp")));let c=Array.from(b,a=>{let b=new Image;return b.decoding="async",b.src=a,b});return()=>{c.length=0}},[H]);let[K,L]=(0,c.useState)(l),[M,N]=(0,c.useState)(l[0].id),O=K.find(a=>a.id===M)??K[0];(0,c.useEffect)(()=>{let a=w.current,b=y.current;if(!a||!b||!H)return;let c=window.innerHeight,d=()=>{let a=x.current?.getBoundingClientRect();c=a&&a.height>0?a.height:window.innerHeight};d();let e=()=>{let b=a.getBoundingClientRect(),d=a.offsetHeight-c;return d>0?Math.min(1,Math.max(0,-b.top/d)):0},f=()=>Math.min(1,e()/.78),g=null,h=0,i=()=>{let c;if(!((c=a.getBoundingClientRect()).top<2*window.innerHeight&&c.bottom>-window.innerHeight)){h=window.setTimeout(i,200);return}g=(0,n.createFrameScrub)({container:b,frames:(0,n.budgetFrames)(169,J),className:"cfg__canvas",progress:f,reduce:!!t,onFirstFrame:()=>{A(!0),C(!0)}})};i();let j=0,k=!1,l=()=>{let a=e()>.8;a!==k&&(k=a,E(a)),j=requestAnimationFrame(l)};j=requestAnimationFrame(l);let m=()=>d();return window.addEventListener("resize",m),window.addEventListener("orientationchange",m),()=>{cancelAnimationFrame(j),window.removeEventListener("resize",m),window.removeEventListener("orientationchange",m),window.clearTimeout(h),g?.destroy()}},[t,H,F,169]);let P=O?.image===k||O?.id===l[0].id,Q=a=>"avif"===H?a.replace(/\.webp$/i,".avif"):a,R=Q(F&&O&&/^\/evora\/configurator\/surface-[a-z0-9-]+\.webp$/.test(O.image)?O.image.replace(/\.webp$/,"-mobile.webp"):O?.image??"")||O?.image,S=[{n:s("s1_n"),title:s("s1_t"),body:s("s1_b")},{n:s("s2_n"),title:s("s2_t"),body:s("s2_b")},{n:s("s3_n"),title:s("s3_t"),body:s("s3_b")}];return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("section",{id:"configurator",ref:w,className:`cfg ${F?"cfg--mobile":""}`,children:(0,b.jsxs)("div",{className:"cfg__sticky",ref:x,children:[(0,b.jsx)("div",{ref:y,className:`cfg__stage${B?" is-painted":""}`,role:"img","aria-label":a("cfg_aria")}),!B&&(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{media:"(max-width: 768px)",srcSet:`/evora/config-frames-mobile/frame_${p(169)}.${H??m.SAFE_FRAME_EXT}`}),(0,b.jsx)("img",{src:`/evora/config-frames/frame_${p(169)}.${H??m.SAFE_FRAME_EXT}`,alt:"",className:"cfg__poster","aria-hidden":!0})]}),(0,b.jsx)(d.AnimatePresence,{mode:"popLayout",children:D&&!P&&O&&(0,b.jsx)(e.motion.img,{src:R,alt:"",className:"cfg__variant",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.5,ease:u},onError:a=>{let b=a.currentTarget;O&&/-mobile\.(webp|avif)$/i.test(b.src)&&!b.dataset.fellback?(b.dataset.fellback="1",b.src=Q(O.image)):b.style.opacity="0"}},O.id)}),(0,b.jsx)("div",{className:"cfg__scrim"}),(0,b.jsxs)(e.motion.div,{className:"cfg__intro",animate:{opacity:+!D},transition:{duration:.4},children:[(0,b.jsx)("span",{className:"eyebrow",style:{color:"var(--brass-2)"},children:a("cfg_eyebrow")}),(0,b.jsx)("h2",{className:"display cfg__h",children:a("cfg_heading")}),(0,b.jsx)("p",{className:"cfg__lead",children:a("cfg_lead")})]}),(0,b.jsx)(d.AnimatePresence,{children:D&&(0,b.jsxs)(e.motion.div,{className:"cfg__panel",initial:{opacity:0,y:24},animate:{opacity:1,y:0},exit:{opacity:0,y:24},transition:{duration:.5,ease:u},children:[(0,b.jsx)("span",{className:"eyebrow cfg__panel-eyebrow",style:{color:"var(--brass-2)"},children:a("cfg_panel_eyebrow")}),(0,b.jsx)("p",{className:"cfg__instruct",children:s("cfg_instruct")}),(0,b.jsxs)("div",{className:"cfg__panel-head",children:[(0,b.jsx)("span",{className:"cfg__active-kicker",children:s("cfg_active_label")}),(0,b.jsx)(d.AnimatePresence,{mode:"wait",children:(0,b.jsx)(e.motion.strong,{className:"cfg__active-name",initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.3,ease:u},children:O?O.label[r]:""},O?O.id:"none")})]}),(0,b.jsx)(d.AnimatePresence,{mode:"wait",children:O&&O.note&&(0,b.jsx)(e.motion.p,{className:"cfg__note",initial:{opacity:0,y:6},animate:{opacity:1,y:0},exit:{opacity:0,y:-6},transition:{duration:.35,ease:u},children:O.note[r]},O.id)}),(0,b.jsxs)("div",{className:"cfg__swatches",children:[K.map(a=>{let c=a.swatch.startsWith("/")||a.swatch.startsWith("blob:")||a.swatch.startsWith("http");return(0,b.jsx)("button",{type:"button",className:`cfg__swatch ${M===a.id?"is-active":""}`,onClick:()=>N(a.id),"aria-label":a.label[r],"aria-pressed":M===a.id,title:a.label[r],style:c?{backgroundImage:`url(${a.swatch})`,backgroundSize:"cover"}:{background:a.swatch}},a.id)}),(0,b.jsxs)("label",{className:"cfg__swatch cfg__upload",title:"en"===r?"Upload an image":"ارفع صورة",children:[(0,b.jsx)("input",{type:"file",accept:"image/*",onChange:a=>{let b=a.target.files?.[0];if(!b)return;let c=URL.createObjectURL(b),d=`upload-${K.length}`,e=b.name.replace(/\.[^.]+$/,"");L(a=>[...a,{id:d,label:{en:e,ar:e},swatch:c,image:c}]),N(d),a.target.value=""},hidden:!0}),(0,b.jsx)("span",{children:"＋"})]})]}),(0,b.jsxs)("div",{className:"cfg__cta",children:[(0,b.jsxs)("button",{type:"button",className:"btn cfg__cta-1",onClick:i.openStartProject,children:[a("cfg_cta")," ",(0,b.jsx)("span",{className:"arrow",children:"→"})]}),(0,b.jsx)("a",{href:v,target:"_blank",rel:"noopener noreferrer",className:"cfg__cta-wa",children:s("wa")})]})]})})]})}),(0,b.jsx)("section",{className:"cfg-make",children:(0,b.jsxs)("div",{className:"cfg-make__inner",children:[(0,b.jsxs)(h.Rise,{as:"header",className:"cfg-make__head",children:[(0,b.jsx)("span",{className:"eyebrow",style:{color:"var(--brass-2)"},children:s("make_eyebrow")}),(0,b.jsx)("h2",{className:"display cfg-make__h",children:s("make_heading")}),(0,b.jsx)("p",{className:"cfg-make__lead",children:s("make_lead")})]}),(0,b.jsx)("div",{className:"cfg-make__grid",children:S.map((a,c)=>(0,b.jsxs)(h.Rise,{as:"article",delay:.08*(c+1),className:"cfg-make__step",children:[(0,b.jsx)("span",{className:"cfg-make__num",children:a.n}),(0,b.jsx)("h3",{className:"cfg-make__step-t",children:a.title}),(0,b.jsx)("p",{className:"cfg-make__step-b",children:a.body})]},a.n))}),(0,b.jsxs)(h.Rise,{className:"cfg-make__cta",delay:.34,children:[(0,b.jsxs)("button",{type:"button",className:"btn cfg-make__cta-1",onClick:i.openStartProject,children:[a("cfg_cta")," ",(0,b.jsx)("span",{className:"arrow",children:"→"})]}),(0,b.jsx)("a",{href:v,target:"_blank",rel:"noopener noreferrer",className:"cfg-make__cta-wa",children:s("wa")})]})]})}),(0,b.jsx)("style",{children:q})]})}],368196)}];

//# sourceMappingURL=components_ConfiguratorScroll_tsx_0s3yz0s._.js.map