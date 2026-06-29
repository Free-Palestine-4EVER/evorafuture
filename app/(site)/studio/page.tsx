import type { Metadata } from "next";
import "./studio.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StudioPresentation from "@/components/studio/StudioPresentation";

export const metadata: Metadata = {
  title: "Evora Future Studio — See your home in 3D before it exists",
  description:
    "Bring us your floor plan. Evora designs every room in 3D, you walk through it, and only when you approve do we build it — under one roof in Khalda, Amman, complimentary with your furnishing.",
  alternates: { canonical: "/studio" },
  openGraph: {
    title: "Evora Future Studio",
    description:
      "See your whole home in 3D before it exists — designed, approved and built under one roof in Amman.",
    type: "website",
    images: [{ url: "/evora/kitchen/stage-4.jpg", width: 1600, height: 1200, alt: "Evora Future Studio — a room designed in 3D" }],
  },
};

export default function StudioPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <StudioPresentation />
      <Footer />
    </main>
  );
}
