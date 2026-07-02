import { create } from "zustand";

export type ToastKind = "info" | "success" | "error";
export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  push: (kind: ToastKind, message: string) => void;
  dismiss: (id: number) => void;
}

let _id = 0;
const _timers = new Map<number, ReturnType<typeof setTimeout>>();

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  push: (kind, message) => {
    const id = ++_id;
    set((s) => ({ toasts: [...s.toasts, { id, kind, message }] }));
    // long / multi-step messages need time to read (errors linger longer)
    const ttl = Math.max(kind === "error" ? 6000 : 3500, message.length * 55);
    _timers.set(id, setTimeout(() => {
      _timers.delete(id);
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, ttl));
  },
  dismiss: (id) => {
    const tm = _timers.get(id);
    if (tm) { clearTimeout(tm); _timers.delete(id); }
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

/** Imperative helper for non-React callers (event handlers, catch blocks). */
export const toast = {
  info: (m: string) => useToasts.getState().push("info", m),
  success: (m: string) => useToasts.getState().push("success", m),
  error: (m: string) => useToasts.getState().push("error", m),
};
