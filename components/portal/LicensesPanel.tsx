"use client";

/* ============================================================================
   Admin → Licences

   Mints and manages the desktop-app keys for Evora Studio (the Windows .exe /
   macOS .dmg shell around /evora3dstudio). One key, one machine: the first
   launch binds the key to the PC it was entered on, and only an admin here can
   free it again.

   Built card-first rather than as a table on purpose — Bakri manages these
   from the installed PWA on a phone, where a 7-column table is unusable. The
   layout is a single column that widens into a grid on a desktop screen.
   ========================================================================== */

import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { useDialogClose } from "@/components/portal/useDialogClose";
import {
  createLicense,
  deleteLicense,
  listLicenses,
  setLicenseRevoked,
  unbindLicense,
} from "@/lib/portal/store";
import type { License } from "@/lib/portal/types";

type Tone = "live" | "idle" | "dead";
type State = { tone: Tone; en: string; ar: string };

function stateOf(l: License): State {
  if (l.revoked) return { tone: "dead", en: "Revoked", ar: "ملغى" };
  if (l.expiresAt && l.expiresAt < Date.now()) return { tone: "dead", en: "Expired", ar: "منتهي" };
  if (l.machineHash) return { tone: "live", en: "Active", ar: "مفعّل" };
  return { tone: "idle", en: "Not yet activated", ar: "لم يُفعّل بعد" };
}

const TONE: Record<Tone, { bg: string; fg: string }> = {
  live: { bg: "rgba(107,124,90,0.14)", fg: "#4B5A3C" },
  idle: { bg: "rgba(178,140,72,0.16)", fg: "#7A5B22" },
  dead: { bg: "rgba(178,116,87,0.14)", fg: "#7A4A32" },
};

const fmtDate = (t?: number | null, ar?: boolean) =>
  t ? new Date(t).toLocaleDateString(ar ? "ar-JO" : "en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

/* Clipboard, with a fallback. The PWA runs over HTTPS so navigator.clipboard
   is available, but it still rejects when the document isn't focused (which
   happens right after a native share sheet closes) — hence the textarea path,
   so "Copy" is never a button that silently does nothing. */
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

export default function LicensesPanel({ onCount }: { onCount?: (n: number) => void }) {
  const { lang, dir } = useT();
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const [rows, setRows] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [adding, setAdding] = useState(false);
  const [issued, setIssued] = useState<License | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await listLicenses();
      setRows(r);
      onCount?.(r.length);
      setErr("");
    } catch {
      setErr(t("Could not load licences.", "تعذّر تحميل التراخيص."));
    } finally {
      setLoading(false);
    }
    // `t` is a closure over lang and would re-create load on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, onCount]);

  useEffect(() => { load(); }, [load]);

  async function act(fn: () => Promise<void>) {
    try { await fn(); await load(); }
    catch { setErr(t("That didn't go through. Try again.", "لم تتم العملية. حاول مجددًا.")); }
  }

  async function onCopy(key: string) {
    const ok = await copy(key);
    setCopied(ok ? key : null);
    if (ok) setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
  }

  return (
    <div dir={dir}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.4rem" }}>
        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--ink-faint)", maxWidth: "58ch", lineHeight: 1.6 }}>
          {t(
            "Keys for the Evora Studio desktop app. Each key works on one computer — the first launch locks it to that machine. Staff still sign in with their own Evora account inside the app.",
            "مفاتيح تطبيق إيفورا ستوديو للكمبيوتر. كل مفتاح يعمل على جهاز واحد — أول تشغيل يربطه بذلك الجهاز. ويسجّل الموظف دخوله داخل التطبيق بحسابه في إيفورا كالمعتاد.",
          )}
        </p>
        <button onClick={() => setAdding(true)} style={primaryBtn}>+ {t("New licence", "ترخيص جديد")}</button>
      </div>

      {err && (
        <p role="alert" style={{ padding: "0.8rem 1.1rem", marginBottom: "1.2rem", borderRadius: 12, background: "rgba(178,116,87,0.12)", border: "1px solid rgba(178,116,87,0.35)", color: "#7A4A32", fontSize: "0.88rem" }}>{err}</p>
      )}

      {loading && <p style={{ color: "var(--ink-faint)", fontSize: "0.9rem" }}>{t("Loading…", "جارٍ التحميل…")}</p>}

      {!loading && rows.length === 0 && (
        <div style={{ ...card, padding: "2.4rem 1.6rem", textAlign: "center" }}>
          <p className="display" style={{ fontSize: "1.25rem", color: "var(--ink)", margin: "0 0 0.5rem" }}>{t("No licences yet", "لا توجد تراخيص بعد")}</p>
          <p style={{ fontSize: "0.88rem", color: "var(--ink-faint)", margin: 0 }}>
            {t("Create one for each computer that should run Evora Studio.", "أنشئ ترخيصًا لكل جهاز يُشغّل إيفورا ستوديو.")}
          </p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.1rem" }}>
        {rows.map((l) => {
          const st = stateOf(l);
          const tone = TONE[st.tone];
          return (
            <div key={l.key} style={{ ...card, padding: "1.15rem 1.25rem", display: "grid", gap: "0.9rem", alignContent: "start" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 className="display" style={{ fontSize: "1.08rem", color: "var(--ink)", margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{l.label}</h3>
                  {l.note && <p style={{ fontSize: "0.78rem", color: "var(--ink-faint)", margin: "0.15rem 0 0" }}>{l.note}</p>}
                </div>
                <span style={{ flexShrink: 0, padding: "0.25em 0.7em", borderRadius: 999, background: tone.bg, color: tone.fg, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                  {lang === "ar" ? st.ar : st.en}
                </span>
              </div>

              {/* the key itself — always visible, because the whole job of this
                  screen is handing a key to somebody */}
              <button
                onClick={() => onCopy(l.key)}
                title={t("Copy key", "نسخ المفتاح")}
                style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.6rem 0.75rem", borderRadius: 10, border: "1px dashed var(--line)", background: "#faf8f4", cursor: "pointer", textAlign: "start" }}
              >
                <code dir="ltr" style={{ flex: 1, minWidth: 0, fontFamily: "var(--f-mono, ui-monospace, monospace)", fontSize: "0.78rem", letterSpacing: "0.04em", color: "var(--ink)", overflowWrap: "anywhere" }}>{l.key}</code>
                <span style={{ flexShrink: 0, fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: copied === l.key ? "#4B5A3C" : "var(--ink-faint)" }}>
                  {copied === l.key ? t("Copied", "تم النسخ") : t("Copy", "نسخ")}
                </span>
              </button>

              <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.3rem 0.9rem", fontSize: "0.76rem" }}>
                <dt style={meta}>{t("Computer", "الجهاز")}</dt>
                <dd style={val}>{l.machineName || t("— not bound yet", "— غير مرتبط بعد")}</dd>
                <dt style={meta}>{t("Activated", "التفعيل")}</dt>
                <dd style={val}>{fmtDate(l.activatedAt, lang === "ar")}</dd>
                <dt style={meta}>{t("Last used", "آخر استخدام")}</dt>
                <dd style={val}>{fmtDate(l.lastSeenAt, lang === "ar")}</dd>
                {l.expiresAt ? (<><dt style={meta}>{t("Expires", "ينتهي")}</dt><dd style={val}>{fmtDate(l.expiresAt, lang === "ar")}</dd></>) : null}
              </dl>

              <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                {l.machineHash && (
                  <button onClick={() => act(() => unbindLicense(l.key))} style={miniBtn} title={t("Let this key be activated on a different computer", "اسمح بتفعيل المفتاح على جهاز آخر")}>
                    {t("Move to another PC", "نقل لجهاز آخر")}
                  </button>
                )}
                <button onClick={() => act(() => setLicenseRevoked(l.key, !l.revoked))} style={miniBtn}>
                  {l.revoked ? t("Restore", "إعادة التفعيل") : t("Revoke", "إلغاء")}
                </button>
                {confirmDel === l.key ? (
                  <>
                    <button onClick={() => { setConfirmDel(null); act(() => deleteLicense(l.key)); }} style={{ ...miniBtn, borderColor: "var(--clay)", color: "var(--clay-text)", fontWeight: 700 }}>
                      {t("Delete for good", "حذف نهائي")}
                    </button>
                    <button onClick={() => setConfirmDel(null)} style={miniBtn}>{t("Cancel", "إلغاء")}</button>
                  </>
                ) : (
                  <button onClick={() => setConfirmDel(l.key)} style={{ ...miniBtn, color: "var(--ink-faint)" }}>{t("Delete", "حذف")}</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {adding && (
        <NewLicense
          onClose={() => setAdding(false)}
          onDone={(l) => { setAdding(false); setIssued(l); load(); }}
        />
      )}
      {issued && <IssuedKey license={issued} onClose={() => setIssued(null)} />}
    </div>
  );
}

/* ---- create ------------------------------------------------------------- */

function NewLicense({ onClose, onDone }: { onClose: () => void; onDone: (l: License) => void }) {
  useDialogClose(onClose);
  const { lang, dir } = useT();
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [expiry, setExpiry] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      // A date input gives local midnight; push it to the END of that day so a
      // licence dated "31 Dec" still works all through the 31st.
      const exp = expiry ? new Date(`${expiry}T23:59:59`).getTime() : null;
      onDone(await createLicense(label.trim(), note.trim() || undefined, exp));
    } catch {
      setErr(t("Could not create the licence.", "تعذّر إنشاء الترخيص."));
    } finally { setBusy(false); }
  }

  return (
    <Sheet onClose={onClose} label={t("New licence", "ترخيص جديد")}>
      <form dir={dir} onSubmit={submit}>
        <h2 className="display" style={{ fontSize: "1.5rem", color: "var(--ink)", margin: "0 0 1.3rem" }}>{t("New licence", "ترخيص جديد")}</h2>

        <label style={lbl}>
          {t("Who is it for?", "لمن هذا الترخيص؟")}
          <input style={field} value={label} onChange={(e) => setLabel(e.target.value)} required autoFocus placeholder={t("Bakri — showroom PC", "بكري — جهاز المعرض")} />
        </label>
        <div style={{ height: "0.9rem" }} />
        <label style={lbl}>
          {t("Note (optional)", "ملاحظة (اختياري)")}
          <input style={field} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("Windows 11, second floor", "ويندوز ١١، الطابق الثاني")} />
        </label>
        <div style={{ height: "0.9rem" }} />
        <label style={lbl}>
          {t("Expires (optional)", "تاريخ الانتهاء (اختياري)")}
          <input style={field} type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        </label>
        <p style={{ fontSize: "0.76rem", color: "var(--ink-faint)", margin: "0.5rem 0 0", lineHeight: 1.5 }}>
          {t("Leave the date empty for a licence that never expires.", "اترك التاريخ فارغًا لترخيص لا ينتهي.")}
        </p>

        {err && <p role="alert" style={{ color: "var(--clay-text)", fontSize: "0.85rem", marginTop: "0.9rem" }}>{err}</p>}

        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1.5rem" }}>
          <button type="submit" disabled={busy} style={{ flex: 1, padding: "0.85rem", borderRadius: 10, border: "none", background: "var(--ink)", color: "#fff", fontWeight: 600, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
            {busy ? t("Creating…", "جارٍ الإنشاء…") : t("Create key", "إنشاء المفتاح")}
          </button>
          <button type="button" onClick={onClose} style={{ padding: "0.85rem 1.4rem", borderRadius: 10, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", cursor: "pointer" }}>
            {t("Cancel", "إلغاء")}
          </button>
        </div>
      </form>
    </Sheet>
  );
}

/* ---- the freshly-minted key -------------------------------------------- */

function IssuedKey({ license, onClose }: { license: License; onClose: () => void }) {
  useDialogClose(onClose);
  const { lang, dir } = useT();
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <Sheet onClose={onClose} label={t("Licence created", "تم إنشاء الترخيص")}>
      <div dir={dir} style={{ textAlign: "center" }}>
        <h2 className="display" style={{ fontSize: "1.5rem", color: "var(--ink)", margin: "0 0 0.4rem" }}>{t("Licence created", "تم إنشاء الترخيص")}</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-faint)", margin: "0 0 1.4rem" }}>{license.label}</p>

        <code dir="ltr" style={{ display: "block", padding: "1.1rem 0.9rem", borderRadius: 14, background: "var(--ink)", color: "#F5EFE3", fontFamily: "var(--f-mono, ui-monospace, monospace)", fontSize: "clamp(0.85rem, 4.2vw, 1.1rem)", letterSpacing: "0.08em", overflowWrap: "anywhere" }}>
          {license.key}
        </code>

        <p style={{ fontSize: "0.8rem", color: "var(--ink-faint)", margin: "1rem 0 0", lineHeight: 1.6 }}>
          {t(
            "Send this to whoever installs Evora Studio. They paste it once, on the computer that will run the app.",
            "أرسل هذا لمن سيثبّت إيفورا ستوديو. يُلصق مرة واحدة، على الجهاز الذي سيشغّل التطبيق.",
          )}
        </p>

        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1.5rem" }}>
          <button
            onClick={async () => { const ok = await copy(license.key); setCopied(ok); if (ok) setTimeout(() => setCopied(false), 2000); }}
            style={{ flex: 1, padding: "0.85rem", borderRadius: 10, border: "none", background: "var(--ink)", color: "#fff", fontWeight: 600, cursor: "pointer" }}
          >
            {copied ? t("Copied", "تم النسخ") : t("Copy key", "نسخ المفتاح")}
          </button>
          {canShare && (
            <button
              onClick={() => navigator.share({ title: "Evora Studio", text: `${license.label}\n${license.key}` }).catch(() => {})}
              style={{ padding: "0.85rem 1.4rem", borderRadius: 10, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", cursor: "pointer" }}
            >
              {t("Share", "مشاركة")}
            </button>
          )}
        </div>
        <button onClick={onClose} style={{ marginTop: "0.8rem", width: "100%", padding: "0.7rem", borderRadius: 10, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", cursor: "pointer" }}>
          {t("Done", "تم")}
        </button>
      </div>
    </Sheet>
  );
}

/* A dialog that is a centred card on a desktop and a bottom sheet on a phone —
   the PWA is the primary surface here, and a centred modal fights the on-screen
   keyboard when a text field is focused. */
function Sheet({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(22,21,15,0.5)", backdropFilter: "blur(6px)", display: "grid", placeItems: "end center", padding: 0 }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(440px, 100%)",
          maxHeight: "92dvh",
          overflowY: "auto",
          background: "var(--paper)",
          borderRadius: "18px 18px 0 0",
          padding: "1.8rem 1.5rem calc(1.8rem + env(safe-area-inset-bottom))",
          boxShadow: "0 40px 120px rgba(0,0,0,0.3)",
          marginBottom: 0,
        }}
        className="ev-sheet"
      >
        {children}
        <style>{`
          @media (min-width: 640px) {
            .ev-sheet { border-radius: 18px !important; margin-bottom: max(4vh, 1rem); }
          }
        `}</style>
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid var(--line)", borderRadius: 16 };
const primaryBtn: React.CSSProperties = { padding: "0.6rem 1.2rem", borderRadius: 999, border: "none", background: "var(--clay)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" };
const miniBtn: React.CSSProperties = { padding: "0.4rem 0.9rem", borderRadius: 999, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontSize: "0.76rem", cursor: "pointer" };
const meta: React.CSSProperties = { color: "var(--ink-faint)", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.64rem", paddingTop: "0.1rem" };
const val: React.CSSProperties = { color: "var(--ink)", margin: 0, overflow: "hidden", textOverflow: "ellipsis" };
const lbl: React.CSSProperties = { display: "block", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" };
const field: React.CSSProperties = { width: "100%", padding: "0.7rem 0.85rem", marginTop: "0.35rem", border: "1px solid var(--line)", borderRadius: 10, fontSize: "0.92rem", color: "var(--ink)", background: "#fff" };
