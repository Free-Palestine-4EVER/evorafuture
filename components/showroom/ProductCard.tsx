"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { posterFor, type Product } from "@/lib/products";

interface Props {
  product: Product;
  index: number;
  onOpen: (p: Product) => void;
}

export default function ProductCard({ product, index, onOpen }: Props) {
  const { t } = useT();
  return (
    <motion.button
      className="card"
      onClick={() => onOpen(product)}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.07,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      whileHover={{ y: -6 }}
    >
      <div className="card-stage">
        {product.badge && <span className="tag card-badge">{product.badge}</span>}
        <img
          className="card-img"
          src={posterFor(product)}
          alt={`${product.name} — ${product.tagline}`}
          loading="lazy"
        />
        <span className="card-ar">
          <ArDot /> {t("shop_view_ar")}
        </span>
      </div>

      <div className="card-meta">
        <div>
          <h3 className="card-name">{product.name}</h3>
          <p className="card-tag">{product.tagline}</p>
        </div>
      </div>

      <div className="card-dots">
        {product.colorways.map((c) => (
          <span
            key={c.name}
            className="card-dot"
            style={{ background: c.hex }}
            title={c.name}
          />
        ))}
      </div>
    </motion.button>
  );
}

function ArDot() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
