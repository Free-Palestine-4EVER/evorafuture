"use client";

// Shows 2D plans the admin sent to Puffer (design requests) and imports the
// chosen plan straight into the editor. Lives in the Puffer toolbar.

import { useCallback, useEffect, useState } from "react";
import { useStudio } from "@/lib/puffer/store";

type Lead = { id: string; name: string; phone: string; planUrl?: string; sentToPuffer?: boolean; message?: string };

function portalBase() {
  return typeof window === "undefined" ? "" : window.location.origin;
}
function imgDims(url: string): Promise<{ w: number; h: number }> {
  return new Promise((res) => {
    const im = new Image(); im.crossOrigin = "anonymous";
    im.onload = () => res({ w: im.naturalWidth || 1000, h: im.naturalHeight || 1000 });
    im.onerror = () => res({ w: 1000, h: 1000 });
    im.src = url;
  });
}

export default function PufferImport() {
  const loadPlan = useStudio((s) => s.loadPlan);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Lead[]>([]);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const all: Lead[] = await fetch(`${portalBase()}/api/portal/leads`, { cache: "no-store" }).then((r) => r.json());
      setItems(all.filter((l) => l.sentToPuffer && l.planUrl && !l.planUrl.endsWith(".pdf")));
    } catch { setItems([]); }
  }, []);
  useEffect(() => { refresh(); const i = setInterval(refresh, 20000); return () => clearInterval(i); }, [refresh]);
  useEffect(() => { if (open) refresh(); }, [open, refresh]);

  async function importPlan(l: Lead) {
    if (!l.planUrl) return;
    setBusy(true);
    try {
      const { w, h } = await imgDims(l.planUrl);
      loadPlan(l.planUrl, w, h);
      // remove from the queue once imported
      await fetch(`${portalBase()}/api/portal/lead-to-puffer`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: l.id, on: false }) });
      setOpen(false); refresh();
    } finally { setBusy(false); }
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative rounded-md bg-neutral-800 px-2.5 py-1.5 text-sm font-medium text-neutral-100 hover:bg-neutral-700">
        📥 Requests
        {items.length > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">{items.length}</span>}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-neutral-800 bg-neutral-950 p-3 shadow-2xl">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-neutral-400">Client 2D plans to import</p>
          {items.length === 0 && <p className="text-xs text-neutral-500">No requests sent from the admin yet.</p>}
          <div className="max-h-80 space-y-2 overflow-auto">
            {items.map((l) => (
              <div key={l.id} className="flex items-center gap-2 rounded-md border border-neutral-800 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.planUrl} alt="" className="h-12 w-12 flex-shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-100">{l.name || "—"}</p>
                  <p className="text-[11px] text-neutral-500">{l.phone}</p>
                </div>
                <button disabled={busy} onClick={() => importPlan(l)} className="rounded bg-sky-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-sky-500 disabled:opacity-50">Import</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
