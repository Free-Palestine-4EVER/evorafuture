import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DesignRequest from "@/components/DesignRequest";

export const metadata: Metadata = {
  title: "Design my home — Send your 2D plan | Evora Future Home",
  description: "Upload your 2D floor plan and Evora will design your home in 3D — furniture, photoreal renders, production and delivery.",
};

export default function StartPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <div style={{ paddingTop: 78 }} />
      <DesignRequest />
      <Footer />
    </main>
  );
}
