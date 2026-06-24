import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ProcessJourney from "@/components/ProcessJourney";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "How it works — Evora",
  description:
    "From a bare 2D blueprint to your finished home: furnished in 2D, built in interactive 3D, rendered photoreal for your sign-off — then produced while you track every stage live in your dashboard.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <div style={{ paddingTop: 78 }} />
      <ProcessJourney />
      <Footer />
    </main>
  );
}
