import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Layout from "@/components/layout/Layout";
import { Providers } from "./providers"; // Providers import

const inter = Inter({ subsets: ["latin"] });

/* Metadata configuration */
export const metadata: Metadata = {
  title: "Framely",
  description: "Optical store built with Next.js + Tailwind",
};

/* Root layout component */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Providers wrapped inside body */}
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
