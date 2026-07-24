import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop the Collection — Furniture in Amman | Evora Future Home",
  description:
    "Browse 346 pieces — sofas, dining, bedrooms, lighting and built-in closets. Every piece made to order and finished by hand, delivered across Jordan from our Khalda showroom.",
  alternates: { canonical: "/shop" },
  openGraph: { title: "Shop the Collection — Evora Future Home", description: "346 pieces, made to order and finished by hand. Delivered across Jordan.", url: "/shop" },
};

import Nav from "@/components/Nav";
import ShopFeatured from "@/components/ShopFeatured";
import CategoryRail from "@/components/CategoryRail";
import Shop from "@/components/Shop";
import Footer from "@/components/Footer";

export default function ShopPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <ShopFeatured />
      <CategoryRail />
      <Shop />
      <Footer />
    </main>
  );
}
