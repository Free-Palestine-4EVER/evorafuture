"use client";

/* ============================================================================
   Admin → Files

   Bakri's own file drawer. Anything he wants to keep or hand to a customer as
   a link: catalogues, price sheets, contracts, renders, photos, CAD/DWG, PDFs,
   video, zips. There is deliberately NO accepted-type list on the picker —
   that restriction is the whole thing this screen exists to remove.

   How it fits the platform:
     - the bytes go through POST /api/portal/upload, the same pipeline every
       other attachment in the app already uses (lib/portal/admin.ts writes to
       public/uploads, Caddy serves /uploads/* straight off disk);
     - this panel then calls POST /api/portal/uploads to INDEX what landed, so
       the drawer can list, link and — new — delete it, file and row together.

   Card-first like LicensesPanel, and for the same reason: Bakri works from the
   installed PWA on a phone, where a table is unusable.

   Every network call is checked for res.ok before anything is reported as
   done. This surface must never show a card for a file that is not on disk —
   the store layer throws on a non-ok response, and the server refuses to index
   a file it cannot stat.
   ========================================================================== */

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { deleteUpload, listUploads, recordUpload, uploadFileRaw } from "@/lib/portal/store";
import { MAX_UPLOAD_BYTES, type StoredUpload } from "@/lib/portal/types";

/* ---- small formatters --------------------------------------------------- */

/* Human size. The units stay Latin (KB / MB / GB) in Arabic too — that is what
   an Amman showroom actually writes and says — and every rendered size is
   wrapped in a bidi isolate so the run cannot be reordered inside RTL copy. */
function fmtSize(n?: number): string {
  if (!Number.isFinite(n) || (n as number) < 0) return "—";
  const b = n as number;
  if (b < 1024) return `${b} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let v = b / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i += 1; }
  return `${v < 10 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
}

const fmtDate = (t?: number, ar?: boolean) =>
  t ? new Date(t).toLocaleDateString(ar ? "ar-JO" : "en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const extOf = (u: Pick<StoredUpload, "name" | "file">) => {
  const from = (s: string) => (s.includes(".") ? s.split(".").pop()! : "");
  return (from(u.name) || from(u.file) || "").toLowerCase().slice(0, 5);
};

type Kind = "image" | "pdf" | "video" | "audio" | "archive" | "model" | "doc" | "other";

const EXT_KIND: Record<string, Kind> = {
  jpg: "image", jpeg: "image", png: "image", webp: "image", avif: "image", gif: "image", svg: "image", bmp: "image", heic: "image", tif: "image", tiff: "image",
  pdf: "pdf",
  mp4: "video", webm: "video", mov: "video", m4v: "video", ogv: "video", mkv: "video",
  mp3: "audio", wav: "audio", m4a: "audio", aac: "audio", ogg: "audio", flac: "audio",
  zip: "archive", rar: "archive", "7z": "archive", gz: "archive", tar: "archive",
  glb: "model", gltf: "model", usdz: "model", obj: "model", fbx: "model", stl: "model", dwg: "model", dxf: "model", skp: "model", "3dm": "model",
  doc: "doc", docx: "doc", xls: "doc", xlsx: "doc", ppt: "doc", pptx: "doc", txt: "doc", csv: "doc", rtf: "doc", pages: "doc", numbers: "doc",
};

/* Kind is decided from the MIME the browser reported AND the extension, because
   neither is reliable alone: a .dwg often arrives as application/octet-stream,
   and some browsers hand back an empty type for files dragged off a network
   share. */
function kindOf(u: Pick<StoredUpload, "name" | "file" | "type">): Kind {
  const mime = (u.type || "").toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return EXT_KIND[extOf(u)] || "other";
}

/* Clipboard, with a fallback — same helper as LicensesPanel. navigator.clipboard
   rejects when the document isn't focused (right after a native share sheet
   closes), and "Copy link" must never be a button that silently does nothing. */
async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

// Stored URLs are origin-free ("/uploads/…") so one record still resolves under
// evorahome.online, evorafuturehome.com or a LAN IP. Absolute only where a
// human needs to paste it somewhere else.
const absolute = (url: string) =>
  typeof window === "undefined" ? url : new URL(url, window.location.origin).href;

/* ---- upload queue ------------------------------------------------------- */

type QState = "waiting" | "sending" | "done" | "error";
type QItem = { key: string; name: string; size: number; state: QState; msg?: string };

export default function UploadsPanel() {
  const { lang, dir } = useT();
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const ar = lang === "ar";

  const [rows, setRows] = useState<StoredUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [queue, setQueue] = useState<QItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [preview, setPreview] = useState<StoredUpload | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // The control that opened the quick view, so focus can go back to it on close.
  const openerRef = useRef<HTMLElement | null>(null);

  const load = useCallback(async () => {
    try {
      setRows(await listUploads());
      setErr("");
    } catch {
      setErr(lang === "ar" ? "تعذّر تحميل الملفات. تحقّق من اتصالك." : "Couldn't load your files. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => { load(); }, [load]);

  const mark = (key: string, state: QState, msg?: string) =>
    setQueue((q) => q.map((x) => (x.key === key ? { ...x, state, msg } : x)));

  const failMsg = (e: unknown) => {
    const m = (e as Error)?.message;
    if (m === "TOO_LARGE") return t(`Too large — the limit is ${fmtSize(MAX_UPLOAD_BYTES)} per file.`, `أكبر من الحدّ المسموح — ${fmtSize(MAX_UPLOAD_BYTES)} لكل ملف.`);
    if (m === "UNAUTHORIZED") return t("Your session has expired. Sign in again.", "انتهت جلستك. سجّل الدخول من جديد.");
    if (m === "RECORD_FAILED") return t("It uploaded, but didn't make it into the list. Try again.", "تم الرفع لكنه لم يُسجَّل في القائمة. حاول مجددًا.");
    return t("Didn't upload. Try again.", "لم يُرفع. حاول مجددًا.");
  };

  /* One file at a time, on purpose. The body is base64 JSON held in memory on
     both ends, so three 100 MB files in flight together is the one way this
     screen could hurt a 2 vCPU / 8 GB box. Sequential also makes "2 of 5"
     honest. */
  async function addFiles(list: FileList | File[]) {
    const files = Array.from(list);
    if (!files.length) return;
    const items: QItem[] = files.map((f, i) => ({
      key: `${Date.now()}-${i}-${f.name}`, name: f.name, size: f.size, state: "waiting",
    }));
    setQueue((q) => [...items, ...q]);

    for (let i = 0; i < files.length; i += 1) {
      const f = files[i];
      const key = items[i].key;
      // Refuse locally before reading a byte, so an oversized file is never
      // base64'd in the browser only to be bounced by the server.
      if (f.size > MAX_UPLOAD_BYTES) { mark(key, "error", failMsg(new Error("TOO_LARGE"))); continue; }
      if (f.size === 0) { mark(key, "error", t("That file is empty.", "هذا الملف فارغ.")); continue; }
      mark(key, "sending");
      try {
        const stored = await uploadFileRaw(f);
        // The bytes are on disk now. If indexing them fails the file would sit
        // there with nothing pointing at it, so give the record one retry
        // before admitting defeat.
        try {
          await recordUpload({ file: stored.file, name: f.name, type: f.type });
        } catch {
          await new Promise((r) => setTimeout(r, 600));
          await recordUpload({ file: stored.file, name: f.name, type: f.type }).catch(() => { throw new Error("RECORD_FAILED"); });
        }
        mark(key, "done");
        await load();
      } catch (e) {
        mark(key, "error", failMsg(e));
      }
    }
    // Clear only the finished ones; failures stay until dismissed so a file
    // that never landed is never quietly forgotten.
    setTimeout(() => setQueue((q) => q.filter((x) => x.state !== "done")), 2600);
  }

  async function onCopy(u: StoredUpload) {
    const ok = await copy(absolute(u.url));
    setCopied(ok ? u.id : null);
    if (ok) setTimeout(() => setCopied((c) => (c === u.id ? null : c)), 2000);
    else setErr(t("Couldn't copy the link.", "تعذّر نسخ الرابط."));
  }

  async function onDelete(id: string) {
    setConfirmDel(null);
    try {
      await deleteUpload(id);
      setRows((r) => r.filter((x) => x.id !== id));
      await load();
    } catch {
      setErr(tp("delete_failed", lang));
    }
  }

  const q = query.trim().toLowerCase();
  const shown = q ? rows.filter((r) => `${r.name} ${r.type} ${extOf(r)}`.toLowerCase().includes(q)) : rows;
  const totalBytes = rows.reduce((n, r) => n + (r.size || 0), 0);
  const sending = queue.filter((x) => x.state === "sending" || x.state === "waiting").length;

  // "12 ملفًا" — Arabic counts a file differently at 1, 2, 3–10 and 11+, and
  // getting that wrong is the tell of a machine translation.
  const fileCount = (n: number) =>
    ar
      ? n === 0 ? "لا ملفات" : n === 1 ? "ملف واحد" : n === 2 ? "ملفان" : n <= 10 ? `${n} ملفات` : `${n} ملفًا`
      : `${n} ${n === 1 ? "file" : "files"}`;

  return (
    <div dir={dir}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.3rem" }}>
        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--ink-faint)", maxWidth: "58ch", lineHeight: 1.6 }}>
          {t(
            "Your own drawer. Keep anything here — catalogues, price lists, contracts, renders, photos, drawings, video — then copy its link and send it to whoever needs it.",
            "درجك الخاص. احفظ هنا ما تشاء — كتالوجات، قوائم أسعار، عقود، تصاميم، صور، مخططات، فيديو — ثم انسخ رابط الملف وأرسله لمن يحتاجه.",
          )}
        </p>
        <button onClick={() => inputRef.current?.click()} style={primaryBtn}>+ {t("Add files", "إضافة ملفات")}</button>
      </div>

      {/* ---- drop zone ---------------------------------------------------- */}
      <input
        ref={inputRef}
        type="file"
        multiple
        // No `accept` — any file type is the entire point of this screen.
        onChange={(e) => { const f = e.target.files; if (f) addFiles(f); e.target.value = ""; }}
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        aria-hidden="true"
        tabIndex={-1}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files); }}
        style={{
          width: "100%", display: "grid", gap: "0.35rem", justifyItems: "center", textAlign: "center",
          padding: "2rem 1.2rem", marginBottom: "1.3rem", cursor: "pointer",
          borderRadius: 16, border: `1.5px dashed ${dragging ? "var(--clay)" : "var(--line)"}`,
          background: dragging ? "rgba(178,116,87,0.07)" : "#faf8f4",
          transition: "background 160ms var(--ease, ease), border-color 160ms var(--ease, ease)",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={dragging ? "var(--clay)" : "var(--ink-faint)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M7 9l5-5 5 5" />
          <path d="M12 4v12" />
        </svg>
        <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: "0.95rem" }}>
          {t("Drop files here, or choose them from your device", "أفلِت الملفات هنا، أو اخترها من جهازك")}
        </span>
        <span dir="auto" style={{ ...isolate, fontSize: "0.78rem", color: "var(--ink-faint)" }}>
          {t(`Any kind of file · up to ${fmtSize(MAX_UPLOAD_BYTES)} each`, `أي نوع من الملفات · حتى ${fmtSize(MAX_UPLOAD_BYTES)} للملف الواحد`)}
        </span>
      </button>

      {/* ---- in-flight queue ---------------------------------------------- */}
      {queue.length > 0 && (
        <div style={{ ...card, padding: "0.9rem 1.1rem", marginBottom: "1.3rem", display: "grid", gap: "0.7rem" }}>
          <p style={{ ...sectTitle, margin: 0 }}>
            {sending > 0 ? t(`Uploading — ${sending} left`, `جارٍ الرفع — بقي ${sending}`) : t("Finished", "انتهى")}
          </p>
          {queue.map((it) => (
            <div key={it.key} style={{ display: "grid", gap: "0.3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", justifyContent: "space-between" }}>
                <span dir="auto" style={{ ...isolate, minWidth: 0, flex: 1, fontSize: "0.85rem", color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</span>
                <span dir="auto" style={{ ...isolate, flexShrink: 0, fontSize: "0.72rem", fontWeight: 700, color: it.state === "error" ? "var(--clay-text)" : it.state === "done" ? "#4B5A3C" : "var(--ink-faint)" }}>
                  {it.state === "done" ? t("Added", "تمت الإضافة")
                    : it.state === "error" ? t("Didn't upload", "لم يُرفع")
                    : it.state === "sending" ? t("Uploading…", "جارٍ الرفع…")
                    : t("Waiting", "في الانتظار")}
                </span>
              </div>
              {/* Indeterminate: a fetch() body gives no byte-level progress, so
                  this reports state honestly rather than animating a fake %. */}
              <div style={{ height: 3, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
                <div className={it.state === "sending" ? "ev-up-bar" : undefined}
                  style={{
                    height: "100%",
                    width: it.state === "done" ? "100%" : it.state === "error" ? "100%" : it.state === "sending" ? "40%" : "0%",
                    background: it.state === "error" ? "var(--clay)" : it.state === "done" ? "#6B7C5A" : "var(--clay)",
                  }} />
              </div>
              {it.msg && <p role="alert" style={{ margin: 0, fontSize: "0.76rem", color: "var(--clay-text)" }}>{it.msg}</p>}
            </div>
          ))}
          {queue.some((x) => x.state === "error") && (
            <button onClick={() => setQueue([])} style={{ ...miniBtn, justifySelf: "start" }}>{t("Clear", "مسح")}</button>
          )}
          <style>{`
            @keyframes ev-up-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
            .ev-up-bar { animation: ev-up-slide 1.1s ease-in-out infinite; }
            [dir="rtl"] .ev-up-bar { animation-direction: reverse; }
            @media (prefers-reduced-motion: reduce) { .ev-up-bar { animation: none; width: 100% !important; opacity: 0.5; } }
          `}</style>
        </div>
      )}

      {err && (
        <p role="alert" style={{ padding: "0.8rem 1.1rem", marginBottom: "1.2rem", borderRadius: 12, background: "rgba(178,116,87,0.12)", border: "1px solid rgba(178,116,87,0.35)", color: "#7A4A32", fontSize: "0.88rem" }}>{err}</p>
      )}

      {loading && <p style={{ color: "var(--ink-faint)", fontSize: "0.9rem" }}>{t("Loading…", "جارٍ التحميل…")}</p>}

      {!loading && rows.length === 0 && (
        <div style={{ ...card, padding: "2.4rem 1.6rem", textAlign: "center" }}>
          <p className="display" style={{ fontSize: "1.25rem", color: "var(--ink)", margin: "0 0 0.5rem" }}>{t("Nothing in here yet", "لا شيء هنا بعد")}</p>
          <p style={{ fontSize: "0.88rem", color: "var(--ink-faint)", margin: 0 }}>
            {t("The first file you add shows up here, with a link ready to copy.", "أول ملف تضيفه سيظهر هنا، ومعه رابط جاهز للنسخ.")}
          </p>
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap", marginBottom: "1.2rem" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            aria-label={t("Search files", "ابحث في الملفات")}
            placeholder={t("Search by name or type…", "ابحث بالاسم أو النوع…")}
            style={{ flex: "1 1 240px", maxWidth: 400, padding: "0.7rem 1.1rem", border: "1px solid var(--line)", borderRadius: 999, fontSize: "0.88rem", color: "var(--ink)", background: "#fff" }}
          />
          <span dir="auto" style={{ ...isolate, fontSize: "0.78rem", color: "var(--ink-faint)" }}>
            {fileCount(rows.length)} · {fmtSize(totalBytes)}
          </span>
        </div>
      )}

      {!loading && rows.length > 0 && shown.length === 0 && (
        <p style={{ color: "var(--ink-faint)", fontSize: "0.9rem" }}>{t("Nothing matches that.", "لا نتائج مطابقة.")}</p>
      )}

      {/* ---- the drawer --------------------------------------------------- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.1rem" }}>
        {shown.map((u) => {
          const kind = kindOf(u);
          const ext = extOf(u);
          return (
            <div key={u.id} style={{ ...card, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Preview tile. Only IMAGES mount real media here — a grid of
                  <video>/<iframe> thumbnails is exactly the mistake that killed
                  mobile Safari on /catalog. Everything else gets a cheap glyph,
                  and the heavy element mounts only inside the quick view. */}
              <button
                onClick={(e) => { openerRef.current = e.currentTarget; setPreview(u); }}
                title={t("Quick view", "عرض سريع")}
                aria-label={`${t("Quick view", "عرض سريع")} — ${u.name}`}
                style={{ position: "relative", display: "block", width: "100%", aspectRatio: "16/10", background: "#f3f0ea", border: "none", padding: 0, cursor: "zoom-in", overflow: "hidden" }}
              >
                {kind === "image" ? (
                  <img src={u.url} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--ink-faint)" }}>
                    <FileGlyph kind={kind} />
                  </span>
                )}
                {ext && (
                  <span dir="ltr" style={{ ...isolate, position: "absolute", top: 10, insetInlineEnd: 10, padding: "0.25em 0.6em", borderRadius: 999, background: "rgba(255,255,255,0.92)", color: "var(--ink)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{ext}</span>
                )}
              </button>

              <div style={{ padding: "0.9rem 1rem", display: "grid", gap: "0.6rem", alignContent: "start", flex: 1 }}>
                <div>
                  {/* dir="auto" + isolate: a Latin filename dropped raw into the
                      Arabic dashboard gets reordered by the bidi algorithm
                      ("Price-List-2026.pdf" reading back mangled), while an
                      Arabic filename must still run right-to-left. "auto" picks
                      per file from its first strong character. */}
                  <p dir="auto" title={u.name} style={{ ...isolate, margin: 0, fontWeight: 600, color: "var(--ink)", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
                  <p dir="auto" style={{ ...isolate, margin: "0.2rem 0 0", fontSize: "0.72rem", color: "var(--ink-faint)" }}>
                    {fmtSize(u.size)} · {fmtDate(u.createdAt, ar)}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  <button onClick={() => onCopy(u)} style={{ ...miniBtn, ...(copied === u.id ? { borderColor: "#6B7C5A", color: "#4B5A3C" } : {}) }}>
                    {copied === u.id ? tp("copied", lang) : t("Copy link", "نسخ الرابط")}
                  </button>
                  {/* Same-origin href, so the browser honours `download` and
                      saves it under the name Bakri uploaded rather than the
                      opaque hex name it has on disk. */}
                  <a href={u.url} download={u.name} style={{ ...miniBtn, textDecoration: "none", display: "inline-block" }}>
                    {t("Download", "تنزيل")}
                  </a>
                  <a href={u.url} target="_blank" rel="noreferrer" style={{ ...miniBtn, textDecoration: "none", display: "inline-block" }}>
                    {t("Open", "فتح")}
                  </a>
                  {confirmDel === u.id ? (
                    <>
                      <button autoFocus onClick={() => onDelete(u.id)}
                        title={t("Delete this file for good? It is removed from the server too, and any link you sent will stop working.", "حذف هذا الملف نهائيًا؟ سيُحذف من الخادم أيضًا، وأي رابط أرسلته سيتوقف عن العمل.")}
                        style={{ ...miniBtn, background: "var(--clay)", color: "#fff", border: "none" }}>{tp("yes_delete", lang)}</button>
                      <button onClick={() => setConfirmDel(null)} style={miniBtn}>{tp("cancel", lang)}</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmDel(u.id)} aria-label={`${tp("del", lang)} — ${u.name}`}
                      style={{ ...miniBtn, color: "var(--clay)", borderColor: "rgba(178,116,87,0.4)" }}>{tp("del", lang)}</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {preview && (
        <QuickView
          file={preview}
          onClose={() => { setPreview(null); openerRef.current?.focus?.(); openerRef.current = null; }}
        />
      )}
    </div>
  );
}

/* ---- quick view ---------------------------------------------------------
   Opens ONE file. The <video> / <iframe> / <img> for it is mounted here and
   nowhere else, so the list itself never holds a heavy element per row.
   Behaviour matches the dialogs already in this codebase (ShopQuickView,
   StartProjectModal): role="dialog" + aria-modal, Escape, backdrop click,
   visible close button, body-scroll lock — plus a focus trap and focus
   restoration, which those two do not do and a keyboard user needs. */

function QuickView({ file, onClose }: { file: StoredUpload; onClose: () => void }) {
  const { lang, dir } = useT();
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const kind = kindOf(file);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [mediaFailed, setMediaFailed] = useState(false);

  /* Can this device usefully embed a PDF? iOS Safari renders a PDF <iframe> as
     an inert grey box or one unscrollable page — the client hit exactly this on
     /catalog. Narrow screens and coarse pointers get a link out to the system
     viewer instead of a broken embed. Decided after mount so there is no
     hydration mismatch. */
  const [embedPdf, setEmbedPdf] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 901px)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const ua = navigator.userAgent;
    const ios = /iP(hone|od|ad)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    setEmbedPdf(wide && fine && !ios);
  }, []);

  // Escape + scroll lock (the shared portal behaviour), then focus in and back.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, iframe, video, audio, [tabindex]:not([tabindex="-1"])',
      ) ?? []).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      // Wrap at both ends, and pull focus back in if it ever escaped the panel.
      if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !panelRef.current?.contains(active))) { e.preventDefault(); first.focus(); }
    };

    window.addEventListener("keydown", onKey);
    const id = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(id);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [onClose]);

  const noPreview = (
    <div style={{ display: "grid", gap: "0.5rem", justifyItems: "center", textAlign: "center", padding: "3rem 1.5rem", color: "var(--ink-soft)" }}>
      <span style={{ color: "var(--ink-faint)" }}><FileGlyph kind={kind} size={44} /></span>
      <p className="display" style={{ fontSize: "1.15rem", color: "var(--ink)", margin: "0.4rem 0 0" }}>
        {t("No preview for this kind of file", "لا يمكن معاينة هذا النوع من الملفات")}
      </p>
      <p dir="auto" style={{ ...isolate, margin: 0, fontSize: "0.85rem", color: "var(--ink-faint)" }}>
        {(extOf(file) || file.type || "file").toUpperCase()} · {fmtSize(file.size)}
      </p>
      <p style={{ margin: "0.3rem 0 0", fontSize: "0.82rem", color: "var(--ink-faint)", maxWidth: "36ch", lineHeight: 1.6 }}>
        {t("Download it to open it on your device.", "نزّله لفتحه على جهازك.")}
      </p>
    </div>
  );

  let body: React.ReactNode = noPreview;
  if (mediaFailed) body = noPreview;
  else if (kind === "image") {
    body = (
      // max-width:100% fits the viewport; the natural-size cap stops a small
      // logo being blown up into a blurry poster.
      <img
        src={file.url}
        alt={file.name}
        onError={() => setMediaFailed(true)}
        style={{ display: "block", margin: "0 auto", maxWidth: "100%", maxHeight: "72dvh", width: "auto", height: "auto", objectFit: "contain", borderRadius: 10, background: "#f3f0ea" }}
      />
    );
  } else if (kind === "pdf") {
    body = embedPdf ? (
      <iframe src={file.url} title={file.name} style={{ display: "block", width: "100%", height: "72dvh", border: "1px solid var(--line)", borderRadius: 10, background: "#fff" }} />
    ) : (
      <div style={{ display: "grid", gap: "0.6rem", justifyItems: "center", textAlign: "center", padding: "2.6rem 1.5rem" }}>
        <span style={{ color: "var(--ink-faint)" }}><FileGlyph kind="pdf" size={44} /></span>
        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--ink-soft)", maxWidth: "36ch", lineHeight: 1.6 }}>
          {t("PDFs open better in your phone's own viewer than inside this page.", "تُفتح ملفات PDF في عارض هاتفك أفضل بكثير من داخل هذه الصفحة.")}
        </p>
        <a href={file.url} target="_blank" rel="noreferrer" style={{ ...primaryBtn, textDecoration: "none", display: "inline-block" }}>
          {t("Open the PDF", "افتح ملف PDF")}
        </a>
      </div>
    );
  } else if (kind === "video") {
    body = (
      // preload="metadata" and no autoplay: this is a work tool on a phone, not
      // a hero section, and Bakri may be on cellular data.
      <video
        src={file.url}
        controls
        preload="metadata"
        playsInline
        onError={() => setMediaFailed(true)}
        style={{ display: "block", width: "100%", maxHeight: "72dvh", borderRadius: 10, background: "#000" }}
      />
    );
  } else if (kind === "audio") {
    body = (
      <div style={{ padding: "2.4rem 1.5rem", display: "grid", gap: "1rem", justifyItems: "center" }}>
        <span style={{ color: "var(--ink-faint)" }}><FileGlyph kind="audio" size={40} /></span>
        <audio src={file.url} controls preload="metadata" onError={() => setMediaFailed(true)} style={{ width: "min(420px, 100%)" }} />
      </div>
    );
  }

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(13,13,13,0.92)", display: "grid", placeItems: "center", padding: "1rem" }}
    >
      <div
        ref={panelRef}
        dir={dir}
        role="dialog"
        aria-modal="true"
        aria-label={file.name}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(940px, 100%)", maxHeight: "92dvh", overflowY: "auto",
          background: "var(--paper)", borderRadius: 18,
          padding: "1.2rem 1.2rem calc(1.2rem + env(safe-area-inset-bottom))",
          boxShadow: "0 40px 120px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem", marginBottom: "0.9rem" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2 dir="auto" className="display" style={{ ...isolate, fontSize: "1.15rem", color: "var(--ink)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</h2>
            <p dir="auto" style={{ ...isolate, margin: "0.15rem 0 0", fontSize: "0.74rem", color: "var(--ink-faint)" }}>
              {(extOf(file) || "file").toUpperCase()} · {fmtSize(file.size)} · {fmtDate(file.createdAt, lang === "ar")}
            </p>
          </div>
          <button
            data-autofocus
            onClick={onClose}
            aria-label={tp("close", lang)}
            style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 999, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", cursor: "pointer", display: "grid", placeItems: "center" }}
          >
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        </div>

        {body}

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <a href={file.url} download={file.name} style={{ ...primaryBtn, textDecoration: "none", display: "inline-block" }}>{t("Download", "تنزيل")}</a>
          <a href={file.url} target="_blank" rel="noreferrer" style={{ ...miniBtn, textDecoration: "none", display: "inline-block", padding: "0.6rem 1.2rem" }}>{t("Open in a new tab", "فتح في تبويب جديد")}</a>
          <button onClick={onClose} style={{ ...miniBtn, padding: "0.6rem 1.2rem" }}>{tp("close", lang)}</button>
        </div>
      </div>
    </div>
  );
}

/* ---- glyphs -------------------------------------------------------------
   Line icons in the portal's house style (stroke = currentColor, 1.5 weight),
   one per family so a drawer of twenty files still reads at a glance. */
function FileGlyph({ kind, size = 30 }: { kind: Kind; size?: number }) {
  const d: Record<Kind, string> = {
    image: "M3 5h18v14H3z|M8 11a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 8 11|M21 16l-5-5-6 6-3-3-4 4",
    pdf: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6|M8 13h8|M8 17h5",
    doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6|M8 13h8|M8 17h8",
    video: "M3 6h13v12H3z|M16 10l5-3v10l-5-3z",
    audio: "M9 18V5l11-2v13|M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0|M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
    archive: "M4 3h16v18H4z|M12 3v4|M12 9v2|M12 13v2|M10.5 17h3v3h-3z",
    model: "M12 2l9 5v10l-9 5-9-5V7z|M3 7l9 5 9-5|M12 12v10",
    other: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d[kind].split("|").map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

/* Latin filenames, sizes and dates are directional runs of their own. Dropped
   raw into the Arabic (RTL) dashboard the bidi algorithm reorders their
   segments — the same failure that was making customer phone numbers read back
   wrong on the leads board. `isolate` keeps each run out of the surrounding
   paragraph's ordering; `dir="auto"` then lets an Arabic filename still run
   right-to-left. */
const isolate: React.CSSProperties = { unicodeBidi: "isolate", textAlign: "start" };

const card: React.CSSProperties = { background: "#fff", border: "1px solid var(--line)", borderRadius: 16 };
const sectTitle: React.CSSProperties = { fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", margin: 0, fontWeight: 600 };
const primaryBtn: React.CSSProperties = { padding: "0.6rem 1.2rem", borderRadius: 999, border: "none", background: "var(--clay)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" };
const miniBtn: React.CSSProperties = { padding: "0.4rem 0.9rem", borderRadius: 999, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontSize: "0.76rem", cursor: "pointer" };
