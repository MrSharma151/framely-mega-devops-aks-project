// src/context/CartContext.ts
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Represents a single item in the cart
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

// Shape of the CartContext exposed to consumers
type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  total: number;
};

// Create context with undefined default (enforced via useCart hook)
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component to wrap app with cart state
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem("framely-cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("framely-cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [cart]);

  // Adds item to cart or increments quantity if already present
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Removes item from cart by ID
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Updates quantity of a specific item (minimum 1)
  const updateQuantity = (id: number, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  // Clears entire cart and removes from localStorage
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("framely-cart");
  };

  // Calculates total cart value
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to access CartContext
// Must be used within CartProvider
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}