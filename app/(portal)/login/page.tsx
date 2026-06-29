"use client";

import { usePortalAuth } from "@/lib/portal/auth";
import LoginForm from "@/components/portal/LoginForm";
import DashboardRedirect from "@/components/portal/DashboardRedirect";

/* /login — the branded front door to the Client Portal.
   The cinematic split-screen lives inside <LoginForm>, so /login, /join and
   the unauth states of /dashboard and /admindashboard all share one door.
   An already-signed-in visitor is sent straight to their designs. */
export default function LoginPage() {
  const { user } = usePortalAuth();
  if (user) return <DashboardRedirect />;
  return <LoginForm variant="client" />;
}
