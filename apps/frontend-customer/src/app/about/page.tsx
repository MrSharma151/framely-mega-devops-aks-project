"use client";

import { Eye, Star, Users, Phone, Mail, MapPin } from "lucide-react";

/* About page component */
export default function AboutPage() {
  return (
    <section className="relative py-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5"></div>

      {/* Hero Title Section */}
      <div className="relative z-10 text-center mb-16 px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          About <span className="text-blue-400">Framely</span>
        </h1>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          We are redefining eyewear shopping with premium quality, personalized care, and modern technology.
        </p>
      </div>

      {/* Story Section */}
      <div className="relative z-10 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 items-center">
        {/* Left - Optimized Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
          {/*  Replaced <Image /> with <img> */}
          <img
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80"
            alt="Framely Store"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right - Text */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-4">
            Framely started with a simple vision – making <b>premium eyewear affordable & accessible</b>.
            We believe eyewear is more than just vision correction – it’s about confidence, comfort & style.
          </p>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            From <b>AI-powered eye tests</b> to <b>home visit consultations</b>, we bring technology & care together
            to give you the best optical experience. Whether it&apos;s <b>spectacles, sunglasses, or contact lenses</b>,
            we ensure the highest quality with unmatched customer support.
          </p>
        </div>
      </div>

      {/* Mission & Stats Section */}
      <div className="relative z-10 container mx-auto mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center px-6">
        <div className="glass rounded-2xl p-6 hover:scale-[1.03] transition">
          <Eye className="w-10 h-10 mx-auto text-blue-400 mb-3" />
          <h3 className="text-xl font-semibold text-white">10K+ Happy Eyes</h3>
          <p className="text-gray-300 text-sm mt-2">
            Helping thousands see better every day
          </p>
        </div>
        <div className="glass rounded-2xl p-6 hover:scale-[1.03] transition">
          <Users className="w-10 h-10 mx-auto text-purple-400 mb-3" />
          <h3 className="text-xl font-semibold text-white">5000+ Customers</h3>
          <p className="text-gray-300 text-sm mt-2">
            Trusted by eyewear lovers nationwide
          </p>
        </div>
        <div className="glass rounded-2xl p-6 hover:scale-[1.03] transition">
          <Star className="w-10 h-10 mx-auto text-yellow-400 mb-3" />
          <h3 className="text-xl font-semibold text-white">4.9★ Rated</h3>
          <p className="text-gray-300 text-sm mt-2">
            Consistently top-rated by our customers
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative z-10 container mx-auto mt-24 px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Get in Touch with Us
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-10">
          Have questions about our services, products, or want to book a home visit?
          Reach out to us via call, email, or visit our store.
        </p>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-6 flex flex-col items-center hover:scale-[1.03] transition">
            <Phone className="w-8 h-8 text-green-400 mb-3" />
            <h4 className="text-white font-semibold">Phone</h4>
            <p className="text-gray-300 text-sm mt-1">+91 98765 43XXX</p>
          </div>
          <div className="glass rounded-2xl p-6 flex flex-col items-center hover:scale-[1.03] transition">
            <Mail className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="text-white font-semibold">Email</h4>
            <p className="text-gray-300 text-sm mt-1">support@framely.com</p>
          </div>
          <div className="glass rounded-2xl p-6 flex flex-col items-center hover:scale-[1.03] transition">
            <MapPin className="w-8 h-8 text-purple-400 mb-3" />
            <h4 className="text-white font-semibold">Visit Us</h4>
            <p className="text-gray-300 text-sm mt-1">
              21B, Luxury Plaza, MG Road, Bangalore
            </p>
          </div>
        </div>

        {/* Quick Call-to-Action */}
        <div className="mt-10">
          <a
            href="mailto:support@framely.com"
            className="inline-block px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow-lg hover:shadow-blue-500/20"
          >
            Send us an Email
          </a>
        </div>
      </div>
    </section>
  );
}