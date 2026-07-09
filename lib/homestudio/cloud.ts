// Cloud sync for the Evora 3D Home Studio.
// The studio runs inside the same Next app as the client portal, so the portal
// API is same-origin (/api/portal/*). This talks to the shared projects store:
//   • sign in as an Evora designer (e.g. bakri@evorafuture.com)
//   • save / open the current studio room to the database (re-editable)
//   • pull LiDAR room scans the mobile app uploaded, straight into the studio

import type { ProjectFile } from "./store";
import type { Project, PortalUser } from "@/lib/portal/types";
import { scanToProject, type ScanFile } from "./importScan";

const API = "/api/portal";
const SESSION_KEY = "evora-studio-user";

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

// ---- auth (persisted in localStorage so a refresh keeps you signed in) -------

export function currentUser(): PortalUser | null {
  if (typeof localStorage === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
}

export async function signIn(identifier: string, password: string): Promise<PortalUser> {
  const user = await api<PortalUser>("signin", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function signOut() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

// ---- projects ---------------------------------------------------------------

export async function listProjects(): Promise<Project[]> {
  return api<Project[]>("projects");
}

// Save the current studio room to the database. Reuses the same DB id on
// re-save so a project is updated in place, not duplicated.
export async function saveProject(opts: {
  id?: string;
  title: string;
  doc: ProjectFile;
  user: PortalUser;
}): Promise<Project> {
  const payload: Partial<Project> = {
    id: opts.id,
    title: opts.title || "Untitled room",
    ownerUid: opts.user.uid,
    ownerPhone: opts.user.phone || "",
    ownerName: opts.user.name,
    status: "draft",
    studioDoc: JSON.stringify(opts.doc),
    thumbnailUrl: opts.doc.planImage || undefined,
  };
  return api<Project>("projects", { method: "POST", body: JSON.stringify(payload) });
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
