import "./showroom.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/showroom/Hero";
import Showroom from "@/components/showroom/Showroom";
import ShowroomExperience from "@/components/showroom/ShowroomExperience";

const steps = [
  {
    n: "01",
    t: "Browse in 3D",
    d: "Spin, zoom and inspect every piece from any angle, right in the page.",
  },
  {
    n: "02",
    t: "Tap “Try it in your home”",
    d: "Your camera opens. Point it at the floor and the piece drops in at real scale.",
  },
  {
    n: "03",
    t: "Walk around it",
    d: "Move closer, step back, check it against your walls and light before you buy.",
  },
];

export default function Page() {
  return (
    <>
      <Nav />

      <div className="sr-scope">
        <Hero />

        <section id="how" className="how shell">
          <div className="how-head">
            <p className="eyebrow">How the AR works</p>
            <h2 className="display-lg">
              From screen to <span className="italic">living room</span> in three
              taps.
            </h2>
          </div>
          <div className="how-grid">
            {steps.map((s) => (
              <div className="how-card" key={s.n}>
                <span className="how-n">{s.n}</span>
                <h3 className="how-t">{s.t}</h3>
                <p className="how-d">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <ShowroomExperience />

        <Showroom />
      </div>

      <Footer />
    </>
  );
}
