// Local mock backend used when Firebase keys are not configured yet.
// Persists to localStorage so the portal behaves like a real account system
// (login, saved projects, admin edits) for demos and design review.

import type { PortalUser, Project } from "./types";

const LS_USERS = "evora_portal_users";
const LS_PROJECTS = "evora_portal_projects";
const LS_SESSION = "evora_portal_session";

interface StoredUser extends PortalUser {
  password: string;
}

function seed() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(LS_USERS)) {
    const users: StoredUser[] = [
      { uid: "demo-client", phone: "client", name: "Rana Haddad", role: "client", password: "client" },
      { uid: "demo-admin", phone: "admin", name: "Evora Studio", role: "admin", password: "admin" },
    ];
    localStorage.setItem(LS_USERS, JSON.stringify(users));
  }
  if (!localStorage.getItem(LS_PROJECTS)) {
    const now = Date.now();
    const projects: Project[] = [
      {
        id: "p1", ownerUid: "demo-client", ownerPhone: "client", ownerName: "Rana Haddad",
        title: "Khalda Apartment — Living Room", room: "Living room", status: "approved",
        thumbnailUrl: "/evora/p07.jpg", plan2dUrl: "/evora/p07.jpg",
        viewerUrl: "", model3dUrl: "",
        notes: "Cream Chesterfield sofa, walnut console, brass accents.",
        approvedByClient: true, createdAt: now - 86400000 * 9, updatedAt: now - 86400000 * 2,
      },
      {
        id: "p2", ownerUid: "demo-client", ownerPhone: "client", ownerName: "Rana Haddad",
        title: "Master Bedroom Suite", room: "Master bedroom", status: "in_production",
        thumbnailUrl: "/evora/p03.jpg", plan2dUrl: "/evora/p03.jpg",
        notes: "Built-in wardrobe wall + upholstered headboard.",
        approvedByClient: true, createdAt: now - 86400000 * 6, updatedAt: now - 86400000,
      },
      {
        id: "p3", ownerUid: "demo-client", ownerPhone: "client", ownerName: "Rana Haddad",
        title: "Dining Concept (from Puffer)", room: "Dining", status: "draft",
        thumbnailUrl: "/evora/p11.jpg", plan2dUrl: "/evora/p11.jpg",
        notes: "10-seat oak table, awaiting your sign-off.",
        approvedByClient: false, createdAt: now - 86400000 * 1, updatedAt: now - 3600000 * 5,
      },
    ];
    localStorage.setItem(LS_PROJECTS, JSON.stringify(projects));
  }
}

function readUsers(): StoredUser[] {
  seed();
  try { return JSON.parse(localStorage.getItem(LS_USERS) || "[]"); } catch { return []; }
}
function writeUsers(u: StoredUser[]) { localStorage.setItem(LS_USERS, JSON.stringify(u)); }
function readProjects(): Project[] {
  seed();
  try { return JSON.parse(localStorage.getItem(LS_PROJECTS) || "[]"); } catch { return []; }
}
function writeProjects(p: Project[]) { localStorage.setItem(LS_PROJECTS, JSON.stringify(p)); }

const strip = (u: StoredUser): PortalUser => ({ uid: u.uid, phone: u.phone, name: u.name, role: u.role });

export const mockBackend = {
  signIn(phone: string, password: string): PortalUser {
    // Match by phone digits when present, else by the raw handle (e.g. the
    // demo "client" / "admin" logins) — case-insensitive.
    const norm = (s: string) => { const d = s.replace(/[^\d]/g, ""); return d.length ? d : s.trim().toLowerCase(); };
    const user = readUsers().find((u) => norm(u.phone) === norm(phone) && u.password === password);
    if (!user) throw new Error("INVALID_CREDENTIALS");
    localStorage.setItem(LS_SESSION, user.uid);
    return strip(user);
  },
  signOut() { localStorage.removeItem(LS_SESSION); },
  current(): PortalUser | null {
    if (typeof window === "undefined") return null;
    const uid = localStorage.getItem(LS_SESSION);
    if (!uid) return null;
    const user = readUsers().find((u) => u.uid === uid);
    return user ? strip(user) : null;
  },
  listForUser(uid: string): Project[] {
    return readProjects().filter((p) => p.ownerUid === uid).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  },
  listAll(): Project[] {
    return readProjects().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  },
  listClients(): PortalUser[] {
    return readUsers().filter((u) => u.role === "client").map(strip);
  },
  saveProject(p: Project): Project {
    const all = readProjects();
    const i = all.findIndex((x) => x.id === p.id);
    const stamped = { ...p, updatedAt: Date.now(), createdAt: p.createdAt || Date.now() };
    if (i >= 0) all[i] = stamped; else all.unshift(stamped);
    writeProjects(all);
    return stamped;
  },
  deleteProject(id: string) { writeProjects(readProjects().filter((p) => p.id !== id)); },
  createClient(phone: string, name: string, password: string): PortalUser {
    const users = readUsers();
    const norm = phone.replace(/[^\d]/g, "");
    if (users.some((u) => u.phone.replace(/[^\d]/g, "") === norm)) throw new Error("PHONE_EXISTS");
    const u: StoredUser = { uid: "c" + norm, phone, name, role: "client", password };
    users.push(u); writeUsers(users);
    return strip(u);
  },
  approve(id: string) {
    const all = readProjects();
    const i = all.findIndex((x) => x.id === id);
    if (i >= 0) { all[i] = { ...all[i], status: "approved", approvedByClient: true, updatedAt: Date.now() }; writeProjects(all); }
  },
  newId() { return "p" + Math.abs(Date.now()).toString(36); },
};
