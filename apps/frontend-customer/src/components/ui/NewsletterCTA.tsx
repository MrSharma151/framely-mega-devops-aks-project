// src/components/ui/NewsletterCTA.tsx
import { Mail } from "lucide-react";
import Button from "./Button";

// Newsletter signup section with email input, CTA, and decorative visuals
export default function NewsletterCTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Radial glow background for subtle depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,140,255,0.1)_0%,_transparent_70%)]" />

      {/* Horizontal gradient strip for luxury feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.03)] via-transparent to-[rgba(255,255,255,0.03)]" />

      {/* Main content container */}
      <div className="relative z-10 container mx-auto text-center px-4 max-w-3xl">
        {/* Section title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug">
          Stay in the Loop with{" "}
          <span className="text-[var(--accent)]">Framely</span>
        </h2>

        {/* Supporting description */}
        <p className="mt-4 text-[var(--foreground-muted)] text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Be the first to know about <span className="text-white">new arrivals</span>,{" "}
          <span className="text-white">exclusive offers</span> & premium style tips.
        </p>

        {/* Email input + subscribe button */}
        <div
          className="
            mt-10 flex flex-col sm:flex-row items-stretch sm:items-center 
            gap-3 sm:gap-0 glass rounded-full p-2 shadow-lg 
            hover:shadow-[0_0_30px_rgba(0,140,255,0.2)] 
            transition-all duration-500
          "
        >
          {/* Input field with icon */}
          <div className="flex items-center gap-3 flex-1 px-4">
            <Mail className="text-[var(--foreground-muted)] w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="email"
              placeholder="Enter your email address"
              className="
                flex-1 bg-transparent py-3 text-white 
                placeholder-[var(--foreground-muted)] 
                focus:outline-none text-sm sm:text-base
              "
            />
          </div>

          {/* CTA button */}
          <div className="sm:pr-2">
            <Button>Subscribe</Button>
          </div>
        </div>

        {/* Disclaimer note */}
        <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-5">
          No spam, only luxury eyewear updates. <span className="opacity-70">Unsubscribe anytime.</span>
        </p>
      </div>

      {/* Decorative blur glows */}
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-purple-500/10 blur-[100px]" />
    </section>
  );
}