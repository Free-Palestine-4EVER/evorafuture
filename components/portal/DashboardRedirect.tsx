"use client";

import { useEffect } from "react";

export default function DashboardRedirect() {
  useEffect(() => { window.location.href = "/dashboard"; }, []);
  return <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", color: "var(--ink-faint)", fontFamily: "var(--f-display)" }}>EVORA</div>;
}
