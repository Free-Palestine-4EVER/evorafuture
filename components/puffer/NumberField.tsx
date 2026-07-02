"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A numeric input that opens a custom in-app numpad instead of the OS keyboard.
 * Built for iPad/touch (a bottom-sheet pad you can thumb) but also accepts
 * physical-keyboard typing on desktop while the pad is open. The display is a
 * button (never a focusable text input), so iOS never raises its own keyboard.
 */
export function NumberField({
  value,
  onChange,
  onSubmit,
  placeholder = "",
  suffix,
  submitLabel = "Done",
  decimal = true,
  autoFocusPad = false,
  className = "",
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  placeholder?: string;
  suffix?: string;
  submitLabel?: string;
  decimal?: boolean;
  autoFocusPad?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const draft = useRef(value);
  draft.current = value;

  const close = useCallback(() => setOpen(false), []);

  const press = useCallback(
    (k: string) => {
      const cur = draft.current || "";
      let next = cur;
      if (k === "back") next = cur.slice(0, -1);
      else if (k === "clear") next = "";
      else if (k === ".") {
        if (decimal && !cur.includes(".")) next = cur === "" ? "0." : cur + ".";
      } else {
        // digit
        next = cur + k;
      }
      draft.current = next;
      onChange(next);
    },
    [decimal, onChange]
  );

  const submit = useCallback(() => {
    onSubmit?.(draft.current);
    setOpen(false);
  }, [onSubmit]);

  // physical keyboard support while the pad is open (desktop)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") { press(e.key); e.preventDefault(); }
      else if (e.key === "." || e.key === ",") { press("."); e.preventDefault(); }
      else if (e.key === "Backspace") { press("back"); e.preventDefault(); }
      else if (e.key === "Enter") { submit(); e.preventDefault(); }
      else if (e.key === "Escape") { close(); e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, press, submit, close]);

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", decimal ? "." : "", "0", "back"];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel || placeholder || "number"}
        className={
          className ||
          "min-h-[40px] rounded bg-neutral-800 px-3 py-2 text-left text-white tabular-nums"
        }
      >
        {value !== "" ? (
          <>
            {value}
            {suffix ? <span className="ml-1 text-neutral-400">{suffix}</span> : null}
          </>
        ) : (
          <span className="text-neutral-500">{placeholder}</span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close numpad"
            className="absolute inset-0 bg-black/50"
            onClick={close}
          />
          <div className="relative z-10 w-full max-w-sm rounded-t-2xl bg-neutral-900 p-3 shadow-2xl ring-1 ring-white/10 sm:rounded-2xl">
            {/* live value display */}
            <div className="mb-3 flex items-baseline justify-between rounded-lg bg-neutral-800 px-4 py-3">
              <span className="text-2xl font-medium tabular-nums text-white">
                {value || <span className="text-neutral-500">{placeholder || "0"}</span>}
              </span>
              {suffix ? <span className="text-sm text-neutral-400">{suffix}</span> : null}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {keys.map((k, i) =>
                k === "" ? (
                  <span key={i} />
                ) : (
                  <button
                    key={i}
                    type="button"
                    onClick={() => press(k)}
                    className="flex min-h-[52px] items-center justify-center rounded-lg bg-neutral-800 text-xl font-medium text-white transition active:scale-95 active:bg-neutral-700"
                  >
                    {k === "back" ? "⌫" : k}
                  </button>
                )
              )}
            </div>

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => press("clear")}
                className="min-h-[48px] flex-1 rounded-lg bg-neutral-800 font-medium text-neutral-300 transition active:scale-95"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={submit}
                className="min-h-[48px] flex-[2] rounded-lg bg-amber-600 font-semibold text-white transition active:scale-95 hover:bg-amber-500"
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
