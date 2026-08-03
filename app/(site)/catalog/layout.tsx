import type { Metadata } from "next";

// page.tsx is a client component (it has to decide desktop-vs-mobile at
// runtime — see the comment there), so the metadata lives here, the same
// pattern /kitchen uses.
export const metadata: Metadata = {
  title: "The Lookbook — Evora Future Home | Khalda, Amman",
  description:
    "Browse the ARGOS · Interior Design by Evora lookbook — 31 pages of bedrooms, dressing rooms, majlis, dining and lounges.",
  alternates: { canonical: "/catalog" },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
