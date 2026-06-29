"use client";

import { useState, type ReactNode } from "react";

/* Responsive shell for the Evora Future Studio tool.
 * ≥ lg (1024px, e.g. iPad landscape / desktop): the original 3-column layout.
 * < lg (iPad portrait / iPhone): one full-screen pane at a time with a bottom
 *   tab bar — so every pane is big enough to actually use with fingers. */

type Tab = "plan" | "scene" | "inspector";

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  {
    id: "plan",
    label: "2D Plan",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="1.5" />
        <path d="M3 9h7M10 3v6M10 14v7M14 14h7" />
      </svg>
    ),
  },
  {
    id: "scene",
    label: "3D View",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 2l8 4.5v9L12 22l-8-6.5v-9z" />
        <path d="M12 2v9l8 4.5M12 11L4 15.5" />
      </svg>
    ),
  },
  {
    id: "inspector",
    label: "Details",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 7h16M4 12h16M4 17h10" />
      </svg>
    ),
  },
];

export default function PufferWorkspace({
  plan,
  scene,
  inspector,
}: {
  plan: ReactNode;
  scene: ReactNode;
  inspector: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("plan");
  const show = (id: Tab) => (tab === id ? "flex" : "hidden") + " lg:flex";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="grid min-h-0 flex-1 lg:grid-cols-[1fr_minmax(280px,1fr)_300px]"
        style={{ paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}
      >
        <section className={`min-w-0 min-h-0 flex-col overflow-hidden border-neutral-800 lg:border-r ${show("plan")}`}>
          {plan}
        </section>
        <section className={`min-w-0 min-h-0 flex-col overflow-hidden border-neutral-800 lg:border-r ${show("scene")}`}>
          {scene}
        </section>
        <aside className={`min-w-0 min-h-0 flex-col overflow-hidden ${show("inspector")}`}>
          {inspector}
        </aside>
      </div>

      {/* bottom tab bar — only on touch / narrow screens */}
      <nav
        className="flex shrink-0 border-t border-neutral-800 bg-neutral-900/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={active}
              style={{ touchAction: "manipulation" }}
              className={`flex min-h-[48px] flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                active ? "text-[var(--brass-2)]" : "text-neutral-400 active:text-neutral-200"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
