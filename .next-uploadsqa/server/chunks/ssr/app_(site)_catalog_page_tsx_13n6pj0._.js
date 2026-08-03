module.exports=[780218,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(807998),e=a.i(600783),f=a.i(238246),g=a.i(635577),h=a.i(668222),i=a.i(936059);let j=a=>0===a||33===a?"/evora/lookbook/cover.webp":32===a?"/evora/lookbook/back-filler.webp":`/evora/lookbook/p${String(a).padStart(2,"0")}.webp`,k=[{from:0,en:"The Lookbook",ar:"الكتالوج"},{from:1,en:"The Private Quarters",ar:"الأجنحة الخاصة"},{from:16,en:"Living & Majlis",ar:"المعيشة والمجلس"},{from:25,en:"Lounge & Leisure",ar:"الاستراحة والترفيه"}];function l(a,b){let c=k[0];for(let b of k)b.from<=a&&(c=b);return"en"===b?c.en:c.ar}var m=a.i(785466);function n({page:a,setPage:d,lang:e,dir:f,mono:g=!1}){let h="en"===e,i="rtl"!==f,k=(0,c.useMemo)(()=>{let a=Array.from({length:34},(a,b)=>b);return g||a.length%2==0||a.push(null),a},[g]),l=g?34:k.length/2,o=a=>g?a:Math.round(a/2),[p,q]=(0,c.useState)(()=>o(a)),r=(0,c.useRef)(-1);(0,c.useEffect)(()=>{let b=Math.min(o(a),l);q(a=>a===b?a:b)},[a,l,g]),(0,c.useEffect)(()=>{let a=g?p:Math.min(2*p,33);a!==r.current&&(r.current=a,d(a))},[p,d,g]);let s=g?l-1:l,t=(0,c.useCallback)(()=>q(a=>Math.min(a+1,s)),[s]),u=(0,c.useCallback)(()=>q(a=>Math.max(a-1,0)),[]);(0,c.useEffect)(()=>{let a=a=>{let b="rtl"===f?"ArrowLeft":"ArrowRight",c="rtl"===f?"ArrowRight":"ArrowLeft";a.key===b?t():a.key===c&&u()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[t,u,f]);let v=(0,c.useRef)(null),[w,x]=(0,c.useState)({w:0,h:0});(0,c.useEffect)(()=>{let a=v.current;if(!a)return;let b=()=>x({w:a.clientWidth,h:a.clientHeight}),c=new ResizeObserver(b);return c.observe(a),b(),()=>c.disconnect()},[]);let y=g&&w.w?Math.round(Math.min(.9*w.w,.96*w.h)):void 0,z=(0,c.useRef)(null),[A,B]=(0,c.useState)(null),C=(0,c.useRef)({startX:0,moved:0,half:1}),D=(0,c.useCallback)(()=>{B(a=>{if(!a)return null;let b=C.current.moved<6;return(a.p>.35||b)&&q(b=>1===a.dir?Math.min(b+1,s):Math.max(b-1,0)),null})},[s]),E=0===p,F=p===s,G=i?-1:1,H=({idx:a})=>{let c=k[a];return null==c?(0,b.jsx)("span",{className:"lbk-blank"}):(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{srcSet:(0,m.avifSrc)(j(c)),type:"image/avif"}),(0,b.jsx)("img",{className:"lbk-img",src:j(c),alt:h?`Page ${c+1}`:`صفحة ${c+1}`,draggable:!1,loading:c<4?"eager":"lazy"})]})};return(0,b.jsxs)("div",{className:"lbk",ref:v,children:[(0,b.jsx)("button",{className:"lbk-nav lbk-nav--prev","aria-label":h?"Previous":"السابق",onClick:u,disabled:E,children:"‹"}),(0,b.jsxs)("div",{ref:z,style:y?{width:y,height:y}:void 0,className:`lbk-book ${g?"is-mono":""} ${!g&&E?"is-closed":""} ${!g&&F?"is-end":""} ${A?"is-dragging":""}`,onPointerDown:a=>{if(0!==a.button||A)return;let b=z.current;if(!b)return;let c=b.getBoundingClientRect(),d=a.clientX-c.left>c.width/2,e=i?d:!d;e&&p>=s||(e||!(p<=0))&&(C.current={startX:a.clientX,moved:0,half:c.width/2},b.setPointerCapture?.(a.pointerId),B({leaf:e?p:p-1,dir:e?1:-1,p:0}))},onPointerMove:a=>{if(!A)return;let b=a.clientX-C.current.startX;C.current.moved=Math.max(C.current.moved,Math.abs(b));let c=1===A.dir?i?-b:b:i?b:-b;B(a=>a?{...a,p:Math.max(0,Math.min(1,c/C.current.half))}:a)},onPointerUp:D,onPointerCancel:D,children:[(0,b.jsx)("span",{className:"lbk-floor","aria-hidden":"true"}),Array.from({length:l}).map((a,c)=>{let d=c<p,e=A?.leaf===c,f={zIndex:d?c:l-c};if(e&&A){let a=180*G*(1===A.dir?A.p:1-A.p);f={zIndex:l+5,transform:`rotateY(${a}deg)`,"--cp":String(Math.sin(A.p*Math.PI))}}let h=g?c:2*c;return(0,b.jsxs)("div",{className:`lbk-leaf ${d?"is-flipped":""} ${e?"is-live":""}`,style:f,children:[(0,b.jsxs)("div",{className:"lbk-face lbk-face--front",children:[(0,b.jsx)("div",{className:"lbk-sheet",children:(0,b.jsx)(H,{idx:h})}),(0,b.jsx)("span",{className:"lbk-shade lbk-shade--front"})]}),(0,b.jsxs)("div",{className:"lbk-face lbk-face--back",children:[(0,b.jsx)("div",{className:"lbk-sheet",children:g?(0,b.jsx)("span",{className:"lbk-blank"}):(0,b.jsx)(H,{idx:2*c+1})}),(0,b.jsx)("span",{className:"lbk-shade lbk-shade--back"})]})]},c)}),!g&&(0,b.jsx)("span",{className:"lbk-spine"})]}),(0,b.jsx)("button",{className:"lbk-nav lbk-nav--next","aria-label":h?"Next":"التالي",onClick:t,disabled:F,children:"›"})]})}function o({page:a,setPage:d,lang:e}){let f="en"===e,g=a=>Math.max(0,Math.min(33,a)),h=(0,c.useRef)(null),[i,k]=(0,c.useState)({s:1,x:0,y:0}),n=(0,c.useRef)(new Map),p=(0,c.useRef)({d:0,s:1}),q=(0,c.useRef)({on:!1,x:0,y:0,vx:0,vy:0,moved:0});(0,c.useEffect)(()=>{k({s:1,x:0,y:0})},[a]),(0,c.useEffect)(()=>{let b=b=>{"ArrowRight"===b.key?d(g(a+1)):"ArrowLeft"===b.key&&d(g(a-1))};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[a,d]);let r=(0,c.useCallback)((a,b,c)=>{let d=h.current,e=d?Math.min(d.clientWidth,d.clientHeight):0,f=Math.max(0,(e*a-e)/2);return{s:a,x:Math.max(-f,Math.min(f,b)),y:Math.max(-f,Math.min(f,c))}},[]),s=(a,b,c)=>{k(d=>{let e=h.current;if(!e)return d;let f=e.getBoundingClientRect(),g=b-f.left-f.width/2,i=c-f.top-f.height/2,j=Math.max(1,Math.min(4.5,d.s*a)),k=j/d.s;return r(j,g-k*(g-d.x),i-k*(i-d.y))})},t=b=>{let c=q.current;n.current.delete(b.pointerId),n.current.size<2&&(p.current.d=0),0===n.current.size&&(q.current.on=!1,i.s<=1.02&&Math.abs(b.clientX-c.x)>60&&c.moved<400&&d(g(a+(b.clientX<c.x?1:-1))))},u=i.s>1.02;return(0,b.jsxs)("div",{className:"lbz",children:[(0,b.jsx)("div",{ref:h,className:`lbz-frame ${u?"is-zoomed":""}`,onWheel:a=>{a.preventDefault(),s(a.deltaY<0?1.18:1/1.18,a.clientX,a.clientY)},onPointerDown:a=>{if(a.currentTarget.setPointerCapture?.(a.pointerId),n.current.set(a.pointerId,{x:a.clientX,y:a.clientY}),1===n.current.size&&(q.current={on:!0,x:a.clientX,y:a.clientY,vx:i.x,vy:i.y,moved:0}),2===n.current.size){let[a,b]=[...n.current.values()];p.current={d:Math.hypot(a.x-b.x,a.y-b.y),s:i.s},q.current.on=!1}},onPointerMove:a=>{if(n.current.has(a.pointerId)){if(n.current.set(a.pointerId,{x:a.clientX,y:a.clientY}),2===n.current.size){let[a,b]=[...n.current.values()],c=Math.hypot(a.x-b.x,a.y-b.y),d=Math.max(1,Math.min(4.5,p.current.s*(c/(p.current.d||c))));k(a=>r(d,a.x,a.y));return}if(q.current.on){let b=a.clientX-q.current.x,c=a.clientY-q.current.y;q.current.moved=Math.max(q.current.moved,Math.abs(b)+Math.abs(c)),i.s>1&&k(a=>r(a.s,q.current.vx+b,q.current.vy+c))}}},onPointerUp:t,onPointerCancel:t,onDoubleClick:a=>{i.s>1.2?k({s:1,x:0,y:0}):s(2.6,a.clientX,a.clientY)},children:(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{srcSet:(0,m.avifSrc)(j(a)),type:"image/avif"}),(0,b.jsx)("img",{className:"lbz-img",src:j(a),alt:f?`Page ${a+1}`:`صفحة ${a+1}`,draggable:!1,style:{transform:`translate(${i.x}px, ${i.y}px) scale(${i.s})`,transition:q.current.on||p.current.d?"none":"transform .28s cubic-bezier(.22,1,.36,1)"}})]})}),(0,b.jsxs)("div",{className:"lbz-tools",children:[(0,b.jsx)("button",{className:"lbz-btn","aria-label":"Previous",onClick:()=>d(g(a-1)),disabled:0===a,children:"‹"}),(0,b.jsx)("button",{className:"lbz-btn","aria-label":"Zoom out",onClick:()=>s(1/1.4,0,0),children:"–"}),(0,b.jsxs)("span",{className:"lbz-level",children:[Math.round(100*i.s),"%"]}),(0,b.jsx)("button",{className:"lbz-btn","aria-label":"Zoom in",onClick:()=>s(1.4,0,0),children:"+"}),(0,b.jsx)("button",{className:"lbz-btn","aria-label":"Next",onClick:()=>d(g(a+1)),disabled:33===a,children:"›"})]}),(0,b.jsxs)("div",{className:"lbz-cap",children:[l(a,e)," · ",String(a+1).padStart(2,"0")," / ",34]})]})}function p({page:a,setPage:d,lang:e}){let f="en"===e,g=a=>Math.max(0,Math.min(33,a)),[h,i]=(0,c.useState)(!0),[k,n]=(0,c.useState)(0);return(0,c.useEffect)(()=>{if(!h)return;let b=0,c=performance.now(),e=f=>{let g=Math.min(1,(f-c)/5e3);n(g),g>=1?d(a>=33?0:a+1):b=requestAnimationFrame(e)};return b=requestAnimationFrame(e),()=>cancelAnimationFrame(b)},[h,a,d]),(0,c.useEffect)(()=>{let b=b=>{"ArrowRight"===b.key?d(g(a+1)):"ArrowLeft"===b.key?d(g(a-1)):" "===b.key&&(b.preventDefault(),i(a=>!a))};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[a,d]),(0,b.jsxs)("div",{className:"lbtour",children:[(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{srcSet:(0,m.avifSrc)(j(a)),type:"image/avif"}),(0,b.jsx)("img",{className:"lbtour-bloom",src:j(a),alt:"","aria-hidden":"true",draggable:!1})]},`b${a}`),(0,b.jsx)("div",{className:"lbtour-vignette","aria-hidden":"true"}),(0,b.jsxs)("button",{className:"lbtour-stage",onClick:()=>i(a=>!a),"aria-label":h?"Pause":"Play",children:[(0,b.jsx)("figure",{className:`lbtour-figure ${a%2?"kb-b":"kb-a"}`,children:(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{srcSet:(0,m.avifSrc)(j(a)),type:"image/avif"}),(0,b.jsx)("img",{className:"lbtour-img",src:j(a),alt:f?`Page ${a+1}`:`صفحة ${a+1}`,draggable:!1})]})},a),(0,b.jsx)("span",{className:`lbtour-play ${h?"is-playing":""}`,children:h?(0,b.jsx)(r,{}):(0,b.jsx)(q,{})})]}),(0,b.jsxs)("div",{className:"lbtour-hud",children:[(0,b.jsx)("button",{className:"lbz-btn","aria-label":"Previous",onClick:()=>d(g(a-1)),disabled:0===a,children:"‹"}),(0,b.jsxs)("div",{className:"lbtour-meta",children:[(0,b.jsx)("span",{className:"lbtour-chapter",children:l(a,e)}),(0,b.jsx)("div",{className:"lbtour-track",children:(0,b.jsx)("span",{className:"lbtour-fill",style:{width:`${100*k}%`}})}),(0,b.jsxs)("span",{className:"lbtour-count",children:[String(a+1).padStart(2,"0")," / ",34]})]}),(0,b.jsx)("button",{className:"lbz-btn","aria-label":"Next",onClick:()=>d(g(a+1)),disabled:33===a,children:"›"})]})]})}function q(){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:"22",height:"22",fill:"currentColor",children:(0,b.jsx)("path",{d:"M8 5v14l11-7z"})})}function r(){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:"22",height:"22",fill:"currentColor",children:(0,b.jsx)("path",{d:"M6 5h4v14H6zM14 5h4v14h-4z"})})}let s=["book","read","tour"],t=[{id:"book",en:"Book",ar:"كتاب",icon:(0,b.jsx)(function(){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.6",children:(0,b.jsx)("path",{d:"M12 5c-1.5-1-4-1.5-6.5-1.2C4.6 3.9 4 4.6 4 5.4v11.8c0 .9.8 1.6 1.7 1.5C8 18.5 10.6 19 12 20m0-15c1.5-1 4-1.5 6.5-1.2.9.1 1.5.8 1.5 1.6v11.8c0 .9-.8 1.6-1.7 1.5C16 18.5 13.4 19 12 20m0-15v15"})})},{})},{id:"read",en:"Read",ar:"قراءة",icon:(0,b.jsx)(function(){return(0,b.jsxs)("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.6",children:[(0,b.jsx)("circle",{cx:"11",cy:"11",r:"7"}),(0,b.jsx)("path",{d:"M11 8v6M8 11h6M20 20l-4-4"})]})},{})},{id:"tour",en:"Tour",ar:"جولة",icon:(0,b.jsx)(function(){return(0,b.jsxs)("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.6",children:[(0,b.jsx)("circle",{cx:"12",cy:"12",r:"9"}),(0,b.jsx)("path",{d:"M10 8.5l6 3.5-6 3.5z",fill:"currentColor",stroke:"none"})]})},{})}],u={book:["Drag or tap to turn the page","اسحب أو انقر لتقليب الصفحة"],read:["Scroll, pinch or double-tap to zoom · drag to pan","مرّر أو اقرص للتكبير · اسحب للتحريك"],tour:["Tap to play or pause","انقر للتشغيل أو الإيقاف"]},v={kicker:{en:"ARGOS · Interior Design by Evora",ar:"أرغوس · تصميم داخلي من إيفورا"},title:{en:"The Lookbook",ar:"الكتالوج"},lead:{en:"Thirty-one pages of bedrooms, dressing rooms, majlis and lounges — turn each leaf the way you would the real book.",ar:"واحدة وثلاثون صفحة من غرف النوم وغرف الملابس والمجالس والاستراحات — قلّب كل ورقة كأنك تتصفّح الكتاب على الطبيعة."},cta_kicker:{en:"From the showroom",ar:"من المعرض"},cta_title:{en:"See these rooms in person.",ar:"شاهد هذه الغرف على الطبيعة."},cta_lead:{en:"Visit us in Khalda, or send a quick message — we'll help you bring the book home.",ar:"زرنا في خلدا، أو راسلنا برسالة سريعة — نساعدك لتنقل الكتاب إلى بيتك."},cta_visit:{en:"Plan a visit",ar:"خطّط لزيارتك"},cta_wa:{en:"Message on WhatsApp",ar:"راسلنا على واتساب"},wa_text:{en:"Hi Evora — I just browsed the ARGOS lookbook and I'd love to know more.",ar:"مرحبًا إيفورا — تصفّحت كتالوج أرغوس وأودّ معرفة المزيد."}};function w(){let{lang:a,dir:d}=(0,g.useT)(),e="en"===a,k=b=>v[b][a],l=`${i.WHATSAPP}?text=${encodeURIComponent(v.wa_text[a])}`,[q,r]=(0,c.useState)("book"),[w,D]=(0,c.useState)(0),[E,F]=(0,c.useState)(!1),[G,H]=(0,c.useState)(!1),I=(0,c.useRef)(null),J=(0,c.useRef)(null),K=(0,c.useRef)(null),[L,M]=(0,c.useState)(!1),N=(0,c.useRef)(null);(0,c.useEffect)(()=>{try{M("1"===localStorage.getItem("evora_lb_muted"))}catch{}let a=new Audio("/sfx/page-turn.wav");return a.preload="auto",a.volume=.45,N.current=a,()=>{a.pause(),N.current=null}},[]);let O=(0,c.useCallback)(()=>{M(a=>{let b=!a;try{localStorage.setItem("evora_lb_muted",b?"1":"0")}catch{}return b})},[]),P=(0,c.useCallback)(a=>{let b=Math.max(0,Math.min(33,a));D(a=>{if(b!==a&&!L){let a=N.current;a&&(a.currentTime=0,a.play().catch(()=>{}))}return b})},[L]);return(0,c.useEffect)(()=>{let a=new URLSearchParams(window.location.search).get("view");a&&s.includes(a)&&r(a)},[]),(0,c.useEffect)(()=>{let a=window.matchMedia("(max-width: 860px)"),b=()=>H(a.matches);return b(),a.addEventListener("change",b),()=>a.removeEventListener("change",b)},[]),(0,c.useEffect)(()=>{let a=s.indexOf(q);K.current?.children[a]?.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},[q]),(0,c.useEffect)(()=>{let a=J.current,b=a?.children[w];b?.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},[w]),(0,c.useEffect)(()=>{let a=()=>F(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",a),()=>document.removeEventListener("fullscreenchange",a)},[]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(C,{}),(0,b.jsxs)("section",{className:"lb-intro",lang:a,dir:d,children:[(0,b.jsx)(h.Rise,{as:"p",className:"lb-intro__kicker",children:k("kicker")}),(0,b.jsx)(h.Rise,{as:"h1",delay:.06,className:"lb-intro__title display",children:k("title")}),(0,b.jsx)(h.Rise,{as:"p",delay:.12,className:"lb-intro__lead",children:k("lead")})]}),(0,b.jsxs)("div",{className:`lb ${E?"is-fs":""}`,ref:I,lang:a,dir:d,children:[(0,b.jsxs)("header",{className:"lb-bar",children:[(0,b.jsxs)("div",{className:"lb-brand",children:[(0,b.jsx)("span",{className:"lb-brand__name",children:"EVORA"}),(0,b.jsx)("span",{className:"lb-brand__sep"}),(0,b.jsx)("span",{className:"lb-brand__sub",children:e?"ARGOS Lookbook":"كتالوج أرغوس"})]}),(0,b.jsx)("div",{className:"lb-switch",role:"tablist","aria-label":e?"View mode":"نمط العرض",ref:K,children:t.map(a=>(0,b.jsxs)("button",{role:"tab","aria-selected":q===a.id,className:`lb-switch__btn ${q===a.id?"is-on":""}`,onClick:()=>r(a.id),children:[a.icon,(0,b.jsx)("span",{children:e?a.en:a.ar})]},a.id))}),(0,b.jsxs)("div",{className:"lb-tools",children:[(0,b.jsxs)("span",{className:"lb-counter",children:[String(w+1).padStart(2,"0"),(0,b.jsxs)("i",{children:["/",34]})]}),(0,b.jsx)("button",{className:"lb-icon",onClick:O,"aria-pressed":L,"aria-label":L?e?"Unmute page turns":"تشغيل صوت تقليب الصفحات":e?"Mute page turns":"كتم صوت تقليب الصفحات",title:L?e?"Sound off":"الصوت مغلق":e?"Sound on":"الصوت مفتوح",children:L?(0,b.jsx)(B,{}):(0,b.jsx)(A,{})}),(0,b.jsx)("button",{className:"lb-icon",onClick:()=>{let a=I.current;document.fullscreenElement?document.exitFullscreen?.():a?.requestFullscreen?.()},"aria-label":e?"Fullscreen":"ملء الشاشة",title:e?"Fullscreen":"ملء الشاشة",children:E?(0,b.jsx)(y,{}):(0,b.jsx)(x,{})}),(0,b.jsxs)("a",{className:"lb-dl",href:"/evora/Evora-ARGOS-Lookbook.pdf",download:"Evora-ARGOS-Lookbook.pdf",children:[(0,b.jsx)(z,{}),(0,b.jsx)("span",{children:e?"Download":"تنزيل"})]})]})]}),(0,b.jsxs)("main",{className:"lb-stage","data-mode":q,children:["book"===q&&(0,b.jsx)(n,{page:w,setPage:P,lang:a,dir:d,mono:G}),"read"===q&&(0,b.jsx)(o,{page:w,setPage:P,lang:a,dir:d}),"tour"===q&&(0,b.jsx)(p,{page:w,setPage:P,lang:a,dir:d}),(0,b.jsx)("span",{className:"lb-modehint",children:u[q][+!e]})]}),(0,b.jsx)("div",{className:"lb-film",ref:J,"aria-label":e?"All pages":"كل الصفحات",children:Array.from({length:34}).map((a,c)=>(0,b.jsxs)("button",{className:`lb-thumb ${c===w?"is-on":""}`,onClick:()=>P(c),"aria-label":e?`Go to page ${c+1}`:`اذهب إلى صفحة ${c+1}`,children:[(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{srcSet:(0,m.avifSrc)(j(c)),type:"image/avif"}),(0,b.jsx)("img",{src:j(c),alt:"",loading:"lazy",draggable:!1})]}),(0,b.jsx)("i",{children:c+1})]},c))})]}),(0,b.jsx)("section",{className:"lb-cta",lang:a,dir:d,children:(0,b.jsxs)(h.Rise,{className:"lb-cta__inner",children:[(0,b.jsxs)("div",{className:"lb-cta__copy",children:[(0,b.jsx)("span",{className:"lb-cta__kicker",children:k("cta_kicker")}),(0,b.jsx)("h2",{className:"lb-cta__title display",children:k("cta_title")}),(0,b.jsx)("p",{className:"lb-cta__lead",children:k("cta_lead")})]}),(0,b.jsxs)("div",{className:"lb-cta__actions",children:[(0,b.jsx)(h.Magnetic,{strength:.2,children:(0,b.jsx)(f.default,{href:"/visit",className:"lb-cta__btn lb-cta__btn--solid",children:k("cta_visit")})}),(0,b.jsx)(h.Magnetic,{strength:.2,children:(0,b.jsx)("a",{href:l,target:"_blank",rel:"noopener noreferrer",className:"lb-cta__btn lb-cta__btn--ghost",children:k("cta_wa")})})]})]})})]})}function x(){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"1.7",children:(0,b.jsx)("path",{d:"M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4"})})}function y(){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"1.7",children:(0,b.jsx)("path",{d:"M9 4v3a2 2 0 0 1-2 2H4M15 4v3a2 2 0 0 0 2 2h3M9 20v-3a2 2 0 0 0-2-2H4M15 20v-3a2 2 0 0 1 2-2h3"})})}function z(){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.7",children:(0,b.jsx)("path",{d:"M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"})})}function A(){return(0,b.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,b.jsx)("path",{d:"M11 5 6 9H3v6h3l5 4V5Z"}),(0,b.jsx)("path",{d:"M15.5 8.5a5 5 0 0 1 0 7"}),(0,b.jsx)("path",{d:"M18.5 5.5a9 9 0 0 1 0 13"})]})}function B(){return(0,b.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,b.jsx)("path",{d:"M11 5 6 9H3v6h3l5 4V5Z"}),(0,b.jsx)("path",{d:"m16 9 5 6M21 9l-5 6"})]})}function C(){return(0,b.jsx)("style",{children:`
    .lb { --bar: 60px; --film: 92px; --stageH: min(72svh, 760px);
      position: relative; min-height: 100svh; overflow-x: clip; color: var(--paper);
      background:
        radial-gradient(120% 80% at 50% -10%, rgba(197,160,106,0.12), transparent 55%),
        linear-gradient(180deg, #131210, #1b1916 55%, #100f0c);
      display: flex; flex-direction: column; padding-top: 0; }
    .lb.is-fs { padding-top: 0; }

    /* ---- intro band (light — seats the pinnedSolid Nav above the dark app) ---- */
    .lb-intro { background: var(--paper); color: var(--ink); text-align: center;
      padding: clamp(7rem,13vw,9.5rem) clamp(1.2rem,5vw,2rem) clamp(2.4rem,5vw,3.6rem);
      border-bottom: 1px solid var(--line); }
    .lb-intro__kicker { margin: 0; font-size: 0.72rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--clay); }
    html[dir="rtl"] .lb-intro__kicker { letter-spacing: 0.08em; }
    .lb-intro__title { margin: 0.8rem 0; font-size: clamp(2.4rem,6vw,4.2rem); line-height: 1.02; color: var(--ink); }
    .lb-intro__lead { margin: 0 auto; max-width: 48ch; font-size: clamp(1rem,2.2vw,1.16rem); line-height: 1.62; color: var(--ink-soft); }

    /* ---- "From the showroom" CTA strip (closes the page → /visit + WhatsApp) ---- */
    .lb-cta { background: var(--paper); color: var(--ink); border-top: 1px solid var(--line);
      padding: clamp(2.6rem,6vw,4.4rem) clamp(1.2rem,5vw,2rem); }
    .lb-cta__inner { max-width: 1080px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center;
      justify-content: space-between; gap: clamp(1.4rem,4vw,2.6rem); }
    .lb-cta__kicker { font-size: 0.7rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--clay); }
    html[dir="rtl"] .lb-cta__kicker { letter-spacing: 0.08em; }
    .lb-cta__title { margin: 0.6rem 0 0.5rem; font-size: clamp(1.7rem,3.6vw,2.6rem); line-height: 1.06; color: var(--ink); }
    .lb-cta__lead { margin: 0; max-width: 44ch; color: var(--ink-soft); line-height: 1.6; }
    .lb-cta__actions { display: flex; flex-wrap: wrap; gap: 0.8rem; }
    .lb-cta__btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
      padding: 0.95em 1.7em; border-radius: 100px; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.02em; white-space: nowrap;
      transition: background .3s var(--ease), color .3s var(--ease), border-color .3s var(--ease); }
    .lb-cta__btn--solid { background: var(--ink); color: var(--paper); }
    .lb-cta__btn--solid:hover { background: var(--clay); }
    .lb-cta__btn--ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
    .lb-cta__btn--ghost:hover { border-color: var(--ink); background: rgba(22,21,15,0.04); }
    @media (max-width: 560px) { .lb-cta__actions { width: 100%; } .lb-cta__btn { flex: 1 1 auto; } }

    /* ---- app bar ---- */
    .lb-bar { position: sticky; top: 0; z-index: 30; height: var(--bar);
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
      gap: 0.5rem; padding: 0 clamp(0.9rem, 3vw, 2rem);
      background: rgba(16,15,12,0.66); backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(251,247,240,0.08); }
    .lb-brand { display:flex; align-items:center; gap:0.6rem; min-width:0; }
    .lb-brand__name { font-family: var(--f-display); letter-spacing:0.22em; text-indent:0.22em; font-size:0.96rem; }
    .lb-brand__sep { width:1px; height:14px; background: rgba(197,160,106,0.5); }
    .lb-brand__sub { font-size:0.64rem; letter-spacing:0.22em; text-transform:uppercase; color: var(--brass-2); white-space:nowrap; }
    html[dir="rtl"] .lb-brand__sub { letter-spacing:0.06em; }

    .lb-switch { display:flex; gap:3px; padding:4px; border-radius:100px; justify-self:center;
      max-width: min(64vw, 760px); overflow-x:auto; scrollbar-width:none; flex-wrap:nowrap;
      background: rgba(251,247,240,0.06); border:1px solid rgba(251,247,240,0.1); }
    .lb-switch::-webkit-scrollbar { display:none; }
    .lb-switch__btn { flex:0 0 auto; display:flex; align-items:center; gap:0.4rem; cursor:pointer;
      padding:0.42em 0.9em; border-radius:100px; font-size:0.74rem; letter-spacing:0.04em;
      color: rgba(251,247,240,0.66); background: transparent; transition: color .25s, background .25s; }
    .lb-switch__btn svg { opacity:0.85; }
    .lb-switch__btn:hover { color: var(--paper); }
    .lb-switch__btn.is-on { background: var(--brass-2); color:#191712; font-weight:600; }
    .lb-switch__btn.is-on svg { opacity:1; }

    .lb-tools { display:flex; align-items:center; gap:0.6rem; justify-self:end; }
    .lb-counter { font-size:0.82rem; letter-spacing:0.08em; font-variant-numeric: tabular-nums; }
    .lb-counter i { color: rgba(251,247,240,0.5); font-style:normal; }
    .lb-icon { width:34px; height:34px; display:grid; place-items:center; border-radius:50%; cursor:pointer;
      color: var(--paper); background: rgba(251,247,240,0.07); border:1px solid rgba(251,247,240,0.14); transition: background .25s; }
    .lb-icon:hover { background: rgba(251,247,240,0.16); }
    .lb-dl { display:flex; align-items:center; gap:0.4rem; padding:0.5em 0.9em; border-radius:100px;
      font-size:0.76rem; letter-spacing:0.04em; background: var(--paper); color:#191712; font-weight:600; transition: background .25s; }
    .lb-dl:hover { background: var(--brass-2); }

    /* ---- stage ---- */
    .lb-stage { position: relative; height: var(--stageH); margin-top: clamp(0.6rem,2vw,1.4rem);
      display: flex; align-items: center; justify-content: center; }
    .lb.is-fs .lb-stage { height: calc(100svh - var(--bar) - var(--film)); }
    .lb-modehint { position:absolute; bottom: 0.3rem; left:50%; transform:translateX(-50%);
      font-size:0.64rem; letter-spacing:0.2em; text-transform:uppercase; color: rgba(251,247,240,0.36); pointer-events:none; }

    /* ===== v1 BOOK ===== */
    .lbk { width:100%; height:100%; display:flex; align-items:center; justify-content:center; gap: clamp(0.4rem,2vw,1.6rem); }
    .lbk-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; background:#fff; -webkit-user-drag:none; user-select:none; }
    .lbk-blank { position:absolute; inset:0; background: var(--paper-2); }
    .lbk-book { position: relative; width: min(82vw, 1080px, calc((var(--stageH) - 2rem) * 2)); aspect-ratio: 2 / 1;
      perspective: 3000px; transform-style: preserve-3d; cursor: grab; touch-action: pan-y;
      transition: transform .9s cubic-bezier(.22,1,.36,1); }
    .lbk-book.is-dragging { cursor: grabbing; }
    .lbk-book.is-closed { transform: translateX(-25%); }
    .lbk-book.is-end { transform: translateX(25%); }
    html[dir="rtl"] .lbk-book.is-closed { transform: translateX(25%); }
    html[dir="rtl"] .lbk-book.is-end { transform: translateX(-25%); }
    /* mono (mobile): one larger, rounded square page per leaf */
    .lbk-book.is-mono { width: min(86vmin, calc(var(--stageH) - 1rem)); aspect-ratio: 1 / 1; }
    .lbk-book.is-mono .lbk-leaf { left:0; width:100%; transform-origin:left center; }
    html[dir="rtl"] .lbk-book.is-mono .lbk-leaf { left:auto; right:0; transform-origin:right center; }
    .lbk-book.is-mono .lbk-face { border-radius:12px; box-shadow: 0 26px 56px -34px rgba(0,0,0,.7); }
    .lbk-spine { position:absolute; top:0; bottom:0; left:50%; width:46px; transform:translateX(-23px);
      background: linear-gradient(90deg, transparent, rgba(0,0,0,.07) 44%, rgba(0,0,0,.11) 50%, rgba(0,0,0,.07) 56%, transparent);
      z-index:9999; pointer-events:none; }
    .lbk-floor { position:absolute; left:11%; right:11%; bottom:-5%; height:9%; z-index:0; pointer-events:none;
      background: radial-gradient(50% 100% at 50% 0%, rgba(0,0,0,.42), transparent 70%); filter: blur(24px); }
    .lbk-leaf { position:absolute; top:0; left:50%; width:50%; height:100%; transform-origin:left center;
      transform-style:preserve-3d; transition: transform .95s cubic-bezier(.62,.04,.3,1); }
    html[dir="rtl"] .lbk-leaf { left:auto; right:50%; transform-origin:right center; }
    .lbk-leaf.is-flipped { transform: rotateY(-180deg); }
    html[dir="rtl"] .lbk-leaf.is-flipped { transform: rotateY(180deg); }
    .lbk-leaf.is-live { transition:none; will-change:transform; }
    .lbk-face { position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
      overflow:hidden; background: var(--paper); box-shadow: 0 24px 50px -38px rgba(0,0,0,.6); }
    .lbk-face--back { transform: rotateY(180deg); }
    .lbk-sheet { position:absolute; inset:0; }
    .lbk-shade { position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity .9s ease; z-index:5; }
    .lbk-shade--front { background: linear-gradient(90deg, rgba(0,0,0,.12), transparent 11%); }
    html[dir="rtl"] .lbk-shade--front { background: linear-gradient(270deg, rgba(0,0,0,.12), transparent 11%); }
    .lbk-shade--back { background: linear-gradient(270deg, rgba(0,0,0,.1), transparent 11%); }
    html[dir="rtl"] .lbk-shade--back { background: linear-gradient(90deg, rgba(0,0,0,.1), transparent 11%); }
    .lbk-leaf:not(.is-flipped) .lbk-shade--front { opacity:1; }
    .lbk-leaf.is-live .lbk-shade { transition:none; }
    .lbk-leaf.is-live .lbk-shade--front { opacity: calc(0.12 + 0.45 * var(--cp,0)); }
    .lbk-leaf.is-live .lbk-shade--back { opacity: calc(0.4 * var(--cp,0)); }
    .lbk-nav { flex:none; width:44px; height:44px; border-radius:50%; cursor:pointer; font-size:1.35rem; line-height:1;
      display:grid; place-items:center; color:rgba(251,247,240,0.78); background:transparent;
      border:1px solid rgba(251,247,240,0.16); transition: background .3s, transform .3s, opacity .3s, border-color .3s, color .3s; }
    .lbk-nav:hover:not(:disabled) { background:rgba(251,247,240,0.1); border-color:rgba(251,247,240,0.36); color:var(--paper); transform:scale(1.06); }
    .lbk-nav:disabled { opacity:0.18; cursor:default; }
    html[dir="rtl"] .lbk-nav { transform: scaleX(-1); }
    html[dir="rtl"] .lbk-nav:hover:not(:disabled) { transform: scaleX(-1) scale(1.08); }

    /* ===== READ (zoom inspector) ===== */
    .lbz { width:100%; height:100%; position:relative; display:flex; align-items:center; justify-content:center; }
    .lbz-frame { position:relative; width:min(72svh, 88%); aspect-ratio:1/1; overflow:hidden; border-radius:8px;
      background:#fff; box-shadow:0 40px 80px -42px rgba(0,0,0,.85); touch-action:none; cursor:zoom-in; }
    .lbz-frame.is-zoomed { cursor:grab; }
    .lbz-frame.is-zoomed:active { cursor:grabbing; }
    .lbz-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transform-origin:center center; -webkit-user-drag:none; }
    .lbz-tools { position:absolute; bottom:clamp(0.6rem,3vw,1.5rem); left:50%; transform:translateX(-50%); z-index:5;
      display:flex; align-items:center; gap:0.5rem; padding:0.35rem 0.5rem; border-radius:100px;
      background:rgba(16,15,12,0.6); backdrop-filter:blur(10px); border:1px solid rgba(251,247,240,0.12); }
    .lbz-btn { width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:1.2rem; line-height:1; color:rgba(251,247,240,0.85);
      background:transparent; border:1px solid rgba(251,247,240,0.16); display:grid; place-items:center; transition:background .25s,border-color .25s,color .25s; }
    .lbz-btn:hover:not(:disabled) { background:rgba(251,247,240,0.12); border-color:rgba(251,247,240,0.36); color:var(--paper); }
    .lbz-btn:disabled { opacity:0.25; cursor:default; }
    .lbz-level { min-width:46px; text-align:center; font-size:0.74rem; color:rgba(251,247,240,0.8); font-variant-numeric:tabular-nums; }
    .lbz-cap { position:absolute; top:clamp(0.4rem,2vw,1rem); left:50%; transform:translateX(-50%); z-index:5;
      font-size:0.64rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--brass-2); white-space:nowrap; }

    /* ===== TOUR (guided autoplay) ===== */
    .lbtour { width:100%; height:100%; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; }
    .lbtour-bloom { position:absolute; inset:-12%; width:124%; height:124%; object-fit:cover; filter:blur(64px) saturate(1.25);
      opacity:0.4; z-index:0; animation:lbFade .9s ease; }
    .lbtour-vignette { position:absolute; inset:0; z-index:1; pointer-events:none;
      background: radial-gradient(58% 60% at 50% 46%, transparent, rgba(8,7,5,0.82)); }
    .lbtour-stage { position:relative; z-index:2; padding:0; border:none; background:transparent; cursor:pointer;
      width:min(66svh, 86%); aspect-ratio:1/1; }
    .lbtour-figure { width:100%; height:100%; aspect-ratio:1/1; border-radius:8px; overflow:hidden; margin:0;
      box-shadow:0 50px 100px -42px rgba(0,0,0,.95); }
    .lbtour-img { width:100%; height:100%; object-fit:cover; transform-origin:center; }
    .lbtour-figure.kb-a .lbtour-img { animation: kbA 7s ease-out both; }
    .lbtour-figure.kb-b .lbtour-img { animation: kbB 7s ease-out both; }
    @keyframes kbA { from { transform:scale(1.02) translate(0,0) } to { transform:scale(1.13) translate(-2%,-2%) } }
    @keyframes kbB { from { transform:scale(1.02) translate(0,0) } to { transform:scale(1.13) translate(2%,2%) } }
    .lbtour-play { position:absolute; inset:0; display:grid; place-items:center; z-index:3; pointer-events:none; }
    .lbtour-play span, .lbtour-play svg { color:var(--paper); }
    .lbtour-play { color:var(--paper); }
    .lbtour-play > svg { width:60px; height:60px; padding:18px; border-radius:50%; background:rgba(16,15,12,0.55); backdrop-filter:blur(6px);
      opacity:1; transition:opacity .4s ease; }
    .lbtour-play.is-playing > svg { opacity:0; }
    .lbtour-stage:hover .lbtour-play.is-playing > svg { opacity:0.85; }
    .lbtour-hud { position:absolute; z-index:4; left:0; right:0; bottom:clamp(0.6rem,3vw,1.6rem);
      display:flex; align-items:center; gap:clamp(0.5rem,2vw,1.2rem); padding:0 clamp(1rem,5vw,3rem); }
    .lbtour-meta { flex:1; display:flex; align-items:center; gap:clamp(0.6rem,2vw,1.2rem); }
    .lbtour-chapter { font-family:var(--f-display); font-size:clamp(0.95rem,2vw,1.4rem); white-space:nowrap; }
    .lbtour-track { flex:1; height:2px; background:rgba(251,247,240,0.2); border-radius:2px; overflow:hidden; }
    .lbtour-fill { display:block; height:100%; background:var(--brass-2); }
    .lbtour-count { font-size:0.72rem; color:rgba(251,247,240,0.72); font-variant-numeric:tabular-nums; white-space:nowrap; }
    @keyframes lbFade { from { opacity:0 } to { opacity:1 } }

    /* ---- filmstrip ---- */
    .lb-film { height: var(--film); display:flex; gap:8px; align-items:center; overflow-x:auto; scrollbar-width:none;
      padding: 0.7rem clamp(0.9rem,4vw,2.5rem); border-top:1px solid rgba(251,247,240,0.08);
      background: rgba(16,15,12,0.5); scroll-snap-type:x proximity; }
    .lb-film::-webkit-scrollbar { display:none; }
    .lb-thumb { position:relative; flex:0 0 auto; width:62px; height:62px; border-radius:4px; overflow:hidden; cursor:pointer;
      border:1px solid rgba(251,247,240,0.12); opacity:0.5; transition: opacity .25s, transform .25s, border-color .25s; scroll-snap-align:center; padding:0; background:#fff; }
    .lb-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
    .lb-thumb i { position:absolute; bottom:2px; right:3px; font-style:normal; font-size:0.58rem; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,.8); }
    .lb-thumb:hover { opacity:0.85; }
    .lb-thumb.is-on { opacity:1; border-color: var(--brass-2); transform: translateY(-2px); box-shadow:0 8px 18px -10px rgba(0,0,0,.8); }

    /* ---- responsive ---- */
    @media (max-width: 860px) {
      .lb { --bar: 54px; --film: 74px; --stageH: 62svh; }
      .lb-bar { grid-template-columns: auto 1fr auto; gap:0.4rem; }
      .lb-brand__sub { display:none; }
      .lb-switch__btn span { display:none; }
      .lb-switch__btn { padding:0.5em 0.7em; }
      .lb-dl span { display:none; }
      .lb-dl { padding:0.5em; border-radius:50%; }
      .lb-counter { display:none; }
      .lbk > .lbk-nav { display:none; }
      .lb-thumb { width:50px; height:50px; }
    }

    /* phone: ≥44px touch targets for every reachable control */
    @media (max-width: 560px) {
      .lb { --bar: 60px; }
      .lb-icon { width:44px; height:44px; }
      .lb-dl { width:44px; height:44px; padding:0; justify-content:center; border-radius:50%; }
      .lb-switch { padding:5px; }
      .lb-switch__btn { min-height:44px; padding:0 0.85em; }
      .lbz-tools { padding:0.4rem 0.55rem; gap:0.4rem; }
      .lbz-btn { width:44px; height:44px; font-size:1.3rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .lbk-leaf, .lbk-book, .lbk-shade { transition:none; }
      .lbtour-img { animation:none; }
    }
    `})}let D="/evora/catalog.pdf",E={eyebrow:{en:"ARGOS · Interior Design by Evora",ar:"أرغوس · تصميم داخلي من إيفورا"},title:{en:"The Lookbook",ar:"الكتالوج"},lead:{en:"Thirty-one pages of finished Evora interiors — bedrooms, dressing rooms, majlis, dining and lounges.",ar:"إحدى وثلاثون صفحة من مساحات إيفورا المكتملة — غرف نوم، غرف ملابس، مجالس، طعام وجلسات."},open:{en:"Open the lookbook",ar:"افتح الكتالوج"},download:{en:"Download PDF",ar:"حمّل الملف"},note:{en:"PDF · 31 pages · 10.5 MB",ar:"PDF · ٣١ صفحة · ١٠٫٥ ميغابايت"}};a.s(["default",0,function(){let{lang:a}=(0,g.useT)(),f=b=>E[b][a],[h,i]=(0,c.useState)(!1),[j,k]=(0,c.useState)(!1);return(0,c.useEffect)(()=>{let a=window.matchMedia("(min-width: 901px)"),b=()=>k(a.matches);return b(),i(!0),a.addEventListener("change",b),()=>a.removeEventListener("change",b)},[]),(0,b.jsxs)("main",{children:[(0,b.jsx)(d.default,{pinnedSolid:!0}),h&&j?(0,b.jsx)(w,{}):(0,b.jsx)("section",{className:"lb","aria-busy":!h,children:(0,b.jsxs)("div",{className:"container lb__head",children:[(0,b.jsx)("span",{className:"eyebrow lb__eyebrow",children:f("eyebrow")}),(0,b.jsx)("h1",{className:"display lb__h",children:f("title")}),(0,b.jsx)("p",{className:"lb__lead",children:f("lead")}),h&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{className:"lb__actions",children:[(0,b.jsxs)("a",{className:"btn btn-solid lb__open",href:D,target:"_blank",rel:"noopener noreferrer",children:[f("open")," ",(0,b.jsx)("span",{className:"arrow",children:"→"})]}),(0,b.jsxs)("a",{className:"lb__dl",href:D,download:!0,children:[f("download")," ",(0,b.jsx)("span",{"aria-hidden":!0,children:"↓"})]})]}),(0,b.jsx)("p",{className:"lb__note",children:f("note")})]})]})}),(!h||!j)&&(0,b.jsx)(e.default,{}),(0,b.jsx)("style",{children:`
        .lb { background: var(--paper); padding-block: clamp(6.5rem, 12vh, 9rem) clamp(3rem, 7vw, 5rem); min-height: 60svh; }
        .lb__head { max-width: 70ch; text-align: start; }
        .lb__eyebrow { color: var(--brass); display: block; }
        .lb__h { font-size: clamp(2.4rem, 6vw, 4.6rem); line-height: 1.02; margin: 0.7rem 0 0; color: var(--ink); }
        .lb__lead { color: var(--ink-soft); font-size: clamp(1rem, 1.3vw, 1.15rem); line-height: 1.65; margin: 1.1rem 0 0; max-width: 60ch; }
        .lb__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 2rem; }
        .lb__open { width: 100%; justify-content: center; }
        .lb__dl {
          display: inline-flex; align-items: center; gap: 0.5em;
          font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--ink); border-bottom: 1px solid var(--brass); padding-bottom: 0.3em;
        }
        .lb__note { color: var(--ink-faint); font-size: 0.78rem; margin: 0.9rem 0 0; letter-spacing: 0.04em; }
        @media (min-width: 560px) { .lb__open { width: fit-content; } }
      `})]})}],780218)}];

//# sourceMappingURL=app_%28site%29_catalog_page_tsx_13n6pj0._.js.map