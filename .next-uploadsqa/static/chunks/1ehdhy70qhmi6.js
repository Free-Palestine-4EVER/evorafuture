(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,236861,e=>{"use strict";var r=e.i(843476),a=e.i(271645),i=e.i(207761),s=e.i(997305),o=e.i(660613),t=e.i(801583),n=e.i(719381),l=e.i(846932),c=e.i(208673),p=e.i(88653);let d={Sofas:"الكنب",Seating:"الجلوس",Tables:"الطاولات",Storage:"التخزين",Bedroom:"غرف النوم"},m={New:"جديد",Bestseller:"الأكثر مبيعًا",Limited:"محدود"},h=(e,r)=>"ar"===r?d[e]:e;e.s(["default",0,function({seed:e}){let{t:d,lang:g}=(0,i.useT)(),u="en"===g,_=e?(0,o.getTaxNode)(e):null,v=e?(0,o.resolveSlug)(e):s.shopProducts,f=e?(0,o.normalizeSlug)(e):null,[x,b]=(0,a.useState)("all"),[w,k]=(0,a.useState)(""),[y,j]=(0,a.useState)("featured"),[N,z]=(0,a.useState)(null),[q,S]=(0,a.useState)(24),R=(0,a.useMemo)(()=>{let e=w.trim().toLowerCase(),r="all"===x?v:v.filter(e=>e.category===x);return e&&(r=r.filter(r=>{let a=(0,s.shopProductCopy)(r,"ar");return[r.name,r.tagline,r.category,r.description,r.materials.join(" "),a.tagline,a.description].join(" ").toLowerCase().includes(e)})),"az"===y&&(r=[...r].sort((e,r)=>e.name.localeCompare(r.name))),r},[x,w,y,v]),C=["all",...(0,o.categoriesIn)(v)],E=`${f??"all"}|${x}|${y}|${w}`;(0,a.useEffect)(()=>{S(24)},[E]);let T=R.slice(0,q),$=q<R.length,A=_&&"room"===_.kind?d("shop_rooms_eyebrow"):d("shop_page_eyebrow"),P=_?u?_.labelEN:_.labelAR:d("shop_page_title"),L=_?u?_.noteEN:_.noteAR:d("shop_page_sub"),X=0===v.length,B=_?`${t.WHATSAPP}?text=${encodeURIComponent(u?`Hi Evora! I'd love to see your ${_.labelEN} in the Khalda showroom.`:`مرحبًا إيفورا! أودّ أن أشاهد ${_.labelAR} في معرض خلدا.`)}`:t.WHATSAPP;return(0,r.jsxs)("section",{className:"section shop",style:{paddingTop:"clamp(7rem, 13vh, 10rem)"},children:[(0,r.jsxs)("div",{className:"container",children:[(0,r.jsxs)("div",{style:{maxWidth:760,marginBottom:"2.4rem"},children:[f&&(0,r.jsxs)(n.Rise,{as:"nav",className:"shop-crumbs",delay:.02,children:[(0,r.jsx)("a",{href:"/shop","data-cursor":"hover",children:d("shop_view_all")}),(0,r.jsx)("span",{"aria-hidden":!0,children:"·"}),(0,r.jsx)("a",{href:"/shop/rooms","data-cursor":"hover",children:d("shop_rooms_eyebrow")})]}),(0,r.jsx)(n.Rise,{as:"span",className:"eyebrow",style:{color:"var(--brass)",display:"block"},children:A}),(0,r.jsx)(n.RevealLines,{lines:[P],className:"display",style:{fontSize:"clamp(2.4rem, 6vw, 4.6rem)",margin:"1rem 0 0"}}),(0,r.jsx)(n.Rise,{delay:.12,children:(0,r.jsx)("p",{style:{color:"var(--ink-soft)",maxWidth:"52ch",marginTop:"1.2rem"},children:L})})]}),X?(0,r.jsx)(n.Rise,{delay:.1,children:(0,r.jsxs)("div",{className:"shop-enquire",children:[(0,r.jsxs)("div",{className:"shop-enquire-media",children:[_&&(0,r.jsx)("img",{src:_.image,alt:u?_.labelEN:_.labelAR,loading:"lazy"}),(0,r.jsx)("span",{className:"shop-enquire-scrim"})]}),(0,r.jsxs)("div",{className:"shop-enquire-body",children:[(0,r.jsx)("span",{className:"eyebrow",style:{color:"var(--brass)"},children:_?u?_.labelEN:_.labelAR:""}),(0,r.jsx)("p",{className:"shop-enquire-lead",children:d("shop_empty_enquire")}),(0,r.jsxs)("div",{className:"shop-enquire-cta",children:[(0,r.jsx)("a",{href:"/visit",className:"shop-enquire-btn shop-enquire-btn--dark","data-cursor":"hover",children:d("consult")}),(0,r.jsx)("a",{href:B,target:"_blank",rel:"noopener noreferrer",className:"shop-enquire-btn shop-enquire-btn--ghost","data-cursor":"hover",children:d("shop_showroom_cta")}),(0,r.jsxs)("a",{href:"/shop",className:"shop-enquire-link","data-cursor":"hover",children:[d("shop_view_all")," ",(0,r.jsx)("span",{"aria-hidden":!0,children:"→"})]})]})]})]})}):(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.Rise,{delay:.14,children:(0,r.jsxs)("div",{className:"shop-controls",children:[(0,r.jsxs)("label",{className:"shop-search","data-cursor":"hover",children:[(0,r.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7","aria-hidden":!0,children:[(0,r.jsx)("circle",{cx:"11",cy:"11",r:"7"}),(0,r.jsx)("path",{d:"M21 21l-4.3-4.3"})]}),(0,r.jsx)("input",{type:"search",value:w,onChange:e=>k(e.target.value),placeholder:d("shop_search_ph"),"aria-label":d("shop_search_ph")})]}),(0,r.jsxs)("label",{className:"shop-sort",children:[(0,r.jsx)("span",{children:d("shop_sort")}),(0,r.jsxs)("select",{value:y,onChange:e=>j(e.target.value),"data-cursor":"hover","aria-label":d("shop_sort"),children:[(0,r.jsx)("option",{value:"featured",children:d("shop_sort_featured")}),(0,r.jsx)("option",{value:"az",children:d("shop_sort_az")})]})]})]})}),(0,r.jsx)(n.Rise,{delay:.18,children:(0,r.jsxs)("div",{className:"shop-filters",role:"tablist",children:[C.map(e=>{let a=x===e,i="all"===e?d("shop_all"):h(e,g);return(0,r.jsxs)("a",{href:"all"===e?f?`/shop/${f}`:"/shop":`/shop/${o.CATEGORY_SLUG[e]}`,role:"tab","aria-selected":a,"data-cursor":"hover",className:`shop-tab ${a?"on":""}`,onClick:r=>((e,r)=>{0!==e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),b(r))})(r,e),children:[i,a&&(0,r.jsx)(l.motion.span,{layoutId:"shop-underline",className:"shop-tab-underline"})]},e)}),(0,r.jsxs)("span",{className:"shop-count",children:[R.length," ",d("shop_pieces")]})]})}),R.length>0?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.Stagger,{className:"shop-grid",gap:.045,children:T.map(e=>(0,r.jsx)(n.StaggerItem,{y:22,children:(0,r.jsxs)("button",{type:"button",className:"shop-card","data-cursor":"hover",onClick:()=>z(e),"aria-label":`${d("shop_quickview")} — ${e.name}`,children:[(0,r.jsxs)("div",{className:"shop-card-img",children:[(0,r.jsx)("img",{src:e.image,alt:e.name,loading:"lazy"}),e.badge&&(0,r.jsx)("span",{className:"shop-badge",children:"ar"===g?m[e.badge]:e.badge}),(0,r.jsxs)("span",{className:"shop-qv",children:[d("shop_quickview")," ",(0,r.jsx)("span",{"aria-hidden":!0,children:"↗"})]}),(0,r.jsx)("span",{className:"shop-wm","aria-hidden":!0})]}),(0,r.jsxs)("div",{className:"shop-card-meta",children:[(0,r.jsx)("div",{className:"shop-card-head",children:(0,r.jsx)("span",{className:"shop-cat",children:h(e.category,g)})}),(0,r.jsx)("h3",{className:"shop-name display",children:e.name}),(0,r.jsx)("p",{className:"shop-tag",children:(0,s.shopProductCopy)(e,g).tagline})]})]})},e.id))},E),$&&(0,r.jsx)("div",{className:"shop-more",children:(0,r.jsxs)("button",{type:"button",className:"shop-more-btn","data-cursor":"hover",onClick:()=>S(e=>e+24),children:[d("shop_load_more")," ",(0,r.jsxs)("span",{className:"shop-more-n",children:["(",R.length-q,")"]})]})})]}):(0,r.jsxs)("div",{className:"shop-empty",children:[(0,r.jsx)("p",{children:d("shop_no_results")}),(0,r.jsx)("button",{className:"shop-clear","data-cursor":"hover",onClick:()=>{k(""),b("all"),j("featured")},children:d("shop_clear")})]})]})]}),(0,r.jsx)(p.AnimatePresence,{children:N&&(0,r.jsx)(c.default,{product:N,onClose:()=>z(null)},N.id)}),(0,r.jsx)("style",{children:`
        .shop-crumbs { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.9rem; font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
        .shop-crumbs a { color: var(--ink-faint); transition: color .3s var(--ease); }
        .shop-crumbs a:hover { color: var(--ink); }

        .shop-controls { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; margin-bottom: 1.6rem; }
        .shop-search { display: inline-flex; align-items: center; gap: 0.6rem; flex: 1; min-width: 240px; max-width: 420px; padding: 0.7rem 1.05rem; border: 1px solid var(--line); border-radius: 100px; color: var(--ink-faint); background: var(--paper); transition: border-color .3s var(--ease); }
        .shop-search:focus-within { border-color: var(--ink); color: var(--ink); }
        .shop-search input { flex: 1; border: none; outline: none; background: none; font-family: var(--font-sans); font-size: 0.9rem; color: var(--ink); }
        .shop-search input::placeholder { color: var(--ink-faint); }
        .shop-sort { display: inline-flex; align-items: center; gap: 0.6rem; margin-inline-start: auto; font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
        .shop-sort select { font-family: var(--font-sans); font-size: 0.84rem; letter-spacing: 0; text-transform: none; color: var(--ink); background: var(--paper); border: 1px solid var(--line); border-radius: 100px; padding: 0.55rem 2.2rem 0.55rem 1rem; cursor: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a857c' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.85rem center; transition: border-color .3s var(--ease); }
        html[dir="rtl"] .shop-sort select { padding: 0.55rem 1rem 0.55rem 2.2rem; background-position: left 0.85rem center; }
        .shop-sort select:hover { border-color: var(--ink); }

        .shop-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 1.4rem; padding-bottom: 1.1rem; border-bottom: 1px solid var(--line); margin-bottom: 2.6rem; }
        .shop-tab { position: relative; background: none; border: none; cursor: none; font-family: var(--font-sans); font-size: 0.9rem; font-weight: 500; letter-spacing: 0.02em; color: var(--ink-faint); padding: 0.2rem 0; transition: color .3s var(--ease); text-decoration: none; }
        .shop-tab:hover { color: var(--ink); }
        .shop-tab.on { color: var(--ink); }
        .shop-tab-underline { position: absolute; left: 0; right: 0; bottom: -1.15rem; height: 2px; background: var(--brass); border-radius: 2px; }
        .shop-count { margin-inline-start: auto; font-size: 0.74rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); }

        .shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem 1.6rem; }
        .shop-card { display: block; width: 100%; text-align: start; background: none; border: none; padding: 0; cursor: none; font: inherit; color: inherit; }
        .shop-card-img { position: relative; aspect-ratio: 4/3; overflow: hidden; border-radius: 4px; background: var(--bone); }
        .shop-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s var(--ease); }
        .shop-card:hover .shop-card-img img { transform: scale(1.06); }
        .shop-badge { position: absolute; top: 0.8rem; inset-inline-start: 0.8rem; background: rgba(251,247,240,0.92); backdrop-filter: blur(6px); color: var(--ink); font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; padding: 0.35em 0.7em; border-radius: 100px; }
        .shop-qv { position: absolute; bottom: 0.8rem; inset-inline-start: 0.8rem; display: inline-flex; align-items: center; gap: 0.4rem; background: var(--ink); color: var(--paper); font-size: 0.72rem; font-weight: 500; padding: 0.55em 0.9em; border-radius: 100px; opacity: 0; transform: translateY(8px); transition: opacity .4s var(--ease), transform .4s var(--ease); }
        .shop-card:hover .shop-qv { opacity: 1; transform: translateY(0); }
        .shop-wm { position: absolute; bottom: 0.6rem; inset-inline-end: 0.6rem; width: 20px; height: 20px; background-color: rgba(255,255,255,0.94); -webkit-mask: url('/brand/evora-monogram.svg') center / contain no-repeat; mask: url('/brand/evora-monogram.svg') center / contain no-repeat; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4)); pointer-events: none; }
        .shop-card-meta { padding: 0.95rem 0.1rem 0; }
        .shop-card-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
        .shop-cat { font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-faint); }
        .shop-name { font-size: 1.35rem; margin: 0.35rem 0 0.15rem; color: var(--ink); }
        .shop-tag { font-size: 0.86rem; color: var(--ink-faint); margin: 0; }
        .shop-swatches { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.7rem; }
        .shop-swatch { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.12); box-shadow: inset 0 0 0 1.5px var(--paper); }
        .shop-swatch-n { margin-inline-start: 0.35rem; font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); }

        .shop-more { display: flex; justify-content: center; margin-top: clamp(2.4rem, 5vw, 3.6rem); }
        .shop-more-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: none; border: 1px solid var(--line); color: var(--ink); border-radius: 100px; padding: 0.85rem 1.8rem; font-size: 0.86rem; font-weight: 500; cursor: none; min-height: 44px; transition: border-color .3s var(--ease), background .3s var(--ease); }
        .shop-more-btn:hover { border-color: var(--ink); background: var(--bone); }
        .shop-more-n { color: var(--ink-faint); font-size: 0.8rem; }

        .shop-empty { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 5rem 0; text-align: center; color: var(--ink-faint); }
        .shop-empty p { font-family: var(--font-display); font-size: 1.4rem; color: var(--ink-soft); margin: 0; }
        .shop-clear { background: var(--ink); color: var(--paper); border: none; border-radius: 100px; padding: 0.75rem 1.4rem; font-size: 0.82rem; font-weight: 500; cursor: none; transition: background .3s var(--ease); }
        .shop-clear:hover { background: var(--ever); }

        /* enquire-in-showroom card (soft buckets: chandeliers, lighting, rugs, outdoor, kitchen) */
        .shop-enquire { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(1.4rem, 3vw, 3rem); align-items: stretch; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--bone); }
        .shop-enquire-media { position: relative; min-height: 320px; }
        .shop-enquire-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .shop-enquire-scrim { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(22,21,15,0.18), transparent 60%); }
        .shop-enquire-body { display: flex; flex-direction: column; justify-content: center; gap: 1.1rem; padding: clamp(1.8rem, 4vw, 3.4rem); }
        .shop-enquire-lead { font-family: var(--font-display); font-size: clamp(1.4rem, 2.6vw, 2rem); line-height: 1.3; color: var(--ink); margin: 0; }
        .shop-enquire-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.7rem; margin-top: 0.4rem; }
        .shop-enquire-btn { display: inline-flex; align-items: center; border-radius: 100px; padding: 0.8rem 1.4rem; font-size: 0.84rem; font-weight: 500; cursor: none; transition: background .3s var(--ease), color .3s var(--ease), border-color .3s var(--ease); }
        .shop-enquire-btn--dark { background: var(--ink); color: var(--paper); }
        .shop-enquire-btn--dark:hover { background: var(--ever); }
        .shop-enquire-btn--ghost { border: 1px solid var(--line); color: var(--ink); }
        .shop-enquire-btn--ghost:hover { border-color: var(--ink); }
        .shop-enquire-link { font-size: 0.82rem; font-weight: 500; color: var(--brass); cursor: none; }
        html[dir="rtl"] .shop-enquire-link span { display: inline-block; transform: scaleX(-1); }

        @media (max-width: 720px) { .shop-enquire { grid-template-columns: 1fr; } .shop-enquire-media { min-height: 220px; } .shop-enquire-btn { min-height: 44px; } }

        @media (max-width: 640px) {
          /* search + sort: full-width, 16px text so iOS doesn't zoom, ≥44px tap */
          .shop-controls { gap: 0.8rem; margin-bottom: 1.3rem; }
          .shop-search { max-width: none; flex-basis: 100%; min-height: 44px; }
          .shop-search input { font-size: 16px; }
          .shop-sort { margin-inline-start: 0; }
          .shop-sort select { font-size: 16px; min-height: 44px; }
          /* filter bar → edge-to-edge horizontally scrollable strip */
          .shop-filters { flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; gap: 1.3rem;
            -webkit-overflow-scrolling: touch; scrollbar-width: none;
            margin-inline: calc(-1 * var(--gut)); padding-inline: var(--gut); margin-bottom: 2.2rem; }
          .shop-filters::-webkit-scrollbar { display: none; }
          .shop-tab { flex: 0 0 auto; white-space: nowrap; min-height: 44px; display: inline-flex; align-items: center; }
          .shop-count { flex: 0 0 auto; margin-inline-start: 0.4rem; align-self: center; }
          /* the quick-view label is hover-only on desktop; reveal it on touch */
          .shop-qv { opacity: 1; transform: none; }
        }

        @media (max-width: 560px) { .shop-grid { grid-template-columns: 1fr 1fr; gap: 1.4rem 1rem; } .shop-name { font-size: 1.1rem; } }

        /* small phones: 2-col → a single generous, tap-friendly column */
        @media (max-width: 430px) {
          .shop-grid { grid-template-columns: 1fr; gap: 1.6rem; }
          .shop-name { font-size: 1.35rem; }
          .shop-card-img { aspect-ratio: 3/2; }
          .shop-clear { min-height: 44px; }
        }
      `})]})}])},657503,e=>{"use strict";var r=e.i(843476),a=e.i(271645),i=e.i(207761),s=e.i(431487),o=e.i(660613),t=e.i(846932),n=e.i(310542),l=e.i(895420),c=e.i(591994),p=e.i(772328),d=e.i(719381),m=e.i(851426);let h=[.22,1,.36,1];e.s(["default",0,function(){let{t:e,lang:g}=(0,i.useT)(),u="en"===g,_="ar"===g,v=(0,p.useReducedMotion)(),f=(0,a.useRef)(null),x=(0,a.useRef)(null),b=(0,a.useRef)(null),[w,k]=(0,a.useState)(!1),[y,j]=(0,a.useState)(0);(0,a.useEffect)(()=>{let e=()=>{let e=b.current,r=x.current;if(!e||!r)return;let a=Math.ceil(e.getBoundingClientRect().width),i=r.clientWidth;a<=0||i<=0||(j(Math.max(0,a-i)),a-i>24&&k(!0))};e();let r=new ResizeObserver(e);return b.current&&r.observe(b.current),x.current&&r.observe(x.current),window.addEventListener("resize",e),window.addEventListener("orientationchange",e),()=>{r.disconnect(),window.removeEventListener("resize",e),window.removeEventListener("orientationchange",e)}},[]);let{scrollYProgress:N}=(0,n.useScroll)({target:f}),z=(0,l.useTransform)(N,[.05,.95],[0,_?y:-y]),q=(0,c.useSpring)(z,{stiffness:90,damping:30,mass:.5}),S=v?z:q,R=(0,l.useTransform)(N,[.05,.95],[.04,1]),C=(0,r.jsxs)("div",{ref:b,className:"crail__track",children:[(0,r.jsx)("a",{href:"/showroom",className:"crail__card crail__feature","data-cursor":"hover",children:(0,r.jsxs)("div",{className:"crail__imgwrap crail__feature-media",children:[(0,r.jsx)(m.default,{className:"crail__video",src:"/evora/hero-c.mp4",preload:"metadata"}),(0,r.jsx)("span",{className:"crail__scrim"}),(0,r.jsx)("span",{className:"crail__feature-badge",children:e("col_film_badge")}),(0,r.jsxs)("div",{className:"crail__feature-cap",children:[(0,r.jsx)("span",{className:"crail__feature-t display",children:e("col_film_caption")}),(0,r.jsx)("span",{className:"crail__feature-arrow","aria-hidden":!0,children:"↗"})]})]})}),s.categories.map((e,a)=>(0,r.jsxs)("a",{href:`/shop/${(0,o.normalizeSlug)(e.id)}`,className:"crail__card","data-cursor":"hover",children:[(0,r.jsxs)("div",{className:"crail__imgwrap",children:[(0,r.jsx)("img",{src:e.img,alt:e.name[g],className:"crail__img",loading:"lazy"}),(0,r.jsx)("span",{className:"crail__scrim"}),(0,r.jsx)("span",{className:"crail__index",children:String(a+1).padStart(2,"0")})]}),(0,r.jsxs)("div",{className:"crail__meta",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{className:"crail__count",children:e.count[g]}),(0,r.jsx)("span",{className:"crail__name display",children:e.name[g]})]}),(0,r.jsx)("span",{className:"crail__arrow","aria-hidden":!0,children:"↗"})]})]},e.id)),(0,r.jsxs)("a",{href:"/shop",className:"crail__card crail__card--cta","data-cursor":"hover",children:[(0,r.jsx)("span",{className:"crail__cta-k",children:u?"Everything":"كل القطع"}),(0,r.jsx)("span",{className:"crail__cta-t display",children:u?"View the full catalogue":"تصفّح الكتالوج كاملًا"}),(0,r.jsx)("span",{className:"crail__cta-arrow","aria-hidden":!0,children:"→"})]})]});return(0,r.jsxs)("section",{ref:f,id:"categories",className:w?"crail crail--pin":"crail",style:w?{"--crail-travel":`${Math.round(y/1.5)}px`}:void 0,lang:g,children:[(0,r.jsxs)("div",{ref:x,className:w?"crail__stage crail__stage--pin":"crail__stage",children:[(0,r.jsxs)("div",{className:"container crail__head",children:[(0,r.jsxs)("div",{className:"crail__kick",children:[(0,r.jsx)(t.motion.span,{className:"crail__rule",initial:{scaleX:0},whileInView:{scaleX:1},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.9,ease:h}}),(0,r.jsx)(d.Rise,{as:"span",className:"eyebrow crail__eyebrow",children:u?"Shop by category":"تسوّق حسب الفئة"})]}),(0,r.jsx)(d.RevealLines,{lines:u?["Every piece,","every room."]:["كل قطعة،","لكل غرفة."],className:"display crail__title",delay:.06}),(0,r.jsx)(d.Rise,{delay:.12,as:"p",className:"crail__sub",children:u?"Ten worlds of furniture under one roof — slide through and step inside.":"عشرة عوالم من الأثاث تحت سقف واحد — مرّر وادخل."})]}),w?(0,r.jsx)(t.motion.div,{className:"crail__viewport",style:{x:S},children:C}):(0,r.jsx)("div",{className:"crail__viewport crail__viewport--swipe",children:C}),w&&(0,r.jsx)("div",{className:"container crail__progress",children:(0,r.jsx)(t.motion.span,{className:"crail__progressbar",style:{scaleX:R}})})]}),(0,r.jsx)("style",{children:`
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
      `})]})}])}]);