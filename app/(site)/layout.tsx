import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Hanken_Grotesk, IBM_Plex_Sans_Arabic, Fraunces } from "next/font/google";
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

// Clean, architectural neo-grotesk for headlines — chosen over the previous
// Bricolage Grotesque, whose quirkier geometry read as loud rather than
// restrained against the showroom photography.
const display = Schibsted_Grotesk({
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

// Quiet, editorial serif italic — reserved for a single accent word in the
// hero headline (the brass "beautifully"), for a touch of print-luxury
// contrast against the grotesk. Not used anywhere else.
const serifAccent = Fraunces({
  variable: "--f-serif-accent",
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
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
    <html lang="en" dir="ltr" className={`${display.variable} ${sans.variable} ${arabic.variable} ${serifAccent.variable}`}>
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
        {/* Every page must open at the top. Nav links are plain <a href> full
            page loads, so the browser restores the previous scroll position on
            a revisit — you'd land halfway down /shop having just clicked Shop.

            This has to run BEFORE first paint, which is why it lives here and
            not in SmoothScroll's effect. Doing it after hydration is what
            caused the documented glitch where the page snapped back to 0 out
            from under someone who had already started scrolling natively on a
            slow connection (touch scroll works before any JS loads).

            Two deliberate exemptions:
            - a #hash URL, so /kitchen#configurator still lands on its anchor;
            - back/forward, where restoring where the visitor was is correct.
              SmoothScroll separately hands that case to Lenis. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if('scrollRestoration' in history){history.scrollRestoration='manual';}var n=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};if(!location.hash&&n.type!=='back_forward'){window.scrollTo(0,0);}}catch(e){}",
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
