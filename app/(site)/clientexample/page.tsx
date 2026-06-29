import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ClientExample from "@/components/ClientExample";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Featured Pieces in 3D — Evora",
  description:
    "Two of Evora's featured pieces — the Cream Chesterfield and the Bold Orange Lounge — shown in photograph and in interactive 3D.",
};

export default function ClientExamplePage() {
  return (
    <main>
      <Nav pinnedSolid />
      <div className="nav-spacer" />
      <ClientExample />
      <Footer />
    </main>
  );
}
