import { create } from "zustand";
import { Mode, Point, Product, Rect, Wall, WallHeight } from "./types";
import { SurfaceMat } from "./textures";

// the user's own AI-generated product library, persisted in the browser
const LIB_KEY = "puffer.library.v1";
function saveLib(list: Product[]) {
  try { if (typeof window !== "undefined") localStorage.setItem(LIB_KEY, JSON.stringify(list)); } catch {}
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
  scaleEstimated: boolean; // true when mmPerPx is an upload guess, not user-calibrated
  calibPoints: Point[]; // 0, 1 or 2 points while calibrating

  // furniture slots
  rects: Rect[];
  selectedId: string | null;

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

  // interaction
  mode: Mode;

  // actions
  loadPlan: (dataUrl: string, w: number, h: number) => void;
  loadSample: (src: string, w: number, h: number, mmPerPx: number) => void;
  serializeProject: () => ProjectFile;
  loadProject: (p: ProjectFile) => void;
  setMode: (m: Mode) => void;
  addCalibPoint: (p: Point) => void;
  updateCalibPoint: (i: number, p: Point) => void;
  setScaleFromCalib: (realMm: number) => void;
  resetCalib: () => void;
  addRect: (r: Omit<Rect, "id" | "productId" | "rotationDeg">) => void;
  placeDetected: (items: { x: number; y: number; w: number; h: number; productId: string }[]) => void;
  updateRect: (id: string, patch: Partial<Rect>) => void;
  deleteRect: (id: string) => void;
  select: (id: string | null) => void;
  // undo history (snapshots of slots + walls)
  _past?: { rects: Rect[]; walls: Wall[] }[];
  pushHistory: () => void;
  undo: () => void;

  // wall actions
  addWall: (w: Omit<Wall, "id" | "height" | "source">) => void;
  updateWall: (id: string, patch: Partial<Wall>) => void;
  deleteWall: (id: string) => void;
  selectWall: (id: string | null) => void;
  setWallHeight: (h: WallHeight) => void;
  tracePerimeter: () => void;

  // materials
  setFloorMat: (m: SurfaceMat) => void;
  setWallMat: (m: SurfaceMat) => void;

  // user library
  addUserProduct: (p: Product) => void;
  removeUserProduct: (id: string) => void;
  hydrateLibrary: () => void;

  // auto-detected walls
  setDetecting: (v: boolean) => void;
  setAutoWalls: (segs: { x1: number; y1: number; x2: number; y2: number }[]) => void;
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
  scaleEstimated: false,
  calibPoints: [],
  rects: [],
  selectedId: null,
  walls: [],
  selectedWallId: null,
  wallHeight: "full",
  autoWallsOn: false,
  detecting: false,
  floorMat: { kind: "plan" },
  wallMat: { kind: "color", color: "#eef2f7" },
  userProducts: [],
  mode: "calibrate",

  loadPlan: (dataUrl, w, h) =>
    set({
      planImage: dataUrl,
      imgW: w,
      imgH: h,
      // Estimate a scale up-front (assume the plan's longest side ≈ 10 m) so the
      // 3D view, Auto-slots and Auto-walls all work immediately. The proportions
      // are exact; only the absolute sizing is a guess until the user calibrates.
      mmPerPx: 10000 / Math.max(w, h),
      scaleEstimated: true,
      calibPoints: [],
      rects: [],
      selectedId: null,
      walls: [],
      selectedWallId: null,
      autoWallsOn: false,
      detecting: false,
      mode: "draw",
    }),

  loadSample: (src, w, h, mmPerPx) =>
    set({
      planImage: src,
      imgW: w,
      imgH: h,
      mmPerPx,
      scaleEstimated: false,
      calibPoints: [],
      rects: [],
      selectedId: null,
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
      rects: s.rects, walls: s.walls, floorMat: s.floorMat, wallMat: s.wallMat,
    };
  },

  loadProject: (p) =>
    set({
      planImage: p.planImage, imgW: p.imgW, imgH: p.imgH, mmPerPx: p.mmPerPx,
      scaleEstimated: false,
      rects: p.rects ?? [], walls: p.walls ?? [],
      floorMat: p.floorMat ?? { kind: "plan" },
      wallMat: p.wallMat ?? { kind: "color", color: "#eef2f7" },
      selectedId: null, selectedWallId: null, calibPoints: [],
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

  updateCalibPoint: (i, p) =>
    set((s) => ({ calibPoints: s.calibPoints.map((q, idx) => (idx === i ? p : q)) })),

  setScaleFromCalib: (realMm) => {
    const [a, b] = get().calibPoints;
    if (!a || !b) return;
    const distPx = Math.hypot(b.x - a.x, b.y - a.y);
    if (distPx < 1) return;
    set({ mmPerPx: realMm / distPx, scaleEstimated: false, calibPoints: [], mode: "draw" });
  },

  resetCalib: () => set({ calibPoints: [], mmPerPx: null }),

  addRect: (r) =>
    set((s) => {
      const rect: Rect = { ...r, id: uid(), rotationDeg: 0, productId: null };
      return { rects: [...s.rects, rect], selectedId: rect.id, selectedWallId: null, mode: "select" };
    }),

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

  select: (id) => set({ selectedId: id, selectedWallId: null, mode: id ? "select" : get().mode }),

  _past: [],
  pushHistory: () => set((s) => ({ _past: [...(s._past || []), { rects: s.rects, walls: s.walls }].slice(-50) })),
  undo: () => set((s) => {
    const past = s._past || [];
    const prev = past[past.length - 1];
    if (!prev) return {};
    return { rects: prev.rects, walls: prev.walls, _past: past.slice(0, -1), selectedId: null, selectedWallId: null };
  }),

  addWall: (w) =>
    set((s) => {
      const wall: Wall = { ...w, id: uid(), height: s.wallHeight, source: "manual" };
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

  selectWall: (id) => set({ selectedWallId: id, selectedId: null, mode: id ? "select" : get().mode }),

  setWallHeight: (h) =>
    set((s) => {
      // if a wall is selected, change that wall; otherwise set the default for new walls
      if (s.selectedWallId) {
        return { walls: s.walls.map((w) => (w.id === s.selectedWallId ? { ...w, height: h } : w)) };
      }
      return { wallHeight: h };
    }),

  tracePerimeter: () =>
    set((s) => {
      if (!s.imgW || !s.imgH) return {};
      const m = Math.round(Math.min(s.imgW, s.imgH) * 0.03); // small inset from the image edge
      const x0 = m, y0 = m, x1 = s.imgW - m, y1 = s.imgH - m;
      const mk = (a: number, b: number, c: number, d: number): Wall => ({
        id: uid(), x1: a, y1: b, x2: c, y2: d, height: s.wallHeight, source: "manual",
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

  addUserProduct: (p) =>
    set((s) => {
      const next = [...s.userProducts.filter((x) => x.id !== p.id), p];
      saveLib(next);
      return { userProducts: next };
    }),
  removeUserProduct: (id) =>
    set((s) => {
      const next = s.userProducts.filter((x) => x.id !== id);
      saveLib(next);
      return { userProducts: next };
    }),
  hydrateLibrary: () => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(LIB_KEY);
      if (raw) set({ userProducts: JSON.parse(raw) });
    } catch {}
  },

  setDetecting: (v) => set({ detecting: v }),

  setAutoWalls: (segs) =>
    set((s) => {
      const manual = s.walls.filter((w) => w.source === "manual");
      const auto: Wall[] = segs.map((g) => ({
        id: uid(), x1: g.x1, y1: g.y1, x2: g.x2, y2: g.y2, height: "full", source: "auto",
      }));
      return { walls: [...manual, ...auto], autoWallsOn: true, detecting: false };
    }),

  clearAutoWalls: () =>
    set((s) => ({
      walls: s.walls.filter((w) => w.source === "manual"),
      autoWallsOn: false,
      selectedWallId: s.walls.find((w) => w.id === s.selectedWallId)?.source === "auto" ? null : s.selectedWallId,
    })),
}));
