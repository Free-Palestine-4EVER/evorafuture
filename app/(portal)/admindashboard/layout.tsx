import type { Metadata } from "next";

// Override the portal manifest for the admin route so installing the admin PWA
// opens /admindashboard (not the customer /dashboard).
export const metadata: Metadata = {
  title: "Evora Admin",
  manifest: "/admin.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Evora Admin" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
