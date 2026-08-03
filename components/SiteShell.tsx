import Nav from "@/components/Nav";
import ScrubDebug from "@/components/ScrubDebug";
import HeroScroll, { type HeroVariant } from "@/components/HeroScroll";
import ProcessJourney from "@/components/ProcessJourney";
import StartAndTrack from "@/components/StartAndTrack";
import KitchenTeaser from "@/components/KitchenTeaser";
import ShopFeatured from "@/components/ShopFeatured";
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
}: {
  heroVariant?: HeroVariant;
}) {
  return (
    <main>
      <Nav />
      <HeroScroll variant={heroVariant} />
      {/* Explore the collection: showroom film + heading + category cards + films,
          ending on the kitchen finale that grows fullscreen into the configurator */}
      <Collections />
      {/* Kitchen teaser — a light editorial card linking to the full fly-through +
          live stone configurator, which now lives on its own page at /kitchen */}
      <KitchenTeaser />
      {/* Actual pieces, straight from the catalogue — sits between the category
          cards above and the by-room browse below so the visitor sees real
          products before being asked to pick a room. Quick-view included. */}
      <ShopFeatured />
      {/* Shop by room — the full six-room collection carried from the original site */}
      <Rooms />
      {/* How Evora works (the 4-step transform film, complimentary for showroom clients) */}
      <ProcessJourney showFinale={false} />
      <StartAndTrack />
      {/* Proof before the shop carousel — manifesto → homes delivered → voices */}
      <FutureHomeProof />
      <Financing />
      <Marquee />
      <Visit />
      <Footer />
      <ScrubDebug />
    </main>
  );
}
