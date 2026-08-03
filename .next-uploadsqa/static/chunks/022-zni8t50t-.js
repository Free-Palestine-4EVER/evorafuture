(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,871522,e=>{"use strict";var t=e.i(843476),a=e.i(271645);let r={ink:"var(--ink)",paper:"var(--paper)",brass:"var(--brass-2)"};e.s(["default",0,function({tone:e,tagline:n=!0,draw:i=!1,drawMs:s=900,title:o="EVORA — Future Home",className:c,style:l}){let d=(0,a.useId)().replace(/[:]/g,""),m=e?r[e]:"currentColor";return(0,t.jsxs)("svg",{viewBox:n?"0 0 730 316":"0 0 730 186",role:"img","aria-label":o,className:c,style:{display:"block",color:m,overflow:"visible",...l},"data-draw":i?"on":void 0,children:[(0,t.jsx)("title",{children:o}),i&&(0,t.jsx)("style",{children:`
          [data-draw="on"] .ev-p {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: ev-draw-${d} ${s}ms cubic-bezier(0.22,1,0.36,1) forwards;
          }
          @keyframes ev-draw-${d} { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) {
            [data-draw="on"] .ev-p { stroke-dasharray: none; stroke-dashoffset: 0; animation: none; }
          }
        `}),(0,t.jsxs)("g",{fill:"none",stroke:m,strokeWidth:15,strokeLinecap:"square",strokeLinejoin:"miter",children:[(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 28 L30 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 28 L118 28"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 93 L104 93"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 158 L118 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M152 28 L214 158 L276 28"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M363 28 A65 65 0 0 1 363 158 A65 65 0 0 1 363 28 Z"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M452 28 L452 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M452 28 L512 28 A33 33 0 0 1 512 94 L452 94"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M502 94 L548 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M580 158 L640 28 L700 158"})]}),n&&(0,t.jsxs)("g",{transform:"translate(178 222)",fill:"none",stroke:m,strokeWidth:7,strokeLinecap:"square",strokeLinejoin:"miter",children:[(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(0 0)",d:"M0 0 L0 30 M0 0 L20 0 M0 14 L16 14"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(34 0)",d:"M0 0 L0 19 A11 11 0 0 0 22 19 L22 0"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(70 0)",d:"M0 0 L24 0 M12 0 L12 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(108 0)",d:"M0 0 L0 19 A11 11 0 0 0 22 19 L22 0"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(144 0)",d:"M0 0 L0 30 M0 0 L16 0 A8 8 0 0 1 16 16 L0 16 M11 16 L22 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(180 0)",d:"M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(244 0)",d:"M0 0 L0 30 M22 0 L22 30 M0 15 L22 15"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(280 0)",d:"M12 0 A12 15 0 0 1 12 30 A12 15 0 0 1 12 0 Z"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(318 0)",d:"M0 30 L0 0 L12 18 L24 0 L24 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(356 0)",d:"M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30"})]})]})}])},772328,e=>{"use strict";var t=e.i(571164),a=e.i(138544),r=e.i(271645);e.s(["useReducedMotion",0,function(){t.hasReducedMotionListener.current||(0,a.initPrefersReducedMotion)();let[e]=(0,r.useState)(t.prefersReducedMotion.current);return e}])},801583,e=>{"use strict";e.s(["FOLLOWERS",0,"103K","HOMES",0,"2,400+","PHONE_PRIMARY",0,"+962 79 130 1444","PHONE_PRIMARY_TEL",0,"+962791301444","PHONE_SECONDARY",0,"+962 79 636 4105","WHATSAPP",0,"https://wa.me/962796364105"])},618566,(e,t,a)=>{t.exports=e.r(976562)},88653,e=>{"use strict";e.i(247167);var t=e.i(843476),a=e.i(271645),r=e.i(231178),n=e.i(947414),i=e.i(674008),s=e.i(821476),o=e.i(772846),c=a,l=e.i(737806);function d(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class m extends c.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if((0,o.isHTMLElement)(t)&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=t.offsetParent,a=(0,o.isHTMLElement)(e)&&e.offsetWidth||0,r=(0,o.isHTMLElement)(e)&&e.offsetHeight||0,n=getComputedStyle(t),i=this.props.sizeRef.current;i.height=parseFloat(n.height),i.width=parseFloat(n.width),i.top=t.offsetTop,i.left=t.offsetLeft,i.right=a-i.width-i.left,i.bottom=r-i.height-i.top,i.direction=n.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function g({children:e,isPresent:r,anchorX:n,anchorY:i,root:s,pop:o}){let p=(0,c.useId)(),h=(0,c.useRef)(null),f=(0,c.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:u}=(0,c.useContext)(l.MotionConfigContext),b=function(...e){return a.useCallback(function(...e){return t=>{let a=!1,r=e.map(e=>{let r=d(e,t);return a||"function"!=typeof r||(a=!0),r});if(a)return()=>{for(let t=0;t<r.length;t++){let a=r[t];"function"==typeof a?a():d(e[t],null)}}}}(...e),e)}(h,e.props?.ref??e?.ref);return(0,c.useInsertionEffect)(()=>{let{width:e,height:t,top:a,left:c,right:l,bottom:d,direction:m}=f.current;if(r||!1===o||!h.current||!e||!t)return;let g="rtl"===m,b="left"===n?g?`right: ${l}`:`left: ${c}`:g?`left: ${c}`:`right: ${l}`,_="bottom"===i?`bottom: ${d}`:`top: ${a}`;h.current.dataset.motionPopId=p;let A=document.createElement("style");u&&(A.nonce=u);let w=s??document.head;return w.appendChild(A),A.sheet&&A.sheet.insertRule(`
          [data-motion-pop-id="${p}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            ${b}px !important;
            ${_}px !important;
          }
        `),()=>{h.current?.removeAttribute("data-motion-pop-id"),w.contains(A)&&w.removeChild(A)}},[r]),(0,t.jsx)(m,{isPresent:r,childRef:h,sizeRef:f,pop:o,children:!1===o?e:c.cloneElement(e,{ref:b})})}let p=({children:e,initial:r,isPresent:i,onExitComplete:o,custom:c,presenceAffectsLayout:l,mode:d,anchorX:m,anchorY:p,root:f})=>{let u=(0,n.useConstant)(h),b=(0,a.useId)(),_=!0,A=(0,a.useMemo)(()=>(_=!1,{id:b,initial:r,isPresent:i,custom:c,onExitComplete:e=>{for(let t of(u.set(e,!0),u.values()))if(!t)return;o&&o()},register:e=>(u.set(e,!1),()=>u.delete(e))}),[i,u,o]);return l&&_&&(A={...A}),(0,a.useMemo)(()=>{u.forEach((e,t)=>u.set(t,!1))},[i]),a.useEffect(()=>{i||u.size||!o||o()},[i]),e=(0,t.jsx)(g,{pop:"popLayout"===d,isPresent:i,anchorX:m,anchorY:p,root:f,children:e}),(0,t.jsx)(s.PresenceContext.Provider,{value:A,children:e})};function h(){return new Map}var f=e.i(464978);let u=e=>e.key||"";function b(e){let t=[];return a.Children.forEach(e,e=>{(0,a.isValidElement)(e)&&t.push(e)}),t}e.s(["AnimatePresence",0,({children:e,custom:s,initial:o=!0,onExitComplete:c,presenceAffectsLayout:l=!0,mode:d="sync",propagate:m=!1,anchorX:g="left",anchorY:h="top",root:_})=>{let[A,w]=(0,f.usePresence)(m),x=(0,a.useMemo)(()=>b(e),[e]),v=m&&!A?[]:x.map(u),y=(0,a.useRef)(!0),k=(0,a.useRef)(x),j=(0,n.useConstant)(()=>new Map),L=(0,a.useRef)(new Set),[M,N]=(0,a.useState)(x),[E,R]=(0,a.useState)(x);(0,i.useIsomorphicLayoutEffect)(()=>{y.current=!1,k.current=x;for(let e=0;e<E.length;e++){let t=u(E[e]);v.includes(t)?(j.delete(t),L.current.delete(t)):!0!==j.get(t)&&j.set(t,!1)}},[E,v.length,v.join("-")]);let S=[];if(x!==M){let e=[...x];for(let t=0;t<E.length;t++){let a=E[t],r=u(a);v.includes(r)||(e.splice(t,0,a),S.push(a))}return"wait"===d&&S.length&&(e=S),R(b(e)),N(x),null}let{forceRender:C}=(0,a.useContext)(r.LayoutGroupContext);return(0,t.jsx)(t.Fragment,{children:E.map(e=>{let a=u(e),r=(!m||!!A)&&(x===E||v.includes(a));return(0,t.jsx)(p,{isPresent:r,initial:(!y.current||!!o)&&void 0,custom:s,presenceAffectsLayout:l,mode:d,root:_,onExitComplete:r?void 0:()=>{if(L.current.has(a)||!j.has(a))return;L.current.add(a),j.set(a,!0);let e=!0;j.forEach(t=>{t||(e=!1)}),e&&(C?.(),R(k.current),m&&w?.(),c&&c())},anchorX:g,anchorY:h,children:e},a)})})}],88653)},337088,e=>{"use strict";let t=null;e.s(["SAFE_FRAME_EXT",0,"webp","resolveFrameExt",0,function(){return t||(t=new Promise(e=>{if("u"<typeof Image)return void e("webp");let t=!1,a=a=>{t||(t=!0,e(a))},r=new Image;r.onload=()=>a(r.width>0&&r.height>0?"avif":"webp"),r.onerror=()=>a("webp"),r.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",window.setTimeout(()=>a("webp"),1500)}))}])},683406,e=>{"use strict";e.s(["budgetFrames",0,function(e,t,a=60){let r=Math.min(e,a);if(r<=1)return[t(1)];let n=[];for(let a=0;a<r;a++)n.push(t(1+Math.round(a*(e-1)/(r-1))));return n},"createFrameScrub",0,function(e){let{container:t,frames:a,progress:r,className:n,onFirstFrame:i,onProgress:s,reduce:o=!1,lerp:c=.16}=e,l=a.length,d=document.createElement("canvas");n&&(d.className=n),d.setAttribute("aria-hidden","true"),t.appendChild(d);let m=d.getContext("2d",{alpha:!1}),g=Array(l),p=0,h=0,f=-1,u=!1,b=!1,_=0,A=(e,t,a)=>Math.min(a,Math.max(t,e));function w(){let e=Math.min(window.devicePixelRatio||1,2),t=d.getBoundingClientRect(),a=Math.max(1,Math.round(t.width*e)),r=Math.max(1,Math.round(t.height*e));(d.width!==a||d.height!==r)&&(d.width=a,d.height=r,f=-1,v(Math.round(h)))}let x=e=>{let t=g[e];return!!t&&t.complete&&t.naturalWidth>0};function v(e){if(b||!m)return;let t=function(e){if(x(e))return e;for(let t=1;t<l;t++){if(e-t>=0&&x(e-t))return e-t;if(e+t<l&&x(e+t))return e+t}return -1}(A(e,0,l-1));!(t<0)&&t!==f&&(f=t,function(e){let t,a,r,n;if(!m)return;let i=d.width,s=d.height,o=e.naturalWidth/e.naturalHeight;i/s>o?(t=i,r=0,n=(s-(a=i/o))/2):(a=s,n=0,r=(i-(t=s*o))/2),m.drawImage(e,r,n,t,a)}(g[t]),u||(u=!0,i?.()))}for(let e=0;e<l;e++){let t=new Image;t.decoding="async",g[e]=t,t.onload=()=>{p++,s?.(p/l),0!==e&&u||(w(),v(Math.round(h)))},t.onerror=()=>{p++,s?.(p/l)},t.src=a[e]}let y=()=>{if(b)return;let e=A(r(),0,1)*(l-1);o?h=e:(h+=(e-h)*c,.01>Math.abs(e-h)&&(h=e)),v(Math.round(h)),_=requestAnimationFrame(y)};_=requestAnimationFrame(y);let k=()=>w();return window.addEventListener("resize",k),window.addEventListener("orientationchange",k),w(),{loaded:()=>p,destroy:()=>{for(let e of(b=!0,cancelAnimationFrame(_),window.removeEventListener("resize",k),window.removeEventListener("orientationchange",k),g))e&&(e.onload=null,e.onerror=null,e.src="");g.length=0,d.remove()}}}])},994555,545329,e=>{"use strict";var t=e.i(843476),a=e.i(271645),r=e.i(88653),n=e.i(846932),i=e.i(772328),s=e.i(207761),o=e.i(719381),c=e.i(912469),l=e.i(801583);let d="/evora/configurator/base.webp",m=[{id:"patagonia",label:{en:"Patagonia",ar:"باتاغونيا"},swatch:"/evora/configurator/swatches/patagonia.jpg",image:"/evora/configurator/base.webp",note:{en:"Storm-grey movement, a statement island",ar:"حركة رماديّة كالعاصفة، جزيرة تلفت الأنظار"}},{id:"calacatta-gold",label:{en:"Calacatta Gold",ar:"كالاكاتا غولد"},swatch:"/evora/configurator/swatches/calacatta-gold.jpg",image:"/evora/configurator/surface-calacatta-gold.webp",note:{en:"Warm gold veining, quiet wealth",ar:"عروقٌ ذهبية دافئة، ثراءٌ هادئ"}},{id:"emperador",label:{en:"Emperador",ar:"إمبرادور"},swatch:"/evora/configurator/swatches/emperador.jpg",image:"/evora/configurator/surface-emperador.webp",note:{en:"Deep brown, soft light",ar:"بنيٌّ عميق وضوءٌ ناعم"}},{id:"nero-marquina",label:{en:"Nero Marquina",ar:"نيرو مركينا"},swatch:"/evora/configurator/swatches/nero-marquina.jpg",image:"/evora/configurator/surface-nero-marquina.webp",note:{en:"Black marble, white lightning, for the bold",ar:"رخامٌ أسود ببرقٍ أبيض، لمن يجرؤ"}},{id:"verde-alpi",label:{en:"Verde Alpi",ar:"فيردي ألبي"},swatch:"/evora/configurator/swatches/verde-alpi.jpg",image:"/evora/configurator/surface-verde-alpi.webp",note:{en:"Forest green, rare and alive",ar:"أخضرُ غابيٌّ نادر وحيّ"}},{id:"travertine",label:{en:"Travertine",ar:"ترافرتين"},swatch:"/evora/configurator/swatches/travertine.jpg",image:"/evora/configurator/surface-travertine.webp",note:{en:"Sand-toned, honest stone",ar:"حجرٌ رمليٌّ صادق"}}];e.s(["CONFIG_BASE",0,d,"SURFACES",0,m],545329);var g=e.i(337088),p=e.i(683406);let h={wa:{en:"Ask on WhatsApp",ar:"اسأل عبر واتساب"},wa_msg:{en:"Hi Evora — I'd like to talk about a bespoke kitchen island.",ar:"مرحبًا إيفورا — أودّ التحدث عن جزيرة مطبخ حسب الطلب."},cfg_instruct:{en:"Pick a stone — your island re-renders live.",ar:"اختر حجرًا — تتبدّل الجزيرة أمامك."},cfg_active_label:{en:"Selected stone",ar:"الحجر المختار"},make_eyebrow:{en:"From plan to kitchen",ar:"من المخطط إلى المطبخ"},make_heading:{en:"How a bespoke island is made",ar:"كيف تُصنع جزيرة حسب الطلب"},make_lead:{en:"No catalogue numbers, no guesswork — three steps from the stone you choose to the island standing in your home.",ar:"لا أرقام كتالوج ولا تخمين — ثلاث خطوات من الحجر الذي تختاره إلى الجزيرة في منزلك."},s1_n:{en:"01",ar:"٠١"},s1_t:{en:"Choose your stone",ar:"اختر حجرك"},s1_b:{en:"Sit with our designers in Khalda and settle the marble, finish and proportions — exactly as you saw them on screen.",ar:"اجلس مع مصمّمينا في خلدا واختر الرخام والتشطيب والمقاسات — تمامًا كما رأيتها على الشاشة."},s2_n:{en:"02",ar:"٠٢"},s2_t:{en:"We cut it in our workshop",ar:"نصنعها في ورشتنا"},s2_b:{en:"Your island is built to order by our own makers in Amman — one slab, measured and finished by hand.",ar:"تُصنع جزيرتك خصيصًا على أيدي صنّاعنا في عمّان — لوحٌ واحد، يُقاس ويُشطَّب يدويًا."},s3_n:{en:"03",ar:"٠٣"},s3_t:{en:"We fit it in your home",ar:"نركّبها في منزلك"},s3_b:{en:"We deliver and install it ourselves, then leave the room looking exactly the way you decided it would.",ar:"نوصّلها ونركّبها بأنفسنا، ثم نترك الغرفة كما قرّرتها أنت تمامًا."}},f=e=>String(e).padStart(4,"0"),u=`
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
`;e.s(["default",0,function(){let{t:e,lang:b}=(0,s.useT)(),_=e=>h[e][b],A=(0,i.useReducedMotion)(),w=[.22,1,.36,1],x=`${l.WHATSAPP}?text=${encodeURIComponent(h.wa_msg[b])}`,v=(0,a.useRef)(null),y=(0,a.useRef)(null),k=(0,a.useRef)(null),[j,L]=(0,a.useState)(!1),[M,N]=(0,a.useState)(!1),[E,R]=(0,a.useState)(!1),[S,C]=(0,a.useState)(!1),[$,z]=(0,a.useState)(null),B=e=>{let t=$??g.SAFE_FRAME_EXT;return S?`/evora/config-frames-mobile/frame_${f(e)}.${t}`:`/evora/config-frames/frame_${f(e)}.${t}`};(0,a.useEffect)(()=>{let e=window.matchMedia("(max-width: 768px)"),t=()=>C(e.matches);return t(),e.addEventListener("change",t),()=>e.removeEventListener("change",t)},[]),(0,a.useEffect)(()=>{(0,g.resolveFrameExt)().then(z)},[]),(0,a.useEffect)(()=>{if(!$)return;let e=e=>"avif"===$?e.replace(/\.webp$/i,".avif"):e,t=new Set;for(let a of m)t.add(e(a.image)),/^\/evora\/configurator\/surface-[a-z0-9-]+\.webp$/.test(a.image)&&t.add(e(a.image.replace(/\.webp$/,"-mobile.webp")));let a=Array.from(t,e=>{let t=new Image;return t.decoding="async",t.src=e,t});return()=>{a.length=0}},[$]);let[F,P]=(0,a.useState)(m),[I,T]=(0,a.useState)(m[0].id),W=F.find(e=>e.id===I)??F[0];(0,a.useEffect)(()=>{let e=v.current,t=k.current;if(!e||!t||!$)return;let a=window.innerHeight,r=()=>{let e=y.current?.getBoundingClientRect();a=e&&e.height>0?e.height:window.innerHeight};r();let n=()=>{let t=e.getBoundingClientRect(),r=e.offsetHeight-a;return r>0?Math.min(1,Math.max(0,-t.top/r)):0},i=()=>Math.min(1,n()/.78),s=null,o=0,c=()=>{let a;if(!((a=e.getBoundingClientRect()).top<2*window.innerHeight&&a.bottom>-window.innerHeight)){o=window.setTimeout(c,200);return}s=(0,p.createFrameScrub)({container:t,frames:(0,p.budgetFrames)(169,B),className:"cfg__canvas",progress:i,reduce:!!A,onFirstFrame:()=>{L(!0),N(!0)}})};c();let l=0,d=!1,m=()=>{let e=n()>.8;e!==d&&(d=e,R(e)),l=requestAnimationFrame(m)};l=requestAnimationFrame(m);let g=()=>r();return window.addEventListener("resize",g),window.addEventListener("orientationchange",g),()=>{cancelAnimationFrame(l),window.removeEventListener("resize",g),window.removeEventListener("orientationchange",g),window.clearTimeout(o),s?.destroy()}},[A,$,S,169]);let H=W?.image===d||W?.id===m[0].id,Y=e=>"avif"===$?e.replace(/\.webp$/i,".avif"):e,G=Y(S&&W&&/^\/evora\/configurator\/surface-[a-z0-9-]+\.webp$/.test(W.image)?W.image.replace(/\.webp$/,"-mobile.webp"):W?.image??"")||W?.image,O=[{n:_("s1_n"),title:_("s1_t"),body:_("s1_b")},{n:_("s2_n"),title:_("s2_t"),body:_("s2_b")},{n:_("s3_n"),title:_("s3_t"),body:_("s3_b")}];return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("section",{id:"configurator",ref:v,className:`cfg ${S?"cfg--mobile":""}`,children:(0,t.jsxs)("div",{className:"cfg__sticky",ref:y,children:[(0,t.jsx)("div",{ref:k,className:`cfg__stage${M?" is-painted":""}`,role:"img","aria-label":e("cfg_aria")}),!M&&(0,t.jsxs)("picture",{children:[(0,t.jsx)("source",{media:"(max-width: 768px)",srcSet:`/evora/config-frames-mobile/frame_${f(169)}.${$??g.SAFE_FRAME_EXT}`}),(0,t.jsx)("img",{src:`/evora/config-frames/frame_${f(169)}.${$??g.SAFE_FRAME_EXT}`,alt:"",className:"cfg__poster","aria-hidden":!0})]}),(0,t.jsx)(r.AnimatePresence,{mode:"popLayout",children:E&&!H&&W&&(0,t.jsx)(n.motion.img,{src:G,alt:"",className:"cfg__variant",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.5,ease:w},onError:e=>{let t=e.currentTarget;W&&/-mobile\.(webp|avif)$/i.test(t.src)&&!t.dataset.fellback?(t.dataset.fellback="1",t.src=Y(W.image)):t.style.opacity="0"}},W.id)}),(0,t.jsx)("div",{className:"cfg__scrim"}),(0,t.jsxs)(n.motion.div,{className:"cfg__intro",animate:{opacity:+!E},transition:{duration:.4},children:[(0,t.jsx)("span",{className:"eyebrow",style:{color:"var(--brass-2)"},children:e("cfg_eyebrow")}),(0,t.jsx)("h2",{className:"display cfg__h",children:e("cfg_heading")}),(0,t.jsx)("p",{className:"cfg__lead",children:e("cfg_lead")})]}),(0,t.jsx)(r.AnimatePresence,{children:E&&(0,t.jsxs)(n.motion.div,{className:"cfg__panel",initial:{opacity:0,y:24},animate:{opacity:1,y:0},exit:{opacity:0,y:24},transition:{duration:.5,ease:w},children:[(0,t.jsx)("span",{className:"eyebrow cfg__panel-eyebrow",style:{color:"var(--brass-2)"},children:e("cfg_panel_eyebrow")}),(0,t.jsx)("p",{className:"cfg__instruct",children:_("cfg_instruct")}),(0,t.jsxs)("div",{className:"cfg__panel-head",children:[(0,t.jsx)("span",{className:"cfg__active-kicker",children:_("cfg_active_label")}),(0,t.jsx)(r.AnimatePresence,{mode:"wait",children:(0,t.jsx)(n.motion.strong,{className:"cfg__active-name",initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.3,ease:w},children:W?W.label[b]:""},W?W.id:"none")})]}),(0,t.jsx)(r.AnimatePresence,{mode:"wait",children:W&&W.note&&(0,t.jsx)(n.motion.p,{className:"cfg__note",initial:{opacity:0,y:6},animate:{opacity:1,y:0},exit:{opacity:0,y:-6},transition:{duration:.35,ease:w},children:W.note[b]},W.id)}),(0,t.jsxs)("div",{className:"cfg__swatches",children:[F.map(e=>{let a=e.swatch.startsWith("/")||e.swatch.startsWith("blob:")||e.swatch.startsWith("http");return(0,t.jsx)("button",{type:"button",className:`cfg__swatch ${I===e.id?"is-active":""}`,onClick:()=>T(e.id),"aria-label":e.label[b],"aria-pressed":I===e.id,title:e.label[b],style:a?{backgroundImage:`url(${e.swatch})`,backgroundSize:"cover"}:{background:e.swatch}},e.id)}),(0,t.jsxs)("label",{className:"cfg__swatch cfg__upload",title:"en"===b?"Upload an image":"ارفع صورة",children:[(0,t.jsx)("input",{type:"file",accept:"image/*",onChange:e=>{let t=e.target.files?.[0];if(!t)return;let a=URL.createObjectURL(t),r=`upload-${F.length}`,n=t.name.replace(/\.[^.]+$/,"");P(e=>[...e,{id:r,label:{en:n,ar:n},swatch:a,image:a}]),T(r),e.target.value=""},hidden:!0}),(0,t.jsx)("span",{children:"＋"})]})]}),(0,t.jsxs)("div",{className:"cfg__cta",children:[(0,t.jsxs)("button",{type:"button",className:"btn cfg__cta-1",onClick:c.openStartProject,children:[e("cfg_cta")," ",(0,t.jsx)("span",{className:"arrow",children:"→"})]}),(0,t.jsx)("a",{href:x,target:"_blank",rel:"noopener noreferrer",className:"cfg__cta-wa",children:_("wa")})]})]})})]})}),(0,t.jsx)("section",{className:"cfg-make",children:(0,t.jsxs)("div",{className:"cfg-make__inner",children:[(0,t.jsxs)(o.Rise,{as:"header",className:"cfg-make__head",children:[(0,t.jsx)("span",{className:"eyebrow",style:{color:"var(--brass-2)"},children:_("make_eyebrow")}),(0,t.jsx)("h2",{className:"display cfg-make__h",children:_("make_heading")}),(0,t.jsx)("p",{className:"cfg-make__lead",children:_("make_lead")})]}),(0,t.jsx)("div",{className:"cfg-make__grid",children:O.map((e,a)=>(0,t.jsxs)(o.Rise,{as:"article",delay:.08*(a+1),className:"cfg-make__step",children:[(0,t.jsx)("span",{className:"cfg-make__num",children:e.n}),(0,t.jsx)("h3",{className:"cfg-make__step-t",children:e.title}),(0,t.jsx)("p",{className:"cfg-make__step-b",children:e.body})]},e.n))}),(0,t.jsxs)(o.Rise,{className:"cfg-make__cta",delay:.34,children:[(0,t.jsxs)("button",{type:"button",className:"btn cfg-make__cta-1",onClick:c.openStartProject,children:[e("cfg_cta")," ",(0,t.jsx)("span",{className:"arrow",children:"→"})]}),(0,t.jsx)("a",{href:x,target:"_blank",rel:"noopener noreferrer",className:"cfg-make__cta-wa",children:_("wa")})]})]})}),(0,t.jsx)("style",{children:u})]})}],994555)}]);