"use client";

import { useState } from "react";
import { useStudio } from "@/lib/homestudio/store";
import { exportPlan, ExportFormat } from "@/lib/homestudio/exporters";
import { toast } from "@/lib/homestudio/toast";

const FORMATS: { f: ExportFormat; label: string; sub: string }[] = [
  { f: "dae", label: "DAE (Collada)", sub: "★ SketchUp — import directly, real furniture" },
  { f: "skp", label: "SKP (SketchUp script)", sub: "Ruby → native .skp, real furniture" },
  { f: "obj", label: "OBJ", sub: "SketchUp Pro, Blender" },
  { f: "dxf", label: "DXF", sub: "CAD — SketchUp Pro, AutoCAD" },
  { f: "stl", label: "STL", sub: "3D printing (one mesh)" },
  { f: "glb", label: "GLB", sub: "Web / AR — not SketchUp" },
];

export default function ExportMenu() {
  const { walls, rects, imgW, imgH, mmPerPx, userProducts, floorZones } = useStudio();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ExportFormat | null>(null);

  const hasContent = !!mmPerPx && (walls.length > 0 || rects.some((r) => r.productId));

  async function run(f: ExportFormat) {
    if (!mmPerPx) return;
    setBusy(f);
    try {
      await exportPlan(f, walls, rects, imgW, imgH, mmPerPx, userProducts, floorZones);
      toast.success(
        f === "dae" ? "SketchUp file downloaded — puffer-plan.dae (File ▸ Import)"
          : f === "skp" ? "SketchUp script downloaded — in SketchUp: Extensions ▸ Build from Puffer export… (pick this file)"
            : `Exported ${f.toUpperCase()}`,
      );
    } catch (err) {
      console.error("export failed", err);
      toast.error("Export failed. Check the console.");
    } finally {
      setBusy(null);
      setOpen(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => run("dae")}
        disabled={!hasContent || !!busy}
        title={hasContent ? "One-click: build an editable SketchUp model (.dae) — true scale, named groups" : "Add walls or furniture first"}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
          hasContent ? "bg-clay text-clay-ink hover:opacity-90" : "cursor-not-allowed bg-raised border border-line text-faint"
        }`}
      >
        <span>🏠</span> {busy === "dae" ? "Exporting…" : "→ SketchUp"}
      </button>
      <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={!hasContent}
        title={hasContent ? "Other export formats" : "Add walls or furniture first"}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
          hasContent ? "bg-raised border border-line text-ink hover:bg-clay-50" : "cursor-not-allowed bg-raised border border-line text-faint"
        }`}
      >
        <span>⤓</span> Export ▾
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-30 mt-1.5 w-64 rounded-lg border border-line bg-panel p-1.5 shadow-2xl">
            <div className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-faint">
              Editable file
            </div>
            {FORMATS.map(({ f, label, sub }) => (
              <button
                key={f}
                onClick={() => run(f)}
                disabled={!!busy}
                className="flex w-full items-center justify-between gap-3 rounded px-2.5 py-2 text-left hover:bg-clay-50 disabled:opacity-50"
              >
                <span className="font-medium text-ink">
                  {label}
                  {busy === f && <span className="text-muted"> …</span>}
                </span>
                <span className="text-xs text-faint">{sub}</span>
              </button>
            ))}
            <div className="my-1 border-t border-line" />
            {["DWG"].map((x) => (
              <div
                key={x}
                className="flex w-full items-center justify-between rounded px-2.5 py-2 text-left opacity-40"
                title="Proprietary format — needs a server step (planned)"
              >
                <span className="font-medium text-muted">{x}</span>
                <span className="text-xs text-faint">needs server — soon</span>
              </div>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
}
