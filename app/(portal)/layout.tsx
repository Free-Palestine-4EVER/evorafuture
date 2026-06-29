import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { I18nProvider } from "@/lib/i18n";
import { PortalAuthProvider } from "@/lib/portal/auth";
import OfflineReady from "@/components/portal/OfflineReady";
import OneSignalInit from "@/components/portal/OneSignalInit";
import Loader from "@/components/brand/Loader";

/* Third root layout (route group "(portal)") for the Client Portal and Admin
 * dashboard. Lean chrome — fonts + i18n + auth, no heavy 3D / smooth-scroll.
 * PWA-installable (manifest + theme color) so the studio can add it to a home
 * screen as an app. */

const display = Bricolage_Grotesque({ variable: "--f-display", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
const sans = Hanken_Grotesk({ variable: "--f-sans", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({ variable: "--f-ar", subsets: ["arabic"], weight: ["300", "400", "500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "Client Portal — Evora",
  description: "View and approve your saved Evora 3D home designs.",
  manifest: "/portal.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Evora" },
  icons: {
    icon: [{ url: "/icons/evora-192.png", sizes: "192x192", type: "image/png" }, { url: "/icons/evora-512.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/icons/evora-apple.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#16150F",
  width: "device-width",
  initialScale: 1,
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${display.variable} ${sans.variable} ${arabic.variable}`}>
      {/* The portal is a tool, not the cinematic marketing site — always show a
          normal cursor (globals.css hides it for the custom-cursor on the site). */}
      <style>{`body, body * { cursor: auto; } a, button, [role="button"], label, select { cursor: pointer; } input, textarea { cursor: text; }`}</style>
      <body style={{ background: "var(--paper)", cursor: "auto" }}>
        <I18nProvider>
          {/* Branded curtain-lift intro — once per session (the login film beat) */}
          <Loader />
          <PortalAuthProvider>
            {children}
            <OneSignalInit />
          </PortalAuthProvider>
        </I18nProvider>
        <OfflineReady />
      </body>
    </html>
  );
}
