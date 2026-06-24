import type { Metadata } from "next";
import Nav from "@/components/Nav";
import LookbookApp from "@/components/lookbook/LookbookApp";

export const metadata: Metadata = {
  title: "The Lookbook — Evora Future Home | Khalda, Amman",
  description:
    "Browse the ARGOS · Interior Design by Evora lookbook — a 31-page book of bedrooms, dressing rooms, majlis, dining and lounges, in three interactive views: Book, Reel and Gallery.",
};

export default function CatalogPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <LookbookApp />
    </main>
  );
}
