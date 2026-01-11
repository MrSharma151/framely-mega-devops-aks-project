// src/components/ui/Testimonials.tsx

// Static customer testimonials section with decorative visuals and hover effects
export default function Testimonials() {
  const reviews = [
    {
      name: "Priya Sharma",
      text: "Absolutely love these glasses! Super lightweight and stylish. Got so many compliments!",
      location: "Bangalore",
    },
    {
      name: "Rahul Verma",
      text: "High-quality lenses with great blue light protection. Perfect for long hours at work.",
      location: "Delhi",
    },
    {
      name: "Sneha Kapoor",
      text: "Fast delivery, premium packaging and the frame quality is top-notch. Highly recommended!",
      location: "Mumbai",
    },
  ];

  return (
    <section className="relative py-24">
      {/* Radial glow background for subtle depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />

      {/* Section header */}
      <div className="relative z-10 text-center mb-16 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide">
          What Our <span className="text-[var(--accent)]">Customers Say</span>
        </h2>
        <p className="mt-4 text-[var(--foreground-muted)] text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Real experiences from happy <span className="text-white">Framely</span> users
        </p>
      </div>

      {/* Testimonials grid */}
      <div className="relative z-10 container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="
              group glass p-8 rounded-2xl text-center shadow-lg 
              hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] 
              hover:-translate-y-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              flex flex-col justify-between relative
            "
          >
            {/* Floating quote icon */}
            <div className="
              absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 
              flex items-center justify-center rounded-full 
              bg-[var(--background-alt)] shadow-inner shadow-black/40 
              group-hover:scale-110 transition duration-500
            ">
              <span className="text-[var(--accent)] text-3xl">“</span>
            </div>

            {/* Testimonial text */}
            <p className="mt-6 text-[var(--foreground-muted)] italic text-sm sm:text-base leading-relaxed">
              {r.text}
            </p>

            {/* Divider accent */}
            <span className="
              mx-auto mt-6 mb-4 block w-12 h-0.5 
              bg-[var(--accent)] opacity-50 
              group-hover:opacity-100 transition duration-500
            " />

            {/* User info */}
            <div>
              <h4 className="text-lg font-semibold text-white">{r.name}</h4>
              <span className="text-xs sm:text-sm text-[var(--foreground-muted)]">{r.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}