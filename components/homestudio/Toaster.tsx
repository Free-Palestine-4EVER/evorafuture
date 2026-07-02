"use client";

import { useToasts, type ToastKind } from "@/lib/homestudio/toast";

const STYLE: Record<ToastKind, string> = {
  info: "border-line bg-panel text-ink",
  success: "border-clay/60 bg-clay-50 text-ink",
  error: "border-[#7a2d20] bg-[#2a1813] text-[#f0c8bd]",
};
const ICON: Record<ToastKind, string> = { info: "•", success: "✓", error: "⚠" };

export default function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div
      role="region"
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-5 left-1/2 z-[100] flex w-full max-w-[92vw] -translate-x-1/2 flex-col items-center gap-2 sm:max-w-md"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          aria-label={`Dismiss ${t.kind}: ${t.message}`}
          className={`pointer-events-auto flex w-full items-start gap-2.5 rounded-2xl border px-4 py-2.5 text-left text-sm shadow-lg backdrop-blur-sm transition hover:opacity-90 ${STYLE[t.kind]}`}
        >
          <span aria-hidden className={`mt-0.5 shrink-0 ${t.kind === "success" ? "text-clay" : ""}`}>{ICON[t.kind]}</span>
          <span className="whitespace-pre-line font-medium leading-snug">{t.message}</span>
        </button>
      ))}
    </div>
  );
}
