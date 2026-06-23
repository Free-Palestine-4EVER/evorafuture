"use client";

import { useMemo, useState } from "react";
import { useT, type Lang } from "@/lib/i18n";
import { products, CATEGORIES, formatPrice, posterFor, type Category, type Product } from "@/lib/products";
import { Rise, RevealLines, Stagger, StaggerItem, motion } from "@/components/motion";
import ShopQuickView, { AnimatePresence } from "@/components/ShopQuickView";

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

type Sort = "featured" | "price_asc" | "price_desc" | "az";

export default function Shop() {
  const { t, lang } = useT();
  const [active, setActive] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [open, setOpen] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = active === "all" ? products : products.filter((p) => p.category === active);
    if (q) {
      list = list.filter((p) =>
        [p.name, p.tagline, p.category, p.description, p.materials.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    if (sort !== "featured") {
      list = [...list].sort((a, b) =>
        sort === "price_asc" ? a.price - b.price
        : sort === "price_desc" ? b.price - a.price
        : a.name.localeCompare(b.name)
      );
    }
    return list;
  }, [active, query, sort]);

  const tabs: ("all" | Category)[] = ["all", ...CATEGORIES];
  const staggerKey = `${active}|${sort}|${query}`;

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

        {/* controls: search + sort */}
        <Rise delay={0.14}>
          <div className="shop-controls">
            <label className="shop-search" data-cursor="hover">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("shop_search_ph")}
                aria-label={t("shop_search_ph")}
              />
            </label>
            <label className="shop-sort">
              <span>{t("shop_sort")}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} data-cursor="hover" aria-label={t("shop_sort")}>
                <option value="featured">{t("shop_sort_featured")}</option>
                <option value="price_asc">{t("shop_sort_price_asc")}</option>
                <option value="price_desc">{t("shop_sort_price_desc")}</option>
                <option value="az">{t("shop_sort_az")}</option>
              </select>
            </label>
          </div>
        </Rise>

        {/* filter bar */}
        <Rise delay={0.18}>
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

        {/* grid — keyed so it re-staggers on any filter/sort/search change */}
        {filtered.length > 0 ? (
          <Stagger key={staggerKey} className="shop-grid" gap={0.045}>
            {filtered.map((p) => (
              <StaggerItem key={p.id} y={22}>
                <button type="button" className="shop-card" data-cursor="hover" onClick={() => setOpen(p)}
                  aria-label={`${t("shop_quickview")} — ${p.name}`}>
                  <div className="shop-card-img">
                    <img src={posterFor(p)} alt={p.name} loading="lazy" />
                    {p.badge && <span className="shop-badge">{lang === "ar" ? BADGE_AR[p.badge] : p.badge}</span>}
                    <span className="shop-qv">{t("shop_quickview")} <span aria-hidden>↗</span></span>
                  </div>
                  <div className="shop-card-meta">
                    <div className="shop-card-head">
                      <span className="shop-cat">{catLabel(p.category, lang)}</span>
                      <span className="shop-price">{formatPrice(p)}</span>
                    </div>
                    <h3 className="shop-name display">{p.name}</h3>
                    <p className="shop-tag">{p.tagline}</p>
                    <div className="shop-swatches" aria-hidden>
                      {p.colorways.slice(0, 5).map((c) => (
                        <span key={c.name} className="shop-swatch" style={{ background: c.hex }} />
                      ))}
                      <span className="shop-swatch-n">{p.colorways.length} {t("shop_finishes")}</span>
                    </div>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="shop-empty">
            <p>{t("shop_no_results")}</p>
            <button className="shop-clear" data-cursor="hover" onClick={() => { setQuery(""); setActive("all"); setSort("featured"); }}>
              {t("shop_clear")}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && <ShopQuickView key={open.id} product={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>

      <style>{`
        .shop-controls { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; margin-bottom: 1.6rem; }
        .shop-search { display: inline-flex; align-items: center; gap: 0.6rem; flex: 1; min-width: 240px; max-width: 420px; padding: 0.7rem 1.05rem; border: 1px solid var(--line); border-radius: 100px; color: var(--ink-faint); background: var(--paper); transition: border-color .3s var(--ease); }
        .shop-search:focus-within { border-color: var(--ink); color: var(--ink); }
        .shop-search input { flex: 1; border: none; outline: none; background: none; font-family: var(--font-sans); font-size: 0.9rem; color: var(--ink); }
        .shop-search input::placeholder { color: var(--ink-faint); }
        .shop-sort { display: inline-flex; align-items: center; gap: 0.6rem; margin-inline-start: auto; font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
        .shop-sort select { font-family: var(--font-sans); font-size: 0.84rem; letter-spacing: 0; text-transform: none; color: var(--ink); background: var(--paper); border: 1px solid var(--line); border-radius: 100px; padding: 0.55rem 2.2rem 0.55rem 1rem; cursor: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a857c' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.85rem center; transition: border-color .3s var(--ease); }
        html[dir="rtl"] .shop-sort select { padding: 0.55rem 1rem 0.55rem 2.2rem; background-position: left 0.85rem center; }
        .shop-sort select:hover { border-color: var(--ink); }

        .shop-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 1.4rem; padding-bottom: 1.1rem; border-bottom: 1px solid var(--line); margin-bottom: 2.6rem; }
        .shop-tab { position: relative; background: none; border: none; cursor: none; font-family: var(--font-sans); font-size: 0.9rem; font-weight: 500; letter-spacing: 0.02em; color: var(--ink-faint); padding: 0.2rem 0; transition: color .3s var(--ease); }
        .shop-tab:hover { color: var(--ink); }
        .shop-tab.on { color: var(--ink); }
        .shop-tab-underline { position: absolute; left: 0; right: 0; bottom: -1.15rem; height: 2px; background: var(--brass); border-radius: 2px; }
        .shop-count { margin-inline-start: auto; font-size: 0.74rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); }

        .shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem 1.6rem; }
        .shop-card { display: block; width: 100%; text-align: start; background: none; border: none; padding: 0; cursor: none; font: inherit; color: inherit; }
        .shop-card-img { position: relative; aspect-ratio: 4/3; overflow: hidden; border-radius: 4px; background: var(--bone); }
        .shop-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s var(--ease); }
        .shop-card:hover .shop-card-img img { transform: scale(1.06); }
        .shop-badge { position: absolute; top: 0.8rem; inset-inline-start: 0.8rem; background: rgba(251,247,240,0.92); backdrop-filter: blur(6px); color: var(--ink); font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; padding: 0.35em 0.7em; border-radius: 100px; }
        .shop-qv { position: absolute; bottom: 0.8rem; inset-inline-start: 0.8rem; display: inline-flex; align-items: center; gap: 0.4rem; background: var(--ink); color: var(--paper); font-size: 0.72rem; font-weight: 500; padding: 0.55em 0.9em; border-radius: 100px; opacity: 0; transform: translateY(8px); transition: opacity .4s var(--ease), transform .4s var(--ease); }
        .shop-card:hover .shop-qv { opacity: 1; transform: translateY(0); }
        .shop-card-meta { padding: 0.95rem 0.1rem 0; }
        .shop-card-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
        .shop-cat { font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-faint); }
        .shop-price { font-size: 0.95rem; font-weight: 600; color: var(--ever-2); }
        .shop-name { font-size: 1.35rem; margin: 0.35rem 0 0.15rem; color: var(--ink); }
        .shop-tag { font-size: 0.86rem; color: var(--ink-faint); margin: 0; }
        .shop-swatches { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.7rem; }
        .shop-swatch { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.12); box-shadow: inset 0 0 0 1.5px var(--paper); }
        .shop-swatch-n { margin-inline-start: 0.35rem; font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); }

        .shop-empty { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 5rem 0; text-align: center; color: var(--ink-faint); }
        .shop-empty p { font-family: var(--font-display); font-size: 1.4rem; color: var(--ink-soft); margin: 0; }
        .shop-clear { background: var(--ink); color: var(--paper); border: none; border-radius: 100px; padding: 0.75rem 1.4rem; font-size: 0.82rem; font-weight: 500; cursor: none; transition: background .3s var(--ease); }
        .shop-clear:hover { background: var(--ever); }

        @media (max-width: 560px) { .shop-grid { grid-template-columns: 1fr 1fr; gap: 1.4rem 1rem; } .shop-name { font-size: 1.1rem; } .shop-sort { margin-inline-start: 0; } .shop-search { max-width: none; } }
      `}</style>
    </section>
  );
}
