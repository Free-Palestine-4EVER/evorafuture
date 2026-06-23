// Shared types for the Evora Client Portal + Admin dashboard.

export type Role = "client" | "admin";

export interface PortalUser {
  uid: string;
  phone: string;
  name: string;
  role: Role;
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
  model3dUrl?: string;    // .glb produced by Puffer (for <model-viewer>)
  viewerUrl?: string;     // hosted Puffer 3D viewer link (iframe)
  notes?: string;
  approvedByClient?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export const STATUS_LABEL: Record<ProjectStatus, { en: string; ar: string }> = {
  draft: { en: "Awaiting your approval", ar: "بانتظار موافقتك" },
  approved: { en: "Approved", ar: "تمت الموافقة" },
  in_production: { en: "In production", ar: "قيد التنفيذ" },
  delivered: { en: "Delivered", ar: "تم التسليم" },
};
