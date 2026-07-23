// Cloud sync for the Evora 3D Home Studio.
// The studio runs inside the same Next app as the client portal, so the portal
// API is same-origin (/api/portal/*). Auth is handled once, at the page level
// (the studio route is gated behind an admin login — see evora3dstudio/page.tsx)
// — this module does NOT sign in separately. It talks to the shared projects
// store to:
//   • save / open the current studio room to the database (re-editable)
//   • pull LiDAR room scans the mobile app uploaded, straight into the studio
//   • assign a scan or a saved room to the client it belongs to

import type { ProjectFile } from "./store";
import type { Project, PortalUser } from "@/lib/portal/types";
import { scanToProject, type ScanFile } from "./importScan";

const API = "/api/portal";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// ---- projects ---------------------------------------------------------------

export async function listProjects(): Promise<Project[]> {
  return api<Project[]>("projects");
}

export async function listClients(): Promise<PortalUser[]> {
  return api<PortalUser[]>("clients");
}

// Save the current studio room to the database. Reuses the same DB id on
// re-save so a project is updated in place, not duplicated. `owner` is
// whichever client this room belongs to; pass the signed-in staff member for
// a work-in-progress room that hasn't been assigned to a client yet.
export async function saveProject(opts: {
  id?: string;
  title: string;
  doc: ProjectFile;
  owner: PortalUser;
}): Promise<Project> {
  const payload: Partial<Project> = {
    id: opts.id,
    title: opts.title || "Untitled room",
    ownerUid: opts.owner.uid,
    ownerPhone: opts.owner.phone || "",
    ownerName: opts.owner.name,
    status: "draft",
    studioDoc: JSON.stringify(opts.doc),
    thumbnailUrl: opts.doc.planImage || undefined,
  };
  return api<Project>("projects", { method: "POST", body: JSON.stringify(payload) });
}

// Re-point an existing project (a scan or a saved room) at a different
// client — the piece staff need to "assign an edit to a client" once a scan
// comes in under the wrong owner, or a draft room is ready to hand off.
export async function assignProject(id: string, client: PortalUser): Promise<Project> {
  return api<Project>("projects", {
    method: "POST",
    body: JSON.stringify({ id, ownerUid: client.uid, ownerPhone: client.phone || "", ownerName: client.name }),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await api("projects/" + encodeURIComponent(id), { method: "DELETE" });
}

// ---- turning a stored project into an editable studio document --------------

export type ProjectKind = "studio" | "scan" | "empty";

export function projectKind(p: Project): ProjectKind {
  if (p.studioDoc) return "studio";
  if (p.scanData) return "scan";
  return "empty";
}

// Resolve a stored project into a ProjectFile the studio can load. A studio
// project opens as-is; a LiDAR/web scan is projected into a fresh room.
export function projectToStudioDoc(p: Project): ProjectFile {
  if (p.studioDoc) return JSON.parse(p.studioDoc) as ProjectFile;
  if (p.scanData) return scanToProject(JSON.parse(p.scanData) as ScanFile);
  throw new Error("This project has no editable room or scan data.");
}
