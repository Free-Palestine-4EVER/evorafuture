import Nav from "@/components/Nav";
import HeroScroll, { type HeroVariant } from "@/components/HeroScroll";
import ProcessJourney from "@/components/ProcessJourney";
import StartAndTrack from "@/components/StartAndTrack";
import ShopEdit from "@/components/ShopEdit";
import ConfiguratorScroll from "@/components/ConfiguratorScroll";
import Marquee from "@/components/Marquee";
import FutureHomeProof from "@/components/FutureHomeProof";
import Collections from "@/components/Collections";
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
      {/* Explore the collection: showroom film + heading + category cards + films,
          ending on the kitchen finale that grows fullscreen into the configurator */}
      <Collections />
      {/* then the Evora kitchen video → live configurator */}
      {showConfigurator && <ConfiguratorScroll />}
      {/* How Evora works (the 4-step transform film) → merged upload→3D + live-track showpiece → shop 3D */}
      <ProcessJourney showFinale={false} />
      <StartAndTrack />
      <ShopEdit />
      <Marquee />
      {/* Your Future Home × Loved across Amman — one cinematic manifesto→proof→voices story */}
      <FutureHomeProof />
      <Financing />
      <Visit />
      <Footer />
    </main>
  );
}
