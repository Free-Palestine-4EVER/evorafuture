import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visit the Showroom — Khalda, Amman | Evora Future Home",
  description:
    "Two floors of furniture on Wasfi Al-Tal St, Khalda — opposite Paradise Bakeries. Open Sat-Thu 10:00-22:00. Free parking, Arabic coffee, and a designer to walk you through it.",
  alternates: { canonical: "/visit" },
  openGraph: { title: "Visit the Evora Showroom — Khalda, Amman", description: "Wasfi Al-Tal St, Khalda. Sat-Thu 10:00-22:00. Free parking and Arabic coffee on us.", url: "/visit" },
};

import Nav from "@/components/Nav";
import Visit from "@/components/Visit";
import DesignRequest from "@/components/DesignRequest";
import Footer from "@/components/Footer";

export default function VisitPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <div className="nav-spacer" />
      <Visit />
      <DesignRequest />
      <Footer />
    </main>
  );
}
