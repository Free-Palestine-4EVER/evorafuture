import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Evora Future Home — Furniture & Interior Design in Khalda, Amman",
  description:
    "See every room of your home in 3D before a single piece is made. Furniture, built-in closets and full interior design — designed, crafted and delivered under one roof in Khalda, Amman.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Evora Future Home — See your home before it exists",
    description:
      "Walk every room in 3D before a single piece is made. Furniture and interior design, all under one roof in Khalda, Amman.",
    url: "/",
  },
};

// Home now uses hero film C — the new full-quality scroll-scrubbed walk-through
// (same film as /v3). /v3 is kept as-is.
export default function Home() {
  return <SiteShell heroVariant="c" showConfigurator />;
}
