// src/hooks/useAuth.ts
"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

// Provides access to AuthContext values
// Must be used within an AuthProvider wrapper
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};