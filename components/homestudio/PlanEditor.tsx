"use client";

import { toast } from "@/lib/homestudio/toast";

import { useEffect, useRef, useState } from "react";
import { useStudio } from "@/lib/homestudio/store";
import { resolveProduct } from "@/lib/homestudio/catalog";
import { SAMPLES } from "@/lib/homestudio/samples";
import { detectWalls } from "@/lib/homestudio/wallDetect";
import { detectFurniture } from "@/lib/homestudio/furnitureDetect";
import { detectOpenings } from "@/lib/homestudio/openingDetect";
import { cleanWalls } from "@/lib/homestudio/wallClean";
import { loadPlanFile } from "@/lib/homestudio/loadPlanFile";
import { scanToProject } from "@/lib/homestudio/importScan";
import MaterialsDock from "./MaterialsDock";
import { Point, Rect, wallThicknessMm, wallHeightOf } from "@/lib/homestudio/types";
import { materialDef } from "@/lib/homestudio/textures";

// thin vertical separator between toolbar groups
function Divider() {
  return <span className="mx-0.5 hidden h-5 w-px self-center bg-line sm:block" />;
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

// Resize an axis-aligned rect (floor zone — never rotated) by dragging `handle`
// to pointer P, keeping the opposite edge fixed.
function resizeAxisRect(orig: { x: number; y: number; w: number; h: number }, handle: HandleId, P: Point) {
  const MIN = 4;
  let left = orig.x, right = orig.x + orig.w, top = orig.y, bottom = orig.y + orig.h;
  if (handle.includes("w")) left = Math.min(P.x, right - MIN);
  if (handle.includes("e")) right = Math.max(P.x, left + MIN);
  if (handle.includes("n")) top = Math.min(P.y, bottom - MIN);
  if (handle.includes("s")) bottom = Math.max(P.y, top + MIN);
  return { x: left, y: top, w: right - left, h: bottom - top };
}

export default function PlanEditor() {
  const {
    planImage, imgW, imgH, mmPerPx, calibPoints, rects, selectedId, mode,
    walls, selectedWallId, autoWallsOn, detecting, userProducts, placingProductId,
    floorZones, selectedZoneId, addFloorZone, selectZone, updateFloorZone,
    loadPlan, loadSample, loadProject, setMode, addCalibPoint, setCalibPoints, updateCalibPoint, setScaleFromCalib, resetCalib, addRect, placeProduct, placeDetected, updateRect, deleteRect, select,
    cancelPlace, setRoomScan,
    addWall, selectWall, updateWall, splitWall, addOpening, updateOpening,
    setDetecting, setAutoWalls, clearAutoWalls,
  } = useStudio();

  const placingProduct = resolveProduct(placingProductId, userProducts);

  // door/window tool: which kind the next click drops, and an in-progress slide
  const [openingKind, setOpeningKind] = useState<"door" | "window">("door");
  const [openingDrag, setOpeningDrag] = useState<{ wallId: string; openingId: string } | null>(null);

  // Esc backs out of the transient tools: place → cancel, calibrate → clear the
  // points (pick again), others → Select.
  useEffect(() => {
    if (mode !== "place" && mode !== "opening" && mode !== "calibrate" && mode !== "measure") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mode === "place") cancelPlace();
      else if (mode === "calibrate") setCalibPoints([]);
      else if (mode === "measure") setMeasurePts([]);
      else setMode("select");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, cancelPlace, setMode, setCalibPoints]);

  function onRoomScanMesh(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.toLowerCase().split(".").pop();
    const format = ext === "obj" ? "obj" : "glb";
    const url = URL.createObjectURL(f);
    setRoomScan({ url, format, rotYdeg: 0, opacity: 1, scale: 1, yOffset: 0 });
    e.target.value = "";
  }

  async function onScanFile(e: React.ChangeEvent<HTMLInputElement>) {
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

  const [findingFurniture, setFindingFurniture] = useState(false);
  const [planMenu, setPlanMenu] = useState(false); // "Plan ▾" file menu

  // Free, offline furniture detector: read the plan's furniture symbols and drop
  // an empty (sized) slot at each one for the user to assign a product to.
  async function findFurniture() {
    if (!planImage || !mmPerPx) return;
    setFindingFurniture(true);
    try {
      const boxes = await detectFurniture(planImage, imgW, imgH, mmPerPx);
      if (!boxes.length) { toast.info("No furniture symbols found — add pieces from the catalog."); return; }
      placeDetected(boxes.map((b) => ({ x: b.x, y: b.y, w: b.w, h: b.h, productId: "" })));
      toast.success(`Found ${boxes.length} furniture spot${boxes.length === 1 ? "" : "s"} — assign a product to each (and delete any that look wrong).`);
    } catch (err) {
      console.error("furniture detection failed", err);
      toast.error("Couldn't read furniture from this plan — add pieces from the catalog.");
    } finally {
      setFindingFurniture(false);
    }
  }

  async function toggleAutoWalls() {
    if (autoWallsOn) { clearAutoWalls(); return; }
    if (!planImage || !mmPerPx) return;
    setDetecting(true);
    try {
      // First pass: thick-stroke isolation — reads real walls, ignores furniture &
      // text (great on real-world plans). If it finds too little (thin-walled clean
      // / CAD plans, where erosion is too aggressive), fall back to the plain reader.
      let segs = await detectWalls(planImage, imgW, imgH, { minLenK: 0.035 });
      if (segs.length < 6) {
        const raw = await detectWalls(planImage, imgW, imgH, { minLenK: 0.035, wallsOnly: false });
        if (raw.length > segs.length) segs = raw;
      }
      const cleaned = cleanWalls(segs, imgW, imgH, {}, mmPerPx ?? undefined);
      // auto doors & windows: scan the plan along each wall for breaks in the ink
      let nOpen = 0;
      try {
        const scanned = await detectOpenings(planImage, cleaned, imgW, imgH, mmPerPx);
        cleaned.forEach((w, i) => {
          const existing = w.openings ?? [];
          const adds = (scanned[i] ?? []).filter((o) => !existing.some((e) => Math.abs(e.pos - o.pos) < 0.08));
          w.openings = [...existing, ...adds];
          nOpen += w.openings.length;
        });
      } catch (e) { console.error("opening scan failed", e); }
      setAutoWalls(cleaned);
      if (!cleaned.length) toast.info("No clear walls found — draw them with the ✎ Walls tool.");
      else if (nOpen) toast.success(`Walls up · found ${nOpen} door${nOpen === 1 ? "" : "s"}/window${nOpen === 1 ? "" : "s"} — check & fix any in the 🚪 tool.`);
    } catch (err) {
      console.error("wall detection failed", err);
      setDetecting(false);
      toast.error("Couldn't detect walls automatically — draw them with the ✎ Walls tool.");
    }
  }

  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<{ start: Point; cur: Point } | null>(null);
  const [calibLen, setCalibLen] = useState("");
  const [calibUnit, setCalibUnit] = useState<"m" | "cm" | "mm">("m");
  const [showDims, setShowDims] = useState(true);
  const [calibDrag, setCalibDrag] = useState<number | null>(null);

  // --- 2D workspace upgrades ---------------------------------------------
  const [measurePts, setMeasurePts] = useState<Point[]>([]);          // tape tool
  const [showGrid, setShowGrid] = useState(false);                    // metre grid
  const [layers, setLayers] = useState({ walls: true, furniture: true, zones: true }); // 2D visibility
  const [planOpacity, setPlanOpacity] = useState(1);                  // dim the underlay
  const [layersOpen, setLayersOpen] = useState(false);
  const [multiSel, setMultiSel] = useState<string[]>([]);             // marquee selection (furniture)
  const [marquee, setMarquee] = useState<{ start: Point; cur: Point } | null>(null);
  const [guides, setGuides] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] }); // smart snap lines
  const [groupMove, setGroupMove] = useState<{ ids: string[]; origs: Record<string, Point>; start: Point } | null>(null);

  // --- fixed working area + zoom/pan -------------------------------------
  // Every plan is fit (contained) to the same stage, so a small image is scaled
  // UP to fill the space instead of rendering at its tiny native size. Zoom & pan
  // ride on top via a CSS transform (toPx still works — it reads the rendered box).
  const canvasRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 }); // stage size in screen px
  const [zoom, setZoom] = useState(1);            // 1 = fit
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [space, setSpace] = useState(false); // spacebar held → pan mode
  const panRef = useRef<{ x: number; y: number; tx0: number; ty0: number } | null>(null);

  const MIN_ZOOM = 0.2, MAX_ZOOM = 12;
  const fitScale = box.w && box.h && imgW && imgH ? Math.min(box.w / imgW, box.h / imgH) : 0;
  const baseW = imgW * fitScale, baseH = imgH * fitScale; // fit-to-stage box at zoom 1

  const fitView = () => { setZoom(1); setTx(0); setTy(0); };

  // measure the stage; refit whenever the plan or the stage size changes
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [planImage]);

  // a fresh plan starts fit & centred
  useEffect(() => { fitView(); }, [planImage]);

  // Space = temporary pan (grab) in any mode; ignore while typing in a field
  useEffect(() => {
    const typing = (t: EventTarget | null) =>
      t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && !typing(e.target)) { setSpace(true); e.preventDefault(); }
    };
    const up = (e: KeyboardEvent) => { if (e.code === "Space") setSpace(false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // wheel: trackpad two-finger = pan, pinch / ctrl+wheel = zoom toward the cursor
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!planImage) return;
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const rect = el.getBoundingClientRect();
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top - rect.height / 2;
        setZoom((z) => {
          const nz = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * (e.deltaY < 0 ? 1.0015 ** -e.deltaY : 1 / 1.0015 ** e.deltaY)));
          setTx((t) => mx - (mx - t) * (nz / z));
          setTy((t) => my - (my - t) * (nz / z));
          return nz;
        });
      } else {
        setTx((t) => t - e.deltaX);
        setTy((t) => t - e.deltaY);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [planImage]);

  const zoomBy = (factor: number) => {
    setZoom((z) => {
      const nz = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor));
      // zoom about the stage centre (mx=my=0) → translate stays put
      setTx((t) => t * (nz / z));
      setTy((t) => t * (nz / z));
      return nz;
    });
  };

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
    | { kind: "rotate"; id: string; center: Point }
    | null
  >(null);
  // live editing of a wall: drag an endpoint, or move the whole wall
  const [wallEdit, setWallEdit] = useState<
    { kind: "end"; id: string; end: "a" | "b" }
    | { kind: "move"; id: string; orig: { x1: number; y1: number; x2: number; y2: number }; start: Point }
    | null
  >(null);
  // live move/resize of a floor zone (axis-aligned)
  const [zoneEdit, setZoneEdit] = useState<
    { kind: "move"; id: string; orig: { x: number; y: number; w: number; h: number }; start: Point }
    | { kind: "resize"; id: string; handle: HandleId; orig: { x: number; y: number; w: number; h: number }; start: Point }
    | null
  >(null);

  // --- floor-zone snapping: click each edge onto the nearest wall line, else grid ---
  // candidate snap lines come from every wall endpoint (covers room corners well).
  function snapZoneRect(r: { x: number; y: number; w: number; h: number }) {
    const thr = Math.max(8, imgW * 0.02);
    const xs: number[] = [], ys: number[] = [];
    for (const w of walls) { xs.push(w.x1, w.x2); ys.push(w.y1, w.y2); }
    const g = mmPerPx ? 50 / mmPerPx : 0; // 50 mm grid fallback
    const snap1 = (v: number, cands: number[]) => {
      let best = thr, out = v;
      for (const c of cands) { const d = Math.abs(c - v); if (d < best) { best = d; out = c; } }
      if (best < thr) return out;
      return g > 0 ? Math.round(v / g) * g : v;
    };
    const left = snap1(r.x, xs), right = snap1(r.x + r.w, xs);
    const top = snap1(r.y, ys), bottom = snap1(r.y + r.h, ys);
    return {
      x: Math.min(left, right), y: Math.min(top, bottom),
      w: Math.max(4, Math.abs(right - left)), h: Math.max(4, Math.abs(bottom - top)),
    };
  }

  // door/window tool: the wall nearest a click, with the projected position (0..1)
  // along it — null when no wall is close enough.
  function nearestWallAt(p: Point): { wallId: string; pos: number } | null {
    let best: { wallId: string; pos: number; dist: number } | null = null;
    for (const w of walls) {
      const dx = w.x2 - w.x1, dy = w.y2 - w.y1;
      const len2 = dx * dx + dy * dy || 1;
      let t = ((p.x - w.x1) * dx + (p.y - w.y1) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(w.x1 + dx * t - p.x, w.y1 + dy * t - p.y);
      if (!best || d < best.dist) best = { wallId: w.id, pos: t, dist: d };
    }
    const thr = Math.max(16, imgW * 0.03);
    return best && best.dist <= thr ? { wallId: best.wallId, pos: best.pos } : null;
  }

  // ---- wall snapping: endpoint-snap → grid-snap, with an orthogonal lock ----
  function nearWallEndpoint(p: Point, excludeId?: string): Point | null {
    const R = Math.max(10, imgW * 0.013);
    let best = R, bp: Point | null = null;
    for (const w of walls) {
      if (w.id === excludeId) continue;
      for (const e of [{ x: w.x1, y: w.y1 }, { x: w.x2, y: w.y2 }]) {
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        if (d < best) { best = d; bp = e; }
      }
    }
    return bp;
  }
  function gridSnap(p: Point): Point {
    if (!mmPerPx) return p;
    const g = 50 / mmPerPx; // 50 mm grid
    return { x: Math.round(p.x / g) * g, y: Math.round(p.y / g) * g };
  }
  function orthoLock(from: Point, p: Point): Point {
    const dx = p.x - from.x, dy = p.y - from.y;
    if (Math.abs(dx) >= Math.abs(dy)) { if (Math.abs(dy) < Math.abs(dx) * 0.25) return { x: p.x, y: from.y }; }
    else { if (Math.abs(dx) < Math.abs(dy) * 0.25) return { x: from.x, y: p.y }; }
    return p;
  }
  // resolve a wall point: optional ortho lock to `from`, then endpoint-snap, then grid
  function wallPoint(p: Point, from?: Point, excludeId?: string): Point {
    const q = from ? orthoLock(from, p) : p;
    return nearWallEndpoint(q, excludeId) ?? gridSnap(q);
  }

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
      toast.error(err instanceof Error ? err.message : "Sorry — couldn't read that file. Try a PNG, JPG, PDF, DXF, or DWG floor plan.");
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

  // Smart move-snap: snap a moving rect's edges/centre to other pieces & wall
  // endpoints; returns the adjusted top-left + the guide lines that lit up.
  function snapMove(r: { x: number; y: number; w: number; h: number }, excludeIds: string[]) {
    const thr = Math.max(6, imgW * 0.012);
    const xs: number[] = [], ys: number[] = [];
    for (const o of rects) { if (excludeIds.includes(o.id)) continue; xs.push(o.x, o.x + o.w / 2, o.x + o.w); ys.push(o.y, o.y + o.h / 2, o.y + o.h); }
    for (const w of walls) { xs.push(w.x1, w.x2); ys.push(w.y1, w.y2); }
    let ox = 0, oy = 0, bestX = thr, bestY = thr;
    const gx: number[] = [], gy: number[] = [];
    for (const ex of [r.x, r.x + r.w / 2, r.x + r.w]) for (const c of xs) { const d = Math.abs(c - ex); if (d < bestX) { bestX = d; ox = c - ex; gx[0] = c; } }
    for (const ey of [r.y, r.y + r.h / 2, r.y + r.h]) for (const c of ys) { const d = Math.abs(c - ey); if (d < bestY) { bestY = d; oy = c - ey; gy[0] = c; } }
    return { x: r.x + ox, y: r.y + oy, gx: gx.length ? [gx[0]] : [], gy: gy.length ? [gy[0]] : [] };
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!planImage) return;
    // pan the view: middle-mouse, or spacebar held — works in every mode
    if (e.button === 1 || space) {
      e.preventDefault();
      (e.target as Element).setPointerCapture?.(e.pointerId);
      panRef.current = { x: e.clientX, y: e.clientY, tx0: tx, ty0: ty };
      return;
    }
    const p = toPx(e);
    if (mode === "place") {
      // drop the chosen catalog product centred on the click, at its true size
      if (placingProduct && mmPerPx) {
        placeProduct({
          w: placingProduct.dimensions_mm.w / mmPerPx,
          h: placingProduct.dimensions_mm.d / mmPerPx,
          productId: placingProduct.id,
          cx: p.x, cy: p.y,
        });
      }
    } else if (mode === "opening") {
      // drop a door/window onto the nearest wall at the clicked spot
      const hit = nearestWallAt(p);
      if (hit) addOpening(hit.wallId, openingKind, hit.pos);
      else if (walls.length === 0) toast.info("Raise walls first (② Walls → ⚡ Auto-walls), then click a wall to add a door or window.");
    } else if (mode === "calibrate") {
      // drop a point; if two already exist this starts a fresh pair (no dead-end)
      addCalibPoint(snap(p)); // handles manage their own drag
    } else if (mode === "measure") {
      // tape tool: two points → shows the real distance; a 3rd starts over
      setMeasurePts((pts) => (pts.length >= 2 ? [snap(p)] : [...pts, snap(p)]));
    } else if (mode === "draw" || mode === "wall" || mode === "floorzone") {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      const st = mode === "wall" ? wallPoint(p) : p;
      setDrag({ start: st, cur: st });
    } else if (mode === "select") {
      // clicking empty space starts a marquee (drag to select several pieces)
      if (e.target === svgRef.current) {
        setMultiSel([]); select(null); selectWall(null); selectZone(null);
        (e.target as Element).setPointerCapture?.(e.pointerId);
        setMarquee({ start: p, cur: p });
      }
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (panRef.current) {
      setTx(panRef.current.tx0 + (e.clientX - panRef.current.x));
      setTy(panRef.current.ty0 + (e.clientY - panRef.current.y));
      return;
    }
    if (calibDrag !== null) { updateCalibPoint(calibDrag, snap(toPx(e))); return; }
    if (openingDrag) {
      // slide the opening along its wall (project the pointer onto the wall line)
      const w = walls.find((x) => x.id === openingDrag.wallId);
      if (w) {
        const P = toPx(e);
        const dx = w.x2 - w.x1, dy = w.y2 - w.y1;
        const len2 = dx * dx + dy * dy || 1;
        const t = Math.max(0, Math.min(1, ((P.x - w.x1) * dx + (P.y - w.y1) * dy) / len2));
        updateOpening(w.id, openingDrag.openingId, { pos: t });
      }
      return;
    }
    if (wallEdit) {
      const P = toPx(e);
      const w = walls.find((x) => x.id === wallEdit.id);
      if (!w) return;
      if (wallEdit.kind === "end") {
        const other = wallEdit.end === "a" ? { x: w.x2, y: w.y2 } : { x: w.x1, y: w.y1 };
        const q = wallPoint(P, other, w.id);
        if (Math.hypot(q.x - other.x, q.y - other.y) < 8) return; // don't collapse the wall to zero length
        updateWall(w.id, wallEdit.end === "a" ? { x1: q.x, y1: q.y } : { x2: q.x, y2: q.y });
      } else {
        const dx = P.x - wallEdit.start.x, dy = P.y - wallEdit.start.y, o = wallEdit.orig;
        updateWall(wallEdit.id, { x1: o.x1 + dx, y1: o.y1 + dy, x2: o.x2 + dx, y2: o.y2 + dy });
      }
      return;
    }
    if (marquee) { setMarquee({ ...marquee, cur: toPx(e) }); return; }
    if (groupMove) {
      const P = toPx(e);
      const dx = P.x - groupMove.start.x, dy = P.y - groupMove.start.y;
      for (const id of groupMove.ids) { const o = groupMove.origs[id]; if (o) updateRect(id, { x: o.x + dx, y: o.y + dy }); }
      return;
    }
    if (edit) {
      const P = toPx(e);
      if (edit.kind === "move") {
        const nx = edit.orig.x + (P.x - edit.start.x), ny = edit.orig.y + (P.y - edit.start.y);
        const s = snapMove({ x: nx, y: ny, w: edit.orig.w, h: edit.orig.h }, [edit.id]);
        updateRect(edit.id, { x: s.x, y: s.y });
        setGuides({ x: s.gx, y: s.gy });
      } else if (edit.kind === "resize") {
        updateRect(edit.id, resizeRect(edit.orig, edit.handle, P));
      } else if (edit.kind === "rotate") {
        let deg = Math.atan2(P.y - edit.center.y, P.x - edit.center.x) * 180 / Math.PI + 90;
        if (e.shiftKey) deg = Math.round(deg / 15) * 15;
        updateRect(edit.id, { rotationDeg: deg });
      }
      return;
    }
    if (zoneEdit) {
      const P = toPx(e);
      if (zoneEdit.kind === "move") {
        updateFloorZone(zoneEdit.id, { x: zoneEdit.orig.x + (P.x - zoneEdit.start.x), y: zoneEdit.orig.y + (P.y - zoneEdit.start.y) });
      } else {
        updateFloorZone(zoneEdit.id, resizeAxisRect(zoneEdit.orig, zoneEdit.handle, P));
      }
      return;
    }
    if (mode === "wall" && drag) { setDrag({ ...drag, cur: wallPoint(toPx(e), drag.start) }); return; }
    if ((mode === "draw" || mode === "floorzone") && drag) setDrag({ ...drag, cur: toPx(e) });
  }

  function onPointerUp() {
    if (panRef.current) { panRef.current = null; return; }
    if (calibDrag !== null) { setCalibDrag(null); return; }
    if (marquee) {
      const x0 = Math.min(marquee.start.x, marquee.cur.x), x1 = Math.max(marquee.start.x, marquee.cur.x);
      const y0 = Math.min(marquee.start.y, marquee.cur.y), y1 = Math.max(marquee.start.y, marquee.cur.y);
      if (x1 - x0 > 4 && y1 - y0 > 4) {
        const ids = rects.filter((r) => r.x + r.w > x0 && r.x < x1 && r.y + r.h > y0 && r.y < y1).map((r) => r.id);
        if (ids.length === 1) select(ids[0]);
        else setMultiSel(ids);
      }
      setMarquee(null);
      return;
    }
    if (groupMove) { setGroupMove(null); return; }
    if (openingDrag) { setOpeningDrag(null); return; }
    if (wallEdit) { setWallEdit(null); return; }
    if (edit) { setEdit(null); setGuides({ x: [], y: [] }); return; }
    if (zoneEdit) {
      // commit: snap the moved/resized zone to nearby walls (or grid)
      const z = floorZones.find((x) => x.id === zoneEdit.id);
      if (z) updateFloorZone(z.id, snapZoneRect(z));
      setZoneEdit(null);
      return;
    }
    if (!drag) return;
    if (mode === "draw") {
      const x = Math.min(drag.start.x, drag.cur.x);
      const y = Math.min(drag.start.y, drag.cur.y);
      const w = Math.abs(drag.cur.x - drag.start.x);
      const h = Math.abs(drag.cur.y - drag.start.y);
      if (w > 5 && h > 5) addRect({ x, y, w, h });
    } else if (mode === "wall") {
      const len = Math.hypot(drag.cur.x - drag.start.x, drag.cur.y - drag.start.y);
      if (len > 8) addWall({ x1: drag.start.x, y1: drag.start.y, x2: drag.cur.x, y2: drag.cur.y });
    } else if (mode === "floorzone") {
      const x = Math.min(drag.start.x, drag.cur.x);
      const y = Math.min(drag.start.y, drag.cur.y);
      const w = Math.abs(drag.cur.x - drag.start.x);
      const h = Math.abs(drag.cur.y - drag.start.y);
      if (w > 5 && h > 5) addFloorZone(snapZoneRect({ x, y, w, h })); // snap to the room walls
    }
    setDrag(null);
  }

  const [a, b] = calibPoints;
  const calibDistPx = a && b ? Math.hypot(b.x - a.x, b.y - a.y) : 0;
  const activeCalib = calibDrag !== null ? calibPoints[calibDrag] ?? null : null;
  // live calibration preview from the typed length + unit
  const calibUnitMm = calibUnit === "m" ? 1000 : calibUnit === "cm" ? 10 : 1;
  const calibRealMm = parseFloat(calibLen) * calibUnitMm;
  const calibPreviewMmPerPx = calibRealMm > 0 && calibDistPx > 0 ? calibRealMm / calibDistPx : null;

  // measure (tape) tool: real distance between the two dropped points
  const [ma, mb] = measurePts;
  const measureMm = ma && mb && mmPerPx ? Math.hypot(mb.x - ma.x, mb.y - ma.y) * mmPerPx : null;

  // sizing helper: real-world mm of a rect dimension
  const mm = (px: number) => (mmPerPx ? Math.round(px * mmPerPx) : null);
  // real-world size in metres (2 decimals) — the plan/scan is calibrated so this
  // is the true physical size (a scanned 2.15 m wall reads "2.15 m")
  const meters = (px: number) => (mmPerPx ? (px * mmPerPx / 1000).toFixed(2) : null);

  // next-step guide: a step is "done" once its result exists
  const hasFurniture = rects.some((r) => r.productId);

  // align the multi-selected pieces along a shared edge / centre
  function alignSelection(how: "left" | "right" | "cx" | "top" | "bottom" | "cy") {
    const sel = rects.filter((r) => multiSel.includes(r.id));
    if (sel.length < 2) return;
    const minX = Math.min(...sel.map((r) => r.x)), maxR = Math.max(...sel.map((r) => r.x + r.w));
    const minY = Math.min(...sel.map((r) => r.y)), maxB = Math.max(...sel.map((r) => r.y + r.h));
    for (const r of sel) {
      if (how === "left") updateRect(r.id, { x: minX });
      else if (how === "right") updateRect(r.id, { x: maxR - r.w });
      else if (how === "cx") updateRect(r.id, { x: (minX + maxR) / 2 - r.w / 2 });
      else if (how === "top") updateRect(r.id, { y: minY });
      else if (how === "bottom") updateRect(r.id, { y: maxB - r.h });
      else if (how === "cy") updateRect(r.id, { y: (minY + maxB) / 2 - r.h / 2 });
    }
  }

  // Arrow keys nudge the selection (⇧ = bigger step); Del removes a multi-selection.
  useEffect(() => {
    const typing = (t: EventTarget | null) => t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    const onKey = (e: KeyboardEvent) => {
      if (mode !== "select" || typing(e.target)) return;
      if ((e.key === "Delete" || e.key === "Backspace") && multiSel.length) {
        e.preventDefault(); multiSel.forEach((id) => deleteRect(id)); setMultiSel([]); return;
      }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
      const step = mmPerPx ? (e.shiftKey ? 100 : 10) / mmPerPx : (e.shiftKey ? 10 : 2);
      const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
      const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
      if (multiSel.length) { e.preventDefault(); multiSel.forEach((id) => { const r = rects.find((x) => x.id === id); if (r) updateRect(id, { x: r.x + dx, y: r.y + dy }); }); return; }
      if (selectedId) { e.preventDefault(); const r = rects.find((x) => x.id === selectedId); if (r) updateRect(selectedId, { x: r.x + dx, y: r.y + dy }); return; }
      if (selectedZoneId) { e.preventDefault(); const z = floorZones.find((x) => x.id === selectedZoneId); if (z) updateFloorZone(selectedZoneId, { x: z.x + dx, y: z.y + dy }); return; }
      if (selectedWallId) { e.preventDefault(); const w = walls.find((x) => x.id === selectedWallId); if (w) updateWall(selectedWallId, { x1: w.x1 + dx, y1: w.y1 + dy, x2: w.x2 + dx, y2: w.y2 + dy }); return; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, mmPerPx, multiSel, selectedId, selectedZoneId, selectedWallId, rects, floorZones, walls, updateRect, updateFloorZone, updateWall, deleteRect]);

  return (
    <div className="flex h-full flex-col">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-panel p-3 text-sm">
        {/* Plan menu — all the ways to bring a plan or scan in */}
        <div className="relative">
          <button
            onClick={() => { setPlanMenu((o) => !o); }}
            className="flex items-center gap-1.5 rounded bg-ink px-3 py-1.5 font-medium text-paper transition hover:opacity-90"
          >
            <span>📂</span> {loadingFile ? "Loading…" : planImage ? "Plan" : "Open a plan"} <span className="text-paper/70">▾</span>
          </button>
          {planMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setPlanMenu(false)} />
              <div className="absolute left-0 z-30 mt-1.5 w-64 rounded-lg border border-line bg-panel p-1.5 shadow-2xl">
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded px-2.5 py-2 hover:bg-clay-50">
                  <span className="font-medium text-ink">{planImage ? "Replace plan…" : "Upload plan…"}</span>
                  <span className="text-xs text-faint">image · PDF · DXF · DWG</span>
                  <input type="file" accept="image/*,application/pdf,.pdf,.dxf,.dwg,.png,.jpg,.jpeg,.webp,.svg,.gif,.bmp" className="hidden"
                    onChange={(e) => { setPlanMenu(false); onFile(e); }} />
                </label>
                <div className="my-1 border-t border-line" />
                <div className="px-2.5 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-faint">Sample plans</div>
                {SAMPLES.map((sm) => (
                  <button key={sm.id}
                    onClick={() => { setPlanMenu(false); loadSample(sm.src, sm.imgW, sm.imgH, sm.mmPerPx); }}
                    className="flex w-full items-center rounded px-2.5 py-1.5 text-left font-medium text-ink hover:bg-clay-50">
                    {sm.name}
                  </button>
                ))}
                <div className="my-1 border-t border-line" />
                <div className="px-2.5 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-faint">Real space</div>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded px-2.5 py-2 hover:bg-clay-50" title="LiDAR room scan (.json) from the Puffer Scan iOS app">
                  <span className="font-medium text-ink">📷 Import scan</span>
                  <span className="text-xs text-faint">.json</span>
                  <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { setPlanMenu(false); onScanFile(e); }} />
                </label>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded px-2.5 py-2 hover:bg-clay-50" title="3D room-scan mesh from a free LiDAR scanner app — view the real space live in 3D">
                  <span className="font-medium text-ink">🧊 Room scan (3D)</span>
                  <span className="text-xs text-faint">.obj · .glb</span>
                  <input type="file" accept=".obj,.glb,.gltf,model/gltf-binary" className="hidden" onChange={(e) => { setPlanMenu(false); onRoomScanMesh(e); }} />
                </label>
              </div>
            </>
          )}
        </div>

        {planImage && (
          <>
            <Divider />

            {/* workflow steps — one clear path; each lights up as it's done */}
            <ModeButton active={mode === "calibrate"} onClick={() => setMode("calibrate")} done={!!mmPerPx} next={!mmPerPx}
              title="Set the plan's real-world scale (click two points, type the distance)">
              ① Calibrate
            </ModeButton>
            <ModeButton active={mode === "wall"} onClick={() => setMode("wall")} disabled={!mmPerPx} done={walls.length > 0} next={!!mmPerPx && walls.length === 0}
              title={mmPerPx ? "Draw & edit walls — click-drag to add, drag endpoints to fix, snaps to grid & corners" : "Calibrate the plan first"}>
              ② Walls
            </ModeButton>
            <ModeButton active={mode === "opening"} onClick={() => setMode("opening")} disabled={!mmPerPx || walls.length === 0}
              title={walls.length === 0 ? "Raise walls first" : "Doors & Windows — click a wall to drop one, then drag it to slide"}>
              🚪 Doors &amp; Win
            </ModeButton>
            <ModeButton active={mode === "draw"} onClick={() => setMode("draw")} disabled={!mmPerPx} done={hasFurniture} next={!!mmPerPx && walls.length > 0 && !hasFurniture}
              title={mmPerPx ? "Draw a furniture slot on the plan, then assign a product to it" : "Calibrate the plan first"}>
              ③ Furnish
            </ModeButton>
            <ModeButton active={mode === "select"} onClick={() => setMode("select")}
              title="Select, move, resize & rotate anything on the plan">
              Select
            </ModeButton>
            <ModeButton active={mode === "measure"} onClick={() => setMode("measure")} disabled={!mmPerPx}
              title={mmPerPx ? "Measure — click two points to read the real distance" : "Calibrate the plan first"}>
              📏 Measure
            </ModeButton>

            <Divider />

            <button
              onClick={() => setShowGrid((v) => !v)}
              title="Show a 1-metre reference grid (labelled in metres)"
              className={`rounded px-3 py-1.5 font-medium transition ${
                showGrid ? "bg-clay text-clay-ink" : "bg-raised border border-line text-ink hover:bg-clay-50"
              }`}
            >
              ▦ Grid
            </button>

            <div className="relative">
              <button
                onClick={() => setLayersOpen((o) => !o)}
                title="Show / hide layers and dim the plan underlay"
                className="rounded bg-raised border border-line px-3 py-1.5 font-medium text-ink transition hover:bg-clay-50"
              >
                Layers ▾
              </button>
              {layersOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setLayersOpen(false)} />
                  <div className="absolute left-0 z-30 mt-1.5 w-56 space-y-1.5 rounded-lg border border-line bg-panel p-2.5 shadow-2xl">
                    {([
                      ["Walls", layers.walls, () => setLayers((l) => ({ ...l, walls: !l.walls }))],
                      ["Furniture", layers.furniture, () => setLayers((l) => ({ ...l, furniture: !l.furniture }))],
                      ["Floor zones", layers.zones, () => setLayers((l) => ({ ...l, zones: !l.zones }))],
                      ["Dimensions", showDims, () => setShowDims((v) => !v)],
                    ] as const).map(([label, on, toggle]) => (
                      <label key={label} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm text-ink hover:bg-clay-50">
                        <input type="checkbox" checked={on} onChange={toggle} className="accent-clay" />
                        {label}
                      </label>
                    ))}
                    <div className="border-t border-line pt-2">
                      <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wide text-faint">
                        <span>Plan underlay</span><span className="font-mono">{Math.round(planOpacity * 100)}%</span>
                      </div>
                      <input type="range" min={0} max={1} step={0.05} value={planOpacity}
                        onChange={(e) => setPlanOpacity(parseFloat(e.target.value))} className="w-full accent-clay" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <span className="ml-auto rounded border border-line bg-raised px-2 py-1 text-xs font-mono text-muted">
              {mmPerPx
                ? `${mmPerPx.toFixed(2)} mm/px · ${(imgW * mmPerPx / 1000).toFixed(1)} × ${(imgH * mmPerPx / 1000).toFixed(1)} m`
                : "not calibrated"}
            </span>
          </>
        )}
      </div>

      {/* calibration helper bar */}
      {planImage && mode === "calibrate" && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-clay-50 px-3 py-2 text-xs text-ink">
          {calibPoints.length < 2 ? (
            <>
              <span className="text-muted">
                Click the two ends of something you know the real size of — a wall, or the whole width. (Drag a point to nudge it; a magnifier appears.)
              </span>
            </>
          ) : (
            <>
              <span>Real length of this line:</span>
              <input
                type="number"
                value={calibLen}
                onChange={(e) => setCalibLen(e.target.value)}
                placeholder="length"
                autoFocus
                className="w-24 rounded bg-raised border border-line px-2 py-1 text-ink"
              />
              <select
                value={calibUnit}
                onChange={(e) => setCalibUnit(e.target.value as "m" | "cm" | "mm")}
                className="rounded bg-raised border border-line px-2 py-1 text-ink"
              >
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="mm">mm</option>
              </select>
              <button
                disabled={!(calibRealMm > 0) || calibDistPx < 1}
                title={calibDistPx < 1 ? "Pick two points further apart first" : undefined}
                className={`rounded bg-clay px-3 py-1 font-medium text-clay-ink hover:opacity-90 ${!(calibRealMm > 0) || calibDistPx < 1 ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => {
                  if (calibRealMm > 0 && calibDistPx >= 1) { setScaleFromCalib(calibRealMm); setCalibLen(""); }
                }}
              >
                Set scale
              </button>
              {calibPreviewMmPerPx && (
                <span className="font-mono text-muted">
                  → room becomes {(imgW * calibPreviewMmPerPx / 1000).toFixed(1)} × {(imgH * calibPreviewMmPerPx / 1000).toFixed(1)} m
                </span>
              )}
            </>
          )}

          {/* always-available escape hatches — no more dead-ends */}
          <div className="ml-auto flex items-center gap-2">
            {calibPoints.length > 0 && (
              <button
                onClick={() => { setCalibPoints([]); setCalibLen(""); }}
                title="Clear the points and pick again"
                className="rounded border border-line bg-panel px-2.5 py-1 font-medium text-ink transition hover:bg-clay-50"
              >↺ Start over</button>
            )}
            {mmPerPx && (
              <button
                onClick={() => { resetCalib(); setCalibLen(""); }}
                title="Forget the current scale and measure it again"
                className="rounded border border-line bg-panel px-2.5 py-1 font-medium text-ink transition hover:bg-clay-50"
              >Recalibrate</button>
            )}
            <button
              onClick={() => setMode("select")}
              title="Leave calibration"
              className="rounded border border-line bg-panel px-2.5 py-1 font-medium text-ink transition hover:bg-clay-50"
            >✕ Done</button>
          </div>
        </div>
      )}

      {/* measure (tape) tool bar */}
      {planImage && mode === "measure" && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-clay-50 px-3 py-2 text-xs text-ink">
          <span className="font-medium">📏 Measure —</span>
          <span className="text-muted">click two points to read the real distance between them.</span>
          {measureMm != null && (
            <span className="rounded bg-panel px-2 py-1 font-mono text-ink">
              {measureMm >= 1000 ? `${(measureMm / 1000).toFixed(2)} m` : `${Math.round(measureMm)} mm`}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            {measurePts.length > 0 && (
              <button onClick={() => setMeasurePts([])} className="rounded border border-line bg-panel px-2.5 py-1 font-medium hover:bg-clay-50">↺ Clear</button>
            )}
            <button onClick={() => { setMeasurePts([]); setMode("select"); }} className="rounded border border-line bg-panel px-2.5 py-1 font-medium hover:bg-clay-50">✕ Done</button>
          </div>
        </div>
      )}

      {/* multi-select bar: align the picked pieces */}
      {planImage && mode === "select" && multiSel.length >= 2 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-clay-50 px-3 py-2 text-xs text-ink">
          <span className="font-medium">{multiSel.length} selected —</span>
          {([
            ["⬅ Left", "left"], ["Center ⋮", "cx"], ["Right ➡", "right"],
            ["⬆ Top", "top"], ["Middle ⋯", "cy"], ["Bottom ⬇", "bottom"],
          ] as const).map(([label, how]) => (
            <button key={how} onClick={() => alignSelection(how)}
              className="rounded border border-line bg-panel px-2 py-1 font-medium hover:bg-clay-50">{label}</button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => { multiSel.forEach((id) => deleteRect(id)); setMultiSel([]); }}
              className="rounded border border-line bg-panel px-2.5 py-1 font-medium text-red-300 hover:bg-red-500/10">🗑 Delete</button>
            <button onClick={() => setMultiSel([])} className="rounded border border-line bg-panel px-2.5 py-1 font-medium hover:bg-clay-50">✕ Done</button>
          </div>
        </div>
      )}

      {/* mode instruction bar — tells you what to do + a clear ✓ Done way out */}
      {planImage && mmPerPx && (mode === "draw" || mode === "wall" || mode === "floorzone" || mode === "opening") && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-clay-50 px-3 py-1.5 text-xs text-ink">
          {mode === "opening" ? (
            <>
              <span className="font-medium text-ink">Doors &amp; Windows —</span>
              <button onClick={() => setOpeningKind("door")}
                className={`rounded px-2.5 py-1 font-medium transition ${openingKind === "door" ? "bg-clay text-clay-ink" : "bg-panel border border-line text-ink hover:bg-clay-50"}`}>
                🚪 Door
              </button>
              <button onClick={() => setOpeningKind("window")}
                className={`rounded px-2.5 py-1 font-medium transition ${openingKind === "window" ? "bg-clay text-clay-ink" : "bg-panel border border-line text-ink hover:bg-clay-50"}`}>
                🪟 Window
              </button>
              <span className="text-muted">click a wall to place it · drag it to slide</span>
            </>
          ) : (
            <>
              <span className="text-muted">
                {mode === "draw" && "Drag a box to make a furniture slot, then pick a product for it."}
                {mode === "wall" && "Click-drag to draw a wall, or let it find them for you →"}
                {mode === "floorzone" && "Drag a box over a room to paint its floor — it snaps to the walls."}
              </span>
              {mode === "wall" && (
                <button
                  onClick={toggleAutoWalls}
                  disabled={detecting}
                  title="Detect the walls from the plan image and raise them automatically"
                  className={`rounded px-2.5 py-1 font-medium transition ${autoWallsOn ? "bg-clay text-clay-ink" : "bg-panel border border-line text-ink hover:bg-clay-50"} ${detecting ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  {detecting ? "Detecting…" : autoWallsOn ? "⚡ Walls raised ✓ — turn off" : "⚡ Auto-walls"}
                </button>
              )}
              {mode === "draw" && (
                <button
                  onClick={findFurniture}
                  disabled={findingFurniture}
                  title="Find furniture from the plan's symbols and drop empty slots — free & offline. Rough: assign a product to each, delete any wrong ones."
                  className={`rounded px-2.5 py-1 font-medium transition ${findingFurniture ? "cursor-not-allowed opacity-60 bg-panel border border-line text-ink" : "bg-clay text-clay-ink hover:opacity-90"}`}
                >
                  {findingFurniture ? "Reading plan…" : "🪑 Find furniture"}
                </button>
              )}
            </>
          )}
          <button onClick={() => setMode("select")}
            className="ml-auto rounded border border-line bg-panel px-2.5 py-1 font-medium text-ink transition hover:bg-clay-50">
            ✓ Done
          </button>
        </div>
      )}

      {/* body: the 2D plan (left two-thirds, fixed) sits beside the
          floors/materials options (right third) */}
      <div className="flex min-h-0 flex-1">
      {/* canvas — a fixed working area; every plan is fit to it, then zoom/pan */}
      <div ref={canvasRef} className="relative min-h-0 flex-[2] overflow-hidden bg-paper paper-grain">
        {!planImage ? (
          <div className="flex h-full items-center justify-center text-center text-faint">
            <div>
              <p className="text-lg">No 2D plan loaded.</p>
              <p className="mt-1 text-sm">You&apos;re working from a 3D scan. Use <span className="font-medium text-muted">Upload plan</span> above to also furnish in 2D.</p>
            </div>
          </div>
        ) : (
          <>
          <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative"
            style={{
              transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
              transformOrigin: "center center",
              ...(baseW > 0 && baseH > 0
                ? { width: baseW, height: baseH }
                : { width: imgW, maxWidth: "100%", aspectRatio: `${imgW} / ${imgH}` }),
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={planImage} alt="floor plan" className="absolute inset-0 h-full w-full select-none" draggable={false} style={{ opacity: planOpacity }} />
            <svg
              ref={svgRef}
              viewBox={`0 0 ${imgW} ${imgH}`}
              className="absolute inset-0 h-full w-full"
              style={{ cursor: space ? "grab" : mode === "draw" || mode === "wall" || mode === "place" || mode === "floorzone" || mode === "opening" || mode === "measure" ? "crosshair" : "default", touchAction: "none" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              {/* 1-metre reference grid, labelled in metres (doubles as a ruler) */}
              {showGrid && mmPerPx && (() => {
                const g = 1000 / mmPerPx;
                const nx = Math.min(200, Math.floor(imgW / g)), ny = Math.min(200, Math.floor(imgH / g));
                const sw = Math.max(0.5, imgW / 1600), fs = Math.max(9, imgW / 95);
                const els: React.ReactNode[] = [];
                for (let i = 1; i <= nx; i++) els.push(<line key={`gx${i}`} x1={i * g} y1={0} x2={i * g} y2={imgH} stroke="#38bdf8" strokeOpacity={0.25} strokeWidth={sw} />);
                for (let i = 1; i <= ny; i++) els.push(<line key={`gy${i}`} x1={0} y1={i * g} x2={imgW} y2={i * g} stroke="#38bdf8" strokeOpacity={0.25} strokeWidth={sw} />);
                for (let i = 1; i <= nx; i++) els.push(<text key={`tx${i}`} x={i * g + 2} y={fs + 1} fontSize={fs} fill="#38bdf8" fillOpacity={0.75}>{i}m</text>);
                for (let i = 1; i <= ny; i++) els.push(<text key={`ty${i}`} x={2} y={i * g - 2} fontSize={fs} fill="#38bdf8" fillOpacity={0.75}>{i}m</text>);
                return <g style={{ pointerEvents: "none" }}>{els}</g>;
              })()}

              {/* per-room floor zones (drawn beneath walls & slots) */}
              {layers.zones && floorZones.map((z) => {
                const sel = z.id === selectedZoneId;
                const def = materialDef(z.matId);
                const hs = Math.max(7, imgW / 90); // handle size
                const zhx = (id: HandleId) => id.includes("w") ? z.x : id.includes("e") ? z.x + z.w : z.x + z.w / 2;
                const zhy = (id: HandleId) => id.includes("n") ? z.y : id.includes("s") ? z.y + z.h : z.y + z.h / 2;
                const cursorFor: Record<HandleId, string> = {
                  nw: "nwse-resize", se: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize",
                  n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize",
                };
                return (
                  <g key={z.id}>
                    <rect
                      x={z.x} y={z.y} width={z.w} height={z.h}
                      fill={def?.base ?? "#999999"} fillOpacity={sel ? 0.55 : 0.32}
                      stroke={sel ? "#a85638" : "#5b4636"} strokeWidth={Math.max(2, imgW / 240)}
                      strokeDasharray={sel ? undefined : "6 4"}
                      style={{ cursor: mode === "select" ? (sel ? "move" : "pointer") : "inherit", pointerEvents: mode === "select" ? "all" : "none" }}
                      onPointerDown={(e) => {
                        if (mode !== "select") return;
                        e.stopPropagation();
                        selectZone(z.id);
                        svgRef.current?.setPointerCapture(e.pointerId);
                        setZoneEdit({ kind: "move", id: z.id, orig: { x: z.x, y: z.y, w: z.w, h: z.h }, start: toPx(e) });
                      }}
                    />
                    <text x={z.x + 6} y={z.y + Math.max(14, imgW / 70)} fontSize={Math.max(10, imgW / 55)} fill="#3b2a1f" style={{ pointerEvents: "none" }}>
                      {def?.name ?? "Floor"}
                    </text>
                    {/* resize handles on the selected zone */}
                    {sel && mode === "select" && HANDLES.map((id) => (
                      <rect
                        key={id}
                        x={zhx(id) - hs / 2} y={zhy(id) - hs / 2} width={hs} height={hs}
                        fill="#a85638" stroke="#fff" strokeWidth={Math.max(1, imgW / 600)}
                        style={{ cursor: cursorFor[id] }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          selectZone(z.id);
                          svgRef.current?.setPointerCapture(e.pointerId);
                          setZoneEdit({ kind: "resize", id: z.id, handle: id, orig: { x: z.x, y: z.y, w: z.w, h: z.h }, start: toPx(e) });
                        }}
                      />
                    ))}
                  </g>
                );
              })}
              {/* committed walls (drawn under furniture) */}
              {layers.walls && walls.map((w) => {
                const selected = w.id === selectedWallId;
                const color = selected ? "#a85638"
                  : w.height === "none" ? "#94a3b8"
                  : w.kind === "exterior" ? "#334155" : "#64748b";
                const thickPx = mmPerPx ? Math.max(3, wallThicknessMm(w) / mmPerPx) : Math.max(3, imgW / 180);
                const hr = Math.max(7, imgW / 90); // endpoint handle radius
                const lenPx = Math.hypot(w.x2 - w.x1, w.y2 - w.y1) || 1;
                const ux = (w.x2 - w.x1) / lenPx, uy = (w.y2 - w.y1) / lenPx;
                return (
                  <g key={w.id}>
                    {/* wide invisible hit area: select, or (when already selected) move the wall */}
                    <line
                      x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2}
                      stroke="transparent" strokeWidth={Math.max(14, imgW / 50)} strokeLinecap="butt"
                      style={{ cursor: mode === "select" ? (selected ? "move" : "pointer") : "inherit", pointerEvents: mode === "select" ? "stroke" : "none" }}
                      onPointerDown={(e) => {
                        if (mode !== "select") return;
                        e.stopPropagation();
                        if (selected) {
                          svgRef.current?.setPointerCapture(e.pointerId);
                          setWallEdit({ kind: "move", id: w.id, orig: { x1: w.x1, y1: w.y1, x2: w.x2, y2: w.y2 }, start: toPx(e) });
                        } else selectWall(w.id);
                      }}
                    />
                    <line
                      x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2}
                      stroke={color} strokeWidth={thickPx} strokeLinecap="butt"
                      strokeDasharray={w.height === "none" ? "8 6" : undefined}
                      style={{ pointerEvents: "none" }}
                    />
                    {/* door / window markers (only when the wall has height to cut) */}
                    {mmPerPx && wallHeightOf(w) > 0 && (w.openings ?? []).map((o) => {
                      const cxp = w.x1 + (w.x2 - w.x1) * o.pos, cyp = w.y1 + (w.y2 - w.y1) * o.pos;
                      const half = (o.widthMm / mmPerPx) / 2;
                      return (
                        <line
                          key={o.id}
                          x1={cxp - ux * half} y1={cyp - uy * half} x2={cxp + ux * half} y2={cyp + uy * half}
                          stroke={o.kind === "door" ? "#f59e0b" : "#38bdf8"} strokeWidth={Math.max(3, thickPx * 0.8)} strokeLinecap="butt"
                          strokeDasharray={o.kind === "window" ? "5 3" : undefined}
                          style={{ pointerEvents: "none" }}
                        />
                      );
                    })}
                    {/* draggable endpoint handles */}
                    {selected && mode === "select" && ([["a", w.x1, w.y1], ["b", w.x2, w.y2]] as const).map(([end, hx, hy]) => (
                      <circle
                        key={end} cx={hx} cy={hy} r={hr}
                        fill="#a85638" stroke="#fff" strokeWidth={Math.max(1.5, imgW / 500)}
                        style={{ cursor: "grab" }}
                        onPointerDown={(e) => { e.stopPropagation(); svgRef.current?.setPointerCapture(e.pointerId); setWallEdit({ kind: "end", id: w.id, end }); }}
                      />
                    ))}
                    {mmPerPx && layers.walls && (
                      <text
                        x={(w.x1 + w.x2) / 2 + uy * Math.max(10, imgW / 70)}
                        y={(w.y1 + w.y2) / 2 - ux * Math.max(10, imgW / 70)}
                        fill={selected ? "#fde68a" : "#bae6fd"} fontSize={Math.max(11, imgW / 62)}
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

              {/* door/window slide-handles — only in the Doors & Windows tool */}
              {mode === "opening" && mmPerPx && walls.flatMap((w) => {
                const r = Math.max(8, imgW / 80);
                return (w.openings ?? []).map((o) => {
                  const cx = w.x1 + (w.x2 - w.x1) * o.pos, cy = w.y1 + (w.y2 - w.y1) * o.pos;
                  return (
                    <circle
                      key={o.id} cx={cx} cy={cy} r={r}
                      fill={o.kind === "door" ? "#f59e0b44" : "#38bdf844"}
                      stroke={o.kind === "door" ? "#f59e0b" : "#38bdf8"} strokeWidth={Math.max(2, imgW / 320)}
                      style={{ cursor: "grab" }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        svgRef.current?.setPointerCapture(e.pointerId);
                        setOpeningDrag({ wallId: w.id, openingId: o.id });
                      }}
                    />
                  );
                });
              })}

              {/* committed rectangles */}
              {layers.furniture && rects.map((r) => {
                const product = resolveProduct(r.productId, userProducts);
                const selected = r.id === selectedId;
                const multi = multiSel.includes(r.id);
                const cx = r.x + r.w / 2;
                const cy = r.y + r.h / 2;
                // does the product's true footprint fit the drawn slot?
                let oversize = false;
                if (product && mmPerPx) {
                  const slotW = r.w * mmPerPx, slotD = r.h * mmPerPx;
                  oversize = product.dimensions_mm.w > slotW + 1 || product.dimensions_mm.d > slotD + 1;
                }
                const stroke = selected || multi ? "#a85638" : oversize ? "#ef4444" : product ? "#22c55e" : "#a3a3a3";
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
                        svgRef.current?.setPointerCapture(e.pointerId);
                        if (multiSel.includes(r.id) && multiSel.length > 1) {
                          const origs: Record<string, Point> = {};
                          for (const id of multiSel) { const rr = rects.find((x) => x.id === id); if (rr) origs[id] = { x: rr.x, y: rr.y }; }
                          setGroupMove({ ids: multiSel, origs, start: toPx(e) });
                        } else {
                          setMultiSel([]);
                          select(r.id);
                          setEdit({ kind: "move", id: r.id, orig: r, start: toPx(e) });
                        }
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
                        {meters(r.w)} × {meters(r.h)} m
                      </text>
                    )}
                    {/* resize handles on the selected slot */}
                    {selected && mode === "select" && HANDLES.map((id) => (
                      <rect
                        key={id}
                        x={hx(id) - hs / 2} y={hy(id) - hs / 2} width={hs} height={hs}
                        fill="#a85638" stroke="#fff" strokeWidth={sw * 0.6}
                        style={{ cursor: cursorFor[id] }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          select(r.id);
                          svgRef.current?.setPointerCapture(e.pointerId);
                          setEdit({ kind: "resize", id: r.id, handle: id, orig: r, start: toPx(e) });
                        }}
                      />
                    ))}
                    {/* rotation handle on a stalk above the selected slot */}
                    {selected && mode === "select" && (
                      <>
                        <line x1={cx} y1={r.y} x2={cx} y2={r.y - hs * 2.4} stroke="#a85638" strokeWidth={sw} />
                        <circle
                          cx={cx} cy={r.y - hs * 2.4} r={hs * 0.85}
                          fill="#a85638" stroke="#fff" strokeWidth={sw * 0.6}
                          style={{ cursor: "grab" }}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            select(r.id);
                            svgRef.current?.setPointerCapture(e.pointerId);
                            setEdit({ kind: "rotate", id: r.id, center: { x: cx, y: cy } });
                          }}
                        />
                      </>
                    )}
                  </g>
                );
              })}

              {/* in-progress drag: rectangle for slots, line for walls */}
              {drag && mode === "wall" && (
                <line
                  x1={drag.start.x} y1={drag.start.y} x2={drag.cur.x} y2={drag.cur.y}
                  stroke="#a85638" strokeWidth={Math.max(3, imgW / 180)} strokeLinecap="round" strokeDasharray="8 6"
                />
              )}
              {drag && mode === "draw" && (
                <rect
                  x={Math.min(drag.start.x, drag.cur.x)}
                  y={Math.min(drag.start.y, drag.cur.y)}
                  width={Math.abs(drag.cur.x - drag.start.x)}
                  height={Math.abs(drag.cur.y - drag.start.y)}
                  fill="#a8563822" stroke="#a85638" strokeDasharray="6 4"
                  strokeWidth={Math.max(2, imgW / 400)}
                />
              )}
              {/* live floor-zone box while dragging — clearly visible (was missing) */}
              {drag && mode === "floorzone" && (
                <rect
                  x={Math.min(drag.start.x, drag.cur.x)}
                  y={Math.min(drag.start.y, drag.cur.y)}
                  width={Math.abs(drag.cur.x - drag.start.x)}
                  height={Math.abs(drag.cur.y - drag.start.y)}
                  fill="#a8563838" stroke="#a85638" strokeDasharray="9 5"
                  strokeWidth={Math.max(3, imgW / 280)}
                />
              )}

              {/* calibration line + draggable end-to-end handles */}
              {a && b && (
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#f59e0b"
                  strokeWidth={Math.max(2, imgW / 400)} strokeDasharray={`${imgW / 70} ${imgW / 140}`} />
              )}
              {mode === "calibrate" && calibPoints.map((p, i) => {
                const r = Math.max(14, imgW / 55);
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
                    {/* generous invisible hit target so the point is easy to grab */}
                    <circle cx={p.x} cy={p.y} r={r * 1.8} fill="transparent" />
                    <circle cx={p.x} cy={p.y} r={r} fill="#f59e0b22" stroke="#f59e0b" strokeWidth={Math.max(2, imgW / 350)} />
                    <line x1={p.x - r} y1={p.y} x2={p.x + r} y2={p.y} stroke="#f59e0b" strokeWidth={cw} />
                    <line x1={p.x} y1={p.y - r} x2={p.x} y2={p.y + r} stroke="#f59e0b" strokeWidth={cw} />
                    <circle cx={p.x} cy={p.y} r={Math.max(1.5, imgW / 450)} fill="#b45309" />
                  </g>
                );
              })}

              {/* smart-snap alignment guides (pink, Figma-style) */}
              {guides.x.map((gx, i) => (
                <line key={`sgx${i}`} x1={gx} y1={0} x2={gx} y2={imgH} stroke="#ec4899" strokeWidth={Math.max(1, imgW / 500)} strokeDasharray={`${imgW / 120} ${imgW / 240}`} style={{ pointerEvents: "none" }} />
              ))}
              {guides.y.map((gy, i) => (
                <line key={`sgy${i}`} x1={0} y1={gy} x2={imgW} y2={gy} stroke="#ec4899" strokeWidth={Math.max(1, imgW / 500)} strokeDasharray={`${imgW / 120} ${imgW / 240}`} style={{ pointerEvents: "none" }} />
              ))}

              {/* marquee multi-select box */}
              {marquee && (
                <rect
                  x={Math.min(marquee.start.x, marquee.cur.x)} y={Math.min(marquee.start.y, marquee.cur.y)}
                  width={Math.abs(marquee.cur.x - marquee.start.x)} height={Math.abs(marquee.cur.y - marquee.start.y)}
                  fill="#a8563820" stroke="#a85638" strokeWidth={Math.max(1, imgW / 500)} strokeDasharray={`${imgW / 140} ${imgW / 280}`}
                  style={{ pointerEvents: "none" }}
                />
              )}

              {/* measure (tape) tool: line + endpoints + real distance label */}
              {mode === "measure" && measurePts.length > 0 && (
                <g style={{ pointerEvents: "none" }}>
                  {ma && mb && <line x1={ma.x} y1={ma.y} x2={mb.x} y2={mb.y} stroke="#22d3ee" strokeWidth={Math.max(2, imgW / 380)} strokeDasharray={`${imgW / 70} ${imgW / 140}`} />}
                  {measurePts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={Math.max(5, imgW / 130)} fill="#22d3ee88" stroke="#0891b2" strokeWidth={Math.max(1.5, imgW / 450)} />
                  ))}
                  {ma && mb && measureMm != null && (
                    <text x={(ma.x + mb.x) / 2} y={(ma.y + mb.y) / 2 - Math.max(8, imgW / 80)} fill="#a5f3fc" fontSize={Math.max(12, imgW / 50)}
                      textAnchor="middle" dominantBaseline="middle" stroke="#083344" strokeWidth={Math.max(2, imgW / 350)} style={{ paintOrder: "stroke" }}>
                      {measureMm >= 1000 ? `${(measureMm / 1000).toFixed(2)} m` : `${Math.round(measureMm)} mm`}
                    </text>
                  )}
                </g>
              )}
            </svg>
          </div>
          </div>

          {/* placing banner — stays screen-fixed above the (zoomable) plan */}
          {mode === "place" && placingProduct && (
            <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-clay px-3 py-1.5 text-xs font-medium text-clay-ink shadow-lg">
              <span>Click the plan to place <span className="font-semibold">{placingProduct.name}</span></span>
              <button onClick={cancelPlace} className="rounded-full bg-clay-ink/15 px-2 py-0.5 font-semibold transition hover:bg-clay-ink/25">✕ Cancel</button>
            </div>
          )}

          {/* zoom magnifier while dragging a calibration handle (screen-fixed) */}
          {activeCalib && (
            <div
              className={`pointer-events-none absolute top-3 z-20 h-[150px] w-[150px] overflow-hidden rounded-full border-2 border-amber-400 shadow-2xl ${activeCalib.x > imgW / 2 ? "left-3" : "right-3"}`}
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

          {/* zoom controls */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-0.5 rounded-full border border-line bg-panel/90 px-1.5 py-1 shadow-lg backdrop-blur">
            <button onClick={() => zoomBy(1 / 1.25)} title="Zoom out" className="flex h-6 w-6 items-center justify-center rounded-full text-base leading-none text-ink transition hover:bg-clay-50">−</button>
            <button onClick={fitView} title="Reset to fit" className="px-1.5 font-mono text-[11px] text-muted transition hover:text-ink">{Math.round(zoom * 100)}%</button>
            <button onClick={() => zoomBy(1.25)} title="Zoom in" className="flex h-6 w-6 items-center justify-center rounded-full text-base leading-none text-ink transition hover:bg-clay-50">+</button>
            <span className="mx-0.5 h-4 w-px bg-line" />
            <button onClick={fitView} title="Fit the whole plan to the view" className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted transition hover:bg-clay-50 hover:text-ink">Fit</button>
          </div>
          </>
        )}
      </div>

      {/* right third — floors / walls / materials, beside the fixed 2D plan */}
      {planImage && (
        <aside className="min-h-0 flex-1 min-w-[190px] max-w-[340px] overflow-hidden border-l border-line">
          <MaterialsDock />
        </aside>
      )}
      </div>
    </div>
  );
}

function ModeButton({
  active, disabled, onClick, children, title, done, next,
}: {
  active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode; title?: string;
  done?: boolean;  // step completed → show a ✓
  next?: boolean;  // the next thing to do → highlight with a clay ring
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded px-3 py-1.5 font-medium transition ${
        active ? "bg-clay text-clay-ink" : "bg-raised border border-line text-ink hover:bg-clay-50"
      } ${next && !active && !disabled ? "ring-2 ring-clay/70 ring-offset-2 ring-offset-panel" : ""} ${
        disabled ? "cursor-not-allowed opacity-40" : ""
      }`}
    >
      {done && <span className={active ? "mr-1" : "mr-1 text-clay"}>✓</span>}
      {children}
    </button>
  );
}
