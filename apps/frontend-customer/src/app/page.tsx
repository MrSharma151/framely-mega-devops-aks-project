import HeroSection from "@/components/ui/HeroSection";
import FeaturedCategories from "@/components/ui/FeaturedCategories";
import BestSellers from "@/components/ui/BestSellers";
import WhyChooseUs from "@/components/ui/WhyChooseUs";
import Testimonials from "@/components/ui/Testimonials";
import NewsletterCTA from "@/components/ui/NewsletterCTA";

/* Home page layout */
export default function Home() {
  return (
    <>
      {/* Hero banner section */}
      <HeroSection />

      {/* Featured categories section */}
      <FeaturedCategories />

      {/* Best sellers section */}
      <BestSellers />

      {/* Why choose us section */}
      <WhyChooseUs />

      {/* Testimonials section */}
      <Testimonials />

      {/* Newsletter call-to-action section */}
      <NewsletterCTA />
    </>
  );
}
