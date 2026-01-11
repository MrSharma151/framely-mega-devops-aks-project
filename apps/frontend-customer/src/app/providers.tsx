"use client";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";  
import { Toaster } from "react-hot-toast";

/* Providers component wraps all app-level context providers */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    /* AuthProvider at top-level to manage authentication */
    <AuthProvider>
      {/* CartProvider to manage shopping cart state */}
      <CartProvider>
        {children}

        {/* Global toast notifications */}
        <Toaster position="top-center" />
      </CartProvider>
    </AuthProvider>
  );
}
