"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

export default function Showroom() {
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
          <p className="eyebrow">The collection</p>
          <h2 className="display-lg">
            Twenty-nine pieces.
            <br />
            <span className="italic">Your</span> four walls.
          </h2>
        </div>
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter${filter === f ? " on" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
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
