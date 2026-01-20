import Link from "next/link";

// Displays featured product categories with image overlays and hover effects
export default function FeaturedCategories() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const categories = [
    { name: "Men's Eyewear", image: `${basePath}/images/categories/men.jpg` },
    { name: "Women's Eyewear", image: `${basePath}/images/categories/women.jpg` },
    { name: "Kids' Eyewear", image: `${basePath}/images/categories/kids.jpg` },
    { name: "Sunglasses", image: `${basePath}/images/categories/sunglasses.jpg` },
  ];

  return (
    <section className="py-16">
      {/* Section header */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide">
          Shop by <span className="text-[var(--accent)]">Category</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base md:text-lg text-[var(--foreground-muted)] max-w-xl mx-auto">
          Find the perfect eyewear for everyone
        </p>
      </div>

      {/* Category grid */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/shop?category=${encodeURIComponent(cat.name)}`}
            className="
              relative group rounded-2xl overflow-hidden shadow-lg 
              transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
              hover:shadow-2xl hover:-translate-y-[6px]
            "
          >
            {/* Image container with zoom effect */}
            <div className="relative w-full h-52 sm:h-56 lg:h-60 overflow-hidden">
              {/* Background image with zoom on hover */}
              {/* Using a regular img tag instead of Next.js Image component */}
              <img
                src={cat.image}
                alt={cat.name}
                className="
                  absolute inset-0 w-full h-full object-cover object-center 
                  transition-transform duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] 
                  group-hover:scale-105
                "
              />

              {/* Gradient overlay on hover */}
              <div
                className="
                  absolute inset-0 bg-gradient-to-t 
                  from-[var(--background)]/80 via-black/30 to-transparent 
                  transition-opacity duration-700 ease-in-out
                  group-hover:from-[var(--background)]/90 
                  group-hover:via-black/60 
                  group-hover:to-black/20
                "
              />

              {/* Category label and CTA */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                <h3
                  className="
                    text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-xl tracking-wide 
                    transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-[-4px]
                  "
                >
                  {cat.name}
                </h3>
                <span
                  className="
                    mt-2 text-xs sm:text-sm text-[var(--foreground-muted)] 
                    opacity-0 translate-y-3 
                    transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] 
                    group-hover:opacity-100 group-hover:translate-y-0
                  "
                >
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}