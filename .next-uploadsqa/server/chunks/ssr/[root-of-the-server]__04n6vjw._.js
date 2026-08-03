module.exports=[832319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},120635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},909270,(a,b,c)=>{"use strict";b.exports=a.r(342602).vendored.contexts.AppRouterContext},736313,(a,b,c)=>{"use strict";b.exports=a.r(342602).vendored.contexts.HooksClientContext},818341,(a,b,c)=>{"use strict";b.exports=a.r(342602).vendored.contexts.ServerInsertedHtml},18729,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(635577),e=a.i(482665),f=a.i(930697),g=a.i(346271),h=a.i(995180),i=a.i(901299),j=a.i(566535),k=a.i(621216),l=a.i(668222),m=a.i(408696);let n=[.22,1,.36,1];a.s(["default",0,function(){let{t:a,lang:o}=(0,d.useT)(),p="en"===o,q="ar"===o,r=(0,k.useReducedMotion)(),s=(0,c.useRef)(null),t=(0,c.useRef)(null),u=(0,c.useRef)(null),[v,w]=(0,c.useState)(!1),[x,y]=(0,c.useState)(0);(0,c.useEffect)(()=>{let a=()=>{let a=u.current,b=t.current;if(!a||!b)return;let c=Math.ceil(a.getBoundingClientRect().width),d=b.clientWidth;c<=0||d<=0||(y(Math.max(0,c-d)),c-d>24&&w(!0))};a();let b=new ResizeObserver(a);return u.current&&b.observe(u.current),t.current&&b.observe(t.current),window.addEventListener("resize",a),window.addEventListener("orientationchange",a),()=>{b.disconnect(),window.removeEventListener("resize",a),window.removeEventListener("orientationchange",a)}},[]);let{scrollYProgress:z}=(0,h.useScroll)({target:s}),A=(0,i.useTransform)(z,[.05,.95],[0,q?x:-x]),B=(0,j.useSpring)(A,{stiffness:90,damping:30,mass:.5}),C=r?A:B,D=(0,i.useTransform)(z,[.05,.95],[.04,1]),E=(0,b.jsxs)("div",{ref:u,className:"crail__track",children:[(0,b.jsx)("a",{href:"/showroom",className:"crail__card crail__feature","data-cursor":"hover",children:(0,b.jsxs)("div",{className:"crail__imgwrap crail__feature-media",children:[(0,b.jsx)(m.default,{className:"crail__video",src:"/evora/hero-c.mp4",preload:"metadata"}),(0,b.jsx)("span",{className:"crail__scrim"}),(0,b.jsx)("span",{className:"crail__feature-badge",children:a("col_film_badge")}),(0,b.jsxs)("div",{className:"crail__feature-cap",children:[(0,b.jsx)("span",{className:"crail__feature-t display",children:a("col_film_caption")}),(0,b.jsx)("span",{className:"crail__feature-arrow","aria-hidden":!0,children:"↗"})]})]})}),e.categories.map((a,c)=>(0,b.jsxs)("a",{href:`/shop/${(0,f.normalizeSlug)(a.id)}`,className:"crail__card","data-cursor":"hover",children:[(0,b.jsxs)("div",{className:"crail__imgwrap",children:[(0,b.jsx)("img",{src:a.img,alt:a.name[o],className:"crail__img",loading:"lazy"}),(0,b.jsx)("span",{className:"crail__scrim"}),(0,b.jsx)("span",{className:"crail__index",children:String(c+1).padStart(2,"0")})]}),(0,b.jsxs)("div",{className:"crail__meta",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("span",{className:"crail__count",children:a.count[o]}),(0,b.jsx)("span",{className:"crail__name display",children:a.name[o]})]}),(0,b.jsx)("span",{className:"crail__arrow","aria-hidden":!0,children:"↗"})]})]},a.id)),(0,b.jsxs)("a",{href:"/shop",className:"crail__card crail__card--cta","data-cursor":"hover",children:[(0,b.jsx)("span",{className:"crail__cta-k",children:p?"Everything":"كل القطع"}),(0,b.jsx)("span",{className:"crail__cta-t display",children:p?"View the full catalogue":"تصفّح الكتالوج كاملًا"}),(0,b.jsx)("span",{className:"crail__cta-arrow","aria-hidden":!0,children:"→"})]})]});return(0,b.jsxs)("section",{ref:s,id:"categories",className:v?"crail crail--pin":"crail",style:v?{"--crail-travel":`${Math.round(x/1.5)}px`}:void 0,lang:o,children:[(0,b.jsxs)("div",{ref:t,className:v?"crail__stage crail__stage--pin":"crail__stage",children:[(0,b.jsxs)("div",{className:"container crail__head",children:[(0,b.jsxs)("div",{className:"crail__kick",children:[(0,b.jsx)(g.motion.span,{className:"crail__rule",initial:{scaleX:0},whileInView:{scaleX:1},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.9,ease:n}}),(0,b.jsx)(l.Rise,{as:"span",className:"eyebrow crail__eyebrow",children:p?"Shop by category":"تسوّق حسب الفئة"})]}),(0,b.jsx)(l.RevealLines,{lines:p?["Every piece,","every room."]:["كل قطعة،","لكل غرفة."],className:"display crail__title",delay:.06}),(0,b.jsx)(l.Rise,{delay:.12,as:"p",className:"crail__sub",children:p?"Ten worlds of furniture under one roof — slide through and step inside.":"عشرة عوالم من الأثاث تحت سقف واحد — مرّر وادخل."})]}),v?(0,b.jsx)(g.motion.div,{className:"crail__viewport",style:{x:C},children:E}):(0,b.jsx)("div",{className:"crail__viewport crail__viewport--swipe",children:E}),v&&(0,b.jsx)("div",{className:"container crail__progress",children:(0,b.jsx)(g.motion.span,{className:"crail__progressbar",style:{scaleX:D}})})]}),(0,b.jsx)("style",{children:`
        .crail { position: relative; background: var(--paper); }
        /* One screen to stand in, plus however much page the row needs to get
           past. The vh line is the fallback; svh wins where it is supported and
           is what keeps the maths still on a phone, whose vh changes as the
           browser chrome hides and reappears mid-scroll. */
        .crail--pin {
          height: calc(100vh + var(--crail-travel, 0px));
          height: calc(100svh + var(--crail-travel, 0px));
        }
        .crail__stage { position: relative; padding-block: clamp(4rem, 9vw, 8rem); }
        .crail__stage--pin {
          position: sticky; top: 0; height: 100vh; height: 100svh;
          display: grid; grid-template-rows: auto minmax(0, 1fr) auto;
          align-content: center; gap: clamp(1rem, 2.4vh, 2rem);
          padding-block: clamp(1.4rem, 4vh, 2.8rem); overflow: hidden;
        }
        /* pinned: cards fill the middle row so nothing clips on short screens */
        .crail__stage--pin .crail__viewport { height: 100%; min-height: 0; display: flex; align-items: stretch; }
        .crail__stage--pin .crail__track { height: 100%; align-items: stretch; }
        .crail__stage--pin .crail__card { height: 100%; width: clamp(228px, 23vw, 320px); }
        .crail__stage--pin .crail__imgwrap { flex: 1 1 auto; min-height: 0; aspect-ratio: auto; }
        .crail__stage--pin .crail__meta { flex: 0 0 auto; }
        .crail__stage--pin .crail__feature { width: clamp(360px, 38vw, 640px); }
        /* keep the pinned header compact so the rail keeps its height */
        .crail__stage--pin .crail__head { margin-bottom: 0; }
        .crail__stage--pin .crail__title { font-size: clamp(1.9rem, 3.6vw, 3.2rem); margin-top: 0.7rem; }
        .crail__stage--pin .crail__sub { margin-top: 0.6rem; }
        @media (max-height: 840px) {
          .crail__stage--pin .crail__sub { display: none; }
        }

        .crail__head { margin-bottom: clamp(2rem, 4vw, 3.4rem); }
        .crail__kick { display: flex; align-items: center; gap: 1rem; }
        .crail__rule { display: block; width: 64px; height: 1px; background: var(--brass); transform-origin: left; flex-shrink: 0; }
        html[dir="rtl"] .crail__rule { transform-origin: right; }
        .crail__eyebrow { color: var(--brass); display: block; }
        .crail__title { font-size: clamp(2.4rem, 6vw, 5rem); line-height: 1.0; margin: 1rem 0 0; }
        .crail__sub { color: var(--ink-soft); max-width: 42ch; margin: 1rem 0 0; font-size: 0.98rem; }

        /* viewport + track */
        .crail__viewport { will-change: transform; }
        .crail__track {
          display: flex; gap: clamp(14px, 1.4vw, 22px);
          padding-inline: var(--gut);
          width: max-content;
        }
        .crail__viewport--swipe {
          overflow-x: auto; overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .crail__viewport--swipe::-webkit-scrollbar { display: none; }
        .crail__viewport--swipe .crail__card { scroll-snap-align: start; }

        .crail__card {
          position: relative; flex: 0 0 auto;
          width: clamp(248px, 26vw, 360px);
          display: flex; flex-direction: column;
        }
        .crail__imgwrap {
          position: relative; overflow: hidden; border-radius: 4px;
          aspect-ratio: 3 / 4;
        }
        .crail__img {
          width: 100%; height: 100%; object-fit: cover;
          transform: scale(1.03);
          transition: transform 1.1s var(--ease), filter 1.1s var(--ease);
          filter: saturate(0.98);
        }
        .crail__card:hover .crail__img { transform: scale(1.1); }
        .crail__scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 45%, rgba(16,15,13,0.5) 100%);
        }
        .crail__index {
          position: absolute; top: 0.9rem; inset-inline-start: 1rem;
          font-family: var(--font-display); font-size: 0.8rem;
          color: var(--paper); opacity: 0.85; letter-spacing: 0.1em;
        }
        .crail__meta {
          display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;
          padding: 1rem 0.2rem 0;
        }
        .crail__count {
          display: block; font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink-faint); margin-bottom: 5px;
        }
        html[dir="rtl"] .crail__count { letter-spacing: 0.06em; }
        .crail__name { font-size: clamp(1.25rem, 1.8vw, 1.6rem); color: var(--ink); line-height: 1.05; }
        .crail__arrow { color: var(--brass); font-size: 1.1rem; transition: transform .5s var(--ease); }
        .crail__card:hover .crail__arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .crail__arrow { transform: scaleX(-1); }
        html[dir="rtl"] .crail__card:hover .crail__arrow { transform: translate(-3px, -3px) scaleX(-1); }

        /* tail CTA card */
        .crail__card--cta {
          justify-content: center; align-items: flex-start; gap: 0.8rem;
          width: clamp(240px, 22vw, 320px);
          padding: 2rem clamp(1.4rem, 2vw, 2rem);
          border-radius: 4px;
          background: var(--ever);
          color: var(--paper);
          aspect-ratio: auto;
        }
        .crail__cta-k { font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass-2); }
        .crail__cta-t { font-size: clamp(1.5rem, 2.2vw, 2rem); color: var(--paper); line-height: 1.08; }
        .crail__cta-arrow { font-size: 1.4rem; color: var(--brass-2); transition: transform .5s var(--ease); }
        .crail__card--cta:hover .crail__cta-arrow { transform: translateX(6px); }
        html[dir="rtl"] .crail__cta-arrow { transform: scaleX(-1); }

        /* progress */
        .crail__progress { margin-top: clamp(1.6rem, 3vw, 2.6rem); }
        .crail__progressbar {
          display: block; height: 2px; width: 100%;
          background: var(--ink); transform-origin: left; border-radius: 2px;
        }
        html[dir="rtl"] .crail__progressbar { transform-origin: right; }

        /* lead feature — framed showroom film */
        .crail__feature-media { aspect-ratio: 4 / 5; }
        .crail__video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .crail__feature-badge {
          position: absolute; top: 0.9rem; inset-inline-start: 1rem; z-index: 2;
          background: rgba(251,247,240,0.92); color: var(--ink);
          font-family: var(--font-sans); font-size: 0.6rem; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 0.4em 0.75em; border-radius: 100px;
        }
        .crail__feature-cap {
          position: absolute; inset-inline: 1.1rem; bottom: 1rem; z-index: 2;
          display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;
          color: var(--paper);
        }
        .crail__feature-t { font-size: clamp(1.1rem, 1.7vw, 1.5rem); line-height: 1.2; max-width: 22ch; }
        .crail__feature-arrow { color: var(--brass-2); font-size: 1.3rem; transition: transform .5s var(--ease); }
        .crail__feature:hover .crail__feature-arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .crail__feature-arrow { transform: scaleX(-1); }

        @media (max-width: 880px) {
          .crail__viewport--swipe { padding-bottom: 0.5rem; }
          .crail__card { width: clamp(220px, 72vw, 300px); }
          .crail__feature { width: clamp(280px, 84vw, 420px); }
          .crail__track { padding-inline: var(--gut); }

          /* Pinned on a phone: the head has to give the row its height back,
             and the cards have to be narrow enough that more than one is on
             screen — at the desktop widths a single card filled the display and
             the pan read as a slideshow. */
          .crail__stage--pin { gap: clamp(0.8rem, 2vh, 1.4rem); padding-block: clamp(1rem, 3vh, 2rem); }
          .crail__stage--pin .crail__title { font-size: clamp(1.7rem, 7.4vw, 2.4rem); }
          .crail__stage--pin .crail__kick { gap: 0.7rem; }
          .crail__stage--pin .crail__rule { width: 36px; }
          .crail__stage--pin .crail__card { width: clamp(196px, 56vw, 260px); }
          .crail__stage--pin .crail__feature { width: clamp(232px, 68vw, 320px); }
          .crail__stage--pin .crail__progress { margin-top: clamp(0.9rem, 2vh, 1.6rem); }
        }
      `})]})}])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__04n6vjw._.js.map