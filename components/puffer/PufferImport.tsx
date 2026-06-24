"use client";

// Shows 2D plans the admin sent to Puffer (design requests) and imports the
// chosen plan straight into the editor. Lives in the Puffer toolbar.

import { useCallback, useEffect, useState } from "react";
import { useStudio } from "@/lib/puffer/store";
import { setImportLead } from "@/lib/puffer/importBridge";
import { scanToProject, type ScanFile } from "@/lib/puffer/importScan";

type Lead = { id: string; name: string; phone: string; planUrl?: string; sentToPuffer?: boolean; message?: string };
type ScanProject = { id: string; title: string; ownerName?: string; ownerPhone: string; thumbnailUrl?: string; scanData?: string; sentToPuffer?: boolean };

function portalBase() {
  return typeof window === "undefined" ? "" : window.location.origin;
}

// A built-in sample LiDAR scan (a 4×3 m room with a few pieces) so Puffer import
// can be demoed without running the iOS app. Same shape the app produces.
const DEMO_SCAN: ScanFile = {
  version: 1, units: "m",
  walls: [
    { x1: 0, z1: 0, x2: 4, z2: 0, height: 2.7 },
    { x1: 4, z1: 0, x2: 4, z2: 3, height: 2.7 },
    { x1: 4, z1: 3, x2: 0, z2: 3, height: 2.7 },
    { x1: 0, z1: 3, x2: 0, z2: 0, height: 2.7 },
  ],
  objects: [
    { type: "sofa", cx: 2, cz: 2.55, w: 2.0, d: 0.9, h: 0.85, angle: 0 },
    { type: "table", cx: 2, cz: 1.4, w: 1.2, d: 0.7, h: 0.45, angle: 0 },
    { type: "chair", cx: 3.3, cz: 1.4, w: 0.6, d: 0.6, h: 0.9, angle: 0 },
    { type: "tv", cx: 2, cz: 0.12, w: 1.2, d: 0.1, h: 0.7, angle: 0 },
  ],
};
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
  const loadProject = useStudio((s) => s.loadProject);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Lead[]>([]);
  const [scans, setScans] = useState<ScanProject[]>([]);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const all: Lead[] = await fetch(`${portalBase()}/api/portal/leads`, { cache: "no-store" }).then((r) => r.json());
      setItems(all.filter((l) => l.sentToPuffer && l.planUrl && !l.planUrl.endsWith(".pdf")));
    } catch { setItems([]); }
    try {
      const projs: ScanProject[] = await fetch(`${portalBase()}/api/portal/projects`, { cache: "no-store" }).then((r) => r.json());
      // LiDAR scans = projects carrying scanData; ones flagged "sent to Puffer" come first.
      const withScan = projs.filter((p) => !!p.scanData);
      withScan.sort((a, b) => Number(b.sentToPuffer || 0) - Number(a.sentToPuffer || 0));
      setScans(withScan);
    } catch { setScans([]); }
  }, []);
  useEffect(() => { refresh(); const i = setInterval(refresh, 20000); return () => clearInterval(i); }, [refresh]);
  useEffect(() => { if (open) refresh(); }, [open, refresh]);

  async function importScanProject(p: ScanProject) {
    if (!p.scanData) return;
    setBusy(true);
    try {
      const scan = JSON.parse(p.scanData) as ScanFile;
      const pf = scanToProject(scan);   // ScanFile → walls + furniture slots + plan backdrop
      loadProject(pf);
      setImportLead({ name: p.ownerName || "", phone: p.ownerPhone });
      // clear the Puffer flag once imported
      if (p.sentToPuffer) {
        await fetch(`${portalBase()}/api/portal/projects`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: p.id, sentToPuffer: false }),
        }).catch(() => {});
      }
      setOpen(false); refresh();
    } catch (e) { console.error("scan import failed", e); }
    finally { setBusy(false); }
  }

  async function importPlan(l: Lead) {
    if (!l.planUrl) return;
    setBusy(true);
    try {
      const { w, h } = await imgDims(l.planUrl);
      loadPlan(l.planUrl, w, h);
      // carry the customer into the Save-to-Evora panel
      setImportLead({ name: l.name, phone: l.phone });
      // remove from the queue once imported
      await fetch(`${portalBase()}/api/portal/lead-to-puffer`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: l.id, on: false }) });
      setOpen(false); refresh();
    } finally { setBusy(false); }
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative rounded-md bg-neutral-800 px-2.5 py-1.5 text-sm font-medium text-neutral-100 hover:bg-neutral-700">
        📥 Import
        {(items.length + scans.length) > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">{items.length + scans.length}</span>}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-neutral-800 bg-neutral-950 p-3 shadow-2xl">
          {/* LiDAR scans → import as walls + furniture */}
          <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-neutral-400">
            <span className="text-sky-400">◳</span> LiDAR room scans
          </p>
          <button
            data-testid="demo-scan"
            disabled={busy}
            onClick={() => { loadProject(scanToProject(DEMO_SCAN)); setOpen(false); }}
            className="mb-2 w-full rounded-md border border-dashed border-sky-700 bg-sky-950/40 px-2 py-1.5 text-[11px] font-medium text-sky-300 hover:bg-sky-900/40 disabled:opacity-50">
            ▶ Load demo scan (no app needed)
          </button>
          {scans.length === 0 && <p className="mb-3 text-xs text-neutral-500">No room scans yet. Scan a room in the Evora app.</p>}
          <div className="mb-3 max-h-56 space-y-2 overflow-auto">
            {scans.map((p) => (
              <div key={p.id} className="flex items-center gap-2 rounded-md border border-neutral-800 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.thumbnailUrl
                  ? <img src={p.thumbnailUrl} alt="" className="h-12 w-12 flex-shrink-0 rounded object-cover" />
                  : <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded bg-neutral-800 text-base">◳</div>}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-100">{p.title || "Scanned room"}</p>
                  <p className="truncate text-[11px] text-neutral-500">{p.ownerName || p.ownerPhone}{p.sentToPuffer ? " · sent to Puffer" : ""}</p>
                </div>
                <button disabled={busy} onClick={() => importScanProject(p)} className="rounded bg-sky-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-sky-500 disabled:opacity-50">Import</button>
              </div>
            ))}
          </div>

          <p className="mb-2 border-t border-neutral-800 pt-3 text-[11px] uppercase tracking-wide text-neutral-400">Client 2D plans to import</p>
          {items.length === 0 && <p className="text-xs text-neutral-500">No requests sent from the admin yet.</p>}
          <div className="max-h-56 space-y-2 overflow-auto">
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
