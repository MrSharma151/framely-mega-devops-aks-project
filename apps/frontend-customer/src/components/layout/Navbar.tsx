"use client";

import { useState, useContext, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { AuthContext } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

// Global navigation bar with responsive layout, auth state, and cart badge
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // mobile menu toggle
  const [showDropdown, setShowDropdown] = useState(false); // user dropdown toggle
  const dropdownRef = useRef<HTMLDivElement>(null); // ref for outside click detection

  // Access auth context and cart state
  const auth = useContext(AuthContext);
  const { cart } = useCart();
  
  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Early return if auth context is not available
  if (!auth) {
    return null;
  }
  const { user, logout, hydrated } = auth;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // total cart quantity

  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
  ];

  const userLinks = user ? [{ name: "My Orders", href: "/orders" }] : [];
  const allLinks = [...baseLinks, ...userLinks];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--background-alt)]/80 border-b border-[var(--glass-border)] shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        
        {/* Brand logo */}
        <div className="text-2xl font-bold tracking-wide text-[var(--foreground)] hover:text-[var(--accent)] transition">
          <Link href="/">Framely</Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {allLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors duration-300 group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {/* Cart icon with badge */}
          {hydrated && user && (
            <Link
              href="/cart"
              className="relative ml-4 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--accent)] text-white text-xs font-medium flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* User dropdown */}
          <div className="ml-4 relative" ref={dropdownRef}>
            {hydrated && user ? (
              <>
                {/* Compact user button */}
                <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full
                             bg-gradient-to-r from-purple-500/20 to-pink-500/20
                             border border-purple-500/30 shadow-sm
                             hover:scale-[1.02] hover:shadow-[var(--accent)]/30 transition-all"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[var(--foreground)] whitespace-nowrap">
                    Hi, {user.fullName.split(" ")[0]}!
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[var(--foreground-muted)] transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Floating dropdown menu */}
                {showDropdown && (
                  <div
                    className="absolute right-0 mt-3 w-56 rounded-xl 
                               bg-[var(--background)]/95 backdrop-blur-xl 
                               shadow-2xl border border-[var(--glass-border)] 
                               p-4 animate-fadeIn space-y-3"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm 
                                 text-[var(--foreground)] hover:bg-[var(--accent)]/10 
                                 hover:text-[var(--accent)] transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      👤 My Profile
                    </Link>

                    <hr className="border-[var(--glass-border)]" />

                    <button
                      onClick={() => {
                        logout();
                        window.location.href = "/";
                      }}
                      className="w-full px-3 py-2 rounded-md text-sm font-medium 
                                 bg-gradient-to-r from-red-500 to-pink-500 
                                 text-white hover:opacity-90 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/auth/login">
                <Button
                  variant="primary"
                  size="sm"
                  className="hover:scale-[1.03] hover:shadow-md hover:shadow-[var(--accent)]/30 transition-all text-white"
                >
                  Login / Register
                </Button>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-4">
          {hydrated && user && (
            <Link
              href="/cart"
              className="relative text-[var(--foreground-muted)] hover:text-[var(--accent)]"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--accent)] text-white text-xs font-medium flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          <button
            className="text-[var(--foreground-muted)] focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--background-alt)]/95 backdrop-blur-lg border-t border-[var(--glass-border)] shadow-lg transition-all">
          <div className="flex flex-col space-y-4 px-6 py-4">
            {allLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[var(--foreground-muted)] hover:text-[var(--accent)] transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile auth section */}
            {hydrated &&
              (user ? (
                <>
                  <Link
                    href="/profile"
                    className="text-[var(--foreground-muted)] hover:text-[var(--accent)] transition"
                    onClick={() => setIsOpen(false)}
                  >
                    👤 My Profile
                  </Link>
                  <Button
                    variant="secondary"
                    size="md"
                    className="mt-3 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                      window.location.href = "/";
                    }}
                  >
                    🚪 Logout
                  </Button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="primary"
                    size="md"
                    className="mt-3 w-full hover:scale-[1.02] transition-all text-white"
                  >
                    Login / Register
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}