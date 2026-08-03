// Shared types for the Evora Client Portal + Admin dashboard.

export type Role = "client" | "admin";

export interface PortalUser {
  uid: string;
  phone: string;
  email?: string;
  name: string;
  role: Role;
}

// A timeline entry an employee posts against a project (visible to the customer).
export interface ProjectUpdate {
  id: string;
  at: number;
  text: string;
  stageKey?: string;
  by?: string;
  imageUrl?: string;
}

// A homepage "design my 2D→3D" enquiry the team reviews + calls to qualify.
export type LeadStatus = "new" | "called" | "qualified" | "rejected" | "converted";
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  planUrl?: string;
  status: LeadStatus;
  sentToPuffer?: boolean;   // admin queued this 2D plan for the Puffer designer
  createdAt: number;
  updatedAt?: number;
}

export type ProjectStatus =
  | "draft"        // saved from Puffer, not yet approved
  | "approved"     // client confirmed "that's my thing"
  | "in_production"
  | "delivered";

export interface Project {
  id: string;
  ownerUid: string;
  ownerPhone: string;
  ownerName?: string;
  title: string;
  room?: string;          // e.g. "Living room", "Master bedroom"
  status: ProjectStatus;
  thumbnailUrl?: string;  // 2D plan render / preview image
  plan2dUrl?: string;     // the original 2D floor plan image
  plan2dPdfUrl?: string;  // dimensioned 2D floor plan as a vector PDF (from the LiDAR app)
  model3dUrl?: string;    // .glb produced by Puffer / live scan (for <model-viewer> src)
  usdzUrl?: string;       // real 3D room scan (.usdz) from the LiDAR app — AR Quick Look + download
  viewerUrl?: string;     // hosted Puffer 3D viewer link (iframe)
  scanData?: string;      // JSON ScanFile from the live web scanner / LiDAR app (re-editable)
  studioDoc?: string;     // JSON ProjectFile from the Evora 3D Home Studio (fully re-editable room)
  sentToPuffer?: boolean;  // a LiDAR scan the app/admin queued for the Puffer designer
  notes?: string;
  approvedByClient?: boolean;
  // Journey: current stage key (see lib/portal/journey.ts) + posted updates.
  stage?: string;
  updates?: ProjectUpdate[];
  createdAt?: number;
  updatedAt?: number;
}

// A desktop-app licence key: one key, one machine. Minted by an admin in
// /admindashboard, redeemed by the Evora Studio .exe / .dmg on first launch.
// See lib/portal/licenses.ts — the key gates the app shell only, the studio
// page inside still requires a normal staff sign-in.
export interface License {
  key: string;             // canonical EVRA-XXXXX-XXXXX-XXXXX-XXXXX
  label: string;           // who it's for, e.g. "Bakri — showroom PC"
  note?: string;
  createdAt: number;
  createdBy?: string;      // admin uid
  updatedAt?: number;
  expiresAt?: number;      // optional hard expiry
  revoked?: boolean;
  machineHash?: string | null;   // sha256 of the machine fingerprint (never the raw MAC)
  machineName?: string | null;   // hostname, for the admin's benefit
  activatedAt?: number | null;
  lastSeenAt?: number;
  appVersion?: string;
}

// The signed blob the desktop app stores and replays on every launch.
export interface LicenseTokenPayload {
  kid: string;   // licence key
  mid: string;   // machine hash
  exp: number;   // unix seconds
}

export const STATUS_LABEL: Record<ProjectStatus, { en: string; ar: string }> = {
  draft: { en: "Awaiting your approval", ar: "بانتظار موافقتك" },
  approved: { en: "Approved", ar: "تمت الموافقة" },
  in_production: { en: "In production", ar: "قيد التنفيذ" },
  delivered: { en: "Delivered", ar: "تم التسليم" },
};
