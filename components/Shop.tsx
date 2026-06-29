"use client";

import { useMemo, useState } from "react";
import { useT, type Lang } from "@/lib/i18n";
import { products, posterFor, productCopy, type Category, type Product } from "@/lib/products";
import {
  getTaxNode,
  resolveSlug,
  normalizeSlug,
  categoriesIn,
  CATEGORY_SLUG,
} from "@/lib/shopTaxonomy";
import { WHATSAPP } from "@/lib/brand";
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

type Sort = "featured" | "az";

// Plain left-click (no modifier) — so tabs filter in place, but cmd/ctrl/middle
// click still opens the real /shop/<slug> URL in a new tab.
const plainClick = (e: React.MouseEvent) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

export default function Shop({ seed }: { seed?: string }) {
  const { t, lang } = useT();
  const en = lang === "en";

  // The route param seeds the view; with no seed we show the full catalogue.
  const node = seed ? getTaxNode(seed) : null;
  const base = seed ? resolveSlug(seed) : products;
  const seedSlug = seed ? normalizeSlug(seed) : null;

  const [active, setActive] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [open, setOpen] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = active === "all" ? base : base.filter((p) => p.category === active);
    if (q) {
      list = list.filter((p) => {
        const ar = productCopy(p, "ar");
        return [
          p.name, p.tagline, p.category, p.description, p.materials.join(" "),
          ar.tagline, ar.description,
        ].join(" ").toLowerCase().includes(q);
      });
    }
    if (sort === "az") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [active, query, sort, base]);

  // tabs = "all" + the categories actually present in this view, as real URLs
  const tabs: ("all" | Category)[] = ["all", ...categoriesIn(base)];
  const tabHref = (c: "all" | Category) =>
    c === "all" ? (seedSlug ? `/shop/${seedSlug}` : "/shop") : `/shop/${CATEGORY_SLUG[c]}`;
  const onTab = (e: React.MouseEvent, c: "all" | Category) => {
    if (plainClick(e)) {
      e.preventDefault();
      setActive(c);
    }
  };
  const staggerKey = `${seedSlug ?? "all"}|${active}|${sort}|${query}`;

  // header copy — taxonomy label when seeded, default catalogue copy otherwise
  const eyebrow = node
    ? node.kind === "room"
      ? t("shop_rooms_eyebrow")
      : t("shop_page_eyebrow")
    : t("shop_page_eyebrow");
  const title = node ? (en ? node.labelEN : node.labelAR) : t("shop_page_title");
  const sub = node ? (en ? node.noteEN : node.noteAR) : t("shop_page_sub");

  // soft bucket / nothing to show ⇒ the enquire card (never an empty grid)
  const isEnquire = base.length === 0;
  const waEnquire = node
    ? `${WHATSAPP}?text=${encodeURIComponent(
        en
          ? `Hi Evora! I'd love to see your ${node.labelEN} in the Khalda showroom.`
          : `مرحبًا إيفورا! أودّ أن أشاهد ${node.labelAR} في معرض خلدا.`
      )}`
    : WHATSAPP;

  return (
    <section className="section shop" style={{ paddingTop: "clamp(7rem, 13vh, 10rem)" }}>
      <div className="container">
        {/* header */}
        <div style={{ maxWidth: 760, marginBottom: "2.4rem" }}>
          {seedSlug && (
            <Rise as="nav" className="shop-crumbs" delay={0.02}>
              <a href="/shop" data-cursor="hover">{t("shop_view_all")}</a>
              <span aria-hidden>·</span>
              <a href="/shop/rooms" data-cursor="hover">{t("shop_rooms_eyebrow")}</a>
            </Rise>
          )}
          <Rise as="span" className="eyebrow" style={{ color: "var(--brass)", display: "block" }}>{eyebrow}</Rise>
          <RevealLines lines={[title]} className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.6rem)", margin: "1rem 0 0" }} />
          <Rise delay={0.12}>
            <p style={{ color: "var(--ink-soft)", maxWidth: "52ch", marginTop: "1.2rem" }}>{sub}</p>
          </Rise>
        </div>

        {isEnquire ? (
          /* ── soft bucket: enquire-in-showroom card, never an empty grid ── */
          <Rise delay={0.1}>
            <div className="shop-enquire">
              <div className="shop-enquire-media">
                {node && <img src={node.image} alt={en ? node.labelEN : node.labelAR} loading="lazy" />}
                <span className="shop-enquire-scrim" />
              </div>
              <div className="shop-enquire-body">
                <span className="eyebrow" style={{ color: "var(--brass)" }}>{node ? (en ? node.labelEN : node.labelAR) : ""}</span>
                <p className="shop-enquire-lead">{t("shop_empty_enquire")}</p>
                <div className="shop-enquire-cta">
                  <a href="/visit" className="shop-enquire-btn shop-enquire-btn--dark" data-cursor="hover">{t("consult")}</a>
                  <a href={waEnquire} target="_blank" rel="noopener noreferrer" className="shop-enquire-btn shop-enquire-btn--ghost" data-cursor="hover">{t("shop_showroom_cta")}</a>
                  <a href="/shop" className="shop-enquire-link" data-cursor="hover">{t("shop_view_all")} <span aria-hidden>→</span></a>
                </div>
              </div>
            </div>
          </Rise>
        ) : (
          <>
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
                    <option value="az">{t("shop_sort_az")}</option>
                  </select>
                </label>
              </div>
            </Rise>

            {/* filter bar — every tab is a real /shop/<slug> URL */}
            <Rise delay={0.18}>
              <div className="shop-filters" role="tablist">
                {tabs.map((c) => {
                  const on = active === c;
                  const label = c === "all" ? t("shop_all") : catLabel(c, lang);
                  return (
                    <a key={c} href={tabHref(c)} role="tab" aria-selected={on} data-cursor="hover"
                      className={`shop-tab ${on ? "on" : ""}`} onClick={(e) => onTab(e, c)}>
                      {label}
                      {on && <motion.span layoutId="shop-underline" className="shop-tab-underline" />}
                    </a>
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
                        </div>
                        <h3 className="shop-name display">{p.name}</h3>
                        <p className="shop-tag">{productCopy(p, lang).tagline}</p>
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
          </>
        )}
      </div>

      <AnimatePresence>
        {open && <ShopQuickView key={open.id} product={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>

      <style>{`
        .shop-crumbs { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.9rem; font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
        .shop-crumbs a { color: var(--ink-faint); transition: color .3s var(--ease); }
        .shop-crumbs a:hover { color: var(--ink); }

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
        .shop-tab { position: relative; background: none; border: none; cursor: none; font-family: var(--font-sans); font-size: 0.9rem; font-weight: 500; letter-spacing: 0.02em; color: var(--ink-faint); padding: 0.2rem 0; transition: color .3s var(--ease); text-decoration: none; }
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
        .shop-name { font-size: 1.35rem; margin: 0.35rem 0 0.15rem; color: var(--ink); }
        .shop-tag { font-size: 0.86rem; color: var(--ink-faint); margin: 0; }
        .shop-swatches { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.7rem; }
        .shop-swatch { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.12); box-shadow: inset 0 0 0 1.5px var(--paper); }
        .shop-swatch-n { margin-inline-start: 0.35rem; font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); }

        .shop-empty { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 5rem 0; text-align: center; color: var(--ink-faint); }
        .shop-empty p { font-family: var(--font-display); font-size: 1.4rem; color: var(--ink-soft); margin: 0; }
        .shop-clear { background: var(--ink); color: var(--paper); border: none; border-radius: 100px; padding: 0.75rem 1.4rem; font-size: 0.82rem; font-weight: 500; cursor: none; transition: background .3s var(--ease); }
        .shop-clear:hover { background: var(--ever); }

        /* enquire-in-showroom card (soft buckets: chandeliers, lighting, rugs, outdoor, kitchen) */
        .shop-enquire { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(1.4rem, 3vw, 3rem); align-items: stretch; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--bone); }
        .shop-enquire-media { position: relative; min-height: 320px; }
        .shop-enquire-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .shop-enquire-scrim { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(22,21,15,0.18), transparent 60%); }
        .shop-enquire-body { display: flex; flex-direction: column; justify-content: center; gap: 1.1rem; padding: clamp(1.8rem, 4vw, 3.4rem); }
        .shop-enquire-lead { font-family: var(--font-display); font-size: clamp(1.4rem, 2.6vw, 2rem); line-height: 1.3; color: var(--ink); margin: 0; }
        .shop-enquire-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.7rem; margin-top: 0.4rem; }
        .shop-enquire-btn { display: inline-flex; align-items: center; border-radius: 100px; padding: 0.8rem 1.4rem; font-size: 0.84rem; font-weight: 500; cursor: none; transition: background .3s var(--ease), color .3s var(--ease), border-color .3s var(--ease); }
        .shop-enquire-btn--dark { background: var(--ink); color: var(--paper); }
        .shop-enquire-btn--dark:hover { background: var(--ever); }
        .shop-enquire-btn--ghost { border: 1px solid var(--line); color: var(--ink); }
        .shop-enquire-btn--ghost:hover { border-color: var(--ink); }
        .shop-enquire-link { font-size: 0.82rem; font-weight: 500; color: var(--brass); cursor: none; }
        html[dir="rtl"] .shop-enquire-link span { display: inline-block; transform: scaleX(-1); }

        @media (max-width: 720px) { .shop-enquire { grid-template-columns: 1fr; } .shop-enquire-media { min-height: 220px; } .shop-enquire-btn { min-height: 44px; } }

        @media (max-width: 640px) {
          /* search + sort: full-width, 16px text so iOS doesn't zoom, ≥44px tap */
          .shop-controls { gap: 0.8rem; margin-bottom: 1.3rem; }
          .shop-search { max-width: none; flex-basis: 100%; min-height: 44px; }
          .shop-search input { font-size: 16px; }
          .shop-sort { margin-inline-start: 0; }
          .shop-sort select { font-size: 16px; min-height: 44px; }
          /* filter bar → edge-to-edge horizontally scrollable strip */
          .shop-filters { flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; gap: 1.3rem;
            -webkit-overflow-scrolling: touch; scrollbar-width: none;
            margin-inline: calc(-1 * var(--gut)); padding-inline: var(--gut); margin-bottom: 2.2rem; }
          .shop-filters::-webkit-scrollbar { display: none; }
          .shop-tab { flex: 0 0 auto; white-space: nowrap; min-height: 44px; display: inline-flex; align-items: center; }
          .shop-count { flex: 0 0 auto; margin-inline-start: 0.4rem; align-self: center; }
          /* the quick-view label is hover-only on desktop; reveal it on touch */
          .shop-qv { opacity: 1; transform: none; }
        }

        @media (max-width: 560px) { .shop-grid { grid-template-columns: 1fr 1fr; gap: 1.4rem 1rem; } .shop-name { font-size: 1.1rem; } }

        /* small phones: 2-col → a single generous, tap-friendly column */
        @media (max-width: 430px) {
          .shop-grid { grid-template-columns: 1fr; gap: 1.6rem; }
          .shop-name { font-size: 1.35rem; }
          .shop-card-img { aspect-ratio: 3/2; }
          .shop-clear { min-height: 44px; }
        }
      `}</style>
    </section>
  );
}
