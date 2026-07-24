import type { Metadata } from "next";

// /shop/rooms is a "use client" page, so it cannot export metadata itself.
export const metadata: Metadata = {
  title: "Shop by Room — Living, Dining, Bedroom | Evora Future Home",
  description:
    "Furnish a whole room at once. Browse Evora by living room, dining, bedroom, majlis and outdoor — every piece made to order and delivered across Jordan.",
  alternates: { canonical: "/shop/rooms" },
  openGraph: {
    title: "Shop by Room — Evora Future Home",
    description: "Furnish a whole room at once — living, dining, bedroom, majlis and outdoor.",
    url: "/shop/rooms",
  },
};

export default function ShopRoomsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
