"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { START_PROJECT_EVENT } from "@/lib/startProject";

const StartProjectModal = dynamic(() => import("@/components/StartProjectModal"), {
  ssr: false,
});

/**
 * Lazy host for the global "Start a project" modal. The modal's data layer
 * (lib/portal/store → realtime) pulls the Firebase client SDK — mounting it
 * unconditionally in the site layout shipped that SDK in EVERY page's bundle.
 * This host weighs ~nothing and only imports the real modal (initialOpen, so
 * the triggering click still opens it) on the first open event.
 */
export default function StartProjectHost() {
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    if (wanted) return;
    const arm = () => setWanted(true);
    window.addEventListener(START_PROJECT_EVENT, arm);
    return () => window.removeEventListener(START_PROJECT_EVENT, arm);
  }, [wanted]);

  return wanted ? <StartProjectModal initialOpen /> : null;
}
