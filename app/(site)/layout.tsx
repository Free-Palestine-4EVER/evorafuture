import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { I18nProvider } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import WhatsappCTA from "@/components/WhatsappCTA";
import ScrollProgress from "@/components/ScrollProgress";
import StartProjectModal from "@/components/StartProjectHost";
import Loader from "@/components/brand/Loader";
import ChunkErrorRecovery from "@/components/ChunkErrorRecovery";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

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
  // The live domain. This was pointing at evorafuturehome.com — the client's
  // OLD PrestaShop site, which currently serves HTTP 503 — so every og:image
  // and twitter:image was absolutised onto a host that does not serve our
  // assets. Result: no preview image on any WhatsApp / Instagram / Facebook
  // share, which is most of this brand's traffic in Amman.
  metadataBase: new URL("https://evorahome.online"),
  title: "Evora — Future Home | Khalda, Amman",
  description:
    "Evora Future Home — your premium destination for home furnishing in Amman. Bedrooms, dining, sofas, built-in closets, full interior design & execution.",
  alternates: { canonical: "/" },
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
      <head>
        {/* Set dir/lang from the persisted choice BEFORE first paint, so an
            Arabic visitor doesn't see the layout flash LTR then flip to RTL on
            hydration. Text still starts English (the page is static, so the
            server HTML is English) and swaps on hydration — full Arabic SSR
            would need per-language URLs and is tracked separately. This only
            fixes the direction/layout flash, which is the jarring part. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=document.cookie.match(/(?:^|; )evora_lang=(ar|en)/);var l=m&&m[1]||localStorage.getItem('evora_lang');if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}",
          }}
        />
      </head>
      <body>
        <LocalBusinessSchema />
        <I18nProvider>
          <ChunkErrorRecovery />
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
