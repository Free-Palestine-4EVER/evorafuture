"use client";

import { useEffect, useRef, useState } from "react";
import { useStudio } from "@/lib/puffer/store";
import { resolveProduct } from "@/lib/puffer/catalog";
import { SAMPLES } from "@/lib/puffer/samples";
import { detectWalls } from "@/lib/puffer/wallDetect";
import { detectSlots } from "@/lib/puffer/detectSlots";
import { loadPlanFile } from "@/lib/puffer/loadPlanFile";
import { scanToProject } from "@/lib/puffer/importScan";
import { Point, Rect } from "@/lib/puffer/types";

// thin vertical separator between toolbar groups
function Divider() {
  return <span className="mx-0.5 hidden h-5 w-px self-center bg-neutral-700 sm:block" />;
}

type HandleId = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
const HANDLES: HandleId[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

// rotate a vector by `ang` radians
function rot(x: number, y: number, ang: number): Point {
  const c = Math.cos(ang), s = Math.sin(ang);
  return { x: x * c - y * s, y: x * s + y * c };
}

// Resize a (possibly rotated) rect by dragging `handle` to pointer P, keeping the
// opposite edge/corner pinned in place. Returns new axis-aligned {x,y,w,h}.
function resizeRect(orig: Rect, handle: HandleId, P: Point): Partial<Rect> {
  const MIN = 4;
  const th = (orig.rotationDeg * Math.PI) / 180;
  const C = { x: orig.x + orig.w / 2, y: orig.y + orig.h / 2 };
  const sx = handle.includes("e") ? 1 : handle.includes("w") ? -1 : 0;
  const sy = handle.includes("s") ? 1 : handle.includes("n") ? -1 : 0;
  // anchor = opposite point, fixed in world space
  const aRel = rot(-sx * orig.w / 2, -sy * orig.h / 2, th);
  const A = { x: C.x + aRel.x, y: C.y + aRel.y };
  // pointer expressed in the rect's local frame, relative to the anchor
  const local = rot(P.x - A.x, P.y - A.y, -th);
  const newW = sx !== 0 ? Math.max(MIN, sx * local.x) : orig.w;
  const newH = sy !== 0 ? Math.max(MIN, sy * local.y) : orig.h;
  const off = rot(sx !== 0 ? (sx * newW) / 2 : 0, sy !== 0 ? (sy * newH) / 2 : 0, th);
  const nc = { x: A.x + off.x, y: A.y + off.y };
  return { x: nc.x - newW / 2, y: nc.y - newH / 2, w: newW, h: newH };
}

export default function PlanEditor() {
  const {
    planImage, imgW, imgH, mmPerPx, scaleEstimated, calibPoints, rects, selectedId, mode,
    walls, selectedWallId, wallHeight, autoWallsOn, detecting, userProducts,
    loadPlan, loadSample, loadProject, setMode, addCalibPoint, updateCalibPoint, setScaleFromCalib, addRect, placeDetected, updateRect, select,
    addWall, selectWall, setWallHeight, tracePerimeter,
    setDetecting, setAutoWalls, clearAutoWalls,
    deleteRect, deleteWall, undo, pushHistory,
  } = useStudio();

  // Editor keyboard shortcuts: delete, deselect, nudge, undo.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "z") { e.preventDefault(); undo(); return; }
      if (e.key === "Escape") { select(null); selectWall(null); return; }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId) { e.preventDefault(); pushHistory(); deleteRect(selectedId); }
        else if (selectedWallId) { e.preventDefault(); pushHistory(); deleteWall(selectedWallId); }
        return;
      }
      if (selectedId && e.key.startsWith("Arrow")) {
        e.preventDefault();
        const r = useStudio.getState().rects.find((x) => x.id === selectedId);
        if (!r) return;
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        updateRect(selectedId, { x: r.x + dx, y: r.y + dy });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, selectedWallId, undo, select, selectWall, deleteRect, deleteWall, pushHistory, updateRect]);

  async function onScanFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const scan = JSON.parse(await f.text());
      loadProject(scanToProject(scan));
    } catch (err) {
      console.error("scan import failed", err);
      alert("Couldn't read that scan. It should be an Evora Scan .json from the LiDAR app.");
    } finally {
      e.target.value = "";
    }
  }

  const [slotting, setSlotting] = useState(false);
  async function autoSlots() {
    if (!planImage || !mmPerPx) return;
    setSlotting(true);
    try {
      const found = await detectSlots(planImage, imgW, imgH);
      if (!found.length) {
        alert("No furniture detected in this plan — draw the slots manually with “2 · Draw slots”.");
        return;
      }
      placeDetected(found.map((b) => ({ ...b, productId: "" })));
    } catch (err) {
      console.error("slot detection failed", err);
      alert("Auto-slots failed. Check the console.");
    } finally {
      setSlotting(false);
    }
  }

  async function toggleAutoWalls() {
    if (autoWallsOn) { clearAutoWalls(); return; }
    if (!planImage || !mmPerPx) return;
    setDetecting(true);
    try {
      // pass the placed slots so their footprints aren't mistaken for walls
      const segs = await detectWalls(planImage, imgW, imgH, rects);
      setAutoWalls(segs);
    } catch (err) {
      console.error("wall detection failed", err);
      setDetecting(false);
    }
  }

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<{ start: Point; cur: Point } | null>(null);
  const [calibLen, setCalibLen] = useState("");
  const [showDims, setShowDims] = useState(true);
  const [calibDrag, setCalibDrag] = useState<number | null>(null);

  // downsized luminance map of the plan, for snapping calibration points to the
  // nearest dark wall line ("magnetic" end-to-end picking).
  const luma = useRef<{ w: number; h: number; data: Uint8Array; scale: number } | null>(null);
  useEffect(() => {
    luma.current = null;
    if (!planImage) return;
    const img = new Image();
    img.onload = () => {
      const cap = 1000;
      const sc = Math.min(1, cap / Math.max(imgW, imgH));
      const w = Math.max(1, Math.round(imgW * sc)), h = Math.max(1, Math.round(imgH * sc));
      const cv = document.createElement("canvas");
      cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const px = ctx.getImageData(0, 0, w, h).data;
      const data = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) {
        const a = px[i * 4 + 3];
        data[i] = a < 10 ? 255 : Math.round(0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]);
      }
      luma.current = { w, h, data, scale: sc };
    };
    img.src = planImage;
  }, [planImage, imgW, imgH]);

  // snap a plan-pixel point to the darkest pixel within a small radius (a wall line)
  function snap(p: Point): Point {
    const L = luma.current;
    if (!L) return p;
    const cx = Math.round(p.x * L.scale), cy = Math.round(p.y * L.scale);
    const R = Math.max(3, Math.round(Math.max(L.w, L.h) * 0.012));
    let best = 200, bx = cx, by = cy; // only snap to genuinely dark pixels
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= L.w || y >= L.h) continue;
      const v = L.data[y * L.w + x];
      if (v < best) { best = v; bx = x; by = y; }
    }
    return best < 150 ? { x: bx / L.scale, y: by / L.scale } : p;
  }
  // live move/resize of a placed slot
  const [edit, setEdit] = useState<
    { kind: "move"; id: string; orig: Rect; start: Point }
    | { kind: "resize"; id: string; handle: HandleId; orig: Rect; start: Point }
    | null
  >(null);

  // --- file upload (images + PDF) ----------------------------------------
  const [loadingFile, setLoadingFile] = useState(false);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingFile(true);
    try {
      const { dataUrl, width, height, mmPerPx: scale } = await loadPlanFile(file);
      // DXF/CAD carry a true scale → load pre-calibrated; images/PDF need calibration
      if (scale) loadSample(dataUrl, width, height, scale);
      else loadPlan(dataUrl, width, height);
    } catch (err) {
      console.error("could not load plan file", err);
      alert(err instanceof Error ? err.message : "Sorry — couldn't read that file. Try a PNG, JPG, PDF, or DXF floor plan.");
    } finally {
      setLoadingFile(false);
      e.target.value = ""; // allow re-uploading the same file
    }
  }

  // --- map a pointer event to plan-image pixel coords --------------------
  function toPx(e: React.PointerEvent): Point {
    const box = svgRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - box.left) / box.width) * imgW,
      y: ((e.clientY - box.top) / box.height) * imgH,
    };
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!planImage) return;
    const p = toPx(e);
    if (mode === "calibrate") {
      if (calibPoints.length < 2) addCalibPoint(snap(p)); // handles manage their own drag
    } else if (mode === "draw" || mode === "wall") {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setDrag({ start: p, cur: p });
    } else if (mode === "select") {
      // clicking empty space deselects
      if (e.target === svgRef.current) { select(null); selectWall(null); }
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (calibDrag !== null) { updateCalibPoint(calibDrag, snap(toPx(e))); return; }
    if (edit) {
      const P = toPx(e);
      if (edit.kind === "move") {
        updateRect(edit.id, { x: edit.orig.x + (P.x - edit.start.x), y: edit.orig.y + (P.y - edit.start.y) });
      } else {
        updateRect(edit.id, resizeRect(edit.orig, edit.handle, P));
      }
      return;
    }
    if ((mode === "draw" || mode === "wall") && drag) setDrag({ ...drag, cur: toPx(e) });
  }

  function onPointerUp() {
    if (calibDrag !== null) { setCalibDrag(null); return; }
    if (edit) { setEdit(null); return; }
    if (!drag) return;
    if (mode === "draw") {
      const x = Math.min(drag.start.x, drag.cur.x);
      const y = Math.min(drag.start.y, drag.cur.y);
      const w = Math.abs(drag.cur.x - drag.start.x);
      const h = Math.abs(drag.cur.y - drag.start.y);
      if (w > 5 && h > 5) { pushHistory(); addRect({ x, y, w, h }); }
    } else if (mode === "wall") {
      const len = Math.hypot(drag.cur.x - drag.start.x, drag.cur.y - drag.start.y);
      if (len > 8) addWall({ x1: drag.start.x, y1: drag.start.y, x2: drag.cur.x, y2: drag.cur.y });
    }
    setDrag(null);
  }

  const [a, b] = calibPoints;
  const calibDistPx = a && b ? Math.hypot(b.x - a.x, b.y - a.y) : 0;
  const activeCalib = calibDrag !== null ? calibPoints[calibDrag] ?? null : null;

  // sizing helper: real-world mm of a rect dimension
  const mm = (px: number) => (mmPerPx ? Math.round(px * mmPerPx) : null);

  return (
    <div className="flex h-full flex-col">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 bg-neutral-900 p-3 text-sm">
        <label className="cursor-pointer rounded bg-neutral-700 px-3 py-1.5 font-medium text-white hover:bg-neutral-600">
          {loadingFile ? "Loading…" : planImage ? "Replace plan" : "Upload plan"}
          <input
            type="file"
            accept="image/*,application/pdf,.pdf,.dxf,.dwg,.png,.jpg,.jpeg,.webp,.svg,.gif,.bmp"
            className="hidden"
            onChange={onFile}
          />
        </label>

        <select
          value=""
          onChange={(e) => {
            const sm = SAMPLES.find((x) => x.id === e.target.value);
            if (sm) loadSample(sm.src, sm.imgW, sm.imgH, sm.mmPerPx);
          }}
          className="rounded bg-neutral-800 px-2 py-1.5 font-medium text-neutral-200 hover:bg-neutral-700"
          title="Load a ready-made sample plan (auto-calibrated)"
        >
          <option value="">Load sample plan…</option>
          {SAMPLES.map((sm) => (
            <option key={sm.id} value={sm.id}>{sm.name}</option>
          ))}
        </select>

        <label className="cursor-pointer rounded bg-teal-700 px-3 py-1.5 font-medium text-white hover:bg-teal-600" title="Import a LiDAR room scan (.json) from the Evora Scan iOS app">
          📷 Import scan
          <input type="file" accept="application/json,.json" className="hidden" onChange={onScanFile} />
        </label>

        {planImage && (
          <>
            <Divider />

            {/* workflow steps */}
            <ModeButton active={mode === "calibrate"} onClick={() => setMode("calibrate")}>
              1 · Calibrate
            </ModeButton>
            <ModeButton active={mode === "draw"} onClick={() => setMode("draw")} disabled={!mmPerPx}>
              2 · Draw slots
            </ModeButton>
            <ModeButton active={mode === "select"} onClick={() => setMode("select")}>
              3 · Select
            </ModeButton>
            <ModeButton active={mode === "wall"} onClick={() => setMode("wall")} disabled={!mmPerPx}>
              4 · Walls
            </ModeButton>

            <Divider />

            {/* one-tap helpers */}
            <button
              onClick={toggleAutoWalls}
              disabled={!mmPerPx || detecting}
              title={mmPerPx ? "Detect the walls in the plan and raise them in 3D" : "Calibrate the plan first"}
              className={`rounded px-3 py-1.5 font-medium transition ${
                autoWallsOn ? "bg-[var(--brass-2)] text-[var(--ink)] hover:bg-[var(--brass-2-hi)]" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              } ${!mmPerPx || detecting ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {detecting ? "Detecting…" : autoWallsOn ? "⚡ Walls raised ✓" : "⚡ Auto-walls"}
            </button>
            <button
              onClick={autoSlots}
              disabled={!mmPerPx || slotting}
              title={mmPerPx ? "Detect furniture in the plan and draw slots over it — a starting layout you review and adjust." : "Calibrate the plan first"}
              className={`rounded px-3 py-1.5 font-medium transition bg-violet-700 text-white hover:bg-violet-600 ${
                !mmPerPx || slotting ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {slotting ? "Reading plan…" : "✨ Auto-slots"}
            </button>
            <button
              onClick={() => setShowDims((v) => !v)}
              title="Show / hide dimension labels"
              className={`rounded px-3 py-1.5 font-medium transition ${
                showDims ? "bg-neutral-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              {showDims ? "Dimensions ✓" : "Dimensions"}
            </button>

            <span
              className={`ml-auto rounded px-2 py-1 text-xs ${scaleEstimated ? "bg-amber-900/60 text-amber-200" : "bg-neutral-800 text-neutral-300"}`}
              title={scaleEstimated ? "Estimated scale — use “1 · Calibrate” for exact real-world sizes" : undefined}
            >
              {mmPerPx
                ? `${scaleEstimated ? "≈ " : ""}${mmPerPx.toFixed(2)} mm/px · ${(imgW * mmPerPx / 1000).toFixed(1)} × ${(imgH * mmPerPx / 1000).toFixed(1)} m${scaleEstimated ? " · calibrate for exact" : ""}`
                : "not calibrated"}
            </span>
          </>
        )}
      </div>

      {/* calibration helper bar */}
      {planImage && mode === "calibrate" && (
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-amber-950/40 px-3 py-2 text-xs text-amber-200">
          {calibPoints.length < 2 ? (
            <span>Click the two ends of a wall you know the length of — then drag each handle (a zoom magnifier appears) to land exactly on the corners. It snaps to the wall lines.</span>
          ) : (
            <>
              <span>That line is {calibDistPx.toFixed(0)} px. Real length:</span>
              <input
                type="number"
                value={calibLen}
                onChange={(e) => setCalibLen(e.target.value)}
                placeholder="mm"
                className="w-24 rounded bg-neutral-800 px-2 py-1 text-white"
              />
              <button
                className="rounded bg-amber-600 px-2 py-1 font-medium text-white hover:bg-amber-500"
                onClick={() => {
                  const v = parseFloat(calibLen);
                  if (v > 0) { setScaleFromCalib(v); setCalibLen(""); }
                }}
              >
                Set scale
              </button>
            </>
          )}
        </div>
      )}

      {/* walls helper bar */}
      {planImage && (mode === "wall" || selectedWallId) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 bg-[var(--brass-tint)] px-3 py-2 text-xs text-[var(--paper)]">
          <span className="text-[var(--brass-2)]">
            {selectedWallId ? "Selected wall:" : "New walls:"}
          </span>
          <div className="flex overflow-hidden rounded border border-[var(--brass)]">
            {(["none", "half", "full"] as const).map((h) => {
              const active = selectedWallId
                ? walls.find((w) => w.id === selectedWallId)?.height === h
                : wallHeight === h;
              const label = h === "none" ? "No wall" : h === "half" ? "Half wall" : "Full wall";
              return (
                <button
                  key={h}
                  onClick={() => setWallHeight(h)}
                  className={`px-3 py-1 font-medium transition ${
                    active ? "bg-[var(--brass-2)] text-[var(--ink)]" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {mode === "wall" && (
            <>
              <span className="text-[var(--paper-soft)]">— drag along a wall in the plan to raise it.</span>
              <button
                onClick={tracePerimeter}
                className="ml-auto rounded bg-[var(--brass)] px-2 py-1 font-medium text-[var(--paper)] hover:bg-[var(--brass-2)] hover:text-[var(--ink)]"
              >
                Trace perimeter
              </button>
            </>
          )}
        </div>
      )}

      {/* canvas */}
      <div className="flex-1 overflow-auto bg-[var(--ink)] p-4">
        {!planImage ? (
          <div className="flex h-full items-center justify-center text-center text-neutral-500">
            <div>
              <p className="text-lg">Upload a 2D floor plan to begin.</p>
              <p className="mt-1 text-sm">PNG / JPG. Then calibrate, draw furniture slots, and assign products.</p>
            </div>
          </div>
        ) : (
          <div
            className="relative mx-auto"
            style={{ aspectRatio: `${imgW} / ${imgH}`, maxWidth: "100%", width: imgW }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={planImage} alt="floor plan" className="absolute inset-0 h-full w-full select-none" draggable={false} />
            <svg
              ref={svgRef}
              viewBox={`0 0 ${imgW} ${imgH}`}
              className="absolute inset-0 h-full w-full"
              style={{ cursor: mode === "draw" || mode === "wall" ? "crosshair" : "default", touchAction: "none" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              {/* committed walls (drawn under furniture) */}
              {walls.map((w) => {
                const selected = w.id === selectedWallId;
                const color = selected
                  ? "#C5A06A"
                  : w.source === "auto" ? "#f59e0b"
                  : w.height === "full" ? "#334155"
                  : w.height === "half" ? "#64748b"
                  : "#cbd5e1";
                const vis = Math.max(3, imgW / 180);
                return (
                  <g key={w.id}>
                    {/* wide invisible hit area for easy selection */}
                    <line
                      x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2}
                      stroke="transparent" strokeWidth={Math.max(14, imgW / 50)} strokeLinecap="round"
                      style={{ cursor: mode === "select" ? "pointer" : "inherit", pointerEvents: mode === "select" ? "stroke" : "none" }}
                      onPointerDown={(e) => { if (mode === "select") { e.stopPropagation(); selectWall(w.id); } }}
                    />
                    <line
                      x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2}
                      stroke={color} strokeWidth={vis} strokeLinecap="round"
                      strokeDasharray={w.height === "none" ? "8 6" : undefined}
                      style={{ pointerEvents: "none" }}
                    />
                    {selected && mmPerPx && (
                      <text
                        x={(w.x1 + w.x2) / 2} y={(w.y1 + w.y2) / 2 - Math.max(8, imgW / 90)}
                        fill="#E7D3AC" fontSize={Math.max(11, imgW / 60)}
                        textAnchor="middle" dominantBaseline="middle"
                        style={{ paintOrder: "stroke", pointerEvents: "none" }}
                        stroke="#000" strokeWidth={Math.max(2, imgW / 350)}
                      >
                        {(Math.hypot(w.x2 - w.x1, w.y2 - w.y1) * mmPerPx / 1000).toFixed(2)} m
                      </text>
                    )}
                  </g>
                );
              })}

              {/* committed rectangles */}
              {rects.map((r) => {
                const product = resolveProduct(r.productId, userProducts);
                const selected = r.id === selectedId;
                const cx = r.x + r.w / 2;
                const cy = r.y + r.h / 2;
                // does the product's true footprint fit the drawn slot?
                let oversize = false;
                if (product && mmPerPx) {
                  const slotW = r.w * mmPerPx, slotD = r.h * mmPerPx;
                  oversize = product.dimensions_mm.w > slotW + 1 || product.dimensions_mm.d > slotD + 1;
                }
                const stroke = selected ? "#C5A06A" : oversize ? "#ef4444" : product ? "#22c55e" : "#a3a3a3";
                const sw = Math.max(2, imgW / 400);
                const fs = Math.max(11, imgW / 55);
                const dimFs = Math.max(10, imgW / 70);
                const hs = Math.max(7, imgW / 90); // handle size
                // handle local positions
                const hx = (id: HandleId) => id.includes("w") ? r.x : id.includes("e") ? r.x + r.w : r.x + r.w / 2;
                const hy = (id: HandleId) => id.includes("n") ? r.y : id.includes("s") ? r.y + r.h : r.y + r.h / 2;
                const cursorFor: Record<HandleId, string> = {
                  nw: "nwse-resize", se: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize",
                  n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize",
                };
                return (
                  <g key={r.id} transform={`rotate(${r.rotationDeg} ${cx} ${cy})`}>
                    <rect
                      x={r.x} y={r.y} width={r.w} height={r.h}
                      fill={product ? `${stroke}22` : "#ffffff10"}
                      stroke={stroke}
                      strokeWidth={sw}
                      style={{ cursor: mode === "select" ? "move" : "inherit" }}
                      onPointerDown={(e) => {
                        if (mode !== "select") return;
                        e.stopPropagation();
                        select(r.id);
                        svgRef.current?.setPointerCapture(e.pointerId);
                        setEdit({ kind: "move", id: r.id, orig: r, start: toPx(e) });
                      }}
                    />
                    <text
                      x={cx} y={selected ? cy - fs * 0.5 : cy}
                      fill="#fff" fontSize={fs}
                      textAnchor="middle" dominantBaseline="middle"
                      style={{ paintOrder: "stroke", pointerEvents: "none" }}
                      stroke="#000" strokeWidth={Math.max(2, imgW / 350)}
                    >
                      {product ? product.name : "slot"}
                    </text>
                    {/* size metric */}
                    {showDims && mmPerPx && (
                      <text
                        x={cx} y={cy + fs * 0.7}
                        fill="#e5e7eb" fontSize={dimFs}
                        textAnchor="middle" dominantBaseline="middle"
                        style={{ paintOrder: "stroke", pointerEvents: "none" }}
                        stroke="#000" strokeWidth={Math.max(1.5, imgW / 500)}
                      >
                        {mm(r.w)} × {mm(r.h)} mm
                      </text>
                    )}
                    {/* resize handles on the selected slot */}
                    {selected && mode === "select" && HANDLES.map((id) => (
                      <rect
                        key={id}
                        x={hx(id) - hs / 2} y={hy(id) - hs / 2} width={hs} height={hs}
                        fill="#C5A06A" stroke="#fff" strokeWidth={sw * 0.6}
                        style={{ cursor: cursorFor[id] }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          select(r.id);
                          svgRef.current?.setPointerCapture(e.pointerId);
                          setEdit({ kind: "resize", id: r.id, handle: id, orig: r, start: toPx(e) });
                        }}
                      />
                    ))}
                  </g>
                );
              })}

              {/* in-progress drag: rectangle for slots, line for walls */}
              {drag && mode === "wall" && (
                <line
                  x1={drag.start.x} y1={drag.start.y} x2={drag.cur.x} y2={drag.cur.y}
                  stroke="#C5A06A" strokeWidth={Math.max(3, imgW / 180)} strokeLinecap="round" strokeDasharray="8 6"
                />
              )}
              {drag && mode === "draw" && (
                <rect
                  x={Math.min(drag.start.x, drag.cur.x)}
                  y={Math.min(drag.start.y, drag.cur.y)}
                  width={Math.abs(drag.cur.x - drag.start.x)}
                  height={Math.abs(drag.cur.y - drag.start.y)}
                  fill="#C5A06A33" stroke="#C5A06A" strokeDasharray="6 4"
                  strokeWidth={Math.max(2, imgW / 400)}
                />
              )}

              {/* calibration line + draggable end-to-end handles */}
              {a && b && (
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#f59e0b"
                  strokeWidth={Math.max(2, imgW / 400)} strokeDasharray={`${imgW / 70} ${imgW / 140}`} />
              )}
              {mode === "calibrate" && calibPoints.map((p, i) => {
                const r = Math.max(9, imgW / 80);
                const cw = Math.max(1, imgW / 700);
                return (
                  <g
                    key={i}
                    style={{ cursor: "grab" }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      svgRef.current?.setPointerCapture(e.pointerId);
                      setCalibDrag(i);
                    }}
                  >
                    <circle cx={p.x} cy={p.y} r={r} fill="#f59e0b22" stroke="#f59e0b" strokeWidth={Math.max(2, imgW / 350)} />
                    <line x1={p.x - r} y1={p.y} x2={p.x + r} y2={p.y} stroke="#f59e0b" strokeWidth={cw} />
                    <line x1={p.x} y1={p.y - r} x2={p.x} y2={p.y + r} stroke="#f59e0b" strokeWidth={cw} />
                    <circle cx={p.x} cy={p.y} r={Math.max(1.5, imgW / 450)} fill="#b45309" />
                  </g>
                );
              })}
            </svg>

            {/* zoom magnifier while dragging a calibration handle */}
            {activeCalib && (
              <div
                className={`pointer-events-none absolute top-2 z-20 h-[150px] w-[150px] overflow-hidden rounded-full border-2 border-amber-400 shadow-2xl ${activeCalib.x > imgW / 2 ? "left-2" : "right-2"}`}
                style={{
                  backgroundColor: "#fff",
                  backgroundImage: `url(${planImage})`, backgroundRepeat: "no-repeat",
                  backgroundSize: `${imgW * 6}px ${imgH * 6}px`,
                  backgroundPosition: `${75 - activeCalib.x * 6}px ${75 - activeCalib.y * 6}px`,
                }}
              >
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-amber-500/70" />
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-amber-500/70" />
              </div>
            )}
          </div>
        )}
      </div>

      {planImage && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-neutral-800 bg-neutral-900 px-3 py-1.5 text-[11px] text-neutral-400">
          <span><kbd className="rounded bg-neutral-800 px-1 text-neutral-300">Del</kbd> remove slot</span>
          <span><kbd className="rounded bg-neutral-800 px-1 text-neutral-300">Esc</kbd> deselect</span>
          <span><kbd className="rounded bg-neutral-800 px-1 text-neutral-300">↑↓←→</kbd> nudge <span className="text-neutral-600">(⇧ = 10px)</span></span>
          <span><kbd className="rounded bg-neutral-800 px-1 text-neutral-300">⌘Z</kbd> undo</span>
          {selectedId && <button onClick={() => { pushHistory(); deleteRect(selectedId); }} className="ml-auto rounded bg-rose-900/60 px-2 py-0.5 text-rose-200 hover:bg-rose-800/60">Delete selected</button>}
        </div>
      )}
    </div>
  );
}

function ModeButton({
  active, disabled, onClick, children,
}: {
  active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-3 py-1.5 font-medium transition ${
        active ? "bg-[var(--brass-2)] text-[var(--ink)]" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {children}
    </button>
  );
}
