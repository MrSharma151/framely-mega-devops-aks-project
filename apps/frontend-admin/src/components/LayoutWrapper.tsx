"use client";

import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./ui/LoadingSpinner";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { hydrated } = useAuth();

  // Displays a loading spinner until client-side hydration is complete
  if (!hydrated) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Renders toast notifications at the top center */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Displays the navigation bar */}
      <Navbar />

      {/* Renders the main content area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8">{children}</main>

      {/* Displays the footer section */}
      <Footer />
    </>
  );
}