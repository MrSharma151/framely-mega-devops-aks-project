// src/components/layout/Layout.tsx

import Navbar from "./Navbar";
import Footer from "./Footer";

// Global layout wrapper with sticky navbar, dynamic content, and footer
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky top navigation */}
      <Navbar />

      {/* Main content area (no padding to support full-width sections) */}
      <main className="flex-grow">{children}</main>

      {/* Footer with brand, links, and contact */}
      <Footer />
    </div>
  );
}