import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Visit — Showroom in Khalda, Amman | Evora Future Home",
  description:
    "Book a visit to our two-floor showroom on Wasfi Al-Tal St, Khalda — opposite Paradise Bakeries. Open Sat-Thu 10:00-22:00, Friday by appointment. Walk in, or reserve a time with a designer.",
  alternates: { canonical: "/visit" },
  openGraph: { title: "Book a Visit — Evora Showroom, Khalda", description: "Two floors of finished rooms on Wasfi Al-Tal St, Khalda. Sat-Thu 10:00-22:00, Friday by appointment.", url: "/visit" },
};

import Nav from "@/components/Nav";
import Visit from "@/components/Visit";
import VisitBooking from "@/components/visit/VisitBooking";
import Footer from "@/components/Footer";

export default function VisitPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <div className="nav-spacer" />
      {/* pageTop: this band opens the page directly under the fixed nav, so it
          uses the tight top beat instead of a full section pad. The same
          component sits mid-page on the homepage (components/SiteShell.tsx),
          where the default roomy padding is still what's wanted. */}
      <Visit pageTop />
      <VisitBooking />
      <Footer />
    </main>
  );
}
