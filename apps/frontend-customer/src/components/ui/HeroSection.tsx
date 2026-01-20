// src/components/ui/HeroSection.tsx
import Link from "next/link";
import Button from "@/components/ui/Button";

// Full-width hero banner with background image, overlay, and CTA
export default function HeroSection() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <section className="relative w-full h-[60vh] sm:h-[65vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      {/* Background image (cover + center) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${basePath}/images/hero-banner.jpg')` }}
      />

      {/* Dark gradient overlay for contrast and readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[var(--background)]/90" />

      {/* Centered hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 md:px-8 lg:px-16">
        <h1
          className="
            font-extrabold leading-tight mb-4 
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
            text-white drop-shadow-2xl tracking-wide
          "
        >
          Discover <span className="text-[var(--accent)]">Premium Eyewear</span>
        </h1>

        <p
          className="
            max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl 
            text-[var(--foreground-muted)] mb-6 drop-shadow-md
          "
        >
          Stylish frames & lenses to match your personality
        </p>

        {/* CTA button wrapped in Next.js Link */}
        <Link href="/shop" passHref>
          <Button variant="primary" size="lg">
            Shop Now
          </Button>
        </Link>
      </div>
    </section>
  );
}