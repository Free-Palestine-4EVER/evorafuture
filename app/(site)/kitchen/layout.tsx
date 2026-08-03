import type { Metadata } from "next";

// /kitchen is a "use client" page (it renders ConfiguratorScroll, which needs
// hooks), so it cannot export metadata itself. This layout carries it instead
// — same pattern as /showroom.
export const metadata: Metadata = {
  title: "Kitchen Configurator — Design Your Bespoke Island | Evora Future Home",
  description:
    "Fly through an Evora kitchen island, then pick your stone and watch it re-render live. Every island is cut to order in our own workshop in Khalda, Amman.",
  alternates: { canonical: "/kitchen" },
  openGraph: {
    title: "Design your kitchen island — live, in 3D",
    description:
      "Choose the marble, the finish, the proportions — and watch the island change as you decide. Built to order in Amman.",
    url: "/kitchen",
  },
};

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
