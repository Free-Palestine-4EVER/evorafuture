"use client";

import { useCallback, useEffect, useState } from "react";
import { useStudio } from "@/lib/homestudio/store";
import { toast } from "@/lib/homestudio/toast";
import * as cloud from "@/lib/homestudio/cloud";
import type { Project, PortalUser } from "@/lib/portal/types";

/**
 * Cloud panel for the Evora 3D Home Studio.
 * Sign in as an Evora designer, then:
 *   • save the current room to the database (re-editable)
 *   • re-open any saved room
 *   • import a LiDAR room scan the mobile app uploaded, straight into the studio
 */
export default function CloudPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { planImage, serializeProject, loadProject } = useStudio();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // the DB id of the project currently loaded, so re-saving updates in place
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  // sign-in form (prefilled with the studio's designer account)
  const [email, setEmail] = useState("bakri@evorafuture.com");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { setProjects(await cloud.listProjects()); }
    catch (e) { toast.error((e as Error).message || "Couldn't reach the cloud."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!open) return;
    const u = cloud.currentUser();
    setUser(u);
    if (u) refresh();
  }, [open, refresh]);

  if (!open) return null;

  async function doSignIn(e: React.FormEvent) {
    e.preventDefault();
    setSigningIn(true);
    try {
      const u = await cloud.signIn(email.trim(), password);
      setUser(u);
      setPassword("");
      toast.success(`Signed in as ${u.name || u.email}`);
      refresh();
    } catch {
      toast.error("Wrong email or password.");
    } finally {
      setSigningIn(false);
    }
  }

  function signOut() {
    cloud.signOut();
    setUser(null);
    setProjects([]);
    setActiveId(undefined);
  }

  async function save() {
    if (!user || !planImage) return;
    const title = window.prompt("Name this room", "Evora room — " + new Date().toLocaleDateString());
    if (title == null) return;
    try {
      const saved = await cloud.saveProject({ id: activeId, title, doc: serializeProject(), user });
      setActiveId(saved.id);
      toast.success("Saved to cloud — " + saved.title);
      refresh();
    } catch (e) {
      toast.error((e as Error).message || "Save failed.");
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
            <p className="text-xs text-muted">
              {user ? `Signed in as ${user.name || user.email}` : "Sign in to save & load rooms from the Evora database"}
            </p>
          </div>
          {user && (
            <button onClick={signOut} className="ml-auto rounded-md border border-line px-2.5 py-1 text-xs text-muted transition hover:bg-raised hover:text-ink">
              Sign out
            </button>
          )}
          <button onClick={onClose} className={`${user ? "" : "ml-auto"} rounded-md px-2 py-1.5 text-muted hover:text-ink`} aria-label="Close">✕</button>
        </div>

        {/* ---- signed out: login ---- */}
        {!user ? (
          <form onSubmit={doSignIn} className="flex flex-col gap-3 p-5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              className="rounded-md border border-line bg-raised px-3 py-2 text-sm text-ink outline-none focus:border-clay"
              placeholder="you@evorafuture.com"
            />
            <label className="text-xs font-medium uppercase tracking-wide text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-line bg-raised px-3 py-2 text-sm text-ink outline-none focus:border-clay"
              placeholder="••••••••"
            />
            <button
              type="submit"
              disabled={signingIn || !email || !password}
              className="mt-1 rounded-md bg-clay px-4 py-2 text-sm font-semibold text-clay-ink transition hover:opacity-90 disabled:opacity-40"
            >
              {signingIn ? "Signing in…" : "Sign in"}
            </button>
          </form>
        ) : (
          /* ---- signed in: save + browse ---- */
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-2 border-b border-line p-3">
              <button
                onClick={save}
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
                      <ProjectRow key={p.id} p={p} scan onOpen={() => openProject(p)} onDelete={() => remove(p)} activeId={activeId} />
                    ))}
                  </ul>
                </>
              )}

              {/* saved studio rooms */}
              {rooms.length > 0 && (
                <>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">🗂 Saved rooms</p>
                  <ul className="flex flex-col gap-2">
                    {rooms.map((p) => (
                      <ProjectRow key={p.id} p={p} onOpen={() => openProject(p)} onDelete={() => remove(p)} activeId={activeId} />
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectRow({
  p, scan, onOpen, onDelete, activeId,
}: { p: Project; scan?: boolean; onOpen: () => void; onDelete: () => void; activeId?: string }) {
  const thumb = p.thumbnailUrl || p.plan2dUrl;
  return (
    <li className="flex items-center gap-3 rounded-lg border border-line bg-raised p-2">
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
          {p.ownerName || p.ownerPhone || "—"}
          {p.updatedAt ? " · " + new Date(p.updatedAt).toLocaleDateString() : ""}
        </p>
      </div>
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
    </li>
  );
}
