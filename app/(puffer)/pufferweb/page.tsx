import PlanEditor from "@/components/puffer/PlanEditor";
import SceneView from "@/components/puffer/SceneView";
import Inspector from "@/components/puffer/Inspector";
import EvoraSync from "@/components/puffer/EvoraSync";
import PufferImport from "@/components/puffer/PufferImport";
import PufferWorkspace from "@/components/puffer/PufferWorkspace";
import Monogram from "@/components/brand/Monogram";

/* Evora Future Studio — the staff tool, in-app at /pufferweb. Example build:
 * design a room in 3D from a 2D plan and save it to a client. (Export/file/scan
 * tools and anything needing an API key are intentionally omitted here.) */
export default function PufferPage() {
  return (
    <main className="flex h-[100dvh] flex-col bg-[var(--ink)] text-[var(--paper)]">
      <header
        className="flex shrink-0 items-center gap-3 border-b border-[var(--line)] px-4 py-2"
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        <Monogram tone="brass" title="Evora Future Studio" className="h-5 w-5 shrink-0" />
        <h1 className="text-sm font-semibold tracking-wide">
          Evora <span className="text-[var(--brass-2)]">Future Studio</span>
        </h1>
        <div className="ml-auto flex items-center gap-3">
          <a href="/admindashboard" className="text-xs text-[var(--paper-soft)] hover:text-[var(--paper)]">← Admin</a>
          <PufferImport />
          <EvoraSync />
        </div>
      </header>

      <PufferWorkspace
        plan={<PlanEditor />}
        scene={<SceneView />}
        inspector={<Inspector />}
      />
    </main>
  );
}
