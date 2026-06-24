import PlanEditor from "@/components/puffer/PlanEditor";
import SceneView from "@/components/puffer/SceneView";
import Inspector from "@/components/puffer/Inspector";
import EvoraSync from "@/components/puffer/EvoraSync";
import PufferImport from "@/components/puffer/PufferImport";
import PufferWorkspace from "@/components/puffer/PufferWorkspace";

/* Puffer — the staff tool, in-app at /pufferweb. Example build: turn a 2D plan
 * into a furnished 3D space and save it to a client. (Export/file/scan tools and
 * anything needing an API key are intentionally omitted here.) */
export default function PufferPage() {
  return (
    <main className="flex h-[100dvh] flex-col bg-neutral-950 text-neutral-100">
      <header
        className="flex shrink-0 items-center gap-3 border-b border-neutral-800 px-4 py-2"
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />
        <h1 className="text-sm font-semibold tracking-wide">
          Puffer <span className="text-neutral-500">· Evora · 2D → 3D</span>
        </h1>
        <div className="ml-auto flex items-center gap-3">
          <a href="/admindashboard" className="text-xs text-neutral-400 hover:text-neutral-200">← Admin</a>
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
