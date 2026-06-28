import Nav from "@/components/Nav";
import HeroScroll, { type HeroVariant } from "@/components/HeroScroll";
import ProcessJourney from "@/components/ProcessJourney";
import StartAndTrack from "@/components/StartAndTrack";
import ShopHero3D from "@/components/ShopHero3D";
import ConfiguratorScroll from "@/components/ConfiguratorScroll";
import Marquee from "@/components/Marquee";
import FutureHomeProof from "@/components/FutureHomeProof";
import Collections from "@/components/Collections";
import Rooms from "@/components/Rooms";
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
      {/* then the Evora kitchen video → live configurator (seamless morph — keep adjacent) */}
      {showConfigurator && <ConfiguratorScroll />}
      {/* Shop by room — the full six-room collection carried from the original site */}
      <Rooms />
      {/* How Evora works (the 4-step transform film, complimentary for showroom clients) */}
      <ProcessJourney showFinale={false} />
      <StartAndTrack />
      {/* Proof before the shop carousel — manifesto → homes delivered → voices */}
      <FutureHomeProof />
      <ShopHero3D />
      <Financing />
      <Marquee />
      <Visit />
      <Footer />
    </main>
  );
}
