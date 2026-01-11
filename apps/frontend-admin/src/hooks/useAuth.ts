import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/**
 * Provides access to the authentication context.
 * Must be used within an <AuthProvider /> wrapper.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Throws an error if the hook is used outside the AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider />.");
  }

  // Returns the authentication context (user, token, login, logout, etc.)
  return context;
};