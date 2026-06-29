"use client";

import { useEffect, useState } from "react";
import { useStudio } from "@/lib/puffer/store";
import { CATALOG, resolveProduct } from "@/lib/puffer/catalog";
import { Product, WallHeight } from "@/lib/puffer/types";
import { SurfaceMat } from "@/lib/puffer/textures";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-2.5 py-1 text-xs font-medium transition ${
        active ? "bg-[var(--brass-2)] text-[var(--ink)]" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
      }`}
    >
      {children}
    </button>
  );
}

function UploadChip({ active, onChange, children }: {
  active: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; children: React.ReactNode;
}) {
  return (
    <label className={`cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition ${
      active ? "bg-[var(--brass-2)] text-[var(--ink)]" : "bg-neutral-700 text-neutral-100 hover:bg-neutral-600"
    }`}>
      {children}
      <input type="file" accept="image/*" className="hidden" onChange={onChange} />
    </label>
  );
}

function MaterialsPanel() {
  const { floorMat, wallMat, setFloorMat, setWallMat } = useStudio();
  const upload = (setter: (m: SurfaceMat) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setter({ kind: "image", src: r.result as string });
    r.readAsDataURL(f);
    e.target.value = "";
  };
  const floorOpts: { k: "plan" | "wood" | "tile" | "marble" | "concrete"; label: string }[] = [
    { k: "plan", label: "Blueprint" }, { k: "wood", label: "Wood" }, { k: "tile", label: "Tile" },
    { k: "marble", label: "Marble" }, { k: "concrete", label: "Concrete" },
  ];
  const wallColors = ["#eef2f7", "#e8ddc7", "#cfd6da", "#cbd9c9", "#d8c9d6", "#3f4a5a"];

  return (
    <div className="space-y-3 border-t border-neutral-800 p-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Materials</div>

      <div>
        <div className="mb-1 text-[11px] uppercase tracking-wide text-neutral-500">Floor</div>
        <div className="flex flex-wrap gap-1.5">
          {floorOpts.map((o) => (
            <Chip key={o.k} active={floorMat.kind === o.k}
              onClick={() => setFloorMat(o.k === "plan" ? { kind: "plan" } : { kind: o.k })}>
              {o.label}
            </Chip>
          ))}
          <UploadChip active={floorMat.kind === "image"} onChange={upload(setFloorMat)}>Photo…</UploadChip>
        </div>
      </div>

      <div>
        <div className="mb-1 text-[11px] uppercase tracking-wide text-neutral-500">Walls</div>
        <div className="flex flex-wrap items-center gap-1.5">
          {wallColors.map((c) => (
            <button
              key={c}
              onClick={() => setWallMat({ kind: "color", color: c })}
              title={c}
              style={{ background: c }}
              className={`h-6 w-6 rounded border ${
                wallMat.kind === "color" && wallMat.color === c ? "border-[var(--brass-2)] ring-2 ring-[var(--brass-ring)]" : "border-neutral-600"
              }`}
            />
          ))}
          <Chip active={wallMat.kind === "concrete"} onClick={() => setWallMat({ kind: "concrete" })}>Concrete</Chip>
          <UploadChip active={wallMat.kind === "image"} onChange={upload(setWallMat)}>Photo…</UploadChip>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-neutral-500">
        Upload a photo of a real floor or wall — it tiles across the surface. Best seen in the 3D view and the{" "}
        <span className="text-neutral-300">360 walk-in</span>.
      </p>
    </div>
  );
}

function DimInput({ label, value, onCommit }: {
  label: string; value: number | null; onCommit?: (v: number) => void;
}) {
  const [txt, setTxt] = useState(value != null ? String(value) : "");
  useEffect(() => { setTxt(value != null ? String(value) : ""); }, [value]);
  return (
    <label className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1.5">
      <span className="text-xs text-neutral-500">{label}</span>
      <input
        type="number"
        value={txt}
        disabled={!onCommit}
        onChange={(e) => {
          setTxt(e.target.value);
          const v = parseFloat(e.target.value);
          if (onCommit && v > 0) onCommit(Math.round(v));
        }}
        className="w-16 bg-transparent text-right font-mono text-neutral-100 outline-none disabled:opacity-50"
      />
    </label>
  );
}

export default function Inspector() {
  const {
    rects, selectedId, mmPerPx, updateRect, deleteRect,
    walls, selectedWallId, setWallHeight, deleteWall,
    userProducts, hydrateLibrary,
  } = useStudio();
  const rect = rects.find((r) => r.id === selectedId) || null;
  const wall = walls.find((w) => w.id === selectedWallId) || null;
  useEffect(() => { hydrateLibrary(); }, [hydrateLibrary]);

  return (
    <div className="flex h-full flex-col bg-neutral-900 text-sm text-neutral-200">
      <div className="border-b border-neutral-800 p-3">
        <h2 className="font-semibold text-white">Inspector</h2>
        <p className="mt-0.5 text-xs text-neutral-400">
          {rects.length} slot{rects.length === 1 ? "" : "s"} · {walls.length} wall{walls.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        {wall ? (
          <WallEditor
            key={wall.id}
            height={wall.height}
            lengthM={mmPerPx ? (Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) * mmPerPx) / 1000 : null}
            onHeight={setWallHeight}
            onDelete={() => deleteWall(wall.id)}
          />
        ) : !rect ? (
          <div className="p-4 text-xs leading-relaxed text-neutral-400">
            <p className="mb-2 font-medium text-neutral-300">How it works</p>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Upload a 2D floor plan.</li>
              <li>Calibrate, draw furniture slots, raise walls.</li>
              <li>Set floor &amp; wall materials below for a realistic look.</li>
            </ol>
            <div className="mt-4 rounded-lg border border-neutral-800 bg-[var(--ink)] p-3">
              <div className="mb-1 font-medium text-neutral-200">Your library</div>
              <p className="text-neutral-500">{userProducts.length} saved product{userProducts.length === 1 ? "" : "s"}. Assign products to slots from the demo catalog.</p>
            </div>
          </div>
        ) : (
          <SlotEditor
            key={rect.id}
            productId={rect.productId}
            userProducts={userProducts}
            slotW_mm={mmPerPx ? Math.round(rect.w * mmPerPx) : null}
            slotD_mm={mmPerPx ? Math.round(rect.h * mmPerPx) : null}
            rotationDeg={rect.rotationDeg}
            onProduct={(id) => updateRect(rect.id, { productId: id })}
            onRotate={(deg) => updateRect(rect.id, { rotationDeg: deg })}
            onWidthMm={mmPerPx ? (v) => updateRect(rect.id, { w: Math.max(4, v / mmPerPx) }) : undefined}
            onDepthMm={mmPerPx ? (v) => updateRect(rect.id, { h: Math.max(4, v / mmPerPx) }) : undefined}
            onDelete={() => deleteRect(rect.id)}
          />
        )}
      </div>

      <MaterialsPanel />
    </div>
  );
}

function SlotEditor({
  productId, userProducts, rotationDeg, slotW_mm, slotD_mm, onProduct, onRotate, onWidthMm, onDepthMm, onDelete,
}: {
  productId: string | null;
  userProducts: Product[];
  rotationDeg: number;
  slotW_mm: number | null;
  slotD_mm: number | null;
  onProduct: (id: string | null) => void;
  onRotate: (deg: number) => void;
  onWidthMm?: (v: number) => void;
  onDepthMm?: (v: number) => void;
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
        <div className="mb-1 text-xs uppercase tracking-wide text-neutral-500">Slot size (mm)</div>
        <div className="flex items-center gap-2">
          <DimInput label="W" value={slotW_mm} onCommit={onWidthMm} />
          <span className="text-neutral-500">×</span>
          <DimInput label="D" value={slotD_mm} onCommit={onDepthMm} />
        </div>
        <p className="mt-1 text-xs text-neutral-500">Type exact sizes, or drag the slot&apos;s handles on the plan.</p>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-neutral-500">Product</span>
        </div>
        <select
          value={productId ?? ""}
          onChange={(e) => onProduct(e.target.value || null)}
          className="w-full rounded bg-neutral-800 px-2 py-2 text-white"
        >
          <option value="">— empty —</option>
          {userProducts.length > 0 && (
            <optgroup label="Your library">
              {userProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.dimensions_mm.w}×{p.dimensions_mm.d}×{p.dimensions_mm.h} mm)
                </option>
              ))}
            </optgroup>
          )}
          <optgroup label="Demo catalog">
            {CATALOG.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.dimensions_mm.w}×{p.dimensions_mm.d}×{p.dimensions_mm.h} mm)
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {product && (
        <div
          className={`rounded border p-2 text-xs ${
            oversize ? "border-red-500/50 bg-red-950/40 text-red-300" : "border-green-500/40 bg-green-950/30 text-green-300"
          }`}
        >
          {oversize ? (
            <>⚠ {product.name} is larger than the drawn slot. It keeps its true size — widen the slot to fit it.</>
          ) : (
            <>✓ {product.name} fits this slot at true size.</>
          )}
        </div>
      )}

      <div>
        <div className="mb-1 flex justify-between text-xs uppercase tracking-wide text-neutral-500">
          <span>Rotation</span>
          <span className="font-mono text-neutral-300">{rotationDeg}°</span>
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
              className="flex-1 rounded bg-neutral-800 py-1 text-xs hover:bg-neutral-700"
            >
              {d}°
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onDelete}
        className="w-full rounded bg-red-900/60 py-2 text-sm font-medium text-red-200 hover:bg-red-800/60"
      >
        Delete slot
      </button>
    </div>
  );
}

function WallEditor({
  height, lengthM, onHeight, onDelete,
}: {
  height: WallHeight;
  lengthM: number | null;
  onHeight: (h: WallHeight) => void;
  onDelete: () => void;
}) {
  const opts: { h: WallHeight; label: string; note: string }[] = [
    { h: "none", label: "No wall", note: "hidden in 3D" },
    { h: "half", label: "Half wall", note: "1.1 m partition" },
    { h: "full", label: "Full wall", note: "2.7 m to ceiling" },
  ];
  return (
    <div className="flex-1 space-y-4 overflow-auto p-3">
      {lengthM != null && (
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">Wall length</div>
          <div className="mt-1 font-mono text-neutral-200">{lengthM.toFixed(2)} m</div>
        </div>
      )}
      <div className="text-xs uppercase tracking-wide text-neutral-500">Wall height</div>
      <div className="space-y-2">
        {opts.map((o) => (
          <button
            key={o.h}
            onClick={() => onHeight(o.h)}
            className={`flex w-full items-center justify-between rounded border px-3 py-2 transition ${
              height === o.h
                ? "border-[var(--brass-2)] bg-[var(--brass-tint)] text-white"
                : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            <span className="font-medium">{o.label}</span>
            <span className="text-xs text-neutral-400">{o.note}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onDelete}
        className="w-full rounded bg-red-900/60 py-2 text-sm font-medium text-red-200 hover:bg-red-800/60"
      >
        Delete wall
      </button>
    </div>
  );
}
