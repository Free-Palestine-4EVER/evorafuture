// Carries the customer (name + phone) from an imported design request into the
// "Save to Evora" panel, so saving auto-assigns to that client.

export interface ImportLead { name?: string; phone?: string }

let current: ImportLead | null = null;

export function setImportLead(l: ImportLead | null) {
  current = l;
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("evora-import-lead", { detail: l }));
}
export function getImportLead(): ImportLead | null { return current; }
