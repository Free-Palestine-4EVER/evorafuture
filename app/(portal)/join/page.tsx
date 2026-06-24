"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePortalAuth } from "@/lib/portal/auth";
import LoginForm from "@/components/portal/LoginForm";
import DashboardRedirect from "@/components/portal/DashboardRedirect";

function JoinInner() {
  const params = useSearchParams();
  const { user } = usePortalAuth();
  if (user) return <DashboardRedirect />;
  return <LoginForm variant="client" startMode="register" prefillPhone={params.get("phone") || ""} />;
}

export default function JoinPage() {
  return <Suspense><JoinInner /></Suspense>;
}
