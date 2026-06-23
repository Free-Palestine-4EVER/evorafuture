import Nav from "@/components/Nav";
import Visit from "@/components/Visit";
import Proof from "@/components/Proof";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function VisitPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <div style={{ paddingTop: 78 }} />
      <Visit />
      <Proof />
      <Newsletter />
      <Footer />
    </main>
  );
}
