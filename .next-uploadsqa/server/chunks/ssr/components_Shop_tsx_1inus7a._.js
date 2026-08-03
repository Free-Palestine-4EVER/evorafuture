module.exports=[744072,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(635577),e=a.i(525539),f=a.i(930697),g=a.i(936059),h=a.i(668222),i=a.i(346271),j=a.i(430499),k=a.i(262036);let l={Sofas:"الكنب",Seating:"الجلوس",Tables:"الطاولات",Storage:"التخزين",Bedroom:"غرف النوم"},m={New:"جديد",Bestseller:"الأكثر مبيعًا",Limited:"محدود"},n=(a,b)=>"ar"===b?l[a]:a;a.s(["default",0,function({seed:a}){let{t:l,lang:o}=(0,d.useT)(),p="en"===o,q=a?(0,f.getTaxNode)(a):null,r=a?(0,f.resolveSlug)(a):e.shopProducts,s=a?(0,f.normalizeSlug)(a):null,[t,u]=(0,c.useState)("all"),[v,w]=(0,c.useState)(""),[x,y]=(0,c.useState)("featured"),[z,A]=(0,c.useState)(null),[B,C]=(0,c.useState)(24),D=(0,c.useMemo)(()=>{let a=v.trim().toLowerCase(),b="all"===t?r:r.filter(a=>a.category===t);return a&&(b=b.filter(b=>{let c=(0,e.shopProductCopy)(b,"ar");return[b.name,b.tagline,b.category,b.description,b.materials.join(" "),c.tagline,c.description].join(" ").toLowerCase().includes(a)})),"az"===x&&(b=[...b].sort((a,b)=>a.name.localeCompare(b.name))),b},[t,v,x,r]),E=["all",...(0,f.categoriesIn)(r)],F=`${s??"all"}|${t}|${x}|${v}`;(0,c.useEffect)(()=>{C(24)},[F]);let G=D.slice(0,B),H=B<D.length,I=q&&"room"===q.kind?l("shop_rooms_eyebrow"):l("shop_page_eyebrow"),J=q?p?q.labelEN:q.labelAR:l("shop_page_title"),K=q?p?q.noteEN:q.noteAR:l("shop_page_sub"),L=0===r.length,M=q?`${g.WHATSAPP}?text=${encodeURIComponent(p?`Hi Evora! I'd love to see your ${q.labelEN} in the Khalda showroom.`:`مرحبًا إيفورا! أودّ أن أشاهد ${q.labelAR} في معرض خلدا.`)}`:g.WHATSAPP;return(0,b.jsxs)("section",{className:"section shop",style:{paddingTop:"clamp(7rem, 13vh, 10rem)"},children:[(0,b.jsxs)("div",{className:"container",children:[(0,b.jsxs)("div",{style:{maxWidth:760,marginBottom:"2.4rem"},children:[s&&(0,b.jsxs)(h.Rise,{as:"nav",className:"shop-crumbs",delay:.02,children:[(0,b.jsx)("a",{href:"/shop","data-cursor":"hover",children:l("shop_view_all")}),(0,b.jsx)("span",{"aria-hidden":!0,children:"·"}),(0,b.jsx)("a",{href:"/shop/rooms","data-cursor":"hover",children:l("shop_rooms_eyebrow")})]}),(0,b.jsx)(h.Rise,{as:"span",className:"eyebrow",style:{color:"var(--brass)",display:"block"},children:I}),(0,b.jsx)(h.RevealLines,{lines:[J],className:"display",style:{fontSize:"clamp(2.4rem, 6vw, 4.6rem)",margin:"1rem 0 0"}}),(0,b.jsx)(h.Rise,{delay:.12,children:(0,b.jsx)("p",{style:{color:"var(--ink-soft)",maxWidth:"52ch",marginTop:"1.2rem"},children:K})})]}),L?(0,b.jsx)(h.Rise,{delay:.1,children:(0,b.jsxs)("div",{className:"shop-enquire",children:[(0,b.jsxs)("div",{className:"shop-enquire-media",children:[q&&(0,b.jsx)("img",{src:q.image,alt:p?q.labelEN:q.labelAR,loading:"lazy"}),(0,b.jsx)("span",{className:"shop-enquire-scrim"})]}),(0,b.jsxs)("div",{className:"shop-enquire-body",children:[(0,b.jsx)("span",{className:"eyebrow",style:{color:"var(--brass)"},children:q?p?q.labelEN:q.labelAR:""}),(0,b.jsx)("p",{className:"shop-enquire-lead",children:l("shop_empty_enquire")}),(0,b.jsxs)("div",{className:"shop-enquire-cta",children:[(0,b.jsx)("a",{href:"/visit",className:"shop-enquire-btn shop-enquire-btn--dark","data-cursor":"hover",children:l("consult")}),(0,b.jsx)("a",{href:M,target:"_blank",rel:"noopener noreferrer",className:"shop-enquire-btn shop-enquire-btn--ghost","data-cursor":"hover",children:l("shop_showroom_cta")}),(0,b.jsxs)("a",{href:"/shop",className:"shop-enquire-link","data-cursor":"hover",children:[l("shop_view_all")," ",(0,b.jsx)("span",{"aria-hidden":!0,children:"→"})]})]})]})]})}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(h.Rise,{delay:.14,children:(0,b.jsxs)("div",{className:"shop-controls",children:[(0,b.jsxs)("label",{className:"shop-search","data-cursor":"hover",children:[(0,b.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7","aria-hidden":!0,children:[(0,b.jsx)("circle",{cx:"11",cy:"11",r:"7"}),(0,b.jsx)("path",{d:"M21 21l-4.3-4.3"})]}),(0,b.jsx)("input",{type:"search",value:v,onChange:a=>w(a.target.value),placeholder:l("shop_search_ph"),"aria-label":l("shop_search_ph")})]}),(0,b.jsxs)("label",{className:"shop-sort",children:[(0,b.jsx)("span",{children:l("shop_sort")}),(0,b.jsxs)("select",{value:x,onChange:a=>y(a.target.value),"data-cursor":"hover","aria-label":l("shop_sort"),children:[(0,b.jsx)("option",{value:"featured",children:l("shop_sort_featured")}),(0,b.jsx)("option",{value:"az",children:l("shop_sort_az")})]})]})]})}),(0,b.jsx)(h.Rise,{delay:.18,children:(0,b.jsxs)("div",{className:"shop-filters",role:"tablist",children:[E.map(a=>{let c=t===a,d="all"===a?l("shop_all"):n(a,o);return(0,b.jsxs)("a",{href:"all"===a?s?`/shop/${s}`:"/shop":`/shop/${f.CATEGORY_SLUG[a]}`,role:"tab","aria-selected":c,"data-cursor":"hover",className:`shop-tab ${c?"on":""}`,onClick:b=>((a,b)=>{0!==a.button||a.metaKey||a.ctrlKey||a.shiftKey||a.altKey||(a.preventDefault(),u(b))})(b,a),children:[d,c&&(0,b.jsx)(i.motion.span,{layoutId:"shop-underline",className:"shop-tab-underline"})]},a)}),(0,b.jsxs)("span",{className:"shop-count",children:[D.length," ",l("shop_pieces")]})]})}),D.length>0?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(h.Stagger,{className:"shop-grid",gap:.045,children:G.map(a=>(0,b.jsx)(h.StaggerItem,{y:22,children:(0,b.jsxs)("button",{type:"button",className:"shop-card","data-cursor":"hover",onClick:()=>A(a),"aria-label":`${l("shop_quickview")} — ${a.name}`,children:[(0,b.jsxs)("div",{className:"shop-card-img",children:[(0,b.jsx)("img",{src:a.image,alt:a.name,loading:"lazy"}),a.badge&&(0,b.jsx)("span",{className:"shop-badge",children:"ar"===o?m[a.badge]:a.badge}),(0,b.jsxs)("span",{className:"shop-qv",children:[l("shop_quickview")," ",(0,b.jsx)("span",{"aria-hidden":!0,children:"↗"})]}),(0,b.jsx)("span",{className:"shop-wm","aria-hidden":!0})]}),(0,b.jsxs)("div",{className:"shop-card-meta",children:[(0,b.jsx)("div",{className:"shop-card-head",children:(0,b.jsx)("span",{className:"shop-cat",children:n(a.category,o)})}),(0,b.jsx)("h3",{className:"shop-name display",children:a.name}),(0,b.jsx)("p",{className:"shop-tag",children:(0,e.shopProductCopy)(a,o).tagline})]})]})},a.id))},F),H&&(0,b.jsx)("div",{className:"shop-more",children:(0,b.jsxs)("button",{type:"button",className:"shop-more-btn","data-cursor":"hover",onClick:()=>C(a=>a+24),children:[l("shop_load_more")," ",(0,b.jsxs)("span",{className:"shop-more-n",children:["(",D.length-B,")"]})]})})]}):(0,b.jsxs)("div",{className:"shop-empty",children:[(0,b.jsx)("p",{children:l("shop_no_results")}),(0,b.jsx)("button",{className:"shop-clear","data-cursor":"hover",onClick:()=>{w(""),u("all"),y("featured")},children:l("shop_clear")})]})]})]}),(0,b.jsx)(k.AnimatePresence,{children:z&&(0,b.jsx)(j.default,{product:z,onClose:()=>A(null)},z.id)}),(0,b.jsx)("style",{children:`
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
      `})]})}])}];

//# sourceMappingURL=components_Shop_tsx_1inus7a._.js.map