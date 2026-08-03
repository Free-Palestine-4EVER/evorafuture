(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,987718,e=>{"use strict";e.s(["avifSrc",0,e=>e.replace(/\.(jpe?g|webp)$/i,".avif")])},871522,e=>{"use strict";var a=e.i(843476),t=e.i(271645);let r={ink:"var(--ink)",paper:"var(--paper)",brass:"var(--brass-2)"};e.s(["default",0,function({tone:e,tagline:i=!0,draw:n=!1,drawMs:s=900,title:o="EVORA — Future Home",className:l,style:c}){let d=(0,t.useId)().replace(/[:]/g,""),m=e?r[e]:"currentColor";return(0,a.jsxs)("svg",{viewBox:i?"0 0 730 316":"0 0 730 186",role:"img","aria-label":o,className:l,style:{display:"block",color:m,overflow:"visible",...c},"data-draw":n?"on":void 0,children:[(0,a.jsx)("title",{children:o}),n&&(0,a.jsx)("style",{children:`
          [data-draw="on"] .ev-p {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: ev-draw-${d} ${s}ms cubic-bezier(0.22,1,0.36,1) forwards;
          }
          @keyframes ev-draw-${d} { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) {
            [data-draw="on"] .ev-p { stroke-dasharray: none; stroke-dashoffset: 0; animation: none; }
          }
        `}),(0,a.jsxs)("g",{fill:"none",stroke:m,strokeWidth:15,strokeLinecap:"square",strokeLinejoin:"miter",children:[(0,a.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 28 L30 158"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 28 L118 28"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 93 L104 93"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 158 L118 158"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,d:"M152 28 L214 158 L276 28"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,d:"M363 28 A65 65 0 0 1 363 158 A65 65 0 0 1 363 28 Z"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,d:"M452 28 L452 158"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,d:"M452 28 L512 28 A33 33 0 0 1 512 94 L452 94"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,d:"M502 94 L548 158"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,d:"M580 158 L640 28 L700 158"})]}),i&&(0,a.jsxs)("g",{transform:"translate(178 222)",fill:"none",stroke:m,strokeWidth:7,strokeLinecap:"square",strokeLinejoin:"miter",children:[(0,a.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(0 0)",d:"M0 0 L0 30 M0 0 L20 0 M0 14 L16 14"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(34 0)",d:"M0 0 L0 19 A11 11 0 0 0 22 19 L22 0"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(70 0)",d:"M0 0 L24 0 M12 0 L12 30"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(108 0)",d:"M0 0 L0 19 A11 11 0 0 0 22 19 L22 0"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(144 0)",d:"M0 0 L0 30 M0 0 L16 0 A8 8 0 0 1 16 16 L0 16 M11 16 L22 30"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(180 0)",d:"M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(244 0)",d:"M0 0 L0 30 M22 0 L22 30 M0 15 L22 15"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(280 0)",d:"M12 0 A12 15 0 0 1 12 30 A12 15 0 0 1 12 0 Z"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(318 0)",d:"M0 30 L0 0 L12 18 L24 0 L24 30"}),(0,a.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(356 0)",d:"M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30"})]})]})}])},772328,e=>{"use strict";var a=e.i(571164),t=e.i(138544),r=e.i(271645);e.s(["useReducedMotion",0,function(){a.hasReducedMotionListener.current||(0,t.initPrefersReducedMotion)();let[e]=(0,r.useState)(a.prefersReducedMotion.current);return e}])},801583,e=>{"use strict";e.s(["FOLLOWERS",0,"103K","HOMES",0,"2,400+","PHONE_PRIMARY",0,"+962 79 130 1444","PHONE_PRIMARY_TEL",0,"+962791301444","PHONE_SECONDARY",0,"+962 79 636 4105","WHATSAPP",0,"https://wa.me/962796364105"])},618566,(e,a,t)=>{a.exports=e.r(976562)},88653,e=>{"use strict";e.i(247167);var a=e.i(843476),t=e.i(271645),r=e.i(231178),i=e.i(947414),n=e.i(674008),s=e.i(821476),o=e.i(772846),l=t,c=e.i(737806);function d(e,a){if("function"==typeof e)return e(a);null!=e&&(e.current=a)}class m extends l.Component{getSnapshotBeforeUpdate(e){let a=this.props.childRef.current;if((0,o.isHTMLElement)(a)&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=a.offsetParent,t=(0,o.isHTMLElement)(e)&&e.offsetWidth||0,r=(0,o.isHTMLElement)(e)&&e.offsetHeight||0,i=getComputedStyle(a),n=this.props.sizeRef.current;n.height=parseFloat(i.height),n.width=parseFloat(i.width),n.top=a.offsetTop,n.left=a.offsetLeft,n.right=t-n.width-n.left,n.bottom=r-n.height-n.top,n.direction=i.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function h({children:e,isPresent:r,anchorX:i,anchorY:n,root:s,pop:o}){let p=(0,l.useId)(),f=(0,l.useRef)(null),g=(0,l.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:_}=(0,l.useContext)(c.MotionConfigContext),u=function(...e){return t.useCallback(function(...e){return a=>{let t=!1,r=e.map(e=>{let r=d(e,a);return t||"function"!=typeof r||(t=!0),r});if(t)return()=>{for(let a=0;a<r.length;a++){let t=r[a];"function"==typeof t?t():d(e[a],null)}}}}(...e),e)}(f,e.props?.ref??e?.ref);return(0,l.useInsertionEffect)(()=>{let{width:e,height:a,top:t,left:l,right:c,bottom:d,direction:m}=g.current;if(r||!1===o||!f.current||!e||!a)return;let h="rtl"===m,u="left"===i?h?`right: ${c}`:`left: ${l}`:h?`left: ${l}`:`right: ${c}`,b="bottom"===n?`bottom: ${d}`:`top: ${t}`;f.current.dataset.motionPopId=p;let x=document.createElement("style");_&&(x.nonce=_);let k=s??document.head;return k.appendChild(x),x.sheet&&x.sheet.insertRule(`
          [data-motion-pop-id="${p}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${a}px !important;
            ${u}px !important;
            ${b}px !important;
          }
        `),()=>{f.current?.removeAttribute("data-motion-pop-id"),k.contains(x)&&k.removeChild(x)}},[r]),(0,a.jsx)(m,{isPresent:r,childRef:f,sizeRef:g,pop:o,children:!1===o?e:l.cloneElement(e,{ref:u})})}let p=({children:e,initial:r,isPresent:n,onExitComplete:o,custom:l,presenceAffectsLayout:c,mode:d,anchorX:m,anchorY:p,root:g})=>{let _=(0,i.useConstant)(f),u=(0,t.useId)(),b=!0,x=(0,t.useMemo)(()=>(b=!1,{id:u,initial:r,isPresent:n,custom:l,onExitComplete:e=>{for(let a of(_.set(e,!0),_.values()))if(!a)return;o&&o()},register:e=>(_.set(e,!1),()=>_.delete(e))}),[n,_,o]);return c&&b&&(x={...x}),(0,t.useMemo)(()=>{_.forEach((e,a)=>_.set(a,!1))},[n]),t.useEffect(()=>{n||_.size||!o||o()},[n]),e=(0,a.jsx)(h,{pop:"popLayout"===d,isPresent:n,anchorX:m,anchorY:p,root:g,children:e}),(0,a.jsx)(s.PresenceContext.Provider,{value:x,children:e})};function f(){return new Map}var g=e.i(464978);let _=e=>e.key||"";function u(e){let a=[];return t.Children.forEach(e,e=>{(0,t.isValidElement)(e)&&a.push(e)}),a}e.s(["AnimatePresence",0,({children:e,custom:s,initial:o=!0,onExitComplete:l,presenceAffectsLayout:c=!0,mode:d="sync",propagate:m=!1,anchorX:h="left",anchorY:f="top",root:b})=>{let[x,k]=(0,g.usePresence)(m),v=(0,t.useMemo)(()=>u(e),[e]),w=m&&!x?[]:v.map(_),y=(0,t.useRef)(!0),A=(0,t.useRef)(v),j=(0,i.useConstant)(()=>new Map),N=(0,t.useRef)(new Set),[q,L]=(0,t.useState)(v),[E,M]=(0,t.useState)(v);(0,n.useIsomorphicLayoutEffect)(()=>{y.current=!1,A.current=v;for(let e=0;e<E.length;e++){let a=_(E[e]);w.includes(a)?(j.delete(a),N.current.delete(a)):!0!==j.get(a)&&j.set(a,!1)}},[E,w.length,w.join("-")]);let S=[];if(v!==q){let e=[...v];for(let a=0;a<E.length;a++){let t=E[a],r=_(t);w.includes(r)||(e.splice(a,0,t),S.push(t))}return"wait"===d&&S.length&&(e=S),M(u(e)),L(v),null}let{forceRender:z}=(0,t.useContext)(r.LayoutGroupContext);return(0,a.jsx)(a.Fragment,{children:E.map(e=>{let t=_(e),r=(!m||!!x)&&(v===E||w.includes(t));return(0,a.jsx)(p,{isPresent:r,initial:(!y.current||!!o)&&void 0,custom:s,presenceAffectsLayout:c,mode:d,root:b,onExitComplete:r?void 0:()=>{if(N.current.has(t)||!j.has(t))return;N.current.add(t),j.set(t,!0);let e=!0;j.forEach(a=>{a||(e=!1)}),e&&(z?.(),M(A.current),m&&k?.(),l&&l())},anchorX:h,anchorY:f,children:e},t)})})}],88653)},337088,e=>{"use strict";let a=null;e.s(["SAFE_FRAME_EXT",0,"webp","resolveFrameExt",0,function(){return a||(a=new Promise(e=>{if("u"<typeof Image)return void e("webp");let a=!1,t=t=>{a||(a=!0,e(t))},r=new Image;r.onload=()=>t(r.width>0&&r.height>0?"avif":"webp"),r.onerror=()=>t("webp"),r.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",window.setTimeout(()=>t("webp"),1500)}))}])},683406,e=>{"use strict";e.s(["budgetFrames",0,function(e,a,t=60){let r=Math.min(e,t);if(r<=1)return[a(1)];let i=[];for(let t=0;t<r;t++)i.push(a(1+Math.round(t*(e-1)/(r-1))));return i},"createFrameScrub",0,function(e){let{container:a,frames:t,progress:r,className:i,onFirstFrame:n,onProgress:s,reduce:o=!1,lerp:l=.16}=e,c=t.length,d=document.createElement("canvas");i&&(d.className=i),d.setAttribute("aria-hidden","true"),a.appendChild(d);let m=d.getContext("2d",{alpha:!1}),h=Array(c),p=0,f=0,g=-1,_=!1,u=!1,b=0,x=(e,a,t)=>Math.min(t,Math.max(a,e));function k(){let e=Math.min(window.devicePixelRatio||1,2),a=d.getBoundingClientRect(),t=Math.max(1,Math.round(a.width*e)),r=Math.max(1,Math.round(a.height*e));(d.width!==t||d.height!==r)&&(d.width=t,d.height=r,g=-1,w(Math.round(f)))}let v=e=>{let a=h[e];return!!a&&a.complete&&a.naturalWidth>0};function w(e){if(u||!m)return;let a=function(e){if(v(e))return e;for(let a=1;a<c;a++){if(e-a>=0&&v(e-a))return e-a;if(e+a<c&&v(e+a))return e+a}return -1}(x(e,0,c-1));!(a<0)&&a!==g&&(g=a,function(e){let a,t,r,i;if(!m)return;let n=d.width,s=d.height,o=e.naturalWidth/e.naturalHeight;n/s>o?(a=n,r=0,i=(s-(t=n/o))/2):(t=s,i=0,r=(n-(a=s*o))/2),m.drawImage(e,r,i,a,t)}(h[a]),_||(_=!0,n?.()))}for(let e=0;e<c;e++){let a=new Image;a.decoding="async",h[e]=a,a.onload=()=>{p++,s?.(p/c),0!==e&&_||(k(),w(Math.round(f)))},a.onerror=()=>{p++,s?.(p/c)},a.src=t[e]}let y=()=>{if(u)return;let e=x(r(),0,1)*(c-1);o?f=e:(f+=(e-f)*l,.01>Math.abs(e-f)&&(f=e)),w(Math.round(f)),b=requestAnimationFrame(y)};b=requestAnimationFrame(y);let A=()=>k();return window.addEventListener("resize",A),window.addEventListener("orientationchange",A),k(),{loaded:()=>p,destroy:()=>{for(let e of(u=!0,cancelAnimationFrame(b),window.removeEventListener("resize",A),window.removeEventListener("orientationchange",A),h))e&&(e.onload=null,e.onerror=null,e.src="");h.length=0,d.remove()}}}])},994555,545329,e=>{"use strict";var a=e.i(843476),t=e.i(271645),r=e.i(88653),i=e.i(846932),n=e.i(772328),s=e.i(207761),o=e.i(719381),l=e.i(912469),c=e.i(801583);let d="/evora/configurator/base.webp",m=[{id:"patagonia",label:{en:"Patagonia",ar:"باتاغونيا"},swatch:"/evora/configurator/swatches/patagonia.jpg",image:"/evora/configurator/base.webp",note:{en:"Storm-grey movement, a statement island",ar:"حركة رماديّة كالعاصفة، جزيرة تلفت الأنظار"}},{id:"calacatta-gold",label:{en:"Calacatta Gold",ar:"كالاكاتا غولد"},swatch:"/evora/configurator/swatches/calacatta-gold.jpg",image:"/evora/configurator/surface-calacatta-gold.webp",note:{en:"Warm gold veining, quiet wealth",ar:"عروقٌ ذهبية دافئة، ثراءٌ هادئ"}},{id:"emperador",label:{en:"Emperador",ar:"إمبرادور"},swatch:"/evora/configurator/swatches/emperador.jpg",image:"/evora/configurator/surface-emperador.webp",note:{en:"Deep brown, soft light",ar:"بنيٌّ عميق وضوءٌ ناعم"}},{id:"nero-marquina",label:{en:"Nero Marquina",ar:"نيرو مركينا"},swatch:"/evora/configurator/swatches/nero-marquina.jpg",image:"/evora/configurator/surface-nero-marquina.webp",note:{en:"Black marble, white lightning, for the bold",ar:"رخامٌ أسود ببرقٍ أبيض، لمن يجرؤ"}},{id:"verde-alpi",label:{en:"Verde Alpi",ar:"فيردي ألبي"},swatch:"/evora/configurator/swatches/verde-alpi.jpg",image:"/evora/configurator/surface-verde-alpi.webp",note:{en:"Forest green, rare and alive",ar:"أخضرُ غابيٌّ نادر وحيّ"}},{id:"travertine",label:{en:"Travertine",ar:"ترافرتين"},swatch:"/evora/configurator/swatches/travertine.jpg",image:"/evora/configurator/surface-travertine.webp",note:{en:"Sand-toned, honest stone",ar:"حجرٌ رمليٌّ صادق"}}];e.s(["CONFIG_BASE",0,d,"SURFACES",0,m],545329);var h=e.i(337088),p=e.i(683406);let f={wa:{en:"Ask on WhatsApp",ar:"اسأل عبر واتساب"},wa_msg:{en:"Hi Evora — I'd like to talk about a bespoke kitchen island.",ar:"مرحبًا إيفورا — أودّ التحدث عن جزيرة مطبخ حسب الطلب."},cfg_instruct:{en:"Pick a stone — your island re-renders live.",ar:"اختر حجرًا — تتبدّل الجزيرة أمامك."},cfg_active_label:{en:"Selected stone",ar:"الحجر المختار"},make_eyebrow:{en:"From plan to kitchen",ar:"من المخطط إلى المطبخ"},make_heading:{en:"How a bespoke island is made",ar:"كيف تُصنع جزيرة حسب الطلب"},make_lead:{en:"No catalogue numbers, no guesswork — three steps from the stone you choose to the island standing in your home.",ar:"لا أرقام كتالوج ولا تخمين — ثلاث خطوات من الحجر الذي تختاره إلى الجزيرة في منزلك."},s1_n:{en:"01",ar:"٠١"},s1_t:{en:"Choose your stone",ar:"اختر حجرك"},s1_b:{en:"Sit with our designers in Khalda and settle the marble, finish and proportions — exactly as you saw them on screen.",ar:"اجلس مع مصمّمينا في خلدا واختر الرخام والتشطيب والمقاسات — تمامًا كما رأيتها على الشاشة."},s2_n:{en:"02",ar:"٠٢"},s2_t:{en:"We cut it in our workshop",ar:"نصنعها في ورشتنا"},s2_b:{en:"Your island is built to order by our own makers in Amman — one slab, measured and finished by hand.",ar:"تُصنع جزيرتك خصيصًا على أيدي صنّاعنا في عمّان — لوحٌ واحد، يُقاس ويُشطَّب يدويًا."},s3_n:{en:"03",ar:"٠٣"},s3_t:{en:"We fit it in your home",ar:"نركّبها في منزلك"},s3_b:{en:"We deliver and install it ourselves, then leave the room looking exactly the way you decided it would.",ar:"نوصّلها ونركّبها بأنفسنا، ثم نترك الغرفة كما قرّرتها أنت تمامًا."}},g=e=>String(e).padStart(4,"0"),_=`
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
`;e.s(["default",0,function(){let{t:e,lang:u}=(0,s.useT)(),b=e=>f[e][u],x=(0,n.useReducedMotion)(),k=[.22,1,.36,1],v=`${c.WHATSAPP}?text=${encodeURIComponent(f.wa_msg[u])}`,w=(0,t.useRef)(null),y=(0,t.useRef)(null),A=(0,t.useRef)(null),[j,N]=(0,t.useState)(!1),[q,L]=(0,t.useState)(!1),[E,M]=(0,t.useState)(!1),[S,z]=(0,t.useState)(!1),[R,C]=(0,t.useState)(null),P=e=>{let a=R??h.SAFE_FRAME_EXT;return S?`/evora/config-frames-mobile/frame_${g(e)}.${a}`:`/evora/config-frames/frame_${g(e)}.${a}`};(0,t.useEffect)(()=>{let e=window.matchMedia("(max-width: 768px)"),a=()=>z(e.matches);return a(),e.addEventListener("change",a),()=>e.removeEventListener("change",a)},[]),(0,t.useEffect)(()=>{(0,h.resolveFrameExt)().then(C)},[]),(0,t.useEffect)(()=>{if(!R)return;let e=e=>"avif"===R?e.replace(/\.webp$/i,".avif"):e,a=new Set;for(let t of m)a.add(e(t.image)),/^\/evora\/configurator\/surface-[a-z0-9-]+\.webp$/.test(t.image)&&a.add(e(t.image.replace(/\.webp$/,"-mobile.webp")));let t=Array.from(a,e=>{let a=new Image;return a.decoding="async",a.src=e,a});return()=>{t.length=0}},[R]);let[$,F]=(0,t.useState)(m),[B,I]=(0,t.useState)(m[0].id),T=$.find(e=>e.id===B)??$[0];(0,t.useEffect)(()=>{let e=w.current,a=A.current;if(!e||!a||!R)return;let t=window.innerHeight,r=()=>{let e=y.current?.getBoundingClientRect();t=e&&e.height>0?e.height:window.innerHeight};r();let i=()=>{let a=e.getBoundingClientRect(),r=e.offsetHeight-t;return r>0?Math.min(1,Math.max(0,-a.top/r)):0},n=()=>Math.min(1,i()/.78),s=null,o=0,l=()=>{let t;if(!((t=e.getBoundingClientRect()).top<2*window.innerHeight&&t.bottom>-window.innerHeight)){o=window.setTimeout(l,200);return}s=(0,p.createFrameScrub)({container:a,frames:(0,p.budgetFrames)(169,P),className:"cfg__canvas",progress:n,reduce:!!x,onFirstFrame:()=>{N(!0),L(!0)}})};l();let c=0,d=!1,m=()=>{let e=i()>.8;e!==d&&(d=e,M(e)),c=requestAnimationFrame(m)};c=requestAnimationFrame(m);let h=()=>r();return window.addEventListener("resize",h),window.addEventListener("orientationchange",h),()=>{cancelAnimationFrame(c),window.removeEventListener("resize",h),window.removeEventListener("orientationchange",h),window.clearTimeout(o),s?.destroy()}},[x,R,S,169]);let W=T?.image===d||T?.id===m[0].id,H=e=>"avif"===R?e.replace(/\.webp$/i,".avif"):e,Y=H(S&&T&&/^\/evora\/configurator\/surface-[a-z0-9-]+\.webp$/.test(T.image)?T.image.replace(/\.webp$/,"-mobile.webp"):T?.image??"")||T?.image,O=[{n:b("s1_n"),title:b("s1_t"),body:b("s1_b")},{n:b("s2_n"),title:b("s2_t"),body:b("s2_b")},{n:b("s3_n"),title:b("s3_t"),body:b("s3_b")}];return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("section",{id:"configurator",ref:w,className:`cfg ${S?"cfg--mobile":""}`,children:(0,a.jsxs)("div",{className:"cfg__sticky",ref:y,children:[(0,a.jsx)("div",{ref:A,className:`cfg__stage${q?" is-painted":""}`,role:"img","aria-label":e("cfg_aria")}),!q&&(0,a.jsxs)("picture",{children:[(0,a.jsx)("source",{media:"(max-width: 768px)",srcSet:`/evora/config-frames-mobile/frame_${g(169)}.${R??h.SAFE_FRAME_EXT}`}),(0,a.jsx)("img",{src:`/evora/config-frames/frame_${g(169)}.${R??h.SAFE_FRAME_EXT}`,alt:"",className:"cfg__poster","aria-hidden":!0})]}),(0,a.jsx)(r.AnimatePresence,{mode:"popLayout",children:E&&!W&&T&&(0,a.jsx)(i.motion.img,{src:Y,alt:"",className:"cfg__variant",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.5,ease:k},onError:e=>{let a=e.currentTarget;T&&/-mobile\.(webp|avif)$/i.test(a.src)&&!a.dataset.fellback?(a.dataset.fellback="1",a.src=H(T.image)):a.style.opacity="0"}},T.id)}),(0,a.jsx)("div",{className:"cfg__scrim"}),(0,a.jsxs)(i.motion.div,{className:"cfg__intro",animate:{opacity:+!E},transition:{duration:.4},children:[(0,a.jsx)("span",{className:"eyebrow",style:{color:"var(--brass-2)"},children:e("cfg_eyebrow")}),(0,a.jsx)("h2",{className:"display cfg__h",children:e("cfg_heading")}),(0,a.jsx)("p",{className:"cfg__lead",children:e("cfg_lead")})]}),(0,a.jsx)(r.AnimatePresence,{children:E&&(0,a.jsxs)(i.motion.div,{className:"cfg__panel",initial:{opacity:0,y:24},animate:{opacity:1,y:0},exit:{opacity:0,y:24},transition:{duration:.5,ease:k},children:[(0,a.jsx)("span",{className:"eyebrow cfg__panel-eyebrow",style:{color:"var(--brass-2)"},children:e("cfg_panel_eyebrow")}),(0,a.jsx)("p",{className:"cfg__instruct",children:b("cfg_instruct")}),(0,a.jsxs)("div",{className:"cfg__panel-head",children:[(0,a.jsx)("span",{className:"cfg__active-kicker",children:b("cfg_active_label")}),(0,a.jsx)(r.AnimatePresence,{mode:"wait",children:(0,a.jsx)(i.motion.strong,{className:"cfg__active-name",initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.3,ease:k},children:T?T.label[u]:""},T?T.id:"none")})]}),(0,a.jsx)(r.AnimatePresence,{mode:"wait",children:T&&T.note&&(0,a.jsx)(i.motion.p,{className:"cfg__note",initial:{opacity:0,y:6},animate:{opacity:1,y:0},exit:{opacity:0,y:-6},transition:{duration:.35,ease:k},children:T.note[u]},T.id)}),(0,a.jsxs)("div",{className:"cfg__swatches",children:[$.map(e=>{let t=e.swatch.startsWith("/")||e.swatch.startsWith("blob:")||e.swatch.startsWith("http");return(0,a.jsx)("button",{type:"button",className:`cfg__swatch ${B===e.id?"is-active":""}`,onClick:()=>I(e.id),"aria-label":e.label[u],"aria-pressed":B===e.id,title:e.label[u],style:t?{backgroundImage:`url(${e.swatch})`,backgroundSize:"cover"}:{background:e.swatch}},e.id)}),(0,a.jsxs)("label",{className:"cfg__swatch cfg__upload",title:"en"===u?"Upload an image":"ارفع صورة",children:[(0,a.jsx)("input",{type:"file",accept:"image/*",onChange:e=>{let a=e.target.files?.[0];if(!a)return;let t=URL.createObjectURL(a),r=`upload-${$.length}`,i=a.name.replace(/\.[^.]+$/,"");F(e=>[...e,{id:r,label:{en:i,ar:i},swatch:t,image:t}]),I(r),e.target.value=""},hidden:!0}),(0,a.jsx)("span",{children:"＋"})]})]}),(0,a.jsxs)("div",{className:"cfg__cta",children:[(0,a.jsxs)("button",{type:"button",className:"btn cfg__cta-1",onClick:l.openStartProject,children:[e("cfg_cta")," ",(0,a.jsx)("span",{className:"arrow",children:"→"})]}),(0,a.jsx)("a",{href:v,target:"_blank",rel:"noopener noreferrer",className:"cfg__cta-wa",children:b("wa")})]})]})})]})}),(0,a.jsx)("section",{className:"cfg-make",children:(0,a.jsxs)("div",{className:"cfg-make__inner",children:[(0,a.jsxs)(o.Rise,{as:"header",className:"cfg-make__head",children:[(0,a.jsx)("span",{className:"eyebrow",style:{color:"var(--brass-2)"},children:b("make_eyebrow")}),(0,a.jsx)("h2",{className:"display cfg-make__h",children:b("make_heading")}),(0,a.jsx)("p",{className:"cfg-make__lead",children:b("make_lead")})]}),(0,a.jsx)("div",{className:"cfg-make__grid",children:O.map((e,t)=>(0,a.jsxs)(o.Rise,{as:"article",delay:.08*(t+1),className:"cfg-make__step",children:[(0,a.jsx)("span",{className:"cfg-make__num",children:e.n}),(0,a.jsx)("h3",{className:"cfg-make__step-t",children:e.title}),(0,a.jsx)("p",{className:"cfg-make__step-b",children:e.body})]},e.n))}),(0,a.jsxs)(o.Rise,{className:"cfg-make__cta",delay:.34,children:[(0,a.jsxs)("button",{type:"button",className:"btn cfg-make__cta-1",onClick:l.openStartProject,children:[e("cfg_cta")," ",(0,a.jsx)("span",{className:"arrow",children:"→"})]}),(0,a.jsx)("a",{href:v,target:"_blank",rel:"noopener noreferrer",className:"cfg-make__cta-wa",children:b("wa")})]})]})}),(0,a.jsx)("style",{children:_})]})}],994555)},950198,e=>{"use strict";var a=e.i(843476),t=e.i(342724),r=e.i(56691),i=e.i(994555),n=e.i(207761),s=e.i(719381),o=e.i(545329),l=e.i(912469);let c={eyebrow:{en:"The Stone Library",ar:"مكتبة الحجر"},heading:{en:"Five stones, five kitchens",ar:"خمسة أحجار، خمسة مطابخ"},lead:{en:"Every finish here is a real option, shown in a kitchen built around it. From storm-grey Patagonia to sand-toned Travertine — scroll back up to try one live on your own island.",ar:"كل تشطيب هنا خيارٌ حقيقي، معروضٌ في مطبخٍ صُمّم حوله. من باتاغونيا الرمادي كالعاصفة إلى الترافرتين الرملي — عد إلى الأعلى لتجرّبه مباشرة على جزيرتك."},cta:{en:"Try them live in the configurator",ar:"جرّبها مباشرة في المُصمِّم"},hint:{en:"Send your plan",ar:"أرسل مخططك"},card_aria:{en:"{stone} — send us your floor plan and we'll design your kitchen",ar:"{stone} — أرسل لنا مخطط منزلك ونصمّم مطبخك"}},d={patagonia:"/evora/kitchens/patagonia","calacatta-gold":"/evora/kitchens/calacatta-gold",emperador:"/evora/kitchens/emperador","verde-alpi":"/evora/kitchens/verde-alpi",travertine:"/evora/kitchens/travertine"};function m(){let{t:e,lang:t,dir:r}=(0,n.useT)(),i=e=>c[e][t];return(0,a.jsxs)("section",{id:"kitchen-materials",className:"kmat",dir:r,lang:t,children:[(0,a.jsxs)("div",{className:"container",children:[(0,a.jsxs)("div",{className:"kmat__head",children:[(0,a.jsx)(s.Rise,{as:"span",className:"eyebrow kmat__eyebrow",children:i("eyebrow")}),(0,a.jsx)(s.Rise,{as:"h2",delay:.06,className:"display kmat__h",children:i("heading")}),(0,a.jsx)(s.Rise,{as:"p",delay:.12,className:"kmat__lead",children:i("lead")})]}),(0,a.jsx)(s.Stagger,{className:"kmat__grid",gap:.07,children:o.SURFACES.filter(e=>d[e.id]).map(e=>(0,a.jsx)(s.StaggerItem,{className:"kmat__item",children:(0,a.jsxs)("a",{href:"/start",className:"kmat__card","data-cursor":"hover","aria-label":i("card_aria").replace("{stone}",e.label[t]),onClick:e=>{e.metaKey||e.ctrlKey||e.shiftKey||0!==e.button||(e.preventDefault(),(0,l.openStartProject)())},children:[(0,a.jsxs)("span",{className:"kmat__imgwrap",children:[(0,a.jsxs)("picture",{children:[(0,a.jsx)("source",{srcSet:`${d[e.id]}.avif`,type:"image/avif"}),(0,a.jsx)("img",{src:`${d[e.id]}.webp`,alt:e.label[t],className:"kmat__img",loading:"lazy",decoding:"async"})]}),(0,a.jsx)("span",{className:"kmat__scrim","aria-hidden":!0})]}),(0,a.jsx)("span",{className:"kmat__swatch","aria-hidden":!0,style:{backgroundImage:`url(${e.swatch})`}}),(0,a.jsxs)("span",{className:"kmat__meta",children:[(0,a.jsx)("h3",{className:"kmat__name display",children:e.label[t]}),e.note&&(0,a.jsx)("span",{className:"kmat__note",children:e.note[t]}),(0,a.jsxs)("span",{className:"kmat__hint",children:[i("hint")," ",(0,a.jsx)("span",{className:"kmat__hintarrow","aria-hidden":!0,children:"→"})]})]})]})},e.id))}),(0,a.jsx)(s.Rise,{delay:.1,className:"kmat__foot",children:(0,a.jsxs)("a",{href:"#configurator",className:"kmat__more","data-cursor":"hover",children:[(0,a.jsx)("span",{children:i("cta")}),(0,a.jsx)("span",{className:"kmat__morearrow","aria-hidden":!0,children:"↑"})]})})]}),(0,a.jsx)("style",{children:h})]})}let h=`
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
`;var p=e.i(987718);let f={eyebrow:{en:"Why a bespoke Evora kitchen",ar:"لماذا مطبخ إيفورا حسب الطلب"},heading:{en:"One workshop, start to finish",ar:"ورشة واحدة، من الفكرة حتى التسليم"},lead:{en:"Your island isn't picked off a shelf. The same studio that designs it also cuts, finishes and installs it — under one roof, in Amman.",ar:"جزيرتك لا تُنتقى من على رف. الاستوديو نفسه الذي يصمّمها يقصّها ويشطّبها ويركّبها — تحت سقف واحد، في عمّان."},photoCaption:{en:"An Evora kitchen island, built in Amman",ar:"جزيرة مطبخ من إيفورا، صُنعت في عمّان"},f1_t:{en:"Cut to order, in our workshop",ar:"تُقصّ حسب الطلب، في ورشتنا"},f1_b:{en:"No catalogue numbers — one slab, measured and finished by hand by our own makers in Amman.",ar:"بلا أرقام كتالوج — لوحٌ واحد، يُقاس ويُشطَّب يدويًا على أيدي صنّاعنا في عمّان."},f2_t:{en:"One design team, start to finish",ar:"فريق تصميم واحد، من البداية للنهاية"},f2_b:{en:"The same team that helps you choose the stone sees the project through to delivery — part of Evora's complimentary design service.",ar:"الفريق نفسه الذي يساعدك على اختيار الحجر يرافق مشروعك حتى التسليم — ضمن خدمة التصميم المجانية من إيفورا."},f3_t:{en:"Delivered and installed by us",ar:"نوصّلها ونركّبها بأنفسنا"},f3_b:{en:"Our own team fits every island in place, so nothing is lost between the workshop and your kitchen.",ar:"فريقنا نفسه يركّب كل جزيرة في مكانها، حتى لا يضيع شيء بين الورشة ومطبخك."}},g="/evora/config-frames/frame_0001.webp";function _(){let{t:e,lang:t,dir:r}=(0,n.useT)(),i=e=>f[e][t],o=[{n:"01",t:i("f1_t"),b:i("f1_b")},{n:"02",t:i("f2_t"),b:i("f2_b")},{n:"03",t:i("f3_t"),b:i("f3_b")},{n:"04",t:e("fin_title"),b:e("fin_body")}];return(0,a.jsxs)("section",{id:"kitchen-craft",className:"kcr",dir:r,lang:t,children:[(0,a.jsxs)("div",{className:"container kcr__grid",children:[(0,a.jsxs)(s.Rise,{className:"kcr__photo",children:[(0,a.jsxs)("picture",{children:[(0,a.jsx)("source",{srcSet:(0,p.avifSrc)(g),type:"image/avif"}),(0,a.jsx)("img",{src:g,alt:i("photoCaption"),className:"kcr__img",loading:"lazy",decoding:"async"})]}),(0,a.jsx)("span",{className:"kcr__photoscrim","aria-hidden":!0}),(0,a.jsx)("span",{className:"kcr__photocap",children:i("photoCaption")})]}),(0,a.jsxs)("div",{className:"kcr__body",children:[(0,a.jsx)("span",{className:"eyebrow kcr__eyebrow",children:i("eyebrow")}),(0,a.jsx)(s.Rise,{as:"h2",delay:.06,className:"display kcr__h",children:i("heading")}),(0,a.jsx)(s.Rise,{as:"p",delay:.12,className:"kcr__lead",children:i("lead")}),(0,a.jsx)(s.Stagger,{className:"kcr__list",gap:.08,delay:.1,children:o.map(e=>(0,a.jsxs)(s.StaggerItem,{className:"kcr__item",children:[(0,a.jsx)("span",{className:"kcr__n",children:e.n}),(0,a.jsxs)("span",{className:"kcr__itembody",children:[(0,a.jsx)("strong",{className:"kcr__itemt",children:e.t}),(0,a.jsx)("span",{className:"kcr__itemb",children:e.b})]})]},e.n))})]})]}),(0,a.jsx)("style",{children:u})]})}let u=`
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
`;var b=e.i(271645),x=e.i(846932),k=e.i(88653);let v=[.22,1,.36,1],w={cta:{en:"Book a kitchen consultation",ar:"احجز استشارة مطبخك"},q1:{en:"Is every kitchen island really made to order?",ar:"هل كل جزيرة مطبخ تُصنع فعلًا حسب الطلب؟"},a1:{en:"Yes. Every Evora island is built to order in our own workshop — one slab, measured and finished by hand, not a stock item off a shelf.",ar:"نعم. كل جزيرة من إيفورا تُصنع خصيصًا في ورشتنا — لوحٌ واحد، يُقاس ويُشطَّب يدويًا، وليست قطعة جاهزة من مخزن."},q2:{en:"Which stones can I choose from?",ar:"من أي حجر يمكنني الاختيار؟"},a2:{en:"Six, so far — Patagonia, Calacatta Gold, Emperador, Nero Marquina, Verde Alpi and Travertine. Scroll up to preview each on the island live.",ar:"ستة حتى الآن — باتاغونيا، وكالاكاتا غولد، وإمبرادور، ونيرو مركينا، وفيردي ألبي، وترافرتين. عد إلى الأعلى لمعاينة كل واحد على الجزيرة مباشرة."},q3:{en:"Do you install the island yourselves?",ar:"هل تركّبون الجزيرة بأنفسكم؟"},a3:{en:"Yes — our own team delivers and installs every island, so nothing is handed off to a third party between the workshop and your kitchen.",ar:"نعم — فريقنا نفسه يوصّل ويركّب كل جزيرة، فلا شيء يُسلَّم لطرف ثالث بين الورشة ومطبخك."},q4:{en:"Can I pay in installments?",ar:"هل يمكنني التقسيط؟"},a4:{en:"Yes — buy at the cash price and spread it over up to 36 months through Safwa Islamic Bank, with no interest and no hidden cost.",ar:"نعم — اشترِ بسعر الكاش وقسّطه على مدى ٣٦ شهرًا عبر بنك صفوة الإسلامي، بدون فوائد وبدون أي تكلفة خفية."},q5:{en:"Is design help included?",ar:"هل خدمة التصميم مشمولة؟"},a5:{en:"Yes — our design studio guides the marble, finish and proportions with you, as part of Evora's complimentary interior-design service.",ar:"نعم — يرافقك استوديو التصميم لدينا في اختيار الرخام والتشطيب والمقاسات، ضمن خدمة التصميم الداخلي المجانية من إيفورا."},q6:{en:"How do I start?",ar:"كيف أبدأ؟"},a6:{en:"Book a consultation below, visit our Khalda showroom, or message us on WhatsApp — whichever is easiest for you.",ar:"احجز استشارة أدناه، أو زُر معرضنا في خلدا، أو راسلنا عبر واتساب — أيّهما أسهل لك."}};function y(){let{t:e,lang:t,dir:r}=(0,n.useT)(),i=e=>w[e][t],[o,c]=(0,b.useState)(0),d=[{q:i("q1"),a:i("a1")},{q:i("q2"),a:i("a2")},{q:i("q3"),a:i("a3")},{q:i("q4"),a:i("a4")},{q:i("q5"),a:i("a5")},{q:i("q6"),a:i("a6")}];return(0,a.jsxs)("section",{id:"kitchen-faq",className:"section kfaq",dir:r,lang:t,children:[(0,a.jsxs)("div",{className:"container",children:[(0,a.jsxs)("div",{className:"kfaq__head",children:[(0,a.jsx)(s.Rise,{children:(0,a.jsx)("span",{className:"eyebrow",style:{color:"var(--brass)"},children:e("faq_eyebrow")})}),(0,a.jsx)("h2",{className:"kfaq__titlewrap",children:(0,a.jsx)(s.RevealLines,{lines:[e("faq_title")],className:"display kfaq__title",delay:.08})})]}),(0,a.jsx)(s.Rise,{delay:.1,children:(0,a.jsx)("div",{className:"kfaq__list",children:d.map((e,t)=>{let r=o===t,i=`kfaq-panel-${t}`,n=`kfaq-q-${t}`;return(0,a.jsxs)("div",{className:"kfaq__row",children:[(0,a.jsx)("h3",{className:"kfaq__qheading",children:(0,a.jsxs)("button",{type:"button",id:n,className:"kfaq__q","data-cursor":"hover","aria-expanded":r,"aria-controls":i,onClick:()=>c(r?null:t),children:[(0,a.jsx)("span",{className:"kfaq__qtext",children:e.q}),(0,a.jsx)(x.motion.span,{className:"kfaq__icon","aria-hidden":"true",animate:{rotate:45*!!r},transition:{duration:.4,ease:v},children:"+"})]})}),(0,a.jsx)(k.AnimatePresence,{initial:!1,children:r&&(0,a.jsx)(x.motion.div,{id:i,role:"region","aria-labelledby":n,className:"kfaq__awrap",initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.4,ease:v},style:{overflow:"hidden"},children:(0,a.jsx)("p",{className:"kfaq__a",children:e.a})})})]},t)})})}),(0,a.jsx)(s.Rise,{delay:.16,className:"kfaq__cta",children:(0,a.jsxs)("button",{type:"button",className:"btn btn-solid",onClick:l.openStartProject,children:[i("cta")," ",(0,a.jsx)("span",{className:"arrow",children:"→"})]})})]}),(0,a.jsx)("style",{children:`
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
      `})]})}var A=e.i(801583);let j={eyebrow:{en:"Start your kitchen",ar:"ابدأ مطبخك"},heading:{en:"Let's design your kitchen.",ar:"لنصمّم مطبخك."},lead:{en:"Book a consultation at our Khalda showroom, or send us a message — we'll walk you through the stone, proportions and finish, then take it from your idea to installed.",ar:"احجز استشارة في معرضنا بخلدا، أو راسلنا مباشرة — نأخذك خطوة بخطوة في اختيار الحجر والمقاسات والتشطيب، ثم ننقل فكرتك من الورشة حتى التركيب."},wa_msg:{en:"Hi Evora! I'd like to discuss a bespoke kitchen island for my home.",ar:"مرحبًا إيفورا! أودّ التحدث عن جزيرة مطبخ حسب الطلب لمنزلي."},visit_label:{en:"Visit the showroom",ar:"زُر المعرض"},call_label:{en:"Call us",ar:"اتصل بنا"},wa_label2:{en:"Message us",ar:"راسلنا"},visit_link:{en:"Full showroom details",ar:"تفاصيل المعرض كاملة"}};function N(){let{t:e,lang:t,dir:r}=(0,n.useT)(),i=e=>j[e][t],o=`${A.WHATSAPP}?text=${encodeURIComponent(i("wa_msg"))}`,c=[{k:i("visit_label"),v:e("visit_addr"),sub:e("visit_hours"),href:"https://www.google.com/maps/dir/?api=1&destination=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman"},{k:i("call_label"),v:A.PHONE_PRIMARY,sub:A.PHONE_SECONDARY,href:`tel:${A.PHONE_PRIMARY_TEL}`},{k:i("wa_label2"),v:e("wa_label"),sub:A.PHONE_SECONDARY,href:o}];return(0,a.jsxs)("section",{id:"kitchen-enquiry",className:"keq",dir:r,lang:t,children:[(0,a.jsxs)("div",{className:"container keq__inner",children:[(0,a.jsxs)(s.Rise,{as:"header",className:"keq__head",children:[(0,a.jsx)("span",{className:"eyebrow keq__eyebrow",children:i("eyebrow")}),(0,a.jsx)("h2",{className:"display keq__h",children:i("heading")}),(0,a.jsx)("p",{className:"keq__lead",children:i("lead")}),(0,a.jsxs)("div",{className:"keq__cta",children:[(0,a.jsx)(s.Magnetic,{strength:.28,children:(0,a.jsxs)("button",{type:"button",className:"btn keq__cta-1",onClick:l.openStartProject,children:[e("cfg_cta")," ",(0,a.jsx)("span",{className:"arrow",children:"→"})]})}),(0,a.jsx)("a",{href:o,target:"_blank",rel:"noopener noreferrer",className:"keq__cta-wa",children:e("wa_label")})]})]}),(0,a.jsx)(s.Rise,{delay:.12,as:"ul",className:"keq__info",children:c.map((e,t)=>(0,a.jsx)("li",{className:"keq__row",children:(0,a.jsxs)("a",{className:"keq__rowlink",href:e.href,target:e.href.startsWith("http")?"_blank":void 0,rel:e.href.startsWith("http")?"noopener noreferrer":void 0,children:[(0,a.jsx)("span",{className:"keq__rowk",children:e.k}),(0,a.jsx)("span",{className:"keq__rowv",children:e.v}),(0,a.jsx)("span",{className:"keq__rowsub",children:e.sub})]})},t))}),(0,a.jsx)(s.Rise,{delay:.18,className:"keq__foot",children:(0,a.jsxs)("a",{href:"/visit",className:"keq__more",children:[i("visit_link")," ",(0,a.jsx)("span",{"aria-hidden":!0,children:"↗"})]})})]}),(0,a.jsx)("style",{children:q})]})}let q=`
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
`;e.s(["default",0,function(){return(0,a.jsxs)("main",{children:[(0,a.jsx)(t.default,{}),(0,a.jsx)(i.default,{}),(0,a.jsx)(m,{}),(0,a.jsx)(_,{}),(0,a.jsx)(y,{}),(0,a.jsx)(N,{}),(0,a.jsx)(r.default,{})]})}],950198)}]);