import type { Metadata } from "next";

// /showroom is a "use client" page, so it cannot export metadata itself.
// This layout carries it instead.
export const metadata: Metadata = {
  title: "AR Showroom — See Evora Furniture in Your Home | Amman",
  description:
    "Point your phone at the room and place real Evora pieces in it, at true scale, before you buy. No app to install — three taps in your browser.",
  alternates: { canonical: "/showroom" },
  openGraph: {
    title: "AR Showroom — See it in your own room first",
    description: "Place real Evora furniture in your room at true scale, straight from your phone browser.",
    url: "/showroom",
  },
};

export default function ShowroomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
