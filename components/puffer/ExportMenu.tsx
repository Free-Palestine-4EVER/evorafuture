"use client";

import { useState } from "react";
import { useStudio } from "@/lib/puffer/store";
import { exportPlan, ExportFormat } from "@/lib/puffer/exporters";

const FORMATS: { f: ExportFormat; label: string; sub: string }[] = [
  { f: "glb", label: "GLB", sub: "Blender, web, AR — best quality" },
  { f: "obj", label: "OBJ", sub: "SketchUp, Blender" },
  { f: "stl", label: "STL", sub: "3D printing (no colour)" },
  { f: "dxf", label: "DXF", sub: "CAD — SketchUp, AutoCAD" },
];

export default function ExportMenu() {
  const { walls, rects, imgW, imgH, mmPerPx, userProducts } = useStudio();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ExportFormat | null>(null);

  const hasContent = !!mmPerPx && (walls.length > 0 || rects.some((r) => r.productId));

  async function run(f: ExportFormat) {
    if (!mmPerPx) return;
    setBusy(f);
    try {
      await exportPlan(f, walls, rects, imgW, imgH, mmPerPx, userProducts);
    } catch (err) {
      console.error("export failed", err);
    } finally {
      setBusy(null);
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={!hasContent}
        title={hasContent ? "Export the 3D plan as an editable file" : "Add walls or furniture first"}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
          hasContent ? "bg-[var(--ever-2)] text-[var(--paper)] hover:bg-[var(--ever-2-hi)]" : "cursor-not-allowed bg-neutral-800 text-neutral-500"
        }`}
      >
        <span>⤓</span> Export
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-30 mt-1.5 w-64 rounded-lg border border-neutral-700 bg-neutral-900 p-1.5 shadow-2xl">
            <div className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Editable file
            </div>
            {FORMATS.map(({ f, label, sub }) => (
              <button
                key={f}
                onClick={() => run(f)}
                disabled={!!busy}
                className="flex w-full items-center justify-between gap-3 rounded px-2.5 py-2 text-left hover:bg-neutral-800 disabled:opacity-50"
              >
                <span className="font-medium text-neutral-100">
                  {label}
                  {busy === f && <span className="text-neutral-400"> …</span>}
                </span>
                <span className="text-xs text-neutral-500">{sub}</span>
              </button>
            ))}
            <div className="my-1 border-t border-neutral-800" />
            {["SKP", "DWG"].map((x) => (
              <div
                key={x}
                className="flex w-full items-center justify-between rounded px-2.5 py-2 text-left opacity-40"
                title="Proprietary format — needs a server step (planned)"
              >
                <span className="font-medium text-neutral-300">{x}</span>
                <span className="text-xs text-neutral-500">needs server — soon</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
