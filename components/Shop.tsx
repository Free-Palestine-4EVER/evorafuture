"use client";

import { useState } from "react";
import { useT, type Lang } from "@/lib/i18n";
import { products, CATEGORIES, formatPrice, posterFor, type Category } from "@/lib/products";
import { Rise, RevealLines, Stagger, StaggerItem, motion } from "@/components/motion";

const CAT_AR: Record<Category, string> = {
  Sofas: "الكنب",
  Seating: "الجلوس",
  Tables: "الطاولات",
  Storage: "التخزين",
  Bedroom: "غرف النوم",
};
const BADGE_AR: Record<string, string> = {
  New: "جديد",
  Bestseller: "الأكثر مبيعًا",
  Limited: "محدود",
};
const catLabel = (c: Category, lang: Lang) => (lang === "ar" ? CAT_AR[c] : c);

export default function Shop() {
  const { t, lang } = useT();
  const [active, setActive] = useState<Category | "all">("all");

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);
  const tabs: ("all" | Category)[] = ["all", ...CATEGORIES];

  return (
    <section className="section shop" style={{ paddingTop: "clamp(7rem, 13vh, 10rem)" }}>
      <div className="container">
        {/* header */}
        <div style={{ maxWidth: 720, marginBottom: "2.4rem" }}>
          <Rise as="span" className="eyebrow" style={{ color: "var(--brass)", display: "block" }}>{t("shop_page_eyebrow")}</Rise>
          <RevealLines lines={[t("shop_page_title")]} className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.6rem)", margin: "1rem 0 0" }} />
          <Rise delay={0.12}>
            <p style={{ color: "var(--ink-soft)", maxWidth: "52ch", marginTop: "1.2rem" }}>{t("shop_page_sub")}</p>
          </Rise>
        </div>

        {/* filter bar */}
        <Rise delay={0.16}>
          <div className="shop-filters" role="tablist">
            {tabs.map((c) => {
              const on = active === c;
              const label = c === "all" ? t("shop_all") : catLabel(c, lang);
              return (
                <button key={c} role="tab" aria-selected={on} data-cursor="hover"
                  className={`shop-tab ${on ? "on" : ""}`} onClick={() => setActive(c)}>
                  {label}
                  {on && <motion.span layoutId="shop-underline" className="shop-tab-underline" />}
                </button>
              );
            })}
            <span className="shop-count">{filtered.length} {t("shop_pieces")}</span>
          </div>
        </Rise>

        {/* grid — keyed by category so it re-staggers on filter change */}
        <Stagger key={active} className="shop-grid" gap={0.045}>
          {filtered.map((p) => (
            <StaggerItem key={p.id} y={22}>
              <a href={`/showroom?p=${p.id}`} className="shop-card" data-cursor="hover">
                <div className="shop-card-img">
                  <img src={posterFor(p)} alt={p.name} loading="lazy" />
                  {p.badge && <span className="shop-badge">{lang === "ar" ? BADGE_AR[p.badge] : p.badge}</span>}
                  <span className="shop-ar">{t("shop_view_ar")} <span aria-hidden>↗</span></span>
                </div>
                <div className="shop-card-meta">
                  <div className="shop-card-head">
                    <span className="shop-cat">{catLabel(p.category, lang)}</span>
                    <span className="shop-price">{formatPrice(p)}</span>
                  </div>
                  <h3 className="shop-name display">{p.name}</h3>
                  <p className="shop-tag">{p.tagline}</p>
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <style>{`
        .shop-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 1.4rem; padding-bottom: 1.1rem; border-bottom: 1px solid var(--line); margin-bottom: 2.6rem; }
        .shop-tab { position: relative; background: none; border: none; cursor: none; font-family: var(--font-sans); font-size: 0.9rem; font-weight: 500; letter-spacing: 0.02em; color: var(--ink-faint); padding: 0.2rem 0; transition: color .3s var(--ease); }
        .shop-tab:hover { color: var(--ink); }
        .shop-tab.on { color: var(--ink); }
        .shop-tab-underline { position: absolute; left: 0; right: 0; bottom: -1.15rem; height: 2px; background: var(--brass); border-radius: 2px; }
        .shop-count { margin-inline-start: auto; font-size: 0.74rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); }

        .shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem 1.6rem; }
        .shop-card { display: block; }
        .shop-card-img { position: relative; aspect-ratio: 4/3; overflow: hidden; border-radius: 4px; background: var(--bone); }
        .shop-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s var(--ease); }
        .shop-card:hover .shop-card-img img { transform: scale(1.06); }
        .shop-badge { position: absolute; top: 0.8rem; inset-inline-start: 0.8rem; background: rgba(251,247,240,0.92); backdrop-filter: blur(6px); color: var(--ink); font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; padding: 0.35em 0.7em; border-radius: 100px; }
        .shop-ar { position: absolute; bottom: 0.8rem; inset-inline-start: 0.8rem; display: inline-flex; align-items: center; gap: 0.4rem; background: var(--ink); color: var(--paper); font-size: 0.72rem; font-weight: 500; padding: 0.55em 0.9em; border-radius: 100px; opacity: 0; transform: translateY(8px); transition: opacity .4s var(--ease), transform .4s var(--ease); }
        .shop-card:hover .shop-ar { opacity: 1; transform: translateY(0); }
        .shop-card-meta { padding: 0.95rem 0.1rem 0; }
        .shop-card-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
        .shop-cat { font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-faint); }
        .shop-price { font-size: 0.95rem; font-weight: 600; color: var(--ever-2); }
        .shop-name { font-size: 1.35rem; margin: 0.35rem 0 0.15rem; color: var(--ink); }
        .shop-tag { font-size: 0.86rem; color: var(--ink-faint); margin: 0; }

        @media (max-width: 560px) { .shop-grid { grid-template-columns: 1fr 1fr; gap: 1.4rem 1rem; } .shop-name { font-size: 1.1rem; } }
      `}</style>
    </section>
  );
}
