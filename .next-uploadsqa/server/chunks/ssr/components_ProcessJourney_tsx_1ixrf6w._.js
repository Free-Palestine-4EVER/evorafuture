module.exports=[142999,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(238246),e=a.i(635577),f=a.i(482665),g=a.i(657400),h=a.i(668222),i=a.i(346271),j=a.i(621216),k=a.i(262036),l=a.i(785466);let m=[{src:"/evora/kitchen/stage-1.jpg",en:"2D blueprint",ar:"مخطط ثنائي الأبعاد"},{src:"/evora/kitchen/stage-2.jpg",en:"Furnished in 2D",ar:"مفروش ثنائي الأبعاد"},{src:"/evora/kitchen/stage-3.jpg",en:"Built in 3D",ar:"مبني ثلاثي الأبعاد"},{src:"/evora/kitchen/stage-4.jpg",en:"Photoreal — approved",ar:"واقعي — معتمد"}];function n({step:a,ar:c}){let d=(0,j.useReducedMotion)(),e=Math.max(0,Math.min(3,a));return(0,b.jsxs)("div",{className:"ts-stage","aria-label":c?m[e].ar:m[e].en,children:[m.map((a,f)=>{let g=f===e;return(0,b.jsx)(i.motion.div,{className:"ts-frame",initial:!1,animate:{opacity:+!!g},transition:{duration:.7*!d,ease:"easeInOut"},style:{zIndex:g?2:1},children:(0,b.jsxs)("picture",{children:[(0,b.jsx)("source",{srcSet:(0,l.avifSrc)(a.src),type:"image/avif"}),(0,b.jsx)(i.motion.img,{src:a.src,alt:c?a.ar:a.en,loading:"lazy",decoding:"async",className:"ts-img",initial:!1,animate:d?{scale:1}:{scale:g?1.06:1},transition:{duration:7*!!g,ease:"linear"},draggable:!1})]})},f)}),(0,b.jsx)(k.AnimatePresence,{children:e>=3&&(0,b.jsx)(i.motion.div,{className:"ts-frame ts-video",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.8,ease:"easeOut"},style:{zIndex:3},children:(0,b.jsx)(o,{ar:c,reduced:!!d})})}),(0,b.jsx)("div",{className:"ts-scrim"}),(0,b.jsx)(k.AnimatePresence,{mode:"wait",children:(0,b.jsxs)(i.motion.div,{className:"ts-caption",initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.4},children:[(0,b.jsx)("span",{className:"ts-num",children:`0${e+1}`}),c?m[e].ar:m[e].en]},e)}),(0,b.jsx)("div",{className:"ts-dots","aria-hidden":!0,children:m.map((a,c)=>(0,b.jsx)("span",{className:`ts-dot${c===e?" on":c<e?" done":""}`},c))}),(0,b.jsx)("style",{children:`
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
      `})]})}function o({ar:a,reduced:c}){return(0,b.jsxs)(i.motion.div,{className:"ts-approved",initial:{scale:.7,opacity:0,y:10},animate:{scale:1,opacity:1,y:0},transition:{type:c?"tween":"spring",stiffness:200,damping:16,delay:.5*!c},style:{position:"absolute",top:16,insetInlineEnd:16,zIndex:4,display:"inline-flex",alignItems:"center",gap:8,fontFamily:"var(--f-display), Georgia, serif",fontSize:"clamp(13px,1.5vw,16px)",color:"#fff",padding:"8px 16px",borderRadius:999,background:"var(--ever)",border:"1px solid var(--brass-2)",boxShadow:"0 16px 40px -16px rgba(22,21,15,0.6)"},children:[(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",children:(0,b.jsx)("path",{d:"M5 12.5 L10 17.5 L19 7",stroke:"var(--brass-2)",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round"})}),a?"تمت الموافقة":"Approved"]})}var p=a.i(922723);let q=[.22,1,.36,1],r={type:"spring",stiffness:320,damping:34},s=[{en:"Walls, rooms, dimensions — nothing else yet.",ar:"جدران وغرف وأبعاد — لا شيء آخر بعد."},{en:"Every piece placed to scale, to how you live.",ar:"كل قطعة موضوعة بالمقاس، وبأسلوب حياتك."},{en:"Walk it, spin it, see it from any angle.",ar:"تجوّل فيه، أدِره، شاهده من أي زاوية."},{en:"Approve once — then we build it for real.",ar:"اعتمده مرة — ثم نصنعه على الحقيقة."}];function t({ar:a}){return(0,b.jsxs)(i.motion.div,{initial:{opacity:0,y:40},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.8,ease:q},style:{marginTop:"clamp(3rem,7vw,6rem)",borderRadius:24,padding:"clamp(1.8rem,4vw,3.2rem)",background:"var(--ink)",color:"var(--paper)",overflow:"hidden",position:"relative"},children:[(0,b.jsxs)("div",{className:"pj-finale",style:{display:"grid",gap:"clamp(2rem,5vw,4rem)",gridTemplateColumns:"minmax(0,1fr) minmax(0,1.1fr)",alignItems:"center"},children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",fontSize:"0.72rem",letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--brass)"},children:[(0,b.jsx)(w,{active:!0})," ",a?"متابعة مباشرة":"Live tracking"]}),(0,b.jsx)("h2",{className:"display",style:{fontSize:"clamp(1.8rem,4vw,3rem)",margin:"1rem 0 0.9rem",fontWeight:360,lineHeight:1.1,color:"var(--paper)"},children:a?"ثم نصنعه — وأنت تشاهد":"Then we build it — and you watch"}),(0,b.jsx)("p",{style:{color:"rgba(245,242,235,0.72)",fontSize:"1.02rem",lineHeight:1.7,maxWidth:"44ch",margin:0},children:a?"بعد اعتمادك، يبدأ الإنتاج. يحدّث فريقنا كل مرحلة بالصور، وتظهر التحديثات فورًا في لوحتك — تجهيز المواد، التصنيع، التشطيب، حتى التركيب.":"After you approve, production begins. Our team updates each stage with photos, and updates appear instantly in your dashboard — sourcing materials, building, finishing, all the way to install."}),(0,b.jsxs)("div",{style:{display:"flex",gap:"0.8rem",marginTop:"1.8rem",flexWrap:"wrap"},children:[(0,b.jsx)(d.default,{href:"/dashboard",style:{padding:"0.85rem 1.5rem",borderRadius:999,background:"var(--clay)",color:"#fff",fontWeight:600,fontSize:"0.92rem",textDecoration:"none"},children:a?"افتح لوحتي":"Open my dashboard"}),(0,b.jsx)("button",{type:"button",onClick:p.openStartProject,style:{padding:"0.85rem 1.5rem",borderRadius:999,border:"1px solid rgba(245,242,235,0.3)",background:"transparent",color:"var(--paper)",fontWeight:500,fontSize:"0.92rem",cursor:"pointer",fontFamily:"var(--f-sans)"},children:a?"ابدأ مشروعًا":"Start a project"})]})]}),(0,b.jsxs)("div",{style:{background:"rgba(245,242,235,0.05)",border:"1px solid rgba(245,242,235,0.12)",borderRadius:18,padding:"1.4rem 1.5rem"},children:[(0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.1rem"},children:[(0,b.jsx)("span",{style:{fontFamily:"var(--f-display)",fontSize:"1.15rem",color:"var(--paper)"},children:a?"غرفة المعيشة — فيلا":"Living Room — Villa"}),(0,b.jsx)("span",{style:{fontSize:"0.68rem",color:"var(--brass)",border:"1px solid rgba(201,162,93,0.4)",padding:"0.25em 0.7em",borderRadius:999},children:a?"قيد الإنتاج":"In production"})]}),(0,b.jsx)("ol",{style:{listStyle:"none",margin:0,padding:0},children:g.JOURNEY.map((c,d)=>{let e=d<5,f=5===d;return(0,b.jsxs)("li",{style:{display:"flex",gap:"0.8rem",alignItems:"flex-start",paddingBottom:d<g.JOURNEY.length-1?"0.7rem":0},children:[(0,b.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",alignSelf:"stretch"},children:[(0,b.jsx)("span",{style:{width:16,height:16,borderRadius:999,flexShrink:0,display:"grid",placeItems:"center",fontSize:"0.55rem",color:"#fff",background:e?"var(--clay)":f?"var(--brass)":"transparent",border:e||f?"none":"1.5px solid rgba(245,242,235,0.25)"},children:e?"✓":""}),d<g.JOURNEY.length-1&&(0,b.jsx)("span",{style:{width:1.5,flex:1,background:e?"var(--clay)":"rgba(245,242,235,0.15)",marginTop:2,minHeight:14}})]}),(0,b.jsxs)("span",{style:{fontSize:"0.9rem",color:e||f?"var(--paper)":"rgba(245,242,235,0.45)",fontWeight:f?600:400,paddingTop:1,display:"flex",alignItems:"center",gap:"0.5rem"},children:[a?c.ar:c.en,f&&(0,b.jsx)(w,{active:!0,small:!0})]})]},c.key)})})]})]}),(0,b.jsx)("style",{children:"@media (max-width: 760px){ .pj-finale{ grid-template-columns: 1fr !important; } }"})]})}let u={eyebrow:{en:"Your turn",ar:"دورك الآن"},title:{en:"Have a plan? Let's make it your home.",ar:"عندك مخطّط؟ خلّينا نحوّله إلى منزلك."},sub:{en:"Send us your 2D floor plan and your number. We'll furnish it, build it in 3D and render it photoreal — free, with no obligation.",ar:"أرسل لنا مخطّطك ثنائي الأبعاد ورقمك، ونحن نؤثّثه ونبنيه ثلاثي الأبعاد ونقدّمه بعرض واقعي — مجانًا ودون أي التزام."},upload:{en:"Upload your plan",ar:"ارفع مخطّطك"},note:{en:"Free design · we reply within a day",ar:"تصميم مجاني · نردّ خلال يوم"},hint:{en:"JPG, PNG or PDF — a phone photo works too",ar:"JPG أو PNG أو PDF — حتى صورة بالجوال تكفي"}};function v({lang:a,reduced:c}){let d=b=>u[b][a];return(0,b.jsxs)(i.motion.div,{className:"pj-cta",initial:!c&&{opacity:0,y:36},whileInView:c?void 0:{opacity:1,y:0},viewport:{once:!0,margin:"0px 0px -12% 0px"},transition:{duration:.7,ease:q},children:[(0,b.jsx)("span",{className:"pj-cta-glyph","aria-hidden":!0,children:(0,b.jsxs)("svg",{viewBox:"0 0 24 24",width:"26",height:"26",fill:"none",children:[(0,b.jsx)("path",{d:"M12 16V5m0 0L8 9m4-4 4 4",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"}),(0,b.jsx)("path",{d:"M4 14v3.5A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V14",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"})]})}),(0,b.jsx)("span",{className:"pj-cta-eyebrow",children:d("eyebrow")}),(0,b.jsx)("h2",{className:"pj-cta-title",children:d("title")}),(0,b.jsx)("p",{className:"pj-cta-sub",children:d("sub")}),(0,b.jsxs)("button",{type:"button",className:"pj-cta-btn",onClick:p.openStartProject,children:[d("upload"),(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:"17",height:"17",fill:"none","aria-hidden":!0,children:(0,b.jsx)("path",{d:"M5 12h13m0 0-5-5m5 5-5 5",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round",className:"pj-cta-arrow"})})]}),(0,b.jsx)("span",{className:"pj-cta-hint",children:d("hint")}),(0,b.jsxs)("span",{className:"pj-cta-note",children:[(0,b.jsx)("span",{className:"pj-free-dot","aria-hidden":!0}),d("note")]}),(0,b.jsx)("style",{children:`
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
      `})]})}function w({active:a,small:c}){let d=c?7:9;return(0,b.jsxs)("span",{style:{position:"relative",width:d,height:d,display:"inline-block"},children:[(0,b.jsx)("span",{style:{position:"absolute",inset:0,borderRadius:999,background:"var(--brass)"}}),a&&(0,b.jsx)(i.motion.span,{style:{position:"absolute",inset:0,borderRadius:999,background:"var(--brass)"},animate:{scale:[1,2.4],opacity:[.6,0]},transition:{duration:1.6,repeat:1/0,ease:"easeOut"}})]})}a.s(["default",0,function({showFinale:a=!0}){let{t:d,lang:g,dir:k}=(0,e.useT)(),l="ar"===g,m=(0,j.useReducedMotion)(),[o,p]=(0,c.useState)(0),q=o%2==1;return(0,b.jsxs)("section",{dir:k,style:{position:"relative",paddingTop:"clamp(4rem,9vw,7rem)"},children:[(0,b.jsxs)("div",{className:"container pj-head",children:[(0,b.jsx)(h.Rise,{children:(0,b.jsxs)("span",{className:"pj-kicker",children:[(0,b.jsx)("span",{className:"pj-kicker-rule"}),l?"كيف تعمل إيفورا":"How Evora works",(0,b.jsx)("span",{className:"pj-kicker-rule"})]})}),(0,b.jsx)(h.Rise,{delay:.06,as:"h2",className:"pj-title",children:l?(0,b.jsxs)(b.Fragment,{children:["مخطّطٌ مسطّح، ",(0,b.jsx)("em",{children:"يصبح منزلك."})]}):(0,b.jsxs)(b.Fragment,{children:["A flat plan, ",(0,b.jsx)("em",{children:"made a home."})]})}),(0,b.jsx)(h.Rise,{delay:.12,as:"p",className:"pj-lede",children:l?"أربع خطوات فقط: ترسل مخطّطك، فنؤثّثه ونبنيه ثلاثي الأبعاد ونقدّمه بعرض واقعي تعتمده — ثم نصنعه وأنت تتابع كل مرحلة مباشرةً.":"Four moves: you send a plan, we furnish it, rebuild it in 3D and render it photoreal for your sign-off — then we build it while you watch every stage."}),(0,b.jsx)(h.Rise,{delay:.18,children:(0,b.jsxs)("span",{className:"pj-free",children:[(0,b.jsx)("span",{className:"pj-free-dot","aria-hidden":!0}),d("pj_free")]})}),(0,b.jsx)(h.Rise,{delay:.24,children:(0,b.jsx)("p",{className:"pj-loss",children:d("pj_loss")})})]}),(0,b.jsxs)("div",{className:"pj-swap container",children:[(0,b.jsx)("div",{className:"pj-sticky",children:(0,b.jsx)(i.motion.div,{className:"pj-panel",animate:{x:q?l?"-72.41%":"72.41%":"0%"},transition:m?{duration:0}:r,children:(0,b.jsx)(n,{step:o,ar:l})})}),(0,b.jsx)("div",{className:"pj-offset"}),(0,b.jsx)("div",{className:"pj-mstick","aria-hidden":!0,children:(0,b.jsx)(n,{step:o,ar:l})}),f.processSteps.map((a,c)=>{let d=c%2==0;return(0,b.jsx)(i.motion.section,{className:"pj-step",onViewportEnter:()=>p(c),viewport:{margin:"-50% 0px -50% 0px",amount:0},style:{justifyContent:d?"flex-end":"flex-start"},children:(0,b.jsxs)("div",{className:`pj-step-text${c===o?" is-active":""}`,children:[(0,b.jsx)("span",{className:"pj-step-ghost","aria-hidden":!0,children:a.n}),(0,b.jsxs)("span",{className:"pj-step-eyebrow",children:[l?"المرحلة":"Stage"," ",(0,b.jsx)("b",{children:a.n}),(0,b.jsx)("i",{}),l?"من ٠٤":"of 04"]}),(0,b.jsx)("h3",{className:"pj-step-title",children:a.title[g]}),(0,b.jsx)("p",{className:"pj-step-body",children:a.body[g]}),(0,b.jsx)("span",{className:"pj-step-tag",children:l?s[c].ar:s[c].en}),(0,b.jsx)("div",{className:"pj-step-media-mobile",children:(0,b.jsx)(n,{step:c,ar:l})})]})},a.n)})]}),a&&(0,b.jsx)("div",{className:"container",children:(0,b.jsx)(t,{ar:l})}),a&&(0,b.jsx)("div",{className:"container",children:(0,b.jsx)(v,{lang:g,reduced:!!m})}),(0,b.jsx)("style",{children:`
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
      `})]})}],142999)}];

//# sourceMappingURL=components_ProcessJourney_tsx_1ixrf6w._.js.map