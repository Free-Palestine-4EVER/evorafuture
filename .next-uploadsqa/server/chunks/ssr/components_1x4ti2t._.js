module.exports=[208906,a=>{"use strict";var b=a.i(187924),c=a.i(482359);a.s(["default",0,function({tone:a="ink",size:d=1}){return(0,b.jsx)(c.default,{tone:a,style:{height:`${2.4*d}rem`,width:"auto",transition:"color .4s var(--ease)"}})}])},668222,a=>{"use strict";var b=a.i(187924),c=a.i(346271),d=a.i(572131),e=a.i(254760);let f={some:0,all:1};var g=a.i(995180),h=a.i(566535),i=a.i(901299),j=a.i(621216);class k{constructor(a){this.stop=()=>this.runAll("stop"),this.animations=a.filter(Boolean)}get finished(){return Promise.all(this.animations.map(a=>a.finished))}getAll(a){return this.animations[0][a]}setAll(a,b){for(let c=0;c<this.animations.length;c++)this.animations[c][a]=b}attachTimeline(a){let b=this.animations.map(b=>b.attachTimeline(a));return()=>{b.forEach((a,b)=>{a&&a(),this.animations[b].stop()})}}get time(){return this.getAll("time")}set time(a){this.setAll("time",a)}get speed(){return this.getAll("speed")}set speed(a){this.setAll("speed",a)}get state(){return this.getAll("state")}get startTime(){return this.getAll("startTime")}get duration(){return l(this.animations,"duration")}get iterationDuration(){return l(this.animations,"iterationDuration")}runAll(a){this.animations.forEach(b=>b[a]())}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}function l(a,b){let c=0;for(let d=0;d<a.length;d++){let e=a[d][b];null!==e&&e>c&&(c=e)}return c}class m extends k{then(a,b){return this.finished.finally(a).then(()=>{})}}var n=a.i(332562),o=a.i(468184),p=a.i(820033),q=a.i(198852),r=a.i(478025),s=a.i(278652),t=a.i(794015),u=a.i(880733),v=a.i(984913),w=a.i(918271),x=a.i(900702),y=a.i(208688),z=a.i(225164);function A(a,b){var c;let d;return(0,z.isEasingArray)(a)?a[c=a.length,((b-0)%(d=c-0)+d)%d+0]:a}function B(a){return"object"==typeof a&&!Array.isArray(a)}function C(a,b,c,d){return null==a?[]:"string"==typeof a&&B(b)?(0,e.resolveElements)(a,c,d):a instanceof NodeList?Array.from(a):Array.isArray(a)?a.filter(a=>null!=a):[a]}function D(a,b,c,d){return"number"==typeof b?b:b.startsWith("-")||b.startsWith("+")?Math.max(0,a+parseFloat(b)):"<"===b?c:b.startsWith("<")?Math.max(0,c+parseFloat(b.slice(1))):d.get(b)??a}var E=a.i(955761);function F(a,b){return a.at!==b.at?a.at-b.at:null===a.value?1:null===b.value?-1:0}function G(a,b){return b.has(a)||b.set(a,{}),b.get(a)}function H(a,b){return b[a]||(b[a]=[]),b[a]}let I=a=>"number"==typeof a,J=a=>a.every(I);var K=a.i(112711),L=a.i(473559),M=a.i(310349),N=a.i(145854),O=a.i(104721),P=a.i(687328),Q=a.i(72789),R=a.i(120275),S=a.i(355794);class T extends S.VisualElement{constructor(){super(...arguments),this.type="object"}readValueFromInstance(a,b){if(b in a){let c=a[b];if("string"==typeof c||"number"==typeof c)return c}}getBaseTargetFromProps(){}removeValueFromRenderState(a,b){delete b.output[a]}measureInstanceViewportBox(){return(0,R.createBox)()}build(a,b){Object.assign(a.output,b)}renderInstance(a,{output:b}){Object.assign(a,b)}sortInstanceNodePosition(){return 0}}function U(a){let b={presenceContext:null,props:{},visualState:{renderState:{transform:{},transformOrigin:{},style:{},vars:{},attrs:{}},latestValues:{}}},c=(0,N.isSVGElement)(a)&&!(0,O.isSVGSVGElement)(a)?new P.SVGVisualElement(b):new Q.HTMLVisualElement(b);c.mount(a),L.visualElementStore.set(a,c)}function V(a){let b=new T({presenceContext:null,props:{},visualState:{renderState:{output:{}},latestValues:{}}});b.mount(a),L.visualElementStore.set(a,b)}function W(a,b,c,d){let e=[];if((0,q.isMotionValue)(a)||"number"==typeof a||"string"==typeof a&&!B(b))e.push((0,K.animateSingleValue)(a,B(b)&&b.default||b,c&&c.default||c));else{if(null==a)return e;let f=C(a,b,d),g=f.length;(0,x.invariant)(!!g,"No valid elements provided.","no-valid-elements");for(let a=0;a<g;a++){let d=f[a],h=d instanceof Element?U:V;L.visualElementStore.has(d)||h(d);let i=L.visualElementStore.get(d),j={...c};"delay"in j&&"function"==typeof j.delay&&(j.delay=j.delay(a,g)),e.push(...(0,M.animateTarget)(i,{...b,transition:j},{}))}}return e}let X=function(a={}){let{scope:b,reduceMotion:c,skipAnimations:d}=a;return function(a,e,f){var g;let h,i=[],j={};if(void 0!==c&&(j.reduceMotion=c),void 0!==d&&(j.skipAnimations=d),Array.isArray(a)&&a.some(Array.isArray)){let c,{onComplete:d,...f}=e||{};"function"==typeof d&&(h=d),g={...j,...f},c=[],(function(a,{defaultTransition:b={},...c}={},d,e){let f=b.duration||.3,g=new Map,h=new Map,i={},j=new Map,k=0,l=0,m=0;for(let c=0;c<a.length;c++){let g=a[c];if("string"==typeof g){j.set(g,l);continue}if(!Array.isArray(g)){j.set(g.name,D(l,g.at,k,j));continue}let[v,z,B={}]=g;void 0!==B.at&&(l=D(l,B.at,k,j));let F=0,I=(a,c,d,g=0,h=0)=>{var i;let j=Array.isArray(i=a)?i:[i],{delay:k=0,times:o=(0,r.defaultOffset)(j),type:p=b.type||"keyframes",repeat:q,repeatType:v,repeatDelay:z=0,...B}=c,{ease:C=b.ease||"easeOut",duration:D}=c,G="function"==typeof k?k(g,h):k,H=j.length,I=(0,s.isGenerator)(p)?p:e?.[p||"keyframes"];if(H<=2&&I){let a=100;2===H&&J(j)&&(a=Math.abs(j[1]-j[0]));let c={...b,...B};void 0!==D&&(c.duration=(0,w.secondsToMilliseconds)(D));let d=(0,t.createGeneratorEasing)(c,a,I);C=d.ease,D=d.duration}D??(D=f);let K=l+G;1===o.length&&0===o[0]&&(o[1]=1);let L=o.length-j.length;if(L>0&&(0,u.fillOffset)(o,L),1===j.length&&j.unshift(null),q&&(0,x.warning)(q<20,`Sequence segments can't repeat ${q} times — ignoring repeat option. Use a value below 20 or apply repeat at the sequence level instead.`),q&&q<20){let a=D>0?z/D:0;D=D*(q+1)+z*q;let b=[...j],c=[...o],d=[...C=Array.isArray(C)?[...C]:[C]],e="reverse"===v||"mirror"===v,f=b,g=d;e&&(f=[...b].reverse(),"reverse"===v&&(g=[...d].reverse().map(a=>"function"==typeof a?(0,y.reverseEasing)(a):a)));for(let h=0;h<q;h++){let i=e&&h%2==0,k=i?f:b,l=i?g:d,m=(h+1)*(1+a);a>0&&(j.push(j[j.length-1]),o.push(m),C.push("linear")),j.push(...k);for(let a=0;a<k.length;a++)o.push(c[a]+m),C.push(0===a?"linear":A(l,a-1))}!function(a,b,c=0){let d=b+1+b*c;for(let b=0;b<a.length;b++)a[b]=a[b]/d}(o,q,a)}let M=K+D;!function(a,b,c,d,e,f){for(let b=0;b<a.length;b++){let c=a[b];c.at>e&&c.at<f&&((0,n.removeItem)(a,c),b--)}for(let g=0;g<b.length;g++)a.push({value:b[g],at:(0,E.mixNumber)(e,f,d[g]),easing:A(c,g)})}(d,j,C,o,K,M),F=Math.max(G+D,F),m=Math.max(M,m)};if((0,q.isMotionValue)(v))I(z,B,H("default",G(v,h)));else{let a=C(v,z,d,i),b=a.length;for(let c=0;c<b;c++){let d=G(a[c],h);for(let a in z){var o,p;I(z[a],(o=B,p=a,o&&o[p]?{...o,...o[p]}:{...o}),H(a,d),c,b)}}}k=l,l+=F}return h.forEach((a,d)=>{for(let e in a){let f=a[e];f.sort(F);let h=[],i=[],j=[];for(let a=0;a<f.length;a++){let{at:b,value:c,easing:d}=f[a];h.push(c),i.push((0,v.progress)(0,m,b)),j.push(d||"easeOut")}0!==i[0]&&(i.unshift(0),h.unshift(h[0]),j.unshift("easeInOut")),1!==i[i.length-1]&&(i.push(1),h.push(null)),g.has(d)||g.set(d,{keyframes:{},transition:{}});let k=g.get(d);k.keyframes[e]=h;let{type:l,...n}=b;k.transition[e]={...n,duration:m,ease:j,times:i,...c}}}),g})(a.map(a=>{if(Array.isArray(a)&&"function"==typeof a[0]){let b=a[0],c=(0,o.motionValue)(0);return(c.on("change",b),1===a.length)?[c,[0,1]]:2===a.length?[c,[0,1],a[1]]:[c,a[1],a[2]]}return a}),g,b,{spring:p.spring}).forEach(({keyframes:a,transition:b},d)=>{c.push(...W(d,a,b))}),i=c}else{let{onComplete:c,...d}=f||{};"function"==typeof c&&(h=c),i=W(a,e,{...j,...d},b)}let k=new m(i);return h&&k.finished.then(h),b&&(b.animations.push(k),k.finished.then(()=>{(0,n.removeItem)(b.animations,k)})),k}}(),Y=[.22,1,.36,1],Z={once:!0,margin:"0px 0px -12% 0px"};a.s(["CountUp",0,function({value:a,className:c,style:g}){let h=(0,j.useReducedMotion)(),i=(0,d.useRef)(null),k=function(a,{root:b,margin:c,amount:g,once:h=!1,initial:i=!1}={}){let[j,k]=(0,d.useState)(i);return(0,d.useEffect)(()=>{if(!a.current||h&&j)return;let d={root:b&&b.current||void 0,margin:c,amount:g};return function(a,b,{root:c,margin:d,amount:g="some"}={}){let h=(0,e.resolveElements)(a),i=new WeakMap,j=new IntersectionObserver(a=>{a.forEach(a=>{let c=i.get(a.target);if(!!c!==a.isIntersecting)if(a.isIntersecting){let c=b(a.target,a);"function"==typeof c?i.set(a.target,c):j.unobserve(a.target)}else"function"==typeof c&&(c(a),i.delete(a.target))})},{root:c,rootMargin:d,threshold:"number"==typeof g?g:f[g]});return h.forEach(a=>j.observe(a)),()=>j.disconnect()}(a.current,()=>(k(!0),h?void 0:()=>k(!1)),d)},[b,a,c,h,g]),j}(i,{once:!0,margin:"0px 0px -10% 0px"}),[l,m]=(0,d.useState)(a),n=a.match(/^([\d.,]+)(.*)$/),o=n?n[1]:a,p=n?n[2]:"",q=o.includes(","),r=parseFloat(o.replace(/,/g,""))||0,s=o.includes(".")?o.split(".")[1].length:0;return(0,d.useEffect)(()=>{if(h||!k||!n)return void m(a);let b=X(0,r,{duration:1.6,ease:Y,onUpdate:a=>m((a=>{let b=a.toFixed(s);if(!q)return b+p;let[c,d]=b.split("."),e=c.replace(/\B(?=(\d{3})+(?!\d))/g,",");return(d?`${e}.${d}`:e)+p})(a))});return()=>b.stop()},[k,h,a]),(0,b.jsx)("span",{ref:i,className:c,style:g,children:l||a})},"EASE",0,Y,"Magnetic",0,function({children:a,strength:e=.35,className:f,style:g}){let i=(0,j.useReducedMotion)(),k=(0,d.useRef)(null),l=(0,h.useSpring)(0,{stiffness:200,damping:18,mass:.4}),m=(0,h.useSpring)(0,{stiffness:200,damping:18,mass:.4});return i?(0,b.jsx)("div",{className:f,style:g,children:a}):(0,b.jsx)(c.motion.div,{ref:k,className:f,style:{display:"inline-flex",x:l,y:m,...g},onMouseMove:a=>{let b=k.current;if(!b)return;let c=b.getBoundingClientRect();l.set((a.clientX-(c.left+c.width/2))*e),m.set((a.clientY-(c.top+c.height/2))*e)},onMouseLeave:()=>{l.set(0),m.set(0)},children:a})},"ParallaxImage",0,function({src:a,alt:e="",amount:f=12,className:k,style:l}){let m=(0,j.useReducedMotion)(),n=(0,d.useRef)(null),{scrollYProgress:o}=(0,g.useScroll)({target:n,offset:["start end","end start"]}),p=(0,i.useTransform)(o,[0,1],[`-${f}%`,`${f}%`]),q=(0,h.useSpring)(p,{stiffness:80,damping:30,mass:.5});return(0,b.jsx)("div",{ref:n,className:k,style:{position:"relative",overflow:"hidden",...l},children:(0,b.jsx)(c.motion.img,{src:a,alt:e,style:{position:"absolute",inset:`-${f+4}% 0`,width:"100%",height:`${100+(f+4)*2}%`,objectFit:"cover",y:m?0:q,willChange:"transform"}})})},"RevealLines",0,function({lines:a,className:d,style:e,delay:f=0,italicIndex:g,italicColor:h}){let i={hidden:(0,j.useReducedMotion)()?{opacity:0}:{y:"110%"},show:{y:"0%",opacity:1,transition:{duration:1,ease:Y}}};return(0,b.jsx)(c.motion.span,{className:d,style:{display:"block",...e},variants:{hidden:{},show:{transition:{staggerChildren:.1,delayChildren:f}}},initial:"hidden",whileInView:"show",viewport:Z,children:a.map((a,d)=>(0,b.jsx)("span",{style:{display:"block",overflow:"hidden",paddingBottom:"0.08em"},children:(0,b.jsx)(c.motion.span,{variants:i,style:{display:"inline-block",willChange:"transform"},children:d===g?(0,b.jsx)("span",{className:"serif-i",style:{color:h},children:a}):a})},d))})},"RevealWords",0,function({text:a,className:d,style:e,delay:f=0}){let g=(0,j.useReducedMotion)(),h=a.split(" "),i={hidden:g?{opacity:0}:{opacity:0,y:"0.5em"},show:{opacity:1,y:0,transition:{duration:.7,ease:Y}}};return(0,b.jsx)(c.motion.span,{className:d,style:e,variants:{hidden:{},show:{transition:{staggerChildren:.018,delayChildren:f}}},initial:"hidden",whileInView:"show",viewport:Z,children:h.map((a,d)=>(0,b.jsx)(c.motion.span,{variants:i,style:{display:"inline-block",whiteSpace:"pre"},children:a+(d<h.length-1?" ":"")},d))})},"Rise",0,function({children:a,delay:d=0,y:e=44,blur:f=!0,as:g="div",className:h,style:i}){let k=(0,j.useReducedMotion)(),l=c.motion[g];return(0,b.jsx)(l,{className:h,style:i,initial:k?{opacity:0}:{opacity:0,y:e,filter:f?"blur(10px)":"blur(0px)"},whileInView:k?{opacity:1}:{opacity:1,y:0,filter:"blur(0px)"},viewport:Z,transition:{duration:1.05,ease:Y,delay:d},children:a})},"Stagger",0,function({children:a,delay:d=0,gap:e=.09,className:f,style:g}){return(0,b.jsx)(c.motion.div,{className:f,style:g,variants:{hidden:{},show:{transition:{staggerChildren:e,delayChildren:d}}},initial:"hidden",whileInView:"show",viewport:Z,children:a})},"StaggerItem",0,function({children:a,y:d=28,className:e,style:f}){let g=(0,j.useReducedMotion)();return(0,b.jsx)(c.motion.div,{className:e,style:f,variants:{hidden:g?{opacity:0}:{opacity:0,y:d,filter:"blur(8px)"},show:{opacity:1,y:0,filter:"blur(0px)",transition:{duration:1,ease:Y}}},children:a})}],668222)},807998,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(50944),e=a.i(208906),f=a.i(668222),g=a.i(346271),h=a.i(621216),i=a.i(635577),j=a.i(922723);let k=[{id:"/",key:"nav_home"},{id:"/shop",key:"nav_shop"},{id:"/kitchen",key:"nav_kitchen"},{id:"/catalog",key:"nav_catalog"},{id:"/visit",key:"nav_visit"}],l={type:"spring",stiffness:520,damping:32};a.s(["default",0,function({pinnedSolid:a=!1}){let{t:m,lang:n,toggle:o}=(0,i.useT)(),p=(0,h.useReducedMotion)(),q=(0,d.usePathname)(),[r,s]=(0,c.useState)(a),[t,u]=(0,c.useState)(!1),[v,w]=(0,c.useState)(!1),x=(0,c.useRef)(0),y=(0,c.useRef)(null),z=a=>!!q&&(q===a||q.startsWith(a+"/"));(0,c.useEffect)(()=>{let b=()=>{let b=window.scrollY;if(a)s(!0);else{let a=document.getElementById("top");s(b>(a&&a.offsetHeight>1.5*window.innerHeight?a.offsetHeight-1.1*window.innerHeight:.78*window.innerHeight))}if(!p){let a=b>x.current+2,c=b<x.current-2;a&&b>160?w(!0):c&&w(!1)}x.current=b};return b(),window.addEventListener("scroll",b,{passive:!0}),()=>window.removeEventListener("scroll",b)},[a,p]),(0,c.useEffect)(()=>{u(!1)},[q]),(0,c.useEffect)(()=>(document.body.style.overflow=t?"hidden":"",document.body.style.touchAction=t?"none":"",()=>{document.body.style.overflow="",document.body.style.touchAction=""}),[t]),(0,c.useEffect)(()=>{if(!t)return;let a=y.current;if(!a)return;let b=()=>Array.from(a.querySelectorAll("a[href], button:not([disabled])")).filter(a=>null!==a.offsetParent);b()[0]?.focus();let c=a=>{if("Escape"===a.key)return void u(!1);if("Tab"!==a.key)return;let c=b();if(0===c.length)return;let d=c[0],e=c[c.length-1];a.shiftKey&&document.activeElement===d?(a.preventDefault(),e.focus()):a.shiftKey||document.activeElement!==e||(a.preventDefault(),d.focus())};return document.addEventListener("keydown",c),()=>document.removeEventListener("keydown",c)},[t]);let A=r||t?"ink":"paper",B=t||r?"var(--ink)":"var(--paper)";return(0,b.jsxs)(g.motion.header,{"data-solid":r&&!t?"true":void 0,initial:!1,animate:{y:v&&!t?"-112%":0},transition:p?{duration:0}:{type:"spring",stiffness:380,damping:40},style:{position:"fixed",insetInline:0,top:0,zIndex:100,transition:"background .5s var(--ease), border-color .5s var(--ease)",background:r&&!t?"rgba(255,255,255,0.82)":"transparent",backdropFilter:r&&!t?"saturate(1.1) blur(14px)":"none",borderBottom:`1px solid ${r&&!t?"var(--line)":"transparent"}`},children:[(0,b.jsx)("span",{"aria-hidden":!0,style:{position:"absolute",insetInline:0,top:0,height:"calc(var(--nav-h, 78px) * 1.7)",pointerEvents:"none",zIndex:95,background:"linear-gradient(180deg, rgba(16,15,13,0.32), rgba(16,15,13,0))",opacity:+(!r&&!t),transition:"opacity .5s var(--ease)"}}),(0,b.jsxs)("nav",{className:`container nav-bar${r&&!t?" nav-settle":""}`,style:{position:"relative",zIndex:96,display:"flex",alignItems:"center",justifyContent:"space-between",height:"var(--nav-h, 78px)",color:B},children:[(0,b.jsx)("a",{href:"/","aria-label":"Evora home",onClick:()=>u(!1),children:(0,b.jsx)(e.default,{tone:t?"ink":A,size:.92})}),(0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"clamp(1rem,2.4vw,2.4rem)"},children:[(0,b.jsxs)("ul",{className:"nav-links",style:{display:"flex",gap:"1.9rem",listStyle:"none",margin:0,padding:0},children:[k.map(a=>(0,b.jsx)("li",{children:(0,b.jsx)(f.Magnetic,{strength:.2,children:(0,b.jsx)("a",{href:a.id,className:"nav-link","data-active":z(a.id)||void 0,"aria-current":z(a.id)?"page":void 0,children:m(a.key)})})},a.id)),(0,b.jsx)("li",{children:(0,b.jsx)(f.Magnetic,{strength:.2,children:(0,b.jsx)("a",{href:"/start",className:"nav-link","data-active":z("/start")||void 0,onClick:a=>{a.metaKey||a.ctrlKey||a.shiftKey||a.altKey||0!==a.button||(a.preventDefault(),(0,j.openStartProject)())},children:"ar"===n?"صمّم منزلي":"Design my home"})})}),(0,b.jsx)("li",{children:(0,b.jsx)(f.Magnetic,{strength:.2,children:(0,b.jsx)("a",{href:"/login",className:"nav-link","data-active":z("/login")||void 0,children:"ar"===n?"بوابة العملاء":"Client Portal"})})})]}),(0,b.jsx)("button",{onClick:o,"aria-label":"en"===n?"Switch to Arabic":"التبديل إلى الإنجليزية",style:{fontFamily:"en"===n?"var(--f-ar)":"var(--font-sans)",fontSize:"0.82rem",fontWeight:600,letterSpacing:"en"===n?"0":"0.06em",color:B,background:"transparent",border:`1px solid ${r&&!t?"var(--line)":"rgba(251,247,240,0.4)"}`,borderRadius:100,padding:"0.5em 0.95em",cursor:"none",transition:"all .3s var(--ease)"},children:"en"===n?"العربية":"EN"}),(0,b.jsx)(f.Magnetic,{strength:.2,children:(0,b.jsx)("a",{href:"/visit",className:"btn btn-ghost nav-book",style:{borderColor:r?"var(--line)":"rgba(251,247,240,0.5)",color:B},children:m("nav_book")})}),(0,b.jsx)("button",{className:"nav-burger","aria-label":t?"Close menu":"Open menu","aria-expanded":t,"aria-controls":"evora-mobile-menu",onClick:()=>u(a=>!a),style:{background:"transparent",border:"none",cursor:"none",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",padding:0},children:(0,b.jsxs)("span",{style:{position:"relative",width:30,height:22,display:"block"},children:[(0,b.jsx)(g.motion.span,{animate:{top:t?10:3,rotate:45*!!t},transition:p?{duration:0}:l,style:{position:"absolute",left:0,right:0,height:1.6,background:B,top:3,transformOrigin:"center"}}),(0,b.jsx)(g.motion.span,{animate:{opacity:+!t,scaleX:+!t},transition:p?{duration:0}:{duration:.2},style:{position:"absolute",left:0,right:0,height:1.6,background:B,top:10}}),(0,b.jsx)(g.motion.span,{animate:{top:t?10:17,rotate:t?-45:0},transition:p?{duration:0}:l,style:{position:"absolute",left:0,right:0,height:1.6,background:B,top:17,transformOrigin:"center"}})]})})]})]},r?"solid":"clear"),(0,b.jsxs)("div",{ref:y,id:"evora-mobile-menu",className:"mobile-menu",role:"dialog","aria-modal":t||void 0,"aria-label":"ar"===n?"القائمة":"Menu","aria-hidden":!t,style:{position:"fixed",inset:0,zIndex:95,background:"var(--paper)",display:"flex",flexDirection:"column",justifyContent:"center",padding:"calc(var(--gut) + var(--safe-top)) calc(var(--gut) + var(--safe-right)) calc(var(--gut) + var(--safe-bottom)) calc(var(--gut) + var(--safe-left))",opacity:+!!t,pointerEvents:t?"auto":"none",overflowY:"auto",WebkitOverflowScrolling:"touch",clipPath:t?"inset(0 0 0 0)":"inset(0 0 100% 0)",transition:"clip-path .6s var(--ease), opacity .4s var(--ease)"},children:[(0,b.jsx)("ul",{style:{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:"0.4rem"},children:k.map((a,c)=>(0,b.jsx)("li",{style:{overflow:"hidden"},children:(0,b.jsx)("a",{href:a.id,onClick:()=>u(!1),className:"display","aria-current":z(a.id)?"page":void 0,style:{display:"flex",alignItems:"center",minHeight:44,color:z(a.id)?"var(--clay)":"var(--ink)",fontSize:"clamp(2.2rem,9vw,3.6rem)",padding:"0.25rem 0",transform:t?"translateY(0)":"translateY(110%)",opacity:+!!t,transition:`transform .7s var(--ease) ${.12+.07*c}s, opacity .7s ease ${.12+.07*c}s, color .3s var(--ease)`},children:m(a.key)})},a.id))}),(0,b.jsxs)("div",{style:{marginTop:"2.5rem",display:"flex",gap:"0.8rem",flexWrap:"wrap"},children:[(0,b.jsxs)("a",{href:"/visit",onClick:()=>u(!1),className:"btn",style:{background:"var(--ink)",color:"var(--paper)"},children:[m("nav_book")," ",(0,b.jsx)("span",{className:"arrow",children:"→"})]}),(0,b.jsxs)("a",{href:"/start",className:"btn",style:{background:"var(--clay)",color:"#fff",border:"none",cursor:"pointer"},onClick:a=>{a.metaKey||a.ctrlKey||a.shiftKey||a.altKey||0!==a.button||(a.preventDefault(),u(!1),(0,j.openStartProject)())},children:["ar"===n?"صمّم منزلي":"Design my home"," ",(0,b.jsx)("span",{className:"arrow",children:"→"})]}),(0,b.jsx)("a",{href:"/login",onClick:()=>u(!1),className:"btn",style:{border:"1px solid var(--line)",color:"var(--ink)"},children:"ar"===n?"بوابة العملاء":"Client Portal"}),(0,b.jsx)("button",{onClick:o,className:"btn",style:{border:"1px solid var(--line)",color:"var(--ink)",fontFamily:"en"===n?"var(--f-ar)":"var(--font-sans)"},children:"en"===n?"العربية":"English"})]}),(0,b.jsx)("span",{style:{marginTop:"2.5rem",color:"var(--ink-faint)",fontSize:"0.72rem",letterSpacing:"0.18em",textTransform:"uppercase"},children:m("visit_addr")})]}),(0,b.jsx)("style",{children:`
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
      `})]})}])},600783,a=>{"use strict";var b=a.i(187924),c=a.i(208906),d=a.i(635577),e=a.i(668222),f=a.i(936059);let g="cubic-bezier(0.22, 1, 0.36, 1)",h="https://www.instagram.com/evorafuturehome/",i=[{id:"living",srcBase:"/evora/social/tile-living",name:{en:"Living Room",ar:"غرفة المعيشة"},alt:{en:"A curved caramel bouclé sofa beneath a brass ring chandelier, floor-to-ceiling city views beyond",ar:"كنبة منحنية بقماش الكراميل الدافئ تحت ثريا حلقية نحاسية، ونوافذ ممتدة تطل على المدينة"}},{id:"dining",srcBase:"/evora/social/tile-dining",name:{en:"Dining Room",ar:"غرفة الطعام"},alt:{en:"A long walnut dining table set with emerald velvet chairs beneath a brass pendant light",ar:"طاولة طعام طويلة من خشب الجوز محاطة بكراسٍ مخملية زمردية تحت إضاءة نحاسية معلّقة"}},{id:"bedroom",srcBase:"/evora/social/tile-bedroom",name:{en:"Bedroom",ar:"غرفة النوم"},alt:{en:"A bedroom with a tufted emerald headboard, crisp white linens and a matching velvet bench",ar:"غرفة نوم برأسية سرير زمردية مبطّنة، وأغطية بيضاء ناصعة، ومقعد مخملي مطابق"}},{id:"kitchen",srcBase:"/evora/social/tile-kitchen",name:{en:"Kitchen",ar:"المطبخ"},alt:{en:"A walnut kitchen with a marble waterfall island and a sculptural black hood",ar:"مطبخ من خشب الجوز بجزيرة رخامية بتصميم الشلال ومدخنة سوداء نحتية"}},{id:"chesterfield",srcBase:"/evora/social/tile-chesterfield",name:{en:"The Cream Chesterfield",ar:"تشسترفيلد الكريمي"},alt:{en:"A cream channel-tufted armchair beside a brass side table in soft daylight",ar:"كرسي كريمي مبطّن بخطوط ناعمة بجانب طاولة نحاسية جانبية في ضوء نهارٍ دافئ"}},{id:"lounge",srcBase:"/evora/social/tile-lounge",name:{en:"Guest Room",ar:"غرفة الضيوف"},alt:{en:"A taupe living-room seating set arranged around a walnut coffee table",ar:"طقم جلوس بقماش بيج دافئ حول طاولة قهوة من خشب الجوز"}}],j={eyebrow:{en:"Follow Along",ar:"تابعونا"},title:{en:"Follow Evora on Instagram & Facebook",ar:"تابعوا إيفورا على إنستغرام وفيسبوك"},sub:{en:"New arrivals, showroom moments and behind-the-scenes — right where you already scroll.",ar:"وصولات جديدة، ولحظات من المعرض، وما خلف الكواليس — في المكان الذي تتصفّحه أصلًا."},followingSuffix:{en:"following",ar:"متابع"},igCta:{en:"Follow on Instagram",ar:"تابعونا على إنستغرام"},fbCta:{en:"Follow on Facebook",ar:"تابعونا على فيسبوك"},igAria:{en:"Follow on Instagram — opens in a new tab",ar:"تابعونا على إنستغرام — يفتح في نافذة جديدة"},fbAria:{en:"Follow on Facebook — opens in a new tab",ar:"تابعونا على فيسبوك — يفتح في نافذة جديدة"},galleryLabel:{en:"A closer look",ar:"نظرة أقرب"},tileAriaSuffix:{en:"— see more on Instagram, opens in a new tab",ar:"— شاهدوا المزيد على إنستغرام، يفتح في نافذة جديدة"}};function k(){return(0,b.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",children:(0,b.jsx)("path",{d:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"})})}function l(){return(0,b.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",children:(0,b.jsx)("path",{d:"M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.523 1.492-3.917 3.777-3.917 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z"})})}function m(){let{lang:a}=(0,d.useT)(),c=b=>j[b][a];return(0,b.jsxs)("div",{className:"ft__social",lang:a,children:[(0,b.jsx)("style",{children:`
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
          transition: transform 0.7s ${g};
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
          transition: opacity 0.45s ${g};
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
          transition: opacity 0.4s ${g}, transform 0.4s ${g};
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
      `}),(0,b.jsxs)(e.Rise,{as:"div",className:"ft__social-top",children:[(0,b.jsxs)("div",{className:"ft__social-copy",children:[(0,b.jsx)("span",{className:"eyebrow ft__social-eyebrow",style:{color:"var(--brass)"},children:c("eyebrow")}),(0,b.jsx)("h2",{className:"display ft__social-title",children:c("title")}),(0,b.jsx)("p",{className:"ft__social-sub",children:c("sub")}),(0,b.jsxs)("p",{className:"ft__social-meta",children:[f.FOLLOWERS,"+ ",c("followingSuffix")]})]}),(0,b.jsxs)("div",{className:"ft__social-actions",children:[(0,b.jsx)(e.Magnetic,{children:(0,b.jsxs)("a",{href:h,target:"_blank",rel:"noopener noreferrer",className:"btn btn-solid ft__social-btn","aria-label":c("igAria"),"data-cursor":"hover",children:[(0,b.jsx)(k,{}),(0,b.jsx)("span",{children:c("igCta")}),(0,b.jsx)("span",{className:"ft__ig-dot","aria-hidden":"true"}),(0,b.jsx)("span",{className:"ft__social-handle",children:"@evorafuturehome"}),(0,b.jsx)("span",{className:"arrow",children:"→"})]})}),(0,b.jsx)(e.Magnetic,{children:(0,b.jsxs)("a",{href:"https://www.facebook.com/EvoraFutureHome/",target:"_blank",rel:"noopener noreferrer",className:"btn btn-ghost ft__social-btn","aria-label":c("fbAria"),"data-cursor":"hover",children:[(0,b.jsx)(l,{}),(0,b.jsx)("span",{children:c("fbCta")}),(0,b.jsx)("span",{className:"arrow",children:"→"})]})})]})]}),(0,b.jsxs)(e.Rise,{as:"div",className:"ft__gallery",delay:.1,children:[(0,b.jsx)("span",{className:"eyebrow ft__gallery-eyebrow",children:c("galleryLabel")}),(0,b.jsx)(e.Stagger,{className:"ft__grid",gap:.06,children:i.map(d=>(0,b.jsx)(e.StaggerItem,{className:"ft__tile-cell",children:(0,b.jsxs)("a",{href:h,target:"_blank",rel:"noopener noreferrer",className:"ft__tile","aria-label":`${d.name[a]} ${c("tileAriaSuffix")}`,"data-cursor":"hover",children:[(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{srcSet:`${d.srcBase}.avif`,type:"image/avif"}),(0,b.jsx)("img",{src:`${d.srcBase}.webp`,alt:d.alt[a],loading:"lazy",decoding:"async",className:"ft__tile-img"})]}),(0,b.jsx)("span",{className:"ft__tile-scrim","aria-hidden":"true"}),(0,b.jsx)("span",{className:"ft__tile-icon","aria-hidden":"true",children:(0,b.jsx)(k,{})})]})},d.id))})]}),(0,b.jsx)("div",{id:"evora-ig-feed",className:"ft__feed-mount"})]})}a.s(["default",0,function(){let{t:a,lang:f}=(0,d.useT)(),g="en"===f;return(0,b.jsxs)("footer",{className:"ft",lang:f,children:[(0,b.jsx)("style",{children:`
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
          font-style: ${g?"italic":"normal"};
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
      `}),(0,b.jsxs)("div",{className:"container",children:[(0,b.jsx)(m,{}),(0,b.jsxs)("div",{className:"ft__cols",children:[(0,b.jsxs)(e.Rise,{className:"ft__brand",children:[(0,b.jsx)(c.default,{tone:"ink",size:1.25}),(0,b.jsx)("p",{className:"ft__rights",children:a("footer_rights")})]}),(0,b.jsxs)(e.Rise,{delay:.06,as:"nav",children:[(0,b.jsx)("span",{className:"ft__cap",children:g?"Explore":"استكشف"}),(0,b.jsx)("ul",{className:"ft__list",children:[{href:"/shop",en:"Shop",ar:"تسوّق"},{href:"/shop/rooms",en:"Shop by Room",ar:"تسوّق حسب الغرفة"},{href:"/showroom",en:"Virtual Showroom",ar:"المعرض الافتراضي"},{href:"/kitchen",en:"Kitchen Islands",ar:"جزر المطبخ"},{href:"/how-it-works",en:"Design Service",ar:"خدمة التصميم"},{href:"/visit",en:"Visit Us",ar:"زورونا"}].map(a=>(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:a.href,className:"ft__link",children:g?a.en:a.ar})},a.href))})]}),(0,b.jsxs)(e.Rise,{delay:.12,children:[(0,b.jsx)("span",{className:"ft__cap",children:g?"Connect":"تواصل"}),(0,b.jsx)("ul",{className:"ft__list",children:[{label:"Instagram",href:"https://www.instagram.com/evorafuturehome/"},{label:"Facebook",href:"https://www.facebook.com/EvoraFutureHome/"},{label:"WhatsApp",href:"https://wa.me/962796364105"}].map(a=>(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:a.href,target:"_blank",rel:"noopener noreferrer",className:"ft__link",children:a.label})},a.label))})]}),(0,b.jsxs)(e.Rise,{delay:.18,children:[(0,b.jsx)("span",{className:"ft__cap",children:g?"Visit":"زورونا"}),(0,b.jsxs)("p",{className:"ft__addr",children:[a("visit_addr"),(0,b.jsx)("br",{}),a("visit_hours")]}),(0,b.jsxs)("p",{className:"ft__addr",style:{marginTop:"0.7rem"},children:[(0,b.jsx)("a",{href:"tel:+962791301444",className:"ft__link",children:"+962 79 130 1444"}),(0,b.jsx)("br",{}),(0,b.jsx)("a",{href:"tel:+962796364105",className:"ft__link",children:"+962 79 636 4105"})]})]})]}),(0,b.jsx)("div",{className:"ft__legal",children:(0,b.jsxs)("span",{children:["© ",2026," Evora · ",a("footer_tag")]})})]})]})}],600783)}];

//# sourceMappingURL=components_1x4ti2t._.js.map