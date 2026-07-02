"use client";

import { useEffect, useRef, useState } from "react";
import { useStudio } from "@/lib/homestudio/store";
import { SAMPLES } from "@/lib/homestudio/samples";
import { loadPlanFile } from "@/lib/homestudio/loadPlanFile";
import { scanToProject } from "@/lib/homestudio/importScan";
import { toast } from "@/lib/homestudio/toast";
import LibraryManager from "./LibraryManager";

/**
 * Full-screen first-run welcome — shown until a plan or room scan is loaded.
 * Calls the same store actions the editor toolbar uses, so loading from here is
 * identical to loading from inside the editor (zero new data paths).
 */
export default function Welcome() {
  const { loadPlan, loadSample, loadProject, setRoomScan, hydrateLibrary, userProducts } = useStudio();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [libOpen, setLibOpen] = useState(false);

  // load the saved library so the count shows here, before any plan is opened
  useEffect(() => { hydrateLibrary(); }, [hydrateLibrary]);

  async function handlePlanFile(file: File) {
    if (!/\.(png|jpe?g|webp|gif|bmp|svg|pdf|dxf|dwg)$/i.test(file.name)) {
      toast.error("That doesn't look like a floor plan. Use a PNG, JPG, PDF, DXF, or DWG.");
      return;
    }
    setLoading(true);
    try {
      const { dataUrl, width, height, mmPerPx: scale } = await loadPlanFile(file);
      if (scale) loadSample(dataUrl, width, height, scale);
      else loadPlan(dataUrl, width, height);
    } catch (err) {
      console.error("could not load plan file", err);
      toast.error(err instanceof Error ? err.message : "Couldn't read that file. Try a PNG, JPG, PDF, DXF, or DWG floor plan.");
    } finally {
      setLoading(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handlePlanFile(f);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handlePlanFile(f);
  }

  function onRoomScanMesh(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) { return; }
    const ext = f.name.toLowerCase().split(".").pop();
    const format = ext === "obj" ? "obj" : "glb";
    const url = URL.createObjectURL(f);
    setRoomScan({ url, format, rotYdeg: 0, opacity: 1, scale: 1, yOffset: 0 });
    e.target.value = "";
  }

  async function onScanJson(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const scan = JSON.parse(await f.text());
      loadProject(scanToProject(scan));
    } catch (err) {
      console.error("scan import failed", err);
      toast.error("Couldn't read that scan. It should be a Puffer Scan .json from the LiDAR app.");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <main className="relative flex h-screen flex-col items-center justify-center bg-paper paper-grain px-6 text-ink">
      <LibraryManager open={libOpen} onClose={() => setLibOpen(false)} />

      <div className="flex w-full max-w-xl flex-col items-center text-center">
        {/* wordmark + tagline */}
        <div className="mb-2 flex items-baseline gap-3">
          <span className="wordmark-gold font-display text-[42px] font-semibold leading-none tracking-[0.16em]">ƎVORΛ</span>
          <span className="font-display text-[17px] font-medium uppercase tracking-[0.34em] text-muted">Home Studio</span>
        </div>
        <h1 className="font-display text-[24px] font-light leading-tight text-muted">
          Turn a floor plan into a furnished 3D room.
        </h1>

        {/* drop zone */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`group mt-9 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-12 transition ${
            dragging
              ? "border-clay bg-clay-50"
              : "border-line bg-panel hover:border-clay/60 hover:bg-raised"
          }`}
        >
          <span className={`text-3xl transition ${dragging ? "text-clay" : "text-faint group-hover:text-clay"}`}>⬆</span>
          <span className="mt-3 text-lg font-medium text-ink">
            {loading ? "Loading…" : "Drag a floor plan here"}
          </span>
          <span className="mt-1 text-sm text-muted">or click to browse</span>
          <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
            PNG · JPG · PDF · DXF · DWG
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf,.pdf,.dxf,.dwg,.png,.jpg,.jpeg,.webp,.svg,.gif,.bmp"
          className="hidden"
          onChange={onPick}
        />

        {/* secondary starts */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setLibOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-clay/50 bg-clay-50 px-4 py-2 text-sm font-medium text-ink transition hover:bg-clay-50/70"
            title="Add & manage your own 3D furniture models — used instead of the placeholders"
          >
            📚 My 3D library
            {userProducts.length > 0 && (
              <span className="rounded-full bg-clay px-1.5 py-0.5 font-mono text-[10px] text-clay-ink">{userProducts.length}</span>
            )}
          </button>

          <div className="relative">
            <select
              value=""
              onChange={(e) => {
                const sm = SAMPLES.find((x) => x.id === e.target.value);
                if (sm) loadSample(sm.src, sm.imgW, sm.imgH, sm.mmPerPx);
              }}
              className="cursor-pointer appearance-none rounded-full border border-line bg-panel px-4 py-2 pr-8 text-sm font-medium text-ink transition hover:bg-raised"
              title="Load a ready-made sample plan (auto-calibrated)"
            >
              <option value="">Load a sample…</option>
              {SAMPLES.map((sm) => (
                <option key={sm.id} value={sm.id}>{sm.name}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">▾</span>
          </div>

          <label className="cursor-pointer rounded-full border border-line bg-panel px-4 py-2 text-sm font-medium text-ink transition hover:bg-raised" title="Import a 3D room scan mesh (.obj / .glb) from a free LiDAR scanner app">
            🧊 3D scan
            <input type="file" accept=".obj,.glb,.gltf,model/gltf-binary" className="hidden" onChange={onRoomScanMesh} />
          </label>
        </div>

        {/* niche: structured Puffer Scan .json */}
        <label className="mt-3 cursor-pointer font-mono text-[11px] text-faint underline-offset-4 transition hover:text-muted hover:underline" title="Import a Puffer Scan .json from the LiDAR iOS app">
          have a Puffer Scan file? import .json
          <input type="file" accept="application/json,.json" className="hidden" onChange={onScanJson} />
        </label>

        {/* steps */}
        <div className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          <Step n="1">Calibrate</Step>
          <Arrow />
          <Step n="2">Place furniture</Step>
          <Arrow />
          <Step n="3">Export to SketchUp</Step>
        </div>
      </div>
    </main>
  );
}

function Step({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-raised text-[9px] text-clay">{n}</span>
      {children}
    </span>
  );
}

function Arrow() {
  return <span className="text-line">→</span>;
}
