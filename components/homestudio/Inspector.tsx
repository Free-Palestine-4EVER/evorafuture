"use client";

import { toast } from "@/lib/homestudio/toast";

import { useEffect, useState } from "react";
import { useStudio } from "@/lib/homestudio/store";
import { resolveProduct } from "@/lib/homestudio/catalog";
import { FINISHES, Product, WallHeight, Wall, WallKind, OpeningKind, Opening, wallThicknessMm, wallHeightOf } from "@/lib/homestudio/types";
import { MATERIALS, MATERIAL_CATEGORIES } from "@/lib/homestudio/textures";
import { meshToPlan } from "@/lib/homestudio/roomScanPlan";
import AddProductModal from "./AddProductModal";
import CatalogBrowser from "./CatalogBrowser";
import LibraryManager from "./LibraryManager";

function DimInput({ label, value, onCommit }: {
  label: string; value: number | null; onCommit?: (v: number) => void;
}) {
  const [txt, setTxt] = useState(value != null ? String(value) : "");
  useEffect(() => { setTxt(value != null ? String(value) : ""); }, [value]);
  return (
    <label className="flex items-center gap-1 rounded bg-raised border border-line px-2 py-1.5">
      <span className="text-xs text-faint">{label}</span>
      <input
        type="number"
        value={txt}
        disabled={!onCommit}
        onChange={(e) => {
          setTxt(e.target.value);
          const v = parseFloat(e.target.value);
          if (onCommit && v > 0) onCommit(Math.round(v));
        }}
        className="w-16 bg-transparent text-right font-mono text-ink outline-none disabled:opacity-50"
      />
    </label>
  );
}

// Sticky header for any selected-item editor: icon + name on the left, a clear
// ✕ Done button on the right that closes back to the Home panel (deselect).
function PanelHeader({ icon, title, subtitle, onClose }: {
  icon: string; title: string; subtitle?: string; onClose: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-line bg-panel px-3 py-2.5">
      <span className="text-lg leading-none">{icon}</span>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-ink">{title}</div>
        {subtitle && <div className="truncate text-[11px] text-muted">{subtitle}</div>}
      </div>
      <button
        onClick={onClose}
        aria-label="Done — back to room"
        className="ml-auto flex shrink-0 items-center gap-1 rounded-md border border-line bg-raised px-2.5 py-1.5 text-xs font-medium text-ink transition hover:bg-clay-50"
      >
        <span className="text-sm leading-none">✕</span> Done
      </button>
    </div>
  );
}

export default function Inspector() {
  const {
    rects, selectedId, mmPerPx, updateRect, deleteRect, beginPlace, select,
    walls, selectedWallId, setWallHeight, deleteWall, updateWall, splitWall, selectWall, selectZone,
    addOpening, updateOpening, deleteOpening,
    floorZones, selectedZoneId, updateFloorZone, deleteFloorZone,
    roomScan, updateRoomScan, clearRoomScan, beginFurnishScan,
    userProducts, hydrateLibrary, duplicateSelection,
  } = useStudio();
  const [furnishing, setFurnishing] = useState(false);
  async function furnishScan() {
    if (!roomScan) return;
    setFurnishing(true);
    try {
      const plan = await meshToPlan(roomScan);
      beginFurnishScan(plan);
    } catch (err) {
      console.error("furnish-scan failed", err);
      toast.error("Couldn't build a plan from this scan. Try a cleaner .obj/.glb.");
    } finally {
      setFurnishing(false);
    }
  }
  const rect = rects.find((r) => r.id === selectedId) || null;
  const wall = walls.find((w) => w.id === selectedWallId) || null;
  const zone = floorZones.find((z) => z.id === selectedZoneId) || null;
  const [addOpen, setAddOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [libOpen, setLibOpen] = useState(false);
  useEffect(() => { hydrateLibrary(); }, [hydrateLibrary]);

  // catalog pick: if a slot is selected → assign to it; otherwise arm "place" mode
  // so the user clicks the plan to drop it exactly where they want (Planner5D-style).
  function handlePick(id: string | null) {
    if (rect) { updateRect(rect.id, { productId: id }); return; }
    if (id == null || !mmPerPx) return;
    beginPlace(id);
  }

  const wallLenM = wall && mmPerPx ? (Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) * mmPerPx / 1000).toFixed(2) : null;
  const zoneSize = zone && mmPerPx ? `${(zone.w * mmPerPx / 1000).toFixed(2)} × ${(zone.h * mmPerPx / 1000).toFixed(2)} m` : "";
  const rectName = rect ? (resolveProduct(rect.productId, userProducts)?.name ?? "Empty slot") : "";

  return (
    <div className="flex h-full flex-col bg-panel text-sm text-ink">
      {wall ? (
        <>
          <PanelHeader icon="🧱" title={wallLenM ? `Wall · ${wallLenM} m` : "Wall"} subtitle="Doors & windows · height · thickness" onClose={() => selectWall(null)} />
          <WallEditor
            key={wall.id}
            wall={wall}
            mmPerPx={mmPerPx}
            onHeight={setWallHeight}
            onPatch={(patch) => updateWall(wall.id, patch)}
            onSplit={() => splitWall(wall.id, { x: (wall.x1 + wall.x2) / 2, y: (wall.y1 + wall.y2) / 2 })}
            onDelete={() => deleteWall(wall.id)}
            onAddOpening={(kind) => addOpening(wall.id, kind)}
            onUpdateOpening={(id, patch) => updateOpening(wall.id, id, patch)}
            onDeleteOpening={(id) => deleteOpening(wall.id, id)}
          />
        </>
      ) : zone ? (
        <>
          <PanelHeader icon="▦" title="Floor zone" subtitle={zoneSize || "one room"} onClose={() => selectZone(null)} />
          <ZoneEditor
            key={zone.id}
            matId={zone.matId}
            sizeText={zoneSize}
            onMat={(id) => updateFloorZone(zone.id, { matId: id })}
            onDelete={() => deleteFloorZone(zone.id)}
          />
        </>
      ) : rect ? (
        <>
          <PanelHeader icon="🪑" title={rectName} subtitle="Furniture piece" onClose={() => select(null)} />
          <SlotEditor
            key={rect.id}
            productId={rect.productId}
            userProducts={userProducts}
            slotW_mm={mmPerPx ? Math.round(rect.w * mmPerPx) : null}
            slotD_mm={mmPerPx ? Math.round(rect.h * mmPerPx) : null}
            slotX_mm={mmPerPx ? Math.round(rect.x * mmPerPx) : null}
            slotY_mm={mmPerPx ? Math.round(rect.y * mmPerPx) : null}
            rotationDeg={rect.rotationDeg}
            tint={rect.tint}
            onRotate={(deg) => updateRect(rect.id, { rotationDeg: deg })}
            onTint={(t) => updateRect(rect.id, { tint: t ?? undefined })}
            onWidthMm={mmPerPx ? (v) => updateRect(rect.id, { w: Math.max(4, v / mmPerPx) }) : undefined}
            onDepthMm={mmPerPx ? (v) => updateRect(rect.id, { h: Math.max(4, v / mmPerPx) }) : undefined}
            onXMm={mmPerPx ? (v) => updateRect(rect.id, { x: v / mmPerPx }) : undefined}
            onYMm={mmPerPx ? (v) => updateRect(rect.id, { y: v / mmPerPx }) : undefined}
            onAddProduct={() => setAddOpen(true)}
            onBrowse={() => setBrowseOpen(true)}
            onDuplicate={duplicateSelection}
            onDelete={() => deleteRect(rect.id)}
          />
        </>
      ) : (
        <>
          <div className="shrink-0 border-b border-line p-3">
            <h2 className="font-display text-lg text-ink">Room</h2>
            <p className="mt-0.5 text-xs text-muted">
              {rects.length} item{rects.length === 1 ? "" : "s"} · {walls.length} wall{walls.length === 1 ? "" : "s"} · {floorZones.length} zone{floorZones.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex-1 overflow-auto p-4 text-xs leading-relaxed text-muted">
            <button
              onClick={() => setBrowseOpen(true)}
              disabled={!mmPerPx}
              className="mb-4 w-full rounded-lg bg-clay py-2.5 text-sm font-semibold text-clay-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              🪑 Add furniture from catalog
            </button>
            {!mmPerPx && <p className="-mt-2 mb-3 text-center text-faint">Calibrate the plan first to place furniture at true size.</p>}
            <p className="mb-2 font-medium text-ink">How it works</p>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Upload a 2D floor plan &amp; calibrate the scale.</li>
              <li>Add furniture from the catalog (or draw a slot), then drag it into place.</li>
              <li>Raise walls &amp; set floor/wall materials for a realistic look.</li>
            </ol>
            <div className="mt-4 rounded-lg border border-line bg-paper p-3">
              <div className="mb-1 font-medium text-ink">Your library</div>
              <p className="text-faint">{userProducts.length} of your own model{userProducts.length === 1 ? "" : "s"} (import .glb or photo → 3D).</p>
              <button onClick={() => setLibOpen(true)} className="mt-2 w-full rounded bg-clay py-1.5 font-semibold text-clay-ink hover:opacity-90">
                📚 Manage 3D library
              </button>
              <button onClick={() => setAddOpen(true)} className="mt-2 w-full rounded bg-raised border border-line py-1.5 font-medium text-ink hover:bg-clay-50">
                📦 Import a model
              </button>
            </div>
          </div>
        </>
      )}

      {roomScan && (
        <div className="space-y-2 border-t border-line p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Real-space scan</span>
            <button onClick={clearRoomScan} className="text-xs font-medium text-red-300 hover:opacity-80">Remove</button>
          </div>
          <label className="block text-[11px] text-faint">See-through
            <input type="range" min={0.2} max={1} step={0.05} value={roomScan.opacity}
              onChange={(e) => updateRoomScan({ opacity: parseFloat(e.target.value) })} className="mt-1 w-full" />
          </label>
          <label className="block text-[11px] text-faint">Size ×
            <input type="range" min={0.2} max={3} step={0.05} value={roomScan.scale}
              onChange={(e) => updateRoomScan({ scale: parseFloat(e.target.value) })} className="mt-1 w-full" />
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-faint">Rotate</span>
            {[0, 90, 180, 270].map((d) => (
              <button key={d} onClick={() => updateRoomScan({ rotYdeg: d })}
                className={`flex-1 rounded border py-1 text-xs ${roomScan.rotYdeg === d ? "border-clay bg-clay-50 text-ink" : "border-line bg-raised text-ink hover:bg-clay-50"}`}>{d}°</button>
            ))}
          </div>
          <button
            onClick={furnishScan}
            disabled={furnishing}
            className="w-full rounded-lg bg-clay py-2 text-sm font-semibold text-clay-ink transition hover:opacity-90 disabled:opacity-50"
          >
            {furnishing ? "Building plan…" : "🪑 Furnish this room"}
          </button>
          <p className="text-[11px] leading-relaxed text-faint">
            “Furnish this room” builds a true-scale plan from the scan so you can drop catalog furniture into the real space.
            Lower <span className="text-muted">see-through</span> or use the <span className="text-muted">360 view</span> to look inside.
          </p>
        </div>
      )}

      <CatalogBrowser
        open={browseOpen}
        onClose={() => setBrowseOpen(false)}
        onPick={handlePick}
        currentId={rect?.productId ?? null}
        userProducts={userProducts}
        onAddProduct={() => { setBrowseOpen(false); setAddOpen(true); }}
      />

      <AddProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(id) => { if (rect) updateRect(rect.id, { productId: id }); }}
      />

      <LibraryManager open={libOpen} onClose={() => setLibOpen(false)} />
    </div>
  );
}

function SlotEditor({
  productId, userProducts, rotationDeg, tint, slotW_mm, slotD_mm, slotX_mm, slotY_mm, onRotate, onTint, onWidthMm, onDepthMm, onXMm, onYMm, onAddProduct, onBrowse, onDuplicate, onDelete,
}: {
  productId: string | null;
  userProducts: Product[];
  rotationDeg: number;
  tint?: string;
  slotW_mm: number | null;
  slotD_mm: number | null;
  slotX_mm: number | null;
  slotY_mm: number | null;
  onRotate: (deg: number) => void;
  onTint: (t: string | null) => void;
  onWidthMm?: (v: number) => void;
  onDepthMm?: (v: number) => void;
  onXMm?: (v: number) => void;
  onYMm?: (v: number) => void;
  onAddProduct: () => void;
  onBrowse: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const product = resolveProduct(productId, userProducts);
  let oversize = false;
  if (product && slotW_mm && slotD_mm) {
    oversize = product.dimensions_mm.w > slotW_mm + 1 || product.dimensions_mm.d > slotD_mm + 1;
  }

  return (
    <div className="flex-1 space-y-4 overflow-auto p-3">
      <div>
        <div className="mb-1 text-xs uppercase tracking-wide text-faint">Slot size (mm)</div>
        <div className="flex items-center gap-2">
          <DimInput label="W" value={slotW_mm} onCommit={onWidthMm} />
          <span className="text-faint">×</span>
          <DimInput label="D" value={slotD_mm} onCommit={onDepthMm} />
        </div>
        <p className="mt-1 text-xs text-faint">Type exact sizes, or drag the slot&apos;s handles on the plan.</p>
      </div>

      <div>
        <div className="mb-1 text-xs uppercase tracking-wide text-faint">Position (mm)</div>
        <div className="flex items-center gap-2">
          <DimInput label="X" value={slotX_mm} onCommit={onXMm} />
          <span className="text-faint">,</span>
          <DimInput label="Y" value={slotY_mm} onCommit={onYMm} />
        </div>
        <p className="mt-1 text-xs text-faint">From the plan&apos;s top-left. Arrow keys nudge (⇧ = bigger).</p>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-faint">Product</span>
          <button onClick={onAddProduct} className="text-xs font-medium text-clay hover:opacity-80">📦 Add model</button>
        </div>
        <button
          onClick={onBrowse}
          className="flex w-full items-center gap-2 rounded border border-line bg-raised p-2 text-left transition hover:border-clay/50 hover:bg-clay-50"
        >
          {product ? (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded bg-paper">
                {product.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.thumbnailUrl} alt="" className="h-full w-full object-contain p-0.5" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-display text-white/80" style={{ background: product.color }}>
                    {product.name.charAt(0)}
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-ink">{product.name}</span>
                <span className="block font-mono text-[11px] text-faint">
                  {product.dimensions_mm.w}×{product.dimensions_mm.d}×{product.dimensions_mm.h} mm
                </span>
              </span>
              <span className="shrink-0 text-xs text-clay">Change ›</span>
            </>
          ) : (
            <span className="flex w-full items-center justify-between text-muted">
              <span>Browse furniture catalog…</span>
              <span className="text-clay">›</span>
            </span>
          )}
        </button>
      </div>

      {product && (
        <div
          className={`rounded border p-2 text-xs ${
            oversize ? "border-red-500/40 bg-red-950/40 text-red-300" : "border-green-500/40 bg-green-950/30 text-green-300"
          }`}
        >
          {oversize ? (
            <>⚠ {product.name} is larger than the drawn slot. It keeps its true size — widen the slot to fit it.</>
          ) : (
            <>✓ {product.name} fits this slot at true size.</>
          )}
        </div>
      )}

      {product && (
        <div>
          <div className="mb-1 text-xs uppercase tracking-wide text-faint">Finish / colour</div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onTint(null)}
              title="Original colours"
              className={`h-7 rounded border px-2 text-xs ${
                !tint ? "border-clay ring-2 ring-clay/40 text-ink" : "border-line text-muted hover:bg-clay-50"
              }`}
            >
              Original
            </button>
            {FINISHES.map((f) => (
              <button
                key={f.color}
                onClick={() => onTint(f.color)}
                title={f.name}
                style={{ background: f.color }}
                className={`h-7 w-7 rounded border ${
                  tint?.toLowerCase() === f.color.toLowerCase() ? "border-clay ring-2 ring-clay/40" : "border-line"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-1 flex justify-between text-xs uppercase tracking-wide text-faint">
          <span>Rotation</span>
          <span className="font-mono text-muted">{rotationDeg}°</span>
        </div>
        <input
          type="range" min={0} max={359} step={1} value={rotationDeg}
          onChange={(e) => onRotate(parseInt(e.target.value, 10))}
          className="w-full"
        />
        <div className="mt-1 flex gap-1">
          {[0, 90, 180, 270].map((d) => (
            <button
              key={d}
              onClick={() => onRotate(d)}
              className="flex-1 rounded bg-raised border border-line py-1 text-xs text-ink hover:bg-clay-50"
            >
              {d}°
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onDuplicate}
          title="Duplicate this piece (⌘D)"
          className="flex-1 rounded border border-line bg-raised py-2 text-sm font-medium text-ink hover:bg-clay-50"
        >
          ⧉ Duplicate
        </button>
        <button
          onClick={onDelete}
          className="flex-1 rounded bg-red-950/50 py-2 text-sm font-medium text-red-300 border border-red-500/30 hover:bg-red-900/60"
        >
          Delete slot
        </button>
      </div>
    </div>
  );
}

function WallEditor({
  wall, mmPerPx, onHeight, onPatch, onSplit, onDelete, onAddOpening, onUpdateOpening, onDeleteOpening,
}: {
  wall: Wall;
  mmPerPx: number | null;
  onHeight: (h: WallHeight) => void;
  onPatch: (patch: Partial<Wall>) => void;
  onSplit: () => void;
  onDelete: () => void;
  onAddOpening: (kind: OpeningKind) => void;
  onUpdateOpening: (id: string, patch: Partial<Opening>) => void;
  onDeleteOpening: (id: string) => void;
}) {
  const lengthMm = mmPerPx ? Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) * mmPerPx : 0;
  const wallH = wallHeightOf(wall); // mm; 0 when "No wall"
  const maxThick = lengthMm > 0 ? Math.round(lengthMm) : 1000;
  const clampOpening = (v: number, lo: number, hi: number) => Math.max(lo, hi > 0 ? Math.min(v, Math.floor(hi)) : v);
  const kind: WallKind = wall.kind ?? "interior";
  const heights: { h: WallHeight; label: string; note: string }[] = [
    { h: "none", label: "No wall", note: "hidden in 3D" },
    { h: "half", label: "Half wall", note: "1.1 m" },
    { h: "full", label: "Full wall", note: "2.7 m" },
  ];
  return (
    <div className="flex-1 space-y-4 overflow-auto p-3">
      {/* Doors & windows — front and centre, always usable */}
      <div>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Doors &amp; windows</div>
        <div className="mb-2 grid grid-cols-2 gap-2">
          <button onClick={() => onAddOpening("door")} className="rounded-lg border border-line bg-raised py-2 text-sm font-semibold text-ink transition hover:bg-clay-50">🚪 + Door</button>
          <button onClick={() => onAddOpening("window")} className="rounded-lg border border-line bg-raised py-2 text-sm font-semibold text-ink transition hover:bg-clay-50">🪟 + Window</button>
        </div>
        {(wall.openings ?? []).length === 0 ? (
          <p className="rounded border border-line bg-raised px-3 py-2 text-[11px] leading-relaxed text-muted">
            Tap a button above, or use the <span className="font-medium text-ink">🚪 Doors &amp; Windows</span> tool to click straight on the wall. A wall with no height gets raised automatically.
          </p>
        ) : (
          <div className="space-y-2">
            {(wall.openings ?? []).map((o) => {
              const fits = (lengthMm <= 0 || o.widthMm <= lengthMm) && o.sillMm + o.heightMm <= wallH + 1;
              return (
                <div key={o.id} className="rounded border border-line bg-raised p-2">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-ink">{o.kind === "door" ? "🚪 Door" : "🪟 Window"}</span>
                    <button onClick={() => onDeleteOpening(o.id)} className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200">✕ remove</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wide text-faint">Width mm</span>
                      <input type="number" min={100} max={lengthMm > 0 ? Math.floor(lengthMm) : undefined} step={50} value={o.widthMm}
                        onChange={(e) => onUpdateOpening(o.id, { widthMm: clampOpening(parseInt(e.target.value, 10) || 0, 100, lengthMm) })}
                        className="w-full rounded border border-line bg-paper px-2 py-1 text-ink" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wide text-faint">Height mm</span>
                      <input type="number" min={100} max={Math.round(wallH - o.sillMm)} step={50} value={o.heightMm}
                        onChange={(e) => onUpdateOpening(o.id, { heightMm: clampOpening(parseInt(e.target.value, 10) || 0, 100, wallH - o.sillMm) })}
                        className="w-full rounded border border-line bg-paper px-2 py-1 text-ink" />
                    </label>
                    {o.kind === "window" && (
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-wide text-faint">Sill mm</span>
                        <input type="number" min={0} max={Math.round(wallH - o.heightMm)} step={50} value={o.sillMm}
                          onChange={(e) => onUpdateOpening(o.id, { sillMm: clampOpening(parseInt(e.target.value, 10) || 0, 0, wallH - o.heightMm) })}
                          className="w-full rounded border border-line bg-paper px-2 py-1 text-ink" />
                      </label>
                    )}
                    <label className="col-span-2 block">
                      <span className="text-[10px] uppercase tracking-wide text-faint">Slide along wall · {Math.round(o.pos * 100)}%</span>
                      <input type="range" min={0} max={100} value={Math.round(o.pos * 100)}
                        onChange={(e) => onUpdateOpening(o.id, { pos: parseInt(e.target.value, 10) / 100 })}
                        className="w-full accent-clay" />
                    </label>
                  </div>
                  {!fits && <p className="mt-1.5 text-[10px] text-amber-400">⚠ doesn&apos;t fit the wall — reduce the size</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="mb-1 text-xs uppercase tracking-wide text-faint">Type</div>
        <div className="grid grid-cols-2 gap-2">
          {(["exterior", "interior"] as WallKind[]).map((k) => (
            <button
              key={k}
              onClick={() => onPatch({ kind: k })}
              className={`rounded border px-3 py-2 text-sm font-medium transition ${
                kind === k ? "border-clay bg-clay-50 text-ink" : "border-line bg-raised text-ink hover:bg-clay-50"
              }`}
            >
              {k === "exterior" ? "Exterior" : "Interior"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs uppercase tracking-wide text-faint">Thickness (mm)</div>
        <input
          type="number" min={20} max={maxThick} step={10}
          value={wall.thicknessMm ?? wallThicknessMm(wall)}
          onChange={(e) => { const v = parseInt(e.target.value, 10); onPatch({ thicknessMm: Number.isFinite(v) && v > 0 ? Math.min(v, maxThick) : undefined }); }}
          className="w-full rounded border border-line bg-raised px-3 py-1.5 text-ink"
        />
      </div>

      <div>
        <div className="mb-1 text-xs uppercase tracking-wide text-faint">Wall height</div>
        <div className="space-y-2">
          {heights.map((o) => (
            <button
              key={o.h}
              onClick={() => { onHeight(o.h); onPatch({ heightMm: undefined }); }}
              className={`flex w-full items-center justify-between rounded border px-3 py-2 transition ${
                wall.heightMm == null && wall.height === o.h ? "border-clay bg-clay-50 text-ink" : "border-line bg-raised text-ink hover:bg-clay-50"
              }`}
            >
              <span className="font-medium">{o.label}</span>
              <span className="text-xs text-muted">{o.note}</span>
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted">or custom</span>
          <input
            type="number" min={0} step={50} placeholder="mm"
            value={wall.heightMm ?? ""}
            onChange={(e) => { const v = parseInt(e.target.value, 10); onPatch({ heightMm: Number.isFinite(v) && v > 0 ? v : undefined }); }}
            className="w-24 rounded border border-line bg-raised px-2 py-1 text-ink"
          />
          <span className="text-xs text-muted">mm</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onSplit} className="flex-1 rounded border border-line bg-raised py-2 text-sm font-medium text-ink hover:bg-clay-50">Split</button>
        <button onClick={onDelete} className="flex-1 rounded border border-red-500/30 bg-red-950/50 py-2 text-sm font-medium text-red-300 hover:bg-red-900/60">Delete</button>
      </div>
    </div>
  );
}

function ZoneEditor({ matId, sizeText, onMat, onDelete }: {
  matId: string; sizeText: string; onMat: (id: string) => void; onDelete: () => void;
}) {
  return (
    <div className="flex-1 space-y-4 overflow-auto p-3">
      <div>
        <div className="text-xs uppercase tracking-wide text-faint">Floor zone (one room)</div>
        {sizeText && <div className="mt-1 font-mono text-ink">{sizeText}</div>}
      </div>
      <div>
        <div className="mb-1 text-xs uppercase tracking-wide text-faint">Floor material</div>
        <div className="space-y-2">
          {MATERIAL_CATEGORIES.map((cat) => (
            <div key={cat}>
              <div className="mb-1 text-[10px] uppercase tracking-wide text-faint">{cat}</div>
              <div className="flex flex-wrap gap-1.5">
                {MATERIALS.filter((m) => m.category === cat).map((m) => (
                  <button key={m.id} title={m.name} onClick={() => onMat(m.id)} style={{ background: m.base }}
                    className={`h-7 w-7 rounded border ${matId === m.id ? "border-clay ring-2 ring-clay/40" : "border-line"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="w-full rounded bg-red-950/50 py-2 text-sm font-medium text-red-300 border border-red-500/30 hover:bg-red-900/60"
      >
        Delete floor zone
      </button>
    </div>
  );
}
