import Nav from "@/components/Nav";
import HeroScroll, { type HeroVariant } from "@/components/HeroScroll";
import Marquee from "@/components/Marquee";
import Manifesto from "@/components/Manifesto";
import Collections from "@/components/Collections";
import CategoryRail from "@/components/CategoryRail";
import SofaShowcase from "@/components/SofaShowcase";
import Services from "@/components/Services";
import Proof from "@/components/Proof";
import Financing from "@/components/Financing";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";

// The full Evora home page. `heroVariant` selects which scroll-scrubbed hero
// film plays — "a" and "b" are the two on-scroll framed videos.
export default function SiteShell({ heroVariant = "a" }: { heroVariant?: HeroVariant }) {
  return (
    <main>
      <Nav />
      <HeroScroll variant={heroVariant} />
      <Marquee />
      <Collections />
      <CategoryRail />
      <Manifesto />
      <SofaShowcase />
      <Services />
      <Proof />
      <Financing />
      <Visit />
      <Footer />
    </main>
  );
}
