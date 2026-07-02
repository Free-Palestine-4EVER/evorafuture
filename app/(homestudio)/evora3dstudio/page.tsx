"use client";

import { useEffect, useRef, useState } from "react";
import { useStudio } from "@/lib/homestudio/store";
import { useHistory } from "@/lib/homestudio/history";
import Welcome from "@/components/homestudio/Welcome";
import PlanEditor from "@/components/homestudio/PlanEditor";
import SceneView from "@/components/homestudio/SceneView";
import Inspector from "@/components/homestudio/Inspector";
import ExportMenu from "@/components/homestudio/ExportMenu";
import ProjectIO from "@/components/homestudio/ProjectIO";
import KeyboardShortcuts from "@/components/homestudio/KeyboardShortcuts";

export default function EvoraHomeStudio() {
  const planImage = useStudio((s) => s.planImage);
  const roomScan = useStudio((s) => s.roomScan);
  const selectedId = useStudio((s) => s.selectedId);
  const selectedWallId = useStudio((s) => s.selectedWallId);
  const selectedZoneId = useStudio((s) => s.selectedZoneId);
  const mmPerPx = useStudio((s) => s.mmPerPx);
  // 3D is the landscape hero; the 2D plan slides up as a bottom drawer, the
  // inspector is a collapsible right rail.
  const [planOpen, setPlanOpen] = useState(true);
  const [planH, setPlanH] = useState(0.6); // drawer height as a fraction of the stage
  const [rightOpen, setRightOpen] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const { canUndo, canRedo, undo, redo } = useHistory();

  // selecting anything pops the inspector open so its editor is visible
  useEffect(() => {
    if (selectedId || selectedWallId || selectedZoneId) setRightOpen(true);
  }, [selectedId, selectedWallId, selectedZoneId]);

  // a freshly-loaded, not-yet-calibrated plan needs room to work → open the
  // drawer tall so the plan is big enough to calibrate & draw on comfortably
  useEffect(() => {
    if (planImage && !mmPerPx) { setPlanOpen(true); setPlanH(0.8); }
  }, [planImage, mmPerPx]);

  // drag the drawer's grab-handle to set its height (fraction of the stage)
  function startDrawerResize(e: React.PointerEvent) {
    e.preventDefault();
    const onMove = (ev: PointerEvent) => {
      const el = stageRef.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const frac = (box.bottom - ev.clientY) / box.height;
      setPlanH(Math.min(0.92, Math.max(0.18, frac)));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  // First-run: full-screen welcome until a plan or room scan is loaded.
  if (!planImage && !roomScan) return <Welcome />;

  return (
    <main className="flex h-screen flex-col bg-paper text-ink">
      <KeyboardShortcuts />
      <header className="flex items-center gap-4 border-b border-line bg-panel px-5 py-3">
        {/* wordmark — Evora Home Studio (ƎVORΛ in metallic bronze-gold) */}
        <div className="flex items-baseline gap-2.5">
          <span className="wordmark-gold font-display text-[25px] font-semibold leading-none tracking-[0.16em]">
            ƎVORΛ
          </span>
          <span className="font-display text-[12px] font-medium uppercase tracking-[0.34em] text-muted">
            Home Studio
          </span>
        </div>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.28em] text-faint sm:inline">
          furnished-plan studio
        </span>

        <div className="ml-auto flex items-center gap-2.5">
          {/* undo / redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo (⌘Z)"
              className="rounded-full border border-line px-2.5 py-1 text-sm leading-none text-ink transition hover:bg-raised disabled:cursor-not-allowed disabled:opacity-30"
            >↶</button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo (⌘⇧Z)"
              className="rounded-full border border-line px-2.5 py-1 text-sm leading-none text-ink transition hover:bg-raised disabled:cursor-not-allowed disabled:opacity-30"
            >↷</button>
          </div>

          {/* toggle the plan drawer & the inspector rail (3D fills the rest) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPlanOpen((v) => !v)}
              title={planOpen ? "Hide the 2D plan drawer (full 3D)" : "Show the 2D plan drawer"}
              className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition ${
                planOpen ? "border-clay bg-clay-50 text-ink" : "border-line text-muted hover:bg-raised"
              }`}
            >▤ Plan</button>
            <button
              onClick={() => setRightOpen((v) => !v)}
              title={rightOpen ? "Hide the inspector panel (bigger 3D)" : "Show the inspector panel"}
              className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition ${
                rightOpen ? "border-clay bg-clay-50 text-ink" : "border-line text-muted hover:bg-raised"
              }`}
            >Panel ▥</button>
          </div>

          <ProjectIO />
          <ExportMenu />
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}
            title="Keyboard shortcuts"
            className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition hover:bg-raised"
          >
            ?
          </button>
          <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-faint">
            v0
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* stage: 3D hero on top, the 2D plan drawer splitting in below it (so the
            3D always frames itself in the space above — never hidden by the plan) */}
        <div ref={stageRef} className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-canvas">
          <div className="min-h-0 flex-1 overflow-hidden">
            <SceneView />
          </div>

          {planOpen ? (
            <section
              className="relative z-10 flex shrink-0 flex-col border-t border-line bg-panel shadow-2xl"
              style={{ height: `${planH * 100}%` }}
            >
              {/* drawer chrome: grab-handle to resize + maximize + hide */}
              <div className="flex shrink-0 items-center gap-2 border-b border-line bg-raised px-3 py-1.5">
                <button
                  onPointerDown={startDrawerResize}
                  title="Drag to resize the plan"
                  className="flex flex-1 cursor-ns-resize items-center justify-center py-1"
                >
                  <span className="block h-1 w-10 rounded-full bg-line" />
                </button>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">🗺 Plan</span>
                <button
                  onClick={() => setPlanH((h) => (h > 0.8 ? 0.5 : 0.9))}
                  title="Maximize / restore the plan"
                  className="rounded-full border border-line px-2 py-0.5 text-xs text-muted transition hover:bg-clay-50 hover:text-ink"
                >{planH > 0.8 ? "⤡" : "⤢"}</button>
                <button
                  onClick={() => setPlanOpen(false)}
                  title="Hide the plan drawer"
                  className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted transition hover:bg-clay-50 hover:text-ink"
                >▾ Hide</button>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden">
                <PlanEditor />
              </div>
            </section>
          ) : (
            <button
              onClick={() => setPlanOpen(true)}
              title="Open the 2D plan to calibrate, draw walls & furnish"
              className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-clay bg-clay px-4 py-2 text-sm font-semibold text-clay-ink shadow-lg transition hover:opacity-90"
            >🗺 Plan ▴</button>
          )}
        </div>

        {/* right inspector rail (collapsible — pushes, never covers the 3D HUD) */}
        <aside
          className="min-h-0 shrink-0 overflow-hidden border-l border-line bg-panel transition-[width] duration-200"
          style={{ width: rightOpen ? 340 : 0 }}
        >
          <div className="h-full w-[340px]">
            <Inspector />
          </div>
        </aside>
      </div>
    </main>
  );
}
