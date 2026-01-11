"use client";

import { Eye, Home, ShieldCheck, Ruler, Headphones, Contact2 } from "lucide-react";

export default function ServicesPage() {
  // List of services with icon, title, and description
  const services = [
    {
      icon: <Eye className="w-10 h-10 text-blue-400" />,
      title: "Advanced Eye Checkup",
      desc: "Get your eyes tested with our advanced AI-powered tools for accurate prescriptions.",
    },
    {
      icon: <Home className="w-10 h-10 text-purple-400" />,
      title: "Home Visit Eye Test",
      desc: "Our optometrists visit your home for a personalized eye check-up at your convenience.",
    },
    {
      icon: <Ruler className="w-10 h-10 text-green-400" />,
      title: "Premium Frame Fitting",
      desc: "We ensure a perfect fit with professional frame adjustments & styling advice.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-yellow-400" />,
      title: "Warranty & Support",
      desc: "Enjoy hassle-free warranty coverage & dedicated customer support for every purchase.",
    },
    {
      icon: <Headphones className="w-10 h-10 text-pink-400" />,
      title: "Lens Consultation",
      desc: "Get expert guidance on choosing the best lenses for your lifestyle & needs.",
    },
    {
      icon: <Contact2 className="w-10 h-10 text-cyan-400" />,
      title: "Contact Lens Fitting",
      desc: "Try & get fitted with the most comfortable and safe contact lenses for your eyes.",
    },
  ];

  return (
    <section className="relative py-20">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5"></div>

      {/* Heading Section */}
      <div className="relative z-10 text-center mb-16 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Our <span className="text-blue-400">Premium Services</span>
        </h1>
        <p className="text-gray-300 mt-4 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
          We go beyond just eyewear – experience complete eye care & style solutions with Framely.
        </p>
      </div>

      {/* Services Grid */}
      <div className="relative z-10 container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {services.map((service, i) => (
          <div
            key={i}
            className="glass p-8 rounded-2xl text-center group hover:scale-[1.03] transition-transform duration-400"
          >
            {/* Service Icon */}
            <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-white/5 mb-6 group-hover:rotate-3 transition-transform">
              {service.icon}
            </div>

            {/* Service Title */}
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
              {service.title}
            </h3>

            {/* Service Description */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {service.desc}
            </p>

            {/* Hover accent line */}
            <div className="mt-6 w-10 mx-auto h-[2px] bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all"></div>
          </div>
        ))}
      </div>

      {/* Call-to-Action Section */}
      <div className="relative z-10 text-center mt-20 px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Need a Personalized Service?
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-6">
          Contact us to book an appointment or home visit tailored to your eye care needs.
        </p>
        <a
          href="/about"
          className="inline-block px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow-lg hover:shadow-blue-500/20"
        >
          Contact Us →
        </a>
      </div>
    </section>
  );
}
