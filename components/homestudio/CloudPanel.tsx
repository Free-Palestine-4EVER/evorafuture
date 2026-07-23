"use client";

import { useCallback, useEffect, useState } from "react";
import { useStudio } from "@/lib/homestudio/store";
import { toast } from "@/lib/homestudio/toast";
import * as cloud from "@/lib/homestudio/cloud";
import { usePortalAuth } from "@/lib/portal/auth";
import type { Project, PortalUser } from "@/lib/portal/types";

/**
 * Cloud panel for the Evora 3D Home Studio.
 * The studio route is already gated behind an admin login (see
 * evora3dstudio/page.tsx) — this panel reuses that same session instead of
 * asking staff to sign in a second time. From here staff can:
 *   • save the current room to the database (re-editable), assigned to a client
 *   • re-open any saved room
 *   • import a LiDAR room scan the mobile app uploaded, straight into the studio
 *   • assign (or reassign) any scan or saved room to the client it belongs to
 */
export default function CloudPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { planImage, serializeProject, loadProject } = useStudio();
  const { user } = usePortalAuth(); // the admin already signed in to open the studio
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(false);

  // the DB id of the project currently loaded, so re-saving updates in place
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  // project id whose "assign to client" picker is open
  const [assigning, setAssigning] = useState<string | null>(null);
  // the "save current room" form
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveClientUid, setSaveClientUid] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [ps, cs] = await Promise.all([cloud.listProjects(), cloud.listClients()]);
      setProjects(ps);
      setClients(cs);
    } catch (e) {
      toast.error((e as Error).message || "Couldn't reach the cloud.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  if (!open || !user) return null;

  function openSaveForm() {
    setSaveTitle("Evora room — " + new Date().toLocaleDateString());
    setSaveClientUid("");
    setSaveOpen(true);
  }

  async function confirmSave(e: React.FormEvent) {
    e.preventDefault();
    if (!planImage || !user) return;
    const owner = clients.find((c) => c.uid === saveClientUid) || user;
    setSaving(true);
    try {
      const saved = await cloud.saveProject({ id: activeId, title: saveTitle, doc: serializeProject(), owner });
      setActiveId(saved.id);
      setSaveOpen(false);
      toast.success("Saved to cloud — " + saved.title);
      refresh();
    } catch (e) {
      toast.error((e as Error).message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function openProject(p: Project) {
    try {
      loadProject(cloud.projectToStudioDoc(p));
      setActiveId(p.studioDoc ? p.id : undefined); // a scan opens as a fresh, unsaved room
      toast.success((cloud.projectKind(p) === "scan" ? "Scan imported — " : "Opened — ") + (p.title || "room"));
      onClose();
    } catch (e) {
      toast.error((e as Error).message || "Couldn't open that project.");
    }
  }

  async function remove(p: Project) {
    if (!window.confirm(`Delete "${p.title || "this room"}" from the cloud? This can't be undone.`)) return;
    try {
      await cloud.deleteProject(p.id);
      if (activeId === p.id) setActiveId(undefined);
      toast.success("Deleted");
      refresh();
    } catch (e) {
      toast.error((e as Error).message || "Delete failed.");
    }
  }

  async function assignTo(p: Project, client: PortalUser) {
    try {
      await cloud.assignProject(p.id, client);
      setAssigning(null);
      toast.success(`Assigned "${p.title || "this room"}" to ${client.name || client.phone}`);
      refresh();
    } catch (e) {
      toast.error((e as Error).message || "Couldn't assign that project.");
    }
  }

  const scans = projects.filter((p) => cloud.projectKind(p) === "scan");
  const rooms = projects.filter((p) => cloud.projectKind(p) !== "scan");

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center gap-3 border-b border-line p-3">
          <div className="min-w-0">
            <h2 className="font-display text-lg text-ink">☁ Cloud projects</h2>
            <p className="text-xs text-muted">Signed in as {user.name || user.email}</p>
          </div>
          <button onClick={onClose} className="ml-auto rounded-md px-2 py-1.5 text-muted hover:text-ink" aria-label="Close">✕</button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-line p-3">
            {saveOpen ? (
              <form onSubmit={confirmSave} className="flex w-full flex-wrap items-center gap-2">
                <input
                  autoFocus
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="Name this room"
                  className="min-w-0 flex-1 rounded-md border border-line bg-raised px-2.5 py-1.5 text-sm text-ink outline-none focus:border-clay"
                />
                <select
                  value={saveClientUid}
                  onChange={(e) => setSaveClientUid(e.target.value)}
                  className="rounded-md border border-line bg-raised px-2.5 py-1.5 text-sm text-ink outline-none focus:border-clay"
                >
                  <option value="">Unassigned (my draft)</option>
                  {clients.map((c) => (
                    <option key={c.uid} value={c.uid}>{c.name || c.phone}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={saving || !saveTitle}
                  className="rounded-md bg-clay px-3 py-1.5 text-sm font-semibold text-clay-ink transition hover:opacity-90 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setSaveOpen(false)}
                  className="rounded-md border border-line px-2.5 py-1.5 text-sm text-muted transition hover:bg-raised hover:text-ink"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <button
                  onClick={openSaveForm}
                  disabled={!planImage}
                  title={planImage ? "Save the current room to the cloud" : "Open or draw a plan first"}
                  className="rounded-md bg-clay px-3 py-1.5 text-sm font-semibold text-clay-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {activeId ? "⬆ Update in cloud" : "⬆ Save room to cloud"}
                </button>
                <button
                  onClick={refresh}
                  className="rounded-md border border-line px-2.5 py-1.5 text-sm text-muted transition hover:bg-raised hover:text-ink"
                >
                  ↻ Refresh
                </button>
              </>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {loading && <p className="p-4 text-center text-sm text-muted">Loading…</p>}
            {!loading && projects.length === 0 && (
              <p className="p-6 text-center text-sm text-muted">No projects yet. Save a room, or upload a scan from the mobile app.</p>
            )}

            {/* LiDAR scans from the app */}
            {scans.length > 0 && (
              <>
                <p className="mb-2 mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">📱 Room scans from the app</p>
                <ul className="mb-4 flex flex-col gap-2">
                  {scans.map((p) => (
                    <ProjectRow
                      key={p.id} p={p} scan clients={clients} activeId={activeId}
                      assigning={assigning === p.id}
                      onOpen={() => openProject(p)}
                      onDelete={() => remove(p)}
                      onToggleAssign={() => setAssigning(assigning === p.id ? null : p.id)}
                      onAssign={(c) => assignTo(p, c)}
                    />
                  ))}
                </ul>
              </>
            )}

            {/* saved studio rooms */}
            {rooms.length > 0 && (
              <>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">🗂 Studio exports — saved rooms</p>
                <ul className="flex flex-col gap-2">
                  {rooms.map((p) => (
                    <ProjectRow
                      key={p.id} p={p} clients={clients} activeId={activeId}
                      assigning={assigning === p.id}
                      onOpen={() => openProject(p)}
                      onDelete={() => remove(p)}
                      onToggleAssign={() => setAssigning(assigning === p.id ? null : p.id)}
                      onAssign={(c) => assignTo(p, c)}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectRow({
  p, scan, clients, activeId, assigning, onOpen, onDelete, onToggleAssign, onAssign,
}: {
  p: Project;
  scan?: boolean;
  clients: PortalUser[];
  activeId?: string;
  assigning: boolean;
  onOpen: () => void;
  onDelete: () => void;
  onToggleAssign: () => void;
  onAssign: (client: PortalUser) => void;
}) {
  const thumb = p.thumbnailUrl || p.plan2dUrl;
  return (
    <li className="flex flex-col gap-2 rounded-lg border border-line bg-raised p-2">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-panel">
          {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <span className="text-lg">{scan ? "📱" : "🏠"}</span>}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-ink">
            {p.title || "Untitled room"}
            {activeId === p.id && <span className="ml-2 rounded-full bg-clay-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-clay">open</span>}
          </p>
          <p className="truncate text-[11px] text-muted">
            {scan ? "LiDAR scan · " : ""}
            {p.ownerName || p.ownerPhone || "Unassigned"}
            {p.updatedAt ? " · " + new Date(p.updatedAt).toLocaleDateString() : ""}
          </p>
        </div>
        <button
          onClick={onToggleAssign}
          title="Assign this room to a client"
          className={`shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${
            assigning ? "border-clay bg-clay text-clay-ink" : "border-line text-muted hover:bg-panel hover:text-ink"
          }`}
        >
          👤 Assign
        </button>
        <button
          onClick={onOpen}
          className="shrink-0 rounded-md border border-clay bg-clay-50 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-clay hover:text-clay-ink"
        >
          {scan ? "Import" : "Open"}
        </button>
        <button
          onClick={onDelete}
          title="Delete from cloud"
          className="shrink-0 rounded-md px-2 py-1.5 text-muted transition hover:text-red-400"
        >
          🗑
        </button>
      </div>
      {assigning && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-2">
          <span className="text-[11px] text-muted">Assign to:</span>
          {clients.length === 0 ? (
            <span className="text-[11px] text-faint">No clients yet — add one from the admin dashboard.</span>
          ) : (
            <select
              defaultValue=""
              onChange={(e) => {
                const c = clients.find((c) => c.uid === e.target.value);
                if (c) onAssign(c);
              }}
              className="rounded-md border border-line bg-panel px-2 py-1 text-xs text-ink outline-none focus:border-clay"
            >
              <option value="" disabled>Choose a client…</option>
              {clients.map((c) => (
                <option key={c.uid} value={c.uid}>{c.name || c.phone}</option>
              ))}
            </select>
          )}
        </div>
      )}
    </li>
  );
}
