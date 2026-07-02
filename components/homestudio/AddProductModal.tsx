"use client";

import { toast } from "@/lib/homestudio/toast";

import { useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Box3, Vector3 } from "three";
import { useStudio } from "@/lib/homestudio/store";
import { putModel, getModelURL } from "@/lib/homestudio/modelStore";

const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2));

type ImportUnits = "auto" | "m" | "cm" | "mm";
// read a GLB's TRUE real-world size (mm) from its bounding box. "auto" guesses
// metres-vs-mm; choose m/cm/mm explicitly when the model's authoring units are known
// (CAD/SketchUp exports are often cm and would otherwise mis-scale).
function glbDims(url: string, units: ImportUnits = "auto"): Promise<{ w: number; d: number; h: number }> {
  return new Promise((resolve, reject) => {
    new GLTFLoader().load(url, (g) => {
      const s = new Vector3(); new Box3().setFromObject(g.scene).getSize(s);
      const maxM = Math.max(s.x, s.y, s.z);
      const k = units === "m" ? 1000 : units === "cm" ? 10 : units === "mm" ? 1 : (maxM > 20 ? 1 : 1000);
      resolve({ w: Math.max(1, Math.round(s.x * k)), d: Math.max(1, Math.round(s.z * k)), h: Math.max(1, Math.round(s.y * k)) });
    }, undefined, (err) => reject(err instanceof Error ? err : new Error("could not read model")));
  });
}

export default function AddProductModal({ open, onClose, onCreated }: {
  open: boolean;
  onClose: () => void;
  onCreated?: (productId: string) => void;
}) {
  const addUserProduct = useStudio((s) => s.addUserProduct);
  const [importUnits, setImportUnits] = useState<ImportUnits>("auto");
  const [phase, setPhase] = useState<"form" | "working" | "error">("form");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  function reset() { setImportUnits("auto"); setPhase("form"); setProgress(0); setStatus(""); setErrorMsg(""); }
  function close() { reset(); onClose(); }

  // local bulk import of the maker's own GLB/glTF furniture → "Your library".
  // Fully offline: model bytes go into IndexedDB (lib/modelStore), no server.
  async function importGlbs(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter((f) => /\.(glb|gltf)$/i.test(f.name));
    e.target.value = "";
    if (!files.length) { toast.error("Pick one or more .glb / .gltf files."); return; }
    setPhase("working"); setProgress(0); setStatus(`reading ${files.length} model${files.length > 1 ? "s" : ""}…`);
    const failed: string[] = [];
    let lastId = "";
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        setStatus(`reading true size… ${i + 1}/${files.length}`); setProgress(Math.round((i / files.length) * 100));
        try {
          if (f.size > 80 * 1024 * 1024) throw new Error("over 80 MB");
          const buf = await f.arrayBuffer();
          const id = "user-" + uid();
          await putModel(id, buf);
          const url = await getModelURL(id);
          if (!url) throw new Error("could not store model");
          const dims = await glbDims(url, importUnits);
          const name = f.name.replace(/\.(glb|gltf)$/i, "").replace(/[_-]+/g, " ").trim() || `Model ${i + 1}`;
          addUserProduct({ id, name, category: "Your library", dimensions_mm: dims, color: "#9aa0aa", glbUrl: url, idbKey: id });
          lastId = id;
        } catch { failed.push(f.name); }
      }
      setProgress(100);
      const okCount = files.length - failed.length;
      if (okCount > 0) toast.success(`Imported ${okCount} model${okCount > 1 ? "s" : ""} into "Your library" at true size.`);
      if (failed.length) toast.error(`Couldn't read ${failed.length} file${failed.length > 1 ? "s" : ""}: ${failed.slice(0, 4).join(", ")}${failed.length > 4 ? "…" : ""}`);
      if (okCount === 1 && lastId) onCreated?.(lastId); // single import into a selected slot → assign it
      close();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "import failed");
      setPhase("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" onClick={close}>
      <div className="w-full max-w-md rounded-xl border border-neutral-700 bg-neutral-900 p-4 text-sm text-neutral-200" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-1 font-semibold text-white">Add furniture to your library</h3>
        <p className="mb-3 text-xs text-neutral-400">Import the client&apos;s own 3D models. Everything lands in &quot;Your library&quot; at true size, ready to place &amp; swap.</p>

        {phase !== "working" ? (
          <>
            <label className="mb-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-600/60 bg-emerald-950/20 px-3 py-4 text-sm font-medium text-emerald-300 hover:bg-emerald-950/40">
              📦 Import 3D models (.glb / .gltf)
              <input type="file" accept=".glb,.gltf" multiple className="hidden" onChange={importGlbs} />
            </label>
            <p className="mb-3 text-center text-[11px] text-neutral-500">Pick one or many files — true real-world size is read from each model.</p>
            <div className="mb-3 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
              <span>model units:</span>
              <select
                value={importUnits}
                onChange={(e) => setImportUnits(e.target.value as ImportUnits)}
                className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-200"
              >
                <option value="auto">auto-detect</option>
                <option value="m">metres</option>
                <option value="cm">centimetres</option>
                <option value="mm">millimetres</option>
              </select>
            </div>

            {phase === "error" && <p className="mb-2 rounded bg-red-950/50 px-2 py-1.5 text-xs text-red-300">⚠ {errorMsg}</p>}

            <div className="flex justify-end">
              <button onClick={close} className="rounded bg-neutral-700 px-3 py-1.5 font-medium text-white hover:bg-neutral-600">Close</button>
            </div>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mb-3 text-neutral-300">{status} {progress ? `${progress}%` : ""}</div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.max(5, progress)}%` }} />
            </div>
            <p className="mt-3 text-xs text-neutral-500">Reading your models — they&apos;ll appear in your library at true size.</p>
          </div>
        )}
      </div>
    </div>
  );
}
