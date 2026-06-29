"use client";

import "./showroom.css";
import { useT } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/showroom/Hero";
import Showroom from "@/components/showroom/Showroom";
import ShowroomExperience from "@/components/showroom/ShowroomExperience";

const T = {
  how_eyebrow: { en: "How the AR works", ar: "كيف يعمل الواقع المعزّز" },
  how_h_a: { en: "From screen to ", ar: "من الشاشة إلى " },
  how_h_em: { en: "living room", ar: "غرفة جلوسك" },
  how_h_b: { en: " in three taps.", ar: " بثلاث نقرات." },
};

const steps = [
  {
    n: "01",
    t: { en: "Browse in 3D", ar: "تصفّح بالأبعاد الثلاثية" },
    d: {
      en: "Spin, zoom and inspect every piece from any angle, right in the page.",
      ar: "حرّك القطعة وكبّرها وافحصها من كل زاوية، داخل الصفحة مباشرة.",
    },
  },
  {
    n: "02",
    t: { en: "Tap “Try it in your home”", ar: "انقر «جرّبها في منزلك»" },
    d: {
      en: "Your camera opens. Point it at the floor and the piece drops in at real scale.",
      ar: "تُفتح كاميرتك. وجّهها نحو الأرض فتظهر القطعة بحجمها الحقيقي.",
    },
  },
  {
    n: "03",
    t: { en: "Walk around it", ar: "تجوّل حولها" },
    d: {
      en: "Move closer, step back, check it against your walls and light before you buy.",
      ar: "اقترب وابتعد، وقارنها بجدرانك وإضاءتك قبل أن تقرّر.",
    },
  },
];

export default function Page() {
  const { lang, dir } = useT();
  const t = (k: keyof typeof T) => T[k][lang];

  return (
    <>
      <Nav />

      <div className="sr-scope" dir={dir}>
        <Hero />

        <section id="how" className="how shell">
          <div className="how-head">
            <p className="eyebrow">{t("how_eyebrow")}</p>
            <h2 className="display-lg">
              {t("how_h_a")}
              <span className="italic">{t("how_h_em")}</span>
              {t("how_h_b")}
            </h2>
          </div>
          <div className="how-grid">
            {steps.map((s) => (
              <div className="how-card" key={s.n}>
                <span className="how-n">{s.n}</span>
                <h3 className="how-t">{s.t[lang]}</h3>
                <p className="how-d">{s.d[lang]}</p>
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
