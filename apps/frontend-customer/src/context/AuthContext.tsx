// src/context/AuthContext.ts
"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

// Response structure returned by backend on successful login
export interface AuthResponseDto {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
  refreshToken?: string | null;
}

// User object stored in context (excludes token)
export interface User {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  expiresAt: string;
  refreshToken?: string | null;
}

// AuthContext shape exposed to consumers
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (authData: AuthResponseDto) => void;
  logout: () => void;
  hydrated: boolean;
}

// Create context with undefined default (enforced via useAuth hook)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for wrapping children with AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load auth state from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }

      setHydrated(true);
    }
  }, []);

  // Save token and user to state and localStorage
  const login = (authData: AuthResponseDto) => {
    const { token, ...userData } = authData;

    setToken(token);
    setUser(userData);

    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  // Clear token and user from state and localStorage
  const logout = () => {
    setToken(null);
    setUser(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hydrated }}>
      {children}
    </AuthContext.Provider>
  );
};