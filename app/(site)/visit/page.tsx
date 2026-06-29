import Nav from "@/components/Nav";
import Visit from "@/components/Visit";
import DesignRequest from "@/components/DesignRequest";
import Footer from "@/components/Footer";

export default function VisitPage() {
  return (
    <main>
      <Nav pinnedSolid />
      <div className="nav-spacer" />
      <Visit />
      <DesignRequest />
      <Footer />
    </main>
  );
}
