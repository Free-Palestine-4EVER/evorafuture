"use client";

import { useEffect, useState } from "react";
import { useStudio } from "@/lib/homestudio/store";
import AddProductModal from "./AddProductModal";

/**
 * "My 3D Library" — manage the client's own 3D models before (or during) a build:
 * import .glb/.gltf furniture, build one from a photo, delete items, and choose
 * whether the catalog shows ONLY these models instead of the built-in placeholders.
 * Reuses the existing import flow (AddProductModal) + persistent store library.
 */
export default function LibraryManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { userProducts, removeUserProduct, hydrateLibrary, libraryOnly, setLibraryOnly } = useStudio();
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { if (open) hydrateLibrary(); }, [open, hydrateLibrary]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="flex h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center gap-3 border-b border-line p-3">
          <div className="min-w-0">
            <h2 className="font-display text-lg text-ink">Your 3D Library</h2>
            <p className="text-xs text-muted">{userProducts.length} model{userProducts.length === 1 ? "" : "s"} · used at true real-world size</p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="ml-auto whitespace-nowrap rounded-md bg-clay px-3 py-1.5 text-sm font-semibold text-clay-ink hover:opacity-90"
          >
            📦 Add / import models
          </button>
          <button onClick={onClose} className="rounded-md px-2 py-1.5 text-muted hover:text-ink" aria-label="Close">✕</button>
        </div>

        {/* "only my models" switch */}
        <label className="flex cursor-pointer items-center gap-3 border-b border-line bg-raised px-3 py-2.5">
          <input
            type="checkbox"
            checked={libraryOnly}
            onChange={(e) => setLibraryOnly(e.target.checked)}
            className="h-4 w-4 accent-clay"
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-ink">Use only my models</span>
            <span className="block text-[11px] text-muted">Hide the built-in placeholder furniture — the catalog shows only your library.</span>
          </span>
        </label>

        {/* grid of the user's models */}
        <div className="min-h-0 flex-1 overflow-auto p-3">
          {userProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted">
              <div className="mb-2 text-4xl">📦</div>
              <p className="font-medium text-ink">Your library is empty.</p>
              <p className="mt-1 max-w-sm text-xs">
                Import your own <span className="font-medium">.glb / .gltf</span> furniture (or build one from a photo). Each model
                keeps its true real-world size and is ready to place on any plan.
              </p>
              <button
                onClick={() => setAddOpen(true)}
                className="mt-4 rounded-md bg-clay px-4 py-2 text-sm font-semibold text-clay-ink hover:opacity-90"
              >
                📦 Import your first models
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
              {userProducts.map((p) => {
                const { w, d, h } = p.dimensions_mm;
                return (
                  <div key={p.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-raised">
                    <button
                      onClick={() => removeUserProduct(p.id)}
                      title="Remove from library"
                      aria-label={`Remove ${p.name}`}
                      className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-xs text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                    <div className="flex aspect-square items-center justify-center bg-paper p-2">
                      {p.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumbnailUrl} alt={p.name} className="h-full w-full object-contain" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded text-2xl font-display text-white/80" style={{ background: p.color }}>
                          {p.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="border-t border-line px-2 py-1.5">
                      <div className="truncate text-xs font-medium text-ink" title={p.name}>{p.name}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-faint">{w}×{d}×{h} mm</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-line px-3 py-2 text-[11px] text-muted">
          Your library is saved in this browser. Imported models live under <span className="font-mono">/public/models/userlib</span>.
        </div>
      </div>

      <AddProductModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
