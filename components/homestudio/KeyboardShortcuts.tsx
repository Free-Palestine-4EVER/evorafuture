"use client";

import { useEffect, useState } from "react";
import { useStudio } from "@/lib/homestudio/store";
import { undo, redo, initHistory } from "@/lib/homestudio/history";
import { toast } from "@/lib/homestudio/toast";

const ROWS: [string, string][] = [
  ["1", "Calibrate mode"],
  ["2", "Draw furniture slots"],
  ["3", "Select / move"],
  ["W", "Walls mode"],
  ["D", "Doors & Windows"],
  ["F", "Floor zones mode"],
  ["R / ⇧R", "Rotate selected ±15°"],
  ["⌘Z / ⌘⇧Z", "Undo / Redo"],
  ["⌘C / ⌘V", "Copy / Paste selected"],
  ["⌘D", "Duplicate selected"],
  ["⌫ / Del", "Delete selected"],
  ["Esc", "Deselect / cancel placing"],
  ["?", "Toggle this help"],
];

/** Global keyboard shortcuts for the editor + a ? help overlay. Reads/acts via
 *  store.getState() so it never re-renders on store changes. */
export default function KeyboardShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    initHistory();
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable)) return;

      const s = useStudio.getState();
      const hasSelection = !!(s.selectedId || s.selectedWallId || s.selectedZoneId);

      // ⌘/Ctrl combos: undo/redo + copy/paste/duplicate (handled before the
      // "leave OS combos alone" guard below)
      if ((e.metaKey || e.ctrlKey) && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case "z": e.preventDefault(); if (e.shiftKey) redo(); else undo(); return;
          case "y": e.preventDefault(); redo(); return;
          case "c": if (hasSelection) { e.preventDefault(); s.copySelection(); } return;
          case "v": if (s.clipboard) { e.preventDefault(); s.paste(); } return;
          case "d": if (hasSelection) { e.preventDefault(); s.duplicateSelection(); } return;
          default: return; // any other ⌘/Ctrl combo → leave it to the OS / browser
        }
      }
      if (e.altKey) return; // leave alt combos alone

      switch (e.key) {
        case "1": s.setMode("calibrate"); break;
        case "2": if (s.mmPerPx) s.setMode("draw"); else toast.info("Calibrate first (press 1)"); break;
        case "3": s.setMode("select"); break;
        case "w": case "W": if (s.mmPerPx) s.setMode("wall"); else toast.info("Calibrate first (press 1)"); break;
        case "d": case "D": if (!s.mmPerPx) toast.info("Calibrate first (press 1)"); else if (s.walls.length === 0) toast.info("Raise walls first (press W)"); else s.setMode("opening"); break;
        case "f": case "F": if (s.mmPerPx) s.setMode("floorzone"); else toast.info("Calibrate first (press 1)"); break;
        case "Escape":
          if (helpOpen) setHelpOpen(false);
          else if (s.placingProductId) s.cancelPlace();
          else { s.select(null); s.selectWall(null); s.selectZone(null); }
          break;
        case "Backspace":
        case "Delete":
          if (s.selectedId) s.deleteRect(s.selectedId);
          else if (s.selectedWallId) s.deleteWall(s.selectedWallId);
          else if (s.selectedZoneId) s.deleteFloorZone(s.selectedZoneId);
          else break;
          e.preventDefault();
          break;
        case "r": case "R": {
          if (!s.selectedId) break;
          const rect = s.rects.find((r) => r.id === s.selectedId);
          if (rect) {
            const next = (((rect.rotationDeg + (e.shiftKey ? -15 : 15)) % 360) + 360) % 360;
            s.updateRect(s.selectedId, { rotationDeg: next });
          }
          break;
        }
        case "?": setHelpOpen((v) => !v); break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [helpOpen]);

  if (!helpOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
      onClick={() => setHelpOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-line bg-panel p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl text-ink">Keyboard shortcuts</h2>
          <button onClick={() => setHelpOpen(false)} className="text-muted hover:text-ink" title="Close (Esc)">✕</button>
        </div>
        <dl className="flex flex-col gap-2">
          {ROWS.map(([k, label]) => (
            <div key={k} className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted">{label}</dt>
              <dd>
                <kbd className="rounded border border-line bg-raised px-2 py-0.5 font-mono text-[11px] text-ink">{k}</kbd>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">press ? anytime</p>
      </div>
    </div>
  );
}
