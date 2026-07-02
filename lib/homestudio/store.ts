import { create } from "zustand";
import { FloorZone, Mode, Point, Product, Rect, RoomScan, Wall, WallHeight, WallKind, Opening, OpeningKind, OPENING_DEFAULTS } from "./types";
import { SurfaceMat } from "./textures";

// the user's own AI-generated product library, persisted in the browser
const LIB_KEY = "puffer.library.v1";
function saveLib(list: Product[]) {
  try {
    if (typeof window === "undefined") return;
    // IndexedDB-backed models have a session-only blob glbUrl — never persist it;
    // it's rebuilt from IndexedDB (via idbKey) on load.
    const slim = list.map((p) => (p.idbKey ? { ...p, glbUrl: undefined } : p));
    localStorage.setItem(LIB_KEY, JSON.stringify(slim));
  } catch {}
}
// "show only my own models" preference (hide the built-in placeholder catalog)
const LIBONLY_KEY = "puffer.libraryOnly.v1";
function saveLibraryOnly(v: boolean) {
  try { if (typeof window !== "undefined") localStorage.setItem(LIBONLY_KEY, v ? "1" : "0"); } catch {}
}

// ── undo/redo: the "document" slice that history snapshots & restores ──────────
// (planImage/imgW/imgH are deliberately excluded so undo never unloads the plan;
//  history is reset when a new plan loads — see lib/history.ts)
export interface StudioDoc {
  mmPerPx: number | null;
  rects: Rect[];
  walls: Wall[];
  floorZones: FloorZone[];
  floorMat: SurfaceMat;
  wallMat: SurfaceMat;
}

// ── copy / paste clipboard (one selected object of any kind) ──────────────────
type ClipItem =
  | { kind: "rect"; data: Rect }
  | { kind: "wall"; data: Wall }
  | { kind: "zone"; data: FloorZone };

const PASTE_OFFSET = 24; // plan-pixels a pasted/duplicated copy is nudged by

// drop an offset copy of a clipboard item into the room and select it
function placeClipboardCopy(set: (fn: (s: StudioState) => Partial<StudioState>) => void, c: ClipItem) {
  if (c.kind === "rect") {
    const r = c.data;
    const nr: Rect = { ...r, id: uid(), x: r.x + PASTE_OFFSET, y: r.y + PASTE_OFFSET };
    set((st) => ({ rects: [...st.rects, nr], selectedId: nr.id, selectedWallId: null, selectedZoneId: null, mode: "select" }));
  } else if (c.kind === "wall") {
    const w = c.data;
    const nw: Wall = {
      ...w, id: uid(),
      x1: w.x1 + PASTE_OFFSET, y1: w.y1 + PASTE_OFFSET, x2: w.x2 + PASTE_OFFSET, y2: w.y2 + PASTE_OFFSET,
      openings: (w.openings ?? []).map((o) => ({ ...o, id: uid() })),
    };
    set((st) => ({ walls: [...st.walls, nw], selectedWallId: nw.id, selectedId: null, selectedZoneId: null, mode: "select" }));
  } else {
    const z = c.data;
    const nz: FloorZone = { ...z, id: uid(), x: z.x + PASTE_OFFSET, y: z.y + PASTE_OFFSET };
    set((st) => ({ floorZones: [...st.floorZones, nz], selectedZoneId: nz.id, selectedId: null, selectedWallId: null, mode: "select" }));
  }
}

// a saved Puffer project (everything needed to rebuild the room)
export interface ProjectFile {
  version: 1;
  planImage: string | null;
  imgW: number;
  imgH: number;
  mmPerPx: number | null;
  rects: Rect[];
  walls: Wall[];
  floorZones?: FloorZone[];
  floorMat: SurfaceMat;
  wallMat: SurfaceMat;
}

interface StudioState {
  // plan image
  planImage: string | null; // data URL
  imgW: number;
  imgH: number;

  // scale calibration: real-world millimetres per plan pixel
  mmPerPx: number | null;
  calibPoints: Point[]; // 0, 1 or 2 points while calibrating

  // furniture slots
  rects: Rect[];
  selectedId: string | null;
  // a product chosen from the catalog, waiting to be dropped onto the plan (place mode)
  placingProductId: string | null;

  // per-room floor zones
  floorZones: FloorZone[];
  selectedZoneId: string | null;

  // walls
  walls: Wall[];
  selectedWallId: string | null;
  wallHeight: WallHeight; // default height applied to newly drawn walls
  autoWallsOn: boolean;   // are plan-detected walls currently raised?
  detecting: boolean;     // detection in progress

  // surface materials (floor + walls) for a realistic look
  floorMat: SurfaceMat;
  wallMat: SurfaceMat;

  // the user's AI-generated product library (persisted in localStorage)
  userProducts: Product[];

  // copy/paste clipboard (one object of any kind)
  clipboard: ClipItem | null;

  // when true, the furniture catalog shows ONLY the user's own models (the built-in
  // placeholder catalog is hidden). Persisted in localStorage.
  libraryOnly: boolean;

  // interaction
  mode: Mode;

  // 3D render quality: "high" = ambient occlusion + post FX; "lite" = fast plain
  quality: "high" | "lite";

  // imported real-space scan mesh shown live in 3D (from a free LiDAR scanner app)
  roomScan: RoomScan | null;

  // actions
  loadPlan: (dataUrl: string, w: number, h: number) => void;
  loadSample: (src: string, w: number, h: number, mmPerPx: number) => void;
  serializeProject: () => ProjectFile;
  loadProject: (p: ProjectFile) => void;
  setMode: (m: Mode) => void;
  addCalibPoint: (p: Point) => void;
  setCalibPoints: (pts: Point[]) => void;
  updateCalibPoint: (i: number, p: Point) => void;
  setScaleFromCalib: (realMm: number) => void;
  resetCalib: () => void;
  addRect: (r: Omit<Rect, "id" | "productId" | "rotationDeg">) => void;
  placeProduct: (item: { w: number; h: number; productId: string; cx?: number; cy?: number }) => void;
  beginPlace: (productId: string) => void;
  cancelPlace: () => void;
  placeDetected: (items: { x: number; y: number; w: number; h: number; productId: string }[]) => void;
  updateRect: (id: string, patch: Partial<Rect>) => void;
  deleteRect: (id: string) => void;
  select: (id: string | null) => void;

  // floor-zone actions
  addFloorZone: (r: Omit<FloorZone, "id" | "matId">) => void;
  addFloorZones: (rs: Omit<FloorZone, "id" | "matId">[]) => void;
  updateFloorZone: (id: string, patch: Partial<FloorZone>) => void;
  deleteFloorZone: (id: string) => void;
  selectZone: (id: string | null) => void;

  // wall actions
  addWall: (w: Omit<Wall, "id" | "height" | "source">) => void;
  updateWall: (id: string, patch: Partial<Wall>) => void;
  deleteWall: (id: string) => void;
  selectWall: (id: string | null) => void;
  setWallHeight: (h: WallHeight) => void;
  splitWall: (id: string, at: Point) => void;
  addOpening: (wallId: string, kind: OpeningKind, pos?: number) => void;
  updateOpening: (wallId: string, openingId: string, patch: Partial<Opening>) => void;
  deleteOpening: (wallId: string, openingId: string) => void;
  tracePerimeter: () => void;

  // materials
  setFloorMat: (m: SurfaceMat) => void;
  setWallMat: (m: SurfaceMat) => void;
  setQuality: (q: "high" | "lite") => void;

  // room scan
  setRoomScan: (r: RoomScan) => void;
  updateRoomScan: (patch: Partial<RoomScan>) => void;
  clearRoomScan: () => void;
  beginFurnishScan: (plan: { planImage: string; imgW: number; imgH: number; mmPerPx: number }) => void;

  // user library
  addUserProduct: (p: Product) => void;
  removeUserProduct: (id: string) => void;
  hydrateLibrary: () => void;
  setLibraryOnly: (v: boolean) => void;

  // copy / paste / duplicate · undo-redo
  copySelection: () => void;
  paste: () => void;
  duplicateSelection: () => void;
  applyDoc: (doc: StudioDoc) => void;

  // auto-detected walls
  setDetecting: (v: boolean) => void;
  setAutoWalls: (segs: { x1: number; y1: number; x2: number; y2: number; kind?: WallKind; thicknessMm?: number; openings?: Omit<Opening, "id">[] }[]) => void;
  clearAutoWalls: () => void;
}

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.abs(Math.floor(performance.now() * 1000)).toString(36);

export const useStudio = create<StudioState>((set, get) => ({
  planImage: null,
  imgW: 0,
  imgH: 0,
  mmPerPx: null,
  calibPoints: [],
  rects: [],
  selectedId: null,
  placingProductId: null,
  floorZones: [],
  selectedZoneId: null,
  walls: [],
  selectedWallId: null,
  wallHeight: "full",
  autoWallsOn: false,
  detecting: false,
  floorMat: { kind: "plan" },
  wallMat: { kind: "color", color: "#eef2f7" },
  userProducts: [],
  clipboard: null,
  libraryOnly: false,
  mode: "calibrate",
  quality: "high",
  roomScan: null,

  loadPlan: (dataUrl, w, h) =>
    set({
      planImage: dataUrl,
      imgW: w,
      imgH: h,
      mmPerPx: null,
      calibPoints: [],
      rects: [],
      selectedId: null,
      floorZones: [],
      selectedZoneId: null,
      walls: [],
      selectedWallId: null,
      autoWallsOn: false,
      detecting: false,
      mode: "calibrate",
    }),

  loadSample: (src, w, h, mmPerPx) =>
    set({
      planImage: src,
      imgW: w,
      imgH: h,
      mmPerPx,
      calibPoints: [],
      rects: [],
      selectedId: null,
      floorZones: [],
      selectedZoneId: null,
      walls: [],
      selectedWallId: null,
      autoWallsOn: false,
      detecting: false,
      mode: "draw",
    }),

  serializeProject: () => {
    const s = get();
    return {
      version: 1, planImage: s.planImage, imgW: s.imgW, imgH: s.imgH, mmPerPx: s.mmPerPx,
      rects: s.rects, walls: s.walls, floorZones: s.floorZones, floorMat: s.floorMat, wallMat: s.wallMat,
    };
  },

  loadProject: (p) =>
    set({
      planImage: p.planImage, imgW: p.imgW, imgH: p.imgH, mmPerPx: p.mmPerPx,
      rects: p.rects ?? [], walls: p.walls ?? [], floorZones: p.floorZones ?? [],
      floorMat: p.floorMat ?? { kind: "plan" },
      wallMat: p.wallMat ?? { kind: "color", color: "#eef2f7" },
      selectedId: null, selectedWallId: null, selectedZoneId: null, calibPoints: [],
      autoWallsOn: (p.walls ?? []).some((w) => w.source === "auto"),
      detecting: false,
      mode: p.mmPerPx ? "select" : "calibrate",
    }),

  setMode: (m) => set({ mode: m, calibPoints: [] }),

  addCalibPoint: (p) => {
    const pts = get().calibPoints;
    if (pts.length >= 2) set({ calibPoints: [p] });
    else set({ calibPoints: [...pts, p] });
  },

  setCalibPoints: (pts) => set({ mode: "calibrate", calibPoints: pts.slice(0, 2) }),

  updateCalibPoint: (i, p) =>
    set((s) => ({ calibPoints: s.calibPoints.map((q, idx) => (idx === i ? p : q)) })),

  setScaleFromCalib: (realMm) => {
    const [a, b] = get().calibPoints;
    if (!a || !b) return;
    const distPx = Math.hypot(b.x - a.x, b.y - a.y);
    if (distPx < 1) return;
    set({ mmPerPx: realMm / distPx, calibPoints: [], mode: "draw" });
  },

  resetCalib: () => set({ calibPoints: [], mmPerPx: null }),

  addRect: (r) =>
    set((s) => {
      const rect: Rect = { ...r, id: uid(), rotationDeg: 0, productId: null };
      return { rects: [...s.rects, rect], selectedId: rect.id, selectedWallId: null, mode: "select" };
    }),

  // drop a catalog item straight into the room (Planner5D-style): a slot sized to
  // the product's true footprint, centred on the drop point (or the room centre),
  // already selected.
  placeProduct: (item) =>
    set((s) => {
      const id = uid();
      const cx = item.cx ?? s.imgW / 2;
      const cy = item.cy ?? s.imgH / 2;
      const x = Math.max(0, cx - item.w / 2);
      const y = Math.max(0, cy - item.h / 2);
      const rect: Rect = { id, x, y, w: item.w, h: item.h, rotationDeg: 0, productId: item.productId };
      return { rects: [...s.rects, rect], selectedId: id, selectedWallId: null, mode: "select", placingProductId: null };
    }),

  beginPlace: (productId) => set({ placingProductId: productId, mode: "place", selectedId: null, selectedWallId: null }),
  cancelPlace: () => set((s) => ({ placingProductId: null, mode: s.mode === "place" ? "select" : s.mode })),

  placeDetected: (items) =>
    set((s) => {
      const added: Rect[] = items.map((it) => ({
        id: uid(), x: it.x, y: it.y, w: it.w, h: it.h, rotationDeg: 0,
        productId: it.productId || null,
      }));
      return { rects: [...s.rects, ...added], mode: "select", selectedId: null, selectedWallId: null };
    }),

  updateRect: (id, patch) =>
    set((s) => ({
      rects: s.rects.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),

  deleteRect: (id) =>
    set((s) => ({
      rects: s.rects.filter((r) => r.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  select: (id) => set({ selectedId: id, selectedWallId: null, selectedZoneId: null, mode: id ? "select" : get().mode }),

  // ── per-room floor zones ──────────────────────────────────────────────
  addFloorZone: (r) =>
    set((s) => {
      const zone: FloorZone = { ...r, id: uid(), matId: "tile-white" };
      return { floorZones: [...s.floorZones, zone], selectedZoneId: zone.id, selectedId: null, selectedWallId: null, mode: "select" };
    }),
  addFloorZones: (rs) =>
    set((s) => ({
      floorZones: [...s.floorZones, ...rs.map((r) => ({ ...r, id: uid(), matId: "tile-white" }))],
      selectedZoneId: null, selectedId: null, selectedWallId: null, mode: "select",
    })),
  updateFloorZone: (id, patch) =>
    set((s) => ({ floorZones: s.floorZones.map((z) => (z.id === id ? { ...z, ...patch } : z)) })),
  deleteFloorZone: (id) =>
    set((s) => ({
      floorZones: s.floorZones.filter((z) => z.id !== id),
      selectedZoneId: s.selectedZoneId === id ? null : s.selectedZoneId,
    })),
  selectZone: (id) => set({ selectedZoneId: id, selectedId: null, selectedWallId: null, mode: id ? "select" : get().mode }),

  addWall: (w) =>
    set((s) => {
      const wall: Wall = { kind: "interior", ...w, id: uid(), height: s.wallHeight, source: "manual" };
      return { walls: [...s.walls, wall] };
    }),

  updateWall: (id, patch) =>
    set((s) => ({
      walls: s.walls.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    })),

  deleteWall: (id) =>
    set((s) => ({
      walls: s.walls.filter((w) => w.id !== id),
      selectedWallId: s.selectedWallId === id ? null : s.selectedWallId,
    })),

  selectWall: (id) => set({ selectedWallId: id, selectedId: null, selectedZoneId: null, mode: id ? "select" : get().mode }),

  setWallHeight: (h) =>
    set((s) => {
      // if a wall is selected, change that wall; otherwise set the default for new walls
      if (s.selectedWallId) {
        return { walls: s.walls.map((w) => (w.id === s.selectedWallId ? { ...w, height: h } : w)) };
      }
      return { wallHeight: h };
    }),

  splitWall: (id, at) =>
    set((s) => {
      const w = s.walls.find((x) => x.id === id);
      if (!w) return {};
      const dx = w.x2 - w.x1, dy = w.y2 - w.y1;
      const len2 = dx * dx + dy * dy || 1;
      let t = ((at.x - w.x1) * dx + (at.y - w.y1) * dy) / len2;
      t = Math.max(0.15, Math.min(0.85, t)); // keep both halves substantial
      const mx = Math.round(w.x1 + dx * t), my = Math.round(w.y1 + dy * t);
      const ops = w.openings ?? [];
      const lenPx = Math.hypot(dx, dy) || 1;
      // an opening's half-width as a fraction of the wall; drop ones straddling the cut
      const halfFrac = (o: Opening) => (s.mmPerPx ? o.widthMm / s.mmPerPx / 2 / lenPx : 0);
      const ops1 = ops.filter((o) => o.pos + halfFrac(o) <= t).map((o) => ({ ...o, id: uid(), pos: o.pos / t }));
      const ops2 = ops.filter((o) => o.pos - halfFrac(o) >= t).map((o) => ({ ...o, id: uid(), pos: (o.pos - t) / (1 - t) }));
      const base = { height: w.height, source: w.source, thicknessMm: w.thicknessMm, kind: w.kind, heightMm: w.heightMm };
      const w1: Wall = { ...base, id: uid(), x1: w.x1, y1: w.y1, x2: mx, y2: my, openings: ops1 };
      const w2: Wall = { ...base, id: uid(), x1: mx, y1: my, x2: w.x2, y2: w.y2, openings: ops2 };
      return { walls: s.walls.flatMap((x) => (x.id === id ? [w1, w2] : [x])), selectedWallId: w1.id };
    }),

  addOpening: (wallId, kind, pos = 0.5) =>
    set((s) => {
      const op: Opening = { id: uid(), kind, pos: Math.max(0, Math.min(1, pos)), ...OPENING_DEFAULTS[kind] };
      return {
        // a door/window needs a wall with height to cut — auto-raise a "no wall" to full
        walls: s.walls.map((w) =>
          w.id === wallId
            ? { ...w, height: w.height === "none" && w.heightMm == null ? "full" : w.height, openings: [...(w.openings ?? []), op] }
            : w,
        ),
        // surface the wall in the inspector so its opening can be fine-tuned (keep current mode)
        selectedWallId: wallId, selectedId: null, selectedZoneId: null,
      };
    }),
  updateOpening: (wallId, openingId, patch) =>
    set((s) => ({ walls: s.walls.map((w) => (w.id === wallId ? { ...w, openings: (w.openings ?? []).map((o) => (o.id === openingId ? { ...o, ...patch } : o)) } : w)) })),
  deleteOpening: (wallId, openingId) =>
    set((s) => ({ walls: s.walls.map((w) => (w.id === wallId ? { ...w, openings: (w.openings ?? []).filter((o) => o.id !== openingId) } : w)) })),

  tracePerimeter: () =>
    set((s) => {
      if (!s.imgW || !s.imgH) return {};
      const m = Math.round(Math.min(s.imgW, s.imgH) * 0.03); // small inset from the image edge
      const x0 = m, y0 = m, x1 = s.imgW - m, y1 = s.imgH - m;
      const mk = (a: number, b: number, c: number, d: number): Wall => ({
        id: uid(), x1: a, y1: b, x2: c, y2: d, height: s.wallHeight, source: "manual", kind: "exterior",
      });
      const perimeter = [
        mk(x0, y0, x1, y0), // top
        mk(x1, y0, x1, y1), // right
        mk(x1, y1, x0, y1), // bottom
        mk(x0, y1, x0, y0), // left
      ];
      return { walls: [...s.walls, ...perimeter] };
    }),

  setFloorMat: (m) => set({ floorMat: m }),
  setWallMat: (m) => set({ wallMat: m }),
  setQuality: (q) => set({ quality: q }),

  setRoomScan: (r) => set({ roomScan: r }),
  updateRoomScan: (patch) => set((s) => (s.roomScan ? { roomScan: { ...s.roomScan, ...patch } } : {})),
  clearRoomScan: () => set((s) => {
    if (s.roomScan?.url.startsWith("blob:")) { try { URL.revokeObjectURL(s.roomScan.url); } catch {} }
    return { roomScan: null };
  }),
  // turn the imported scan into a furnishable plan: top-down plan at true scale,
  // scan reset to default orientation + made see-through so furniture shows inside.
  beginFurnishScan: (plan) => set((s) => ({
    planImage: plan.planImage, imgW: plan.imgW, imgH: plan.imgH, mmPerPx: plan.mmPerPx,
    rects: [], walls: [], floorZones: [],
    selectedId: null, selectedWallId: null, selectedZoneId: null, calibPoints: [],
    autoWallsOn: false, detecting: false, mode: "draw",
    roomScan: s.roomScan ? { ...s.roomScan, scale: 1, rotYdeg: 0, yOffset: 0, opacity: 0.5 } : null,
  })),

  addUserProduct: (p) =>
    set((s) => {
      const next = [...s.userProducts.filter((x) => x.id !== p.id), p];
      saveLib(next);
      return { userProducts: next };
    }),
  removeUserProduct: (id) =>
    set((s) => {
      const gone = s.userProducts.find((x) => x.id === id);
      const next = s.userProducts.filter((x) => x.id !== id);
      saveLib(next);
      if (gone?.idbKey) import("./modelStore").then(({ deleteModel }) => deleteModel(gone.idbKey!)).catch(() => {});
      return { userProducts: next };
    }),
  hydrateLibrary: () => {
    try {
      if (typeof window === "undefined") return;
      set({ libraryOnly: localStorage.getItem(LIBONLY_KEY) === "1" });
      const raw = localStorage.getItem(LIB_KEY);
      if (!raw) return;
      const list: Product[] = JSON.parse(raw);
      set({ userProducts: list });
      // rebuild session blob URLs for IndexedDB-backed models (async)
      if (list.some((p) => p.idbKey)) {
        import("./modelStore").then(async ({ getModelURL }) => {
          const rebuilt = await Promise.all(
            list.map(async (p) => (p.idbKey ? { ...p, glbUrl: (await getModelURL(p.idbKey)) ?? p.glbUrl } : p)),
          );
          set({ userProducts: rebuilt });
        }).catch(() => {});
      }
    } catch {}
  },
  setLibraryOnly: (v) => { saveLibraryOnly(v); set({ libraryOnly: v }); },

  // ── copy / paste / duplicate ────────────────────────────────────────────
  copySelection: () => {
    const s = get();
    if (s.selectedId) { const r = s.rects.find((x) => x.id === s.selectedId); if (r) set({ clipboard: { kind: "rect", data: r } }); }
    else if (s.selectedWallId) { const w = s.walls.find((x) => x.id === s.selectedWallId); if (w) set({ clipboard: { kind: "wall", data: w } }); }
    else if (s.selectedZoneId) { const z = s.floorZones.find((x) => x.id === s.selectedZoneId); if (z) set({ clipboard: { kind: "zone", data: z } }); }
  },
  paste: () => {
    const c = get().clipboard;
    if (c) placeClipboardCopy(set, c);
  },
  duplicateSelection: () => {
    const s = get();
    let c: ClipItem | null = null;
    if (s.selectedId) { const r = s.rects.find((x) => x.id === s.selectedId); if (r) c = { kind: "rect", data: r }; }
    else if (s.selectedWallId) { const w = s.walls.find((x) => x.id === s.selectedWallId); if (w) c = { kind: "wall", data: w }; }
    else if (s.selectedZoneId) { const z = s.floorZones.find((x) => x.id === s.selectedZoneId); if (z) c = { kind: "zone", data: z }; }
    if (c) placeClipboardCopy(set, c);
  },
  // restore a history snapshot (undo/redo) — see lib/history.ts
  applyDoc: (doc) => set({
    mmPerPx: doc.mmPerPx, rects: doc.rects, walls: doc.walls, floorZones: doc.floorZones,
    floorMat: doc.floorMat, wallMat: doc.wallMat,
    selectedId: null, selectedWallId: null, selectedZoneId: null,
  }),

  setDetecting: (v) => set({ detecting: v }),

  setAutoWalls: (segs) =>
    set((s) => {
      const manual = s.walls.filter((w) => w.source === "manual");
      const auto: Wall[] = segs.map((g) => ({
        id: uid(), x1: g.x1, y1: g.y1, x2: g.x2, y2: g.y2, height: "full", source: "auto", kind: g.kind ?? "interior",
        thicknessMm: g.thicknessMm,
        openings: (g.openings ?? []).map((op) => ({ ...op, id: uid() })),
      }));
      return { walls: [...manual, ...auto], autoWallsOn: auto.length > 0, detecting: false };
    }),

  clearAutoWalls: () =>
    set((s) => ({
      walls: s.walls.filter((w) => w.source === "manual"),
      autoWallsOn: false,
      selectedWallId: s.walls.find((w) => w.id === s.selectedWallId)?.source === "auto" ? null : s.selectedWallId,
    })),
}));
