import type { Metadata } from "next";
import Nav from "@/components/Nav";
import CatalogBook from "@/components/CatalogBook";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Lookbook — Evora Future Home | Khalda, Amman",
  description:
    "Browse the Evora 2026 lookbook — an interactive page-flip catalogue of bedrooms, living, sofas, dining and signature pieces.",
};

export default function CatalogPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <CatalogBook />
      <Footer />
    </main>
  );
}
