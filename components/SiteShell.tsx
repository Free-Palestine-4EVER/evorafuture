import Nav from "@/components/Nav";
import HeroScroll, { type HeroVariant } from "@/components/HeroScroll";
import ProcessJourney from "@/components/ProcessJourney";
import ConfiguratorScroll from "@/components/ConfiguratorScroll";
import Marquee from "@/components/Marquee";
import Manifesto from "@/components/Manifesto";
import Collections from "@/components/Collections";
import CategoryRail from "@/components/CategoryRail";
import SofaShowcase from "@/components/SofaShowcase";
import Services from "@/components/Services";
import Proof from "@/components/Proof";
import DesignRequest from "@/components/DesignRequest";
import Financing from "@/components/Financing";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";

// The full Evora home page. `heroVariant` selects which scroll-scrubbed hero
// film plays — "a" and "b" are the two on-scroll framed videos.
export default function SiteShell({
  heroVariant = "a",
  showConfigurator = false,
}: {
  heroVariant?: HeroVariant;
  showConfigurator?: boolean;
}) {
  return (
    <main>
      <Nav />
      <HeroScroll variant={heroVariant} />
      {/* the two bound carousels: big pinned rail + smaller swipe carousel */}
      <CategoryRail />
      <Collections />
      {/* then the Evora kitchen video → live configurator */}
      {showConfigurator && <ConfiguratorScroll />}
      <ProcessJourney />
      <Marquee />
      <Manifesto />
      <SofaShowcase />
      <Services />
      <Proof />
      <DesignRequest />
      <Financing />
      <Visit />
      <Footer />
    </main>
  );
}
