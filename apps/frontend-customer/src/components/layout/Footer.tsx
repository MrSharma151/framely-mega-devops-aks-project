"use client";

import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

// Global footer with brand info, contact, navigation, and social links
export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background: radial and linear gradients for subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.02)] via-transparent to-[rgba(255,255,255,0.03)]" />

      {/* Main grid layout */}
      <div className="relative z-10 container mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand description */}
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Framely</h2>
          <p className="mt-4 text-[var(--foreground-muted)] leading-relaxed">
            Your trusted optical store for{" "}
            <span className="text-white">premium eyewear</span> & accessories.
          </p>
        </div>

        {/* Contact details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-[var(--foreground-muted)] text-sm">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-400" />
              +91 98765 43XXX
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-purple-400" />
              support@framely.com
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-green-400" />
              21B, Luxury Plaza, MG Road, Bangalore
            </li>
          </ul>
        </div>

        {/* Navigation links (mirrors navbar routes) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-[var(--foreground-muted)]">
            <li>
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-[var(--accent)] transition-colors">Shop</Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-[var(--accent)] transition-colors">Services</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[var(--accent)] transition-colors">About</Link>
            </li>
          </ul>
        </div>

        {/* Social media links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition transform hover:scale-110"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition transform hover:scale-110"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition transform hover:scale-110"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition transform hover:scale-110"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright section */}
      <div className="relative z-10 border-t border-white/10 py-6 text-center text-sm text-[var(--foreground-muted)]">
        © {new Date().getFullYear()} Framely. All rights reserved.
      </div>

      {/* Decorative blur glows */}
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-purple-500/10 blur-[120px]" />
    </footer>
  );
}