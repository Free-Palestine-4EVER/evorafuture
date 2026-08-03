module.exports=[430499,a=>{"use strict";var b=a.i(187924),c=a.i(572131);a.i(262036);var d=a.i(346271),e=a.i(621216),f=a.i(525539),g=a.i(930697),h=a.i(936059),i=a.i(922723),j=a.i(635577);let k={Sofas:"الكنب",Seating:"الجلوس",Tables:"الطاولات",Storage:"التخزين",Bedroom:"غرف النوم"},l={New:"جديد",Bestseller:"الأكثر مبيعًا",Limited:"محدود"};a.s(["default",0,function({product:a,onClose:m}){let n,{t:o,lang:p}=(0,j.useT)(),q="en"===p,r=(0,e.useReducedMotion)(),[s,t]=(0,c.useState)(a),u=(0,c.useRef)(null);(0,c.useEffect)(()=>t(a),[a]),(0,c.useEffect)(()=>{u.current?.scrollTo({top:0})},[s.id]),(0,c.useEffect)(()=>{let a=document.body.style.overflow;document.body.style.overflow="hidden";let b=a=>"Escape"===a.key&&m();return window.addEventListener("keydown",b),()=>{document.body.style.overflow=a,window.removeEventListener("keydown",b)}},[m]);let v=(0,f.shopProductCopy)(s,p),w=(0,g.completeTheRoom)(s),x=`/shop/${g.CATEGORY_SLUG[s.category]}`,y=`${h.WHATSAPP}?text=${encodeURIComponent(q?`Hi Evora! I'd love to enquire about the ${s.name} (${s.tagline}).`:`مرحبًا إيفورا! أودّ الاستفسار عن ${s.name} (${v.tagline}).`)}`;return(0,b.jsxs)(d.motion.div,{className:"qv-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},onClick:m,children:[(0,b.jsxs)(d.motion.div,{className:"qv",initial:r?{opacity:0}:{y:40,opacity:0,scale:.985},animate:{y:0,opacity:1,scale:1},exit:r?{opacity:0}:{y:28,opacity:0,scale:.99},transition:{type:"spring",stiffness:250,damping:30},onClick:a=>a.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":s.name,children:[(0,b.jsx)("button",{className:"qv-close",onClick:m,"aria-label":o("qv_close"),children:(0,b.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",children:(0,b.jsx)("path",{d:"M1 1l16 16M17 1L1 17",stroke:"currentColor",strokeWidth:"1.6"})})}),(0,b.jsxs)("div",{className:"qv-stage",children:[(0,b.jsx)("img",{src:s.image,alt:s.name,className:"qv-stage-img"},s.id),(0,b.jsx)("span",{className:"qv-wm","aria-hidden":!0})]}),(0,b.jsxs)("div",{className:"qv-info",children:[(0,b.jsxs)("div",{className:"qv-scroll",ref:u,children:[s.badge&&(0,b.jsx)("span",{className:"qv-tag",children:"ar"===p?l[s.badge]:s.badge}),(0,b.jsx)("span",{className:"eyebrow qv-cat",children:(n=s.category,"ar"===p?k[n]:n)}),(0,b.jsx)("h2",{className:"display qv-name",children:s.name}),(0,b.jsx)("p",{className:"qv-tagline",children:v.tagline}),(0,b.jsx)("p",{className:"qv-desc",children:v.description}),(0,b.jsxs)("dl",{className:"qv-specs",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("dt",{children:o("qv_dims")}),(0,b.jsxs)("dd",{children:[s.dimensions.w," × ",s.dimensions.d," ×"," ",s.dimensions.h," cm"]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("dt",{children:o("qv_materials")}),(0,b.jsx)("dd",{children:s.materials.join(" · ")})]})]}),w.length>0&&(0,b.jsxs)("div",{className:"qv-similar",children:[(0,b.jsxs)("div",{className:"qv-similar-head",children:[(0,b.jsx)("span",{className:"qv-label",style:{marginBottom:0},children:o("shop_similar")}),(0,b.jsxs)("a",{href:x,className:"qv-viewall","data-cursor":"hover",children:[o("shop_view_all")," ",(0,b.jsx)("span",{"aria-hidden":!0,children:"→"})]})]}),(0,b.jsx)("div",{className:"qv-similar-row",children:w.map(a=>(0,b.jsxs)("button",{type:"button",className:"qv-mini","data-cursor":"hover",onClick:()=>t(a),"aria-label":a.name,children:[(0,b.jsxs)("span",{className:"qv-mini-img",children:[(0,b.jsx)("img",{src:a.image,alt:a.name,loading:"lazy"}),(0,b.jsx)("span",{className:"qv-mini-wm","aria-hidden":!0})]}),(0,b.jsx)("span",{className:"qv-mini-name display",children:a.name}),(0,b.jsx)("span",{className:"qv-mini-tag",children:(0,f.shopProductCopy)(a,p).tagline})]},a.id))})]})]}),(0,b.jsxs)("div",{className:"qv-foot",children:[(0,b.jsxs)("div",{className:"qv-cta",children:[(0,b.jsx)("button",{type:"button",onClick:i.openStartProject,className:"qv-btn qv-btn-dark","data-cursor":"hover",children:o("shop_add_design")}),(0,b.jsx)("a",{href:y,target:"_blank",rel:"noopener noreferrer",className:"qv-btn qv-btn-ghost","data-cursor":"hover",children:o("shop_enquire")})]}),(0,b.jsx)("div",{className:"qv-cta-sub",children:(0,b.jsx)("a",{href:"/visit",className:"qv-link","data-cursor":"hover",children:o("shop_showroom_cta")})})]})]})]}),(0,b.jsx)("style",{children:`
        .qv-overlay { position: fixed; inset: 0; z-index: 120; display: grid; place-items: center; padding: clamp(0.8rem, 3vw, 2.4rem); background: rgba(28,24,21,0.46); backdrop-filter: blur(10px) saturate(1.1); }
        .qv { position: relative; display: grid; grid-template-columns: 1.05fr 0.95fr; width: min(1040px, 100%); max-height: min(90vh, 760px); background: var(--paper, #fbf9f4); border: 1px solid var(--line-soft, rgba(0,0,0,0.08)); border-radius: 10px; overflow: hidden; box-shadow: 0 50px 120px -40px rgba(0,0,0,0.55); }
        .qv-close { position: absolute; top: 0.9rem; inset-inline-end: 0.9rem; z-index: 10; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--line, rgba(0,0,0,0.12)); background: rgba(251,249,244,0.8); backdrop-filter: blur(6px); color: var(--ink, #1c1815); cursor: none; transition: background .3s var(--ease), transform .3s var(--ease); }
        .qv-close:hover { background: var(--ink, #1c1815); color: var(--paper, #fbf9f4); transform: rotate(90deg); }

        .qv-stage { position: relative; background: linear-gradient(165deg, #fff, var(--bone, #efe9dd)); border-inline-end: 1px solid var(--line-soft, rgba(0,0,0,0.07)); min-height: 340px; overflow: hidden; }
        .qv-stage-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 1.4rem; box-sizing: border-box; }
        .qv-wm { position: absolute; bottom: 1rem; inset-inline-end: 1rem; width: 26px; height: 26px; background-color: rgba(255,255,255,0.94); -webkit-mask: url('/brand/evora-monogram.svg') center / contain no-repeat; mask: url('/brand/evora-monogram.svg') center / contain no-repeat; filter: drop-shadow(0 1px 4px rgba(0,0,0,0.4)); pointer-events: none; }

        .qv-info { display: flex; flex-direction: column; min-height: 0; }
        .qv-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: clamp(1.6rem, 3vw, 2.6rem); padding-bottom: 1rem; }
        .qv-tag { display: inline-block; background: var(--brass, #a98445); color: #fff; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; padding: 0.35em 0.7em; border-radius: 100px; margin-bottom: 0.9rem; }
        .qv-cat { display: block; color: var(--brass, #a98445); }
        .qv-name { font-size: clamp(2rem, 4vw, 2.9rem); margin: 0.5rem 0 0.3rem; color: var(--ink, #1c1815); }
        .qv-tagline { color: var(--ink-faint, #8a857c); font-size: 0.92rem; margin: 0 0 1.1rem; }
        .qv-desc { color: var(--ink-soft, #4a463f); line-height: 1.65; font-size: 0.92rem; margin: 0 0 1.6rem; }

        .qv-finish { margin-bottom: 1.6rem; }
        .qv-label { display: block; font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint, #8a857c); margin-bottom: 0.7rem; }
        .qv-dots { display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .qv-swatch { width: 30px; height: 30px; border-radius: 50%; cursor: none; border: 1px solid rgba(0,0,0,0.12); box-shadow: inset 0 0 0 2px var(--paper, #fbf9f4); transition: transform .25s var(--ease), box-shadow .25s var(--ease); }
        .qv-swatch:hover { transform: scale(1.1); }
        .qv-swatch.on { box-shadow: inset 0 0 0 2px var(--paper, #fbf9f4), 0 0 0 2px var(--ink, #1c1815); }

        .qv-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.4rem; margin: 0; padding-top: 1.2rem; border-top: 1px solid var(--line, rgba(0,0,0,0.1)); }
        .qv-specs dt { font-size: 0.64rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint, #8a857c); margin-bottom: 0.3rem; }
        .qv-specs dd { margin: 0; font-size: 0.9rem; color: var(--ink, #1c1815); }

        /* Complete the room */
        .qv-similar { margin-top: 1.6rem; padding-top: 1.3rem; border-top: 1px solid var(--line, rgba(0,0,0,0.1)); }
        .qv-similar-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 0.9rem; }
        .qv-viewall { font-size: 0.74rem; font-weight: 500; letter-spacing: 0.04em; color: var(--brass, #a98445); cursor: none; white-space: nowrap; }
        html[dir="rtl"] .qv-viewall span { display: inline-block; transform: scaleX(-1); }
        .qv-similar-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.9rem; }
        .qv-mini { display: block; text-align: start; background: none; border: none; padding: 0; cursor: none; font: inherit; color: inherit; }
        .qv-mini-img { display: block; position: relative; aspect-ratio: 4/3; overflow: hidden; border-radius: 4px; background: var(--bone, #efe9dd); }
        .qv-mini-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .9s var(--ease); }
        .qv-mini-wm { position: absolute; bottom: 0.35rem; inset-inline-end: 0.35rem; width: 14px; height: 14px; background-color: rgba(255,255,255,0.94); -webkit-mask: url('/brand/evora-monogram.svg') center / contain no-repeat; mask: url('/brand/evora-monogram.svg') center / contain no-repeat; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4)); pointer-events: none; }
        .qv-mini:hover .qv-mini-img img { transform: scale(1.07); }
        .qv-mini-name { display: block; font-size: 1.05rem; color: var(--ink, #1c1815); margin: 0.5rem 0 0.1rem; }
        .qv-mini-tag { display: block; font-size: 0.76rem; color: var(--ink-faint, #8a857c); }
        .qv-mini-swatches { display: flex; align-items: center; gap: 0.3rem; margin-top: 0.45rem; }
        .qv-mini-swatch { width: 11px; height: 11px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.12); box-shadow: inset 0 0 0 1.5px var(--paper, #fbf9f4); }
        .qv-mini-finish { margin-inline-start: 0.3rem; font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint, #8a857c); }

        .qv-foot { border-top: 1px solid var(--line, rgba(0,0,0,0.1)); padding: 1.1rem clamp(1.6rem, 3vw, 2.6rem); display: flex; flex-direction: column; gap: 0.8rem; background: var(--paper, #fbf9f4); }
        .qv-cta { display: flex; gap: 0.6rem; }
        .qv-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 100px; padding: 0.8rem 1.3rem; font-size: 0.82rem; font-weight: 500; cursor: none; white-space: nowrap; font-family: inherit; transition: background .3s var(--ease), color .3s var(--ease), border-color .3s var(--ease); }
        .qv-btn-dark { flex: 1; background: var(--ink, #1c1815); color: var(--paper, #fbf9f4); border: none; }
        .qv-btn-dark:hover { background: var(--ever, #2c3626); }
        .qv-btn-ghost { flex: 1; border: 1px solid var(--line, rgba(0,0,0,0.18)); color: var(--ink, #1c1815); background: none; }
        .qv-btn-ghost:hover { border-color: var(--ink, #1c1815); }
        .qv-cta-sub { display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; color: var(--ink-faint, #8a857c); font-size: 0.78rem; }
        .qv-link { color: var(--ink-soft, #4a463f); cursor: none; transition: color .3s var(--ease); }
        .qv-link:hover { color: var(--brass, #a98445); }

        @media (max-width: 820px) {
          /* full-screen bottom sheet, docked to the bottom edge of the viewport */
          .qv-overlay { padding: 0; place-items: end stretch; }
          .qv { grid-template-columns: 1fr; grid-template-rows: 46dvh minmax(0, 1fr);
            width: 100%; max-width: 100%; max-height: 92dvh;
            border-radius: 18px 18px 0 0; }
          .qv-stage { border-inline-end: none; border-bottom: 1px solid var(--line-soft, rgba(0,0,0,0.07)); min-height: 0; }
          .qv-close { width: 44px; height: 44px; top: 0.7rem; inset-inline-end: 0.7rem; }
          /* finish swatches — chunky and tap-friendly */
          .qv-dots { gap: 0.7rem; }
          .qv-swatch { width: 44px; height: 44px; }
          /* Complete the room → a swipeable, snapping horizontal rail */
          .qv-similar-row { display: flex; gap: 0.9rem; overflow-x: auto; overflow-y: hidden;
            -webkit-overflow-scrolling: touch; scrollbar-width: none; scroll-snap-type: x mandatory;
            margin-inline: calc(-1 * clamp(1.6rem, 3vw, 2.6rem)); padding-inline: clamp(1.6rem, 3vw, 2.6rem);
            padding-bottom: 0.3rem; }
          .qv-similar-row::-webkit-scrollbar { display: none; }
          .qv-mini { flex: 0 0 62%; max-width: 240px; scroll-snap-align: start; }
          /* footer clears the home indicator; CTAs stay ≥44px */
          .qv-foot { padding-bottom: calc(1.1rem + env(safe-area-inset-bottom)); }
          .qv-btn { min-height: 48px; }
        }
        @media (max-width: 480px) {
          .qv-cta { flex-direction: column; }
        }
      `})]})}])},408696,a=>{"use strict";var b=a.i(187924),c=a.i(572131);a.s(["default",0,function({src:a,poster:d,className:e,style:f,...g}){let[h,i]=(0,c.useState)(a),j=(0,c.useRef)(!1),[k,l]=(0,c.useState)(!1),m=(0,c.useRef)(null);(0,c.useEffect)(()=>{j.current=!1,i(a)},[a]),(0,c.useEffect)(()=>{let a=m.current;if(!a)return;let b=new IntersectionObserver(([b])=>{b.isIntersecting?(l(!0),a.play().catch(()=>{})):a.pause()},{rootMargin:"800px 0px"});return b.observe(a),()=>b.disconnect()},[]),(0,c.useEffect)(()=>{k&&m.current?.play().catch(()=>{})},[k,h]);let n={width:"100%",height:"100%",objectFit:"cover",display:"block",...f};return(0,b.jsx)("video",{...g,ref:m,className:e,style:n,src:k?h:void 0,poster:k?d:void 0,onError:()=>{j.current||h===a||(j.current=!0,i(a))},autoPlay:k,muted:!0,loop:!0,playsInline:!0,preload:k?"auto":"none"})}])},569743,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(635577),e=a.i(525539),f=a.i(430499),g=a.i(262036),h=a.i(668222);let i={New:"جديد",Bestseller:"الأكثر مبيعًا",Limited:"محدود"},j=["sofa-01","table-01","bedroom-01"].map(a=>e.shopProducts.find(b=>b.id===a)).filter(a=>!!a);function k({product:a,onOpen:c}){let{lang:f}=(0,d.useT)(),g=(0,e.shopProductCopy)(a,f).tagline;return(0,b.jsxs)("button",{className:"feat-card",onClick:c,"data-cursor":"hover","aria-label":`${a.name} — ${g}`,children:[(0,b.jsxs)("div",{className:"feat-stage",children:[a.badge&&(0,b.jsx)("span",{className:"feat-badge",children:"ar"===f?i[a.badge]:a.badge}),(0,b.jsx)("img",{src:a.image,alt:a.name,className:"feat-img",loading:"lazy"}),(0,b.jsx)("span",{className:"feat-wm","aria-hidden":!0}),(0,b.jsx)("span",{className:"feat-look",children:"↗"})]}),(0,b.jsxs)("div",{className:"feat-meta",children:[(0,b.jsx)("h3",{className:"display feat-name",children:a.name}),(0,b.jsx)("p",{className:"feat-tag",children:g})]})]})}a.s(["default",0,function(){let{lang:a}=(0,d.useT)(),[e,i]=(0,c.useState)(null);return(0,b.jsxs)("section",{className:"feat",children:[(0,b.jsxs)("div",{className:"container",children:[(0,b.jsxs)("div",{className:"feat-intro",children:[(0,b.jsx)(h.Rise,{as:"span",className:"eyebrow",style:{color:"var(--brass)",display:"block"},children:"ar"===a?"قطع مميّزة":"Signature pieces"}),(0,b.jsx)(h.RevealLines,{lines:["ar"===a?"أعمالنا الأكثر طلبًا.":"Our most-loved pieces."],className:"display feat-title"}),(0,b.jsx)(h.Rise,{delay:.12,children:(0,b.jsx)("p",{className:"feat-sub",children:"ar"===a?"ثلاث قطعٍ توضّح لغة إيفورا — لون واحد، خطٌّ واحد، وحرفةٌ لا تُخطئها العين.":"Three pieces that sum up the Evora language — one colour, one line, craft you can spot from across the room."})})]}),(0,b.jsx)("div",{className:"feat-grid",children:j.map(a=>(0,b.jsx)(k,{product:a,onOpen:()=>i(a)},a.id))})]}),(0,b.jsx)(g.AnimatePresence,{children:e&&(0,b.jsx)(f.default,{product:e,onClose:()=>i(null)},e.id)}),(0,b.jsx)("style",{children:`
        .feat { position: relative; background: linear-gradient(180deg, var(--ever, #2c3626), #222a1e); color: var(--paper, #fbf9f4); padding: clamp(5rem, 10vh, 8rem) 0 clamp(4rem, 8vh, 6rem); }
        .feat-intro { max-width: 680px; margin-bottom: clamp(2.4rem, 5vw, 3.6rem); }
        .feat-title { font-size: clamp(2.2rem, 5.5vw, 4.2rem); margin: 0.8rem 0 0; color: var(--paper, #fbf9f4); }
        .feat-sub { color: rgba(251,249,244,0.7); max-width: 50ch; margin-top: 1.1rem; line-height: 1.6; }

        .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.2rem, 2.5vw, 2rem); }
        .feat-card { display: flex; flex-direction: column; text-align: start; background: none; border: none; padding: 0; cursor: none; font: inherit; color: inherit; }
        .feat-stage { position: relative; width: 100%; aspect-ratio: 4/5; border-radius: 8px; overflow: hidden; background: linear-gradient(165deg, #fcfbf8, #ece6da); box-shadow: 0 40px 80px -50px rgba(0,0,0,0.6); }
        .feat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s var(--ease); }
        .feat-card:hover .feat-img { transform: scale(1.06); }
        .feat-badge { position: absolute; top: 1rem; inset-inline-start: 1rem; z-index: 4; background: var(--brass, #a98445); color: #fff; font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; padding: 0.4em 0.8em; border-radius: 100px; }
        .feat-wm { position: absolute; bottom: 1rem; inset-inline-end: 1rem; z-index: 4; width: 26px; height: 26px; background-color: rgba(255,255,255,0.94); -webkit-mask: url('/brand/evora-monogram.svg') center / contain no-repeat; mask: url('/brand/evora-monogram.svg') center / contain no-repeat; filter: drop-shadow(0 1px 4px rgba(0,0,0,0.4)); pointer-events: none; }
        .feat-look { position: absolute; bottom: 1rem; inset-inline-end: 1rem; z-index: 4; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; background: var(--ink, #1c1815); color: var(--paper, #fbf9f4); font-size: 1rem; opacity: 0; transform: translateY(8px); transition: opacity .35s var(--ease), transform .35s var(--ease); }
        .feat-stage:hover .feat-look { opacity: 1; transform: translateY(0); }

        .feat-meta { padding-top: 1.1rem; }
        .feat-name { font-size: clamp(1.4rem, 2.2vw, 1.9rem); margin: 0; color: var(--paper, #fbf9f4); }
        .feat-tag { font-size: 0.84rem; color: rgba(251,249,244,0.6); margin: 0.2rem 0 0; }
        .feat-dots { display: flex; gap: 0.5rem; margin-top: 1rem; }
        .feat-swatch { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); box-shadow: inset 0 0 0 1.5px #222a1e; }

        @media (max-width: 900px) { .feat-grid { grid-template-columns: 1fr; max-width: 460px; } .feat-stage { aspect-ratio: 1/1; } }

        @media (max-width: 640px) {
          /* the look icon is hover-only on desktop; reveal it on touch */
          .feat-look { opacity: 1; transform: none; }
        }
      `})]})}])}];

//# sourceMappingURL=components_0q5zbt8._.js.map