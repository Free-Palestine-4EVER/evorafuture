"use client";

// Puffer ↔ Evora portal bridge.
// - Staff must sign in (e.g. bakri@evorafuture.com) to write to the database.
// - Save the current furnished design and ASSIGN it to a customer by phone.
// - The customer gets a sign-up link; when they register with that phone they
//   instantly see this project + its live journey on their portal.
//
// The portal runs on :3100 on the same machine; we derive its URL from the host.

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useStudio } from "@/lib/puffer/store";
import { buildGlbBuffer } from "@/lib/puffer/exporters";

function abToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(bin);
}

// Turn the 2D plan (a data-URL OR a sample path like /samples/x.svg) into raw
// bytes + extension, so we can upload it to the portal and have IT serve the
// file (a Puffer-only path would 404 on the customer's portal).
async function planToUpload(src: string): Promise<{ ext: string; b64: string } | null> {
  const extFromMime = (m: string) =>
    m.includes("svg") ? "svg" : m.includes("png") ? "png" : m.includes("jpeg") || m.includes("jpg") ? "jpg" : m.includes("webp") ? "webp" : "png";
  try {
    if (src.startsWith("data:")) {
      const m = src.match(/^data:([^;]+);base64,(.*)$/);
      if (m) return { ext: extFromMime(m[1]), b64: m[2] };
    }
    const res = await fetch(src);
    const blob = await res.blob();
    const buf = await blob.arrayBuffer();
    const ext = blob.type ? extFromMime(blob.type) : (src.split(".").pop() || "png").toLowerCase();
    return { ext, b64: abToB64(buf) };
  } catch { return null; }
}

type User = { uid: string; name: string; role: string; email?: string };
const SKEY = "evora_puffer_staff";

function portalBase() {
  // Puffer is part of the portal app now (route /pufferweb) → API is same-origin.
  return typeof window === "undefined" ? "" : window.location.origin;
}

export default function EvoraSync() {
  const planImage = useStudio((s) => s.planImage);
  const imgW = useStudio((s) => s.imgW);
  const imgH = useStudio((s) => s.imgH);
  const mmPerPx = useStudio((s) => s.mmPerPx);
  const rects = useStudio((s) => s.rects);
  const walls = useStudio((s) => s.walls);
  const userProducts = useStudio((s) => s.userProducts);
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState<User | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [qr, setQr] = useState("");

  // login
  const [email, setEmail] = useState("bakri@evorafuture.com");
  const [pass, setPass] = useState("");
  // save form
  const [phone, setPhone] = useState("");
  const [cname, setCname] = useState("");
  const [title, setTitle] = useState("");
  const [room, setRoom] = useState("");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => { try { setStaff(JSON.parse(localStorage.getItem(SKEY) || "null")); } catch {} }, []);

  async function login() {
    setBusy(true); setMsg(null);
    try {
      const r = await fetch(`${portalBase()}/api/portal/signin`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email.trim(), password: pass }),
      });
      if (!r.ok) throw new Error("Wrong email or password.");
      const u: User = await r.json();
      if (u.role !== "admin") throw new Error("This account can't write to Evora.");
      localStorage.setItem(SKEY, JSON.stringify(u));
      setStaff(u); setPass("");
    } catch (e) { setMsg({ kind: "err", text: (e as Error).message }); }
    finally { setBusy(false); }
  }
  function logout() { localStorage.removeItem(SKEY); setStaff(null); }

  async function save() {
    if (!phone.trim()) return setMsg({ kind: "err", text: "Enter the customer's phone number." });
    if (!title.trim()) return setMsg({ kind: "err", text: "Give the design a title." });
    setBusy(true); setMsg(null); setQr("");
    try {
      // 1) Export the real furnished 3D room as a GLB and upload it.
      let model3dUrl = "";
      const scale = mmPerPx || (imgW || imgH ? 10000 / Math.max(imgW, imgH) : 0);
      if (scale && (rects.length || walls.length)) {
        setMsg({ kind: "ok", text: "Building the 3D room…" });
        const glb = await buildGlbBuffer(walls, rects, imgW, imgH, scale, userProducts);
        const up = await fetch(`${portalBase()}/api/portal/upload`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ext: "glb", dataBase64: abToB64(glb) }),
        });
        if (up.ok) model3dUrl = (await up.json()).url || "";
      }
      // 2) Upload the 2D plan to the portal so it serves the file (a Puffer
      //    path like /samples/x.svg would 404 on the customer's portal).
      let plan2dUrl = "";
      if (planImage) {
        const up = await planToUpload(planImage);
        if (up) {
          const r2 = await fetch(`${portalBase()}/api/portal/upload`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ext: up.ext, dataBase64: up.b64 }),
          });
          if (r2.ok) plan2dUrl = (await r2.json()).url || "";
        }
      }
      // 3) Save the project (2D plan + 3D room) assigned to the customer.
      const r = await fetch(`${portalBase()}/api/portal/projects`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerPhone: phone.trim(), ownerName: cname.trim(),
          title: title.trim(), room: room.trim(), status: "draft", stage: "blueprint", notes: notes.trim(),
          thumbnailUrl: plan2dUrl, plan2dUrl, model3dUrl,
        }),
      });
      if (!r.ok) throw new Error();
      const url = `${portalBase()}/join?phone=${encodeURIComponent(phone.trim())}`;
      setLink(url);
      setQr(await QRCode.toDataURL(url, { width: 320, margin: 1 }));
      setMsg({ kind: "ok", text: model3dUrl ? "Saved with the 3D room. Share the link/QR with the customer." : "Saved (no 3D — add slots/walls first). Share the link below." });
      setTitle(""); setRoom(""); setNotes("");
    } catch { setMsg({ kind: "err", text: "Save failed — is the portal running on :3100?" }); }
    finally { setBusy(false); }
  }

  const input = "w-full rounded-md border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-sm text-neutral-100 outline-none focus:border-sky-500";

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="rounded-md bg-sky-600 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-sky-500">
        {staff ? "Save to Evora" : "Evora login"}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-neutral-800 bg-neutral-950 p-3 shadow-2xl">
          {!staff ? (
            <div className="space-y-2">
              <p className="text-xs text-neutral-400">Sign in to save designs to the Evora database.</p>
              <input className={input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className={input} type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} />
              <button disabled={busy} onClick={login} className="w-full rounded-md bg-sky-600 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50">{busy ? "…" : "Sign in"}</button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>{staff.name} · staff</span>
                <button onClick={logout} className="text-neutral-500 hover:text-neutral-300">Sign out</button>
              </div>
              <input className={input} placeholder="Customer phone (their login)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className={input} placeholder="Customer name (optional)" value={cname} onChange={(e) => setCname(e.target.value)} />
              <input className={input} placeholder="Design title (e.g. Living Room)" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input className={input} placeholder="Room (optional)" value={room} onChange={(e) => setRoom(e.target.value)} />
              <textarea className={input} placeholder="Notes (optional)" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
              <div className="space-y-1 rounded-md border border-neutral-800 bg-neutral-900/60 px-2.5 py-2 text-[11px]">
                <div>{planImage ? <span className="text-emerald-400">✓ 2D plan attached</span> : <span className="text-neutral-500">○ No 2D plan uploaded yet</span>}</div>
                <div>
                  {(rects.length || walls.length)
                    ? <span className="text-emerald-400">✓ 3D room ready — {walls.length} walls · {rects.length} furniture slots</span>
                    : <span className="text-amber-400">⚠ No 3D yet — run <b>Auto-walls</b> / <b>Auto-slots</b> (or draw them) to include the 3D room</span>}
                </div>
              </div>
              <button disabled={busy} onClick={save} className="w-full rounded-md bg-sky-600 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50">
                {busy ? "Saving…" : (rects.length || walls.length) ? "Save 2D + 3D & assign to customer" : "Save 2D only & assign to customer"}
              </button>

              {link && (
                <div className="rounded-md border border-emerald-800 bg-emerald-950/40 p-2">
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-emerald-400">Customer sign-up link</p>
                  <div className="flex items-center gap-1">
                    <input readOnly className="w-full bg-transparent text-[11px] text-emerald-200 outline-none" value={link} />
                    <button onClick={() => navigator.clipboard?.writeText(link)} className="rounded bg-emerald-700 px-2 py-0.5 text-[11px] text-white">Copy</button>
                  </div>
                  {qr && (
                    <div className="mt-2 flex flex-col items-center gap-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qr} alt="Sign-up QR" className="h-40 w-40 rounded bg-white p-1.5" />
                      <span className="text-[10px] text-emerald-300/80">Customer scans to create their account</span>
                      <a href={qr} download="evora-signup-qr.png" className="text-[10px] text-emerald-400 underline">Download QR</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {msg && <p className={`mt-2 text-xs ${msg.kind === "ok" ? "text-emerald-400" : "text-rose-400"}`}>{msg.text}</p>}
          <p className="mt-2 text-[10px] text-neutral-600">Portal: {portalBase()}/dashboard</p>
        </div>
      )}
    </div>
  );
}
