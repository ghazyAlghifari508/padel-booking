"use client";
// Real auth backed by the Go API. JWT in localStorage, user hydrated from /auth/me.
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User } from "./types";
import { api, setToken, getToken, ApiError } from "./api";

interface AuthState {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Restore session from stored token by re-fetching the user.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!getToken()) {
      setReady(true);
      return;
    }
    api.me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setReady(true));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.login({ email, password });
    setToken(token);
    setUser(user);
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; phone: string; password: string }) => {
      const { token, user } = await api.register(data);
      setToken(token);
      setUser(user);
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiError };
