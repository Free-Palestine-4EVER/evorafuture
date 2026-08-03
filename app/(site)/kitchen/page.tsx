"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ConfiguratorScroll from "@/components/ConfiguratorScroll";
import KitchenMaterials from "@/components/kitchen/KitchenMaterials";
import KitchenCraft from "@/components/kitchen/KitchenCraft";
import KitchenFaq from "@/components/kitchen/KitchenFaq";
import KitchenEnquiry from "@/components/kitchen/KitchenEnquiry";

// Dedicated home for the full kitchen fly-through → live stone configurator
// experience. Moved off the homepage (see components/KitchenTeaser.tsx for
// the lightweight homepage teaser that links here) so the front page's
// scroll length stays reasonable while this stays the full heavy experience.
//
// ConfiguratorScroll already ends on its own "how a bespoke island is made"
// 3-step beat (.cfg-make). Everything below continues the story without
// repeating it: the real stone options as a gallery, why the studio/workshop
// model matters, kitchen-specific FAQs, then a single enquiry beat that
// reuses the site's one real lead flow (openStartProject + WhatsApp).
export default function KitchenPage() {
  return (
    <main>
      <Nav />
      <ConfiguratorScroll />
      <KitchenMaterials />
      <KitchenCraft />
      <KitchenFaq />
      <KitchenEnquiry />
      <Footer />
    </main>
  );
}
