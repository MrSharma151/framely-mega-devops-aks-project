"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

const navLinks = [
  { name: "Dashboard", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Categories", path: "/categories" },
  { name: "Orders", path: "/orders" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirects unauthenticated users to the login page
  useEffect(() => {
    const publicPaths = ["/auth/login"];
    if (!user && !publicPaths.includes(pathname)) {
      router.replace("/auth/login");
    }
  }, [user, pathname, router]);

  const handleLogout = async () => {
    logout();
    setTimeout(() => router.push("/auth/login"), 100);
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Renders navigation links with active state styling
  const renderNavLinks = () =>
    navLinks.map((link) => {
      const active = isActive(link.path);
      return (
        <Link
          key={link.path}
          href={link.path}
          onClick={() => setMobileMenuOpen(false)}
          className={`relative block text-sm font-medium tracking-wide transition-all duration-300 ${
            active
              ? "text-[var(--highlight)]"
              : "text-[var(--text-secondary)] hover:text-transparent hover:bg-gradient-to-r hover:from-[#A5D7E8] hover:to-[#8AB4F8] hover:bg-clip-text"
          }`}
          aria-current={active ? "page" : undefined}
        >
          <span
            className={`relative inline-block ${
              active
                ? "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-[#A5D7E8] after:to-[#8AB4F8]"
                : ""
            }`}
          >
            {link.name}
          </span>
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-50 bg-[rgba(11,30,57,0.85)] backdrop-blur-xl border-b border-[var(--border-color)] shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Displays the Framely Admin logo */}
          <Link
            href="/"
            aria-label="Framely Admin Home"
            className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#8AB4F8] via-[#A5D7E8] to-[#8AB4F8] bg-clip-text text-transparent transition-all duration-300"
          >
            Framely Admin
          </Link>

          {/* Renders desktop navigation links */}
          <nav
            className="hidden md:flex gap-8"
            role="navigation"
            aria-label="Main navigation"
          >
            {user && renderNavLinks()}
          </nav>

          {/* Displays user actions on desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <User size={18} className="text-[var(--highlight)]" />
                  {user.email}
                </span>
                <Button onClick={handleLogout} variant="gradient">
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push("/auth/login")}
                variant="gradient"
              >
                Login
              </Button>
            )}
          </div>

          {/* Toggles mobile menu visibility */}
          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--highlight)] transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Renders mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[rgba(11,30,57,0.95)] backdrop-blur-xl border-t border-[var(--border-color)] animate-fade-in">
          <nav
            className="flex flex-col p-5 space-y-4"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {user && renderNavLinks()}

            {user ? (
              <Button onClick={handleLogout} variant="gradient">
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/auth/login");
                }}
                variant="gradient"
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}