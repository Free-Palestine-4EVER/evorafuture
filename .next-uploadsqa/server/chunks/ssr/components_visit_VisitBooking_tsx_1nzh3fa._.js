module.exports=[536309,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(635577),e=a.i(668222),f=a.i(346271),g=a.i(124513),h=a.i(936059);let i={eyebrow:{en:"Plan Your Visit",ar:"خطّط لزيارتك"},title:{en:"Let's find you a time.",ar:"لنحدّد لك موعدًا."},lead:{en:"Leave your number and when you'd like to come, and we'll confirm it. Rather not wait? Walk in any day we're open.",ar:"اترك رقمك والوقت الذي يناسبك، وسنؤكده لك. تفضّل عدم الانتظار؟ تفضّل بزيارتنا في أي يوم نكون فيه مفتوحين."},card_label:{en:"Visit request",ar:"طلب زيارة"},optional:{en:"Optional",ar:"اختياري"},name:{en:"Your name",ar:"اسمك"},name_ph:{en:"First and last name",ar:"الاسم الأول والعائلة"},name_err:{en:"Please tell us your name.",ar:"الرجاء إدخال اسمك."},phone:{en:"Phone / WhatsApp number",ar:"رقم الهاتف / واتساب"},phone_err:{en:"Please enter a valid phone number.",ar:"الرجاء إدخال رقم هاتف صحيح."},when:{en:"Preferred day & time",ar:"اليوم والوقت المفضّل"},when_ph:{en:"e.g. Tuesday, around 6 PM",ar:"مثلاً: الثلاثاء، حوالي الساعة السادسة مساءً"},see:{en:"What would you like to see?",ar:"ماذا تودّ أن ترى؟"},see_ph:{en:"Sofas, a kitchen island, bedroom sets…",ar:"كنب، جزيرة مطبخ، غرف نوم…"},submit:{en:"Request my visit",ar:"أرسل طلب الزيارة"},sending:{en:"Sending…",ar:"جارٍ الإرسال…"},done_t:{en:"Got it — we'll confirm your visit.",ar:"تم — سنؤكد لك موعد الزيارة."},done_s:{en:"Our team will call the number you gave us to lock in the time.",ar:"سيتصل بك فريقنا على الرقم الذي تركته لتثبيت الموعد."},again:{en:"Send another request",ar:"أرسل طلبًا آخر"},err:{en:"That didn't send. Please try again — or reach us directly:",ar:"لم يتم إرسال الطلب. حاول مرة أخرى — أو تواصل معنا مباشرة:"},err_wa:{en:"Open WhatsApp",ar:"افتح واتساب"},hours_k:{en:"We're open",ar:"أوقات العمل"},call_k:{en:"Call the showroom",ar:"اتصل بالمعرض"},wa_k:{en:"Message us",ar:"راسلنا"},wa_msg:{en:"Hi Evora! I'd like to book a visit to the Khalda showroom.",ar:"مرحبًا إيفورا! أودّ حجز زيارة لمعرض خلدا."},pref_label:{en:"Preferred",ar:"الوقت المفضّل"},see_label:{en:"Wants to see",ar:"يريد رؤية"},fallback_msg:{en:"Showroom visit request",ar:"طلب زيارة المعرض"}},j=`
  .vbk {
    position: relative; isolation: isolate; overflow: hidden;
    background: #0d0b09; color: #fbf7f0;
    padding-block: clamp(4.5rem, 10vw, 8.5rem);
    scroll-margin-top: calc(var(--nav-h, 78px) + 12px);
  }
  /* one warm brass bloom so the band is lit, not a flat black rectangle */
  .vbk__glow {
    position: absolute; inset: 0; z-index: -1; pointer-events: none;
    background:
      radial-gradient(58% 48% at 8% 0%, rgba(197,160,106,0.16), transparent 62%),
      radial-gradient(52% 52% at 100% 100%, rgba(54,65,47,0.30), transparent 64%);
  }
  .vbk__inner {
    display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
    gap: clamp(2.4rem, 5vw, 5rem); align-items: start;
  }

  .vbk__side { display: flex; flex-direction: column; text-align: start; }
  .vbk__eyebrow { display: inline-flex; align-items: center; gap: 0.7rem; color: var(--brass-2); align-self: flex-start; }
  .vbk__eyebrow::before { content: ""; width: 26px; height: 1px; background: var(--brass-2); }
  .vbk__title {
    font-size: clamp(2.2rem, 4.6vw, 3.6rem); line-height: 1.03; color: #fbf7f0;
    margin: 1.1rem 0 0; font-weight: 360; letter-spacing: -0.018em;
  }
  html[dir="rtl"] .vbk__title { line-height: 1.24; letter-spacing: 0; }
  .vbk__lead {
    color: rgba(251,247,240,0.76); font-size: clamp(1rem, 1.2vw, 1.1rem);
    line-height: 1.7; margin: 1.2rem 0 0; max-width: 52ch;
  }

  /* contact rail — a definition list, not a pile of links */
  .vbk__quick {
    margin: clamp(2rem, 4vw, 2.8rem) 0 0; padding: 0;
    display: flex; flex-direction: column;
  }
  .vbk__quickrow {
    display: grid; grid-template-columns: minmax(0, 10.5rem) minmax(0, 1fr);
    gap: 0.4rem 1.2rem; align-items: baseline;
    padding-block: clamp(0.75rem, 1.5vw, 1rem);
    border-top: 1px solid rgba(251,247,240,0.14);
  }
  .vbk__quickrow:last-child { border-bottom: 1px solid rgba(251,247,240,0.14); }
  .vbk__quickrow dd { margin: 0; min-width: 0; }
  .vbk__quickk {
    font-size: 0.64rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(251,247,240,0.52);
  }
  html[dir="rtl"] .vbk__quickk { letter-spacing: 0.05em; }
  .vbk__quicklink {
    display: inline-flex; align-items: baseline; gap: 0.5rem;
    min-height: 44px; color: inherit; text-decoration: none;
  }
  .vbk__quickv {
    font-family: var(--font-display); font-size: clamp(1rem, 1.3vw, 1.16rem);
    color: #fbf7f0; transition: color 0.3s var(--ease);
  }
  .vbk__quickv--plain { display: block; line-height: 1.45; }
  .vbk__arrow { color: var(--brass-2); font-size: 0.8rem; display: inline-block; transition: transform 0.4s var(--ease); }
  html[dir="rtl"] .vbk__arrow { transform: scaleX(-1); }
  .vbk__quicklink:hover .vbk__quickv { color: var(--brass-2); }
  .vbk__quicklink:hover .vbk__arrow { transform: translate(2px, -2px); }
  html[dir="rtl"] .vbk__quicklink:hover .vbk__arrow { transform: translate(-2px, -2px) scaleX(-1); }

  /* ---- the card ---- */
  .vbk__card {
    background: var(--paper); border-radius: 14px;
    padding: clamp(1.5rem, 2.8vw, 2.4rem);
    box-shadow:
      0 0 0 1px rgba(197,160,106,0.30),
      0 44px 100px -48px rgba(0,0,0,0.75);
  }
  .vbk__cardhead {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: clamp(1.2rem, 2.4vw, 1.8rem);
  }
  .vbk__cardlabel {
    flex: none; font-size: 0.62rem; letter-spacing: 0.24em; text-transform: uppercase;
    color: var(--brass);
  }
  html[dir="rtl"] .vbk__cardlabel { letter-spacing: 0.07em; }
  .vbk__cardrule { flex: 1 1 auto; height: 1px; background: var(--line); }

  .vbk__form { display: block; }
  .vbk__set { border: 0; margin: 0; padding: 0; min-width: 0; display: grid; gap: clamp(0.9rem, 1.6vw, 1.15rem); }
  /* dim only the inputs while sending — the button keeps its full ink so the
     spinner + "Sending…" stay the clearest thing on the card */
  .vbk__set[disabled] .vbk__field { opacity: 0.55; }
  .vbk__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(0.9rem, 1.6vw, 1.15rem); }

  .vbk__field { display: flex; flex-direction: column; gap: 0.45rem; text-align: start; min-width: 0; }
  .vbk__field label {
    font-size: 0.64rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--ink-faint); display: flex; align-items: baseline; gap: 0.5rem;
  }
  html[dir="rtl"] .vbk__field label { letter-spacing: 0.04em; }
  .vbk__opt {
    font-size: 0.56rem; letter-spacing: 0.12em; color: var(--brass);
    border: 1px solid rgba(138,106,60,0.32); border-radius: 100px;
    padding: 0.15em 0.6em; text-transform: uppercase; white-space: nowrap;
  }
  html[dir="rtl"] .vbk__opt { letter-spacing: 0.02em; }

  .vbk__field input, .vbk__field textarea {
    width: 100%; padding: 0.9rem 1rem;
    border: 1px solid var(--line); border-radius: 10px;
    background: var(--paper-2);
    font-family: var(--font-sans); font-size: 1rem; line-height: 1.45; color: var(--ink);
    outline: none; text-align: start;
    transition: border-color 0.25s var(--ease), box-shadow 0.25s var(--ease), background 0.25s var(--ease);
  }
  html[dir="rtl"] .vbk__field input, html[dir="rtl"] .vbk__field textarea { font-family: var(--font-ar); }
  /* the tel field is dir="ltr" so the digits read correctly; align it to the
     RTL column's edge anyway so it doesn't look knocked out of the stack */
  html[dir="rtl"] .vbk__field input[type="tel"] { text-align: right; }
  html[dir="rtl"] .vbk__field input[type="tel"]::placeholder { text-align: right; }
  .vbk__field input::placeholder, .vbk__field textarea::placeholder { color: color-mix(in srgb, var(--ink-faint) 62%, transparent); }
  .vbk__field textarea { min-height: 92px; resize: vertical; }
  .vbk__field input:hover, .vbk__field textarea:hover { border-color: rgba(22,21,15,0.24); }
  .vbk__field input:focus-visible, .vbk__field textarea:focus-visible {
    background: var(--paper);
    border-color: var(--brass);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brass) 20%, transparent);
    outline: none;
  }
  .vbk__field input.is-invalid, .vbk__field textarea.is-invalid { border-color: #A83A22; background: rgba(168,58,34,0.04); }
  .vbk__field input.is-invalid:focus-visible { border-color: #A83A22; box-shadow: 0 0 0 3px rgba(168,58,34,0.18); }

  .vbk__err { font-size: 0.8rem; line-height: 1.4; color: #A83A22; }
  .vbk__formerr {
    margin: 0; padding: 0.85rem 1rem; border-radius: 10px;
    background: rgba(168,58,34,0.07); border: 1px solid rgba(168,58,34,0.28);
    font-size: 0.86rem; line-height: 1.5; color: #7E2B18;
  }
  .vbk__formerr a { text-decoration: underline; text-underline-offset: 3px; white-space: nowrap; }

  .vbk__submit { width: 100%; justify-content: center; margin-top: 0.35rem; }
  .vbk__submit:disabled { cursor: default; transform: none; }
  .vbk__spin {
    width: 14px; height: 14px; border-radius: 50%; flex: none;
    border: 2px solid rgba(255,255,255,0.28); border-top-color: #fff;
    animation: vbkSpin 0.75s linear infinite;
  }
  @keyframes vbkSpin { to { transform: rotate(360deg); } }

  /* ---- confirmation ---- */
  .vbk__done { text-align: center; padding: clamp(1.4rem, 3vw, 2.4rem) 0.4rem 1rem; }
  .vbk__check {
    display: inline-grid; place-items: center; width: 56px; height: 56px; border-radius: 999px;
    background: var(--ever); color: #fff; margin-bottom: 1.2rem;
  }
  .vbk__donet {
    font-family: var(--font-display); font-weight: 400;
    font-size: clamp(1.3rem, 2vw, 1.6rem); line-height: 1.25;
    color: var(--ink); margin: 0 0 0.6rem; outline: none;
  }
  .vbk__donet:focus-visible { outline: 2px solid var(--brass); outline-offset: 4px; border-radius: 4px; }
  .vbk__dones { color: var(--ink-faint); line-height: 1.65; margin: 0 auto; max-width: 42ch; }
  .vbk__again {
    margin-top: 1.4rem; background: none; border: 0; padding: 0.4rem 0;
    font: inherit; font-size: 0.84rem; color: var(--brass);
    border-bottom: 1px solid rgba(138,106,60,0.4); cursor: pointer; min-height: 44px;
    transition: color 0.3s var(--ease), border-color 0.3s var(--ease);
  }
  .vbk__again:hover { color: var(--ink); border-color: var(--ink); }

  /* focus rings on the dark band's own controls read better in the on-dark
     brass, same convention as KitchenEnquiry's .keq */
  .vbk .vbk__quicklink:focus-visible { outline: 2px solid var(--brass-2); outline-offset: 3px; border-radius: 4px; }
  .vbk .vbk__submit:focus-visible { outline: 2px solid var(--brass); outline-offset: 3px; }

  @media (max-width: 900px) {
    .vbk__inner { grid-template-columns: 1fr; gap: 2.4rem; }
    .vbk__lead { max-width: none; }
  }
  @media (max-width: 560px) {
    .vbk__row { grid-template-columns: 1fr; }
    .vbk__quickrow { grid-template-columns: 1fr; gap: 0.15rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .vbk__quickv, .vbk__arrow, .vbk__again, .vbk__field input, .vbk__field textarea { transition: none; }
    .vbk__spin { animation: none; border-top-color: rgba(255,255,255,0.6); }
  }
`;a.s(["default",0,function(){let{t:a,lang:k,dir:l}=(0,d.useT)(),m=a=>i[a][k],[n,o]=(0,c.useState)(""),[p,q]=(0,c.useState)(""),[r,s]=(0,c.useState)(""),[t,u]=(0,c.useState)(""),[v,w]=(0,c.useState)(!1),[x,y]=(0,c.useState)(!1),[z,A]=(0,c.useState)(!1),[B,C]=(0,c.useState)({name:!1,phone:!1}),D=(0,c.useRef)(null),E=n.trim().length>1,F=p.replace(/\D/g,"").length>=7,G=B.name&&!E,H=B.phone&&!F,I=`${h.WHATSAPP}?text=${encodeURIComponent(m("wa_msg"))}`;async function J(a){if(a.preventDefault(),C({name:!0,phone:!0}),A(!1),!E||!F||v)return;w(!0);let b=[r.trim()?`${m("pref_label")}: ${r.trim()}`:"",t.trim()?`${m("see_label")}: ${t.trim()}`:""].filter(Boolean).join(" — ");try{let a=await (0,g.createLead)(n.trim(),p.trim(),b||m("fallback_msg"));if(!a||"string"!=typeof a.id||!a.id)throw Error("LEAD_NOT_CREATED");y(!0)}catch{A(!0)}finally{w(!1)}}return(0,c.useEffect)(()=>{x&&D.current?.focus()},[x]),(0,b.jsxs)("section",{id:"book",className:"vbk",dir:l,lang:k,children:[(0,b.jsx)("span",{className:"vbk__glow","aria-hidden":!0}),(0,b.jsxs)("div",{className:"container vbk__inner",children:[(0,b.jsxs)(e.Rise,{as:"div",className:"vbk__side",children:[(0,b.jsx)("span",{className:"eyebrow vbk__eyebrow",children:m("eyebrow")}),(0,b.jsx)(e.RevealLines,{lines:[m("title")],className:"display vbk__title",delay:.06}),(0,b.jsx)("p",{className:"vbk__lead",children:m("lead")}),(0,b.jsxs)("dl",{className:"vbk__quick",children:[(0,b.jsxs)("div",{className:"vbk__quickrow",children:[(0,b.jsx)("dt",{className:"vbk__quickk",children:m("hours_k")}),(0,b.jsx)("dd",{className:"vbk__quickv vbk__quickv--plain",children:a("visit_hours")})]}),(0,b.jsxs)("div",{className:"vbk__quickrow",children:[(0,b.jsx)("dt",{className:"vbk__quickk",children:m("call_k")}),(0,b.jsx)("dd",{children:(0,b.jsxs)("a",{className:"vbk__quicklink",href:`tel:${h.PHONE_PRIMARY_TEL}`,children:[(0,b.jsx)("span",{className:"vbk__quickv",children:(0,b.jsx)("bdi",{dir:"ltr",children:h.PHONE_PRIMARY})}),(0,b.jsx)("span",{className:"vbk__arrow","aria-hidden":!0,children:"↗"})]})})]}),(0,b.jsxs)("div",{className:"vbk__quickrow",children:[(0,b.jsx)("dt",{className:"vbk__quickk",children:m("wa_k")}),(0,b.jsx)("dd",{children:(0,b.jsxs)("a",{className:"vbk__quicklink",href:I,target:"_blank",rel:"noopener noreferrer",children:[(0,b.jsx)("span",{className:"vbk__quickv",children:a("wa_label")}),(0,b.jsx)("span",{className:"vbk__arrow","aria-hidden":!0,children:"↗"})]})})]})]})]}),(0,b.jsxs)(e.Rise,{as:"div",delay:.12,className:"vbk__card",children:[(0,b.jsxs)("div",{className:"vbk__cardhead",children:[(0,b.jsx)("span",{className:"vbk__cardlabel",children:m("card_label")}),(0,b.jsx)("span",{className:"vbk__cardrule","aria-hidden":!0})]}),x?(0,b.jsxs)("div",{className:"vbk__done",role:"status",children:[(0,b.jsx)(f.motion.span,{className:"vbk__check","aria-hidden":!0,initial:{scale:.6,opacity:0},animate:{scale:1,opacity:1},transition:{type:"spring",stiffness:220,damping:16},children:(0,b.jsx)("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"none",children:(0,b.jsx)(f.motion.path,{d:"M5 12.5l4.2 4.2L19 7",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",initial:{pathLength:0},animate:{pathLength:1},transition:{duration:.5,ease:e.EASE,delay:.16}})})}),(0,b.jsx)("h3",{className:"vbk__donet",ref:D,tabIndex:-1,children:m("done_t")}),(0,b.jsx)("p",{className:"vbk__dones",children:m("done_s")}),(0,b.jsx)("button",{type:"button",className:"vbk__again",onClick:function(){o(""),q(""),s(""),u(""),C({name:!1,phone:!1}),A(!1),y(!1)},children:m("again")})]}):(0,b.jsx)("form",{className:"vbk__form",onSubmit:J,noValidate:!0,"aria-busy":v,children:(0,b.jsxs)("fieldset",{className:"vbk__set",disabled:v,children:[(0,b.jsxs)("div",{className:"vbk__row",children:[(0,b.jsxs)("div",{className:"vbk__field",children:[(0,b.jsx)("label",{htmlFor:"vbk-name",children:m("name")}),(0,b.jsx)("input",{id:"vbk-name",name:"name",type:"text",autoComplete:"name",autoCapitalize:"words",placeholder:m("name_ph"),value:n,onChange:a=>o(a.target.value),onBlur:()=>C(a=>({...a,name:!0})),"aria-invalid":G||void 0,"aria-describedby":G?"vbk-name-err":void 0,className:G?"is-invalid":"",required:!0}),G&&(0,b.jsx)("span",{id:"vbk-name-err",className:"vbk__err",role:"alert",children:m("name_err")})]}),(0,b.jsxs)("div",{className:"vbk__field",children:[(0,b.jsx)("label",{htmlFor:"vbk-phone",children:m("phone")}),(0,b.jsx)("input",{id:"vbk-phone",name:"phone",type:"tel",inputMode:"tel",autoComplete:"tel",dir:"ltr",value:p,onChange:a=>q(a.target.value),onBlur:()=>C(a=>({...a,phone:!0})),"aria-invalid":H||void 0,"aria-describedby":H?"vbk-phone-err":void 0,className:H?"is-invalid":"",required:!0}),H&&(0,b.jsx)("span",{id:"vbk-phone-err",className:"vbk__err",role:"alert",children:m("phone_err")})]})]}),(0,b.jsxs)("div",{className:"vbk__field",children:[(0,b.jsxs)("label",{htmlFor:"vbk-when",children:[m("when")," ",(0,b.jsx)("span",{className:"vbk__opt",children:m("optional")})]}),(0,b.jsx)("input",{id:"vbk-when",name:"preferred",type:"text",autoComplete:"off",placeholder:m("when_ph"),value:r,onChange:a=>s(a.target.value)})]}),(0,b.jsxs)("div",{className:"vbk__field",children:[(0,b.jsxs)("label",{htmlFor:"vbk-see",children:[m("see")," ",(0,b.jsx)("span",{className:"vbk__opt",children:m("optional")})]}),(0,b.jsx)("textarea",{id:"vbk-see",name:"interest",rows:3,placeholder:m("see_ph"),value:t,onChange:a=>u(a.target.value)})]}),z&&(0,b.jsxs)("p",{className:"vbk__formerr",role:"alert",children:[m("err")," ",(0,b.jsx)("a",{href:I,target:"_blank",rel:"noopener noreferrer",children:m("err_wa")})]}),(0,b.jsx)("button",{type:"submit",className:"btn btn-solid vbk__submit",children:v?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("span",{className:"vbk__spin","aria-hidden":!0}),m("sending")]}):(0,b.jsxs)(b.Fragment,{children:[m("submit"),(0,b.jsx)("span",{className:"arrow","aria-hidden":!0,children:"→"})]})})]})})]})]}),(0,b.jsx)("style",{children:j})]})}])}];

//# sourceMappingURL=components_visit_VisitBooking_tsx_1nzh3fa._.js.map