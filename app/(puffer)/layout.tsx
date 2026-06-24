import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./puffer.css";

/* Root layout for Puffer, hosted in-app at /pufferweb. Its own dark, Tailwind
 * shell — independent of the Evora marketing/portal chrome.
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
  title: "Puffer · Evora",
  description: "Turn a 2D floor plan into a furnished 3D space and save it to a client.",
  manifest: "/puffer.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Puffer" },
  icons: {
    icon: [
      { url: "/icons/evora-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/evora-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/evora-apple.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function PufferLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overscroll-none bg-neutral-950 text-neutral-100">{children}</body>
    </html>
  );
}
