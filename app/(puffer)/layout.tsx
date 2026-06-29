import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Loader from "@/components/brand/Loader";
import "./puffer.css";

/* Root layout for Evora Future Studio, hosted in-app at /pufferweb. Its own
 * midnight-atelier, Tailwind shell — independent of the marketing/portal chrome.
 *
 * PWA-installable on iPad / iPhone (manifest + apple-web-app meta): the studio
 * adds it to the home screen and it opens full-screen with no Safari chrome.
 * The viewport (maximumScale 1 / userScalable false) stops Safari from pinch-
 * zooming the page, so one-/two-finger gestures drive the 2D editor (pointer
 * events) and the 3D OrbitControls (1-finger rotate, 2-finger pan + pinch-zoom)
 * exactly like a trackpad — instead of zooming the whole page. */

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evora Future Studio",
  description: "Design any room in 3D from a 2D plan, and save it to your client. Evora Future Studio.",
  manifest: "/puffer.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Evora Studio" },
  icons: {
    icon: [
      { url: "/icons/evora-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/evora-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/evora-apple.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#16150F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function PufferLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col overscroll-none"
        style={{ background: "var(--ink)", color: "var(--paper)" }}
      >
        <Loader />
        {children}
      </body>
    </html>
  );
}
