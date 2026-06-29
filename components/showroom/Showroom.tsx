"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import ProductCard from "./ProductCard";
import ProductDialog from "./ProductDialog";
import {
  CATEGORIES,
  getProduct,
  products,
  type Category,
  type Product,
} from "@/lib/products";

type Filter = "All" | Category;
const FILTERS: Filter[] = ["All", ...CATEGORIES];

const T = {
  eyebrow: { en: "The collection", ar: "المجموعة" },
  heading_a: { en: "Twenty-nine pieces.", ar: "تسعٌ وعشرون قطعة." },
  heading_em: { en: "Your", ar: "جدرانك" },
  heading_b: { en: " four walls.", ar: " الأربعة." },
};

const CAT_AR: Record<Category, string> = {
  Sofas: "كنب",
  Seating: "مقاعد",
  Tables: "طاولات",
  Storage: "تخزين",
  Bedroom: "غرف نوم",
};

export default function Showroom() {
  const { lang, t } = useT();
  const tl = (k: keyof typeof T) => T[k][lang];
  const filterLabel = (f: Filter) =>
    f === "All" ? t("shop_all") : lang === "ar" ? CAT_AR[f] : f;
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<Product | null>(null);

  // Deep link: /?p=oslo-sofa opens that product (used by the QR hand-off).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("p");
    if (id) {
      const p = getProduct(id);
      if (p) setActive(p);
    }
  }, []);

  const shown = useMemo(
    () => (filter === "All" ? products : products.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section id="showroom" className="shell showroom">
      <div className="showroom-head">
        <div>
          <p className="eyebrow">{tl("eyebrow")}</p>
          <h2 className="display-lg">
            {tl("heading_a")}
            <br />
            <span className="italic">{tl("heading_em")}</span>
            {tl("heading_b")}
          </h2>
        </div>
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter${filter === f ? " on" : ""}`}
              onClick={() => setFilter(f)}
            >
              {filterLabel(f)}
              <span className="filter-n">
                {f === "All"
                  ? products.length
                  : products.filter((p) => p.category === f).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div layout key={p.id} exit={{ opacity: 0, scale: 0.96 }}>
              <ProductCard product={p} index={i} onOpen={setActive} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {active && (
          <ProductDialog product={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
