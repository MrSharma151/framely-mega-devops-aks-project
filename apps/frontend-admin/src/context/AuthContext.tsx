"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ================= TYPES =================

interface AuthResponseDto {
  userId: string;
  fullName: string;
  email: string;
  role: "ADMIN";
  token: string;
  expiresAt: string;
  refreshToken: string | null;
}

interface User {
  userId: string;
  fullName: string;
  email: string;
  role: "ADMIN";
  expiresAt: string;
  refreshToken: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (authData: AuthResponseDto) => void;
  logout: () => void;
  hydrated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// ================= PROVIDER =================

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // 🔥 Restore auth state from localStorage (NOT cookies)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser);

        if (parsedUser.role === "ADMIN") {
          setToken(savedToken);
          setUser(parsedUser);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/auth/login");
        }
      } catch (err) {
        console.error("Failed to restore auth:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setHydrated(true);
  }, [pathname, router]);

  // ================= LOGIN =================

  const login = (authData: AuthResponseDto) => {
    if (authData.role !== "ADMIN") {
      setError("Only Admin users are allowed.");
      toast.error("Only Admin users are allowed.");
      return;
    }

    const { token, ...userData } = authData;

    setToken(token);
    setUser(userData);
    setError(null);

    // 🔥 Persist in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    toast.success("Logged in successfully.");
    router.push("/");
  };

  // ================= LOGOUT =================

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out.");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, hydrated, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
