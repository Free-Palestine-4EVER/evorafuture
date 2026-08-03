(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,871522,e=>{"use strict";var r=e.i(843476),a=e.i(271645);let t={ink:"var(--ink)",paper:"var(--paper)",brass:"var(--brass-2)"};e.s(["default",0,function({tone:e,tagline:s=!0,draw:o=!1,drawMs:i=900,title:n="EVORA — Future Home",className:l,style:p}){let d=(0,a.useId)().replace(/[:]/g,""),c=e?t[e]:"currentColor";return(0,r.jsxs)("svg",{viewBox:s?"0 0 730 316":"0 0 730 186",role:"img","aria-label":n,className:l,style:{display:"block",color:c,overflow:"visible",...p},"data-draw":o?"on":void 0,children:[(0,r.jsx)("title",{children:n}),o&&(0,r.jsx)("style",{children:`
          [data-draw="on"] .ev-p {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: ev-draw-${d} ${i}ms cubic-bezier(0.22,1,0.36,1) forwards;
          }
          @keyframes ev-draw-${d} { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) {
            [data-draw="on"] .ev-p { stroke-dasharray: none; stroke-dashoffset: 0; animation: none; }
          }
        `}),(0,r.jsxs)("g",{fill:"none",stroke:c,strokeWidth:15,strokeLinecap:"square",strokeLinejoin:"miter",children:[(0,r.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 28 L30 158"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 28 L118 28"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 93 L104 93"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 158 L118 158"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,d:"M152 28 L214 158 L276 28"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,d:"M363 28 A65 65 0 0 1 363 158 A65 65 0 0 1 363 28 Z"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,d:"M452 28 L452 158"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,d:"M452 28 L512 28 A33 33 0 0 1 512 94 L452 94"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,d:"M502 94 L548 158"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,d:"M580 158 L640 28 L700 158"})]}),s&&(0,r.jsxs)("g",{transform:"translate(178 222)",fill:"none",stroke:c,strokeWidth:7,strokeLinecap:"square",strokeLinejoin:"miter",children:[(0,r.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(0 0)",d:"M0 0 L0 30 M0 0 L20 0 M0 14 L16 14"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(34 0)",d:"M0 0 L0 19 A11 11 0 0 0 22 19 L22 0"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(70 0)",d:"M0 0 L24 0 M12 0 L12 30"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(108 0)",d:"M0 0 L0 19 A11 11 0 0 0 22 19 L22 0"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(144 0)",d:"M0 0 L0 30 M0 0 L16 0 A8 8 0 0 1 16 16 L0 16 M11 16 L22 30"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(180 0)",d:"M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(244 0)",d:"M0 0 L0 30 M22 0 L22 30 M0 15 L22 15"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(280 0)",d:"M12 0 A12 15 0 0 1 12 30 A12 15 0 0 1 12 0 Z"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(318 0)",d:"M0 30 L0 0 L12 18 L24 0 L24 30"}),(0,r.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(356 0)",d:"M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30"})]})]})}])},772328,e=>{"use strict";var r=e.i(571164),a=e.i(138544),t=e.i(271645);e.s(["useReducedMotion",0,function(){r.hasReducedMotionListener.current||(0,a.initPrefersReducedMotion)();let[e]=(0,t.useState)(r.prefersReducedMotion.current);return e}])},801583,e=>{"use strict";e.s(["FOLLOWERS",0,"103K","HOMES",0,"2,400+","PHONE_PRIMARY",0,"+962 79 130 1444","PHONE_PRIMARY_TEL",0,"+962791301444","PHONE_SECONDARY",0,"+962 79 636 4105","WHATSAPP",0,"https://wa.me/962796364105"])},618566,(e,r,a)=>{r.exports=e.r(976562)},88653,e=>{"use strict";e.i(247167);var r=e.i(843476),a=e.i(271645),t=e.i(231178),s=e.i(947414),o=e.i(674008),i=e.i(821476),n=e.i(772846),l=a,p=e.i(737806);function d(e,r){if("function"==typeof e)return e(r);null!=e&&(e.current=r)}class c extends l.Component{getSnapshotBeforeUpdate(e){let r=this.props.childRef.current;if((0,n.isHTMLElement)(r)&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=r.offsetParent,a=(0,n.isHTMLElement)(e)&&e.offsetWidth||0,t=(0,n.isHTMLElement)(e)&&e.offsetHeight||0,s=getComputedStyle(r),o=this.props.sizeRef.current;o.height=parseFloat(s.height),o.width=parseFloat(s.width),o.top=r.offsetTop,o.left=r.offsetLeft,o.right=a-o.width-o.left,o.bottom=t-o.height-o.top,o.direction=s.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function m({children:e,isPresent:t,anchorX:s,anchorY:o,root:i,pop:n}){let h=(0,l.useId)(),g=(0,l.useRef)(null),v=(0,l.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:u}=(0,l.useContext)(p.MotionConfigContext),f=function(...e){return a.useCallback(function(...e){return r=>{let a=!1,t=e.map(e=>{let t=d(e,r);return a||"function"!=typeof t||(a=!0),t});if(a)return()=>{for(let r=0;r<t.length;r++){let a=t[r];"function"==typeof a?a():d(e[r],null)}}}}(...e),e)}(g,e.props?.ref??e?.ref);return(0,l.useInsertionEffect)(()=>{let{width:e,height:r,top:a,left:l,right:p,bottom:d,direction:c}=v.current;if(t||!1===n||!g.current||!e||!r)return;let m="rtl"===c,f="left"===s?m?`right: ${p}`:`left: ${l}`:m?`left: ${l}`:`right: ${p}`,x="bottom"===o?`bottom: ${d}`:`top: ${a}`;g.current.dataset.motionPopId=h;let b=document.createElement("style");u&&(b.nonce=u);let w=i??document.head;return w.appendChild(b),b.sheet&&b.sheet.insertRule(`
          [data-motion-pop-id="${h}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${r}px !important;
            ${f}px !important;
            ${x}px !important;
          }
        `),()=>{g.current?.removeAttribute("data-motion-pop-id"),w.contains(b)&&w.removeChild(b)}},[t]),(0,r.jsx)(c,{isPresent:t,childRef:g,sizeRef:v,pop:n,children:!1===n?e:l.cloneElement(e,{ref:f})})}let h=({children:e,initial:t,isPresent:o,onExitComplete:n,custom:l,presenceAffectsLayout:p,mode:d,anchorX:c,anchorY:h,root:v})=>{let u=(0,s.useConstant)(g),f=(0,a.useId)(),x=!0,b=(0,a.useMemo)(()=>(x=!1,{id:f,initial:t,isPresent:o,custom:l,onExitComplete:e=>{for(let r of(u.set(e,!0),u.values()))if(!r)return;n&&n()},register:e=>(u.set(e,!1),()=>u.delete(e))}),[o,u,n]);return p&&x&&(b={...b}),(0,a.useMemo)(()=>{u.forEach((e,r)=>u.set(r,!1))},[o]),a.useEffect(()=>{o||u.size||!n||n()},[o]),e=(0,r.jsx)(m,{pop:"popLayout"===d,isPresent:o,anchorX:c,anchorY:h,root:v,children:e}),(0,r.jsx)(i.PresenceContext.Provider,{value:b,children:e})};function g(){return new Map}var v=e.i(464978);let u=e=>e.key||"";function f(e){let r=[];return a.Children.forEach(e,e=>{(0,a.isValidElement)(e)&&r.push(e)}),r}e.s(["AnimatePresence",0,({children:e,custom:i,initial:n=!0,onExitComplete:l,presenceAffectsLayout:p=!0,mode:d="sync",propagate:c=!1,anchorX:m="left",anchorY:g="top",root:x})=>{let[b,w]=(0,v.usePresence)(c),k=(0,a.useMemo)(()=>f(e),[e]),y=c&&!b?[]:k.map(u),j=(0,a.useRef)(!0),q=(0,a.useRef)(k),N=(0,s.useConstant)(()=>new Map),L=(0,a.useRef)(new Set),[_,M]=(0,a.useState)(k),[z,C]=(0,a.useState)(k);(0,o.useIsomorphicLayoutEffect)(()=>{j.current=!1,q.current=k;for(let e=0;e<z.length;e++){let r=u(z[e]);y.includes(r)?(N.delete(r),L.current.delete(r)):!0!==N.get(r)&&N.set(r,!1)}},[z,y.length,y.join("-")]);let R=[];if(k!==_){let e=[...k];for(let r=0;r<z.length;r++){let a=z[r],t=u(a);y.includes(t)||(e.splice(r,0,a),R.push(a))}return"wait"===d&&R.length&&(e=R),C(f(e)),M(k),null}let{forceRender:E}=(0,a.useContext)(t.LayoutGroupContext);return(0,r.jsx)(r.Fragment,{children:z.map(e=>{let a=u(e),t=(!c||!!b)&&(k===z||y.includes(a));return(0,r.jsx)(h,{isPresent:t,initial:(!j.current||!!n)&&void 0,custom:i,presenceAffectsLayout:p,mode:d,root:x,onExitComplete:t?void 0:()=>{if(L.current.has(a)||!N.has(a))return;L.current.add(a),N.set(a,!0);let e=!0;N.forEach(r=>{r||(e=!1)}),e&&(E?.(),C(q.current),c&&w?.(),l&&l())},anchorX:m,anchorY:g,children:e},a)})})}],88653)},208673,e=>{"use strict";var r=e.i(843476),a=e.i(271645);e.i(88653);var t=e.i(846932),s=e.i(772328),o=e.i(997305),i=e.i(660613),n=e.i(801583),l=e.i(912469),p=e.i(207761);let d={Sofas:"الكنب",Seating:"الجلوس",Tables:"الطاولات",Storage:"التخزين",Bedroom:"غرف النوم"},c={New:"جديد",Bestseller:"الأكثر مبيعًا",Limited:"محدود"};e.s(["default",0,function({product:e,onClose:m}){let h,{t:g,lang:v}=(0,p.useT)(),u="en"===v,f=(0,s.useReducedMotion)(),[x,b]=(0,a.useState)(e),w=(0,a.useRef)(null);(0,a.useEffect)(()=>b(e),[e]),(0,a.useEffect)(()=>{w.current?.scrollTo({top:0})},[x.id]),(0,a.useEffect)(()=>{let e=document.body.style.overflow;document.body.style.overflow="hidden";let r=e=>"Escape"===e.key&&m();return window.addEventListener("keydown",r),()=>{document.body.style.overflow=e,window.removeEventListener("keydown",r)}},[m]);let k=(0,o.shopProductCopy)(x,v),y=(0,i.completeTheRoom)(x),j=`/shop/${i.CATEGORY_SLUG[x.category]}`,q=`${n.WHATSAPP}?text=${encodeURIComponent(u?`Hi Evora! I'd love to enquire about the ${x.name} (${x.tagline}).`:`مرحبًا إيفورا! أودّ الاستفسار عن ${x.name} (${k.tagline}).`)}`;return(0,r.jsxs)(t.motion.div,{className:"qv-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},onClick:m,children:[(0,r.jsxs)(t.motion.div,{className:"qv",initial:f?{opacity:0}:{y:40,opacity:0,scale:.985},animate:{y:0,opacity:1,scale:1},exit:f?{opacity:0}:{y:28,opacity:0,scale:.99},transition:{type:"spring",stiffness:250,damping:30},onClick:e=>e.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":x.name,children:[(0,r.jsx)("button",{className:"qv-close",onClick:m,"aria-label":g("qv_close"),children:(0,r.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",children:(0,r.jsx)("path",{d:"M1 1l16 16M17 1L1 17",stroke:"currentColor",strokeWidth:"1.6"})})}),(0,r.jsxs)("div",{className:"qv-stage",children:[(0,r.jsx)("img",{src:x.image,alt:x.name,className:"qv-stage-img"},x.id),(0,r.jsx)("span",{className:"qv-wm","aria-hidden":!0})]}),(0,r.jsxs)("div",{className:"qv-info",children:[(0,r.jsxs)("div",{className:"qv-scroll",ref:w,children:[x.badge&&(0,r.jsx)("span",{className:"qv-tag",children:"ar"===v?c[x.badge]:x.badge}),(0,r.jsx)("span",{className:"eyebrow qv-cat",children:(h=x.category,"ar"===v?d[h]:h)}),(0,r.jsx)("h2",{className:"display qv-name",children:x.name}),(0,r.jsx)("p",{className:"qv-tagline",children:k.tagline}),(0,r.jsx)("p",{className:"qv-desc",children:k.description}),(0,r.jsxs)("dl",{className:"qv-specs",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("dt",{children:g("qv_dims")}),(0,r.jsxs)("dd",{children:[x.dimensions.w," × ",x.dimensions.d," ×"," ",x.dimensions.h," cm"]})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("dt",{children:g("qv_materials")}),(0,r.jsx)("dd",{children:x.materials.join(" · ")})]})]}),y.length>0&&(0,r.jsxs)("div",{className:"qv-similar",children:[(0,r.jsxs)("div",{className:"qv-similar-head",children:[(0,r.jsx)("span",{className:"qv-label",style:{marginBottom:0},children:g("shop_similar")}),(0,r.jsxs)("a",{href:j,className:"qv-viewall","data-cursor":"hover",children:[g("shop_view_all")," ",(0,r.jsx)("span",{"aria-hidden":!0,children:"→"})]})]}),(0,r.jsx)("div",{className:"qv-similar-row",children:y.map(e=>(0,r.jsxs)("button",{type:"button",className:"qv-mini","data-cursor":"hover",onClick:()=>b(e),"aria-label":e.name,children:[(0,r.jsxs)("span",{className:"qv-mini-img",children:[(0,r.jsx)("img",{src:e.image,alt:e.name,loading:"lazy"}),(0,r.jsx)("span",{className:"qv-mini-wm","aria-hidden":!0})]}),(0,r.jsx)("span",{className:"qv-mini-name display",children:e.name}),(0,r.jsx)("span",{className:"qv-mini-tag",children:(0,o.shopProductCopy)(e,v).tagline})]},e.id))})]})]}),(0,r.jsxs)("div",{className:"qv-foot",children:[(0,r.jsxs)("div",{className:"qv-cta",children:[(0,r.jsx)("button",{type:"button",onClick:l.openStartProject,className:"qv-btn qv-btn-dark","data-cursor":"hover",children:g("shop_add_design")}),(0,r.jsx)("a",{href:q,target:"_blank",rel:"noopener noreferrer",className:"qv-btn qv-btn-ghost","data-cursor":"hover",children:g("shop_enquire")})]}),(0,r.jsx)("div",{className:"qv-cta-sub",children:(0,r.jsx)("a",{href:"/visit",className:"qv-link","data-cursor":"hover",children:g("shop_showroom_cta")})})]})]})]}),(0,r.jsx)("style",{children:`
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
      `})]})}])},236861,e=>{"use strict";var r=e.i(843476),a=e.i(271645),t=e.i(207761),s=e.i(997305),o=e.i(660613),i=e.i(801583),n=e.i(719381),l=e.i(846932),p=e.i(208673),d=e.i(88653);let c={Sofas:"الكنب",Seating:"الجلوس",Tables:"الطاولات",Storage:"التخزين",Bedroom:"غرف النوم"},m={New:"جديد",Bestseller:"الأكثر مبيعًا",Limited:"محدود"},h=(e,r)=>"ar"===r?c[e]:e;e.s(["default",0,function({seed:e}){let{t:c,lang:g}=(0,t.useT)(),v="en"===g,u=e?(0,o.getTaxNode)(e):null,f=e?(0,o.resolveSlug)(e):s.shopProducts,x=e?(0,o.normalizeSlug)(e):null,[b,w]=(0,a.useState)("all"),[k,y]=(0,a.useState)(""),[j,q]=(0,a.useState)("featured"),[N,L]=(0,a.useState)(null),[_,M]=(0,a.useState)(24),z=(0,a.useMemo)(()=>{let e=k.trim().toLowerCase(),r="all"===b?f:f.filter(e=>e.category===b);return e&&(r=r.filter(r=>{let a=(0,s.shopProductCopy)(r,"ar");return[r.name,r.tagline,r.category,r.description,r.materials.join(" "),a.tagline,a.description].join(" ").toLowerCase().includes(e)})),"az"===j&&(r=[...r].sort((e,r)=>e.name.localeCompare(r.name))),r},[b,k,j,f]),C=["all",...(0,o.categoriesIn)(f)],R=`${x??"all"}|${b}|${j}|${k}`;(0,a.useEffect)(()=>{M(24)},[R]);let E=z.slice(0,_),P=_<z.length,S=u&&"room"===u.kind?c("shop_rooms_eyebrow"):c("shop_page_eyebrow"),A=u?v?u.labelEN:u.labelAR:c("shop_page_title"),$=u?v?u.noteEN:u.noteAR:c("shop_page_sub"),T=0===f.length,H=u?`${i.WHATSAPP}?text=${encodeURIComponent(v?`Hi Evora! I'd love to see your ${u.labelEN} in the Khalda showroom.`:`مرحبًا إيفورا! أودّ أن أشاهد ${u.labelAR} في معرض خلدا.`)}`:i.WHATSAPP;return(0,r.jsxs)("section",{className:"section shop",style:{paddingTop:"clamp(7rem, 13vh, 10rem)"},children:[(0,r.jsxs)("div",{className:"container",children:[(0,r.jsxs)("div",{style:{maxWidth:760,marginBottom:"2.4rem"},children:[x&&(0,r.jsxs)(n.Rise,{as:"nav",className:"shop-crumbs",delay:.02,children:[(0,r.jsx)("a",{href:"/shop","data-cursor":"hover",children:c("shop_view_all")}),(0,r.jsx)("span",{"aria-hidden":!0,children:"·"}),(0,r.jsx)("a",{href:"/shop/rooms","data-cursor":"hover",children:c("shop_rooms_eyebrow")})]}),(0,r.jsx)(n.Rise,{as:"span",className:"eyebrow",style:{color:"var(--brass)",display:"block"},children:S}),(0,r.jsx)(n.RevealLines,{lines:[A],className:"display",style:{fontSize:"clamp(2.4rem, 6vw, 4.6rem)",margin:"1rem 0 0"}}),(0,r.jsx)(n.Rise,{delay:.12,children:(0,r.jsx)("p",{style:{color:"var(--ink-soft)",maxWidth:"52ch",marginTop:"1.2rem"},children:$})})]}),T?(0,r.jsx)(n.Rise,{delay:.1,children:(0,r.jsxs)("div",{className:"shop-enquire",children:[(0,r.jsxs)("div",{className:"shop-enquire-media",children:[u&&(0,r.jsx)("img",{src:u.image,alt:v?u.labelEN:u.labelAR,loading:"lazy"}),(0,r.jsx)("span",{className:"shop-enquire-scrim"})]}),(0,r.jsxs)("div",{className:"shop-enquire-body",children:[(0,r.jsx)("span",{className:"eyebrow",style:{color:"var(--brass)"},children:u?v?u.labelEN:u.labelAR:""}),(0,r.jsx)("p",{className:"shop-enquire-lead",children:c("shop_empty_enquire")}),(0,r.jsxs)("div",{className:"shop-enquire-cta",children:[(0,r.jsx)("a",{href:"/visit",className:"shop-enquire-btn shop-enquire-btn--dark","data-cursor":"hover",children:c("consult")}),(0,r.jsx)("a",{href:H,target:"_blank",rel:"noopener noreferrer",className:"shop-enquire-btn shop-enquire-btn--ghost","data-cursor":"hover",children:c("shop_showroom_cta")}),(0,r.jsxs)("a",{href:"/shop",className:"shop-enquire-link","data-cursor":"hover",children:[c("shop_view_all")," ",(0,r.jsx)("span",{"aria-hidden":!0,children:"→"})]})]})]})]})}):(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.Rise,{delay:.14,children:(0,r.jsxs)("div",{className:"shop-controls",children:[(0,r.jsxs)("label",{className:"shop-search","data-cursor":"hover",children:[(0,r.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7","aria-hidden":!0,children:[(0,r.jsx)("circle",{cx:"11",cy:"11",r:"7"}),(0,r.jsx)("path",{d:"M21 21l-4.3-4.3"})]}),(0,r.jsx)("input",{type:"search",value:k,onChange:e=>y(e.target.value),placeholder:c("shop_search_ph"),"aria-label":c("shop_search_ph")})]}),(0,r.jsxs)("label",{className:"shop-sort",children:[(0,r.jsx)("span",{children:c("shop_sort")}),(0,r.jsxs)("select",{value:j,onChange:e=>q(e.target.value),"data-cursor":"hover","aria-label":c("shop_sort"),children:[(0,r.jsx)("option",{value:"featured",children:c("shop_sort_featured")}),(0,r.jsx)("option",{value:"az",children:c("shop_sort_az")})]})]})]})}),(0,r.jsx)(n.Rise,{delay:.18,children:(0,r.jsxs)("div",{className:"shop-filters",role:"tablist",children:[C.map(e=>{let a=b===e,t="all"===e?c("shop_all"):h(e,g);return(0,r.jsxs)("a",{href:"all"===e?x?`/shop/${x}`:"/shop":`/shop/${o.CATEGORY_SLUG[e]}`,role:"tab","aria-selected":a,"data-cursor":"hover",className:`shop-tab ${a?"on":""}`,onClick:r=>((e,r)=>{0!==e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),w(r))})(r,e),children:[t,a&&(0,r.jsx)(l.motion.span,{layoutId:"shop-underline",className:"shop-tab-underline"})]},e)}),(0,r.jsxs)("span",{className:"shop-count",children:[z.length," ",c("shop_pieces")]})]})}),z.length>0?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.Stagger,{className:"shop-grid",gap:.045,children:E.map(e=>(0,r.jsx)(n.StaggerItem,{y:22,children:(0,r.jsxs)("button",{type:"button",className:"shop-card","data-cursor":"hover",onClick:()=>L(e),"aria-label":`${c("shop_quickview")} — ${e.name}`,children:[(0,r.jsxs)("div",{className:"shop-card-img",children:[(0,r.jsx)("img",{src:e.image,alt:e.name,loading:"lazy"}),e.badge&&(0,r.jsx)("span",{className:"shop-badge",children:"ar"===g?m[e.badge]:e.badge}),(0,r.jsxs)("span",{className:"shop-qv",children:[c("shop_quickview")," ",(0,r.jsx)("span",{"aria-hidden":!0,children:"↗"})]}),(0,r.jsx)("span",{className:"shop-wm","aria-hidden":!0})]}),(0,r.jsxs)("div",{className:"shop-card-meta",children:[(0,r.jsx)("div",{className:"shop-card-head",children:(0,r.jsx)("span",{className:"shop-cat",children:h(e.category,g)})}),(0,r.jsx)("h3",{className:"shop-name display",children:e.name}),(0,r.jsx)("p",{className:"shop-tag",children:(0,s.shopProductCopy)(e,g).tagline})]})]})},e.id))},R),P&&(0,r.jsx)("div",{className:"shop-more",children:(0,r.jsxs)("button",{type:"button",className:"shop-more-btn","data-cursor":"hover",onClick:()=>M(e=>e+24),children:[c("shop_load_more")," ",(0,r.jsxs)("span",{className:"shop-more-n",children:["(",z.length-_,")"]})]})})]}):(0,r.jsxs)("div",{className:"shop-empty",children:[(0,r.jsx)("p",{children:c("shop_no_results")}),(0,r.jsx)("button",{className:"shop-clear","data-cursor":"hover",onClick:()=>{y(""),w("all"),q("featured")},children:c("shop_clear")})]})]})]}),(0,r.jsx)(d.AnimatePresence,{children:N&&(0,r.jsx)(p.default,{product:N,onClose:()=>L(null)},N.id)}),(0,r.jsx)("style",{children:`
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
      `})]})}])}]);