(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,23091,e=>{"use strict";var t=e.i(843476),a=e.i(871522);e.s(["default",0,function({tone:e="ink",size:i=1}){return(0,t.jsx)(a.default,{tone:e,style:{height:`${2.4*i}rem`,width:"auto",transition:"color .4s var(--ease)"}})}])},719381,e=>{"use strict";var t=e.i(843476),a=e.i(846932),i=e.i(271645),n=e.i(749652);let r={some:0,all:1};var s=e.i(310542),l=e.i(591994),o=e.i(895420),c=e.i(772328);class d{constructor(e){this.stop=()=>this.runAll("stop"),this.animations=e.filter(Boolean)}get finished(){return Promise.all(this.animations.map(e=>e.finished))}getAll(e){return this.animations[0][e]}setAll(e,t){for(let a=0;a<this.animations.length;a++)this.animations[a][e]=t}attachTimeline(e){let t=this.animations.map(t=>t.attachTimeline(e));return()=>{t.forEach((e,t)=>{e&&e(),this.animations[t].stop()})}}get time(){return this.getAll("time")}set time(e){this.setAll("time",e)}get speed(){return this.getAll("speed")}set speed(e){this.setAll("speed",e)}get state(){return this.getAll("state")}get startTime(){return this.getAll("startTime")}get duration(){return f(this.animations,"duration")}get iterationDuration(){return f(this.animations,"iterationDuration")}runAll(e){this.animations.forEach(t=>t[e]())}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}function f(e,t){let a=0;for(let i=0;i<e.length;i++){let n=e[i][t];null!==n&&n>a&&(a=n)}return a}class m extends d{then(e,t){return this.finished.finally(e).then(()=>{})}}var h=e.i(133887),u=e.i(486427),p=e.i(528409),g=e.i(83411),v=e.i(515923),y=e.i(997307),b=e.i(721748),x=e.i(215932),_=e.i(783920),w=e.i(763074),k=e.i(965566),j=e.i(430151),N=e.i(893544);function S(e,t){var a;let i;return(0,N.isEasingArray)(e)?e[a=e.length,((t-0)%(i=a-0)+i)%i+0]:e}function A(e){return"object"==typeof e&&!Array.isArray(e)}function E(e,t,a,i){return null==e?[]:"string"==typeof e&&A(t)?(0,n.resolveElements)(e,a,i):e instanceof NodeList?Array.from(e):Array.isArray(e)?e.filter(e=>null!=e):[e]}function C(e,t,a,i){return"number"==typeof t?t:t.startsWith("-")||t.startsWith("+")?Math.max(0,e+parseFloat(t)):"<"===t?a:t.startsWith("<")?Math.max(0,a+parseFloat(t.slice(1))):i.get(t)??e}var M=e.i(100706);function I(e,t){return e.at!==t.at?e.at-t.at:null===e.value?1:null===t.value?-1:0}function R(e,t){return t.has(e)||t.set(e,{}),t.get(e)}function z(e,t){return t[e]||(t[e]=[]),t[e]}let V=e=>"number"==typeof e,F=e=>e.every(V);var T=e.i(768705),$=e.i(472094),B=e.i(372323),O=e.i(889026),K=e.i(836331),L=e.i(275737),P=e.i(386783),D=e.i(130162),W=e.i(617218);class H extends W.VisualElement{constructor(){super(...arguments),this.type="object"}readValueFromInstance(e,t){if(t in e){let a=e[t];if("string"==typeof a||"number"==typeof a)return a}}getBaseTargetFromProps(){}removeValueFromRenderState(e,t){delete t.output[e]}measureInstanceViewportBox(){return(0,D.createBox)()}build(e,t){Object.assign(e.output,t)}renderInstance(e,{output:t}){Object.assign(e,t)}sortInstanceNodePosition(){return 0}}function Y(e){let t={presenceContext:null,props:{},visualState:{renderState:{transform:{},transformOrigin:{},style:{},vars:{},attrs:{}},latestValues:{}}},a=(0,O.isSVGElement)(e)&&!(0,K.isSVGSVGElement)(e)?new L.SVGVisualElement(t):new P.HTMLVisualElement(t);a.mount(e),$.visualElementStore.set(e,a)}function G(e){let t=new H({presenceContext:null,props:{},visualState:{renderState:{output:{}},latestValues:{}}});t.mount(e),$.visualElementStore.set(e,t)}function X(e,t,a,i){let n=[];if((0,g.isMotionValue)(e)||"number"==typeof e||"string"==typeof e&&!A(t))n.push((0,T.animateSingleValue)(e,A(t)&&t.default||t,a&&a.default||a));else{if(null==e)return n;let r=E(e,t,i),s=r.length;(0,k.invariant)(!!s,"No valid elements provided.","no-valid-elements");for(let e=0;e<s;e++){let i=r[e],l=i instanceof Element?Y:G;$.visualElementStore.has(i)||l(i);let o=$.visualElementStore.get(i),c={...a};"delay"in c&&"function"==typeof c.delay&&(c.delay=c.delay(e,s)),n.push(...(0,B.animateTarget)(o,{...t,transition:c},{}))}}return n}let U=function(e={}){let{scope:t,reduceMotion:a,skipAnimations:i}=e;return function(e,n,r){var s;let l,o=[],c={};if(void 0!==a&&(c.reduceMotion=a),void 0!==i&&(c.skipAnimations=i),Array.isArray(e)&&e.some(Array.isArray)){let a,{onComplete:i,...r}=n||{};"function"==typeof i&&(l=i),s={...c,...r},a=[],(function(e,{defaultTransition:t={},...a}={},i,n){let r=t.duration||.3,s=new Map,l=new Map,o={},c=new Map,d=0,f=0,m=0;for(let a=0;a<e.length;a++){let s=e[a];if("string"==typeof s){c.set(s,f);continue}if(!Array.isArray(s)){c.set(s.name,C(f,s.at,d,c));continue}let[_,N,A={}]=s;void 0!==A.at&&(f=C(f,A.at,d,c));let I=0,V=(e,a,i,s=0,l=0)=>{var o;let c=Array.isArray(o=e)?o:[o],{delay:d=0,times:u=(0,v.defaultOffset)(c),type:p=t.type||"keyframes",repeat:g,repeatType:_,repeatDelay:N=0,...A}=a,{ease:E=t.ease||"easeOut",duration:C}=a,R="function"==typeof d?d(s,l):d,z=c.length,V=(0,y.isGenerator)(p)?p:n?.[p||"keyframes"];if(z<=2&&V){let e=100;2===z&&F(c)&&(e=Math.abs(c[1]-c[0]));let a={...t,...A};void 0!==C&&(a.duration=(0,w.secondsToMilliseconds)(C));let i=(0,b.createGeneratorEasing)(a,e,V);E=i.ease,C=i.duration}C??(C=r);let T=f+R;1===u.length&&0===u[0]&&(u[1]=1);let $=u.length-c.length;if($>0&&(0,x.fillOffset)(u,$),1===c.length&&c.unshift(null),g&&(0,k.warning)(g<20,`Sequence segments can't repeat ${g} times — ignoring repeat option. Use a value below 20 or apply repeat at the sequence level instead.`),g&&g<20){let e=C>0?N/C:0;C=C*(g+1)+N*g;let t=[...c],a=[...u],i=[...E=Array.isArray(E)?[...E]:[E]],n="reverse"===_||"mirror"===_,r=t,s=i;n&&(r=[...t].reverse(),"reverse"===_&&(s=[...i].reverse().map(e=>"function"==typeof e?(0,j.reverseEasing)(e):e)));for(let l=0;l<g;l++){let o=n&&l%2==0,d=o?r:t,f=o?s:i,m=(l+1)*(1+e);e>0&&(c.push(c[c.length-1]),u.push(m),E.push("linear")),c.push(...d);for(let e=0;e<d.length;e++)u.push(a[e]+m),E.push(0===e?"linear":S(f,e-1))}!function(e,t,a=0){let i=t+1+t*a;for(let t=0;t<e.length;t++)e[t]=e[t]/i}(u,g,e)}let B=T+C;!function(e,t,a,i,n,r){for(let t=0;t<e.length;t++){let a=e[t];a.at>n&&a.at<r&&((0,h.removeItem)(e,a),t--)}for(let s=0;s<t.length;s++)e.push({value:t[s],at:(0,M.mixNumber)(n,r,i[s]),easing:S(a,s)})}(i,c,E,u,T,B),I=Math.max(R+C,I),m=Math.max(B,m)};if((0,g.isMotionValue)(_))V(N,A,z("default",R(_,l)));else{let e=E(_,N,i,o),t=e.length;for(let a=0;a<t;a++){let i=R(e[a],l);for(let e in N){var u,p;V(N[e],(u=A,p=e,u&&u[p]?{...u,...u[p]}:{...u}),z(e,i),a,t)}}}d=f,f+=I}return l.forEach((e,i)=>{for(let n in e){let r=e[n];r.sort(I);let l=[],o=[],c=[];for(let e=0;e<r.length;e++){let{at:t,value:a,easing:i}=r[e];l.push(a),o.push((0,_.progress)(0,m,t)),c.push(i||"easeOut")}0!==o[0]&&(o.unshift(0),l.unshift(l[0]),c.unshift("easeInOut")),1!==o[o.length-1]&&(o.push(1),l.push(null)),s.has(i)||s.set(i,{keyframes:{},transition:{}});let d=s.get(i);d.keyframes[n]=l;let{type:f,...h}=t;d.transition[n]={...h,duration:m,ease:c,times:o,...a}}}),s})(e.map(e=>{if(Array.isArray(e)&&"function"==typeof e[0]){let t=e[0],a=(0,u.motionValue)(0);return(a.on("change",t),1===e.length)?[a,[0,1]]:2===e.length?[a,[0,1],e[1]]:[a,e[1],e[2]]}return e}),s,t,{spring:p.spring}).forEach(({keyframes:e,transition:t},i)=>{a.push(...X(i,e,t))}),o=a}else{let{onComplete:a,...i}=r||{};"function"==typeof a&&(l=a),o=X(e,n,{...c,...i},t)}let d=new m(o);return l&&d.finished.then(l),t&&(t.animations.push(d),d.finished.then(()=>{(0,h.removeItem)(t.animations,d)})),d}}(),q=[.22,1,.36,1],J={once:!0,margin:"0px 0px -12% 0px"};e.s(["CountUp",0,function({value:e,className:a,style:s}){let l=(0,c.useReducedMotion)(),o=(0,i.useRef)(null),d=function(e,{root:t,margin:a,amount:s,once:l=!1,initial:o=!1}={}){let[c,d]=(0,i.useState)(o);return(0,i.useEffect)(()=>{if(!e.current||l&&c)return;let i={root:t&&t.current||void 0,margin:a,amount:s};return function(e,t,{root:a,margin:i,amount:s="some"}={}){let l=(0,n.resolveElements)(e),o=new WeakMap,c=new IntersectionObserver(e=>{e.forEach(e=>{let a=o.get(e.target);if(!!a!==e.isIntersecting)if(e.isIntersecting){let a=t(e.target,e);"function"==typeof a?o.set(e.target,a):c.unobserve(e.target)}else"function"==typeof a&&(a(e),o.delete(e.target))})},{root:a,rootMargin:i,threshold:"number"==typeof s?s:r[s]});return l.forEach(e=>c.observe(e)),()=>c.disconnect()}(e.current,()=>(d(!0),l?void 0:()=>d(!1)),i)},[t,e,a,l,s]),c}(o,{once:!0,margin:"0px 0px -10% 0px"}),[f,m]=(0,i.useState)(e),h=e.match(/^([\d.,]+)(.*)$/),u=h?h[1]:e,p=h?h[2]:"",g=u.includes(","),v=parseFloat(u.replace(/,/g,""))||0,y=u.includes(".")?u.split(".")[1].length:0;return(0,i.useEffect)(()=>{if(l||!d||!h)return void m(e);let t=U(0,v,{duration:1.6,ease:q,onUpdate:e=>m((e=>{let t=e.toFixed(y);if(!g)return t+p;let[a,i]=t.split("."),n=a.replace(/\B(?=(\d{3})+(?!\d))/g,",");return(i?`${n}.${i}`:n)+p})(e))});return()=>t.stop()},[d,l,e]),(0,t.jsx)("span",{ref:o,className:a,style:s,children:f||e})},"EASE",0,q,"Magnetic",0,function({children:e,strength:n=.35,className:r,style:s}){let o=(0,c.useReducedMotion)(),d=(0,i.useRef)(null),f=(0,l.useSpring)(0,{stiffness:200,damping:18,mass:.4}),m=(0,l.useSpring)(0,{stiffness:200,damping:18,mass:.4});return o?(0,t.jsx)("div",{className:r,style:s,children:e}):(0,t.jsx)(a.motion.div,{ref:d,className:r,style:{display:"inline-flex",x:f,y:m,...s},onMouseMove:e=>{let t=d.current;if(!t)return;let a=t.getBoundingClientRect();f.set((e.clientX-(a.left+a.width/2))*n),m.set((e.clientY-(a.top+a.height/2))*n)},onMouseLeave:()=>{f.set(0),m.set(0)},children:e})},"ParallaxImage",0,function({src:e,alt:n="",amount:r=12,className:d,style:f}){let m=(0,c.useReducedMotion)(),h=(0,i.useRef)(null),{scrollYProgress:u}=(0,s.useScroll)({target:h,offset:["start end","end start"]}),p=(0,o.useTransform)(u,[0,1],[`-${r}%`,`${r}%`]),g=(0,l.useSpring)(p,{stiffness:80,damping:30,mass:.5});return(0,t.jsx)("div",{ref:h,className:d,style:{position:"relative",overflow:"hidden",...f},children:(0,t.jsx)(a.motion.img,{src:e,alt:n,style:{position:"absolute",inset:`-${r+4}% 0`,width:"100%",height:`${100+(r+4)*2}%`,objectFit:"cover",y:m?0:g,willChange:"transform"}})})},"RevealLines",0,function({lines:e,className:i,style:n,delay:r=0,italicIndex:s,italicColor:l}){let o={hidden:(0,c.useReducedMotion)()?{opacity:0}:{y:"110%"},show:{y:"0%",opacity:1,transition:{duration:1,ease:q}}};return(0,t.jsx)(a.motion.span,{className:i,style:{display:"block",...n},variants:{hidden:{},show:{transition:{staggerChildren:.1,delayChildren:r}}},initial:"hidden",whileInView:"show",viewport:J,children:e.map((e,i)=>(0,t.jsx)("span",{style:{display:"block",overflow:"hidden",paddingBottom:"0.08em"},children:(0,t.jsx)(a.motion.span,{variants:o,style:{display:"inline-block",willChange:"transform"},children:i===s?(0,t.jsx)("span",{className:"serif-i",style:{color:l},children:e}):e})},i))})},"RevealWords",0,function({text:e,className:i,style:n,delay:r=0}){let s=(0,c.useReducedMotion)(),l=e.split(" "),o={hidden:s?{opacity:0}:{opacity:0,y:"0.5em"},show:{opacity:1,y:0,transition:{duration:.7,ease:q}}};return(0,t.jsx)(a.motion.span,{className:i,style:n,variants:{hidden:{},show:{transition:{staggerChildren:.018,delayChildren:r}}},initial:"hidden",whileInView:"show",viewport:J,children:l.map((e,i)=>(0,t.jsx)(a.motion.span,{variants:o,style:{display:"inline-block",whiteSpace:"pre"},children:e+(i<l.length-1?" ":"")},i))})},"Rise",0,function({children:e,delay:i=0,y:n=44,blur:r=!0,as:s="div",className:l,style:o}){let d=(0,c.useReducedMotion)(),f=a.motion[s];return(0,t.jsx)(f,{className:l,style:o,initial:d?{opacity:0}:{opacity:0,y:n,filter:r?"blur(10px)":"blur(0px)"},whileInView:d?{opacity:1}:{opacity:1,y:0,filter:"blur(0px)"},viewport:J,transition:{duration:1.05,ease:q,delay:i},children:e})},"Stagger",0,function({children:e,delay:i=0,gap:n=.09,className:r,style:s}){return(0,t.jsx)(a.motion.div,{className:r,style:s,variants:{hidden:{},show:{transition:{staggerChildren:n,delayChildren:i}}},initial:"hidden",whileInView:"show",viewport:J,children:e})},"StaggerItem",0,function({children:e,y:i=28,className:n,style:r}){let s=(0,c.useReducedMotion)();return(0,t.jsx)(a.motion.div,{className:n,style:r,variants:{hidden:s?{opacity:0}:{opacity:0,y:i,filter:"blur(8px)"},show:{opacity:1,y:0,filter:"blur(0px)",transition:{duration:1,ease:q}}},children:e})}],719381)},342724,e=>{"use strict";var t=e.i(843476),a=e.i(271645),i=e.i(618566),n=e.i(23091),r=e.i(719381),s=e.i(846932),l=e.i(772328),o=e.i(207761),c=e.i(912469);let d=[{id:"/",key:"nav_home"},{id:"/shop",key:"nav_shop"},{id:"/kitchen",key:"nav_kitchen"},{id:"/catalog",key:"nav_catalog"},{id:"/visit",key:"nav_visit"}],f={type:"spring",stiffness:520,damping:32};e.s(["default",0,function({pinnedSolid:e=!1}){let{t:m,lang:h,toggle:u}=(0,o.useT)(),p=(0,l.useReducedMotion)(),g=(0,i.usePathname)(),[v,y]=(0,a.useState)(e),[b,x]=(0,a.useState)(!1),[_,w]=(0,a.useState)(!1),k=(0,a.useRef)(0),j=(0,a.useRef)(null),N=e=>!!g&&(g===e||g.startsWith(e+"/"));(0,a.useEffect)(()=>{let t=()=>{let t=window.scrollY;if(e)y(!0);else{let e=document.getElementById("top");y(t>(e&&e.offsetHeight>1.5*window.innerHeight?e.offsetHeight-1.1*window.innerHeight:.78*window.innerHeight))}if(!p){let e=t>k.current+2,a=t<k.current-2;e&&t>160?w(!0):a&&w(!1)}k.current=t};return t(),window.addEventListener("scroll",t,{passive:!0}),()=>window.removeEventListener("scroll",t)},[e,p]),(0,a.useEffect)(()=>{x(!1)},[g]),(0,a.useEffect)(()=>(document.body.style.overflow=b?"hidden":"",document.body.style.touchAction=b?"none":"",()=>{document.body.style.overflow="",document.body.style.touchAction=""}),[b]),(0,a.useEffect)(()=>{if(!b)return;let e=j.current;if(!e)return;let t=()=>Array.from(e.querySelectorAll("a[href], button:not([disabled])")).filter(e=>null!==e.offsetParent);t()[0]?.focus();let a=e=>{if("Escape"===e.key)return void x(!1);if("Tab"!==e.key)return;let a=t();if(0===a.length)return;let i=a[0],n=a[a.length-1];e.shiftKey&&document.activeElement===i?(e.preventDefault(),n.focus()):e.shiftKey||document.activeElement!==n||(e.preventDefault(),i.focus())};return document.addEventListener("keydown",a),()=>document.removeEventListener("keydown",a)},[b]);let S=v||b?"ink":"paper",A=b||v?"var(--ink)":"var(--paper)";return(0,t.jsxs)(s.motion.header,{"data-solid":v&&!b?"true":void 0,initial:!1,animate:{y:_&&!b?"-112%":0},transition:p?{duration:0}:{type:"spring",stiffness:380,damping:40},style:{position:"fixed",insetInline:0,top:0,zIndex:100,transition:"background .5s var(--ease), border-color .5s var(--ease)",background:v&&!b?"rgba(255,255,255,0.82)":"transparent",backdropFilter:v&&!b?"saturate(1.1) blur(14px)":"none",borderBottom:`1px solid ${v&&!b?"var(--line)":"transparent"}`},children:[(0,t.jsx)("span",{"aria-hidden":!0,style:{position:"absolute",insetInline:0,top:0,height:"calc(var(--nav-h, 78px) * 1.7)",pointerEvents:"none",zIndex:95,background:"linear-gradient(180deg, rgba(16,15,13,0.32), rgba(16,15,13,0))",opacity:+(!v&&!b),transition:"opacity .5s var(--ease)"}}),(0,t.jsxs)("nav",{className:`container nav-bar${v&&!b?" nav-settle":""}`,style:{position:"relative",zIndex:96,display:"flex",alignItems:"center",justifyContent:"space-between",height:"var(--nav-h, 78px)",color:A},children:[(0,t.jsx)("a",{href:"/","aria-label":"Evora home",onClick:()=>x(!1),children:(0,t.jsx)(n.default,{tone:b?"ink":S,size:.92})}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"clamp(1rem,2.4vw,2.4rem)"},children:[(0,t.jsxs)("ul",{className:"nav-links",style:{display:"flex",gap:"1.9rem",listStyle:"none",margin:0,padding:0},children:[d.map(e=>(0,t.jsx)("li",{children:(0,t.jsx)(r.Magnetic,{strength:.2,children:(0,t.jsx)("a",{href:e.id,className:"nav-link","data-active":N(e.id)||void 0,"aria-current":N(e.id)?"page":void 0,children:m(e.key)})})},e.id)),(0,t.jsx)("li",{children:(0,t.jsx)(r.Magnetic,{strength:.2,children:(0,t.jsx)("a",{href:"/start",className:"nav-link","data-active":N("/start")||void 0,onClick:e=>{e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||0!==e.button||(e.preventDefault(),(0,c.openStartProject)())},children:"ar"===h?"صمّم منزلي":"Design my home"})})}),(0,t.jsx)("li",{children:(0,t.jsx)(r.Magnetic,{strength:.2,children:(0,t.jsx)("a",{href:"/login",className:"nav-link","data-active":N("/login")||void 0,children:"ar"===h?"بوابة العملاء":"Client Portal"})})})]}),(0,t.jsx)("button",{onClick:u,"aria-label":"en"===h?"Switch to Arabic":"التبديل إلى الإنجليزية",style:{fontFamily:"en"===h?"var(--f-ar)":"var(--font-sans)",fontSize:"0.82rem",fontWeight:600,letterSpacing:"en"===h?"0":"0.06em",color:A,background:"transparent",border:`1px solid ${v&&!b?"var(--line)":"rgba(251,247,240,0.4)"}`,borderRadius:100,padding:"0.5em 0.95em",cursor:"none",transition:"all .3s var(--ease)"},children:"en"===h?"العربية":"EN"}),(0,t.jsx)(r.Magnetic,{strength:.2,children:(0,t.jsx)("a",{href:"/visit",className:"btn btn-ghost nav-book",style:{borderColor:v?"var(--line)":"rgba(251,247,240,0.5)",color:A},children:m("nav_book")})}),(0,t.jsx)("button",{className:"nav-burger","aria-label":b?"Close menu":"Open menu","aria-expanded":b,"aria-controls":"evora-mobile-menu",onClick:()=>x(e=>!e),style:{background:"transparent",border:"none",cursor:"none",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",padding:0},children:(0,t.jsxs)("span",{style:{position:"relative",width:30,height:22,display:"block"},children:[(0,t.jsx)(s.motion.span,{animate:{top:b?10:3,rotate:45*!!b},transition:p?{duration:0}:f,style:{position:"absolute",left:0,right:0,height:1.6,background:A,top:3,transformOrigin:"center"}}),(0,t.jsx)(s.motion.span,{animate:{opacity:+!b,scaleX:+!b},transition:p?{duration:0}:{duration:.2},style:{position:"absolute",left:0,right:0,height:1.6,background:A,top:10}}),(0,t.jsx)(s.motion.span,{animate:{top:b?10:17,rotate:b?-45:0},transition:p?{duration:0}:f,style:{position:"absolute",left:0,right:0,height:1.6,background:A,top:17,transformOrigin:"center"}})]})})]})]},v?"solid":"clear"),(0,t.jsxs)("div",{ref:j,id:"evora-mobile-menu",className:"mobile-menu",role:"dialog","aria-modal":b||void 0,"aria-label":"ar"===h?"القائمة":"Menu","aria-hidden":!b,style:{position:"fixed",inset:0,zIndex:95,background:"var(--paper)",display:"flex",flexDirection:"column",justifyContent:"center",padding:"calc(var(--gut) + var(--safe-top)) calc(var(--gut) + var(--safe-right)) calc(var(--gut) + var(--safe-bottom)) calc(var(--gut) + var(--safe-left))",opacity:+!!b,pointerEvents:b?"auto":"none",overflowY:"auto",WebkitOverflowScrolling:"touch",clipPath:b?"inset(0 0 0 0)":"inset(0 0 100% 0)",transition:"clip-path .6s var(--ease), opacity .4s var(--ease)"},children:[(0,t.jsx)("ul",{style:{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:"0.4rem"},children:d.map((e,a)=>(0,t.jsx)("li",{style:{overflow:"hidden"},children:(0,t.jsx)("a",{href:e.id,onClick:()=>x(!1),className:"display","aria-current":N(e.id)?"page":void 0,style:{display:"flex",alignItems:"center",minHeight:44,color:N(e.id)?"var(--clay)":"var(--ink)",fontSize:"clamp(2.2rem,9vw,3.6rem)",padding:"0.25rem 0",transform:b?"translateY(0)":"translateY(110%)",opacity:+!!b,transition:`transform .7s var(--ease) ${.12+.07*a}s, opacity .7s ease ${.12+.07*a}s, color .3s var(--ease)`},children:m(e.key)})},e.id))}),(0,t.jsxs)("div",{style:{marginTop:"2.5rem",display:"flex",gap:"0.8rem",flexWrap:"wrap"},children:[(0,t.jsxs)("a",{href:"/visit",onClick:()=>x(!1),className:"btn",style:{background:"var(--ink)",color:"var(--paper)"},children:[m("nav_book")," ",(0,t.jsx)("span",{className:"arrow",children:"→"})]}),(0,t.jsxs)("a",{href:"/start",className:"btn",style:{background:"var(--clay)",color:"#fff",border:"none",cursor:"pointer"},onClick:e=>{e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||0!==e.button||(e.preventDefault(),x(!1),(0,c.openStartProject)())},children:["ar"===h?"صمّم منزلي":"Design my home"," ",(0,t.jsx)("span",{className:"arrow",children:"→"})]}),(0,t.jsx)("a",{href:"/login",onClick:()=>x(!1),className:"btn",style:{border:"1px solid var(--line)",color:"var(--ink)"},children:"ar"===h?"بوابة العملاء":"Client Portal"}),(0,t.jsx)("button",{onClick:u,className:"btn",style:{border:"1px solid var(--line)",color:"var(--ink)",fontFamily:"en"===h?"var(--f-ar)":"var(--font-sans)"},children:"en"===h?"العربية":"English"})]}),(0,t.jsx)("span",{style:{marginTop:"2.5rem",color:"var(--ink-faint)",fontSize:"0.72rem",letterSpacing:"0.18em",textTransform:"uppercase"},children:m("visit_addr")})]}),(0,t.jsx)("style",{children:`
        /* desktop link: shared base + RTL-aware animated underline */
        .nav-link {
          position: relative; display: inline-block;
          font-family: inherit; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.02em;
          color: inherit; opacity: 0.82; background: transparent; border: none;
          padding: 2px 0; cursor: none; transition: opacity .35s var(--ease);
        }
        .nav-link::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -5px; height: 1px;
          background: currentColor; transform: scaleX(0); transform-origin: left center;
          transition: transform .45s var(--ease);
        }
        html[dir="rtl"] .nav-link::after { transform-origin: right center; }
        .nav-link:hover, .nav-link:focus-visible { opacity: 1; }
        .nav-link:hover::after, .nav-link:focus-visible::after { transform: scaleX(1); }
        .nav-link[data-active]::after { transform: scaleX(1); }
        .nav-link[data-active] { opacity: 1; }

        /* one-shot settle the bar gives when it goes solid */
        @keyframes navSettle { from { transform: translateY(-5px); } to { transform: translateY(0); } }
        .nav-settle { animation: navSettle .5s var(--ease); }
        @media (prefers-reduced-motion: reduce) { .nav-settle { animation: none; } }

        .nav-burger { display: none; }
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          .nav-book { display: none !important; }
          .nav-burger { display: block !important; }
        }
      `})]})}])},56691,e=>{"use strict";var t=e.i(843476),a=e.i(23091),i=e.i(207761),n=e.i(719381),r=e.i(801583);let s="cubic-bezier(0.22, 1, 0.36, 1)",l="https://www.instagram.com/evorafuturehome/",o=[{id:"living",srcBase:"/evora/social/tile-living",name:{en:"Living Room",ar:"غرفة المعيشة"},alt:{en:"A curved caramel bouclé sofa beneath a brass ring chandelier, floor-to-ceiling city views beyond",ar:"كنبة منحنية بقماش الكراميل الدافئ تحت ثريا حلقية نحاسية، ونوافذ ممتدة تطل على المدينة"}},{id:"dining",srcBase:"/evora/social/tile-dining",name:{en:"Dining Room",ar:"غرفة الطعام"},alt:{en:"A long walnut dining table set with emerald velvet chairs beneath a brass pendant light",ar:"طاولة طعام طويلة من خشب الجوز محاطة بكراسٍ مخملية زمردية تحت إضاءة نحاسية معلّقة"}},{id:"bedroom",srcBase:"/evora/social/tile-bedroom",name:{en:"Bedroom",ar:"غرفة النوم"},alt:{en:"A bedroom with a tufted emerald headboard, crisp white linens and a matching velvet bench",ar:"غرفة نوم برأسية سرير زمردية مبطّنة، وأغطية بيضاء ناصعة، ومقعد مخملي مطابق"}},{id:"kitchen",srcBase:"/evora/social/tile-kitchen",name:{en:"Kitchen",ar:"المطبخ"},alt:{en:"A walnut kitchen with a marble waterfall island and a sculptural black hood",ar:"مطبخ من خشب الجوز بجزيرة رخامية بتصميم الشلال ومدخنة سوداء نحتية"}},{id:"chesterfield",srcBase:"/evora/social/tile-chesterfield",name:{en:"The Cream Chesterfield",ar:"تشسترفيلد الكريمي"},alt:{en:"A cream channel-tufted armchair beside a brass side table in soft daylight",ar:"كرسي كريمي مبطّن بخطوط ناعمة بجانب طاولة نحاسية جانبية في ضوء نهارٍ دافئ"}},{id:"lounge",srcBase:"/evora/social/tile-lounge",name:{en:"Guest Room",ar:"غرفة الضيوف"},alt:{en:"A taupe living-room seating set arranged around a walnut coffee table",ar:"طقم جلوس بقماش بيج دافئ حول طاولة قهوة من خشب الجوز"}}],c={eyebrow:{en:"Follow Along",ar:"تابعونا"},title:{en:"Follow Evora on Instagram & Facebook",ar:"تابعوا إيفورا على إنستغرام وفيسبوك"},sub:{en:"New arrivals, showroom moments and behind-the-scenes — right where you already scroll.",ar:"وصولات جديدة، ولحظات من المعرض، وما خلف الكواليس — في المكان الذي تتصفّحه أصلًا."},followingSuffix:{en:"following",ar:"متابع"},igCta:{en:"Follow on Instagram",ar:"تابعونا على إنستغرام"},fbCta:{en:"Follow on Facebook",ar:"تابعونا على فيسبوك"},igAria:{en:"Follow on Instagram — opens in a new tab",ar:"تابعونا على إنستغرام — يفتح في نافذة جديدة"},fbAria:{en:"Follow on Facebook — opens in a new tab",ar:"تابعونا على فيسبوك — يفتح في نافذة جديدة"},galleryLabel:{en:"A closer look",ar:"نظرة أقرب"},tileAriaSuffix:{en:"— see more on Instagram, opens in a new tab",ar:"— شاهدوا المزيد على إنستغرام، يفتح في نافذة جديدة"}};function d(){return(0,t.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",children:(0,t.jsx)("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"})})}function f(){return(0,t.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",children:(0,t.jsx)("path",{d:"M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.523 1.492-3.917 3.777-3.917 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z"})})}function m(){let{lang:e}=(0,i.useT)(),a=t=>c[t][e];return(0,t.jsxs)("div",{className:"ft__social",lang:e,children:[(0,t.jsx)("style",{children:`
        .ft__social {
          padding-bottom: clamp(2.5rem, 5vw, 3.5rem);
          border-bottom: 1px solid var(--line);
        }
        .ft__social-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: clamp(1.5rem, 5vw, 4rem);
        }
        .ft__social-copy { max-width: 46ch; text-align: start; }
        .ft__social-eyebrow { display: block; }
        .ft__social-title {
          margin: 0.7rem 0 0;
          font-weight: 400;
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          line-height: 1.15;
          color: var(--ink);
        }
        .ft__social-sub {
          margin: 0.7rem 0 0;
          max-width: 44ch;
          color: var(--ink-faint);
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .ft__social-meta {
          margin: 0.9rem 0 0;
          color: var(--brass);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        html[dir="rtl"] .ft__social-meta { letter-spacing: 0.02em; }

        .ft__social-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.85rem;
          flex: 0 0 auto;
        }
        .ft__social-btn { gap: 0.6em; }
        .ft__social-handle {
          opacity: 0.72;
          font-size: 0.82em;
        }
        /* the little Instagram gradient dot — same motif as .cx__ig-dot in
           ClientExample.tsx, reused here rather than inventing a new accent */
        .ft__ig-dot {
          width: 7px; height: 7px; border-radius: 50%; flex: 0 0 auto;
          background: conic-gradient(from 0deg, #feda75, #d62976, #962fbf, #4f5bd5, #feda75);
        }

        /* ---- static image grid (see comment in JSX below) ---- */
        .ft__gallery {
          margin-block-start: clamp(2.2rem, 5vw, 3.5rem);
        }
        .ft__gallery-eyebrow {
          display: block;
          color: var(--brass);
          margin-bottom: 0.9rem;
        }
        .ft__grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: clamp(0.5rem, 1.2vw, 0.85rem);
        }
        .ft__tile {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 4px;
          background: var(--bone);
        }
        .ft__tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.03);
          transition: transform 0.7s ${s};
        }
        .ft__tile:hover .ft__tile-img,
        .ft__tile:focus-visible .ft__tile-img {
          transform: scale(1.09);
        }
        .ft__tile-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(22,21,15,0.55) 100%);
          opacity: 0;
          transition: opacity 0.45s ${s};
        }
        .ft__tile:hover .ft__tile-scrim,
        .ft__tile:focus-visible .ft__tile-scrim {
          opacity: 1;
        }
        .ft__tile-icon {
          position: absolute;
          inset-block-end: 0.55rem;
          inset-inline-end: 0.55rem;
          width: 1.9rem;
          height: 1.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(251,247,240,0.94);
          color: var(--ink);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.4s ${s}, transform 0.4s ${s};
        }
        .ft__tile:hover .ft__tile-icon,
        .ft__tile:focus-visible .ft__tile-icon {
          opacity: 1;
          transform: translateY(0);
        }
        .ft__tile:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 3px;
        }

        @media (max-width: 900px) {
          .ft__grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 520px) {
          .ft__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ft__tile-img, .ft__tile-scrim, .ft__tile-icon { transition: none; }
        }

        /* ---- live feed mount point (see comment in JSX below) ---- */
        .ft__feed-mount {
          width: 100%;
          max-width: 100%;
        }
        /* Only when a widget script has actually injected content do we open
           up any spacing for it — an empty mount point must take up zero
           space, so :empty (no children at all) keeps margin at 0. */
        .ft__feed-mount:not(:empty) {
          margin-block-start: clamp(2rem, 5vw, 3.5rem);
        }

        @media (max-width: 860px) {
          .ft__social-top { flex-direction: column; align-items: flex-start; }
          .ft__social-actions { width: 100%; }
        }
        @media (max-width: 640px) {
          .ft__social-actions { flex-direction: column; align-items: stretch; }
          .ft__social-btn { width: 100%; justify-content: center; min-height: 46px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ft__social-btn { transition: none; }
        }
      `}),(0,t.jsxs)(n.Rise,{as:"div",className:"ft__social-top",children:[(0,t.jsxs)("div",{className:"ft__social-copy",children:[(0,t.jsx)("span",{className:"eyebrow ft__social-eyebrow",style:{color:"var(--brass)"},children:a("eyebrow")}),(0,t.jsx)("h2",{className:"display ft__social-title",children:a("title")}),(0,t.jsx)("p",{className:"ft__social-sub",children:a("sub")}),(0,t.jsxs)("p",{className:"ft__social-meta",children:[r.FOLLOWERS,"+ ",a("followingSuffix")]})]}),(0,t.jsxs)("div",{className:"ft__social-actions",children:[(0,t.jsx)(n.Magnetic,{children:(0,t.jsxs)("a",{href:l,target:"_blank",rel:"noopener noreferrer",className:"btn btn-solid ft__social-btn","aria-label":a("igAria"),"data-cursor":"hover",children:[(0,t.jsx)(d,{}),(0,t.jsx)("span",{children:a("igCta")}),(0,t.jsx)("span",{className:"ft__ig-dot","aria-hidden":"true"}),(0,t.jsx)("span",{className:"ft__social-handle",children:"@evorafuturehome"}),(0,t.jsx)("span",{className:"arrow",children:"→"})]})}),(0,t.jsx)(n.Magnetic,{children:(0,t.jsxs)("a",{href:"https://www.facebook.com/EvoraFutureHome/",target:"_blank",rel:"noopener noreferrer",className:"btn btn-ghost ft__social-btn","aria-label":a("fbAria"),"data-cursor":"hover",children:[(0,t.jsx)(f,{}),(0,t.jsx)("span",{children:a("fbCta")}),(0,t.jsx)("span",{className:"arrow",children:"→"})]})})]})]}),(0,t.jsxs)(n.Rise,{as:"div",className:"ft__gallery",delay:.1,children:[(0,t.jsx)("span",{className:"eyebrow ft__gallery-eyebrow",children:a("galleryLabel")}),(0,t.jsx)(n.Stagger,{className:"ft__grid",gap:.06,children:o.map(i=>(0,t.jsx)(n.StaggerItem,{className:"ft__tile-cell",children:(0,t.jsxs)("a",{href:l,target:"_blank",rel:"noopener noreferrer",className:"ft__tile","aria-label":`${i.name[e]} ${a("tileAriaSuffix")}`,"data-cursor":"hover",children:[(0,t.jsxs)("picture",{children:[(0,t.jsx)("source",{srcSet:`${i.srcBase}.avif`,type:"image/avif"}),(0,t.jsx)("img",{src:`${i.srcBase}.webp`,alt:i.alt[e],loading:"lazy",decoding:"async",className:"ft__tile-img"})]}),(0,t.jsx)("span",{className:"ft__tile-scrim","aria-hidden":"true"}),(0,t.jsx)("span",{className:"ft__tile-icon","aria-hidden":"true",children:(0,t.jsx)(d,{})})]})},i.id))})]}),(0,t.jsx)("div",{id:"evora-ig-feed",className:"ft__feed-mount"})]})}e.s(["default",0,function(){let{t:e,lang:r}=(0,i.useT)(),s="en"===r;return(0,t.jsxs)("footer",{className:"ft",lang:r,children:[(0,t.jsx)("style",{children:`
        .ft {
          background: var(--paper);
          color: var(--ink);
          padding-top: clamp(3.5rem, 7vw, 6rem);
          border-top: 1px solid var(--line);
        }

        /* ---- link columns ---- */
        .ft__cols {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: clamp(2rem, 4vw, 4rem);
          padding-block: clamp(2.5rem, 5vw, 4rem);
          border-bottom: 1px solid var(--line);
        }
        .ft__brand { max-width: 30ch; }
        .ft__rights {
          margin: 1.4rem 0 0;
          color: var(--ink-faint);
          font-family: var(--font-display);
          font-style: ${s?"italic":"normal"};
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .ft__cap {
          display: block;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 1.1rem;
        }
        html[lang="ar"] .ft__cap { letter-spacing: 0.05em; }
        .ft__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.7rem; }
        .ft__link {
          color: var(--ink-soft);
          font-size: 0.92rem;
          transition: color 0.3s var(--ease);
        }
        .ft__link:hover { color: var(--ever); }
        .ft__addr { margin: 0; color: var(--ink-soft); font-size: 0.92rem; line-height: 1.7; }

        /* ---- legal bar ---- */
        .ft__legal {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-block: 1.6rem;
          font-size: 0.76rem;
          color: var(--ink-faint);
        }

        @media (max-width: 860px) {
          .ft__cols { grid-template-columns: 1fr 1fr; }
          .ft__brand { grid-column: 1 / -1; }
        }
        @media (max-width: 520px) {
          .ft__cols { grid-template-columns: 1fr; }
        }
        /* phone: make every link a comfortable 44px tap target (incl. the
           tel: numbers) */
        @media (max-width: 640px) {
          .ft__list { gap: 0.15rem; }
          .ft__link { display: inline-flex; align-items: center; min-height: 44px; }
          .ft__addr a.ft__link { min-height: 40px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ft__link { transition: none; }
        }
      `}),(0,t.jsxs)("div",{className:"container",children:[(0,t.jsx)(m,{}),(0,t.jsxs)("div",{className:"ft__cols",children:[(0,t.jsxs)(n.Rise,{className:"ft__brand",children:[(0,t.jsx)(a.default,{tone:"ink",size:1.25}),(0,t.jsx)("p",{className:"ft__rights",children:e("footer_rights")})]}),(0,t.jsxs)(n.Rise,{delay:.06,as:"nav",children:[(0,t.jsx)("span",{className:"ft__cap",children:s?"Explore":"استكشف"}),(0,t.jsx)("ul",{className:"ft__list",children:[{href:"/shop",en:"Shop",ar:"تسوّق"},{href:"/shop/rooms",en:"Shop by Room",ar:"تسوّق حسب الغرفة"},{href:"/showroom",en:"Virtual Showroom",ar:"المعرض الافتراضي"},{href:"/kitchen",en:"Kitchen Islands",ar:"جزر المطبخ"},{href:"/how-it-works",en:"Design Service",ar:"خدمة التصميم"},{href:"/visit",en:"Visit Us",ar:"زورونا"}].map(e=>(0,t.jsx)("li",{children:(0,t.jsx)("a",{href:e.href,className:"ft__link",children:s?e.en:e.ar})},e.href))})]}),(0,t.jsxs)(n.Rise,{delay:.12,children:[(0,t.jsx)("span",{className:"ft__cap",children:s?"Connect":"تواصل"}),(0,t.jsx)("ul",{className:"ft__list",children:[{label:"Instagram",href:"https://www.instagram.com/evorafuturehome/"},{label:"Facebook",href:"https://www.facebook.com/EvoraFutureHome/"},{label:"WhatsApp",href:"https://wa.me/962796364105"}].map(e=>(0,t.jsx)("li",{children:(0,t.jsx)("a",{href:e.href,target:"_blank",rel:"noopener noreferrer",className:"ft__link",children:e.label})},e.label))})]}),(0,t.jsxs)(n.Rise,{delay:.18,children:[(0,t.jsx)("span",{className:"ft__cap",children:s?"Visit":"زورونا"}),(0,t.jsxs)("p",{className:"ft__addr",children:[e("visit_addr"),(0,t.jsx)("br",{}),e("visit_hours")]}),(0,t.jsxs)("p",{className:"ft__addr",style:{marginTop:"0.7rem"},children:[(0,t.jsx)("a",{href:"tel:+962791301444",className:"ft__link",children:"+962 79 130 1444"}),(0,t.jsx)("br",{}),(0,t.jsx)("a",{href:"tel:+962796364105",className:"ft__link",children:"+962 79 636 4105"})]})]})]}),(0,t.jsx)("div",{className:"ft__legal",children:(0,t.jsxs)("span",{children:["© ",2026," Evora · ",e("footer_tag")]})})]})]})}],56691)}]);