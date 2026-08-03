module.exports=[969875,a=>{"use strict";var b=a.i(187924),c=a.i(635577),d=a.i(668222),e=a.i(936059);let f={lat:31.9969638,lng:35.8434571},g="https://www.google.com/maps/dir/?api=1&destination=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman",h=`https://www.google.com/maps?q=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman&ll=${f.lat},${f.lng}&z=17&output=embed`,i={lede:{en:"Two floors of finished rooms on Wasfi Al-Tal Street in Khalda — walk in any day we're open, or hold a time and sit with a designer.",ar:"طابقان من الغرف المكتملة في شارع وصفي التل بخلدا — تفضّل بالزيارة في أي يوم نكون فيه مفتوحين، أو احجز موعدًا واجلس مع مصمّم."},directions:{en:"Get directions",ar:"احصل على الاتجاهات"},call:{en:"Call the showroom",ar:"اتصل بالمعرض"},photo_k:{en:"Our showroom",ar:"معرضنا"},expect_eyebrow:{en:"Before you come",ar:"قبل أن تأتي"},expect_title:{en:"What to expect on a visit",ar:"ماذا تتوقّع في زيارتك"},hours_label:{en:"Opening hours",ar:"ساعات العمل"},e1_t:{en:"Walk the full collection",ar:"تجوّل في المجموعة كاملة"},e1_d:{en:"Sofas, beds, dining and décor — styled in real room sets you can sit in.",ar:"كنب وأسرّة وسفرة وديكور — منسّقة في غرف حقيقية تستطيع الجلوس فيها."},e2_t:{en:"Bring your floor plan",ar:"أحضِر مخططك"},e2_d:{en:"Hand us your 2D plan and we'll start your 3D home on the spot.",ar:"سلّمنا مخططك ثنائي الأبعاد ونبدأ منزلك ثلاثي الأبعاد على الفور."},e3_t:{en:"Sit with a designer",ar:"اجلس مع مصمّم"},e3_d:{en:"A specialist walks you through finishes, fabrics and layout — no rush.",ar:"يأخذك مختص في التشطيبات والأقمشة والتوزيع — دون أي استعجال."},e4_t:{en:"Two floors, fully styled",ar:"طابقان، مصمّمان بالكامل"},tour_link:{en:"Or take the virtual tour first",ar:"أو خذ جولة افتراضية أولاً"},perk_note:{en:"Easy parking right out front, and Arabic coffee on us while you browse.",ar:"موقف سهل أمام المعرض مباشرة، وقهوة عربية على حسابنا أثناء تجوّلك."}};function j(a){let b=a.split(" ");if(b.length<2)return[a];let c=Math.ceil(b.length/2);return[b.slice(0,c).join(" "),b.slice(c).join(" ")]}a.s(["EVORA_GEO",0,f,"default",0,function({pageTop:a=!1}={}){let{t:f,lang:k}=(0,c.useT)(),l="en"===k,m=a=>i[a][k],n=[{t:m("e1_t"),d:m("e1_d")},{t:m("e2_t"),d:m("e2_d")},{t:m("e3_t"),d:m("e3_d")},{t:m("e4_t"),d:f("col_film_caption")}],o=[{n:"01",label:l?"The Showroom":"المعرض",value:f("visit_addr"),sub:l?"By appointment & walk-in":"بموعد أو زيارة مباشرة",href:g},{n:"02",label:l?"Opening Hours":"ساعات العمل",value:f("visit_hours"),sub:l?"Friday — by appointment":"الجمعة — بموعد مسبق"},{n:"03",label:l?"Call the Showroom":"اتصل بالمعرض",value:(0,b.jsx)("bdi",{dir:"ltr",children:e.PHONE_PRIMARY}),sub:l?"Or +962 79 636 4105 · tap to call":"أو ٤١٠٥ ٦٣٦ ٧٩ ٩٦٢+ · اضغط للاتصال",href:`tel:${e.PHONE_PRIMARY_TEL}`},{n:"04",label:l?"Find Us":"تابعونا",value:(0,b.jsx)("bdi",{dir:"ltr",children:"@evorafuturehome"}),sub:l?"Instagram · Facebook · WhatsApp":"إنستغرام · فيسبوك · واتساب",href:"https://instagram.com/evorafuturehome"}];return(0,b.jsxs)("section",{id:"visit",className:`vst${a?" vst--pagetop":""}`,lang:k,children:[(0,b.jsx)("span",{className:"vst__edge","aria-hidden":!0,children:l?"Amman — Jordan":"عمّان — الأردن"}),(0,b.jsxs)("div",{className:"container vst__inner",children:[(0,b.jsxs)("header",{className:"vst__head",children:[(0,b.jsxs)("div",{className:"vst__kick",children:[(0,b.jsx)(d.Rise,{as:"span",className:"eyebrow vst__eyebrow",children:f("visit_eyebrow")}),(0,b.jsx)(d.Rise,{as:"span",delay:.06,className:"vst__coords",children:(0,b.jsx)("bdi",{dir:"ltr",children:"31.99° N · 35.84° E"})})]}),(0,b.jsxs)("div",{className:"vst__headgrid",children:[(0,b.jsx)(d.RevealLines,{lines:j(f("visit_title")),className:"display vst__title",delay:.05,italicIndex:1}),(0,b.jsxs)("div",{className:"vst__intro",children:[(0,b.jsx)(d.Rise,{as:"p",delay:.1,className:"vst__lede",children:m("lede")}),(0,b.jsxs)(d.Rise,{delay:.16,className:"vst__actions",children:[(0,b.jsx)(d.Magnetic,{strength:.3,className:"vst__btnwrap",children:(0,b.jsxs)("a",{href:"#book",className:"btn btn-solid vst__btn",children:[f("visit_cta")," ",(0,b.jsx)("span",{className:"arrow",children:"→"})]})}),(0,b.jsxs)("a",{href:g,target:"_blank",rel:"noopener noreferrer",className:"vst__quiet",children:[m("directions")," ",(0,b.jsx)("span",{className:"vst__go","aria-hidden":!0,children:"↗"})]}),(0,b.jsxs)("a",{href:`tel:${e.PHONE_PRIMARY_TEL}`,className:"vst__quiet",children:[m("call")," ",(0,b.jsx)("span",{className:"vst__go","aria-hidden":!0,children:"↗"})]})]})]})]})]}),(0,b.jsxs)("div",{className:"vst__stage",children:[(0,b.jsxs)(d.Rise,{className:"vst__store",children:[(0,b.jsx)(d.ParallaxImage,{src:"/evora/storefront.webp",alt:l?"Evora Future Home showroom — Khalda, Amman":"معرض إيفورا فيوتشر هوم — خلدا، عمّان",amount:7,className:"vst__store-media",style:{position:"absolute",inset:0}}),(0,b.jsx)("span",{className:"vst__store-overlay","aria-hidden":!0}),(0,b.jsx)("span",{className:"vst__store-grain","aria-hidden":!0}),(0,b.jsx)("span",{className:"vst__cellk",children:m("photo_k")}),(0,b.jsxs)("div",{className:"vst__store-cap",children:[(0,b.jsx)("span",{className:"vst__store-badge",children:l?"Evora Future Home":"إيفورا فيوتشر هوم"}),(0,b.jsx)("span",{className:"vst__store-addr",children:l?"Wasfi Al-Tal St · Khalda · Amman":"شارع وصفي التل · خلدا · عمّان"})]})]}),(0,b.jsx)(d.Rise,{delay:.14,className:"vst__plate",children:(0,b.jsxs)("div",{className:"vst__map",children:[(0,b.jsx)("iframe",{className:"vst__iframe",src:h,title:l?"Evora — Khalda, Amman":"إيفورا — خلدا، عمّان",loading:"lazy",referrerPolicy:"no-referrer-when-downgrade"}),(0,b.jsx)("span",{className:"vst__tint","aria-hidden":!0}),(0,b.jsxs)("a",{href:g,target:"_blank",rel:"noopener noreferrer",className:"vst__plaque",children:[(0,b.jsx)("span",{className:"vst__plaque-pin",children:(0,b.jsx)("span",{className:"vst__plaque-pulse"})}),(0,b.jsxs)("span",{className:"vst__plaque-text",children:[(0,b.jsx)("span",{children:l?"Khalda · Amman":"خلدا · عمّان"}),(0,b.jsxs)("span",{className:"vst__plaque-cta",children:[l?"Open in Maps":"افتح في الخرائط"," ↗"]})]})]})]})})]}),(0,b.jsx)("ul",{className:"vst__details",children:o.map(a=>{let c=(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("span",{className:"vst__n",children:a.n}),(0,b.jsxs)("span",{className:"vst__entry-body",children:[(0,b.jsx)("span",{className:"vst__label",children:a.label}),(0,b.jsx)("span",{className:"vst__value",children:a.value}),(0,b.jsxs)("span",{className:"vst__sub",children:[a.sub,a.href&&(0,b.jsx)("span",{className:"vst__go","aria-hidden":!0,children:" ↗"})]})]})]});return(0,b.jsx)("li",{className:"vst__entry",children:a.href?(0,b.jsx)("a",{className:"vst__entry-in vst__entry-in--link",href:a.href,target:"_blank",rel:"noopener noreferrer","data-cursor":"hover",children:c}):(0,b.jsx)("div",{className:"vst__entry-in",children:c})},a.n)})}),(0,b.jsxs)(d.Rise,{className:"vst__expect",children:[(0,b.jsxs)("div",{className:"vst__expect-aside",children:[(0,b.jsx)("span",{className:"eyebrow vst__expect-eyebrow",children:m("expect_eyebrow")}),(0,b.jsx)(d.RevealLines,{lines:j(m("expect_title")),className:"display vst__expect-title",delay:.06}),(0,b.jsxs)("div",{className:"vst__expect-hours",children:[(0,b.jsx)("span",{className:"vst__expect-hours-label",children:m("hours_label")}),(0,b.jsx)("span",{className:"vst__expect-hours-val",children:f("visit_hours")}),(0,b.jsx)("p",{className:"vst__expect-perk",children:m("perk_note")}),(0,b.jsxs)("a",{href:"/showroom",className:"vst__expect-tour",children:[m("tour_link")," ",(0,b.jsx)("span",{"aria-hidden":!0,children:"↗"})]})]})]}),(0,b.jsx)("ul",{className:"vst__expect-list",children:n.map((a,c)=>(0,b.jsxs)("li",{className:"vst__expect-item",children:[(0,b.jsx)("span",{className:"vst__expect-n",children:String(c+1).padStart(2,"0")}),(0,b.jsxs)("span",{className:"vst__expect-body",children:[(0,b.jsx)("span",{className:"vst__expect-h",children:a.t}),(0,b.jsx)("span",{className:"vst__expect-d",children:a.d})]})]},c))})]})]}),(0,b.jsx)("style",{children:`
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
      `})]})}])}];

//# sourceMappingURL=components_Visit_tsx_1_pl4i9._.js.map