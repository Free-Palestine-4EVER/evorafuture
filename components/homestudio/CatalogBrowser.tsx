"use client";

import { useEffect, useMemo, useState } from "react";
import { CATALOG } from "@/lib/homestudio/catalog";
import { CATEGORY_ORDER } from "@/lib/homestudio/catalogData";
import { useStudio } from "@/lib/homestudio/store";
import { Product } from "@/lib/homestudio/types";

// A Planner5D-style visual furniture catalog: search + category tabs + a grid of
// thumbnail cards. Click a card to drop that product into the selected slot at its
// true size. The maker's own photo→3D items ("Your library") live here too.
export default function CatalogBrowser({
  open, onClose, onPick, currentId, userProducts, onAddProduct,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (id: string | null) => void;
  currentId: string | null;
  userProducts: Product[];
  onAddProduct: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");
  const libraryOnly = useStudio((s) => s.libraryOnly);
  const setLibraryOnly = useStudio((s) => s.setLibraryOnly);

  // if "only my models" hides the category we're on, fall back to All
  useEffect(() => {
    if (libraryOnly && cat !== "All" && cat !== "Your library") setCat("All");
  }, [libraryOnly, cat]);

  // tabs: All · (Your library) · each catalog category (hidden when library-only)
  const tabs = useMemo(() => {
    const t = ["All"];
    if (userProducts.length) t.push("Your library");
    return libraryOnly ? t : [...t, ...CATEGORY_ORDER];
  }, [userProducts.length, libraryOnly]);

  const items = useMemo(() => {
    const lib: Product[] = userProducts.map((p) => ({ ...p, category: "Your library" }));
    const all = libraryOnly ? lib : [...lib, ...CATALOG];
    const q = query.trim().toLowerCase();
    return all.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, cat, userProducts, libraryOnly]);

  if (!open) return null;

  function pick(id: string | null) {
    onPick(id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="flex h-[82vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header: title + search + close */}
        <div className="flex items-center gap-3 border-b border-line p-3">
          <h2 className="font-display text-lg text-ink">Furniture catalog</h2>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search furniture…"
            className="flex-1 rounded-md border border-line bg-raised px-3 py-1.5 text-sm text-ink outline-none placeholder:text-faint focus:border-clay"
          />
          <label className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-line bg-raised px-2.5 py-1.5 text-xs font-medium text-ink" title="Hide the built-in placeholder furniture — show only your own models">
            <input type="checkbox" checked={libraryOnly} onChange={(e) => setLibraryOnly(e.target.checked)} className="h-3.5 w-3.5 accent-clay" />
            Only mine
          </label>
          <button onClick={onAddProduct} className="whitespace-nowrap rounded-md bg-clay px-3 py-1.5 text-sm font-medium text-clay-ink hover:opacity-90">
            📦 Add models
          </button>
          <button onClick={onClose} className="rounded-md px-2 py-1.5 text-muted hover:text-ink" aria-label="Close">✕</button>
        </div>

        {/* category tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-line p-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setCat(t)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                cat === t ? "bg-clay text-clay-ink" : "bg-raised border border-line text-ink hover:bg-clay-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* grid */}
        <div className="min-h-0 flex-1 overflow-auto p-3">
          {items.length === 0 ? (
            libraryOnly && userProducts.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">
                <p className="font-medium text-ink">“Only mine” is on, but your library is empty.</p>
                <p className="mt-1 text-xs">Add your own models with <span className="font-medium">📦 Add models</span>, or turn off “Only mine” to use the built-in furniture.</p>
              </div>
            ) : (
              <p className="p-8 text-center text-sm text-muted">No furniture matches “{query}”.</p>
            )
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5">
              {items.map((p) => (
                <Card key={p.id} product={p} active={p.id === currentId} onPick={() => pick(p.id)} />
              ))}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-line px-3 py-2 text-xs text-muted">
          <span>{items.length} item{items.length === 1 ? "" : "s"} · sizes are real (mm)</span>
          {currentId && (
            <button onClick={() => pick(null)} className="rounded px-2 py-1 font-medium text-red-300 hover:bg-red-950/40">
              Clear slot
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ product, active, onPick }: { product: Product; active: boolean; onPick: () => void }) {
  const { w, d, h } = product.dimensions_mm;
  return (
    <button
      onClick={onPick}
      title={product.name}
      className={`group flex flex-col overflow-hidden rounded-lg border bg-raised text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
        active ? "border-clay ring-2 ring-clay/40" : "border-line hover:border-clay/50"
      }`}
    >
      <div className="flex aspect-square items-center justify-center bg-paper p-2">
        {product.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.thumbnailUrl} alt={product.name} className="h-full w-full object-contain" loading="lazy" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center rounded text-2xl font-display text-white/80"
            style={{ background: product.color }}
          >
            {product.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="border-t border-line px-2 py-1.5">
        <div className="truncate text-xs font-medium text-ink">{product.name}</div>
        <div className="mt-0.5 font-mono text-[10px] text-faint">{w}×{d}×{h}</div>
      </div>
    </button>
  );
}
