import type { Metadata } from "next";
import { Poppins, Space_Mono } from "next/font/google";
import "./homestudio.css";
import Toaster from "@/components/homestudio/Toaster";
import ChunkErrorRecovery from "@/components/ChunkErrorRecovery";

// Poppins — the Evora Home Studio brand font (matches evorafuturehome.com).
// This route group is its own root layout so the studio's dark bronze/coral
// theme is fully isolated from the main site's warm-white theme.
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Evora Home Studio",
  description:
    "Evora Home Studio — turn a floor plan and a furniture library into a furnished 3D space.",
};

export default function HomeStudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ChunkErrorRecovery />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
