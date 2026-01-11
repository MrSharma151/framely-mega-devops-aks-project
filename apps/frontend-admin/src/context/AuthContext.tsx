"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Defines the full authentication response from the backend
interface AuthResponseDto {
  userId: string;
  fullName: string;
  email: string;
  role: "ADMIN";
  token: string;
  expiresAt: string;
  refreshToken: string | null;
}

// Defines the minimal user model used on the frontend
interface User {
  userId: string;
  fullName: string;
  email: string;
  role: "ADMIN";
  expiresAt: string;
  refreshToken: string | null;
}

// Defines the shape of the authentication context
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Restores authentication state from cookies on initial load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedToken = Cookies.get("token");
    const savedUser = Cookies.get("user");

    if (savedToken && savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser);

        if (parsedUser.role === "ADMIN") {
          setToken(savedToken);
          setUser(parsedUser);
        } else {
          Cookies.remove("token");
          Cookies.remove("user");
          setToken(null);
          setUser(null);

          if (pathname !== "/auth/login") {
            toast.error("Only Admin users can login.");
            router.push("/auth/login");
          }
        }
      } catch (err) {
        console.error("Failed to parse user:", err);
        Cookies.remove("token");
        Cookies.remove("user");
      }
    }

    setHydrated(true);
  }, [pathname, router]);

  // Handles login and persists credentials in cookies
  const login = (authData: AuthResponseDto) => {
    if (authData.role !== "ADMIN") {
      if (!error) {
        setError("Only Admin users are allowed to login.");
        toast.error("Only Admin users are allowed to login.");
      }
      return;
    }

    const { token, ...userData } = authData;

    setToken(token);
    setUser(userData);
    setError(null);

    Cookies.set("token", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

    Cookies.set("user", JSON.stringify(userData), {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

    toast.success("Logged in successfully.");
    router.push("/");
  };

  // Clears authentication state and cookies
  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    Cookies.remove("token");
    Cookies.remove("user");
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