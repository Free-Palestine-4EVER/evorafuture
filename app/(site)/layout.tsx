import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { I18nProvider } from "@/lib/i18n";
import Loader from "@/components/brand/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import WhatsappCTA from "@/components/WhatsappCTA";
import ScrollProgress from "@/components/ScrollProgress";
import StartProjectModal from "@/components/StartProjectModal";

// Re-exported so the Studio (Stream 1) and portal (Stream 3) layouts can mount
// the same branded loader. (They may also import it directly from
// @/components/brand/Loader to avoid pulling this layout's font imports.)
export { default as Loader } from "@/components/brand/Loader";

// Bold modern luxury — a confident display grotesk for headlines.
const display = Bricolage_Grotesque({
  variable: "--f-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const sans = Hanken_Grotesk({
  variable: "--f-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--f-ar",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // enables env(safe-area-inset-*) on notched phones
  themeColor: "#16150f",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://evorafuturehome.com"),
  title: "Evora — Future Home | Khalda, Amman",
  description:
    "Evora Future Home — your premium destination for home furnishing in Amman. Bedrooms, dining, sofas, built-in closets, full interior design & execution.",
  keywords: [
    "Evora", "Evora Future Home", "furniture Amman", "luxury furniture Jordan", "home furnishing",
    "interior design Amman", "أثاث", "إيفورا", "بيت المستقبل", "خلدا",
  ],
  openGraph: {
    title: "Evora — Future Home",
    description: "Your premium supplier for home furnishing in Amman. Every room, every detail, under one roof.",
    type: "website",
    locale: "en_JO",
    siteName: "Evora",
    images: [{ url: "/evora/p07.jpg", width: 1200, height: 1200, alt: "Evora — premium furnishing" }],
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${display.variable} ${sans.variable} ${arabic.variable}`}>
      <body>
        <I18nProvider>
          <Loader />
          <SmoothScroll />
          <ScrollProgress />
          <Cursor />
          {children}
          <StartProjectModal />
          <WhatsappCTA />
        </I18nProvider>
      </body>
    </html>
  );
}
