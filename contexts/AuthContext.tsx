"use client";

import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import app from "@/lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  email: string | null;
  uid: string | null;
  displayName: string | null;
}

const defaultState: AuthState = {
  user: null,
  loading: true,
  email: null,
  uid: null,
  displayName: null,
};

export const AuthContext = createContext<AuthState>(defaultState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({
        user,
        loading: false,
        email: user?.email ?? null,
        uid: user?.uid ?? null,
        displayName: user?.displayName ?? null,
      });
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
