(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,871522,e=>{"use strict";var t=e.i(843476),a=e.i(271645);let r={ink:"var(--ink)",paper:"var(--paper)",brass:"var(--brass-2)"};e.s(["default",0,function({tone:e,tagline:i=!0,draw:n=!1,drawMs:s=900,title:o="EVORA — Future Home",className:l,style:p}){let d=(0,a.useId)().replace(/[:]/g,""),c=e?r[e]:"currentColor";return(0,t.jsxs)("svg",{viewBox:i?"0 0 730 316":"0 0 730 186",role:"img","aria-label":o,className:l,style:{display:"block",color:c,overflow:"visible",...p},"data-draw":n?"on":void 0,children:[(0,t.jsx)("title",{children:o}),n&&(0,t.jsx)("style",{children:`
          [data-draw="on"] .ev-p {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: ev-draw-${d} ${s}ms cubic-bezier(0.22,1,0.36,1) forwards;
          }
          @keyframes ev-draw-${d} { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) {
            [data-draw="on"] .ev-p { stroke-dasharray: none; stroke-dashoffset: 0; animation: none; }
          }
        `}),(0,t.jsxs)("g",{fill:"none",stroke:c,strokeWidth:15,strokeLinecap:"square",strokeLinejoin:"miter",children:[(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 28 L30 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 28 L118 28"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 93 L104 93"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 158 L118 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M152 28 L214 158 L276 28"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M363 28 A65 65 0 0 1 363 158 A65 65 0 0 1 363 28 Z"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M452 28 L452 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M452 28 L512 28 A33 33 0 0 1 512 94 L452 94"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M502 94 L548 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M580 158 L640 28 L700 158"})]}),i&&(0,t.jsxs)("g",{transform:"translate(178 222)",fill:"none",stroke:c,strokeWidth:7,strokeLinecap:"square",strokeLinejoin:"miter",children:[(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(0 0)",d:"M0 0 L0 30 M0 0 L20 0 M0 14 L16 14"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(34 0)",d:"M0 0 L0 19 A11 11 0 0 0 22 19 L22 0"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(70 0)",d:"M0 0 L24 0 M12 0 L12 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(108 0)",d:"M0 0 L0 19 A11 11 0 0 0 22 19 L22 0"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(144 0)",d:"M0 0 L0 30 M0 0 L16 0 A8 8 0 0 1 16 16 L0 16 M11 16 L22 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(180 0)",d:"M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(244 0)",d:"M0 0 L0 30 M22 0 L22 30 M0 15 L22 15"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(280 0)",d:"M12 0 A12 15 0 0 1 12 30 A12 15 0 0 1 12 0 Z"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(318 0)",d:"M0 30 L0 0 L12 18 L24 0 L24 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(356 0)",d:"M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30"})]})]})}])},772328,e=>{"use strict";var t=e.i(571164),a=e.i(138544),r=e.i(271645);e.s(["useReducedMotion",0,function(){t.hasReducedMotionListener.current||(0,a.initPrefersReducedMotion)();let[e]=(0,r.useState)(t.prefersReducedMotion.current);return e}])},801583,e=>{"use strict";e.s(["FOLLOWERS",0,"103K","HOMES",0,"2,400+","PHONE_PRIMARY",0,"+962 79 130 1444","PHONE_PRIMARY_TEL",0,"+962791301444","PHONE_SECONDARY",0,"+962 79 636 4105","WHATSAPP",0,"https://wa.me/962796364105"])},618566,(e,t,a)=>{t.exports=e.r(976562)},88653,e=>{"use strict";e.i(247167);var t=e.i(843476),a=e.i(271645),r=e.i(231178),i=e.i(947414),n=e.i(674008),s=e.i(821476),o=e.i(772846),l=a,p=e.i(737806);function d(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class c extends l.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if((0,o.isHTMLElement)(t)&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=t.offsetParent,a=(0,o.isHTMLElement)(e)&&e.offsetWidth||0,r=(0,o.isHTMLElement)(e)&&e.offsetHeight||0,i=getComputedStyle(t),n=this.props.sizeRef.current;n.height=parseFloat(i.height),n.width=parseFloat(i.width),n.top=t.offsetTop,n.left=t.offsetLeft,n.right=a-n.width-n.left,n.bottom=r-n.height-n.top,n.direction=i.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function m({children:e,isPresent:r,anchorX:i,anchorY:n,root:s,pop:o}){let h=(0,l.useId)(),f=(0,l.useRef)(null),g=(0,l.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:u}=(0,l.useContext)(p.MotionConfigContext),v=function(...e){return a.useCallback(function(...e){return t=>{let a=!1,r=e.map(e=>{let r=d(e,t);return a||"function"!=typeof r||(a=!0),r});if(a)return()=>{for(let t=0;t<r.length;t++){let a=r[t];"function"==typeof a?a():d(e[t],null)}}}}(...e),e)}(f,e.props?.ref??e?.ref);return(0,l.useInsertionEffect)(()=>{let{width:e,height:t,top:a,left:l,right:p,bottom:d,direction:c}=g.current;if(r||!1===o||!f.current||!e||!t)return;let m="rtl"===c,v="left"===i?m?`right: ${p}`:`left: ${l}`:m?`left: ${l}`:`right: ${p}`,x="bottom"===n?`bottom: ${d}`:`top: ${a}`;f.current.dataset.motionPopId=h;let b=document.createElement("style");u&&(b.nonce=u);let y=s??document.head;return y.appendChild(b),b.sheet&&b.sheet.insertRule(`
          [data-motion-pop-id="${h}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            ${v}px !important;
            ${x}px !important;
          }
        `),()=>{f.current?.removeAttribute("data-motion-pop-id"),y.contains(b)&&y.removeChild(b)}},[r]),(0,t.jsx)(c,{isPresent:r,childRef:f,sizeRef:g,pop:o,children:!1===o?e:l.cloneElement(e,{ref:v})})}let h=({children:e,initial:r,isPresent:n,onExitComplete:o,custom:l,presenceAffectsLayout:p,mode:d,anchorX:c,anchorY:h,root:g})=>{let u=(0,i.useConstant)(f),v=(0,a.useId)(),x=!0,b=(0,a.useMemo)(()=>(x=!1,{id:v,initial:r,isPresent:n,custom:l,onExitComplete:e=>{for(let t of(u.set(e,!0),u.values()))if(!t)return;o&&o()},register:e=>(u.set(e,!1),()=>u.delete(e))}),[n,u,o]);return p&&x&&(b={...b}),(0,a.useMemo)(()=>{u.forEach((e,t)=>u.set(t,!1))},[n]),a.useEffect(()=>{n||u.size||!o||o()},[n]),e=(0,t.jsx)(m,{pop:"popLayout"===d,isPresent:n,anchorX:c,anchorY:h,root:g,children:e}),(0,t.jsx)(s.PresenceContext.Provider,{value:b,children:e})};function f(){return new Map}var g=e.i(464978);let u=e=>e.key||"";function v(e){let t=[];return a.Children.forEach(e,e=>{(0,a.isValidElement)(e)&&t.push(e)}),t}e.s(["AnimatePresence",0,({children:e,custom:s,initial:o=!0,onExitComplete:l,presenceAffectsLayout:p=!0,mode:d="sync",propagate:c=!1,anchorX:m="left",anchorY:f="top",root:x})=>{let[b,y]=(0,g.usePresence)(c),w=(0,a.useMemo)(()=>v(e),[e]),_=c&&!b?[]:w.map(u),j=(0,a.useRef)(!0),k=(0,a.useRef)(w),A=(0,i.useConstant)(()=>new Map),N=(0,a.useRef)(new Set),[q,L]=(0,a.useState)(w),[z,M]=(0,a.useState)(w);(0,n.useIsomorphicLayoutEffect)(()=>{j.current=!1,k.current=w;for(let e=0;e<z.length;e++){let t=u(z[e]);_.includes(t)?(A.delete(t),N.current.delete(t)):!0!==A.get(t)&&A.set(t,!1)}},[z,_.length,_.join("-")]);let S=[];if(w!==q){let e=[...w];for(let t=0;t<z.length;t++){let a=z[t],r=u(a);_.includes(r)||(e.splice(t,0,a),S.push(a))}return"wait"===d&&S.length&&(e=S),M(v(e)),L(w),null}let{forceRender:E}=(0,a.useContext)(r.LayoutGroupContext);return(0,t.jsx)(t.Fragment,{children:z.map(e=>{let a=u(e),r=(!c||!!b)&&(w===z||_.includes(a));return(0,t.jsx)(h,{isPresent:r,initial:(!j.current||!!o)&&void 0,custom:s,presenceAffectsLayout:p,mode:d,root:x,onExitComplete:r?void 0:()=>{if(N.current.has(a)||!A.has(a))return;N.current.add(a),A.set(a,!0);let e=!0;A.forEach(t=>{t||(e=!1)}),e&&(E?.(),M(k.current),c&&y?.(),l&&l())},anchorX:m,anchorY:f,children:e},a)})})}],88653)},337088,e=>{"use strict";let t=null;e.s(["SAFE_FRAME_EXT",0,"webp","resolveFrameExt",0,function(){return t||(t=new Promise(e=>{if("u"<typeof Image)return void e("webp");let t=!1,a=a=>{t||(t=!0,e(a))},r=new Image;r.onload=()=>a(r.width>0&&r.height>0?"avif":"webp"),r.onerror=()=>a("webp"),r.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",window.setTimeout(()=>a("webp"),1500)}))}])},683406,e=>{"use strict";e.s(["budgetFrames",0,function(e,t,a=60){let r=Math.min(e,a);if(r<=1)return[t(1)];let i=[];for(let a=0;a<r;a++)i.push(t(1+Math.round(a*(e-1)/(r-1))));return i},"createFrameScrub",0,function(e){let{container:t,frames:a,progress:r,className:i,onFirstFrame:n,onProgress:s,reduce:o=!1,lerp:l=.16}=e,p=a.length,d=document.createElement("canvas");i&&(d.className=i),d.setAttribute("aria-hidden","true"),t.appendChild(d);let c=d.getContext("2d",{alpha:!1}),m=Array(p),h=0,f=0,g=-1,u=!1,v=!1,x=0,b=(e,t,a)=>Math.min(a,Math.max(t,e));function y(){let e=Math.min(window.devicePixelRatio||1,2),t=d.getBoundingClientRect(),a=Math.max(1,Math.round(t.width*e)),r=Math.max(1,Math.round(t.height*e));(d.width!==a||d.height!==r)&&(d.width=a,d.height=r,g=-1,_(Math.round(f)))}let w=e=>{let t=m[e];return!!t&&t.complete&&t.naturalWidth>0};function _(e){if(v||!c)return;let t=function(e){if(w(e))return e;for(let t=1;t<p;t++){if(e-t>=0&&w(e-t))return e-t;if(e+t<p&&w(e+t))return e+t}return -1}(b(e,0,p-1));!(t<0)&&t!==g&&(g=t,function(e){let t,a,r,i;if(!c)return;let n=d.width,s=d.height,o=e.naturalWidth/e.naturalHeight;n/s>o?(t=n,r=0,i=(s-(a=n/o))/2):(a=s,i=0,r=(n-(t=s*o))/2),c.drawImage(e,r,i,t,a)}(m[t]),u||(u=!0,n?.()))}for(let e=0;e<p;e++){let t=new Image;t.decoding="async",m[e]=t,t.onload=()=>{h++,s?.(h/p),0!==e&&u||(y(),_(Math.round(f)))},t.onerror=()=>{h++,s?.(h/p)},t.src=a[e]}let j=()=>{if(v)return;let e=b(r(),0,1)*(p-1);o?f=e:(f+=(e-f)*l,.01>Math.abs(e-f)&&(f=e)),_(Math.round(f)),x=requestAnimationFrame(j)};x=requestAnimationFrame(j);let k=()=>y();return window.addEventListener("resize",k),window.addEventListener("orientationchange",k),y(),{loaded:()=>h,destroy:()=>{for(let e of(v=!0,cancelAnimationFrame(x),window.removeEventListener("resize",k),window.removeEventListener("orientationchange",k),m))e&&(e.onload=null,e.onerror=null,e.src="");m.length=0,d.remove()}}}])},85576,e=>{"use strict";let t=[{key:"blueprint",en:"2D Blueprint",ar:"المخطط ثنائي الأبعاد",hint_en:"We receive your empty 2D plan — no furniture yet.",hint_ar:"نستلم مخططك ثنائي الأبعاد بدون أثاث.",phase:"design"},{key:"furniture",en:"Furniture Design",ar:"تصميم الأثاث",hint_en:"We design the furniture for your space and get your approval.",hint_ar:"نصمم الأثاث لمساحتك وننتظر موافقتك.",phase:"design"},{key:"design3d",en:"3D Design & Setup",ar:"التصميم ثلاثي الأبعاد",hint_en:"We build your space in 3D — kitchen, living, every room set up.",hint_ar:"نبني مساحتك ثلاثية الأبعاد — المطبخ والمعيشة وكل غرفة.",phase:"design"},{key:"render",en:"Photoreal Render",ar:"العرض الواقعي",hint_en:"We render photoreal images of the final look.",hint_ar:"ننتج صورًا واقعية للمظهر النهائي.",phase:"design"},{key:"materials",en:"Gathering Materials",ar:"تجهيز المواد",hint_en:"We source and gather all materials for production.",hint_ar:"نوفّر ونجهّز جميع المواد للإنتاج.",phase:"production"},{key:"finishing",en:"Production & Finishing",ar:"الإنتاج والتشطيب",hint_en:"Your pieces are built and finished by hand.",hint_ar:"تُصنع قطعك وتُشطّب يدويًا.",phase:"production"},{key:"delivery",en:"Delivery & Install",ar:"التسليم والتركيب",hint_en:"We deliver and install everything in your home.",hint_ar:"نسلّم ونركّب كل شيء في منزلك.",phase:"production"}];e.s(["JOURNEY",0,t,"stageIndex",0,e=>Math.max(0,t.findIndex(t=>t.key===e))])},987718,e=>{"use strict";e.s(["avifSrc",0,e=>e.replace(/\.(jpe?g|webp)$/i,".avif")])},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return o},formatWithValidation:function(){return p},urlObjectKeys:function(){return l}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let n=e.r(190809)._(e.r(998183)),s=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:a}=e,r=e.protocol||"",i=e.pathname||"",o=e.hash||"",l=e.query||"",p=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?p=t+e.host:a&&(p=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(p+=":"+e.port)),l&&"object"==typeof l&&(l=String(n.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||s.test(r))&&!1!==p?(p="//"+(p||""),i&&"/"!==i[0]&&(i="/"+i)):p||(p=""),o&&"#"!==o[0]&&(o="#"+o),d&&"?"!==d[0]&&(d="?"+d),i=i.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${r}${p}${i}${d}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function p(e){return o(e)}},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return i}});let r=e.r(271645);function i(e,t){let a=(0,r.useRef)(null),i=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(a.current=n(e,r)),t&&(i.current=n(t,r))},[e,t])}function n(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return n}});let r=e.r(718967),i=e.r(652817);function n(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,i.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return v},useLinkStatus:function(){return b}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let n=e.r(190809),s=e.r(843476),o=n._(e.r(271645)),l=e.r(195057),p=e.r(8372),d=e.r(818581),c=e.r(718967),m=e.r(405550);e.r(233525);let h=e.r(388540),f=e.r(91949),g=e.r(573668),u=e.r(509396);function v(t){var a,r;let i,n,v,[b,y]=(0,o.useOptimistic)(f.IDLE_LINK_STATUS),w=(0,o.useRef)(null),{href:_,as:j,children:k,prefetch:A=null,passHref:N,replace:q,shallow:L,scroll:z,onClick:M,onMouseEnter:S,onTouchStart:E,legacyBehavior:R=!1,onNavigate:C,transitionTypes:P,ref:T,unstable_dynamicOnHover:O,...I}=t;i=k,R&&("string"==typeof i||"number"==typeof i)&&(i=(0,s.jsx)("a",{children:i}));let B=o.default.useContext(p.AppRouterContext),F=!1!==A,W=!1!==A?null===(r=A)||"auto"===r?u.FetchStrategy.PPR:u.FetchStrategy.Full:u.FetchStrategy.PPR,D="string"==typeof(a=j||_)?a:(0,l.formatUrl)(a);if(R){if(i?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});n=o.default.Children.only(i)}let $=R?n&&"object"==typeof n&&n.ref:T,H=o.default.useCallback(e=>(null!==B&&(w.current=(0,f.mountLinkInstance)(e,D,B,W,F,y)),()=>{w.current&&((0,f.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,f.unmountPrefetchableInstance)(e)}),[F,D,B,W,y]),G={ref:(0,d.useMergedRef)(H,$),onClick(t){R||"function"!=typeof M||M(t),R&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(t),!B||t.defaultPrevented||function(t,a,r,i,n,s,l){if("u">typeof window){let p,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((p=t.currentTarget.getAttribute("target"))&&"_self"!==p||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,g.isLocalURL)(a)){i&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:c}=e.r(699781);o.default.startTransition(()=>{c(a,i?"replace":"push",!1===n?h.ScrollBehavior.NoScroll:h.ScrollBehavior.Default,r.current,l)})}}(t,D,w,q,z,C,P)},onMouseEnter(e){R||"function"!=typeof S||S(e),R&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),B&&F&&(0,f.onNavigationIntent)(e.currentTarget,!0===O)},onTouchStart:function(e){R||"function"!=typeof E||E(e),R&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),B&&F&&(0,f.onNavigationIntent)(e.currentTarget,!0===O)}};return(0,c.isAbsoluteUrl)(D)?G.href=D:R&&!N&&("a"!==n.type||"href"in n.props)||(G.href=(0,m.addBasePath)(D)),v=R?o.default.cloneElement(n,G):(0,s.jsx)("a",{...I,...G,children:i}),(0,s.jsx)(x.Provider,{value:b,children:v})}e.r(284508);let x=(0,o.createContext)(f.IDLE_LINK_STATUS),b=()=>(0,o.useContext)(x);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},750968,e=>{"use strict";var t=e.i(843476),a=e.i(271645),r=e.i(522016),i=e.i(207761),n=e.i(431487),s=e.i(85576),o=e.i(719381),l=e.i(846932),p=e.i(772328),d=e.i(88653),c=e.i(987718);let m=[{src:"/evora/kitchen/stage-1.jpg",en:"2D blueprint",ar:"مخطط ثنائي الأبعاد"},{src:"/evora/kitchen/stage-2.jpg",en:"Furnished in 2D",ar:"مفروش ثنائي الأبعاد"},{src:"/evora/kitchen/stage-3.jpg",en:"Built in 3D",ar:"مبني ثلاثي الأبعاد"},{src:"/evora/kitchen/stage-4.jpg",en:"Photoreal — approved",ar:"واقعي — معتمد"}];function h({step:e,ar:a}){let r=(0,p.useReducedMotion)(),i=Math.max(0,Math.min(3,e));return(0,t.jsxs)("div",{className:"ts-stage","aria-label":a?m[i].ar:m[i].en,children:[m.map((e,n)=>{let s=n===i;return(0,t.jsx)(l.motion.div,{className:"ts-frame",initial:!1,animate:{opacity:+!!s},transition:{duration:.7*!r,ease:"easeInOut"},style:{zIndex:s?2:1},children:(0,t.jsxs)("picture",{children:[(0,t.jsx)("source",{srcSet:(0,c.avifSrc)(e.src),type:"image/avif"}),(0,t.jsx)(l.motion.img,{src:e.src,alt:a?e.ar:e.en,loading:"lazy",decoding:"async",className:"ts-img",initial:!1,animate:r?{scale:1}:{scale:s?1.06:1},transition:{duration:7*!!s,ease:"linear"},draggable:!1})]})},n)}),(0,t.jsx)(d.AnimatePresence,{children:i>=3&&(0,t.jsx)(l.motion.div,{className:"ts-frame ts-video",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.8,ease:"easeOut"},style:{zIndex:3},children:(0,t.jsx)(f,{ar:a,reduced:!!r})})}),(0,t.jsx)("div",{className:"ts-scrim"}),(0,t.jsx)(d.AnimatePresence,{mode:"wait",children:(0,t.jsxs)(l.motion.div,{className:"ts-caption",initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.4},children:[(0,t.jsx)("span",{className:"ts-num",children:`0${i+1}`}),a?m[i].ar:m[i].en]},i)}),(0,t.jsx)("div",{className:"ts-dots","aria-hidden":!0,children:m.map((e,a)=>(0,t.jsx)("span",{className:`ts-dot${a===i?" on":a<i?" done":""}`},a))}),(0,t.jsx)("style",{children:`
        .ts-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 18px;
          overflow: hidden;
          background: #f3f0ea;
          border: 1px solid var(--line);
          box-shadow: 0 50px 110px -50px rgba(22,21,15,0.55);
        }
        .ts-frame { position: absolute; inset: 0; }
        .ts-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          will-change: transform, opacity;
        }
        .ts-video { pointer-events: none; }
        .ts-scrim {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background:
            linear-gradient(to bottom, rgba(22,21,15,0) 64%, rgba(22,21,15,0.28) 100%);
        }
        .ts-caption {
          position: absolute;
          left: 50%; bottom: 52px;
          transform: translateX(-50%);
          z-index: 4;
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--f-display), Georgia, serif;
          font-size: clamp(15px, 2.3vw, 20px);
          color: var(--ink);
          padding: 8px 18px;
          border-radius: 999px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid var(--line);
          white-space: nowrap;
          box-shadow: 0 10px 30px -16px rgba(22,21,15,0.5);
        }
        .ts-num { font-size: 0.72em; font-weight: 700; color: var(--brass); letter-spacing: 0.06em; }
        .ts-dots {
          position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%);
          z-index: 4; display: flex; gap: 8px;
        }
        .ts-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: rgba(255,255,255,0.55);
          box-shadow: 0 1px 3px rgba(22,21,15,0.3);
          transition: background .4s ease, width .4s ease;
        }
        .ts-dot.done { background: var(--clay); }
        .ts-dot.on { width: 22px; border-radius: 999px; background: var(--brass); }

        /* keep the caption + dots legible on narrow phones */
        @media (max-width: 560px) {
          .ts-caption {
            bottom: 38px; gap: 7px;
            font-size: 13px; padding: 6px 13px;
            max-width: calc(100% - 24px); white-space: normal; text-align: center;
          }
          .ts-dots { bottom: 15px; }
          .ts-dot.on { width: 18px; }
        }
      `})]})}function f({ar:e,reduced:a}){return(0,t.jsxs)(l.motion.div,{className:"ts-approved",initial:{scale:.7,opacity:0,y:10},animate:{scale:1,opacity:1,y:0},transition:{type:a?"tween":"spring",stiffness:200,damping:16,delay:.5*!a},style:{position:"absolute",top:16,insetInlineEnd:16,zIndex:4,display:"inline-flex",alignItems:"center",gap:8,fontFamily:"var(--f-display), Georgia, serif",fontSize:"clamp(13px,1.5vw,16px)",color:"#fff",padding:"8px 16px",borderRadius:999,background:"var(--ever)",border:"1px solid var(--brass-2)",boxShadow:"0 16px 40px -16px rgba(22,21,15,0.6)"},children:[(0,t.jsx)("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",children:(0,t.jsx)("path",{d:"M5 12.5 L10 17.5 L19 7",stroke:"var(--brass-2)",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round"})}),e?"تمت الموافقة":"Approved"]})}var g=e.i(912469);let u=[.22,1,.36,1],v={type:"spring",stiffness:320,damping:34},x=[{en:"Walls, rooms, dimensions — nothing else yet.",ar:"جدران وغرف وأبعاد — لا شيء آخر بعد."},{en:"Every piece placed to scale, to how you live.",ar:"كل قطعة موضوعة بالمقاس، وبأسلوب حياتك."},{en:"Walk it, spin it, see it from any angle.",ar:"تجوّل فيه، أدِره، شاهده من أي زاوية."},{en:"Approve once — then we build it for real.",ar:"اعتمده مرة — ثم نصنعه على الحقيقة."}];function b({ar:e}){return(0,t.jsxs)(l.motion.div,{initial:{opacity:0,y:40},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.8,ease:u},style:{marginTop:"clamp(3rem,7vw,6rem)",borderRadius:24,padding:"clamp(1.8rem,4vw,3.2rem)",background:"var(--ink)",color:"var(--paper)",overflow:"hidden",position:"relative"},children:[(0,t.jsxs)("div",{className:"pj-finale",style:{display:"grid",gap:"clamp(2rem,5vw,4rem)",gridTemplateColumns:"minmax(0,1fr) minmax(0,1.1fr)",alignItems:"center"},children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",fontSize:"0.72rem",letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--brass)"},children:[(0,t.jsx)(_,{active:!0})," ",e?"متابعة مباشرة":"Live tracking"]}),(0,t.jsx)("h2",{className:"display",style:{fontSize:"clamp(1.8rem,4vw,3rem)",margin:"1rem 0 0.9rem",fontWeight:360,lineHeight:1.1,color:"var(--paper)"},children:e?"ثم نصنعه — وأنت تشاهد":"Then we build it — and you watch"}),(0,t.jsx)("p",{style:{color:"rgba(245,242,235,0.72)",fontSize:"1.02rem",lineHeight:1.7,maxWidth:"44ch",margin:0},children:e?"بعد اعتمادك، يبدأ الإنتاج. يحدّث فريقنا كل مرحلة بالصور، وتظهر التحديثات فورًا في لوحتك — تجهيز المواد، التصنيع، التشطيب، حتى التركيب.":"After you approve, production begins. Our team updates each stage with photos, and updates appear instantly in your dashboard — sourcing materials, building, finishing, all the way to install."}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.8rem",marginTop:"1.8rem",flexWrap:"wrap"},children:[(0,t.jsx)(r.default,{href:"/dashboard",style:{padding:"0.85rem 1.5rem",borderRadius:999,background:"var(--clay)",color:"#fff",fontWeight:600,fontSize:"0.92rem",textDecoration:"none"},children:e?"افتح لوحتي":"Open my dashboard"}),(0,t.jsx)("button",{type:"button",onClick:g.openStartProject,style:{padding:"0.85rem 1.5rem",borderRadius:999,border:"1px solid rgba(245,242,235,0.3)",background:"transparent",color:"var(--paper)",fontWeight:500,fontSize:"0.92rem",cursor:"pointer",fontFamily:"var(--f-sans)"},children:e?"ابدأ مشروعًا":"Start a project"})]})]}),(0,t.jsxs)("div",{style:{background:"rgba(245,242,235,0.05)",border:"1px solid rgba(245,242,235,0.12)",borderRadius:18,padding:"1.4rem 1.5rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.1rem"},children:[(0,t.jsx)("span",{style:{fontFamily:"var(--f-display)",fontSize:"1.15rem",color:"var(--paper)"},children:e?"غرفة المعيشة — فيلا":"Living Room — Villa"}),(0,t.jsx)("span",{style:{fontSize:"0.68rem",color:"var(--brass)",border:"1px solid rgba(201,162,93,0.4)",padding:"0.25em 0.7em",borderRadius:999},children:e?"قيد الإنتاج":"In production"})]}),(0,t.jsx)("ol",{style:{listStyle:"none",margin:0,padding:0},children:s.JOURNEY.map((a,r)=>{let i=r<5,n=5===r;return(0,t.jsxs)("li",{style:{display:"flex",gap:"0.8rem",alignItems:"flex-start",paddingBottom:r<s.JOURNEY.length-1?"0.7rem":0},children:[(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",alignSelf:"stretch"},children:[(0,t.jsx)("span",{style:{width:16,height:16,borderRadius:999,flexShrink:0,display:"grid",placeItems:"center",fontSize:"0.55rem",color:"#fff",background:i?"var(--clay)":n?"var(--brass)":"transparent",border:i||n?"none":"1.5px solid rgba(245,242,235,0.25)"},children:i?"✓":""}),r<s.JOURNEY.length-1&&(0,t.jsx)("span",{style:{width:1.5,flex:1,background:i?"var(--clay)":"rgba(245,242,235,0.15)",marginTop:2,minHeight:14}})]}),(0,t.jsxs)("span",{style:{fontSize:"0.9rem",color:i||n?"var(--paper)":"rgba(245,242,235,0.45)",fontWeight:n?600:400,paddingTop:1,display:"flex",alignItems:"center",gap:"0.5rem"},children:[e?a.ar:a.en,n&&(0,t.jsx)(_,{active:!0,small:!0})]})]},a.key)})})]})]}),(0,t.jsx)("style",{children:"@media (max-width: 760px){ .pj-finale{ grid-template-columns: 1fr !important; } }"})]})}let y={eyebrow:{en:"Your turn",ar:"دورك الآن"},title:{en:"Have a plan? Let's make it your home.",ar:"عندك مخطّط؟ خلّينا نحوّله إلى منزلك."},sub:{en:"Send us your 2D floor plan and your number. We'll furnish it, build it in 3D and render it photoreal — free, with no obligation.",ar:"أرسل لنا مخطّطك ثنائي الأبعاد ورقمك، ونحن نؤثّثه ونبنيه ثلاثي الأبعاد ونقدّمه بعرض واقعي — مجانًا ودون أي التزام."},upload:{en:"Upload your plan",ar:"ارفع مخطّطك"},note:{en:"Free design · we reply within a day",ar:"تصميم مجاني · نردّ خلال يوم"},hint:{en:"JPG, PNG or PDF — a phone photo works too",ar:"JPG أو PNG أو PDF — حتى صورة بالجوال تكفي"}};function w({lang:e,reduced:a}){let r=t=>y[t][e];return(0,t.jsxs)(l.motion.div,{className:"pj-cta",initial:!a&&{opacity:0,y:36},whileInView:a?void 0:{opacity:1,y:0},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.7,ease:u},children:[(0,t.jsx)("span",{className:"pj-cta-glyph","aria-hidden":!0,children:(0,t.jsxs)("svg",{viewBox:"0 0 24 24",width:"26",height:"26",fill:"none",children:[(0,t.jsx)("path",{d:"M12 16V5m0 0L8 9m4-4 4 4",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"}),(0,t.jsx)("path",{d:"M4 14v3.5A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V14",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"})]})}),(0,t.jsx)("span",{className:"pj-cta-eyebrow",children:r("eyebrow")}),(0,t.jsx)("h2",{className:"pj-cta-title",children:r("title")}),(0,t.jsx)("p",{className:"pj-cta-sub",children:r("sub")}),(0,t.jsxs)("button",{type:"button",className:"pj-cta-btn",onClick:g.openStartProject,children:[r("upload"),(0,t.jsx)("svg",{viewBox:"0 0 24 24",width:"17",height:"17",fill:"none","aria-hidden":!0,children:(0,t.jsx)("path",{d:"M5 12h13m0 0-5-5m5 5-5 5",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round",className:"pj-cta-arrow"})})]}),(0,t.jsx)("span",{className:"pj-cta-hint",children:r("hint")}),(0,t.jsxs)("span",{className:"pj-cta-note",children:[(0,t.jsx)("span",{className:"pj-free-dot","aria-hidden":!0}),r("note")]}),(0,t.jsx)("style",{children:`
        .pj-cta {
          margin-top: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: clamp(3rem, 7vw, 5.5rem);
          border-radius: 24px;
          padding: clamp(2.4rem, 6vw, 4rem) clamp(1.6rem, 5vw, 3.2rem);
          text-align: center;
          background:
            radial-gradient(120% 140% at 50% 0%, color-mix(in srgb, var(--ever, #2f5d4a) 7%, transparent), transparent 60%),
            var(--paper, #faf7f1);
          border: 1px dashed color-mix(in srgb, var(--brass, #c9a25d) 55%, transparent);
          display: flex; flex-direction: column; align-items: center;
        }
        .pj-cta-glyph {
          display: grid; place-items: center;
          width: 56px; height: 56px; border-radius: 999px;
          color: var(--ever, #2f5d4a);
          background: color-mix(in srgb, var(--ever, #2f5d4a) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--ever, #2f5d4a) 24%, transparent);
          margin-bottom: 1.2rem;
        }
        .pj-cta-eyebrow {
          font-family: var(--f-sans); font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase; color: var(--brass-2, #8a6d3f);
        }
        .pj-cta-title {
          font-family: var(--f-display), Georgia, serif;
          font-optical-sizing: auto; font-variation-settings: "opsz" 90, "SOFT" 40;
          font-weight: 360; font-size: clamp(1.7rem, 3.8vw, 2.8rem);
          line-height: 1.08; letter-spacing: -0.018em; color: var(--ink);
          margin: 0.7rem 0 0; max-width: 22ch; text-wrap: balance;
        }
        .pj-cta-sub {
          font-family: var(--f-sans); color: var(--ink-soft);
          font-size: clamp(1rem, 1.3vw, 1.12rem); line-height: 1.7;
          max-width: 50ch; margin: 1.1rem 0 0; text-wrap: pretty;
        }
        .pj-cta-btn {
          display: inline-flex; align-items: center; gap: 0.55rem;
          margin-top: 1.8rem; padding: 0.95rem 1.7rem;
          font-family: var(--f-sans); font-weight: 600; font-size: 0.96rem;
          color: #fff; background: var(--clay); border: none; border-radius: 999px;
          cursor: pointer; transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
          box-shadow: 0 18px 40px -20px color-mix(in srgb, var(--clay) 90%, #000);
        }
        .pj-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 24px 50px -22px color-mix(in srgb, var(--clay) 90%, #000); }
        .pj-cta-btn:focus-visible { outline: 2px solid var(--brass); outline-offset: 3px; }
        .pj-cta-arrow { transition: transform .25s ease; }
        .pj-cta-btn:hover .pj-cta-arrow { transform: translateX(3px); }
        html[dir="rtl"] .pj-cta-arrow { transform: scaleX(-1); }
        html[dir="rtl"] .pj-cta-btn:hover .pj-cta-arrow { transform: scaleX(-1) translateX(3px); }
        .pj-cta-hint {
          margin-top: 0.9rem; font-family: var(--f-sans);
          font-size: 0.8rem; color: var(--ink-soft); opacity: 0.85;
        }
        .pj-cta-note {
          display: inline-flex; align-items: center; gap: 0.5rem;
          margin-top: 1.1rem; font-family: var(--f-sans);
          font-size: 0.82rem; font-weight: 600; color: var(--ever, #2f5d4a);
        }
        @media (prefers-reduced-motion: reduce) {
          .pj-cta-btn, .pj-cta-arrow { transition: none; }
        }
      `})]})}function _({active:e,small:a}){let r=a?7:9;return(0,t.jsxs)("span",{style:{position:"relative",width:r,height:r,display:"inline-block"},children:[(0,t.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:999,background:"var(--brass)"}}),e&&(0,t.jsx)(l.motion.span,{style:{position:"absolute",inset:0,borderRadius:999,background:"var(--brass)"},animate:{scale:[1,2.4],opacity:[.6,0]},transition:{duration:1.6,repeat:1/0,ease:"easeOut"}})]})}e.s(["default",0,function({showFinale:e=!0}){let{t:r,lang:s,dir:d}=(0,i.useT)(),c="ar"===s,m=(0,p.useReducedMotion)(),[f,g]=(0,a.useState)(0),u=f%2==1;return(0,t.jsxs)("section",{dir:d,style:{position:"relative",paddingTop:"clamp(4rem,9vw,7rem)"},children:[(0,t.jsxs)("div",{className:"container pj-head",children:[(0,t.jsx)(o.Rise,{children:(0,t.jsxs)("span",{className:"pj-kicker",children:[(0,t.jsx)("span",{className:"pj-kicker-rule"}),c?"كيف تعمل إيفورا":"How Evora works",(0,t.jsx)("span",{className:"pj-kicker-rule"})]})}),(0,t.jsx)(o.Rise,{delay:.06,as:"h2",className:"pj-title",children:c?(0,t.jsxs)(t.Fragment,{children:["مخطّطٌ مسطّح، ",(0,t.jsx)("em",{children:"يصبح منزلك."})]}):(0,t.jsxs)(t.Fragment,{children:["A flat plan, ",(0,t.jsx)("em",{children:"made a home."})]})}),(0,t.jsx)(o.Rise,{delay:.12,as:"p",className:"pj-lede",children:c?"أربع خطوات فقط: ترسل مخطّطك، فنؤثّثه ونبنيه ثلاثي الأبعاد ونقدّمه بعرض واقعي تعتمده — ثم نصنعه وأنت تتابع كل مرحلة مباشرةً.":"Four moves: you send a plan, we furnish it, rebuild it in 3D and render it photoreal for your sign-off — then we build it while you watch every stage."}),(0,t.jsx)(o.Rise,{delay:.18,children:(0,t.jsxs)("span",{className:"pj-free",children:[(0,t.jsx)("span",{className:"pj-free-dot","aria-hidden":!0}),r("pj_free")]})}),(0,t.jsx)(o.Rise,{delay:.24,children:(0,t.jsx)("p",{className:"pj-loss",children:r("pj_loss")})})]}),(0,t.jsxs)("div",{className:"pj-swap container",children:[(0,t.jsx)("div",{className:"pj-sticky",children:(0,t.jsx)(l.motion.div,{className:"pj-panel",animate:{x:u?c?"-72.41%":"72.41%":"0%"},transition:m?{duration:0}:v,children:(0,t.jsx)(h,{step:f,ar:c})})}),(0,t.jsx)("div",{className:"pj-offset"}),(0,t.jsx)("div",{className:"pj-mstick","aria-hidden":!0,children:(0,t.jsx)(h,{step:f,ar:c})}),n.processSteps.map((e,a)=>{let r=a%2==0;return(0,t.jsx)(l.motion.section,{className:"pj-step",onViewportEnter:()=>g(a),viewport:{margin:"-50% 0px -50% 0px",amount:0},style:{justifyContent:r?"flex-end":"flex-start"},children:(0,t.jsxs)("div",{className:`pj-step-text${a===f?" is-active":""}`,children:[(0,t.jsx)("span",{className:"pj-step-ghost","aria-hidden":!0,children:e.n}),(0,t.jsxs)("span",{className:"pj-step-eyebrow",children:[c?"المرحلة":"Stage"," ",(0,t.jsx)("b",{children:e.n}),(0,t.jsx)("i",{}),c?"من ٠٤":"of 04"]}),(0,t.jsx)("h3",{className:"pj-step-title",children:e.title[s]}),(0,t.jsx)("p",{className:"pj-step-body",children:e.body[s]}),(0,t.jsx)("span",{className:"pj-step-tag",children:c?x[a].ar:x[a].en}),(0,t.jsx)("div",{className:"pj-step-media-mobile",children:(0,t.jsx)(h,{step:a,ar:c})})]})},e.n)})]}),e&&(0,t.jsx)("div",{className:"container",children:(0,t.jsx)(b,{ar:c})}),e&&(0,t.jsx)("div",{className:"container",children:(0,t.jsx)(w,{lang:s,reduced:!!m})}),(0,t.jsx)("style",{children:`
        /* ---------- Header ---------- */
        /* editorial header: start-aligned, runs the container's full measure
           (like .pj-swap below it) instead of being clamped to a narrow
           ch-width that .container's margin-inline: auto then floats in the
           middle of the page — same fix as Rooms.tsx's .rm__head. */
        .pj-head { text-align: start; }
        .pj-kicker {
          display: inline-flex; align-items: center; gap: 0.85rem;
          font-family: var(--f-sans);
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.26em; text-transform: uppercase;
          color: var(--brass-2, #8a6d3f);
        }
        .pj-kicker-rule {
          display: inline-block; width: clamp(28px, 6vw, 56px); height: 1px;
          background: linear-gradient(to right, var(--brass), transparent);
        }
        html[dir="rtl"] .pj-kicker-rule { background: linear-gradient(to left, var(--brass), transparent); }
        .pj-title {
          font-family: var(--f-display), Georgia, serif;
          font-optical-sizing: auto;
          font-variation-settings: "opsz" 140, "SOFT" 0, "WONK" 1;
          font-weight: 340;
          font-size: clamp(2.4rem, 5.6vw, 4.5rem);
          line-height: 0.99; letter-spacing: -0.022em;
          margin: 1.1rem 0 0; color: var(--ink); text-wrap: balance;
        }
        .pj-title em {
          font-style: italic;
          font-variation-settings: "opsz" 140, "SOFT" 60, "WONK" 1;
          color: var(--ever, #2f5d4a);
        }
        .pj-lede {
          max-width: 70ch; margin: 1.4rem 0 0;
          font-family: var(--f-sans); color: var(--ink-soft);
          font-size: clamp(1.02rem, 1.35vw, 1.16rem); line-height: 1.7;
          text-wrap: pretty;
        }
        .pj-free {
          display: inline-flex; align-items: center; gap: 0.6rem;
          width: fit-content;
          margin-top: 1.5rem; padding: 0.55rem 1.1rem;
          font-family: var(--f-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; color: var(--ever, #2f5d4a);
          background: color-mix(in srgb, var(--ever, #2f5d4a) 8%, transparent);
          border: 1px solid color-mix(in srgb, var(--ever, #2f5d4a) 26%, transparent);
          border-radius: 999px; text-wrap: balance;
        }
        .pj-free-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--ever, #2f5d4a); flex: 0 0 auto; }
        .pj-loss {
          max-width: 70ch; margin: 1.1rem 0 0;
          font-family: var(--f-display), Georgia, serif; font-style: italic;
          font-optical-sizing: auto; font-variation-settings: "opsz" 40, "SOFT" 60;
          font-size: clamp(1.04rem, 1.5vw, 1.26rem); line-height: 1.5;
          color: var(--ink-soft); text-wrap: balance;
        }
        html[dir="rtl"] .pj-loss { font-style: normal; }

        /* ---------- Left↔right swap-column scroll ---------- */
        .pj-swap { position: relative; margin-top: clamp(2rem, 5vw, 4rem); }
        .pj-sticky {
          pointer-events: none;
          position: sticky; top: 0; z-index: 2;
          height: 100vh; width: 100%;
          display: flex; align-items: center;
        }
        .pj-panel { position: absolute; inset-inline-start: 0; width: 58%; }
        .pj-offset { margin-top: -100vh; }
        .pj-step {
          position: relative; z-index: 1;
          display: flex; align-items: center;
          min-height: 88vh;
        }

        /* ---------- Step text ---------- */
        .pj-step-text {
          position: relative; width: 38%;
          opacity: 0.4; transition: opacity .5s ease;
        }
        .pj-step-text.is-active { opacity: 1; }
        .pj-step-ghost {
          position: absolute; z-index: -1;
          inset-block-start: -0.46em; inset-inline-start: -0.06em;
          font-family: var(--f-display), Georgia, serif;
          font-optical-sizing: auto; font-variation-settings: "opsz" 144, "WONK" 1;
          font-size: clamp(8rem, 15vw, 13rem);
          line-height: 0.78; font-weight: 360;
          color: var(--brass); opacity: 0.1;
          pointer-events: none; user-select: none;
        }
        .pj-step-eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-family: var(--f-sans); font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase; color: var(--brass-2);
        }
        .pj-step-eyebrow b { color: var(--clay); font-weight: 700; }
        .pj-step-eyebrow i { width: 26px; height: 1px; background: var(--line); display: inline-block; }
        .pj-step-title {
          font-family: var(--f-display), Georgia, serif;
          font-optical-sizing: auto; font-variation-settings: "opsz" 90, "SOFT" 40;
          font-weight: 360; font-size: clamp(1.9rem, 4vw, 3.1rem);
          line-height: 1.04; letter-spacing: -0.018em; color: var(--ink);
          margin: 0.9rem 0 0.8rem; text-wrap: balance;
        }
        .pj-step-body {
          font-family: var(--f-sans); color: var(--ink-soft);
          font-size: clamp(1.02rem, 1.3vw, 1.12rem); line-height: 1.72;
          max-width: 40ch; text-wrap: pretty;
        }
        .pj-step-tag {
          display: block; margin-top: 1.1rem; padding-inline-start: 0.9rem;
          border-inline-start: 2px solid var(--brass);
          font-family: var(--f-display), Georgia, serif; font-style: italic;
          font-variation-settings: "opsz" 40, "SOFT" 60;
          font-size: clamp(1.02rem, 1.5vw, 1.22rem); line-height: 1.4;
          color: var(--ever, #2f5d4a);
        }
        .pj-step-media-mobile { display: none; margin-top: 1.6rem; }
        .pj-mstick { display: none; }

        @media (max-width: 860px) {
          .pj-sticky, .pj-offset { display: none; }
          /* the transforming stage pins near the top while the step texts
             scroll beneath it, so it visibly morphs 2D → 3D → photoreal */
          .pj-mstick {
            display: block;
            position: sticky; top: 6vh; z-index: 3;
            margin: 0 auto clamp(1.4rem, 4vw, 2rem);
            pointer-events: none;
          }
          .pj-step {
            min-height: 66vh; padding-block: 1.2rem;
            justify-content: stretch !important;
            position: relative; z-index: 1;
          }
          /* keep the active step lit, dim the rest — reads which stage you're on */
          .pj-step-text { width: 100%; opacity: 0.32; transition: opacity .45s ease; }
          .pj-step-text.is-active { opacity: 1; }
          .pj-step-ghost { font-size: clamp(6rem, 22vw, 9rem); }
          .pj-step-media-mobile { display: none; }
        }
      `})]})}],750968)},311590,e=>{"use strict";var t=e.i(843476),a=e.i(207761),r=e.i(719381),i=e.i(801583);let n={lat:31.9969638,lng:35.8434571},s="https://www.google.com/maps/dir/?api=1&destination=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman",o=`https://www.google.com/maps?q=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman&ll=${n.lat},${n.lng}&z=17&output=embed`,l={lede:{en:"Two floors of finished rooms on Wasfi Al-Tal Street in Khalda — walk in any day we're open, or hold a time and sit with a designer.",ar:"طابقان من الغرف المكتملة في شارع وصفي التل بخلدا — تفضّل بالزيارة في أي يوم نكون فيه مفتوحين، أو احجز موعدًا واجلس مع مصمّم."},directions:{en:"Get directions",ar:"احصل على الاتجاهات"},call:{en:"Call the showroom",ar:"اتصل بالمعرض"},photo_k:{en:"Our showroom",ar:"معرضنا"},expect_eyebrow:{en:"Before you come",ar:"قبل أن تأتي"},expect_title:{en:"What to expect on a visit",ar:"ماذا تتوقّع في زيارتك"},hours_label:{en:"Opening hours",ar:"ساعات العمل"},e1_t:{en:"Walk the full collection",ar:"تجوّل في المجموعة كاملة"},e1_d:{en:"Sofas, beds, dining and décor — styled in real room sets you can sit in.",ar:"كنب وأسرّة وسفرة وديكور — منسّقة في غرف حقيقية تستطيع الجلوس فيها."},e2_t:{en:"Bring your floor plan",ar:"أحضِر مخططك"},e2_d:{en:"Hand us your 2D plan and we'll start your 3D home on the spot.",ar:"سلّمنا مخططك ثنائي الأبعاد ونبدأ منزلك ثلاثي الأبعاد على الفور."},e3_t:{en:"Sit with a designer",ar:"اجلس مع مصمّم"},e3_d:{en:"A specialist walks you through finishes, fabrics and layout — no rush.",ar:"يأخذك مختص في التشطيبات والأقمشة والتوزيع — دون أي استعجال."},e4_t:{en:"Two floors, fully styled",ar:"طابقان، مصمّمان بالكامل"},tour_link:{en:"Or take the virtual tour first",ar:"أو خذ جولة افتراضية أولاً"},perk_note:{en:"Easy parking right out front, and Arabic coffee on us while you browse.",ar:"موقف سهل أمام المعرض مباشرة، وقهوة عربية على حسابنا أثناء تجوّلك."}};function p(e){let t=e.split(" ");if(t.length<2)return[e];let a=Math.ceil(t.length/2);return[t.slice(0,a).join(" "),t.slice(a).join(" ")]}e.s(["EVORA_GEO",0,n,"default",0,function({pageTop:e=!1}={}){let{t:n,lang:d}=(0,a.useT)(),c="en"===d,m=e=>l[e][d],h=[{t:m("e1_t"),d:m("e1_d")},{t:m("e2_t"),d:m("e2_d")},{t:m("e3_t"),d:m("e3_d")},{t:m("e4_t"),d:n("col_film_caption")}],f=[{n:"01",label:c?"The Showroom":"المعرض",value:n("visit_addr"),sub:c?"By appointment & walk-in":"بموعد أو زيارة مباشرة",href:s},{n:"02",label:c?"Opening Hours":"ساعات العمل",value:n("visit_hours"),sub:c?"Friday — by appointment":"الجمعة — بموعد مسبق"},{n:"03",label:c?"Call the Showroom":"اتصل بالمعرض",value:(0,t.jsx)("bdi",{dir:"ltr",children:i.PHONE_PRIMARY}),sub:c?"Or +962 79 636 4105 · tap to call":"أو ٤١٠٥ ٦٣٦ ٧٩ ٩٦٢+ · اضغط للاتصال",href:`tel:${i.PHONE_PRIMARY_TEL}`},{n:"04",label:c?"Find Us":"تابعونا",value:(0,t.jsx)("bdi",{dir:"ltr",children:"@evorafuturehome"}),sub:c?"Instagram · Facebook · WhatsApp":"إنستغرام · فيسبوك · واتساب",href:"https://instagram.com/evorafuturehome"}];return(0,t.jsxs)("section",{id:"visit",className:`vst${e?" vst--pagetop":""}`,lang:d,children:[(0,t.jsx)("span",{className:"vst__edge","aria-hidden":!0,children:c?"Amman — Jordan":"عمّان — الأردن"}),(0,t.jsxs)("div",{className:"container vst__inner",children:[(0,t.jsxs)("header",{className:"vst__head",children:[(0,t.jsxs)("div",{className:"vst__kick",children:[(0,t.jsx)(r.Rise,{as:"span",className:"eyebrow vst__eyebrow",children:n("visit_eyebrow")}),(0,t.jsx)(r.Rise,{as:"span",delay:.06,className:"vst__coords",children:(0,t.jsx)("bdi",{dir:"ltr",children:"31.99° N · 35.84° E"})})]}),(0,t.jsxs)("div",{className:"vst__headgrid",children:[(0,t.jsx)(r.RevealLines,{lines:p(n("visit_title")),className:"display vst__title",delay:.05,italicIndex:1}),(0,t.jsxs)("div",{className:"vst__intro",children:[(0,t.jsx)(r.Rise,{as:"p",delay:.1,className:"vst__lede",children:m("lede")}),(0,t.jsxs)(r.Rise,{delay:.16,className:"vst__actions",children:[(0,t.jsx)(r.Magnetic,{strength:.3,className:"vst__btnwrap",children:(0,t.jsxs)("a",{href:"#book",className:"btn btn-solid vst__btn",children:[n("visit_cta")," ",(0,t.jsx)("span",{className:"arrow",children:"→"})]})}),(0,t.jsxs)("a",{href:s,target:"_blank",rel:"noopener noreferrer",className:"vst__quiet",children:[m("directions")," ",(0,t.jsx)("span",{className:"vst__go","aria-hidden":!0,children:"↗"})]}),(0,t.jsxs)("a",{href:`tel:${i.PHONE_PRIMARY_TEL}`,className:"vst__quiet",children:[m("call")," ",(0,t.jsx)("span",{className:"vst__go","aria-hidden":!0,children:"↗"})]})]})]})]})]}),(0,t.jsxs)("div",{className:"vst__stage",children:[(0,t.jsxs)(r.Rise,{className:"vst__store",children:[(0,t.jsx)(r.ParallaxImage,{src:"/evora/storefront.webp",alt:c?"Evora Future Home showroom — Khalda, Amman":"معرض إيفورا فيوتشر هوم — خلدا، عمّان",amount:7,className:"vst__store-media",style:{position:"absolute",inset:0}}),(0,t.jsx)("span",{className:"vst__store-overlay","aria-hidden":!0}),(0,t.jsx)("span",{className:"vst__store-grain","aria-hidden":!0}),(0,t.jsx)("span",{className:"vst__cellk",children:m("photo_k")}),(0,t.jsxs)("div",{className:"vst__store-cap",children:[(0,t.jsx)("span",{className:"vst__store-badge",children:c?"Evora Future Home":"إيفورا فيوتشر هوم"}),(0,t.jsx)("span",{className:"vst__store-addr",children:c?"Wasfi Al-Tal St · Khalda · Amman":"شارع وصفي التل · خلدا · عمّان"})]})]}),(0,t.jsx)(r.Rise,{delay:.14,className:"vst__plate",children:(0,t.jsxs)("div",{className:"vst__map",children:[(0,t.jsx)("iframe",{className:"vst__iframe",src:o,title:c?"Evora — Khalda, Amman":"إيفورا — خلدا، عمّان",loading:"lazy",referrerPolicy:"no-referrer-when-downgrade"}),(0,t.jsx)("span",{className:"vst__tint","aria-hidden":!0}),(0,t.jsxs)("a",{href:s,target:"_blank",rel:"noopener noreferrer",className:"vst__plaque",children:[(0,t.jsx)("span",{className:"vst__plaque-pin",children:(0,t.jsx)("span",{className:"vst__plaque-pulse"})}),(0,t.jsxs)("span",{className:"vst__plaque-text",children:[(0,t.jsx)("span",{children:c?"Khalda · Amman":"خلدا · عمّان"}),(0,t.jsxs)("span",{className:"vst__plaque-cta",children:[c?"Open in Maps":"افتح في الخرائط"," ↗"]})]})]})]})})]}),(0,t.jsx)("ul",{className:"vst__details",children:f.map(e=>{let a=(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("span",{className:"vst__n",children:e.n}),(0,t.jsxs)("span",{className:"vst__entry-body",children:[(0,t.jsx)("span",{className:"vst__label",children:e.label}),(0,t.jsx)("span",{className:"vst__value",children:e.value}),(0,t.jsxs)("span",{className:"vst__sub",children:[e.sub,e.href&&(0,t.jsx)("span",{className:"vst__go","aria-hidden":!0,children:" ↗"})]})]})]});return(0,t.jsx)("li",{className:"vst__entry",children:e.href?(0,t.jsx)("a",{className:"vst__entry-in vst__entry-in--link",href:e.href,target:"_blank",rel:"noopener noreferrer","data-cursor":"hover",children:a}):(0,t.jsx)("div",{className:"vst__entry-in",children:a})},e.n)})}),(0,t.jsxs)(r.Rise,{className:"vst__expect",children:[(0,t.jsxs)("div",{className:"vst__expect-aside",children:[(0,t.jsx)("span",{className:"eyebrow vst__expect-eyebrow",children:m("expect_eyebrow")}),(0,t.jsx)(r.RevealLines,{lines:p(m("expect_title")),className:"display vst__expect-title",delay:.06}),(0,t.jsxs)("div",{className:"vst__expect-hours",children:[(0,t.jsx)("span",{className:"vst__expect-hours-label",children:m("hours_label")}),(0,t.jsx)("span",{className:"vst__expect-hours-val",children:n("visit_hours")}),(0,t.jsx)("p",{className:"vst__expect-perk",children:m("perk_note")}),(0,t.jsxs)("a",{href:"/showroom",className:"vst__expect-tour",children:[m("tour_link")," ",(0,t.jsx)("span",{"aria-hidden":!0,children:"↗"})]})]})]}),(0,t.jsx)("ul",{className:"vst__expect-list",children:h.map((e,a)=>(0,t.jsxs)("li",{className:"vst__expect-item",children:[(0,t.jsx)("span",{className:"vst__expect-n",children:String(a+1).padStart(2,"0")}),(0,t.jsxs)("span",{className:"vst__expect-body",children:[(0,t.jsx)("span",{className:"vst__expect-h",children:e.t}),(0,t.jsx)("span",{className:"vst__expect-d",children:e.d})]})]},a))})]})]}),(0,t.jsx)("style",{children:`
        .vst {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: var(--paper);
          color: var(--ink);
          padding-block: clamp(5rem, 11vw, 11rem);
        }
        /* /visit only: the band is the first thing under the fixed nav (the
           page reserves the nav with .nav-spacer), so the old symmetric
           clamp(5rem,11vw,11rem) top pad left ~162px of dead white between the
           nav and the first word. Now a short, deliberate beat — the bottom
           keeps the section's full breathing room. */
        .vst--pagetop { padding-block: clamp(1.6rem, 3.2vw, 3rem) clamp(4.5rem, 10vw, 9rem); }
        /* warm atmosphere, never flat */
        .vst::before {
          content: "";
          position: absolute; inset: 0; z-index: -1; pointer-events: none;
          background:
            radial-gradient(55% 45% at 100% 0%, rgba(197,160,106,0.12), transparent 60%),
            radial-gradient(60% 60% at 0% 100%, rgba(54,65,47,0.07), transparent 60%);
        }
        .vst__edge {
          position: absolute;
          top: 50%; inset-inline-end: clamp(0.4rem, 1.5vw, 1.4rem);
          transform: translateY(-50%) rotate(180deg);
          writing-mode: vertical-rl;
          font-size: 0.66rem; letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--ink-faint); opacity: 0.5;
          pointer-events: none; user-select: none;
        }
        html[dir="rtl"] .vst__edge { inset-inline-end: auto; inset-inline-start: clamp(0.4rem,1.5vw,1.4rem); letter-spacing: 0.1em; }

        .vst__inner { position: relative; z-index: 1; }

        /* ── masthead ── */
        .vst__head { text-align: start; }
        .vst__kick {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap;
          padding-bottom: clamp(1rem, 1.8vw, 1.5rem);
          border-bottom: 1px solid var(--line);
        }
        .vst__eyebrow {
          display: inline-flex; align-items: center; gap: 0.7rem;
          color: var(--brass);
        }
        .vst__eyebrow::before { content: ""; width: 34px; height: 1px; background: var(--brass); }
        .vst__coords {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--ink-faint);
          letter-spacing: 0.02em;
        }
        html[dir="rtl"] .vst__coords { font-style: normal; }

        .vst__headgrid {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
          gap: clamp(1.4rem, 4vw, 4rem);
          align-items: end;
          margin-top: clamp(1.4rem, 3vw, 2.6rem);
        }
        .vst__title {
          font-size: clamp(2.5rem, 5.6vw, 5rem);
          line-height: 0.98; font-weight: 380; letter-spacing: -0.022em;
          color: var(--ink); text-wrap: balance;
        }
        html[dir="rtl"] .vst__title { line-height: 1.16; letter-spacing: 0; }
        .vst__intro { display: flex; flex-direction: column; gap: clamp(1.1rem, 2vw, 1.6rem); }
        .vst__lede {
          margin: 0; max-width: 70ch;
          color: var(--ink-soft);
          font-size: clamp(1rem, 1.25vw, 1.14rem); line-height: 1.7;
          text-wrap: pretty;
        }
        .vst__actions {
          display: flex; flex-wrap: wrap; align-items: center;
          gap: clamp(0.7rem, 1.6vw, 1.4rem);
        }
        .vst__btn { white-space: nowrap; }
        .vst__quiet {
          display: inline-flex; align-items: center; gap: 0.42em;
          min-height: 44px;
          font-size: 0.86rem; color: var(--ink-soft);
          border-bottom: 1px solid var(--line);
          transition: color 0.35s var(--ease), border-color 0.35s var(--ease);
        }
        .vst__quiet:hover { color: var(--ink); border-color: var(--brass); }

        .vst__go { color: var(--brass); display: inline-block; transition: transform 0.4s var(--ease); }
        html[dir="rtl"] .vst__go { transform: scaleX(-1); }
        .vst__quiet:hover .vst__go { transform: translate(2px, -2px); }
        html[dir="rtl"] .vst__quiet:hover .vst__go { transform: translate(-2px, -2px) scaleX(-1); }

        /* ── unified stage: photo + map framed as one plate ── */
        .vst__stage {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.95fr);
          gap: 9px;
          margin-top: clamp(2rem, 4.5vw, 3.6rem);
          padding: 9px;
          border-radius: 7px;
          background: var(--paper);
          box-shadow:
            0 0 0 1px rgba(169,130,76,0.40),
            0 0 0 8px rgba(169,130,76,0.16),
            0 50px 100px -54px rgba(27,25,22,0.55);
        }
        .vst__stage > * { min-height: clamp(400px, 54vh, 640px); }

        /* photo cell */
        .vst__store {
          position: relative; overflow: hidden; border-radius: 3px;
          background: var(--bone);
        }
        .vst__store-overlay {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(180deg, rgba(16,15,13,0.30) 0%, rgba(16,15,13,0) 34%),
            linear-gradient(0deg, rgba(16,15,13,0.74) 0%, rgba(16,15,13,0) 52%);
        }
        .vst__store-grain {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          opacity: 0.22; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }
        /* quiet caps label in the photo's top-leading corner */
        .vst__cellk {
          position: absolute; z-index: 3;
          top: clamp(0.9rem, 2vw, 1.4rem); inset-inline-start: clamp(0.9rem, 2vw, 1.4rem);
          display: inline-flex; align-items: center; gap: 0.55rem;
          font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(251,247,240,0.82);
          text-shadow: 0 1px 10px rgba(0,0,0,0.6);
        }
        .vst__cellk::before { content: ""; width: 20px; height: 1px; background: var(--brass-2); }
        html[dir="rtl"] .vst__cellk { letter-spacing: 0.06em; }

        .vst__store-cap {
          position: absolute; z-index: 2;
          inset-inline-start: clamp(1.2rem, 2.6vw, 2.2rem);
          inset-inline-end: clamp(1.2rem, 2.6vw, 2.2rem);
          bottom: clamp(1.2rem, 2.8vw, 2.2rem);
          display: flex; flex-direction: column; align-items: flex-start; gap: 0.4rem;
          color: var(--paper);
        }
        .vst__store-badge {
          font-family: var(--font-display);
          font-size: clamp(1.15rem, 1.9vw, 1.6rem); line-height: 1.15;
          color: #fbf7f0; letter-spacing: -0.01em;
          text-shadow: 0 2px 22px rgba(0,0,0,0.5);
        }
        html[dir="rtl"] .vst__store-badge { letter-spacing: 0; }
        .vst__store-addr {
          font-size: clamp(0.82rem, 1.05vw, 0.95rem); color: rgba(251,247,240,0.86);
          letter-spacing: 0.02em; text-shadow: 0 1px 10px rgba(0,0,0,0.45);
        }

        /* details strip under the stage */
        .vst__details {
          list-style: none; margin: clamp(1.6rem,3vw,2.4rem) 0 0; padding: clamp(1.3rem,2.6vw,1.9rem) 0 0;
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(0.3rem, 1vw, 0.9rem);
          border-top: 1px solid var(--line);
        }
        .vst__entry { position: relative; }
        .vst__entry-in {
          display: grid; grid-template-columns: auto 1fr; align-items: start;
          gap: clamp(0.7rem, 1.4vw, 1.1rem); height: 100%;
          padding: clamp(0.9rem, 1.6vw, 1.3rem) clamp(0.8rem, 1.4vw, 1.2rem);
          border-radius: 8px;
          transition: background 0.4s var(--ease), transform 0.4s var(--ease);
        }
        a.vst__entry-in--link:hover { background: rgba(138,106,60,0.07); transform: translateY(-3px); }
        .vst__entry + .vst__entry .vst__entry-in::before {
          content: ""; position: absolute; inset-inline-start: calc(-1 * clamp(0.15rem, 0.5vw, 0.45rem));
          top: 14%; bottom: 14%; width: 1px; background: var(--line);
        }
        a.vst__entry-in--link:hover .vst__go { transform: translate(2px, -2px); }
        html[dir="rtl"] a.vst__entry-in--link:hover .vst__go { transform: translate(-2px, -2px) scaleX(-1); }
        .vst__n {
          font-family: var(--font-display);
          font-size: clamp(1.2rem, 1.9vw, 1.7rem);
          line-height: 1;
          color: var(--brass);
          padding-top: 0.15rem;
          letter-spacing: 0.02em;
        }
        .vst__entry-body { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }
        .vst__label {
          font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink-faint);
        }
        html[dir="rtl"] .vst__label { letter-spacing: 0.05em; }
        .vst__value {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(1rem, 1.25vw, 1.2rem);
          line-height: 1.35;
          color: var(--ink);
          overflow-wrap: anywhere;
        }
        .vst__sub { font-size: 0.8rem; color: var(--ink-faint); }

        /* ── what to expect / opening hours card ── */
        .vst__expect {
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
          gap: clamp(1.6rem, 4vw, 4rem);
          margin-top: clamp(2rem, 4vw, 3.4rem);
          padding: clamp(1.8rem, 3.5vw, 3rem);
          border-radius: 10px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0)) var(--bone);
          box-shadow:
            0 0 0 1px rgba(169,130,76,0.28),
            0 36px 80px -56px rgba(27,25,22,0.45);
        }
        .vst__expect-aside { display: flex; flex-direction: column; text-align: start; }
        .vst__expect-eyebrow {
          display: inline-flex; align-items: center; gap: 0.7rem; color: var(--brass);
          align-self: flex-start;
        }
        .vst__expect-eyebrow::before { content: ""; width: 26px; height: 1px; background: var(--brass); }
        .vst__expect-title {
          font-size: clamp(1.7rem, 3.2vw, 2.6rem);
          line-height: 1.04; font-weight: 360; letter-spacing: -0.01em;
          color: var(--ink); margin: 0.9rem 0 0;
        }
        html[dir="rtl"] .vst__expect-title { line-height: 1.22; letter-spacing: 0; }
        .vst__expect-hours {
          margin-top: auto; padding-top: clamp(1.2rem, 2.4vw, 1.8rem);
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .vst__expect-hours-label {
          font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-faint);
        }
        html[dir="rtl"] .vst__expect-hours-label { letter-spacing: 0.05em; }
        .vst__expect-hours-val {
          font-family: var(--font-display); font-size: clamp(1rem, 1.5vw, 1.22rem);
          line-height: 1.4; color: var(--ink);
        }
        /* demoted amenities — a small supporting line, not a headline card */
        .vst__expect-perk {
          margin: 0.7rem 0 0; font-size: 0.8rem; line-height: 1.55;
          color: var(--ink-faint); max-width: 40ch;
        }
        .vst__expect-tour {
          display: inline-flex; align-items: center; gap: 0.4em; width: fit-content;
          margin-top: 0.9rem; font-size: 0.82rem; color: var(--brass);
          border-bottom: 1px solid rgba(138,106,60,0.35); padding-bottom: 2px;
          min-height: 44px; transition: color 0.3s var(--ease), border-color 0.3s var(--ease);
        }
        .vst__expect-tour:hover { color: var(--ink); border-color: var(--ink); }
        html[dir="rtl"] .vst__expect-tour span[aria-hidden] { transform: scaleX(-1); display: inline-block; }
        .vst__expect-list {
          list-style: none; margin: 0; padding: 0;
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(1.1rem, 2.4vw, 1.8rem) clamp(1.6rem, 3vw, 2.6rem);
        }
        .vst__expect-item {
          display: grid; grid-template-columns: auto 1fr; gap: 0.9rem; align-items: start;
          padding-top: clamp(0.9rem, 1.8vw, 1.2rem);
          border-top: 1px solid rgba(138,106,60,0.22);
        }
        .vst__expect-n {
          font-family: var(--font-display); font-size: 0.92rem; line-height: 1.5;
          color: var(--brass); letter-spacing: 0.04em;
        }
        .vst__expect-body { display: flex; flex-direction: column; gap: 0.3rem; }
        .vst__expect-h { font-weight: 600; font-size: 1.02rem; color: var(--ink); line-height: 1.3; }
        .vst__expect-d { font-size: 0.88rem; line-height: 1.55; color: var(--ink-soft); }

        @media (max-width: 1080px) {
          .vst__details { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: clamp(0.6rem, 1.6vw, 1rem); }
          /* the vertical hairline only reads on a single row */
          .vst__entry + .vst__entry .vst__entry-in::before { display: none; }
          .vst__entry-in { border-top: 1px solid var(--line-soft); border-radius: 0; }
        }
        @media (max-width: 900px) {
          .vst__headgrid { grid-template-columns: 1fr; gap: clamp(1.1rem, 3vw, 1.8rem); align-items: start; }
        }
        @media (max-width: 860px) {
          .vst__stage { grid-template-columns: 1fr; }
          .vst__stage > * { min-height: 0; }
          .vst__store { aspect-ratio: 16 / 11; }
          .vst__expect { grid-template-columns: 1fr; gap: clamp(1.4rem, 5vw, 2rem); }
          .vst__expect-hours { margin-top: 1rem; }
        }
        @media (max-width: 620px) {
          .vst__details { grid-template-columns: 1fr; gap: 0.2rem; }
          .vst__expect-list { grid-template-columns: 1fr; }
          .vst__store { aspect-ratio: 4 / 5; }
          .vst__actions { gap: 0.8rem 1rem; }
          .vst__btnwrap { width: 100%; }
          .vst__btn { width: 100%; justify-content: center; }
        }

        /* ── map plate ── */
        .vst__plate { display: block; }
        .vst__map {
          position: relative;
          height: 100%;
          min-height: clamp(400px, 56vh, 660px);
          overflow: hidden;
          border-radius: 3px;
          background: var(--bone);
          box-shadow:
            0 0 0 1px rgba(169,130,76,0.45),
            0 0 0 7px var(--paper),
            0 0 0 8px rgba(169,130,76,0.22),
            0 44px 90px -50px rgba(27,25,22,0.5);
        }
        .vst__iframe {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          border: 0;
          /* tint Google's default palette toward the brand */
          filter: grayscale(0.45) sepia(0.18) saturate(0.78) contrast(1.02) brightness(0.98);
        }
        .vst__tint {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          mix-blend-mode: multiply;
          background:
            radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(54,65,47,0.16)),
            linear-gradient(180deg, rgba(54,65,47,0.05), rgba(27,25,22,0.12));
        }
        .vst__plaque {
          position: absolute; z-index: 3;
          bottom: 1.1rem; inset-inline-start: 1.1rem;
          display: inline-flex; align-items: center; gap: 0.7rem;
          background: rgba(251,247,240,0.95);
          backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px);
          padding: 0.7rem 1rem; border-radius: 3px;
          box-shadow: 0 10px 30px -16px rgba(27,25,22,0.5);
          transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
        }
        .vst__plaque:hover { transform: translateY(-2px); box-shadow: 0 16px 36px -16px rgba(27,25,22,0.55); }
        .vst__plaque-pin { position: relative; flex: none; width: 9px; height: 9px; border-radius: 50%; background: var(--clay); }
        .vst__plaque-pulse {
          position: absolute; inset: 0; border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(178,116,87,0.5);
          animation: vstPulse 2.4s var(--ease) infinite;
        }
        .vst__plaque-text { display: flex; flex-direction: column; gap: 0.1rem; line-height: 1.25; }
        .vst__plaque-text > span:first-child { font-size: 0.86rem; font-weight: 600; color: var(--ink); }
        .vst__plaque-cta { font-size: 0.7rem; letter-spacing: 0.04em; color: var(--brass); }

        @keyframes vstPulse {
          0%   { box-shadow: 0 0 0 0 rgba(178,116,87,0.5); }
          70%  { box-shadow: 0 0 0 13px rgba(178,116,87,0); }
          100% { box-shadow: 0 0 0 0 rgba(178,116,87,0); }
        }

        @media (max-width: 860px) {
          .vst__plate { order: -1; }
          .vst__map { min-height: 0; aspect-ratio: 16 / 11; }
          .vst__edge { display: none; }
          /* the short mobile map puts Google's logo + attribution row right
             where the plaque sat — lift it clear so both stay readable */
          .vst__plaque { bottom: 2.6rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vst__plaque-pulse { animation: none; }
          .vst__plaque, .vst__quiet, .vst__go { transition: none; }
        }
      `})]})}])},208673,e=>{"use strict";var t=e.i(843476),a=e.i(271645);e.i(88653);var r=e.i(846932),i=e.i(772328),n=e.i(997305),s=e.i(660613),o=e.i(801583),l=e.i(912469),p=e.i(207761);let d={Sofas:"الكنب",Seating:"الجلوس",Tables:"الطاولات",Storage:"التخزين",Bedroom:"غرف النوم"},c={New:"جديد",Bestseller:"الأكثر مبيعًا",Limited:"محدود"};e.s(["default",0,function({product:e,onClose:m}){let h,{t:f,lang:g}=(0,p.useT)(),u="en"===g,v=(0,i.useReducedMotion)(),[x,b]=(0,a.useState)(e),y=(0,a.useRef)(null);(0,a.useEffect)(()=>b(e),[e]),(0,a.useEffect)(()=>{y.current?.scrollTo({top:0})},[x.id]),(0,a.useEffect)(()=>{let e=document.body.style.overflow;document.body.style.overflow="hidden";let t=e=>"Escape"===e.key&&m();return window.addEventListener("keydown",t),()=>{document.body.style.overflow=e,window.removeEventListener("keydown",t)}},[m]);let w=(0,n.shopProductCopy)(x,g),_=(0,s.completeTheRoom)(x),j=`/shop/${s.CATEGORY_SLUG[x.category]}`,k=`${o.WHATSAPP}?text=${encodeURIComponent(u?`Hi Evora! I'd love to enquire about the ${x.name} (${x.tagline}).`:`مرحبًا إيفورا! أودّ الاستفسار عن ${x.name} (${w.tagline}).`)}`;return(0,t.jsxs)(r.motion.div,{className:"qv-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},onClick:m,children:[(0,t.jsxs)(r.motion.div,{className:"qv",initial:v?{opacity:0}:{y:40,opacity:0,scale:.985},animate:{y:0,opacity:1,scale:1},exit:v?{opacity:0}:{y:28,opacity:0,scale:.99},transition:{type:"spring",stiffness:250,damping:30},onClick:e=>e.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":x.name,children:[(0,t.jsx)("button",{className:"qv-close",onClick:m,"aria-label":f("qv_close"),children:(0,t.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",children:(0,t.jsx)("path",{d:"M1 1l16 16M17 1L1 17",stroke:"currentColor",strokeWidth:"1.6"})})}),(0,t.jsxs)("div",{className:"qv-stage",children:[(0,t.jsx)("img",{src:x.image,alt:x.name,className:"qv-stage-img"},x.id),(0,t.jsx)("span",{className:"qv-wm","aria-hidden":!0})]}),(0,t.jsxs)("div",{className:"qv-info",children:[(0,t.jsxs)("div",{className:"qv-scroll",ref:y,children:[x.badge&&(0,t.jsx)("span",{className:"qv-tag",children:"ar"===g?c[x.badge]:x.badge}),(0,t.jsx)("span",{className:"eyebrow qv-cat",children:(h=x.category,"ar"===g?d[h]:h)}),(0,t.jsx)("h2",{className:"display qv-name",children:x.name}),(0,t.jsx)("p",{className:"qv-tagline",children:w.tagline}),(0,t.jsx)("p",{className:"qv-desc",children:w.description}),(0,t.jsxs)("dl",{className:"qv-specs",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("dt",{children:f("qv_dims")}),(0,t.jsxs)("dd",{children:[x.dimensions.w," × ",x.dimensions.d," ×"," ",x.dimensions.h," cm"]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("dt",{children:f("qv_materials")}),(0,t.jsx)("dd",{children:x.materials.join(" · ")})]})]}),_.length>0&&(0,t.jsxs)("div",{className:"qv-similar",children:[(0,t.jsxs)("div",{className:"qv-similar-head",children:[(0,t.jsx)("span",{className:"qv-label",style:{marginBottom:0},children:f("shop_similar")}),(0,t.jsxs)("a",{href:j,className:"qv-viewall","data-cursor":"hover",children:[f("shop_view_all")," ",(0,t.jsx)("span",{"aria-hidden":!0,children:"→"})]})]}),(0,t.jsx)("div",{className:"qv-similar-row",children:_.map(e=>(0,t.jsxs)("button",{type:"button",className:"qv-mini","data-cursor":"hover",onClick:()=>b(e),"aria-label":e.name,children:[(0,t.jsxs)("span",{className:"qv-mini-img",children:[(0,t.jsx)("img",{src:e.image,alt:e.name,loading:"lazy"}),(0,t.jsx)("span",{className:"qv-mini-wm","aria-hidden":!0})]}),(0,t.jsx)("span",{className:"qv-mini-name display",children:e.name}),(0,t.jsx)("span",{className:"qv-mini-tag",children:(0,n.shopProductCopy)(e,g).tagline})]},e.id))})]})]}),(0,t.jsxs)("div",{className:"qv-foot",children:[(0,t.jsxs)("div",{className:"qv-cta",children:[(0,t.jsx)("button",{type:"button",onClick:l.openStartProject,className:"qv-btn qv-btn-dark","data-cursor":"hover",children:f("shop_add_design")}),(0,t.jsx)("a",{href:k,target:"_blank",rel:"noopener noreferrer",className:"qv-btn qv-btn-ghost","data-cursor":"hover",children:f("shop_enquire")})]}),(0,t.jsx)("div",{className:"qv-cta-sub",children:(0,t.jsx)("a",{href:"/visit",className:"qv-link","data-cursor":"hover",children:f("shop_showroom_cta")})})]})]})]}),(0,t.jsx)("style",{children:`
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
      `})]})}])},431487,e=>{"use strict";var t=e.i(801583);let a=[{value:t.HOMES,label:"stat_homes"},{value:t.FOLLOWERS,label:"stat_followers"},{value:"4.9★",label:"stat_rating"},{value:"346",label:"stat_pieces"}];e.s(["categories",0,[{id:"sofas",name:{en:"Sofas & Couches",ar:"كنب وأرائك"},count:{en:"The living room",ar:"غرفة المعيشة"},img:"/evora/p08.jpg"},{id:"bedrooms",name:{en:"Beds & Bedrooms",ar:"أسرّة وغرف نوم"},count:{en:"The calm centre",ar:"قلب الهدوء"},img:"/evora/c-bedrooms.jpg"},{id:"dining",name:{en:"Dining Tables",ar:"طاولات طعام"},count:{en:"Gather & host",ar:"للعزائم واللقاء"},img:"/evora/p03.jpg"},{id:"seating",name:{en:"Armchairs & Seating",ar:"كراسي ومقاعد"},count:{en:"Sculpted seating",ar:"مقاعد منحوتة"},img:"/evora/ig-chesterfield.jpg"},{id:"tables",name:{en:"Coffee & Side Tables",ar:"طاولات قهوة وجانبية"},count:{en:"The centre table",ar:"طاولة الوسط"},img:"/evora/p11.jpg"},{id:"storage",name:{en:"Wardrobes & Storage",ar:"خزائن وتخزين"},count:{en:"Made to measure",ar:"حسب القياس"},img:"/evora/p02.jpg"},{id:"lighting",name:{en:"Lighting",ar:"إضاءة"},count:{en:"Pendants & sconces",ar:"ثريّات ومعلّقات"},img:"/evora/p10.jpg"},{id:"outdoor",name:{en:"Outdoor & Garden",ar:"حدائق وخارجي"},count:{en:"Seasonal",ar:"موسمي"},img:"/evora/p05.jpg"},{id:"rugs",name:{en:"Rugs & Textiles",ar:"سجاد ومنسوجات"},count:{en:"Hand-knotted",ar:"معقود باليد"},img:"/evora/p09.jpg"},{id:"decor",name:{en:"Décor & Accessories",ar:"ديكور وإكسسوارات"},count:{en:"Objects & vessels",ar:"تُحف وأوانٍ"},img:"/evora/p04.jpg"}],"financingPoints",0,[{en:"Up to 24 months",ar:"حتى ٢٤ شهرًا"},{en:"Same cash price",ar:"بنفس سعر الكاش"},{en:"Fast in-showroom approval",ar:"موافقة سريعة في المعرض"}],"marqueeItems",0,[{en:"Your Future Home",ar:"بيت المستقبل"},{en:"Built-in Closets",ar:"خزائن حسب القياس"},{en:"Interior Design — Complimentary",ar:"تصميم داخلي — هديّة"},{en:"Up to 24 Months, No Interest",ar:"حتى ٢٤ شهرًا بدون فوائد"},{en:"White-Glove Delivery Across Jordan",ar:"توصيلٌ بعناية في كل الأردن"},{en:"New Pieces Monthly",ar:"قطعٌ جديدة شهريًا"},{en:"Since 2017",ar:"منذ ٢٠١٧"}],"processSteps",0,[{n:"01",title:{en:"Your 2D blueprint",ar:"مخططك ثنائي الأبعاد"},body:{en:"You reach us with a bare floor plan — walls, rooms, dimensions. No furniture yet, just your empty space.",ar:"تصل إلينا بمخطط فارغ — جدران وغرف وأبعاد. لا أثاث بعد، فقط مساحتك الفارغة."}},{n:"02",title:{en:"Furnished in 2D",ar:"نؤثّثه ثنائيًا"},body:{en:"Our studio lays out the furniture on your plan — every piece placed and scaled to fit how you live.",ar:"يوزّع الاستوديو الأثاث على مخططك — كل قطعة موضوعة ومقاسة لتناسب أسلوب حياتك."}},{n:"03",title:{en:"Brought to life in 3D",ar:"نحييه ثلاثي الأبعاد"},body:{en:"We rebuild the furnished plan in interactive 3D — walk every room and see the pieces from any angle.",ar:"نعيد بناء المخطط المؤثّث بثلاثية أبعاد تفاعلية — تجوّل في كل غرفة وشاهد القطع من أي زاوية."}},{n:"04",title:{en:"Photoreal render to confirm",ar:"عرض واقعي للتأكيد"},body:{en:"A photoreal render of the final look for your sign-off — once you approve, we start producing.",ar:"عرض واقعي للمظهر النهائي لاعتماده — بمجرد موافقتك، نبدأ الإنتاج."}}],"stats",0,a,"testimonials",0,[{quote:{en:"They designed our whole apartment — from the closets to the last cushion. It feels like a hotel.",ar:"صمّموا شقتنا بالكامل — من الخزائن حتى آخر وسادة. صار البيت يشبه الفنادق."},name:"Lara H.",role:{en:"Homeowner · Abdoun",ar:"صاحبة منزل · عبدون"}},{quote:{en:"The quality is on another level, and the installments made it easy. Delivery team was flawless.",ar:"الجودة بمستوى ثاني، والتقسيط سهّل كل شي. فريق التوصيل كان ممتاز."},name:"Omar K.",role:{en:"Homeowner · Khalda",ar:"صاحب منزل · خلدا"}},{quote:{en:"We furnished two villas through Evora. Their design team just gets the brief, every time.",ar:"أثّثنا فيلتين مع إيفورا. فريق التصميم بيفهم المطلوب من أول مرة، دائمًا."},name:"Studio Noon",role:{en:"Interior Studio · Amman",ar:"استوديو تصميم · عمّان"}}]])},851426,e=>{"use strict";var t=e.i(843476),a=e.i(271645);e.s(["default",0,function({src:e,poster:r,className:i,style:n,...s}){let[o,l]=(0,a.useState)(e),p=(0,a.useRef)(!1),[d,c]=(0,a.useState)(!1),m=(0,a.useRef)(null);(0,a.useEffect)(()=>{(p.current=!1,window.matchMedia)?l(window.matchMedia("(max-width: 768px)").matches?e.replace(/\.mp4(\?.*)?$/i,"-mobile.mp4$1"):e):l(e)},[e]),(0,a.useEffect)(()=>{let e=m.current;if(!e)return;let t=new IntersectionObserver(([t])=>{t.isIntersecting?(c(!0),e.play().catch(()=>{})):e.pause()},{rootMargin:"800px 0px"});return t.observe(e),()=>t.disconnect()},[]),(0,a.useEffect)(()=>{d&&m.current?.play().catch(()=>{})},[d,o]);let h={width:"100%",height:"100%",objectFit:"cover",display:"block",...n};return(0,t.jsx)("video",{...s,ref:m,className:i,style:h,src:d?o:void 0,poster:d?r:void 0,onError:()=>{p.current||o===e||(p.current=!0,l(e))},autoPlay:d,muted:!0,loop:!0,playsInline:!0,preload:d?"auto":"none"})}])},639525,e=>{"use strict";var t=e.i(843476),a=e.i(271645),r=e.i(207761),i=e.i(997305),n=e.i(208673),s=e.i(88653),o=e.i(719381);let l={New:"جديد",Bestseller:"الأكثر مبيعًا",Limited:"محدود"},p=["sofa-01","table-01","bedroom-01"].map(e=>i.shopProducts.find(t=>t.id===e)).filter(e=>!!e);function d({product:e,onOpen:a}){let{lang:n}=(0,r.useT)(),s=(0,i.shopProductCopy)(e,n).tagline;return(0,t.jsxs)("button",{className:"feat-card",onClick:a,"data-cursor":"hover","aria-label":`${e.name} — ${s}`,children:[(0,t.jsxs)("div",{className:"feat-stage",children:[e.badge&&(0,t.jsx)("span",{className:"feat-badge",children:"ar"===n?l[e.badge]:e.badge}),(0,t.jsx)("img",{src:e.image,alt:e.name,className:"feat-img",loading:"lazy"}),(0,t.jsx)("span",{className:"feat-wm","aria-hidden":!0}),(0,t.jsx)("span",{className:"feat-look",children:"↗"})]}),(0,t.jsxs)("div",{className:"feat-meta",children:[(0,t.jsx)("h3",{className:"display feat-name",children:e.name}),(0,t.jsx)("p",{className:"feat-tag",children:s})]})]})}e.s(["default",0,function(){let{lang:e}=(0,r.useT)(),[i,l]=(0,a.useState)(null);return(0,t.jsxs)("section",{className:"feat",children:[(0,t.jsxs)("div",{className:"container",children:[(0,t.jsxs)("div",{className:"feat-intro",children:[(0,t.jsx)(o.Rise,{as:"span",className:"eyebrow",style:{color:"var(--brass)",display:"block"},children:"ar"===e?"قطع مميّزة":"Signature pieces"}),(0,t.jsx)(o.RevealLines,{lines:["ar"===e?"أعمالنا الأكثر طلبًا.":"Our most-loved pieces."],className:"display feat-title"}),(0,t.jsx)(o.Rise,{delay:.12,children:(0,t.jsx)("p",{className:"feat-sub",children:"ar"===e?"ثلاث قطعٍ توضّح لغة إيفورا — لون واحد، خطٌّ واحد، وحرفةٌ لا تُخطئها العين.":"Three pieces that sum up the Evora language — one colour, one line, craft you can spot from across the room."})})]}),(0,t.jsx)("div",{className:"feat-grid",children:p.map(e=>(0,t.jsx)(d,{product:e,onOpen:()=>l(e)},e.id))})]}),(0,t.jsx)(s.AnimatePresence,{children:i&&(0,t.jsx)(n.default,{product:i,onClose:()=>l(null)},i.id)}),(0,t.jsx)("style",{children:`
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
      `})]})}])}]);