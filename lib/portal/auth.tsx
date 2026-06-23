"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PortalUser } from "./types";
import { watchAuth, signIn as doSignIn, signOutPortal } from "./store";

interface AuthCtx {
  user: PortalUser | null;
  loading: boolean;
  signIn: (phone: string, password: string) => Promise<PortalUser>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null, loading: true,
  signIn: async () => { throw new Error("no provider"); },
  signOut: async () => {},
});

export function usePortalAuth() { return useContext(Ctx); }

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = watchAuth((u) => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  const signIn = async (phone: string, password: string) => {
    const u = await doSignIn(phone, password);
    setUser(u);
    return u;
  };
  const signOut = async () => { await signOutPortal(); setUser(null); };

  return <Ctx.Provider value={{ user, loading, signIn, signOut }}>{children}</Ctx.Provider>;
}
