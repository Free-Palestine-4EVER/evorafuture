import Nav from "@/components/Nav";
import ShopFeatured from "@/components/ShopFeatured";
import Shop from "@/components/Shop";
import Footer from "@/components/Footer";

export default function ShopPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <ShopFeatured />
      <Shop />
      <Footer />
    </main>
  );
}
