// src/components/ui/WhyChooseUs.tsx
import { Truck, RotateCcw, ShieldCheck, CreditCard } from "lucide-react";

// Highlights Framely's core value propositions with icons and hover effects
export default function WhyChooseUs() {
  const usp = [
    {
      icon: <Truck className="w-10 h-10 text-blue-400" />,
      title: "Free Shipping",
      desc: "Enjoy free delivery on all orders with no hidden charges.",
    },
    {
      icon: <RotateCcw className="w-10 h-10 text-green-400" />,
      title: "Easy Returns",
      desc: "7-day hassle-free return policy for your convenience.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-yellow-400" />,
      title: "Premium Quality",
      desc: "We use high-grade lenses & durable frames for long-lasting comfort.",
    },
    {
      icon: <CreditCard className="w-10 h-10 text-purple-400" />,
      title: "Secure Payments",
      desc: "100% secure checkout with trusted payment gateways.",
    },
  ];

  return (
    <section className="relative py-20">
      {/* Radial background for subtle depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_80%)]" />

      {/* Section header */}
      <div className="relative z-10 text-center mb-16 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide">
          Why Choose <span className="text-[var(--accent)]">Framely?</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed">
          Experience the perfect blend of <span className="text-white">style</span>,{" "}
          <span className="text-white">comfort</span> &{" "}
          <span className="text-white">quality</span>
        </p>
      </div>

      {/* USP grid */}
      <div className="relative z-10 container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {usp.map((item, index) => (
          <div
            key={index}
            className="
              group glass rounded-2xl p-8 flex flex-col items-center text-center 
              transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              hover:-translate-y-3 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
            "
          >
            {/* Icon container with glow and scale on hover */}
            <div className="
              flex items-center justify-center w-20 h-20 rounded-full 
              bg-[var(--background-alt)] shadow-inner shadow-black/40 
              mb-6 relative overflow-hidden group-hover:scale-110 transition duration-500
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-40" />
              {item.icon}
            </div>

            {/* USP title */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mt-2 tracking-wide">
              {item.title}
            </h3>

            {/* USP description */}
            <p className="mt-3 text-xs sm:text-sm md:text-base text-[var(--foreground-muted)] leading-relaxed">
              {item.desc}
            </p>

            {/* Underline accent on hover */}
            <span className="mt-4 block w-10 h-0.5 bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}