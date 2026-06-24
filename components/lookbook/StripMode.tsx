"use client";

import { useEffect, useRef } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* v4 — STRIP. A full-size horizontal momentum filmstrip; the centred plate
 * blooms to full scale, neighbours sit smaller and dimmed. Scroll / drag. */
export default function StripMode({
  page, setPage, lang,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const trackRef = useRef<HTMLDivElement>(null);
  const selfSet = useRef(false);

  const onScroll = () => {
    const el = trackRef.current; if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bd = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const n = c as HTMLElement;
      const d = Math.abs(n.offsetLeft + n.offsetWidth / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    if (best !== page) { selfSet.current = true; setPage(best); }
  };

  useEffect(() => {
    if (selfSet.current) { selfSet.current = false; return; }
    (trackRef.current?.children[page] as HTMLElement | undefined)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [page]);

  return (
    <div className="lbst">
      <div className="lbst-track" ref={trackRef} onScroll={onScroll}>
        {Array.from({ length: PAGE_COUNT }).map((_, i) => (
          <div className={`lbst-cell ${i === page ? "is-on" : ""}`} key={i}>
            <div className="lbst-card">
              <img src={pageSrc(i)} alt={en ? `Page ${i + 1}` : `صفحة ${i + 1}`} loading={Math.abs(i - page) < 3 ? "eager" : "lazy"} draggable={false} />
            </div>
            <span className="lbst-cap">{chapterOf(i, lang)} · {String(i + 1).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
