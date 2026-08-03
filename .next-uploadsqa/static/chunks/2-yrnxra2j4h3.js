(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,88653,e=>{"use strict";e.i(247167);var t=e.i(843476),r=e.i(271645),n=e.i(231178),a=e.i(947414),i=e.i(674008),s=e.i(821476),o=e.i(772846),l=r,d=e.i(737806);function p(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class c extends l.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if((0,o.isHTMLElement)(t)&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=t.offsetParent,r=(0,o.isHTMLElement)(e)&&e.offsetWidth||0,n=(0,o.isHTMLElement)(e)&&e.offsetHeight||0,a=getComputedStyle(t),i=this.props.sizeRef.current;i.height=parseFloat(a.height),i.width=parseFloat(a.width),i.top=t.offsetTop,i.left=t.offsetLeft,i.right=r-i.width-i.left,i.bottom=n-i.height-i.top,i.direction=a.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function u({children:e,isPresent:n,anchorX:a,anchorY:i,root:s,pop:o}){let m=(0,l.useId)(),f=(0,l.useRef)(null),h=(0,l.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:g}=(0,l.useContext)(d.MotionConfigContext),x=function(...e){return r.useCallback(function(...e){return t=>{let r=!1,n=e.map(e=>{let n=p(e,t);return r||"function"!=typeof n||(r=!0),n});if(r)return()=>{for(let t=0;t<n.length;t++){let r=n[t];"function"==typeof r?r():p(e[t],null)}}}}(...e),e)}(f,e.props?.ref??e?.ref);return(0,l.useInsertionEffect)(()=>{let{width:e,height:t,top:r,left:l,right:d,bottom:p,direction:c}=h.current;if(n||!1===o||!f.current||!e||!t)return;let u="rtl"===c,x="left"===a?u?`right: ${d}`:`left: ${l}`:u?`left: ${l}`:`right: ${d}`,b="bottom"===i?`bottom: ${p}`:`top: ${r}`;f.current.dataset.motionPopId=m;let y=document.createElement("style");g&&(y.nonce=g);let v=s??document.head;return v.appendChild(y),y.sheet&&y.sheet.insertRule(`
          [data-motion-pop-id="${m}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            ${x}px !important;
            ${b}px !important;
          }
        `),()=>{f.current?.removeAttribute("data-motion-pop-id"),v.contains(y)&&v.removeChild(y)}},[n]),(0,t.jsx)(c,{isPresent:n,childRef:f,sizeRef:h,pop:o,children:!1===o?e:l.cloneElement(e,{ref:x})})}let m=({children:e,initial:n,isPresent:i,onExitComplete:o,custom:l,presenceAffectsLayout:d,mode:p,anchorX:c,anchorY:m,root:h})=>{let g=(0,a.useConstant)(f),x=(0,r.useId)(),b=!0,y=(0,r.useMemo)(()=>(b=!1,{id:x,initial:n,isPresent:i,custom:l,onExitComplete:e=>{for(let t of(g.set(e,!0),g.values()))if(!t)return;o&&o()},register:e=>(g.set(e,!1),()=>g.delete(e))}),[i,g,o]);return d&&b&&(y={...y}),(0,r.useMemo)(()=>{g.forEach((e,t)=>g.set(t,!1))},[i]),r.useEffect(()=>{i||g.size||!o||o()},[i]),e=(0,t.jsx)(u,{pop:"popLayout"===p,isPresent:i,anchorX:c,anchorY:m,root:h,children:e}),(0,t.jsx)(s.PresenceContext.Provider,{value:y,children:e})};function f(){return new Map}var h=e.i(464978);let g=e=>e.key||"";function x(e){let t=[];return r.Children.forEach(e,e=>{(0,r.isValidElement)(e)&&t.push(e)}),t}e.s(["AnimatePresence",0,({children:e,custom:s,initial:o=!0,onExitComplete:l,presenceAffectsLayout:d=!0,mode:p="sync",propagate:c=!1,anchorX:u="left",anchorY:f="top",root:b})=>{let[y,v]=(0,h.usePresence)(c),w=(0,r.useMemo)(()=>x(e),[e]),j=c&&!y?[]:w.map(g),k=(0,r.useRef)(!0),C=(0,r.useRef)(w),E=(0,a.useConstant)(()=>new Map),N=(0,r.useRef)(new Set),[P,T]=(0,r.useState)(w),[S,R]=(0,r.useState)(w);(0,i.useIsomorphicLayoutEffect)(()=>{k.current=!1,C.current=w;for(let e=0;e<S.length;e++){let t=g(S[e]);j.includes(t)?(E.delete(t),N.current.delete(t)):!0!==E.get(t)&&E.set(t,!1)}},[S,j.length,j.join("-")]);let z=[];if(w!==P){let e=[...w];for(let t=0;t<S.length;t++){let r=S[t],n=g(r);j.includes(n)||(e.splice(t,0,r),z.push(r))}return"wait"===p&&z.length&&(e=z),R(x(e)),T(w),null}let{forceRender:L}=(0,r.useContext)(n.LayoutGroupContext);return(0,t.jsx)(t.Fragment,{children:S.map(e=>{let r=g(e),n=(!c||!!y)&&(w===S||j.includes(r));return(0,t.jsx)(m,{isPresent:n,initial:(!k.current||!!o)&&void 0,custom:s,presenceAffectsLayout:d,mode:p,root:b,onExitComplete:n?void 0:()=>{if(N.current.has(r)||!E.has(r))return;N.current.add(r),E.set(r,!0);let e=!0;E.forEach(t=>{t||(e=!1)}),e&&(L?.(),R(C.current),c&&v?.(),l&&l())},anchorX:u,anchorY:f,children:e},r)})})}],88653)},503396,e=>{"use strict";var t=e.i(843476),r=e.i(271645),n=e.i(88653),a=e.i(846932),i=e.i(207761),s=e.i(400071),o=e.i(912469);let l={eyebrow:{en:"Start your future home",ar:"ابدأ منزل المستقبل"},title:{en:"Send us your 2D plan",ar:"أرسل لنا مخططك"},sub:{en:"Leave your details and attach your floor plan. Our team will call you, then turn it into a fully furnished 3D home.",ar:"اترك بياناتك وأرفق مخططك. سيتصل بك فريقنا، ثم نحوّله إلى منزل ثلاثي الأبعاد مفروش بالكامل."},name:{en:"Your name",ar:"اسمك"},email:{en:"Email address",ar:"البريد الإلكتروني"},phone:{en:"Phone / WhatsApp number",ar:"رقم الهاتف / واتساب"},msg:{en:"Tell us about your space (optional)",ar:"أخبرنا عن مساحتك (اختياري)"},plan:{en:"Upload your 2D plan",ar:"ارفع مخططك ثنائي الأبعاد"},planHint:{en:"PDF, JPG or PNG",ar:"PDF أو JPG أو PNG"},send:{en:"Request my 3D design",ar:"اطلب تصميمي ثلاثي الأبعاد"},sending:{en:"Sending…",ar:"جارٍ الإرسال…"},uploading:{en:"Uploading plan…",ar:"جارٍ رفع المخطط…"},done_t:{en:"Got it — we'll call you soon.",ar:"تم — سنتصل بك قريبًا."},done_s:{en:"Our team will review your plan and reach out on the details you gave us.",ar:"سيراجع فريقنا مخططك ويتواصل معك على البيانات التي أدخلتها."},close:{en:"Close",ar:"إغلاق"},err:{en:"Something went wrong. Please try again or WhatsApp us.",ar:"حدث خطأ ما. حاول مجددًا أو راسلنا عبر واتساب."}};e.s(["default",0,function({initialOpen:e=!1}){let{lang:d,dir:p}=(0,i.useT)(),c=e=>l[e][d],[u,m]=(0,r.useState)(e),[f,h]=(0,r.useState)(""),[g,x]=(0,r.useState)(""),[b,y]=(0,r.useState)(""),[v,w]=(0,r.useState)(""),[j,k]=(0,r.useState)(null),[C,E]=(0,r.useState)("idle"),[N,P]=(0,r.useState)(!1),[T,S]=(0,r.useState)(!1),R=(0,r.useRef)(null),z=(0,r.useRef)(null);(0,r.useEffect)(()=>{let e=()=>{P(!1),S(!1),m(!0)};return window.addEventListener(o.START_PROJECT_EVENT,e),()=>window.removeEventListener(o.START_PROJECT_EVENT,e)},[]),(0,r.useEffect)(()=>{if(!u)return;let e=document.body.style.overflow;document.body.style.overflow="hidden";let t=e=>"Escape"===e.key&&m(!1);window.addEventListener("keydown",t);let r=window.setTimeout(()=>z.current?.focus(),80);return()=>{document.body.style.overflow=e,window.removeEventListener("keydown",t),window.clearTimeout(r)}},[u]);let L="idle"!==C;async function A(e){if(e.preventDefault(),b.trim()&&!L){S(!1);try{let e="";j&&(E("uploading"),e=await (0,s.uploadFile)(j)),E("sending");let t=await (0,s.createLead)(f.trim(),b.trim(),v.trim(),e,g.trim());if(!t||"string"!=typeof t.id||!t.id)throw Error("LEAD_NOT_CREATED");P(!0)}catch{S(!0)}finally{E("idle")}}}return(0,t.jsx)(n.AnimatePresence,{children:u&&(0,t.jsxs)(a.motion.div,{className:"spm-backdrop",dir:p,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.25},onMouseDown:e=>e.target===e.currentTarget&&m(!1),children:[(0,t.jsxs)(a.motion.div,{className:"spm-card",role:"dialog","aria-modal":"true","aria-label":c("title"),initial:{opacity:0,y:24,scale:.97},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:16,scale:.98},transition:{type:"spring",stiffness:260,damping:26},children:[(0,t.jsx)("button",{className:"spm-x","aria-label":c("close"),onClick:()=>m(!1),children:"×"}),N?(0,t.jsxs)("div",{className:"spm-done",children:[(0,t.jsx)("div",{className:"spm-check",children:"✓"}),(0,t.jsx)("h3",{className:"spm-title",children:c("done_t")}),(0,t.jsx)("p",{className:"spm-sub",children:c("done_s")}),(0,t.jsx)("button",{className:"spm-submit",onClick:()=>m(!1),children:c("close")})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("span",{className:"spm-eyebrow",children:c("eyebrow")}),(0,t.jsx)("h3",{className:"spm-title",children:c("title")}),(0,t.jsx)("p",{className:"spm-sub",children:c("sub")}),(0,t.jsxs)("form",{onSubmit:A,className:"spm-form",children:[(0,t.jsx)("input",{ref:z,className:"spm-field",placeholder:c("name"),value:f,onChange:e=>h(e.target.value),autoComplete:"name"}),(0,t.jsx)("input",{className:"spm-field",type:"email",placeholder:c("email"),value:g,onChange:e=>x(e.target.value),autoComplete:"email"}),(0,t.jsx)("input",{className:"spm-field",type:"tel",placeholder:c("phone"),value:b,onChange:e=>y(e.target.value),autoComplete:"tel",required:!0}),(0,t.jsx)("textarea",{className:"spm-field spm-area",placeholder:c("msg"),value:v,onChange:e=>w(e.target.value)}),(0,t.jsxs)("button",{type:"button",className:`spm-upload ${j?"has-file":""}`,onClick:()=>R.current?.click(),children:[(0,t.jsx)("span",{className:"spm-upload-icon",children:"⤓"}),(0,t.jsxs)("span",{className:"spm-upload-text",children:[(0,t.jsx)("strong",{children:j?j.name:c("plan")}),(0,t.jsx)("em",{children:c("planHint")})]})]}),(0,t.jsx)("input",{ref:R,type:"file",accept:"image/*,application/pdf",style:{display:"none"},onChange:e=>k(e.target.files?.[0]??null)}),T&&(0,t.jsx)("p",{className:"spm-error",children:c("err")}),(0,t.jsxs)("button",{type:"submit",className:"spm-submit",disabled:L||!b.trim(),children:[c("uploading"===C?"uploading":"sending"===C?"sending":"send"),!L&&(0,t.jsx)("span",{className:"spm-arrow","aria-hidden":!0,children:"ar"===d?"←":"→"})]})]})]})]}),(0,t.jsx)("style",{children:`
            .spm-backdrop {
              position: fixed; inset: 0; z-index: 1000;
              display: grid; place-items: center;
              padding: clamp(16px, 4vw, 40px);
              background: rgba(22,21,15,0.5);
              backdrop-filter: blur(6px);
            }
            .spm-card {
              position: relative;
              width: 100%; max-width: 520px;
              max-height: 92vh; overflow-y: auto;
              background: var(--paper, #f7f3ec);
              border: 1px solid var(--line, rgba(30,27,23,0.14));
              border-radius: 22px;
              padding: clamp(1.6rem, 4vw, 2.6rem);
              box-shadow: 0 50px 120px -40px rgba(22,21,15,0.6);
            }
            .spm-x {
              position: absolute; top: 14px; inset-inline-end: 16px;
              width: 34px; height: 34px; border-radius: 999px;
              border: 1px solid var(--line); background: #fff;
              font-size: 1.3rem; line-height: 1; color: var(--ink-soft);
              cursor: pointer; display: grid; place-items: center;
              transition: background .2s ease, color .2s ease;
            }
            .spm-x:hover { background: var(--ink); color: #fff; }
            .spm-eyebrow {
              font-family: var(--f-sans); font-size: 0.72rem; font-weight: 600;
              letter-spacing: 0.2em; text-transform: uppercase; color: var(--clay, #9c4f38);
            }
            .spm-title {
              font-family: var(--f-display), Georgia, serif;
              font-optical-sizing: auto;
              font-size: clamp(1.7rem, 4vw, 2.4rem);
              line-height: 1.05; letter-spacing: -0.015em;
              color: var(--ink); margin: 0.7rem 0 0.6rem;
            }
            .spm-sub {
              font-family: var(--f-sans); color: var(--ink-soft);
              font-size: 1rem; line-height: 1.6; margin: 0 0 1.4rem; max-width: 42ch;
            }
            .spm-form { display: grid; gap: 0.75rem; }
            .spm-field {
              width: 100%; padding: 0.95rem 1.05rem;
              border: 1px solid var(--line); border-radius: 12px;
              background: #fff; font-family: var(--f-sans); font-size: 1rem;
              color: var(--ink); outline: none;
              transition: border-color .2s ease, box-shadow .2s ease;
            }
            .spm-field:focus { border-color: var(--brass, #b08d57); box-shadow: 0 0 0 3px rgba(176,141,87,0.18); }
            .spm-area { min-height: 84px; resize: vertical; }
            .spm-upload {
              display: flex; align-items: center; gap: 0.85rem;
              padding: 0.9rem 1.05rem; border-radius: 12px; cursor: pointer;
              border: 1.5px dashed var(--line); background: #fff; text-align: start;
              transition: border-color .2s ease, background .2s ease;
            }
            .spm-upload:hover { border-color: var(--brass); background: #fffdf9; }
            .spm-upload.has-file { border-style: solid; border-color: var(--ever, #2f5d4a); }
            .spm-upload-icon {
              flex: none; width: 38px; height: 38px; border-radius: 10px;
              display: grid; place-items: center; font-size: 1.2rem;
              background: var(--bone, #efe8dc); color: var(--clay);
            }
            .spm-upload-text { display: flex; flex-direction: column; min-width: 0; }
            .spm-upload-text strong { font-family: var(--f-sans); font-size: 0.95rem; font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .spm-upload-text em { font-style: normal; font-size: 0.78rem; color: var(--ink-faint, #9a948b); }
            .spm-error { margin: 0; font-size: 0.85rem; color: var(--clay); font-family: var(--f-sans); }
            .spm-submit {
              margin-top: 0.4rem; padding: 1.05rem; border-radius: 12px; border: none;
              background: var(--ink); color: #fff; font-family: var(--f-sans);
              font-weight: 600; font-size: 1rem; cursor: pointer;
              display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
              transition: background .2s ease, transform .2s ease, opacity .2s ease;
            }
            .spm-submit:hover:not(:disabled) { background: var(--brass-2, #8a6d3f); transform: translateY(-1px); }
            .spm-submit:disabled { opacity: 0.55; cursor: default; }
            .spm-done { text-align: center; padding: 1.4rem 0 0.4rem; }
            .spm-check {
              width: 56px; height: 56px; border-radius: 999px; margin: 0 auto 1.1rem;
              background: var(--ever, #2f5d4a); color: #fff; display: grid; place-items: center; font-size: 1.5rem;
            }
          `})]})})}])},16602,e=>{e.n(e.i(503396))}]);