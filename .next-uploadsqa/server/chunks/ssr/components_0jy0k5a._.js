module.exports=[688420,a=>{"use strict";var b=a.i(187924),c=a.i(572131);let d=(a,b,c,d)=>{let e=document.querySelector(b),f=e?.querySelector("video"),{prog:g,geom:h}=((a,b)=>{let c=document.querySelector(a);if(!c)return{prog:"no-section",geom:"-"};let d=document.querySelector(b),e=d&&d.getBoundingClientRect().height>0?d.getBoundingClientRect().height:window.innerHeight,f=c.getBoundingClientRect(),g=c.offsetHeight-e;return{prog:(g>0?Math.min(1,Math.max(0,-f.top/g)):0).toFixed(3),geom:`top=${Math.round(f.top)} secH=${c.offsetHeight} vh=${Math.round(e)} scrollable=${Math.round(g)}`}})(c,d),i=e?getComputedStyle(e).opacity:"-";if(!f)return{label:a,exists:!1,src:"-",readyState:-1,networkState:-1,errorCode:null,duration:"-",currentTime:"-",buffered:"-",paused:!0,seeking:!1,painted:!!e?.classList.contains("is-painted"),size:"-",prog:g,geom:h,opacity:i,prime:"-"};let j="none";try{let a=f.buffered;a.length&&(j=`${a.length} range(s) 0..${a.end(a.length-1).toFixed(1)}s`)}catch{}return{label:a,exists:!0,src:(f.currentSrc||f.src||"-").replace(/^https?:\/\/[^/]+/,"").slice(0,42),readyState:f.readyState,networkState:f.networkState,errorCode:f.error?f.error.code:null,duration:Number.isFinite(f.duration)?f.duration.toFixed(2):String(f.duration),currentTime:f.currentTime.toFixed(2),buffered:j,paused:f.paused,seeking:f.seeking,painted:!!e?.classList.contains("is-painted"),size:`${f.videoWidth}x${f.videoHeight}`,prog:g,geom:h,opacity:i,prime:f.dataset.prime||"not-attempted"}};a.s(["default",0,function(){let[a,e]=(0,c.useState)(!1),[f,g]=(0,c.useState)([]),[h,i]=(0,c.useState)("");return((0,c.useEffect)(()=>{if(!new URLSearchParams(window.location.search).has("vdebug"))return;e(!0),i(navigator.userAgent.slice(0,80));let a=()=>g([d("HERO",".hs__stage",".hs",".hs__sticky"),d("KITCHEN",".cfg__stage",".cfg",".cfg__sticky")]);a();let b=window.setInterval(a,400);return()=>window.clearInterval(b)},[]),a)?(0,b.jsxs)("div",{style:{position:"fixed",left:0,right:0,bottom:0,zIndex:0x7fffffff,background:"rgba(0,0,0,0.88)",color:"#0f0",font:"10px/1.35 ui-monospace,Menlo,monospace",padding:"8px 10px",maxHeight:"48vh",overflow:"auto",pointerEvents:"none",WebkitUserSelect:"text",userSelect:"text"},children:[(0,b.jsx)("div",{style:{color:"#ff0"},children:h}),(0,b.jsxs)("div",{style:{color:"#ff0"},children:["dpr=","?"," vp=","?"]}),f.map(a=>(0,b.jsxs)("div",{style:{marginTop:6,borderTop:"1px solid #333",paddingTop:4},children:[(0,b.jsx)("b",{style:{color:"#fff"},children:a.label})," exists=",String(a.exists)," painted=",String(a.painted),(0,b.jsx)("br",{}),(0,b.jsxs)("span",{style:{color:"#0ff"},children:["scrollProg=",a.prog," videoFrac=","-"!==a.duration&&Number(a.duration)>0?(Number(a.currentTime)/Number(a.duration)).toFixed(3):"-"]}),(0,b.jsx)("br",{}),(0,b.jsxs)("span",{style:{color:"#f90"},children:["prime=",a.prime," stageOpacity=",a.opacity]}),(0,b.jsx)("br",{}),a.geom,(0,b.jsx)("br",{}),"src=",a.src,(0,b.jsx)("br",{}),"readyState=",a.readyState," networkState=",a.networkState," err=",String(a.errorCode),(0,b.jsx)("br",{}),"dur=",a.duration," t=",a.currentTime," size=",a.size,(0,b.jsx)("br",{}),"paused=",String(a.paused)," seeking=",String(a.seeking),(0,b.jsx)("br",{}),"buffered=",a.buffered]},a.label))]}):null}])},844931,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(346271),e=a.i(621216),f=a.i(635577),g=a.i(936059),h=a.i(485370),i=a.i(679016),j=a.i(478033);let k={a:193,b:193,c:361},l=(a,b,c,d,e)=>{let f=Math.floor((a-1)/b)+1;return{total:f,critical:Math.min(c,f),src:c=>`${d}/frame_${String(Math.min(a,1+(c-1)*b)).padStart(4,"0")}.${e}`}};function m(a,b=i.SAFE_FRAME_EXT){return l(k[a],2,12,`/evora/hero-frames-${a}`,b)}function n({t:a,lang:c,ease:e,staticMode:f=!1}){let h=f?{hidden:{y:"0%"},show:()=>({y:"0%",transition:{duration:0}})}:{hidden:{y:"115%"},show:a=>({y:"0%",transition:{duration:1.25,ease:e,delay:.25+.13*a}})},i=a=>f?{initial:{opacity:1,y:0},animate:{opacity:1,y:0},transition:{duration:0}}:{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:1,ease:e,delay:a}},j=[a("hero_l1"),a("hero_l2"),a("hero_l3")];return(0,b.jsxs)("div",{className:"hero__content hs__content",children:[(0,b.jsx)(d.motion.span,{...i(.2),className:"eyebrow",style:{color:"var(--brass-2)",display:"block"},children:a("hero_eyebrow")}),(0,b.jsx)("h1",{className:"display hero__title","aria-label":j.join(" "),children:j.map((a,c)=>(0,b.jsxs)("span",{style:{display:"block",overflow:"hidden",paddingBottom:"0.06em"},children:[(0,b.jsx)(d.motion.span,{variants:h,custom:c,initial:"hidden",animate:"show",style:{display:"inline-block"},children:1===c?(0,b.jsx)("span",{className:"serif-i",style:{color:"var(--brass-2)"},children:a}):a}),c<j.length-1?" ":""]},c))}),(0,b.jsx)(d.motion.p,{...i(.85),className:"hero__sub",children:a("hero_sub")}),(0,b.jsxs)(d.motion.div,{...i(1),className:"hero__cta",children:[(0,b.jsxs)("a",{href:"/shop",className:"btn hero__cta-1",children:[a("hero_cta1")," ",(0,b.jsx)("span",{className:"arrow",children:"→"})]}),(0,b.jsx)("a",{href:"/showroom",className:"btn hero__cta-2",children:a("hero_cta2")})]}),(0,b.jsxs)(d.motion.div,{...i(1.15),className:"hero__meta",children:[(0,b.jsxs)("span",{children:[g.FOLLOWERS,"+ ","en"===c?"following":"متابع"]}),(0,b.jsx)("span",{className:"hero__dot"}),(0,b.jsx)("span",{children:"en"===c?"Khalda · Amman":"خلدا · عمّان"}),(0,b.jsx)("span",{className:"hero__dot"}),(0,b.jsx)("span",{children:"en"===c?"Made in Jordan":"صُنع في الأردن"})]})]})}let o=`
  /* section height drives the scrub length — set by CSS per breakpoint so the
     phone gets the portrait scrub length without any JS/hydration branch */
  /* section height drives the scrub length — set by CSS per breakpoint so the
     phone gets the portrait scrub length without any JS/hydration branch */
  .hs { position: relative; background: #0d0b09; height: 600vh; }
  @media (max-width: 768px) { .hs { height: 420svh; } }
  .hs--static { height: 100svh; min-height: 100svh; overflow: hidden; display: flex; align-items: center; }

  .hs__sticky { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
  /* The stage holds the scrub video. It only fades in once a real frame has
     painted (.is-painted) — not merely when metadata arrived — so the poster
     underneath is never swapped out for a blank iOS video surface. */
  .hs__stage { position: absolute; inset: 0; z-index: 1; opacity: 0; transition: opacity .35s ease; }
  .hs__stage.is-painted { opacity: 1; }
  .hs__canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .hs__poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
  /* CSS decides which poster aspect is shown — both are in the DOM for SSR safety */
  .hs__poster--m { display: none; }
  @media (max-width: 768px) {
    .hs__poster--d { display: none; }
    .hs__poster--m { display: block; }
  }

  .hs__scrim, .hero__scrim { position: absolute; inset: 0; z-index: 2; pointer-events: none; background:
      linear-gradient(105deg, rgba(13,11,9,0.92) 0%, rgba(13,11,9,0.62) 32%, rgba(13,11,9,0.18) 64%, rgba(13,11,9,0.05) 100%),
      radial-gradient(120% 80% at 50% 120%, rgba(8,6,4,0.6), transparent 60%); }
  .hero__top { position: absolute; inset-inline: 0; top: 0; height: 200px; z-index: 2; pointer-events: none; background: linear-gradient(rgba(8,6,4,0.6), transparent); }

  /* film "c": keep the clean bright footage — lighter scrim, readability carried
     by a localized gradient behind the copy + stronger text shadows */
  .hs--c .hs__scrim { background:
      linear-gradient(100deg, rgba(13,11,9,0.44) 0%, rgba(13,11,9,0.20) 24%, rgba(13,11,9,0.03) 48%, rgba(13,11,9,0) 66%),
      linear-gradient(0deg, rgba(8,6,4,0.26) 0%, rgba(8,6,4,0) 26%); }
  .hs--c .hero__top { height: 130px; background: linear-gradient(rgba(8,6,4,0.28), transparent); }
  .hs__left { position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background: linear-gradient(90deg, rgba(8,6,4,0.6) 0%, rgba(8,6,4,0.3) 14%, rgba(8,6,4,0) 34%); }

  /* RTL: the copy moves to the right, so the readability scrim must darken the
     RIGHT instead of the left. Mirror each gradient's angle horizontally
     (Xdeg -> 360-Xdeg). Without this the Arabic copy sits over the bright side
     of the film. */
  html[dir="rtl"] .hs__scrim, html[dir="rtl"] .hero__scrim { background:
      linear-gradient(255deg, rgba(13,11,9,0.92) 0%, rgba(13,11,9,0.62) 32%, rgba(13,11,9,0.18) 64%, rgba(13,11,9,0.05) 100%),
      radial-gradient(120% 80% at 50% 120%, rgba(8,6,4,0.6), transparent 60%); }
  html[dir="rtl"] .hs--c .hs__scrim { background:
      linear-gradient(260deg, rgba(13,11,9,0.44) 0%, rgba(13,11,9,0.20) 24%, rgba(13,11,9,0.03) 48%, rgba(13,11,9,0) 66%),
      linear-gradient(0deg, rgba(8,6,4,0.26) 0%, rgba(8,6,4,0) 26%); }
  html[dir="rtl"] .hs__left { background: linear-gradient(270deg, rgba(8,6,4,0.6) 0%, rgba(8,6,4,0.3) 14%, rgba(8,6,4,0) 34%); }
  .hs--c .hero__title { text-shadow: 0 2px 22px rgba(8,6,4,0.7), 0 1px 4px rgba(8,6,4,0.45); }
  .hs--c .hero__sub { text-shadow: 0 1px 16px rgba(8,6,4,0.7), 0 1px 3px rgba(8,6,4,0.5); }
  .hs--c .hero__meta { color: rgba(251,247,240,0.85); text-shadow: 0 1px 8px rgba(8,6,4,0.6); }

  .hs__copy { position: absolute; inset: 0; z-index: 3; display: flex; align-items: center; will-change: transform, opacity; }
  .hs--static .hero__content { position: relative; z-index: 3; }
  /* Bottom padding must clear the vertical SCROLL indicator pinned at
     bottom:1.8rem — at the old clamp(3rem,8vh,5rem) the meta line ("103K+
     following \xb7 Khalda \xb7 Amman") ran straight through it, in both LTR and RTL. */
  .hero__content, .hs__content { width: 100%; max-width: 1480px; margin-inline: auto; padding-inline: var(--gut); padding-block: clamp(8rem, 14vh, 11rem) clamp(4rem, 9vh, 6rem); }
  /* Headline: bigger and tighter than the old 7rem/400. The film behind it is
     busy, so the type has to hold its own — heavier weight, negative tracking
     and a sub-1 line-height stack the three lines into one solid block. */
  /* Sized against the viewport's HEIGHT as well as its width. The copy block is
     vertically centred in the sticky pane, so a width-only clamp overflowed a
     short laptop window — pushing the eyebrow up under the fixed nav and
     cutting the meta line off the bottom. min(vw, vh) keeps the three lines,
     the sub, the buttons and the meta row inside the pane at any aspect. */
  .hero__title { color: var(--paper); font-size: clamp(2.9rem, min(8.4vw, 10.4vh), 7.4rem); line-height: 0.92; margin: 1.4rem 0 0; font-weight: 500; letter-spacing: -0.042em; max-width: 13ch;
    text-shadow: 0 2px 30px rgba(8,6,4,0.45), 0 1px 3px rgba(8,6,4,0.35); }
  /* The one accent word carries the contrast: lighter, italic, brass. */
  .hero__title .serif-i { font-weight: 400; letter-spacing: -0.022em; }
  .hero__sub { color: rgba(251,247,240,0.9); font-size: clamp(1rem, min(1.4vw, 2.2vh), 1.32rem); line-height: 1.55; max-width: 44ch; margin: clamp(1.1rem, 2.4vh, 1.9rem) 0 0; font-weight: 300; letter-spacing: -0.004em; text-shadow: 0 1px 20px rgba(8,6,4,0.5); }
  .hero__cta { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: clamp(1.4rem, 3.2vh, 2.4rem); }
  /* Buttons sized up to sit under a much larger headline without looking like
     leftovers, and given a real hover lift. */
  .hero__cta-1, .hero__cta-2 { padding: 1.05em 2.1em; font-size: 0.9rem; font-weight: 500; letter-spacing: 0.01em;
    transition: background .45s var(--ease), border-color .45s var(--ease), color .45s var(--ease), transform .45s var(--ease); }
  .hero__cta-1 { background: var(--paper); color: var(--ink); box-shadow: 0 14px 40px -18px rgba(0,0,0,0.7); }
  .hero__cta-1:hover { background: var(--brass-2); color: var(--ink); transform: translateY(-3px); }
  .hero__cta-2 { border: 1px solid rgba(251,247,240,0.45); color: var(--paper); backdrop-filter: blur(6px); background: rgba(251,247,240,0.04); }
  .hero__cta-2:hover { background: rgba(251,247,240,0.14); border-color: var(--paper); transform: translateY(-3px); }
  @media (max-width: 768px) {
    .hero__title { max-width: 11ch; letter-spacing: -0.038em; }
    .hero__cta { gap: 0.6rem; }
    .hero__cta-1, .hero__cta-2 { padding: 1em 1.6em; }
  }
  .hero__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 0.85rem; margin-top: clamp(1.5rem, 3.4vh, 2.6rem); color: rgba(251,247,240,0.72); font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; }
  .hero__dot { width: 4px; height: 4px; border-radius: 50%; background: var(--brass-2); }

  .hs__tag { position: absolute; bottom: 1.7rem; inset-inline-end: clamp(1.25rem, 5vw, 6rem); z-index: 4; display: inline-flex; align-items: center; gap: 0.7rem; background: rgba(251,247,240,0.92); backdrop-filter: blur(8px); color: var(--ink); padding: 0.6rem 1rem 0.6rem 0.7rem; border-radius: 100px; font-size: 0.84rem; font-family: var(--font-display); }
  .hs__tag-k { background: #0d0b09; color: var(--paper); font-family: var(--font-sans); font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.3em 0.7em; border-radius: 100px; }
  /* Bottom-CENTRE, not bottom-start. Pinned to the inline-start gutter it sat
     in the same column as the hero copy and ran through the meta line
     ("103K+ following \xb7 Khalda \xb7 Amman") — in LTR and RTL, and at some viewport
     heights no amount of bottom padding cleared it. Centre is free (the "Now
     showing" tag holds bottom-end) and is direction-neutral, so it needs no RTL
     variant. */

  @media (max-width: 860px) {
    .hs__content { padding-block: clamp(7rem, 18vh, 9rem) clamp(4rem, 12vh, 6rem); }
    .hero__title { font-size: clamp(2.8rem, 13vw, 4.4rem); margin-top: 1.1rem; max-width: 14ch; }
    .hero__sub { font-size: 1.02rem; margin-top: 1.3rem; }
    .hero__cta { margin-top: 1.8rem; gap: 0.6rem; }
    .hero__cta .btn { flex: 1 1 auto; justify-content: center; min-height: 44px; align-items: center; }
    .hero__meta { margin-top: 2rem; gap: 0.6rem; font-size: 0.66rem; }
    .hs__tag { display: none; }
  }

  @media (max-width: 640px) {
    /* white copy must stay legible over any footage on a small bright phone */
    .hs__scrim, .hs--c .hs__scrim { background:
      linear-gradient(180deg, rgba(8,6,4,0.44) 0%, rgba(8,6,4,0.10) 30%, rgba(8,6,4,0.32) 60%, rgba(8,6,4,0.82) 100%); }
    .hs__left { background: none; }
    .hs__content { padding-block: clamp(6rem, 15vh, 8rem) clamp(3.5rem, 11vh, 5.5rem); }
    .hero__title { font-size: clamp(2.6rem, 12vw, 3.8rem); max-width: 12ch; }
    .hero__sub { font-size: clamp(0.98rem, 4.2vw, 1.1rem); max-width: 34ch; }
    .hero__cta { flex-direction: column; align-items: stretch; gap: 0.7rem; width: 100%; max-width: 22rem; }
    .hero__cta .btn { width: 100%; min-height: 48px; justify-content: center; }
    .hero__meta { font-size: 0.62rem; gap: 0.5rem; }
  }
`;a.s(["default",0,function({variant:a="a"}){let{t:d,lang:g}=(0,f.useT)(),k=(0,e.useReducedMotion)(),p=(0,c.useRef)(null),q=(0,c.useRef)(null),r=(0,c.useRef)(null),s=(0,c.useRef)(null),[t,u]=(0,c.useState)(!1),[v,w]=(0,c.useState)(!1),[x,y]=(0,c.useState)(i.SAFE_FRAME_EXT),[z,A]=(0,c.useState)(null);return(0,c.useEffect)(()=>{(0,i.resolveFrameExt)().then(a=>{y(a),A(a)})},[]),(0,c.useEffect)(()=>{let b=p.current,c=r.current;if(!b||!c||!z)return;let d=window.innerHeight,e=()=>{let a=q.current?.getBoundingClientRect();d=a&&a.height>0?a.height:window.innerHeight};e();let f=()=>{let a=b.getBoundingClientRect(),c=b.offsetHeight-d;return c>0?Math.min(Math.max(-a.top/c,0),1):0},g=0,i=a=>{let b=Math.min(100,Math.round(100*a));b>g&&(h.preload.done(b-g),g=b)},l=()=>i(1);h.preload.add(100);let n=m(a,z),o=(0,j.budgetFrames)(n.total,n.src),t=(0,j.createFrameScrub)({container:c,frames:o,className:"hs__canvas",progress:f,reduce:!!k,onProgress:i,onFirstFrame:()=>{u(!0),w(!0)}}),v=window.setTimeout(l,2500),x=0,y=s.current,A=()=>{if(y){let a=1-Math.pow(1-Math.min(1,Math.max(0,(f()-.06)/.36)),3);y.style.opacity=String(1-a),y.style.transform=`translate3d(0, ${-(6*a)}vh, 0)`,y.style.pointerEvents=a>.98?"none":""}x=requestAnimationFrame(A)};x=requestAnimationFrame(A);let B=()=>e();return window.addEventListener("resize",B),window.addEventListener("orientationchange",B),()=>{cancelAnimationFrame(x),window.clearTimeout(v),window.removeEventListener("resize",B),window.removeEventListener("orientationchange",B),l(),t.destroy()}},[a,k,z]),(0,b.jsxs)("section",{id:"top",ref:p,className:`hs hs--${a}`,children:[(0,b.jsxs)("div",{className:"hs__sticky",ref:q,children:[(0,b.jsx)("div",{ref:r,className:`hs__stage${t?" is-ready":""}${v?" is-painted":""}`,role:"img","aria-label":"en"===g?"A scroll-driven walk through Evora showroom in Khalda, Amman":"جولة بالتمرير داخل معرض إيفورا في خلدا، عمّان"}),(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{media:"(max-width: 768px)",srcSet:(function(a=i.SAFE_FRAME_EXT){return l(250,2,10,"/evora/hero-frames-mobile",a)})(x).src(1)}),(0,b.jsx)("img",{src:m(a,x).src(1),alt:"","aria-hidden":!0,className:"hs__poster",fetchPriority:"high"})]}),(0,b.jsx)("div",{className:"hs__scrim"}),(0,b.jsx)("div",{className:"hs__left"}),(0,b.jsx)("div",{className:"hero__top"}),(0,b.jsx)("div",{ref:s,className:"hs__copy",children:(0,b.jsx)(n,{t:d,lang:g,ease:[.22,1,.36,1],staticMode:!!k})}),(0,b.jsxs)("div",{className:"hs__tag",children:[(0,b.jsx)("span",{className:"hs__tag-k",children:"en"===g?"Now showing":"يُعرض الآن"}),"en"===g?"A walk through Evora · Khalda":"جولة داخل إيفورا · خلدا"]})]}),(0,b.jsx)("style",{children:o})]})}])},395076,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(238246),e=a.i(346271),f=a.i(621216),g=a.i(635577),h=a.i(657400),i=a.i(922723),j=a.i(408696);function k(){return(0,b.jsxs)("span",{style:{position:"relative",width:7,height:7,display:"inline-block"},children:[(0,b.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:999,background:"var(--brass)"}}),(0,b.jsx)(e.motion.span,{style:{position:"absolute",inset:0,borderRadius:999,background:"var(--brass)"},animate:{scale:[1,2.4],opacity:[.6,0]},transition:{duration:1.6,repeat:1/0,ease:"easeOut"}})]})}function l(){return(0,b.jsxs)("svg",{width:"30",height:"30",viewBox:"0 0 24 24",fill:"none",stroke:"var(--brass)",strokeWidth:"1.3",strokeLinejoin:"round","aria-hidden":!0,children:[(0,b.jsx)("rect",{x:"3",y:"3",width:"18",height:"18",rx:"1.5"}),(0,b.jsx)("path",{d:"M3 10h7M10 3v7M10 14v7M14 14h7"})]})}a.s(["default",0,function(){let{lang:a,dir:m}=(0,g.useT)(),n="ar"===a,o=(0,f.useReducedMotion)(),[p,q]=(0,c.useState)(!1);(0,c.useEffect)(()=>q(!0),[]);let r=p&&!o,[s,t]=(0,c.useState)(-1),u=(0,c.useRef)(!1);return(0,b.jsxs)("section",{id:"start-track",className:"st",dir:m,lang:a,children:[(0,b.jsxs)("div",{className:"st__bg","aria-hidden":!0,children:[(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(e.motion.span,{className:"st__aurora st__aurora--a",animate:r?{x:[0,40,0],y:[0,-30,0],opacity:[.45,.75,.45]}:void 0,transition:{duration:19,repeat:1/0,ease:"easeInOut"}}),(0,b.jsx)(e.motion.span,{className:"st__aurora st__aurora--b",animate:r?{x:[0,-50,0],y:[0,30,0],opacity:[.4,.7,.4]}:void 0,transition:{duration:23,repeat:1/0,ease:"easeInOut"}})]}),(0,b.jsx)("span",{className:"st__grain"})]}),(0,b.jsxs)("div",{className:"container st__inner",children:[(0,b.jsxs)("header",{className:"st__head",children:[(0,b.jsx)("span",{className:"st__eyebrow",children:n?"ابدأ وتابع":"Create & track"}),(0,b.jsx)("h2",{className:"st__title",children:n?(0,b.jsxs)(b.Fragment,{children:["ارفع مخطّطك. ",(0,b.jsx)("em",{children:"وشاهد بيتك يُبنى."})]}):(0,b.jsxs)(b.Fragment,{children:["Upload your plan. ",(0,b.jsx)("em",{children:"Watch your home come to life."})]})}),(0,b.jsx)("p",{className:"st__lead",children:n?"من مخطّطٍ مسطّح إلى بيتٍ مؤثّثٍ واقعيٍّ بالأبعاد الثلاثية — وبمجرّد موافقتك يبدأ الإنتاج، وتتابع كل مرحلة مباشرةً من لوحتك. وافِق على الشاشة أوّلًا؛ لا نصنع شيئًا قبل ذلك.":"From a flat plan to a furnished, photoreal 3D home — and once you approve, production begins and every stage streams live to your dashboard. Approve on screen first; we don't cut a board until you do."})]}),(0,b.jsxs)(e.motion.div,{className:"st__grid",onViewportEnter:function(){if(u.current)return;if(u.current=!0,o)return void t(5);let a=-1,b=setInterval(()=>{t(a+=1),a>=5&&clearInterval(b)},520)},viewport:{once:!0,margin:"0px 0px -18% 0px"},children:[(0,b.jsxs)("div",{className:"st__create",children:[(0,b.jsxs)("span",{className:"st__tag",children:[(0,b.jsx)("b",{children:"01"}),n?"أنشئ":"Create"]}),(0,b.jsxs)("button",{type:"button",className:"st__drop",onClick:i.openStartProject,onDragOver:a=>{a.preventDefault(),a.currentTarget.classList.add("is-drag")},onDragLeave:a=>a.currentTarget.classList.remove("is-drag"),onDrop:a=>{a.preventDefault(),a.currentTarget.classList.remove("is-drag"),(0,i.openStartProject)()},children:[(0,b.jsx)("span",{className:"st__drop-ic",children:(0,b.jsx)(l,{})}),(0,b.jsx)("span",{className:"st__drop-t",children:n?"أفلت مخطّطك هنا":"Drop your floor plan here"}),(0,b.jsx)("span",{className:"st__drop-s",children:n?"أو اضغط للرفع · PNG · JPG · PDF":"or tap to upload · PNG · JPG · PDF"})]}),(0,b.jsx)("ul",{className:"st__points",children:(n?["ارفع مخطّطك — صورة أو PDF","نصمّمه ونؤثّثه ثلاثي الأبعاد، ثم نقدّمه بعرض واقعي","تعتمده — ثم نصنعه وأنت تتابع كل مرحلة مباشرةً"]:["Upload your plan — an image or a PDF","We model & furnish it in 3D, then render it photoreal","You approve — then we build it while you track every stage"]).map((a,c)=>(0,b.jsxs)("li",{className:"st__point",children:[(0,b.jsx)("span",{className:"st__point-n",children:c+1}),(0,b.jsx)("span",{children:a})]},c))}),(0,b.jsxs)("div",{className:"st__cta",children:[(0,b.jsxs)("button",{type:"button",className:"st__btn st__btn--solid",onClick:i.openStartProject,children:[n?"ارفع مخططك":"Upload your plan"," ",(0,b.jsx)("span",{className:"arrow","aria-hidden":!0,children:"↗"})]}),(0,b.jsx)(d.default,{href:"/studio",className:"st__btn st__btn--ghost",children:n?"تعرّف على خدمة التصميم":"See the design service"})]})]}),(0,b.jsxs)("div",{className:"st__track",children:[(0,b.jsxs)("span",{className:"st__tag",children:[(0,b.jsx)("b",{children:"02"}),n?"تابع":"Track"]}),(0,b.jsxs)("div",{className:"st__card",children:[(0,b.jsxs)("figure",{className:"st__film",children:[(0,b.jsx)(j.default,{src:"/evora/kitchen/reveal.mp4",poster:"/evora/kitchen/stage-4.jpg",preload:"metadata"}),(0,b.jsxs)("figcaption",{children:[(0,b.jsx)(k,{})," ",n?"معاينة حيّة · نموذجك الحقيقي":"Live preview · your real model"]})]}),(0,b.jsxs)("div",{className:"st__card-head",children:[(0,b.jsx)("span",{className:"st__card-title",children:n?"غرفة المعيشة — فيلا":"Living Room — Villa"}),(0,b.jsx)("span",{className:"st__badge",children:n?"قيد الإنتاج":"In production"})]}),(0,b.jsx)("ol",{className:"st__journey",children:h.JOURNEY.map((a,c)=>{let d=c<=s,e=5===c&&s>=5;return(0,b.jsxs)("li",{className:`st__j${d?" is-lit":""}${e?" is-active":""}`,children:[(0,b.jsxs)("span",{className:"st__j-rail",children:[(0,b.jsx)("span",{className:"st__j-dot",children:d&&c<5?"✓":""}),c<h.JOURNEY.length-1&&(0,b.jsx)("span",{className:"st__j-line"})]}),(0,b.jsxs)("span",{className:"st__j-label",children:[n?a.ar:a.en,e&&(0,b.jsx)(k,{})]})]},a.key)})}),(0,b.jsxs)(d.default,{href:"/dashboard",className:"st__dash",children:[n?"افتح لوحتي":"Open my dashboard"," ",(0,b.jsx)("span",{className:"arrow","aria-hidden":!0,children:n?"←":"→"})]})]})]})]})]}),(0,b.jsx)("style",{children:`
        .st { position: relative; isolation: isolate; background: var(--ink); color: var(--paper);
          padding-block: clamp(4.5rem, 10vw, 9rem); overflow: hidden; }
        /* Ease the hand-off from the airy white section above into the dark band
           instead of a hard white→near-black cut. */
        .st::before { content: ""; position: absolute; inset-inline: 0; top: 0; height: clamp(80px, 12vh, 160px);
          background: linear-gradient(to bottom, var(--paper) 0%, transparent 100%); opacity: 0.06; z-index: -1; pointer-events: none; }
        .st__bg { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
        .st__aurora { position: absolute; border-radius: 50%; filter: blur(95px); }
        .st__aurora--a { width: 46vw; height: 46vw; top: -14%; inset-inline-start: -8%;
          background: radial-gradient(circle, rgba(197,160,106,0.30), transparent 65%); }
        .st__aurora--b { width: 54vw; height: 54vw; bottom: -20%; inset-inline-end: -12%;
          background: radial-gradient(circle, rgba(54,65,47,0.42), transparent 65%); }
        .st__grain { position: absolute; inset: 0; opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

        .st__inner { position: relative; z-index: 1; }

        /* Header */
        /* editorial header: start-aligned, runs the container's full measure
           instead of being clamped to a narrow ch-width that then floats in
           the middle of the section — same fix as Rooms.tsx's .rm__head and
           ProcessJourney.tsx's .pj-head. */
        .st__head { text-align: start; }
        .st__eyebrow { font-family: var(--f-sans); font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.26em; text-transform: uppercase; color: var(--brass-2); }
        .st__title { font-family: var(--f-display), Georgia, serif; font-optical-sizing: auto;
          font-variation-settings: "opsz" 140, "SOFT" 0, "WONK" 1; font-weight: 340;
          font-size: clamp(2.2rem, 5.2vw, 4.2rem); line-height: 1.0; letter-spacing: -0.02em;
          color: var(--paper); margin: 1rem 0 0; text-wrap: balance; }
        .st__title em { font-style: italic; font-variation-settings: "opsz" 140, "SOFT" 60, "WONK" 1;
          color: var(--brass); }
        .st__lead { font-family: var(--f-sans); color: rgba(251,247,240,0.74);
          font-size: clamp(1rem, 1.25vw, 1.14rem); line-height: 1.7; max-width: 70ch; margin: 1.3rem 0 0; }

        /* Grid */
        .st__grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr);
          gap: clamp(1.4rem, 4vw, 3.4rem); align-items: stretch; margin-top: clamp(2.6rem, 6vw, 4.5rem); }
        .st__tag { display: inline-flex; align-items: center; gap: 0.7rem; font-family: var(--f-sans);
          font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(251,247,240,0.62); margin-bottom: 1.2rem; }
        .st__tag b { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center;
          font-family: var(--f-display); font-size: 0.82rem; color: var(--ink); background: var(--brass); font-weight: 600; }

        /* LEFT — Create */
        .st__create { display: flex; flex-direction: column; }
        .st__drop { width: 100%; aspect-ratio: 16/9; border-radius: 18px; cursor: pointer;
          border: 1.5px dashed rgba(251,247,240,0.28); background: rgba(251,247,240,0.04);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.55rem;
          color: var(--paper); text-align: center; padding: 1.4rem;
          transition: border-color .4s var(--ease), background .4s var(--ease), transform .4s var(--ease); }
        .st__drop:hover, .st__drop.is-drag { border-color: var(--brass); background: rgba(197,160,106,0.1); transform: translateY(-2px); }
        .st__drop-ic { width: 60px; height: 60px; border-radius: 16px; display: grid; place-items: center;
          background: rgba(197,160,106,0.14); margin-bottom: 0.3rem; }
        .st__drop-t { font-family: var(--f-display), Georgia, serif; font-size: clamp(1.25rem, 2.4vw, 1.6rem); }
        .st__drop-s { font-family: var(--f-sans); font-size: 0.84rem; color: rgba(251,247,240,0.6); }

        .st__points { list-style: none; margin: 1.6rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.9rem; }
        .st__point { display: flex; align-items: flex-start; gap: 0.85rem; font-family: var(--f-sans);
          color: rgba(251,247,240,0.86); font-size: 0.98rem; line-height: 1.5; }
        .st__point-n { flex: none; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center;
          font-family: var(--f-display); font-size: 0.82rem; color: var(--brass); border: 1px solid rgba(197,160,106,0.45); }

        .st__cta { display: flex; flex-wrap: wrap; gap: 0.7rem; margin-top: auto; padding-top: 1.8rem; }
        .st__btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.95rem 1.6rem;
          border-radius: 999px; font-family: var(--f-sans); font-weight: 600; font-size: 0.92rem; cursor: pointer;
          border: 1px solid transparent; transition: transform .25s ease, background .25s ease, border-color .25s ease, filter .25s ease; }
        .st__btn--solid { background: var(--brass); color: var(--ink); }
        .st__btn--solid:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .st__btn--ghost { background: transparent; color: var(--paper); border-color: rgba(251,247,240,0.32); }
        .st__btn--ghost:hover { background: rgba(251,247,240,0.08); border-color: var(--paper); }

        /* RIGHT — Track */
        .st__track { display: flex; flex-direction: column; }
        .st__card { flex: 1; background: rgba(251,247,240,0.05); border: 1px solid rgba(197,160,106,0.38);
          border-radius: 20px; padding: 1.1rem 1.2rem 1.3rem;
          box-shadow: 0 0 0 1px rgba(197,160,106,0.12), 0 40px 90px -50px rgba(197,160,106,0.5); }
        .st__film { position: relative; margin: 0 0 1.2rem; border-radius: 14px; overflow: hidden;
          aspect-ratio: 16/10; background: #0c0b09; border: 1px solid rgba(251,247,240,0.1); }
        .st__film video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .st__film figcaption { position: absolute; left: 0; bottom: 0; right: 0; display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 0.8rem; font-family: var(--f-sans); font-size: 0.7rem; letter-spacing: 0.05em;
          text-transform: uppercase; color: rgba(251,247,240,0.9);
          background: linear-gradient(transparent, rgba(8,6,4,0.78)); }
        .st__card-head { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; margin-bottom: 1.1rem; }
        .st__card-title { font-family: var(--f-display), Georgia, serif; font-size: 1.12rem; color: var(--paper); }
        .st__badge { flex: none; font-family: var(--f-sans); font-size: 0.64rem; letter-spacing: 0.05em;
          padding: 0.3em 0.8em; border-radius: 999px; color: var(--brass); border: 1px solid rgba(197,160,106,0.5); }

        .st__journey { list-style: none; margin: 0; padding: 0; }
        .st__j { display: flex; gap: 0.85rem; align-items: flex-start; padding-bottom: 0.65rem; }
        .st__j:last-child { padding-bottom: 0; }
        .st__j-rail { display: flex; flex-direction: column; align-items: center; align-self: stretch; }
        .st__j-dot { width: 17px; height: 17px; border-radius: 50%; flex: none; display: grid; place-items: center;
          font-size: 0.56rem; color: #fff; background: transparent; border: 1.5px solid rgba(251,247,240,0.22);
          transition: background .45s var(--ease), border-color .45s var(--ease); }
        .st__j-line { width: 1.5px; flex: 1; min-height: 13px; margin-top: 2px; background: rgba(251,247,240,0.14); transition: background .45s var(--ease); }
        .st__j-label { font-family: var(--f-sans); font-size: 0.9rem; color: rgba(251,247,240,0.64); padding-top: 1px;
          display: flex; align-items: center; gap: 0.5rem; transition: color .45s var(--ease); }
        .st__j.is-lit .st__j-dot { background: var(--clay); border-color: var(--clay); }
        .st__j.is-lit .st__j-line { background: var(--clay); }
        .st__j.is-lit .st__j-label { color: var(--paper); }
        .st__j.is-active .st__j-dot { background: var(--brass); border-color: var(--brass); }
        .st__j.is-active .st__j-label { font-weight: 600; }

        .st__dash { display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1.3rem;
          font-family: var(--f-sans); font-weight: 600; font-size: 0.88rem; color: var(--brass);
          text-decoration: none; transition: gap .25s ease, color .25s ease; }
        .st__dash:hover { gap: 0.75rem; color: var(--paper); }

        @media (max-width: 900px) {
          .st__grid { grid-template-columns: 1fr; gap: 2.4rem; }
          .st__cta { margin-top: 1.6rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .st__film video { /* still frame via poster */ }
        }
      `})]})}])},192326,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(635577);function e({children:a,delay:b=0,as:d="div",className:f=""}){let g=(0,c.useRef)(null),[h,i]=(0,c.useState)(!1);return(0,c.useEffect)(()=>{let a=g.current;if(!a)return;let b=new IntersectionObserver(([a])=>{a.isIntersecting&&(i(!0),b.disconnect())},{threshold:.12,rootMargin:"0px 0px -8% 0px"});return b.observe(a),()=>b.disconnect()},[]),(0,c.createElement)(d,{ref:g,className:`reveal ${h?"in":""} ${f}`,style:{transitionDelay:`${b}ms`}},a)}var f=a.i(679016);let g="cubic-bezier(0.22, 1, 0.36, 1)",h="/evora/kitchen-teaser-marble",i="Step into the kitchen",j="ادخل تجربة المطبخ",k="Bespoke · made in Amman",l="حسب الطلب · صُنع في عمّان",m="A kitchen made to measure.",n="مطبخٌ على مقاسك.",o="Built to order in our own workshop — the marble, the finish, the proportions, all yours to decide. See the whole room in 3D before a single cut is made.",p="يُصنع خصيصًا في ورشتنا — الرخام والتشطيب والمقاسات، كلّها بقرارك. شاهد الغرفة كاملة بالأبعاد الثلاثية قبل أن يُقطع أي شيء.";a.s(["default",0,function(){let{t:a,lang:q,dir:r}=(0,d.useT)(),s="en"===q,[t,u]=(0,c.useState)(f.SAFE_FRAME_EXT);return(0,c.useEffect)(()=>{let a=!0;return(0,f.resolveFrameExt)().then(b=>{a&&u(b)}),()=>{a=!1}},[]),(0,b.jsxs)("section",{id:"kitchen-teaser",className:"ktz",lang:q,dir:r,children:[(0,b.jsxs)("div",{className:"ktz__grid",children:[(0,b.jsx)(e,{className:"ktz__frame",delay:0,children:(0,b.jsxs)("a",{href:"/kitchen",className:"ktz__framelink","data-cursor":"hover","aria-label":a("cfg_aria"),children:[(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{srcSet:`${h}.avif`,type:"image/avif"}),(0,b.jsx)("img",{src:"avif"===t?`${h}.avif`:`${h}.webp`,onError:a=>{let b=a.currentTarget;b.src.endsWith(".webp")||(b.src=`${h}.webp`)},alt:a("cfg_aria"),className:"ktz__img",loading:"lazy"})]}),(0,b.jsx)("span",{className:"ktz__scrim"}),(0,b.jsx)("span",{className:"ktz__badge",children:s?k:l}),(0,b.jsx)("span",{className:"ktz__playhint","aria-hidden":!0,children:(0,b.jsx)("span",{className:"ktz__playarrow",children:"↗"})})]})}),(0,b.jsxs)(e,{className:"ktz__copy",delay:.08,children:[(0,b.jsx)("span",{className:"eyebrow ktz__eyebrow",children:a("cfg_eyebrow")}),(0,b.jsx)("h2",{className:"display ktz__heading",children:s?m:n}),(0,b.jsx)("p",{className:"ktz__lead",children:s?o:p}),(0,b.jsxs)("a",{href:"/kitchen",className:"btn btn-solid ktz__cta",children:[s?i:j," ",(0,b.jsx)("span",{className:"arrow",children:"→"})]})]})]}),(0,b.jsx)("style",{children:`
        /* A true full-bleed screen: exactly one viewport tall, no container, no
           side gutters, no padding — the photo runs off the left edge and meets
           the copy panel flush down the middle seam. 100svh (not 100vh) so it
           doesn't jump as mobile browser chrome shows and hides mid-scroll.
           overflow:hidden contains the Reveal wrapper's entrance translate. */
        .ktz {
          position: relative;
          height: 100svh;
          min-height: 100svh;
          overflow: hidden;
          /* dark panel — the warm walnut/marble photograph reads far richer
             against ink than against paper, and it gives the homepage a break
             from an otherwise unbroken run of light sections */
          background: #0d0b09;
        }
        /* The photo column is sized by its own 4:3 ratio at full section height,
           and the copy takes whatever is left — which makes the copy column
           narrower than the old 0.94fr split, as asked. */
        .ktz__grid {
          width: 100%; height: 100%;
          display: grid; grid-template-columns: auto 1fr;
          gap: 0; align-items: stretch;
        }
        [dir="rtl"] .ktz__grid { direction: rtl; }

        /* photo — a true 4:3 block running the full height of the screen and
           bleeding off the leading edge. max-width stops it crowding the copy
           out on short/wide windows, where 4:3 of 100svh gets very wide. */
        .ktz__frame {
          position: relative; height: 100%; min-height: 0;
          aspect-ratio: 4 / 3; max-width: 64vw;
        }
        .ktz__framelink {
          position: relative; display: block; height: 100%; width: 100%;
          overflow: hidden; border-radius: 0;
        }
        .ktz__img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transform: scale(1.02); transition: transform 1.2s ${g};
        }
        .ktz__framelink:hover .ktz__img { transform: scale(1.06); }
        .ktz__scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(16,15,13,0.05) 0%, transparent 42%, rgba(16,15,13,0.6) 100%);
        }
        .ktz__badge {
          position: absolute; top: 1.1rem; inset-inline-start: 1.1rem;
          background: rgba(251,247,240,0.92); color: var(--ink);
          font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase;
          padding: 0.45em 0.8em; border-radius: 100px;
        }
        .ktz__playhint {
          position: absolute; inset-inline-end: 1.2rem; bottom: 1.2rem;
          width: 2.8rem; height: 2.8rem; border-radius: 50%;
          background: rgba(251,247,240,0.92); display: flex; align-items: center; justify-content: center;
          transition: transform .5s ${g};
        }
        .ktz__framelink:hover .ktz__playhint { transform: translate(3px, -3px); }
        .ktz__playarrow { color: var(--ink); font-size: 1.1rem; }
        [dir="rtl"] .ktz__playarrow { transform: scaleX(-1); display: inline-block; }

        /* copy half — carries its own padding (the section has none) so the two
           halves stay flush against the seam while the text still breathes */
        .ktz__copy {
          min-width: 0; height: 100%;
          display: flex; flex-direction: column; justify-content: center;
          padding-inline: clamp(1.5rem, 4.5vw, 5rem);
          padding-block: clamp(2rem, 5vh, 3.5rem);
        }
        /* on-dark copy: brass-2 is the lighter brass the rest of the site uses
           on dark grounds (--brass is the on-light one and goes muddy here) */
        .ktz__eyebrow { color: var(--brass-2); display: block; margin-bottom: 0.7em; }
        .ktz__heading {
          font-size: clamp(2.1rem, 4vw, 3.6rem); line-height: 1.03;
          margin-bottom: 0.65em; max-width: 15ch; color: #fbf7f0;
        }
        .ktz__lead {
          font-size: clamp(0.98rem, 1.25vw, 1.1rem); line-height: 1.6;
          color: rgba(251,247,240,0.76); max-width: 42ch; margin-bottom: 2.1em;
        }
        /* the shared .btn-solid is ink-on-paper; invert it so the CTA still
           reads as the primary action against the dark panel */
        .ktz__cta {
          width: fit-content;
          background: var(--paper); color: var(--ink); border-color: var(--paper);
        }
        .ktz__cta:hover { background: var(--brass-2); border-color: var(--brass-2); color: var(--ink); }

        @media (max-width: 900px) {
          /* A side-by-side split is unreadable at phone widths, so the halves
             stack — but they stay ROWS of one 100svh screen (48/52) rather than
             becoming two loose blocks, so the section is still exactly one
             full, connected screen with the seam running horizontally. */
          .ktz__grid { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
          /* stacked: the photo keeps its 4:3 ratio across the full width and the
             copy fills the rest of the screen beneath it */
          .ktz__frame { height: auto; width: 100%; max-width: none; aspect-ratio: 4 / 3; }
          .ktz__copy {
            height: 100%;
            padding-inline: clamp(1.25rem, 6vw, 2.2rem);
            padding-block: clamp(1.4rem, 3.5vh, 2.2rem);
          }
          .ktz__heading { max-width: 20ch; }
          .ktz__lead { margin-bottom: 1.5em; }
        }
        @media (max-width: 640px) {
          .ktz__cta { width: 100%; justify-content: center; }
          .ktz__heading { font-size: clamp(1.75rem, 7.4vw, 2.4rem); margin-bottom: 0.5em; }
          .ktz__lead { font-size: 0.95rem; margin-bottom: 1.3em; }
        }
      `})]})}],192326)},989183,a=>{"use strict";var b=a.i(187924),c=a.i(635577),d=a.i(482665);a.s(["default",0,function(){let{lang:a}=(0,c.useT)(),e=[...d.marqueeItems,...d.marqueeItems],f="linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)";return(0,b.jsxs)("div",{className:"marquee marquee--ever",style:{background:"var(--paper)",color:"var(--ink)",paddingBlock:"1.05rem",borderBlock:"1px solid var(--line)",WebkitMaskImage:f,maskImage:f},children:[(0,b.jsx)("div",{className:"marquee__track","aria-hidden":!0,children:e.map((c,d)=>(0,b.jsxs)("span",{style:{display:"inline-flex",alignItems:"center"},children:[(0,b.jsx)("span",{className:"marquee__item",style:{fontFamily:"var(--font-display)",fontStyle:"ar"===a?"normal":"italic",fontSize:"1.25rem",fontWeight:400,padding:"0 1.4rem",opacity:.95},children:c[a]}),(0,b.jsx)("span",{style:{color:"var(--brass-2)",fontSize:"0.7rem"},children:"✦"})]},d))}),(0,b.jsx)("style",{children:`
        .marquee--ever:hover .marquee__track { animation-play-state: paused; }
        /* denser, faster ribbon on phones so it reads in a glance without dominating */
        @media (max-width: 640px) {
          .marquee--ever .marquee__item { font-size: 1.05rem !important; padding: 0 1rem !important; }
          .marquee--ever .marquee__track { animation-duration: 28s; }
        }
      `})]})}])},834334,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(635577),e=a.i(346271),f=a.i(995180),g=a.i(901299),h=a.i(566535),i=a.i(621216),j=a.i(668222),k=a.i(482665);let l=[.22,1,.36,1],m={stiffness:80,damping:30,mass:.5};function n(){return(0,b.jsx)("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":!0,children:(0,b.jsx)("path",{d:"M12 2.2l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.27l-5.9 3.1 1.13-6.57L2.45 9.14l6.6-.96L12 2.2z"})})}a.s(["default",0,function(){let{t:a,lang:o}=(0,d.useT)(),p="ar"===o,q=(0,i.useReducedMotion)(),r=(0,c.useRef)(null),{scrollYProgress:s}=(0,f.useScroll)({target:r,offset:["start end","end start"]}),t=(0,h.useSpring)((0,g.useTransform)(s,[0,1],[1.28,1.06]),m),u=(0,h.useSpring)((0,g.useTransform)(s,[0,1],["-8%","10%"]),m),v=(0,h.useSpring)((0,g.useTransform)(s,[0,1],["38%","-30%"]),m),w=(0,h.useSpring)((0,g.useTransform)(s,[0,1],["12%","-10%"]),m);return(0,b.jsxs)("section",{className:"fh",dir:p?"rtl":"ltr",children:[(0,b.jsxs)("div",{className:"fh__band",ref:r,children:[(0,b.jsxs)("div",{className:"fh__media",children:[(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{media:"(max-width: 768px)",srcSet:"/evora/vid-sofa-mobile.jpg"}),(0,b.jsx)(e.motion.img,{src:"/evora/vid-sofa.jpg",alt:"ar"===o?"كنبة إيفورا منحنية في غرفة معيشة مؤثّثة":"A curved Evora sofa in a furnished living room",loading:"lazy",decoding:"async",className:"fh__img",style:q?void 0:{scale:t,y:u}})]}),(0,b.jsx)("div",{className:"fh__scrim"}),(0,b.jsx)("div",{className:"fh__grain"})]}),(0,b.jsx)("div",{className:"container fh__bandinner",children:(0,b.jsxs)(e.motion.div,{className:"fh__content",style:q?void 0:{y:w},children:[(0,b.jsxs)("div",{className:"fh__kick",children:[(0,b.jsx)(e.motion.span,{className:"fh__rule",initial:{scaleX:0},whileInView:{scaleX:1},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.9,ease:l}}),(0,b.jsx)(j.Rise,{as:"span",className:"eyebrow fh__eyebrow",children:a("manifesto_eyebrow")})]}),(0,b.jsx)(j.RevealLines,{lines:function(a){let b=a.split(" "),c=Math.ceil(b.length/3),d=[];for(let a=0;a<b.length;a+=c)d.push(b.slice(a,a+c).join(" "));return d}(a("manifesto_lead")),className:"display fh__lead"}),(0,b.jsx)(j.Rise,{delay:.15,children:(0,b.jsx)("p",{className:"fh__body",children:a("manifesto_body")})})]})}),(0,b.jsxs)(e.motion.a,{href:"/shop",className:"fh__shop",style:q?void 0:{y:v},children:[(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{media:"(max-width: 768px)",srcSet:"/evora/p11-mobile.jpg"}),(0,b.jsx)("img",{src:"/evora/p11.jpg",alt:"ar"===o?"قطع من مجموعة إيفورا داخل منزل مكتمل":"Pieces from the Evora collection in a finished home",loading:"lazy",decoding:"async"})]}),(0,b.jsx)("span",{className:"fh__shop-scrim"}),(0,b.jsxs)("span",{className:"fh__shop-label",children:[(0,b.jsx)("span",{className:"fh__shop-k",children:p?"الكتالوج":"The Catalogue"}),(0,b.jsxs)("span",{className:"fh__shop-t",children:[p?"تسوّق المجموعة":"Shop the collection",(0,b.jsx)("span",{className:"fh__shop-arrow","aria-hidden":!0,children:"↗"})]})]})]}),(0,b.jsx)("span",{className:"fh__caption",children:p?"بيت من إيفورا · عمّان":"An Evora home · Amman"})]}),(0,b.jsx)("div",{className:"fh__proof",children:(0,b.jsxs)("div",{className:"container",children:[(0,b.jsxs)("div",{className:"fh__proofhead",children:[(0,b.jsxs)("div",{className:"fh__kick fh__kick--center",children:[(0,b.jsx)(e.motion.span,{className:"fh__rule",initial:{scaleX:0},whileInView:{scaleX:1},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.9,ease:l}}),(0,b.jsx)(j.Rise,{as:"span",className:"eyebrow fh__eyebrow",children:a("proof_eyebrow")}),(0,b.jsx)(e.motion.span,{className:"fh__rule",initial:{scaleX:0},whileInView:{scaleX:1},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.9,ease:l}})]}),(0,b.jsx)(j.RevealLines,{lines:[a("proof_title")],className:"display fh__prooftitle",delay:.06}),(0,b.jsx)(j.Rise,{delay:.16,children:(0,b.jsx)("p",{className:"serif-i fh__since",children:a("proof_since")})})]}),(0,b.jsx)(j.Stagger,{className:"fh__stats",delay:.2,children:k.stats.map(c=>(0,b.jsxs)(j.StaggerItem,{className:"fh__stat",children:[(0,b.jsx)(j.CountUp,{value:c.value,className:"display fh__statnum"}),(0,b.jsx)("span",{className:"fh__statlabel",children:a(c.label)})]},c.label))})]})}),(0,b.jsx)("div",{className:"fh__voices",children:(0,b.jsxs)("div",{className:"container",children:[(0,b.jsxs)("div",{className:"fh__vhead",children:[(0,b.jsx)(j.Rise,{as:"span",className:"eyebrow fh__voiceseyebrow",children:p?"محبوبون في عمّان":"Loved across Amman"}),(0,b.jsx)(j.Rise,{as:"h3",delay:.05,className:"display fh__voicestitle",children:p?"بكلماتهم":"In their words"}),(0,b.jsx)(j.Rise,{as:"p",delay:.1,className:"fh__vsub",children:p?"عملاء حقيقيون في عمّان — صُمّم، سُلّم، وعِيش فيه.":"Real homeowners across Amman — designed, delivered, and lived in."})]}),(0,b.jsx)(j.Stagger,{className:"fh__qgrid",gap:.1,delay:.05,children:k.testimonials.map((a,c)=>(0,b.jsx)(j.StaggerItem,{className:"fh__qitem",children:(0,b.jsxs)("figure",{className:"fh__quote",children:[(0,b.jsx)("span",{className:"fh__qmark","aria-hidden":!0,children:"“"}),(0,b.jsx)("div",{className:"fh__stars","aria-label":p?"خمس نجوم":"Five stars",children:Array.from({length:5}).map((a,c)=>(0,b.jsx)(n,{},c))}),(0,b.jsx)("blockquote",{className:"fh__qtext",children:a.quote[o]}),(0,b.jsxs)("figcaption",{className:"fh__qcap",children:[(0,b.jsx)("span",{className:"fh__avatar","aria-hidden":!0,children:a.name.split(/\s+/).slice(0,2).map(a=>a[0]).join("").toUpperCase()}),(0,b.jsxs)("span",{className:"fh__qmeta",children:[(0,b.jsx)("span",{className:"fh__qname",children:a.name}),(0,b.jsx)("span",{className:"fh__qrole",children:a.role[o]})]})]})]})},c))})]})}),(0,b.jsx)("style",{children:`
        .fh { position: relative; background: var(--bone); }

        /* ── I \xb7 band ── */
        .fh__band { position: relative; min-height: clamp(640px, 104svh, 980px); display: flex; align-items: center;
          overflow: hidden; background: var(--ink); }
        .fh__media { position: absolute; inset: 0; z-index: 0; }
        .fh__img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
        .fh__scrim { position: absolute; inset: 0; pointer-events: none; background:
          linear-gradient(100deg, rgba(16,15,13,0.92) 0%, rgba(20,22,17,0.7) 30%, rgba(20,22,17,0.26) 60%, rgba(20,22,17,0.05) 100%),
          linear-gradient(180deg, transparent 40%, rgba(14,14,11,0.55) 100%),
          radial-gradient(60% 50% at 80% 32%, rgba(197,160,106,0.16), transparent 60%); }
        .fh__grain { position: absolute; inset: 0; pointer-events: none; opacity: 0.45; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 180px; }

        .fh__bandinner { position: relative; z-index: 2; width: 100%; }
        .fh__content { max-width: 760px; }
        .fh__kick { display: flex; align-items: center; gap: 1rem; }
        .fh__kick--center { justify-content: center; }
        .fh__rule { display: block; width: 60px; height: 1px; background: var(--brass-2); transform-origin: left; flex-shrink: 0; }
        html[dir="rtl"] .fh__rule { transform-origin: right; }
        .fh__eyebrow { color: var(--brass-2); display: block; }
        .fh__lead { color: var(--paper); font-size: clamp(2rem, 4.6vw, 4rem); line-height: 1.08; font-weight: 360;
          margin: 1.5rem 0 0; text-shadow: 0 2px 36px rgba(16,15,13,0.5); }
        .fh__body { color: rgba(251,247,240,0.85); font-size: clamp(1rem, 1.2vw, 1.14rem); line-height: 1.7;
          max-width: 46ch; margin: 2rem 0 0; }

        .fh__shop { position: absolute; z-index: 3; bottom: clamp(8.5rem, 16vw, 11rem); inset-inline-end: clamp(2rem, 8vw, 9rem);
          width: clamp(180px, 16vw, 240px); aspect-ratio: 4/5; border-radius: 12px; overflow: hidden;
          box-shadow: 0 44px 90px -30px rgba(0,0,0,0.78); border: 1px solid rgba(251,247,240,0.1); }
        .fh__shop img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s var(--ease); }
        .fh__shop:hover img { transform: scale(1.07); }
        .fh__shop-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, rgba(16,15,13,0.82) 100%); }
        .fh__shop-label { position: absolute; inset-inline: 0; bottom: 0; display: flex; flex-direction: column; gap: 4px; padding: 1rem 1.05rem 1.05rem; }
        .fh__shop-k { font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass-2); font-weight: 600; }
        .fh__shop-t { display: inline-flex; align-items: center; gap: 0.45rem; font-family: var(--font-display); font-size: 1.12rem; color: var(--paper); line-height: 1.12; }
        .fh__shop-arrow { transition: transform .4s var(--ease); }
        .fh__shop:hover .fh__shop-arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .fh__shop-arrow { transform: scaleX(-1); }
        html[dir="rtl"] .fh__shop:hover .fh__shop-arrow { transform: translate(-3px, -3px) scaleX(-1); }

        .fh__caption { position: absolute; z-index: 2; bottom: clamp(1.4rem, 4vw, 2.4rem); inset-inline-start: clamp(1.25rem, 5vw, 6rem);
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(251,247,240,0.66); }

        /* ── II \xb7 proof ribbon (overlaps band) ── */
        .fh__proof { position: relative; z-index: 4; margin-top: clamp(-6rem, -9vw, -9rem); padding-bottom: clamp(3rem, 6vw, 5rem); }
        .fh__proof .container { background: linear-gradient(180deg, rgba(22,21,16,0.96), rgba(22,21,16,0.99));
          border: 1px solid rgba(197,160,106,0.22); border-radius: 20px; padding: clamp(2.2rem, 5vw, 3.6rem) clamp(1.6rem, 4vw, 3.4rem);
          box-shadow: 0 60px 120px -50px rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
        .fh__proofhead { text-align: center; max-width: 60ch; margin-inline: auto; }
        .fh__prooftitle { color: var(--paper); font-size: clamp(2rem, 4.4vw, 3.6rem); line-height: 1.06; font-weight: 360; margin: 1.2rem 0 0; }
        .fh__since { color: rgba(251,247,240,0.8); font-size: clamp(1rem, 1.4vw, 1.16rem); margin: 1rem 0 0; }

        .fh__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(1rem, 3vw, 2.4rem);
          margin-top: clamp(2.4rem, 5vw, 3.4rem); }
        .fh__stat { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-align: center; padding-inline: 0.5rem; }
        .fh__stat + .fh__stat::before { content: ""; position: absolute; inset-inline-start: 0; top: 12%; bottom: 12%; width: 1px;
          background: linear-gradient(transparent, rgba(197,160,106,0.45), transparent); }
        .fh__statnum { color: var(--brass-2); font-size: clamp(2.4rem, 5vw, 4.2rem); line-height: 0.95; font-weight: 400;
          letter-spacing: -0.01em; text-shadow: 0 2px 30px rgba(16,15,13,0.55); }
        .fh__statlabel { font-size: clamp(0.64rem, 0.9vw, 0.76rem); letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(251,247,240,0.72); font-weight: 500; }
        html[dir="rtl"] .fh__statlabel { letter-spacing: 0.06em; }

        /* ── III \xb7 voices ── */
        .fh__voices { background: var(--bone); padding-block: clamp(3.6rem, 8vw, 7rem); }
        .fh__vhead { max-width: 62ch; margin: 0 auto clamp(2.4rem, 5vw, 3.8rem); text-align: center; }
        .fh__voiceseyebrow { display: inline-flex; align-items: center; gap: 0.6rem; color: var(--brass); }
        .fh__voiceseyebrow::before, .fh__voiceseyebrow::after { content: ""; width: 26px; height: 1px; background: var(--brass); opacity: 0.55; }
        .fh__voicestitle { color: var(--ink); font-size: clamp(2.1rem, 4vw, 3.4rem); font-weight: 380; margin: 0.7rem 0 0; letter-spacing: -0.01em; }
        .fh__vsub { color: var(--ink-soft); font-size: clamp(0.98rem, 1.4vw, 1.1rem); margin: 0.9rem auto 0; max-width: 50ch; }

        .fh__qgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 290px), 1fr)); gap: clamp(16px, 2vw, 28px); align-items: stretch; }
        .fh__qitem { display: flex; }
        .fh__quote { position: relative; margin: 0; padding: clamp(1.6rem, 2.6vw, 2.2rem); border-radius: 16px; width: 100%; display: flex; flex-direction: column; overflow: hidden;
          background: var(--paper); border: 1px solid rgba(16,15,13,0.07);
          box-shadow: 0 26px 64px -44px rgba(22,21,15,0.4); transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease), border-color 0.5s var(--ease); }
        .fh__quote:hover { transform: translateY(-5px); border-color: rgba(138,106,60,0.35); box-shadow: 0 42px 90px -46px rgba(22,21,15,0.5); }
        .fh__qmark { position: absolute; top: -0.6rem; inset-inline-end: 0.8rem; font-family: var(--font-display); font-size: clamp(4.5rem, 8vw, 7rem); line-height: 1; color: var(--brass); opacity: 0.12; pointer-events: none; }
        .fh__stars { position: relative; display: flex; gap: 3px; color: var(--brass); margin-bottom: 0.9rem; }
        html[dir="rtl"] .fh__stars { justify-content: flex-start; }
        .fh__qtext { margin: 0; font-family: var(--font-display); font-size: clamp(1.05rem, 1.4vw, 1.28rem); line-height: 1.5; font-weight: 360; color: var(--ink); flex: 1; }
        .fh__qcap { display: flex; align-items: center; gap: 0.85rem; margin-top: 1.6rem; padding-top: 1.2rem; border-top: 1px solid rgba(16,15,13,0.1); }
        .fh__avatar { flex: none; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center;
          font-family: var(--font-display); font-size: 0.95rem; color: var(--paper);
          background: linear-gradient(150deg, var(--brass-2), color-mix(in srgb, var(--brass) 70%, #7a5c2e));
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.4); }
        .fh__qmeta { display: flex; flex-direction: column; gap: 0.12rem; }
        .fh__qname { font-family: var(--font-display); font-size: 1.05rem; color: var(--ever); }
        .fh__qrole { font-size: 0.74rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); }
        html[dir="rtl"] .fh__qrole { letter-spacing: 0.02em; }

        @media (max-width: 960px) {
          .fh__stats { grid-template-columns: 1fr 1fr; gap: 1.8rem 1rem; }
          .fh__stat:nth-child(3)::before, .fh__stat:nth-child(2)::before { content: none; }
        }
        @media (max-width: 760px) {
          .fh__band { min-height: 100svh; }
          .fh__scrim { background:
            linear-gradient(180deg, rgba(16,15,13,0.5) 0%, rgba(16,15,13,0.2) 30%, rgba(16,15,13,0.78) 100%); }
          .fh__shop { display: none; }
          .fh__statnum { font-size: clamp(2.2rem, 11vw, 3rem); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fh__img { scale: 1 !important; }
        }
      `})]})}])},676209,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(635577),e=a.i(346271),f=a.i(995180),g=a.i(901299),h=a.i(621216),i=a.i(668222),j=a.i(408696);let k=[.22,1,.36,1],l=[{id:"coffee",num:"01",name:{en:"Coffee & Side Tables",ar:"طاولات قهوة وجانبية"},kicker:{en:"The centre table",ar:"طاولة الوسط"},blurbKey:"col_world_coffee",href:"/shop/tables",video:"/evora/vid-coffee.mp4",poster:"/evora/vid-coffee.jpg"},{id:"sofa",num:"02",name:{en:"Sofas & Couches",ar:"كنب وأرائك"},kicker:{en:"The living room",ar:"غرفة المعيشة"},blurbKey:"col_world_sofa",href:"/shop/sofas",video:"/evora/vid-sofa.mp4",poster:"/evora/vid-sofa.jpg"},{id:"armchair",num:"03",name:{en:"Armchairs & Seating",ar:"كراسي ومقاعد"},kicker:{en:"The reading corner",ar:"ركن القراءة"},blurbKey:"col_world_armchair",href:"/shop/seating",video:"/evora/vid-armchair.mp4",poster:"/evora/vid-armchair.jpg"},{id:"bed",num:"04",name:{en:"Beds & Bedrooms",ar:"أسرّة وغرف نوم"},kicker:{en:"The bedroom",ar:"غرفة النوم"},blurbKey:"col_world_bed",href:"/shop/bedroom",video:"/evora/vid-bed.mp4",poster:"/evora/vid-bed.jpg"}],m=[{id:"accessories",name:{en:"Accessories",ar:"إكسسوارات"},kicker:{en:"Objects & vessels",ar:"تُحف وأوانٍ"},img:"/evora/p11.jpg",href:"/shop/decor"},{id:"lighting",name:{en:"Lighting",ar:"إضاءة"},kicker:{en:"Pendants & sconces",ar:"ثريّات ومعلّقات"},img:"/evora/p10.jpg",href:"/shop/lighting"},{id:"rugs",name:{en:"Rugs & Textiles",ar:"سجاد ومنسوجات"},kicker:{en:"Hand-knotted",ar:"معقود باليد"},img:"/evora/p09.jpg",href:"/shop/rugs"},{id:"storage",name:{en:"Wardrobes & Storage",ar:"خزائن وتخزين"},kicker:{en:"Made to measure",ar:"حسب القياس"},img:"/evora/p02.jpg",href:"/shop/storage"},{id:"tables",name:{en:"Coffee & Side Tables",ar:"طاولات قهوة وجانبية"},kicker:{en:"The centre table",ar:"طاولة الوسط"},img:"/evora/p04.jpg",href:"/shop/tables"},{id:"seating",name:{en:"Armchairs & Seating",ar:"كراسي ومقاعد"},kicker:{en:"Sculpted seating",ar:"مقاعد منحوتة"},img:"/evora/ig-chesterfield.jpg",href:"/shop/seating"}];function n({world:a,i}){let{t:k,lang:l}=(0,d.useT)(),m=(0,h.useReducedMotion)(),o=(0,c.useRef)(null),[p,q]=(0,c.useState)(!1);(0,c.useEffect)(()=>{let a=window.matchMedia("(max-width: 768px)"),b=()=>q(a.matches);return b(),a.addEventListener("change",b),()=>a.removeEventListener("change",b)},[]);let r=p?a.poster.replace(/\.(\w+)$/,"-mobile.$1"):a.poster,{scrollYProgress:s}=(0,f.useScroll)({target:o,offset:["start end","end start"]}),t=(0,g.useTransform)(s,[0,1],["-12%","12%"]),u=(0,g.useTransform)(s,[0,.5,1],[1.12,1,1.08]),v=(0,g.useTransform)(s,[0,.32],["inset(14% 8% 14% 8% round 6px)","inset(0% 0% 0% 0% round 6px)"]),w=(0,g.useTransform)(s,[.1,.45],[60,0]),x=(0,g.useTransform)(s,[.1,.45],[0,1]);return(0,b.jsx)("a",{ref:o,href:a.href,className:"world","data-cursor":"hover",lang:l,children:(0,b.jsxs)(e.motion.div,{className:"world__frame",style:m?void 0:{clipPath:v},children:[(0,b.jsxs)(e.motion.div,{className:"world__media",style:m?void 0:{y:t,scale:u},children:[(0,b.jsx)(j.default,{className:"world__video",src:a.video,poster:r}),(0,b.jsx)("span",{className:"world__scrim"}),(0,b.jsx)("span",{className:"world__grain","aria-hidden":!0})]}),(0,b.jsx)("span",{className:"world__num display",children:a.num}),(0,b.jsxs)(e.motion.div,{className:"world__cap",style:m?void 0:{y:w,opacity:x},children:[(0,b.jsx)("span",{className:"world__count",children:a.kicker[l]}),(0,b.jsx)("span",{className:"world__name display",children:a.name[l]}),(0,b.jsx)("span",{className:"world__blurb",children:k(a.blurbKey)}),(0,b.jsxs)("span",{className:"world__cta",children:["en"===l?"Step inside":"ادخل",(0,b.jsx)("span",{className:"world__arrow","aria-hidden":!0,children:"↗"})]})]})]})})}function o({card:a,i:c}){let{lang:f}=(0,d.useT)(),g=(0,h.useReducedMotion)();return(0,b.jsxs)(e.motion.a,{href:a.href,className:"rcard","data-cursor":"hover",initial:!g&&{opacity:0,y:26},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.7,ease:k,delay:c%4*.07},children:[(0,b.jsxs)("div",{className:"rcard__imgwrap",children:[(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{media:"(max-width: 768px)",srcSet:a.img.replace(/\.(\w+)$/,"-mobile.$1")}),(0,b.jsx)("img",{src:a.img,alt:a.name[f],className:"rcard__img",loading:"lazy"})]}),(0,b.jsx)("span",{className:"rcard__scrim"})]}),(0,b.jsxs)("div",{className:"rcard__meta",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("span",{className:"rcard__count",children:a.kicker[f]}),(0,b.jsx)("span",{className:"rcard__name display",children:a.name[f]})]}),(0,b.jsx)("span",{className:"rcard__arrow","aria-hidden":!0,children:"↗"})]})]})}a.s(["default",0,function(){let{t:a,lang:c}=(0,d.useT)(),f="en"===c;return(0,b.jsxs)("section",{id:"collections",className:"rooms",lang:c,children:[(0,b.jsxs)("div",{className:"container rooms__intro",children:[(0,b.jsxs)("div",{className:"rooms__introtext",children:[(0,b.jsxs)("div",{className:"rooms__kick",children:[(0,b.jsx)(e.motion.span,{className:"rooms__rule",initial:{scaleX:0},whileInView:{scaleX:1},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.9,ease:k}}),(0,b.jsx)(i.Rise,{as:"span",className:"eyebrow rooms__eyebrow",children:f?"Explore the collection":"استكشف المجموعة"})]}),(0,b.jsx)(i.RevealLines,{lines:f?["Every world,","one address."]:["كل العوالم،","عنوان واحد."],className:"display rooms__title",delay:.06}),(0,b.jsx)(i.Rise,{delay:.12,as:"p",className:"rooms__sub",children:f?"Step through the rooms of Evora — then everything that finishes the home.":"تنقّل بين غرف إيفورا — ثم كل ما يكمّل البيت."})]}),(0,b.jsxs)("a",{href:"/showroom",className:"rooms__film","data-cursor":"hover",children:[(0,b.jsx)(j.default,{className:"rooms__filmvideo",src:"/evora/hero-c.mp4",poster:"/evora/room-living.jpg"}),(0,b.jsx)("span",{className:"rooms__filmscrim"}),(0,b.jsx)("span",{className:"rooms__filmbadge",children:a("col_film_badge")}),(0,b.jsxs)("div",{className:"rooms__filmcap",children:[(0,b.jsx)("span",{className:"rooms__filmt display",children:a("col_film_caption")}),(0,b.jsx)("span",{className:"rooms__filmarrow","aria-hidden":!0,children:"↗"})]})]})]}),(0,b.jsx)("div",{className:"container rooms__resthead",children:(0,b.jsx)(i.Rise,{delay:.04,as:"h3",className:"display rooms__resttitle",children:f?"Browse by category":"تصفّح حسب الفئة"})}),(0,b.jsxs)("div",{className:"container rooms__grid",children:[m.map((a,c)=>(0,b.jsx)(o,{card:a,i:c},a.id)),(0,b.jsxs)("a",{href:"/shop",className:"rcard rcard--cta","data-cursor":"hover",children:[(0,b.jsx)("span",{className:"rcard__ctak",children:f?"Everything":"كل القطع"}),(0,b.jsx)("span",{className:"rcard__ctat display",children:f?"View the full catalogue":"تصفّح الكتالوج كاملًا"}),(0,b.jsx)("span",{className:"rcard__ctaarrow","aria-hidden":!0,children:"→"})]})]}),(0,b.jsx)("div",{className:"rooms__worlds",children:l.map((a,c)=>(0,b.jsx)(n,{world:a,i:c},a.id))}),(0,b.jsx)("style",{children:`
        .rooms { position: relative; background: var(--paper); padding-block: clamp(3rem, 7vw, 6rem) clamp(4rem, 9vw, 8rem); }

        .rooms__head { margin-bottom: clamp(2rem, 4vw, 3.4rem); }
        .rooms__kick { display: flex; align-items: center; gap: 1rem; }
        .rooms__rule { display: block; width: 64px; height: 1px; background: var(--brass); transform-origin: left; flex-shrink: 0; }
        html[dir="rtl"] .rooms__rule { transform-origin: right; }
        .rooms__eyebrow { color: var(--brass); display: block; }
        .rooms__title { font-size: clamp(2.4rem, 6vw, 5rem); line-height: 1; margin: 1rem 0 0; }
        .rooms__sub { color: var(--ink-soft); max-width: 46ch; margin: 1rem 0 0; font-size: 0.98rem; }

        /* ── cinematic worlds ── */
        .rooms__worlds { display: flex; flex-direction: column; gap: clamp(1rem, 2.2vw, 2rem); padding-inline: var(--gut); margin-top: clamp(1.5rem, 3vw, 2.5rem); }
        .world { position: relative; display: block; }
        .world__frame {
          position: relative; overflow: hidden; border-radius: 6px;
          height: clamp(340px, 72vh, 760px); will-change: clip-path;
        }
        .world__media { position: absolute; inset: -1px; will-change: transform; }
        .world__video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .world__scrim {
          position: absolute; inset: 0;
          background:
            linear-gradient(180deg, rgba(16,15,13,0.18) 0%, transparent 30%, transparent 50%, rgba(16,15,13,0.72) 100%),
            linear-gradient(90deg, rgba(16,15,13,0.42) 0%, transparent 46%);
        }
        html[dir="rtl"] .world__scrim {
          background:
            linear-gradient(180deg, rgba(16,15,13,0.18) 0%, transparent 30%, transparent 50%, rgba(16,15,13,0.72) 100%),
            linear-gradient(270deg, rgba(16,15,13,0.42) 0%, transparent 46%);
        }
        .world__grain { position: absolute; inset: 0; opacity: 0.05; mix-blend-mode: overlay;
          background-image: radial-gradient(rgba(255,255,255,0.7) 0.5px, transparent 0.6px);
          background-size: 3px 3px; pointer-events: none; }
        .world__num {
          position: absolute; top: clamp(1rem, 2vw, 1.8rem); inset-inline-end: clamp(1.2rem, 2.4vw, 2.2rem);
          color: rgba(251,247,240,0.5); font-size: clamp(2rem, 5vw, 4.2rem); line-height: 1; letter-spacing: 0.02em;
        }
        .world__cap {
          position: absolute; inset-inline-start: clamp(1.4rem, 4vw, 3.4rem); bottom: clamp(1.4rem, 3.5vw, 3rem);
          max-width: 30ch; color: var(--paper); display: flex; flex-direction: column; gap: 0.5rem;
        }
        .world__count { font-size: 0.66rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--brass-2); }
        html[dir="rtl"] .world__count { letter-spacing: 0.08em; }
        .world__name { font-size: clamp(2rem, 5vw, 4rem); line-height: 0.98; }
        .world__blurb { font-size: clamp(0.92rem, 1.4vw, 1.08rem); color: rgba(251,247,240,0.82); max-width: 34ch; margin-top: 0.2rem; }
        .world__cta { display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 0.7rem;
          font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--paper);
          border-bottom: 1px solid rgba(251,247,240,0.4); padding-bottom: 3px; width: fit-content; }
        .world__arrow { color: var(--brass-2); font-size: 1rem; transition: transform .5s var(--ease); }
        html[dir="rtl"] .world__arrow { transform: scaleX(-1); }
        .world:hover .world__arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .world:hover .world__arrow { transform: translate(-3px, -3px) scaleX(-1); }

        /* ── the rest: header ── */
        .rooms__resthead { margin-top: clamp(3.5rem, 7vw, 6rem); margin-bottom: clamp(1.6rem, 3vw, 2.6rem); }
        .rooms__resteyebrow { color: var(--brass); display: block; }
        .rooms__resttitle { font-size: clamp(1.7rem, 3.6vw, 2.8rem); margin-top: 0.5rem; line-height: 1.04; }

        /* ── slide-in cards ── */
        .rooms__grid {
          display: grid; gap: clamp(14px, 1.6vw, 24px);
          grid-template-columns: repeat(4, 1fr);
        }
        .rcard { position: relative; display: flex; flex-direction: column; border-radius: 4px; overflow: hidden; will-change: transform, opacity; }
        .rcard__imgwrap { position: relative; aspect-ratio: 3 / 4; overflow: hidden; }
        .rcard__img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.04);
          transition: transform 1.1s var(--ease); filter: saturate(0.98); }
        .rcard:hover .rcard__img { transform: scale(1.11); }
        .rcard__scrim { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 44%, rgba(16,15,13,0.7) 100%); }
        .rcard__meta { position: absolute; inset-inline: 0; bottom: 0; padding: 1rem 1.1rem;
          display: flex; align-items: flex-end; justify-content: space-between; gap: 0.8rem; }
        .rcard__count { display: block; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(251,247,240,0.78); margin-bottom: 5px; }
        html[dir="rtl"] .rcard__count { letter-spacing: 0.06em; }
        .rcard__name { font-size: clamp(1.05rem, 1.5vw, 1.4rem); color: var(--paper); line-height: 1.05; }
        .rcard__arrow { color: var(--paper); font-size: 1rem; opacity: 0; transition: opacity .5s var(--ease), transform .5s var(--ease); }
        .rcard:hover .rcard__arrow { opacity: 1; transform: translateY(-3px); }
        html[dir="rtl"] .rcard__arrow { transform: scaleX(-1); }

        .rcard--cta { justify-content: center; align-items: flex-start; gap: 0.8rem;
          padding: 1.8rem clamp(1.2rem, 1.8vw, 1.8rem); background: var(--ever); color: var(--paper); }
        .rcard__ctak { font-size: 0.64rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass-2); }
        .rcard__ctat { font-size: clamp(1.3rem, 1.9vw, 1.7rem); color: var(--paper); line-height: 1.08; }
        .rcard__ctaarrow { font-size: 1.4rem; color: var(--brass-2); transition: transform .5s var(--ease); }
        .rcard--cta:hover .rcard__ctaarrow { transform: translateX(6px); }
        html[dir="rtl"] .rcard__ctaarrow { transform: scaleX(-1); }

        /* ── intro: showroom film + heading ── */
        .rooms__intro { display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(1.6rem, 4vw, 3.6rem); align-items: center; margin-bottom: clamp(2rem, 4vw, 3.4rem); }
        .rooms__introtext { min-width: 0; }
        .rooms__film { position: relative; display: block; overflow: hidden; border-radius: 8px; aspect-ratio: 16 / 10; box-shadow: 0 30px 80px -40px rgba(16,15,13,0.5); }
        .rooms__filmvideo { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1.02); transition: transform 1.2s var(--ease); }
        .rooms__film:hover .rooms__filmvideo { transform: scale(1.06); }
        .rooms__filmscrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(16,15,13,0.05) 0%, transparent 40%, rgba(16,15,13,0.62) 100%); }
        .rooms__filmbadge { position: absolute; top: 1rem; inset-inline-start: 1rem; background: rgba(251,247,240,0.92); color: var(--ink); font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.45em 0.8em; border-radius: 100px; }
        .rooms__filmcap { position: absolute; inset-inline: 1.2rem; bottom: 1.1rem; display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; color: var(--paper); }
        .rooms__filmt { font-size: clamp(1.5rem, 2.4vw, 2.4rem); line-height: 1.03; }
        .rooms__filmarrow { color: var(--brass-2); font-size: 1.4rem; transition: transform .5s var(--ease); }
        .rooms__film:hover .rooms__filmarrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .rooms__filmarrow { transform: scaleX(-1); }
        .rooms__resthead { margin-top: clamp(2.4rem, 5vw, 4rem); margin-bottom: clamp(1.4rem, 3vw, 2.4rem); }
        .rooms__resttitle { font-size: clamp(1.7rem, 3.6vw, 2.8rem); line-height: 1.04; }

        @media (max-width: 900px) {
          .rooms__grid { grid-template-columns: repeat(2, 1fr); }
          .rooms__intro { grid-template-columns: 1fr; }
          .rooms__film { aspect-ratio: 16 / 11; }
        }
        @media (max-width: 640px) {
          /* worlds go full-bleed on phones for cinematic impact */
          .rooms__worlds { padding-inline: 0; gap: 2px; margin-inline: 0; }
          /* the room clips are landscape 16:9 — match the frame to that aspect so
             the video shows as a full rectangle (like desktop) instead of being
             cropped into a tall near-square box */
          .world__frame {
            aspect-ratio: 16 / 9;
            height: auto;
            border-radius: 0;
          }
          /* keep the overlaid caption compact in the shorter card */
          .world__blurb { display: none; }
          /* stronger, readable scrim under the caption on small screens */
          .world__scrim {
            background:
              linear-gradient(180deg, rgba(16,15,13,0.30) 0%, transparent 26%, transparent 40%, rgba(16,15,13,0.86) 100%);
          }
          html[dir="rtl"] .world__scrim {
            background:
              linear-gradient(180deg, rgba(16,15,13,0.30) 0%, transparent 26%, transparent 40%, rgba(16,15,13,0.86) 100%);
          }
          .world__cap {
            inset-inline: clamp(1.2rem, 6vw, 1.8rem);
            bottom: clamp(1.4rem, 5vw, 2rem);
            max-width: none;
          }
          .world__name { font-size: clamp(1.9rem, 9vw, 2.8rem); }
          .world__blurb { font-size: clamp(0.95rem, 4vw, 1.05rem); max-width: 30ch; }
          /* the whole panel is the tap target; make the visible CTA ≥44px */
          .world__cta { min-height: 44px; align-items: center; padding-block: 6px; }
        }
        @media (max-width: 520px) {
          .rooms__grid { grid-template-columns: 1fr; }
        }
      `})]})}])},309470,a=>{"use strict";let b;var c=a.i(187924),d=a.i(572131),e=a.i(635577),f=a.i(346271),g=a.i(262036),h=a.i(621216),i=a.i(668222),j=a.i(525539),k=a.i(430499);let l=[.22,1,.36,1],m={New:"جديد",Bestseller:"الأكثر مبيعًا",Limited:"إصدار محدود"},n=(b=new Set,j.SHOP_CATEGORIES.flatMap(a=>{let c=[];for(let d of j.shopProducts){if(c.length>=4)break;d.category!==a||b.has(d.name)||(b.add(d.name),c.push(d))}return c}));function o({base:a,alt:b,className:d}){return(0,c.jsxs)("picture",{children:[(0,c.jsx)("source",{srcSet:`${a}.avif`,type:"image/avif"}),(0,c.jsx)("img",{src:`${a}.webp`,alt:b,className:d,loading:"lazy"})]})}let p=[{id:"living",num:"01",name:{en:"Living Room",ar:"غرفة المعيشة"},note:{en:"Where the home gathers",ar:"حيث يجتمع البيت"},img:"/evora/rooms/living",href:"/shop/living",pieces:[{en:"Sofas",ar:"كنب"},{en:"Armchairs",ar:"كراسي"},{en:"Coffee Tables",ar:"طاولات قهوة"},{en:"Fireplaces",ar:"مدافئ"}]},{id:"dining",num:"02",name:{en:"Dining Room",ar:"غرفة الطعام"},note:{en:"Long evenings, well set",ar:"أمسياتٌ طويلة وسفرةٌ أنيقة"},img:"/evora/rooms/dining",href:"/shop/dining",pieces:[{en:"Dining Tables",ar:"طاولات طعام"},{en:"Chairs",ar:"كراسي"},{en:"Sideboards",ar:"بوفيهات"},{en:"Shelving",ar:"أرفف"}]},{id:"bedroom",num:"03",name:{en:"Bedroom",ar:"غرفة النوم"},note:{en:"The quiet end of the day",ar:"نهاية اليوم الهادئة"},img:"/evora/rooms/bedroom",href:"/shop/bedroom",pieces:[{en:"Beds",ar:"أسرّة"},{en:"Wardrobes",ar:"خزائن"},{en:"Dressing Tables",ar:"تسريحات"},{en:"Nightstands",ar:"كومدينات"}]},{id:"guest",num:"04",name:{en:"Guest Room",ar:"غرفة الضيوف"},note:{en:"Where guests see your taste first",ar:"حيث يرى ضيوفك ذوقك أوّلًا"},img:"/evora/rooms/guest-v2",href:"/shop/guest",pieces:[{en:"Majlis Seating",ar:"جلسات مجلس"},{en:"Ottomans",ar:"بوفات"},{en:"Side Tables",ar:"طاولات جانبية"},{en:"Cushions",ar:"وسائد"}]},{id:"tables",num:"05",name:{en:"Tables & Accessories",ar:"طاولات وإكسسوارات"},note:{en:"The finishing details",ar:"اللمسات الأخيرة"},img:"/evora/rooms/tables-v2",href:"/shop/tables",pieces:[{en:"Console Tables",ar:"طاولات كونسول"},{en:"Floor & Table Lamps",ar:"أباجورات وقوايم"},{en:"Vases",ar:"مزهريات"},{en:"Curtains",ar:"ستائر"}]},{id:"chandeliers",num:"06",name:{en:"Chandeliers",ar:"الثريات"},note:{en:"Light, made an occasion",ar:"ضوءٌ يصنع المناسبة"},img:"/evora/rooms/chandeliers-v2",href:"/shop/chandeliers",pieces:[{en:"Chandeliers",ar:"ثريات"},{en:"Pendants",ar:"معلّقات"},{en:"Ceiling Fans",ar:"مراوح سقف"},{en:"Wall Lights",ar:"إضاءة جدارية"}]}],q=[{id:"600-heaven",name:"600 Heaven",note:{en:"Curved sofa salon · ring chandelier",ar:"صالة بكنب منحنٍ · ثريا حلقيّة"},hero:"/evora-legacy/products/600-heaven-1.webp",gallery:["/evora-legacy/products/600-heaven-2.webp","/evora-legacy/products/600-heaven-3.webp"],href:"/shop/living"},{id:"700-heaven",name:"700 Heaven",note:{en:"Boucle sofa · marble nesting tables",ar:"كنبة بوكليه · طاولات رخاميّة متداخلة"},hero:"/evora-legacy/products/700-heaven-1.webp",gallery:["/evora-legacy/products/700-heaven-2.webp","/evora-legacy/products/700-heaven-3.webp"],href:"/shop/living"}];a.s(["default",0,function(){let{lang:a,dir:b}=(0,e.useT)(),r="ar"===a,s=(0,h.useReducedMotion)(),[t,u]=(0,d.useState)(0),[v,w]=(0,d.useState)(null),x=p[t],y=(0,d.useRef)(null),z=(0,d.useRef)([]),[A,B]=(0,d.useState)({top:0,height:0});return(0,d.useEffect)(()=>{if(s||window.matchMedia("(max-width: 860px)").matches)return;let a=new IntersectionObserver(a=>{a.forEach(a=>{if(!a.isIntersecting)return;let b=Number(a.target.dataset.i);Number.isNaN(b)||u(b)})},{rootMargin:"-45% 0px -45% 0px",threshold:0});return z.current.forEach(b=>b&&a.observe(b)),()=>a.disconnect()},[s]),(0,d.useEffect)(()=>{let a=()=>{let a=y.current,b=z.current[t];if(!a||!b)return;let c=a.getBoundingClientRect(),d=b.getBoundingClientRect();B({top:d.top-c.top,height:d.height})};return a(),window.addEventListener("resize",a),()=>window.removeEventListener("resize",a)},[t]),(0,c.jsxs)("section",{id:"rooms",dir:b,className:"rm",lang:a,children:[(0,c.jsxs)("div",{className:"container rm__head",children:[(0,c.jsxs)(i.Rise,{as:"span",className:"rm__kicker",children:[(0,c.jsx)("span",{className:"rm__rule"}),r?"تسوّق حسب الغرفة":"Shop by room"]}),(0,c.jsx)(i.Rise,{delay:.06,as:"h2",className:"rm__title",children:r?(0,c.jsxs)(c.Fragment,{children:["كل غرفة في البيت، ",(0,c.jsx)("em",{children:"تحت سقف واحد."})]}):(0,c.jsxs)(c.Fragment,{children:["Every room of the home, ",(0,c.jsx)("em",{children:"under one roof."})]})}),(0,c.jsx)(i.Rise,{delay:.12,as:"p",className:"rm__lede",children:r?"من غرفة المعيشة إلى الثريا فوق المائدة — تشكيلة إيفورا الكاملة، مرتّبة كما تعيشها.":"From the living room to the chandelier above the table — the full Evora collection, arranged the way you live in it."})]}),(0,c.jsxs)("div",{className:"container rm__scrollarea",children:[(0,c.jsxs)("a",{className:"rm__stage",href:x.href,"aria-label":x.name[a],children:[(0,c.jsx)(g.AnimatePresence,{initial:!1,mode:"popLayout",children:(0,c.jsx)(f.motion.div,{className:"rm__pic",initial:!s&&{opacity:0,scale:1.06},animate:{opacity:1,scale:1},exit:s?{opacity:0}:{opacity:0,scale:1.02},transition:{duration:.7,ease:l},children:(0,c.jsx)(o,{base:x.img,alt:x.name[a],className:"rm__img"})},x.id)}),(0,c.jsx)("div",{className:"rm__stageveil","aria-hidden":!0}),(0,c.jsxs)("div",{className:"rm__stagecap",children:[(0,c.jsx)("span",{className:"rm__stagenum",children:x.num}),(0,c.jsxs)("div",{children:[(0,c.jsx)("span",{className:"rm__stagename",children:x.name[a]}),(0,c.jsx)("span",{className:"rm__stagenote",children:x.note[a]})]})]}),(0,c.jsx)("div",{className:"rm__pieces","aria-hidden":!0,children:x.pieces.map(b=>(0,c.jsx)("span",{className:"rm__piece",children:b[a]},b.en))}),(0,c.jsxs)("span",{className:"rm__enter",children:[r?"ادخل الغرفة":"Enter room"," →"]})]}),(0,c.jsxs)("ul",{className:"rm__list",ref:y,children:[(0,c.jsx)(f.motion.span,{className:"rm__listbar",animate:{top:A.top,height:A.height},initial:!1,transition:{duration:.45,ease:l},"aria-hidden":!0}),p.map((b,d)=>(0,c.jsx)("li",{ref:a=>{z.current[d]=a},"data-i":d,className:"rm__row",children:(0,c.jsxs)("a",{href:b.href,className:`rm__item${d===t?" is-active":""}`,"aria-current":d===t?"true":void 0,onMouseEnter:()=>u(d),onFocus:()=>u(d),children:[(0,c.jsx)("span",{className:"rm__inum",children:b.num}),(0,c.jsxs)("span",{className:"rm__itext",children:[(0,c.jsx)("span",{className:"rm__iname",children:b.name[a]}),(0,c.jsx)("span",{className:"rm__inote",children:b.note[a]})]}),(0,c.jsx)("span",{className:"rm__iarrow","aria-hidden":!0,children:"→"})]})},b.id))]})]}),(0,c.jsx)("div",{className:"container rm__mobile",children:p.map((b,d)=>(0,c.jsxs)(f.motion.a,{href:b.href,className:"rm__mcard",initial:!s&&{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"0px 0px -10% 0px"},transition:{duration:.6,ease:l,delay:s?0:d%3*.05},children:[(0,c.jsxs)("div",{className:"rm__mimgwrap",children:[(0,c.jsx)(o,{base:b.img,alt:b.name[a],className:"rm__mimg"}),(0,c.jsx)("div",{className:"rm__mveil","aria-hidden":!0}),(0,c.jsx)("div",{className:"rm__mpieces","aria-hidden":!0,children:b.pieces.slice(0,3).map(b=>(0,c.jsx)("span",{className:"rm__piece",children:b[a]},b.en))})]}),(0,c.jsxs)("div",{className:"rm__mmeta",children:[(0,c.jsx)("span",{className:"rm__inum",children:b.num}),(0,c.jsxs)("span",{className:"rm__itext",children:[(0,c.jsx)("span",{className:"rm__iname",children:b.name[a]}),(0,c.jsx)("span",{className:"rm__inote",children:b.note[a]})]}),(0,c.jsx)("span",{className:"rm__iarrow","aria-hidden":!0,children:"→"})]})]},b.id))}),(0,c.jsxs)("div",{className:"container rm__tax",children:[(0,c.jsx)(i.Rise,{as:"span",className:"rm__taxlabel",children:r?"كل ما يحتاجه كل ركن":"Everything for every corner"}),(0,c.jsx)("div",{className:"rm__cat",children:n.map((b,d)=>{let e=(0,j.shopProductCopy)(b,a);return(0,c.jsxs)(f.motion.button,{type:"button",onClick:()=>w(b),className:"rm__cat-item","data-cursor":"hover","aria-label":`${b.name} — ${e.tagline}`,initial:!s&&{opacity:0,y:16},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"0px 0px -8% 0px"},transition:{duration:.55,ease:l,delay:d%4*.05},children:[(0,c.jsxs)("div",{className:"rm__cat-imgwrap",children:[(0,c.jsx)("img",{src:b.image,alt:b.name,className:"rm__cat-img",loading:"lazy"}),b.badge?(0,c.jsx)("span",{className:"rm__cat-badge",children:r?m[b.badge]:b.badge}):null]}),(0,c.jsx)("span",{className:"rm__cat-name",children:b.name}),(0,c.jsx)("span",{className:"rm__cat-note",children:e.tagline})]},b.id)})}),(0,c.jsxs)("a",{href:"/shop",className:"rm__catall","data-cursor":"hover",children:[r?`تصفّح المجموعة كاملة — ${j.shopProducts.length} قطعة`:`View the full collection — ${j.shopProducts.length} pieces`,(0,c.jsx)("span",{className:"rm__parrow","aria-hidden":!0,children:"→"})]})]}),(0,c.jsx)(g.AnimatePresence,{children:v&&(0,c.jsx)(k.default,{product:v,onClose:()=>w(null)},v.id)}),(0,c.jsxs)("div",{className:"container rm__shop",children:[(0,c.jsxs)(i.Rise,{as:"header",className:"rm__shophead",children:[(0,c.jsx)("span",{className:"rm__taxlabel",style:{marginBottom:0},children:r?"من المتجر":"From the shop"}),(0,c.jsx)("h3",{className:"rm__shoptitle",children:r?"مجموعاتنا":"Our collections"})]}),(0,c.jsx)("div",{className:"rm__products",children:q.map((b,d)=>(0,c.jsxs)(f.motion.a,{href:b.href,className:"rm__product","data-cursor":"hover",initial:!s&&{opacity:0,y:22},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"0px 0px -10% 0px"},transition:{duration:.7,ease:l,delay:.08*d},children:[(0,c.jsxs)("div",{className:"rm__pimgwrap",children:[(0,c.jsx)("img",{src:b.hero,alt:b.name,className:"rm__pimg",loading:"lazy"}),(0,c.jsx)("span",{className:"rm__pveil"}),(0,c.jsx)("span",{className:"rm__pthumbs","aria-hidden":!0,children:b.gallery.map(a=>(0,c.jsx)("img",{src:a,alt:"",className:"rm__pthumb",loading:"lazy"},a))})]}),(0,c.jsxs)("div",{className:"rm__pmeta",children:[(0,c.jsx)("span",{className:"rm__pname",children:b.name}),(0,c.jsx)("span",{className:"rm__pnote",children:b.note[a]}),(0,c.jsxs)("span",{className:"rm__pcta",children:[r?"اكتشف المجموعة":"View collection",(0,c.jsx)("span",{className:"rm__parrow","aria-hidden":!0,children:"→"})]})]})]},b.id))})]}),(0,c.jsx)("style",{children:`
        .rm { padding-block: clamp(4rem, 9vw, 7.5rem); background: var(--paper); color: var(--ink); }
        /* editorial header: start-aligned, runs the container's full measure
           (like .rm__scrollarea/.rm__tax/.rm__shop below it) instead of being
           clamped to a narrow ch-width that .container's margin-inline: auto
           then floats in the middle of the page. */
        .rm__head { text-align: start; }
        .rm__kicker {
          display: inline-flex; align-items: center; gap: 0.85rem;
          font-family: var(--f-sans); font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.26em; text-transform: uppercase; color: var(--brass-2, #8a6d3f);
        }
        .rm__rule { display: inline-block; width: clamp(28px,6vw,56px); height: 1px;
          background: linear-gradient(to right, var(--brass), transparent); }
        html[dir="rtl"] .rm__rule { background: linear-gradient(to left, var(--brass), transparent); }
        .rm__title {
          font-family: var(--f-display), Georgia, serif; font-optical-sizing: auto;
          font-variation-settings: "opsz" 140, "WONK" 1; font-weight: 340;
          font-size: clamp(2.2rem, 5.2vw, 4.2rem); line-height: 1.0;
          letter-spacing: -0.022em; margin: 1.1rem 0 0; text-wrap: balance;
        }
        .rm__title em { font-style: italic; font-variation-settings: "opsz" 140,"SOFT" 60,"WONK" 1; color: var(--ever, #2f5d4a); }
        .rm__lede { max-width: 70ch; margin: 1.3rem 0 0; font-family: var(--f-sans);
          color: var(--ink-soft); font-size: clamp(1rem,1.3vw,1.14rem); line-height: 1.7; text-wrap: pretty; }

        /* ---- stage + list: sticky image pinned left, scroll-driven rows
           on the right (the grid cell auto-stretches to the list's taller
           height, which is what lets the sticky stage release at the end) ---- */
        .rm__scrollarea {
          display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
          gap: clamp(1.5rem, 4vw, 3.5rem);
          margin-top: clamp(2.5rem, 5vw, 4rem);
        }
        /* ONE frame ratio for every room. The photos used to be three shapes
           on disk (1.75:1 renders, 0.67:1 and 0.52:1 verticals) and this
           frame used to change shape per room to suit them, which is what
           produced the huge pillarbox voids. They are now all baked to the
           same 7:4 canvas by scripts/normalise-room-images.mjs, so the frame
           is fixed and object-fit: cover just fills it — no --stage-ratio, no
           max-height clamp, no explicit width to work around Chromium
           re-deriving a grid item's width from a clamped height.
           Background stays --ink (not the bone/paper page surface) because
           it is what shows for the instant before a photo decodes, and the
           caption + piece badges sitting on top of it are white. */
        .rm__stage {
          position: sticky; top: clamp(84px, 10vh, 112px); align-self: start;
          display: block; overflow: hidden;
          border-radius: 4px; aspect-ratio: 7 / 4;
          background: var(--ink);
          text-decoration: none; isolation: isolate;
        }
        .rm__pic { position: absolute; inset: 0; }
        .rm__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .rm__stageveil { position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(20,18,15,0.72) 0%, rgba(20,18,15,0.05) 42%, transparent 70%); }
        .rm__stagecap { position: absolute; z-index: 2; inset-inline-start: clamp(1.1rem,2.5vw,2rem);
          inset-block-end: clamp(1.1rem,2.5vw,1.8rem); display: flex; align-items: flex-end; gap: 0.9rem; color: var(--paper); }
        .rm__stagenum { font-family: var(--f-display), Georgia, serif; font-size: clamp(1.4rem,2.4vw,2rem);
          font-weight: 340; color: var(--brass); line-height: 1; }
        .rm__stagename { display: block; font-family: var(--f-display), Georgia, serif;
          font-weight: 360; font-size: clamp(1.5rem,3vw,2.4rem); line-height: 1.05; }
        .rm__stagenote { display: block; margin-top: 0.25rem; font-family: var(--f-sans);
          font-size: 0.84rem; letter-spacing: 0.02em; color: rgba(245,242,235,0.74); }
        .rm__pieces { position: absolute; z-index: 2; inset-block-start: clamp(1rem,2.2vw,1.6rem);
          inset-inline-start: clamp(1.1rem,2.5vw,2rem); display: flex; flex-wrap: wrap; gap: 0.4rem; max-width: 62%; }
        .rm__piece { font-family: var(--f-sans); font-size: 0.68rem; letter-spacing: 0.04em;
          color: var(--paper); background: rgba(255,255,255,0.12); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.18); padding: 0.28em 0.7em; border-radius: 999px; }
        .rm__enter { position: absolute; z-index: 2; inset-block-end: clamp(1.1rem,2.5vw,1.8rem);
          inset-inline-end: clamp(1.1rem,2.5vw,2rem); font-family: var(--f-sans); font-size: 0.8rem;
          font-weight: 600; letter-spacing: 0.04em; color: var(--paper);
          opacity: 0; transform: translateX(-6px); transition: opacity .4s var(--ease), transform .4s var(--ease); }
        html[dir="rtl"] .rm__enter { transform: translateX(6px); }
        .rm__stage:hover .rm__enter, .rm__stage:focus-visible .rm__enter { opacity: 1; transform: none; }
        .rm__stage:hover .rm__img { transform: scale(1.03); transition: transform 1.2s var(--ease); }

        .rm__list { position: relative; list-style: none; margin: 0; padding: 0;
          border-top: 1px solid var(--line); }
        .rm__listbar { position: absolute; inset-inline-start: 0; width: 2px;
          background: var(--ever, #2f5d4a); }
        .rm__row { min-height: 58vh; display: flex; align-items: center; }
        .rm__item { display: flex; align-items: center; gap: 1rem; width: 100%;
          padding: clamp(0.85rem,1.8vw,1.25rem) 0 clamp(0.85rem,1.8vw,1.25rem) 1.1rem;
          border-bottom: 1px solid var(--line); text-decoration: none; color: var(--ink);
          transition: color .35s var(--ease), padding-inline-start .35s var(--ease); }
        .rm__row:last-child .rm__item { border-bottom: none; }
        .rm__item:hover, .rm__item.is-active { padding-inline-start: 1.6rem; }
        .rm__inum { font-family: var(--f-sans); font-size: 0.74rem; font-weight: 600; letter-spacing: 0.1em;
          color: var(--brass-2); min-width: 2ch; align-self: flex-start; margin-top: 0.4em; }
        .rm__itext { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
        .rm__iname { font-family: var(--f-display), Georgia, serif; font-weight: 360;
          font-size: clamp(1.6rem,3.4vw,2.6rem); line-height: 1.05; letter-spacing: -0.01em;
          color: var(--ink-soft); transition: color .35s var(--ease); }
        .rm__inote { font-family: var(--f-sans); font-size: 0.86rem; color: var(--ink-faint);
          opacity: 0; transform: translateY(-4px); transition: opacity .35s var(--ease), transform .35s var(--ease); }
        .rm__item:hover .rm__iname, .rm__item.is-active .rm__iname { color: var(--ever, #2f5d4a); }
        .rm__item:hover .rm__inote, .rm__item.is-active .rm__inote { opacity: 1; transform: none; }
        .rm__iarrow { font-size: 1.1rem; color: var(--brass); opacity: 0; transform: translateX(-6px);
          transition: opacity .35s var(--ease), transform .35s var(--ease); align-self: flex-start; margin-top: 0.3em; }
        html[dir="rtl"] .rm__iarrow { transform: scaleX(-1) translateX(-6px); }
        .rm__item:hover .rm__iarrow, .rm__item.is-active .rm__iarrow { opacity: 1; transform: none; }
        html[dir="rtl"] .rm__item:hover .rm__iarrow, html[dir="rtl"] .rm__item.is-active .rm__iarrow { transform: scaleX(-1); }

        /* ---- mobile stacked cards (own image per room, no sticky/scroll-link) ---- */
        .rm__mobile { display: none; }
        .rm__mcard { display: block; text-decoration: none; color: var(--ink); }
        /* same fixed 7:4 as .rm__stage above — the normalised assets mean one
           shape serves every card, so the stack reads as a consistent grid
           instead of alternating tall/wide. --ink is the pre-decode ground
           under the white piece badges. */
        .rm__mimgwrap { position: relative; overflow: hidden; border-radius: 4px;
          aspect-ratio: 7 / 4; background: var(--ink); isolation: isolate; }
        .rm__mimg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .rm__mveil { position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(20,18,15,0.5) 0%, transparent 55%); }
        .rm__mpieces { position: absolute; z-index: 2; inset-block-start: 0.85rem; inset-inline-start: 0.85rem;
          display: flex; flex-wrap: wrap; gap: 0.35rem; max-width: 80%; }
        .rm__mmeta { display: flex; align-items: flex-start; gap: 0.9rem; padding: 1rem 0.2rem 0; }
        .rm__mmeta .rm__iname { font-size: clamp(1.3rem, 5.5vw, 1.6rem); color: var(--ink); }
        .rm__mmeta .rm__inote { opacity: 1; transform: none; }
        .rm__mmeta .rm__iarrow { opacity: 1; transform: none; color: var(--ink-faint); }

        /* ---- taxonomy strip ---- */
        .rm__tax { margin-top: clamp(3rem, 6vw, 5rem); padding-top: clamp(2rem,4vw,3rem); border-top: 1px solid var(--line); }
        .rm__taxlabel { display: block; text-align: center; font-family: var(--f-sans);
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--brass-2); margin-bottom: clamp(1.6rem,3vw,2.4rem); }
        .rm__cat { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(1rem, 2.2vw, 1.8rem); }
        /* these tiles are <button> (they open the quick-view), so the browser's
           button chrome has to be reset back to the plain tile they were as <a> */
        .rm__cat-item { display: flex; flex-direction: column; text-decoration: none; color: var(--ink);
          appearance: none; -webkit-appearance: none; background: none; border: 0; margin: 0;
          padding: 0; font: inherit; text-align: start; cursor: pointer; }
        /* centred under the grid, matching the centred .rm__taxlabel above it */
        .rm__catall { display: flex; width: fit-content; margin-inline: auto;
          align-items: center; gap: 0.5rem; margin-top: clamp(1.8rem, 3.5vw, 2.6rem);
          font-family: var(--f-sans); font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--ink); text-decoration: none; padding-bottom: 0.35rem;
          border-bottom: 1px solid var(--line); transition: border-color .3s, color .3s; }
        .rm__catall:hover { color: var(--brass, #9a7b4f); border-bottom-color: currentColor; }
        .rm__catall .rm__parrow { transition: transform .3s; }
        .rm__catall:hover .rm__parrow { transform: translateX(4px); }
        /* All 346 catalogue photos are a uniform 1600x1194 (1.3400:1) —
           0.5% off this frame's 4:3 (1.3333:1). cover trims ~6px of a 1194px
           image; contain would leave a sub-pixel mat that rounds into a
           visible hairline at some widths, so cover it is. --bone is the
           pre-decode ground (the badge pill is opaque on its own). */
        .rm__cat-imgwrap { position: relative; overflow: hidden; border-radius: 4px; aspect-ratio: 4 / 3;
          background: var(--bone); border: 1px solid var(--line); isolation: isolate; }
        .rm__cat-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: transform 1s var(--ease); }
        .rm__cat-item:hover .rm__cat-img, .rm__cat-item:focus-visible .rm__cat-img { transform: scale(1.05); }
        .rm__cat-badge { position: absolute; z-index: 2; inset-block-start: 0.55rem; inset-inline-start: 0.55rem;
          font-family: var(--f-sans); font-size: 0.6rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ink); background: rgba(255,255,255,0.86); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.6); padding: 0.3em 0.62em; border-radius: 999px; }
        .rm__cat-name { margin-top: 0.7rem; font-family: var(--f-display), Georgia, serif; font-weight: 360;
          font-size: clamp(1.05rem, 1.7vw, 1.32rem); line-height: 1.12; letter-spacing: -0.01em; color: var(--ink); }
        .rm__cat-note { margin-top: 0.15rem; font-family: var(--f-sans); font-size: 0.8rem;
          letter-spacing: 0.01em; color: var(--ink-faint); }

        /* ---- real catalogue (600 / 700 Heaven) ---- */
        .rm__shop { margin-top: clamp(3rem, 6vw, 5rem); padding-top: clamp(2rem,4vw,3rem); border-top: 1px solid var(--line); }
        .rm__shophead { text-align: center; margin-bottom: clamp(1.8rem,3.5vw,2.8rem); }
        .rm__shoptitle { font-family: var(--f-display), Georgia, serif; font-weight: 340;
          font-size: clamp(1.9rem, 4vw, 3rem); line-height: 1.02; letter-spacing: -0.02em;
          margin: 0.5rem 0 0; color: var(--ink); }
        .rm__products { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(1.2rem, 3vw, 2.4rem); }
        .rm__product { display: block; text-decoration: none; color: var(--ink); }
        /* 600/700 Heaven renders are all 1:1 square on disk and the frame is
           1:1 too (it was 4:3, which pillarboxed them), so cover and contain
           show the identical picture — cover just can't be caught out by
           sub-pixel rounding on a fractional column width. No text overlays
           the image (name/note live below it), so --bone is the placeholder
           ground rather than --ink. */
        .rm__pimgwrap { position: relative; overflow: hidden; border-radius: 4px;
          aspect-ratio: 1 / 1; background: var(--bone); isolation: isolate; }
        .rm__pimg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: transform 1.2s var(--ease); }
        .rm__product:hover .rm__pimg, .rm__product:focus-visible .rm__pimg { transform: scale(1.04); }
        .rm__pveil { position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(20,18,15,0.34) 0%, transparent 46%); }
        .rm__pthumbs { position: absolute; z-index: 2; inset-block-end: 0.7rem; inset-inline-end: 0.7rem;
          display: flex; gap: 0.4rem; opacity: 0; transform: translateY(6px);
          transition: opacity .4s var(--ease), transform .4s var(--ease); }
        .rm__product:hover .rm__pthumbs, .rm__product:focus-visible .rm__pthumbs { opacity: 1; transform: none; }
        .rm__pthumb { width: clamp(40px,5vw,58px); aspect-ratio: 1; object-fit: cover; border-radius: 3px;
          background: var(--bone);
          border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 14px rgba(0,0,0,0.35); }
        .rm__pmeta { display: flex; flex-direction: column; gap: 0.2rem; padding: 0.9rem 0.2rem 0; }
        .rm__pname { font-family: var(--f-display), Georgia, serif; font-weight: 360;
          font-size: clamp(1.3rem,2.2vw,1.8rem); line-height: 1.1; letter-spacing: -0.01em; color: var(--ink); }
        .rm__pnote { font-family: var(--f-sans); font-size: 0.86rem; letter-spacing: 0.01em; color: var(--ink-faint); }
        .rm__pcta { display: inline-flex; align-items: center; gap: 0.45rem; margin-top: 0.5rem;
          font-family: var(--f-sans); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em;
          color: var(--brass); }
        .rm__parrow { transition: transform .35s var(--ease); }
        html[dir="rtl"] .rm__parrow { transform: scaleX(-1); }
        .rm__product:hover .rm__parrow { transform: translateX(4px); }
        html[dir="rtl"] .rm__product:hover .rm__parrow { transform: scaleX(-1) translateX(4px); }
        @media (max-width: 720px) {
          .rm__products { grid-template-columns: 1fr; gap: 1.6rem; }
        }

        @media (max-width: 860px) {
          /* the sticky scroll-linked gallery only really works with room to
             breathe beside a pinned image — below this width, swap to the
             stacked mobile cards (each with its own image) instead. */
          .rm__scrollarea { display: none; }
          .rm__mobile { display: flex; flex-direction: column; gap: 1.6rem; margin-top: clamp(2rem, 5vw, 3rem); }
          .rm__cat { grid-template-columns: repeat(3, 1fr); row-gap: 1.6rem; }
        }
        @media (max-width: 460px) {
          .rm__cat { grid-template-columns: repeat(2, 1fr); }
        }
      `})]})}])},248825,a=>{"use strict";var b=a.i(187924),c=a.i(635577),d=a.i(482665),e=a.i(668222);a.s(["default",0,function(){let{t:a,lang:f}=(0,c.useT)(),g="ar"===f;return(0,b.jsxs)("section",{id:"financing",className:"section fin",style:{background:"var(--bone)",color:"var(--ink)"},children:[(0,b.jsx)("div",{className:"container",children:(0,b.jsxs)("div",{className:"fin-grid",children:[(0,b.jsxs)(e.Rise,{className:"fin-figure",y:36,children:[(0,b.jsx)(e.ParallaxImage,{src:"/evora/p10.jpg",alt:"ar"===f?"غرفة معيشة مؤثّثة بالكامل من إيفورا":"A living room fully furnished by Evora",amount:10,className:"fin-photo"}),(0,b.jsx)("span",{className:"fin-figcaption",children:g?"بيت من إيفورا · عمّان":"An Evora home · Amman"})]}),(0,b.jsxs)(e.Rise,{className:"fin-panel",delay:.08,y:36,children:[(0,b.jsx)("span",{className:"fin-panel-grain","aria-hidden":"true"}),(0,b.jsxs)("div",{className:"fin-panel-body",children:[(0,b.jsx)(e.Rise,{as:"span",className:"eyebrow fin-eyebrow",delay:.12,children:a("fin_eyebrow")}),(0,b.jsx)(e.RevealLines,{lines:[a("fin_title")],className:"display fin-title",delay:.16}),(0,b.jsx)(e.Rise,{delay:.24,children:(0,b.jsx)("p",{className:"fin-body",children:a("fin_body")})}),(0,b.jsxs)(e.Rise,{delay:.3,children:[(0,b.jsxs)("div",{className:"fin-stat",children:[(0,b.jsx)("span",{className:"fin-stat-upto",children:g?"حتى":"up to"}),(0,b.jsx)(e.CountUp,{value:"24",className:"fin-stat-num"}),(0,b.jsx)("span",{className:"fin-stat-unit",children:g?"شهرًا":"months"})]}),(0,b.jsx)("p",{className:"fin-stat-cap",children:g?"بدون ربا · بنفس سعر الكاش":"Interest-free, same cash price"})]}),(0,b.jsx)(e.Stagger,{className:"fin-list",delay:.34,children:d.financingPoints.map((a,c)=>(0,b.jsxs)(e.StaggerItem,{className:"fin-item",children:[(0,b.jsx)("svg",{className:"fin-mark",viewBox:"0 0 12 12",fill:"currentColor","aria-hidden":"true",children:(0,b.jsx)("path",{d:"M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z"})}),(0,b.jsx)("span",{children:a[f]})]},c))}),(0,b.jsx)(e.Rise,{delay:.42,children:(0,b.jsx)("p",{className:"fin-bank",children:g?"عبر بنك صفوة الإسلامي":"via Safwa Islamic Bank"})}),(0,b.jsx)(e.Rise,{delay:.48,children:(0,b.jsxs)("div",{className:"fin-actions",children:[(0,b.jsx)(e.Magnetic,{children:(0,b.jsxs)("a",{href:"/visit",className:"btn fin-btn-solid",children:[a("consult"),(0,b.jsx)("span",{className:"arrow","aria-hidden":"true",children:"↗"})]})}),(0,b.jsx)("a",{href:"/visit",className:"btn fin-btn-ghost",children:a("visit_cta")})]})})]})]})]})}),(0,b.jsx)("style",{children:`
        .fin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 4vw, 4.5rem);
          align-items: stretch;
        }

        /* ---- LEFT photo ---- */
        .fin-figure {
          position: relative;
          align-self: stretch;
        }
        .fin-photo {
          width: 100%;
          height: 100%;
          min-height: clamp(420px, 60vh, 760px);
          aspect-ratio: 4 / 5;
          border-radius: 4px;
          box-shadow:
            0 2px 1px rgba(27,25,22,0.04),
            0 38px 80px -34px rgba(27,25,22,0.45);
        }
        .fin-figcaption {
          position: absolute;
          inset-block-end: 1.2rem;
          inset-inline-start: 1.3rem;
          z-index: 2;
          padding: 0.5rem 0.85rem;
          border-radius: 100px;
          font-size: 0.64rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--paper);
          background: rgba(27,25,22,0.32);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        html[dir="rtl"] .fin-figcaption { letter-spacing: 0.06em; }

        /* ---- RIGHT panel ---- */
        .fin-panel {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          background:
            radial-gradient(120% 90% at 12% 0%, rgba(76,90,64,0.55), transparent 60%),
            var(--ever);
          color: var(--paper);
          box-shadow: 0 38px 80px -40px rgba(27,25,22,0.5);
        }
        .fin-panel-grain {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.4;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }
        .fin-panel-body {
          position: relative;
          z-index: 1;
          padding: clamp(2.2rem, 4vw, 3.6rem);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .fin-eyebrow {
          display: block;
          color: var(--brass-2);
        }
        .fin-title {
          color: var(--paper);
          font-size: clamp(2rem, 4vw, 3.4rem);
          line-height: 1.02;
          margin: 1rem 0 0;
        }
        html[dir="rtl"] .fin-title { line-height: 1.2; }
        .fin-body {
          color: rgba(251,247,240,0.8);
          font-size: clamp(1rem, 1.15vw, 1.08rem);
          line-height: 1.72;
          max-width: 42ch;
          margin: 1.3rem 0 0;
        }

        /* big brass stat */
        .fin-stat {
          display: flex;
          align-items: baseline;
          gap: 0.5ch;
          margin: 2rem 0 0;
          font-family: var(--font-display);
          font-weight: 420;
          color: var(--brass-2);
          line-height: 0.92;
        }
        html[dir="rtl"] .fin-stat { font-family: var(--font-ar); font-weight: 600; }
        .fin-stat-upto { font-size: clamp(1rem, 2vw, 1.4rem); color: rgba(197,160,106,0.7); align-self: flex-start; margin-top: 0.4rem; }
        .fin-stat-num { font-size: clamp(3.4rem, 8vw, 5.2rem); }
        .fin-stat-unit { font-size: clamp(1.2rem, 2.6vw, 1.8rem); color: rgba(197,160,106,0.78); }
        .fin-stat-cap { margin: 0.55rem 0 0; font-size: 0.82rem; letter-spacing: 0.02em; color: rgba(251,247,240,0.6); }

        /* points list */
        .fin-list {
          margin: 1.6rem 0 0;
          border-top: 1px solid rgba(251,247,240,0.16);
        }
        .fin-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.9rem 0;
          border-bottom: 1px solid rgba(251,247,240,0.12);
          color: var(--paper);
          font-size: clamp(0.95rem, 1vw, 1.02rem);
        }
        .fin-mark {
          flex: none;
          width: 11px;
          height: 11px;
          color: var(--brass-2);
        }

        .fin-bank {
          margin: 1.5rem 0 0;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          color: rgba(251,247,240,0.52);
        }
        html[dir="rtl"] .fin-bank { letter-spacing: 0; }

        .fin-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          margin: auto 0 0;
          padding-top: 2.1rem;
        }
        .fin-btn-solid {
          background: var(--paper);
          color: var(--ever);
          border-color: var(--paper);
        }
        .fin-btn-solid:hover {
          background: var(--brass-2);
          border-color: var(--brass-2);
          color: var(--ink);
          transform: translateY(-2px);
        }
        .fin-btn-ghost {
          background: transparent;
          color: var(--paper);
          border-color: rgba(251,247,240,0.34);
        }
        .fin-btn-ghost:hover {
          border-color: var(--paper);
          background: rgba(251,247,240,0.08);
        }

        /* ---- responsive: stack, image first ---- */
        @media (max-width: 880px) {
          .fin-grid { grid-template-columns: 1fr; gap: 1.6rem; }
          .fin-photo { height: auto; min-height: 0; aspect-ratio: 4 / 3; }
        }
      `})]})}])}];

//# sourceMappingURL=components_0jy0k5a._.js.map