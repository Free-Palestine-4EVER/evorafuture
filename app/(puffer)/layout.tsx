import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./puffer.css";

/* Root layout for Puffer, hosted in-app at /pufferweb. Its own dark, Tailwind
 * shell — independent of the Evora marketing/portal chrome. */

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Puffer · Evora",
  description: "Turn a 2D floor plan into a furnished 3D space and save it to a client.",
  robots: { index: false, follow: false },
};

export default function PufferLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">{children}</body>
    </html>
  );
}
