"use client";
// Mock auth — no backend. Session in localStorage. Role switcher for demo.
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User } from "./types";
import { users } from "./data";

interface AuthState {
  user: User | null;
  ready: boolean;
  login: (email: string) => boolean; // any password accepted; matches by email
  loginAs: (role: "user" | "admin") => void; // demo role switcher
  register: (data: { name: string; email: string; phone: string }) => boolean;
  logout: () => void;
}

const KEY = "courtflow_user";
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // one-time hydration from localStorage (client-only); intentional setState in effect
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const persist = useCallback((u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  }, []);

  const login = useCallback(
    (email: string) => {
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      // ponytail: demo only — unknown email logs in as a generic user, no password check
      const u = found ?? { ...users[0], email };
      persist(u);
      return true;
    },
    [persist],
  );

  const loginAs = useCallback(
    (role: "user" | "admin") => {
      const u = users.find((x) => x.role === role) ?? users[0];
      persist(u);
    },
    [persist],
  );

  const register = useCallback(
    (data: { name: string; email: string; phone: string }) => {
      // AC-1.4: reject duplicate email (client-side mock)
      if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) return false;
      persist({ id: Date.now(), ...data, role: "user" });
      return true;
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  return (
    <AuthContext.Provider value={{ user, ready, login, loginAs, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
