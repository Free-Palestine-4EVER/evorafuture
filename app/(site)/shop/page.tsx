import Nav from "@/components/Nav";
import ShopFeatured from "@/components/ShopFeatured";
import CategoryRail from "@/components/CategoryRail";
import Shop from "@/components/Shop";
import Footer from "@/components/Footer";

export default function ShopPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <ShopFeatured />
      <CategoryRail />
      <Shop />
      <Footer />
    </main>
  );
}
