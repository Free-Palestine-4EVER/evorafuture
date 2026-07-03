"use client";

import { useEffect } from "react";

// Shared modal behaviour: close on Escape and lock body scroll while open.
// Every portal dialog (ProjectForm, ProjectManage, ClientDetail, AddClient,
// ProjectViewer) should call this so keyboard users can always dismiss and the
// page behind the overlay doesn't scroll.
export function useDialogClose(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
}
