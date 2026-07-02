"use client";

// Undo/redo for Puffer. Rather than retrofit every store action, we *subscribe*
// to the store and snapshot the undoable "document" slice (see StudioDoc) whenever
// it changes. Because every store update is immutable (new arrays/objects), we can
// detect a real change with cheap reference equality. Rapid changes from a single
// gesture (dragging a slot fires many updates) are coalesced into ONE history entry
// via a trailing debounce, so one drag = one undo.

import { useSyncExternalStore } from "react";
import { useStudio, StudioDoc } from "./store";

const docOf = (s: ReturnType<typeof useStudio.getState>): StudioDoc => ({
  mmPerPx: s.mmPerPx, rects: s.rects, walls: s.walls,
  floorZones: s.floorZones, floorMat: s.floorMat, wallMat: s.wallMat,
});

// reference equality across the whole document (immutable updates make this valid)
const sameDoc = (a: StudioDoc, b: StudioDoc) =>
  a.rects === b.rects && a.walls === b.walls && a.floorZones === b.floorZones &&
  a.floorMat === b.floorMat && a.wallMat === b.wallMat && a.mmPerPx === b.mmPerPx;

const LIMIT = 100;            // cap the stacks so memory stays bounded
const COALESCE_MS = 350;      // a gesture quieter than this commits one entry

let past: StudioDoc[] = [];
let future: StudioDoc[] = [];
let lastDoc: StudioDoc;        // most recent doc we've seen
let burstStart: StudioDoc | null = null; // doc as it was before the current burst
let lastPlan: string | null = null;      // reset history when the plan changes
let timer: ReturnType<typeof setTimeout> | null = null;
let applying = false;          // suppress recording while we restore a snapshot
let started = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

// fold the current burst (if it actually changed the doc) into the past stack
function flush() {
  if (timer) { clearTimeout(timer); timer = null; }
  if (burstStart && !sameDoc(burstStart, lastDoc)) {
    past.push(burstStart);
    if (past.length > LIMIT) past.shift();
    future = [];
  }
  burstStart = null;
}

export function initHistory() {
  if (started || typeof window === "undefined") return;
  started = true;
  const s0 = useStudio.getState();
  lastDoc = docOf(s0);
  lastPlan = s0.planImage;

  useStudio.subscribe((state) => {
    // a new plan (or cleared plan) starts a fresh history — don't bleed across plans
    if (state.planImage !== lastPlan) {
      lastPlan = state.planImage;
      past = []; future = []; burstStart = null;
      if (timer) { clearTimeout(timer); timer = null; }
      lastDoc = docOf(state);
      emit();
      return;
    }
    if (applying) { lastDoc = docOf(state); return; }
    const cur = docOf(state);
    if (sameDoc(cur, lastDoc)) return;          // selection/mode change — not undoable
    if (!burstStart) burstStart = lastDoc;       // remember the pre-gesture state
    lastDoc = cur;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { flush(); emit(); }, COALESCE_MS);
  });
}

export function undo() {
  flush();
  const prev = past.pop();
  if (!prev) { emit(); return; }
  future.push(lastDoc);
  applying = true;
  useStudio.getState().applyDoc(prev);
  lastDoc = docOf(useStudio.getState());
  applying = false;
  emit();
}

export function redo() {
  flush();
  const next = future.pop();
  if (!next) { emit(); return; }
  past.push(lastDoc);
  applying = true;
  useStudio.getState().applyDoc(next);
  lastDoc = docOf(useStudio.getState());
  applying = false;
  emit();
}

const canUndo = () => past.length > 0 || (burstStart != null && !sameDoc(burstStart, lastDoc));
const canRedo = () => future.length > 0;

// a primitive snapshot that changes whenever the buttons' enabled-state could change
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
const getSnapshot = () => `${past.length}:${future.length}:${burstStart ? 1 : 0}`;
const SERVER_SNAPSHOT = "0:0:0";

export function useHistory() {
  useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  return { canUndo: canUndo(), canRedo: canRedo(), undo, redo };
}
