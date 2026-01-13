import { render } from "@testing-library/react";
import Home from "@/app/page";
import { Providers } from "@/app/providers";

// Mock heavy UI components
jest.mock("@/components/ui/HeroSection", () => () => <div>Hero</div>);
jest.mock("@/components/ui/FeaturedCategories", () => () => <div>Categories</div>);
jest.mock("@/components/ui/BestSellers", () => () => <div>BestSellers</div>);
jest.mock("@/components/ui/WhyChooseUs", () => () => <div>Why</div>);
jest.mock("@/components/ui/Testimonials", () => () => <div>Testimonials</div>);
jest.mock("@/components/ui/NewsletterCTA", () => () => <div>Newsletter</div>);

describe("Smoke test – App boot", () => {
  it("renders home page without crashing", () => {
    render(
      <Providers>
        <Home />
      </Providers>
    );
  });
});
