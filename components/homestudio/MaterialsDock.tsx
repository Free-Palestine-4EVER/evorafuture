"use client";

import { useStudio } from "@/lib/homestudio/store";
import { SurfaceMat, MATERIALS, MATERIAL_CATEGORIES, materialDef } from "@/lib/homestudio/textures";
import { detectRooms } from "@/lib/homestudio/roomDetect";
import { toast } from "@/lib/homestudio/toast";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-2.5 py-1 text-xs font-medium transition ${
        active ? "bg-clay text-clay-ink" : "bg-raised border border-line text-ink hover:bg-clay-50"
      }`}
    >
      {children}
    </button>
  );
}

function UploadChip({ active, onChange, children }: {
  active: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; children: React.ReactNode;
}) {
  return (
    <label className={`cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition ${
      active ? "bg-clay text-clay-ink" : "bg-raised border border-line text-ink hover:bg-clay-50"
    }`}>
      {children}
      <input type="file" accept="image/*" className="hidden" onChange={onChange} />
    </label>
  );
}

const WALL_PAINTS = ["#eef2f7", "#e8ddc7", "#cfd6da", "#cbd9c9", "#d8c9d6", "#b9c4b0", "#d9b48f", "#3f4a5a"];

// label + colour preview for the current surface material
function matLabel(m: SurfaceMat): { text: string; color: string } {
  if (m.kind === "plan") return { text: "Blueprint", color: "#1f2937" };
  if (m.kind === "image") return { text: "Photo", color: "#444" };
  if (m.kind === "color") return { text: "Paint", color: m.color };
  return { text: materialDef(m.id)?.name ?? "Material", color: materialDef(m.id)?.base ?? "#888" };
}

// a collapsible picker: blueprint (floor) · paint colours · photo · material library
function MatField({ label, value, onChange, allowBlueprint }: {
  label: string; value: SurfaceMat; onChange: (m: SurfaceMat) => void; allowBlueprint?: boolean;
}) {
  const cur = matLabel(value);
  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => onChange({ kind: "image", src: r.result as string });
    r.readAsDataURL(f); e.target.value = "";
  };
  return (
    <details className="group rounded border border-line bg-raised">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-2.5 py-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-faint">{label}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="h-4 w-4 rounded border border-line" style={{ background: cur.color }} />
          <span className="text-xs text-ink">{cur.text}</span>
          <span className="text-clay transition group-open:rotate-180">▾</span>
        </span>
      </summary>
      <div className="max-h-56 space-y-2 overflow-auto border-t border-line p-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {allowBlueprint && <Chip active={value.kind === "plan"} onClick={() => onChange({ kind: "plan" })}>Blueprint</Chip>}
          <UploadChip active={value.kind === "image"} onChange={upload}>Photo…</UploadChip>
        </div>
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wide text-faint">Paint</div>
          <div className="flex flex-wrap gap-1.5">
            {WALL_PAINTS.map((c) => (
              <button key={c} onClick={() => onChange({ kind: "color", color: c })} title={c} style={{ background: c }}
                className={`h-6 w-6 rounded border ${value.kind === "color" && value.color === c ? "border-clay ring-2 ring-clay/40" : "border-line"}`} />
            ))}
          </div>
        </div>
        {MATERIAL_CATEGORIES.map((cat) => (
          <div key={cat}>
            <div className="mb-1 text-[10px] uppercase tracking-wide text-faint">{cat}</div>
            <div className="flex flex-wrap gap-1.5">
              {MATERIALS.filter((m) => m.category === cat).map((m) => (
                <button key={m.id} onClick={() => onChange({ kind: "material", id: m.id })} title={m.name} style={{ background: m.base }}
                  className={`h-6 w-6 rounded border ${value.kind === "material" && value.id === m.id ? "border-clay ring-2 ring-clay/40" : "border-line"}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

/**
 * Always-visible Floors · Walls · Materials dock, pinned to the bottom of the
 * left (2D plan) column so the most-used controls are one click away.
 */
export default function MaterialsDock() {
  const { floorMat, wallMat, setFloorMat, setWallMat, mode, setMode, mmPerPx, walls, imgW, imgH, addFloorZones } = useStudio();
  const zoneActive = mode === "floorzone";

  function findRooms() {
    if (!mmPerPx) return;
    if (!walls.length) { toast.info("Raise walls first (② Walls → ⚡ Auto-walls), then find rooms."); return; }
    const rooms = detectRooms(walls, imgW, imgH, mmPerPx);
    if (!rooms.length) { toast.info("Couldn't split rooms — the walls may not fully enclose them. Draw zones with ▦ + Floor zone."); return; }
    addFloorZones(rooms);
    toast.success(`Found ${rooms.length} room${rooms.length === 1 ? "" : "s"} — pick a floor for each (delete any that look wrong).`);
  }

  return (
    <div className="flex h-full flex-col gap-2.5 overflow-auto bg-panel p-3">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Floors · Walls · Materials</span>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={findRooms}
          disabled={!mmPerPx || !walls.length}
          title={!mmPerPx ? "Calibrate the plan first" : !walls.length ? "Raise walls first (⚡ Auto-walls)" : "Auto-detect each room and drop a floor zone for it — then pick a tile per room"}
          className={`flex-1 rounded px-2.5 py-1 text-xs font-medium transition bg-raised border border-line text-ink hover:bg-clay-50 ${(!mmPerPx || !walls.length) ? "cursor-not-allowed opacity-40" : ""}`}
        >
          🔲 Find rooms
        </button>
        <button
          onClick={() => setMode(zoneActive ? "select" : "floorzone")}
          disabled={!mmPerPx}
          title={mmPerPx ? "Paint a per-room floor: drag a box on the plan — it snaps to the walls" : "Calibrate the plan first"}
          className={`flex-1 rounded px-2.5 py-1 text-xs font-medium transition ${
            zoneActive ? "bg-clay text-clay-ink" : "bg-raised border border-line text-ink hover:bg-clay-50"
          } ${!mmPerPx ? "cursor-not-allowed opacity-40" : ""}`}
        >
          ▦ {zoneActive ? "Drawing zone… (Esc)" : "+ Floor zone"}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <MatField label="Floor" value={floorMat} onChange={setFloorMat} allowBlueprint />
        <MatField label="Walls" value={wallMat} onChange={setWallMat} />
      </div>
    </div>
  );
}
