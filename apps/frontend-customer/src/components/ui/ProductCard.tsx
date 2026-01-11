"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/services/productService";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
}

// Renders a single product card with image, category badge, and CTA
export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const fixedImage = product.imageUrl;
  const formattedPrice = `₹${Number(product.price || 0).toLocaleString("en-IN")}`;

  // Navigate to product details page
  const handleNavigate = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      className={`
        group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer
        bg-[var(--background-alt)]/70 backdrop-blur-md
        border border-white/10 shadow-md
        transition-all duration-500
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10
        focus:outline-none focus:ring-2 focus:ring-blue-500/40
      `}
    >
      {/* Product image with hover zoom */}
      <div className="relative w-full h-72 overflow-hidden bg-black">
        <img
          src={fixedImage}
          alt={product.name}
          className="
            absolute inset-0 w-full h-full object-center object-contain
            transition-transform duration-700 ease-out group-hover:scale-105
          "
        />

        {/* Gradient overlay on hover */}
        <div
          className="
            absolute inset-0 
            bg-gradient-to-t from-black/70 via-black/30 to-transparent 
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-500
          "
        />

        {/* Category badge (if available) */}
        {product.categoryName && (
          <span
            className="
              absolute top-3 left-3
              bg-gradient-to-r from-blue-600 to-indigo-500
              text-white text-[11px] font-semibold uppercase tracking-wide
              px-3 py-0.5 rounded-full shadow-md
            "
          >
            {product.categoryName}
          </span>
        )}

        {/* Hover action bar with CTA */}
        <div
          className="
            absolute bottom-0 left-0 right-0 
            translate-y-full group-hover:translate-y-0
            bg-black/50 backdrop-blur-md 
            flex justify-center py-3
            transition-transform duration-500 ease-out
          "
        >
          <Button
            onClick={(e) => {
              e.stopPropagation(); // prevent bubbling to card click
              router.push(`/product/${product.id}`);
            }}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-500/30"
          >
            View Details <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Product info section */}
      <div className="p-4 text-center flex flex-col items-center space-y-1">
        <h3
          title={product.name}
          className="w-full text-base font-semibold text-white truncate"
        >
          {product.name.length > 25 ? product.name.slice(0, 25) + "…" : product.name}
        </h3>

        {product.brand?.trim() && (
          <p className="text-xs text-gray-400 truncate">{product.brand}</p>
        )}

        <p className="text-lg font-bold text-blue-400 mt-1">{formattedPrice}</p>

        <div className="w-8 h-0.5 bg-blue-500/40 rounded-full group-hover:w-16 transition-all duration-300" />
      </div>
    </div>
  );
}