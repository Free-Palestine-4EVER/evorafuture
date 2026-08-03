(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,85576,e=>{"use strict";let t=[{key:"blueprint",en:"2D Blueprint",ar:"المخطط ثنائي الأبعاد",hint_en:"We receive your empty 2D plan — no furniture yet.",hint_ar:"نستلم مخططك ثنائي الأبعاد بدون أثاث.",phase:"design"},{key:"furniture",en:"Furniture Design",ar:"تصميم الأثاث",hint_en:"We design the furniture for your space and get your approval.",hint_ar:"نصمم الأثاث لمساحتك وننتظر موافقتك.",phase:"design"},{key:"design3d",en:"3D Design & Setup",ar:"التصميم ثلاثي الأبعاد",hint_en:"We build your space in 3D — kitchen, living, every room set up.",hint_ar:"نبني مساحتك ثلاثية الأبعاد — المطبخ والمعيشة وكل غرفة.",phase:"design"},{key:"render",en:"Photoreal Render",ar:"العرض الواقعي",hint_en:"We render photoreal images of the final look.",hint_ar:"ننتج صورًا واقعية للمظهر النهائي.",phase:"design"},{key:"materials",en:"Gathering Materials",ar:"تجهيز المواد",hint_en:"We source and gather all materials for production.",hint_ar:"نوفّر ونجهّز جميع المواد للإنتاج.",phase:"production"},{key:"finishing",en:"Production & Finishing",ar:"الإنتاج والتشطيب",hint_en:"Your pieces are built and finished by hand.",hint_ar:"تُصنع قطعك وتُشطّب يدويًا.",phase:"production"},{key:"delivery",en:"Delivery & Install",ar:"التسليم والتركيب",hint_en:"We deliver and install everything in your home.",hint_ar:"نسلّم ونركّب كل شيء في منزلك.",phase:"production"}];e.s(["JOURNEY",0,t,"stageIndex",0,e=>Math.max(0,t.findIndex(t=>t.key===e))])},871522,e=>{"use strict";var t=e.i(843476),r=e.i(271645);let a={ink:"var(--ink)",paper:"var(--paper)",brass:"var(--brass-2)"};e.s(["default",0,function({tone:e,tagline:n=!0,draw:i=!1,drawMs:s=900,title:o="EVORA — Future Home",className:l,style:p}){let c=(0,r.useId)().replace(/[:]/g,""),d=e?a[e]:"currentColor";return(0,t.jsxs)("svg",{viewBox:n?"0 0 730 316":"0 0 730 186",role:"img","aria-label":o,className:l,style:{display:"block",color:d,overflow:"visible",...p},"data-draw":i?"on":void 0,children:[(0,t.jsx)("title",{children:o}),i&&(0,t.jsx)("style",{children:`
          [data-draw="on"] .ev-p {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: ev-draw-${c} ${s}ms cubic-bezier(0.22,1,0.36,1) forwards;
          }
          @keyframes ev-draw-${c} { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) {
            [data-draw="on"] .ev-p { stroke-dasharray: none; stroke-dashoffset: 0; animation: none; }
          }
        `}),(0,t.jsxs)("g",{fill:"none",stroke:d,strokeWidth:15,strokeLinecap:"square",strokeLinejoin:"miter",children:[(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 28 L30 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 28 L118 28"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 93 L104 93"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M30 158 L118 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M152 28 L214 158 L276 28"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M363 28 A65 65 0 0 1 363 158 A65 65 0 0 1 363 28 Z"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M452 28 L452 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M452 28 L512 28 A33 33 0 0 1 512 94 L452 94"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M502 94 L548 158"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,d:"M580 158 L640 28 L700 158"})]}),n&&(0,t.jsxs)("g",{transform:"translate(178 222)",fill:"none",stroke:d,strokeWidth:7,strokeLinecap:"square",strokeLinejoin:"miter",children:[(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(0 0)",d:"M0 0 L0 30 M0 0 L20 0 M0 14 L16 14"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(34 0)",d:"M0 0 L0 19 A11 11 0 0 0 22 19 L22 0"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(70 0)",d:"M0 0 L24 0 M12 0 L12 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(108 0)",d:"M0 0 L0 19 A11 11 0 0 0 22 19 L22 0"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(144 0)",d:"M0 0 L0 30 M0 0 L16 0 A8 8 0 0 1 16 16 L0 16 M11 16 L22 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(180 0)",d:"M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(244 0)",d:"M0 0 L0 30 M22 0 L22 30 M0 15 L22 15"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(280 0)",d:"M12 0 A12 15 0 0 1 12 30 A12 15 0 0 1 12 0 Z"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(318 0)",d:"M0 30 L0 0 L12 18 L24 0 L24 30"}),(0,t.jsx)("path",{className:"ev-p",pathLength:1,transform:"translate(356 0)",d:"M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30"})]})]})}])},772328,e=>{"use strict";var t=e.i(571164),r=e.i(138544),a=e.i(271645);e.s(["useReducedMotion",0,function(){t.hasReducedMotionListener.current||(0,r.initPrefersReducedMotion)();let[e]=(0,a.useState)(t.prefersReducedMotion.current);return e}])},801583,e=>{"use strict";e.s(["FOLLOWERS",0,"103K","HOMES",0,"2,400+","PHONE_PRIMARY",0,"+962 79 130 1444","PHONE_PRIMARY_TEL",0,"+962791301444","PHONE_SECONDARY",0,"+962 79 636 4105","WHATSAPP",0,"https://wa.me/962796364105"])},618566,(e,t,r)=>{t.exports=e.r(976562)},88653,e=>{"use strict";e.i(247167);var t=e.i(843476),r=e.i(271645),a=e.i(231178),n=e.i(947414),i=e.i(674008),s=e.i(821476),o=e.i(772846),l=r,p=e.i(737806);function c(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class d extends l.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if((0,o.isHTMLElement)(t)&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=t.offsetParent,r=(0,o.isHTMLElement)(e)&&e.offsetWidth||0,a=(0,o.isHTMLElement)(e)&&e.offsetHeight||0,n=getComputedStyle(t),i=this.props.sizeRef.current;i.height=parseFloat(n.height),i.width=parseFloat(n.width),i.top=t.offsetTop,i.left=t.offsetLeft,i.right=r-i.width-i.left,i.bottom=a-i.height-i.top,i.direction=n.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function h({children:e,isPresent:a,anchorX:n,anchorY:i,root:s,pop:o}){let m=(0,l.useId)(),u=(0,l.useRef)(null),f=(0,l.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:g}=(0,l.useContext)(p.MotionConfigContext),x=function(...e){return r.useCallback(function(...e){return t=>{let r=!1,a=e.map(e=>{let a=c(e,t);return r||"function"!=typeof a||(r=!0),a});if(r)return()=>{for(let t=0;t<a.length;t++){let r=a[t];"function"==typeof r?r():c(e[t],null)}}}}(...e),e)}(u,e.props?.ref??e?.ref);return(0,l.useInsertionEffect)(()=>{let{width:e,height:t,top:r,left:l,right:p,bottom:c,direction:d}=f.current;if(a||!1===o||!u.current||!e||!t)return;let h="rtl"===d,x="left"===n?h?`right: ${p}`:`left: ${l}`:h?`left: ${l}`:`right: ${p}`,v="bottom"===i?`bottom: ${c}`:`top: ${r}`;u.current.dataset.motionPopId=m;let y=document.createElement("style");g&&(y.nonce=g);let j=s??document.head;return j.appendChild(y),y.sheet&&y.sheet.insertRule(`
          [data-motion-pop-id="${m}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            ${x}px !important;
            ${v}px !important;
          }
        `),()=>{u.current?.removeAttribute("data-motion-pop-id"),j.contains(y)&&j.removeChild(y)}},[a]),(0,t.jsx)(d,{isPresent:a,childRef:u,sizeRef:f,pop:o,children:!1===o?e:l.cloneElement(e,{ref:x})})}let m=({children:e,initial:a,isPresent:i,onExitComplete:o,custom:l,presenceAffectsLayout:p,mode:c,anchorX:d,anchorY:m,root:f})=>{let g=(0,n.useConstant)(u),x=(0,r.useId)(),v=!0,y=(0,r.useMemo)(()=>(v=!1,{id:x,initial:a,isPresent:i,custom:l,onExitComplete:e=>{for(let t of(g.set(e,!0),g.values()))if(!t)return;o&&o()},register:e=>(g.set(e,!1),()=>g.delete(e))}),[i,g,o]);return p&&v&&(y={...y}),(0,r.useMemo)(()=>{g.forEach((e,t)=>g.set(t,!1))},[i]),r.useEffect(()=>{i||g.size||!o||o()},[i]),e=(0,t.jsx)(h,{pop:"popLayout"===c,isPresent:i,anchorX:d,anchorY:m,root:f,children:e}),(0,t.jsx)(s.PresenceContext.Provider,{value:y,children:e})};function u(){return new Map}var f=e.i(464978);let g=e=>e.key||"";function x(e){let t=[];return r.Children.forEach(e,e=>{(0,r.isValidElement)(e)&&t.push(e)}),t}e.s(["AnimatePresence",0,({children:e,custom:s,initial:o=!0,onExitComplete:l,presenceAffectsLayout:p=!0,mode:c="sync",propagate:d=!1,anchorX:h="left",anchorY:u="top",root:v})=>{let[y,j]=(0,f.usePresence)(d),b=(0,r.useMemo)(()=>x(e),[e]),w=d&&!y?[]:b.map(g),k=(0,r.useRef)(!0),L=(0,r.useRef)(b),N=(0,n.useConstant)(()=>new Map),M=(0,r.useRef)(new Set),[S,R]=(0,r.useState)(b),[P,z]=(0,r.useState)(b);(0,i.useIsomorphicLayoutEffect)(()=>{k.current=!1,L.current=b;for(let e=0;e<P.length;e++){let t=g(P[e]);w.includes(t)?(N.delete(t),M.current.delete(t)):!0!==N.get(t)&&N.set(t,!1)}},[P,w.length,w.join("-")]);let O=[];if(b!==S){let e=[...b];for(let t=0;t<P.length;t++){let r=P[t],a=g(r);w.includes(a)||(e.splice(t,0,r),O.push(r))}return"wait"===c&&O.length&&(e=O),z(x(e)),R(b),null}let{forceRender:_}=(0,r.useContext)(a.LayoutGroupContext);return(0,t.jsx)(t.Fragment,{children:P.map(e=>{let r=g(e),a=(!d||!!y)&&(b===P||w.includes(r));return(0,t.jsx)(m,{isPresent:a,initial:(!k.current||!!o)&&void 0,custom:s,presenceAffectsLayout:p,mode:c,root:v,onExitComplete:a?void 0:()=>{if(M.current.has(r)||!N.has(r))return;M.current.add(r),N.set(r,!0);let e=!0;N.forEach(t=>{t||(e=!1)}),e&&(_?.(),z(L.current),d&&j?.(),l&&l())},anchorX:h,anchorY:u,children:e},r)})})}],88653)},431487,e=>{"use strict";var t=e.i(801583);let r=[{value:t.HOMES,label:"stat_homes"},{value:t.FOLLOWERS,label:"stat_followers"},{value:"4.9★",label:"stat_rating"},{value:"346",label:"stat_pieces"}];e.s(["categories",0,[{id:"sofas",name:{en:"Sofas & Couches",ar:"كنب وأرائك"},count:{en:"The living room",ar:"غرفة المعيشة"},img:"/evora/p08.jpg"},{id:"bedrooms",name:{en:"Beds & Bedrooms",ar:"أسرّة وغرف نوم"},count:{en:"The calm centre",ar:"قلب الهدوء"},img:"/evora/c-bedrooms.jpg"},{id:"dining",name:{en:"Dining Tables",ar:"طاولات طعام"},count:{en:"Gather & host",ar:"للعزائم واللقاء"},img:"/evora/p03.jpg"},{id:"seating",name:{en:"Armchairs & Seating",ar:"كراسي ومقاعد"},count:{en:"Sculpted seating",ar:"مقاعد منحوتة"},img:"/evora/ig-chesterfield.jpg"},{id:"tables",name:{en:"Coffee & Side Tables",ar:"طاولات قهوة وجانبية"},count:{en:"The centre table",ar:"طاولة الوسط"},img:"/evora/p11.jpg"},{id:"storage",name:{en:"Wardrobes & Storage",ar:"خزائن وتخزين"},count:{en:"Made to measure",ar:"حسب القياس"},img:"/evora/p02.jpg"},{id:"lighting",name:{en:"Lighting",ar:"إضاءة"},count:{en:"Pendants & sconces",ar:"ثريّات ومعلّقات"},img:"/evora/p10.jpg"},{id:"outdoor",name:{en:"Outdoor & Garden",ar:"حدائق وخارجي"},count:{en:"Seasonal",ar:"موسمي"},img:"/evora/p05.jpg"},{id:"rugs",name:{en:"Rugs & Textiles",ar:"سجاد ومنسوجات"},count:{en:"Hand-knotted",ar:"معقود باليد"},img:"/evora/p09.jpg"},{id:"decor",name:{en:"Décor & Accessories",ar:"ديكور وإكسسوارات"},count:{en:"Objects & vessels",ar:"تُحف وأوانٍ"},img:"/evora/p04.jpg"}],"financingPoints",0,[{en:"Up to 24 months",ar:"حتى ٢٤ شهرًا"},{en:"Same cash price",ar:"بنفس سعر الكاش"},{en:"Fast in-showroom approval",ar:"موافقة سريعة في المعرض"}],"marqueeItems",0,[{en:"Your Future Home",ar:"بيت المستقبل"},{en:"Built-in Closets",ar:"خزائن حسب القياس"},{en:"Interior Design — Complimentary",ar:"تصميم داخلي — هديّة"},{en:"Up to 24 Months, No Interest",ar:"حتى ٢٤ شهرًا بدون فوائد"},{en:"White-Glove Delivery Across Jordan",ar:"توصيلٌ بعناية في كل الأردن"},{en:"New Pieces Monthly",ar:"قطعٌ جديدة شهريًا"},{en:"Since 2017",ar:"منذ ٢٠١٧"}],"processSteps",0,[{n:"01",title:{en:"Your 2D blueprint",ar:"مخططك ثنائي الأبعاد"},body:{en:"You reach us with a bare floor plan — walls, rooms, dimensions. No furniture yet, just your empty space.",ar:"تصل إلينا بمخطط فارغ — جدران وغرف وأبعاد. لا أثاث بعد، فقط مساحتك الفارغة."}},{n:"02",title:{en:"Furnished in 2D",ar:"نؤثّثه ثنائيًا"},body:{en:"Our studio lays out the furniture on your plan — every piece placed and scaled to fit how you live.",ar:"يوزّع الاستوديو الأثاث على مخططك — كل قطعة موضوعة ومقاسة لتناسب أسلوب حياتك."}},{n:"03",title:{en:"Brought to life in 3D",ar:"نحييه ثلاثي الأبعاد"},body:{en:"We rebuild the furnished plan in interactive 3D — walk every room and see the pieces from any angle.",ar:"نعيد بناء المخطط المؤثّث بثلاثية أبعاد تفاعلية — تجوّل في كل غرفة وشاهد القطع من أي زاوية."}},{n:"04",title:{en:"Photoreal render to confirm",ar:"عرض واقعي للتأكيد"},body:{en:"A photoreal render of the final look for your sign-off — once you approve, we start producing.",ar:"عرض واقعي للمظهر النهائي لاعتماده — بمجرد موافقتك، نبدأ الإنتاج."}}],"stats",0,r,"testimonials",0,[{quote:{en:"They designed our whole apartment — from the closets to the last cushion. It feels like a hotel.",ar:"صمّموا شقتنا بالكامل — من الخزائن حتى آخر وسادة. صار البيت يشبه الفنادق."},name:"Lara H.",role:{en:"Homeowner · Abdoun",ar:"صاحبة منزل · عبدون"}},{quote:{en:"The quality is on another level, and the installments made it easy. Delivery team was flawless.",ar:"الجودة بمستوى ثاني، والتقسيط سهّل كل شي. فريق التوصيل كان ممتاز."},name:"Omar K.",role:{en:"Homeowner · Khalda",ar:"صاحب منزل · خلدا"}},{quote:{en:"We furnished two villas through Evora. Their design team just gets the brief, every time.",ar:"أثّثنا فيلتين مع إيفورا. فريق التصميم بيفهم المطلوب من أول مرة، دائمًا."},name:"Studio Noon",role:{en:"Interior Studio · Amman",ar:"استوديو تصميم · عمّان"}}]])},987718,e=>{"use strict";e.s(["avifSrc",0,e=>e.replace(/\.(jpe?g|webp)$/i,".avif")])},195057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={formatUrl:function(){return o},formatWithValidation:function(){return p},urlObjectKeys:function(){return l}};for(var n in a)Object.defineProperty(r,n,{enumerable:!0,get:a[n]});let i=e.r(190809)._(e.r(998183)),s=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:r}=e,a=e.protocol||"",n=e.pathname||"",o=e.hash||"",l=e.query||"",p=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?p=t+e.host:r&&(p=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(p+=":"+e.port)),l&&"object"==typeof l&&(l=String(i.urlQueryToSearchParams(l)));let c=e.search||l&&`?${l}`||"";return a&&!a.endsWith(":")&&(a+=":"),e.slashes||(!a||s.test(a))&&!1!==p?(p="//"+(p||""),n&&"/"!==n[0]&&(n="/"+n)):p||(p=""),o&&"#"!==o[0]&&(o="#"+o),c&&"?"!==c[0]&&(c="?"+c),n=n.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${a}${p}${n}${c}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function p(e){return o(e)}},818581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return n}});let a=e.r(271645);function n(e,t){let r=(0,a.useRef)(null),n=(0,a.useRef)(null);return(0,a.useCallback)(a=>{if(null===a){let e=r.current;e&&(r.current=null,e());let t=n.current;t&&(n.current=null,t())}else e&&(r.current=i(e,a)),t&&(n.current=i(t,a))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},573668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return i}});let a=e.r(718967),n=e.r(652817);function i(e){if(!(0,a.isAbsoluteUrl)(e))return!0;try{let t=(0,a.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,n.hasBasePath)(r.pathname)}catch(e){return!1}}},284508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},522016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return x},useLinkStatus:function(){return y}};for(var n in a)Object.defineProperty(r,n,{enumerable:!0,get:a[n]});let i=e.r(190809),s=e.r(843476),o=i._(e.r(271645)),l=e.r(195057),p=e.r(8372),c=e.r(818581),d=e.r(718967),h=e.r(405550);e.r(233525);let m=e.r(388540),u=e.r(91949),f=e.r(573668),g=e.r(509396);function x(t){var r,a;let n,i,x,[y,j]=(0,o.useOptimistic)(u.IDLE_LINK_STATUS),b=(0,o.useRef)(null),{href:w,as:k,children:L,prefetch:N=null,passHref:M,replace:S,shallow:R,scroll:P,onClick:z,onMouseEnter:O,onTouchStart:_,legacyBehavior:T=!1,onNavigate:C,transitionTypes:E,ref:I,unstable_dynamicOnHover:A,...D}=t;n=L,T&&("string"==typeof n||"number"==typeof n)&&(n=(0,s.jsx)("a",{children:n}));let W=o.default.useContext(p.AppRouterContext),F=!1!==N,$=!1!==N?null===(a=N)||"auto"===a?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,U="string"==typeof(r=k||w)?r:(0,l.formatUrl)(r);if(T){if(n?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=o.default.Children.only(n)}let H=T?i&&"object"==typeof i&&i.ref:I,B=o.default.useCallback(e=>(null!==W&&(b.current=(0,u.mountLinkInstance)(e,U,W,$,F,j)),()=>{b.current&&((0,u.unmountLinkForCurrentNavigation)(b.current),b.current=null),(0,u.unmountPrefetchableInstance)(e)}),[F,U,W,$,j]),G={ref:(0,c.useMergedRef)(B,H),onClick(t){T||"function"!=typeof z||z(t),T&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!W||t.defaultPrevented||function(t,r,a,n,i,s,l){if("u">typeof window){let p,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((p=t.currentTarget.getAttribute("target"))&&"_self"!==p||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,f.isLocalURL)(r)){n&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(699781);o.default.startTransition(()=>{d(r,n?"replace":"push",!1===i?m.ScrollBehavior.NoScroll:m.ScrollBehavior.Default,a.current,l)})}}(t,U,b,S,P,C,E)},onMouseEnter(e){T||"function"!=typeof O||O(e),T&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),W&&F&&(0,u.onNavigationIntent)(e.currentTarget,!0===A)},onTouchStart:function(e){T||"function"!=typeof _||_(e),T&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),W&&F&&(0,u.onNavigationIntent)(e.currentTarget,!0===A)}};return(0,d.isAbsoluteUrl)(U)?G.href=U:T&&!M&&("a"!==i.type||"href"in i.props)||(G.href=(0,h.addBasePath)(U)),x=T?o.default.cloneElement(i,G):(0,s.jsx)("a",{...D,...G,children:n}),(0,s.jsx)(v.Provider,{value:y,children:x})}e.r(284508);let v=(0,o.createContext)(u.IDLE_LINK_STATUS),y=()=>(0,o.useContext)(v);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},750968,e=>{"use strict";var t=e.i(843476),r=e.i(271645),a=e.i(522016),n=e.i(207761),i=e.i(431487),s=e.i(85576),o=e.i(719381),l=e.i(846932),p=e.i(772328),c=e.i(88653),d=e.i(987718);let h=[{src:"/evora/kitchen/stage-1.jpg",en:"2D blueprint",ar:"مخطط ثنائي الأبعاد"},{src:"/evora/kitchen/stage-2.jpg",en:"Furnished in 2D",ar:"مفروش ثنائي الأبعاد"},{src:"/evora/kitchen/stage-3.jpg",en:"Built in 3D",ar:"مبني ثلاثي الأبعاد"},{src:"/evora/kitchen/stage-4.jpg",en:"Photoreal — approved",ar:"واقعي — معتمد"}];function m({step:e,ar:r}){let a=(0,p.useReducedMotion)(),n=Math.max(0,Math.min(3,e));return(0,t.jsxs)("div",{className:"ts-stage","aria-label":r?h[n].ar:h[n].en,children:[h.map((e,i)=>{let s=i===n;return(0,t.jsx)(l.motion.div,{className:"ts-frame",initial:!1,animate:{opacity:+!!s},transition:{duration:.7*!a,ease:"easeInOut"},style:{zIndex:s?2:1},children:(0,t.jsxs)("picture",{children:[(0,t.jsx)("source",{srcSet:(0,d.avifSrc)(e.src),type:"image/avif"}),(0,t.jsx)(l.motion.img,{src:e.src,alt:r?e.ar:e.en,loading:"lazy",decoding:"async",className:"ts-img",initial:!1,animate:a?{scale:1}:{scale:s?1.06:1},transition:{duration:7*!!s,ease:"linear"},draggable:!1})]})},i)}),(0,t.jsx)(c.AnimatePresence,{children:n>=3&&(0,t.jsx)(l.motion.div,{className:"ts-frame ts-video",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.8,ease:"easeOut"},style:{zIndex:3},children:(0,t.jsx)(u,{ar:r,reduced:!!a})})}),(0,t.jsx)("div",{className:"ts-scrim"}),(0,t.jsx)(c.AnimatePresence,{mode:"wait",children:(0,t.jsxs)(l.motion.div,{className:"ts-caption",initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.4},children:[(0,t.jsx)("span",{className:"ts-num",children:`0${n+1}`}),r?h[n].ar:h[n].en]},n)}),(0,t.jsx)("div",{className:"ts-dots","aria-hidden":!0,children:h.map((e,r)=>(0,t.jsx)("span",{className:`ts-dot${r===n?" on":r<n?" done":""}`},r))}),(0,t.jsx)("style",{children:`
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
      `})]})}function u({ar:e,reduced:r}){return(0,t.jsxs)(l.motion.div,{className:"ts-approved",initial:{scale:.7,opacity:0,y:10},animate:{scale:1,opacity:1,y:0},transition:{type:r?"tween":"spring",stiffness:200,damping:16,delay:.5*!r},style:{position:"absolute",top:16,insetInlineEnd:16,zIndex:4,display:"inline-flex",alignItems:"center",gap:8,fontFamily:"var(--f-display), Georgia, serif",fontSize:"clamp(13px,1.5vw,16px)",color:"#fff",padding:"8px 16px",borderRadius:999,background:"var(--ever)",border:"1px solid var(--brass-2)",boxShadow:"0 16px 40px -16px rgba(22,21,15,0.6)"},children:[(0,t.jsx)("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",children:(0,t.jsx)("path",{d:"M5 12.5 L10 17.5 L19 7",stroke:"var(--brass-2)",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round"})}),e?"تمت الموافقة":"Approved"]})}var f=e.i(912469);let g=[.22,1,.36,1],x={type:"spring",stiffness:320,damping:34},v=[{en:"Walls, rooms, dimensions — nothing else yet.",ar:"جدران وغرف وأبعاد — لا شيء آخر بعد."},{en:"Every piece placed to scale, to how you live.",ar:"كل قطعة موضوعة بالمقاس، وبأسلوب حياتك."},{en:"Walk it, spin it, see it from any angle.",ar:"تجوّل فيه، أدِره، شاهده من أي زاوية."},{en:"Approve once — then we build it for real.",ar:"اعتمده مرة — ثم نصنعه على الحقيقة."}];function y({ar:e}){return(0,t.jsxs)(l.motion.div,{initial:{opacity:0,y:40},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.8,ease:g},style:{marginTop:"clamp(3rem,7vw,6rem)",borderRadius:24,padding:"clamp(1.8rem,4vw,3.2rem)",background:"var(--ink)",color:"var(--paper)",overflow:"hidden",position:"relative"},children:[(0,t.jsxs)("div",{className:"pj-finale",style:{display:"grid",gap:"clamp(2rem,5vw,4rem)",gridTemplateColumns:"minmax(0,1fr) minmax(0,1.1fr)",alignItems:"center"},children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",fontSize:"0.72rem",letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--brass)"},children:[(0,t.jsx)(w,{active:!0})," ",e?"متابعة مباشرة":"Live tracking"]}),(0,t.jsx)("h2",{className:"display",style:{fontSize:"clamp(1.8rem,4vw,3rem)",margin:"1rem 0 0.9rem",fontWeight:360,lineHeight:1.1,color:"var(--paper)"},children:e?"ثم نصنعه — وأنت تشاهد":"Then we build it — and you watch"}),(0,t.jsx)("p",{style:{color:"rgba(245,242,235,0.72)",fontSize:"1.02rem",lineHeight:1.7,maxWidth:"44ch",margin:0},children:e?"بعد اعتمادك، يبدأ الإنتاج. يحدّث فريقنا كل مرحلة بالصور، وتظهر التحديثات فورًا في لوحتك — تجهيز المواد، التصنيع، التشطيب، حتى التركيب.":"After you approve, production begins. Our team updates each stage with photos, and updates appear instantly in your dashboard — sourcing materials, building, finishing, all the way to install."}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.8rem",marginTop:"1.8rem",flexWrap:"wrap"},children:[(0,t.jsx)(a.default,{href:"/dashboard",style:{padding:"0.85rem 1.5rem",borderRadius:999,background:"var(--clay)",color:"#fff",fontWeight:600,fontSize:"0.92rem",textDecoration:"none"},children:e?"افتح لوحتي":"Open my dashboard"}),(0,t.jsx)("button",{type:"button",onClick:f.openStartProject,style:{padding:"0.85rem 1.5rem",borderRadius:999,border:"1px solid rgba(245,242,235,0.3)",background:"transparent",color:"var(--paper)",fontWeight:500,fontSize:"0.92rem",cursor:"pointer",fontFamily:"var(--f-sans)"},children:e?"ابدأ مشروعًا":"Start a project"})]})]}),(0,t.jsxs)("div",{style:{background:"rgba(245,242,235,0.05)",border:"1px solid rgba(245,242,235,0.12)",borderRadius:18,padding:"1.4rem 1.5rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.1rem"},children:[(0,t.jsx)("span",{style:{fontFamily:"var(--f-display)",fontSize:"1.15rem",color:"var(--paper)"},children:e?"غرفة المعيشة — فيلا":"Living Room — Villa"}),(0,t.jsx)("span",{style:{fontSize:"0.68rem",color:"var(--brass)",border:"1px solid rgba(201,162,93,0.4)",padding:"0.25em 0.7em",borderRadius:999},children:e?"قيد الإنتاج":"In production"})]}),(0,t.jsx)("ol",{style:{listStyle:"none",margin:0,padding:0},children:s.JOURNEY.map((r,a)=>{let n=a<5,i=5===a;return(0,t.jsxs)("li",{style:{display:"flex",gap:"0.8rem",alignItems:"flex-start",paddingBottom:a<s.JOURNEY.length-1?"0.7rem":0},children:[(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",alignSelf:"stretch"},children:[(0,t.jsx)("span",{style:{width:16,height:16,borderRadius:999,flexShrink:0,display:"grid",placeItems:"center",fontSize:"0.55rem",color:"#fff",background:n?"var(--clay)":i?"var(--brass)":"transparent",border:n||i?"none":"1.5px solid rgba(245,242,235,0.25)"},children:n?"✓":""}),a<s.JOURNEY.length-1&&(0,t.jsx)("span",{style:{width:1.5,flex:1,background:n?"var(--clay)":"rgba(245,242,235,0.15)",marginTop:2,minHeight:14}})]}),(0,t.jsxs)("span",{style:{fontSize:"0.9rem",color:n||i?"var(--paper)":"rgba(245,242,235,0.45)",fontWeight:i?600:400,paddingTop:1,display:"flex",alignItems:"center",gap:"0.5rem"},children:[e?r.ar:r.en,i&&(0,t.jsx)(w,{active:!0,small:!0})]})]},r.key)})})]})]}),(0,t.jsx)("style",{children:"@media (max-width: 760px){ .pj-finale{ grid-template-columns: 1fr !important; } }"})]})}let j={eyebrow:{en:"Your turn",ar:"دورك الآن"},title:{en:"Have a plan? Let's make it your home.",ar:"عندك مخطّط؟ خلّينا نحوّله إلى منزلك."},sub:{en:"Send us your 2D floor plan and your number. We'll furnish it, build it in 3D and render it photoreal — free, with no obligation.",ar:"أرسل لنا مخطّطك ثنائي الأبعاد ورقمك، ونحن نؤثّثه ونبنيه ثلاثي الأبعاد ونقدّمه بعرض واقعي — مجانًا ودون أي التزام."},upload:{en:"Upload your plan",ar:"ارفع مخطّطك"},note:{en:"Free design · we reply within a day",ar:"تصميم مجاني · نردّ خلال يوم"},hint:{en:"JPG, PNG or PDF — a phone photo works too",ar:"JPG أو PNG أو PDF — حتى صورة بالجوال تكفي"}};function b({lang:e,reduced:r}){let a=t=>j[t][e];return(0,t.jsxs)(l.motion.div,{className:"pj-cta",initial:!r&&{opacity:0,y:36},whileInView:r?void 0:{opacity:1,y:0},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.7,ease:g},children:[(0,t.jsx)("span",{className:"pj-cta-glyph","aria-hidden":!0,children:(0,t.jsxs)("svg",{viewBox:"0 0 24 24",width:"26",height:"26",fill:"none",children:[(0,t.jsx)("path",{d:"M12 16V5m0 0L8 9m4-4 4 4",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"}),(0,t.jsx)("path",{d:"M4 14v3.5A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V14",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"})]})}),(0,t.jsx)("span",{className:"pj-cta-eyebrow",children:a("eyebrow")}),(0,t.jsx)("h2",{className:"pj-cta-title",children:a("title")}),(0,t.jsx)("p",{className:"pj-cta-sub",children:a("sub")}),(0,t.jsxs)("button",{type:"button",className:"pj-cta-btn",onClick:f.openStartProject,children:[a("upload"),(0,t.jsx)("svg",{viewBox:"0 0 24 24",width:"17",height:"17",fill:"none","aria-hidden":!0,children:(0,t.jsx)("path",{d:"M5 12h13m0 0-5-5m5 5-5 5",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round",className:"pj-cta-arrow"})})]}),(0,t.jsx)("span",{className:"pj-cta-hint",children:a("hint")}),(0,t.jsxs)("span",{className:"pj-cta-note",children:[(0,t.jsx)("span",{className:"pj-free-dot","aria-hidden":!0}),a("note")]}),(0,t.jsx)("style",{children:`
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
      `})]})}function w({active:e,small:r}){let a=r?7:9;return(0,t.jsxs)("span",{style:{position:"relative",width:a,height:a,display:"inline-block"},children:[(0,t.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:999,background:"var(--brass)"}}),e&&(0,t.jsx)(l.motion.span,{style:{position:"absolute",inset:0,borderRadius:999,background:"var(--brass)"},animate:{scale:[1,2.4],opacity:[.6,0]},transition:{duration:1.6,repeat:1/0,ease:"easeOut"}})]})}e.s(["default",0,function({showFinale:e=!0}){let{t:a,lang:s,dir:c}=(0,n.useT)(),d="ar"===s,h=(0,p.useReducedMotion)(),[u,f]=(0,r.useState)(0),g=u%2==1;return(0,t.jsxs)("section",{dir:c,style:{position:"relative",paddingTop:"clamp(4rem,9vw,7rem)"},children:[(0,t.jsxs)("div",{className:"container pj-head",children:[(0,t.jsx)(o.Rise,{children:(0,t.jsxs)("span",{className:"pj-kicker",children:[(0,t.jsx)("span",{className:"pj-kicker-rule"}),d?"كيف تعمل إيفورا":"How Evora works",(0,t.jsx)("span",{className:"pj-kicker-rule"})]})}),(0,t.jsx)(o.Rise,{delay:.06,as:"h2",className:"pj-title",children:d?(0,t.jsxs)(t.Fragment,{children:["مخطّطٌ مسطّح، ",(0,t.jsx)("em",{children:"يصبح منزلك."})]}):(0,t.jsxs)(t.Fragment,{children:["A flat plan, ",(0,t.jsx)("em",{children:"made a home."})]})}),(0,t.jsx)(o.Rise,{delay:.12,as:"p",className:"pj-lede",children:d?"أربع خطوات فقط: ترسل مخطّطك، فنؤثّثه ونبنيه ثلاثي الأبعاد ونقدّمه بعرض واقعي تعتمده — ثم نصنعه وأنت تتابع كل مرحلة مباشرةً.":"Four moves: you send a plan, we furnish it, rebuild it in 3D and render it photoreal for your sign-off — then we build it while you watch every stage."}),(0,t.jsx)(o.Rise,{delay:.18,children:(0,t.jsxs)("span",{className:"pj-free",children:[(0,t.jsx)("span",{className:"pj-free-dot","aria-hidden":!0}),a("pj_free")]})}),(0,t.jsx)(o.Rise,{delay:.24,children:(0,t.jsx)("p",{className:"pj-loss",children:a("pj_loss")})})]}),(0,t.jsxs)("div",{className:"pj-swap container",children:[(0,t.jsx)("div",{className:"pj-sticky",children:(0,t.jsx)(l.motion.div,{className:"pj-panel",animate:{x:g?d?"-72.41%":"72.41%":"0%"},transition:h?{duration:0}:x,children:(0,t.jsx)(m,{step:u,ar:d})})}),(0,t.jsx)("div",{className:"pj-offset"}),(0,t.jsx)("div",{className:"pj-mstick","aria-hidden":!0,children:(0,t.jsx)(m,{step:u,ar:d})}),i.processSteps.map((e,r)=>{let a=r%2==0;return(0,t.jsx)(l.motion.section,{className:"pj-step",onViewportEnter:()=>f(r),viewport:{margin:"-50% 0px -50% 0px",amount:0},style:{justifyContent:a?"flex-end":"flex-start"},children:(0,t.jsxs)("div",{className:`pj-step-text${r===u?" is-active":""}`,children:[(0,t.jsx)("span",{className:"pj-step-ghost","aria-hidden":!0,children:e.n}),(0,t.jsxs)("span",{className:"pj-step-eyebrow",children:[d?"المرحلة":"Stage"," ",(0,t.jsx)("b",{children:e.n}),(0,t.jsx)("i",{}),d?"من ٠٤":"of 04"]}),(0,t.jsx)("h3",{className:"pj-step-title",children:e.title[s]}),(0,t.jsx)("p",{className:"pj-step-body",children:e.body[s]}),(0,t.jsx)("span",{className:"pj-step-tag",children:d?v[r].ar:v[r].en}),(0,t.jsx)("div",{className:"pj-step-media-mobile",children:(0,t.jsx)(m,{step:r,ar:d})})]})},e.n)})]}),e&&(0,t.jsx)("div",{className:"container",children:(0,t.jsx)(y,{ar:d})}),e&&(0,t.jsx)("div",{className:"container",children:(0,t.jsx)(b,{lang:s,reduced:!!h})}),(0,t.jsx)("style",{children:`
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
      `})]})}],750968)}]);