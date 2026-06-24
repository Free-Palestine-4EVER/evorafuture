import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ConfiguratorScroll from "@/components/ConfiguratorScroll";

export const metadata: Metadata = {
  title: "Evora — Design Studio | Configure your kitchen island",
  description:
    "Scroll through an Evora kitchen and configure the island stone live — Patagonia, Calacatta, Emperador and more. Khalda, Amman.",
};

export default function ConfiguratorPage() {
  return (
    <>
      <Nav />
      <ConfiguratorScroll />
      <Footer />
    </>
  );
}
