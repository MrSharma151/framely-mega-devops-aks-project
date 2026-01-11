"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Product, getProductById } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth"; // Auth check

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const { user } = useAuth(); // User authentication context

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGoToCart, setShowGoToCart] = useState(false); // Show after Add-to-Cart

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(Number(id));
        setProduct(res);
      } catch (error) { // Error handling
        console.error("Failed to fetch product:", error);
        toast.error("❌ Failed to load product details");
        router.push("/shop");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const imageToShow = product?.imageUrl || "/images/products/aviator.jpeg"; // ✅ Yahan default value add ki hai

  // Add product to cart
  const handleAddToCart = () => {
    if (!user) {
      toast.error("⚠️ Please login to add items to cart");
      router.push("/auth/login");
      return;
    }
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageToShow, // ✅ Ab imageToShow hamesha string hai
    });

    toast.success(`✅ ${product.name} added to cart 🛒`);
    setShowGoToCart(true);
  };

  // Go to cart page
  const handleGoToCart = () => {
    if (cart.length === 0) {
      toast.error("🛒 Your cart is empty!");
      return;
    }
    router.push("/cart");
  };

  // Loading fallback
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-400 text-lg">
        Loading product details...
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-400 text-lg">
        Product not found
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-900/80 to-black text-white">

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Product Image Section */}
          <div className="relative w-full">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img // Using standard img tag for simplicity
                src={imageToShow}
                alt={product.name}
                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {product.categoryName && (
              <span className="absolute top-4 left-4 bg-blue-600/90 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider shadow-lg">
                {product.categoryName}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{product.name}</h1>

            {product.brand && (
              <p className="text-gray-400 text-sm uppercase tracking-widest">{product.brand}</p>
            )}

            {/* Ratings */}
            <div className="flex items-center gap-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (<Star key={i} size={18} fill="currentColor" />))}
              <span className="text-gray-300 ml-2 text-sm">4.9 (120 reviews)</span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-blue-400">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            )}

            {/* Add to Cart & Go to Cart */}
            <div className="pt-4 flex flex-col md:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className="shadow-lg hover:shadow-blue-500/30"
              >
                <ShoppingCart size={18} /> Add to Cart
              </Button>

              {user && showGoToCart && (
                <Button
                  onClick={handleGoToCart}
                  variant="secondary"
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  🛒 Go to Cart
                </Button>
              )}
            </div>

            {/* Extra Details */}
            <div className="grid grid-cols-2 gap-4 mt-8 text-sm">
              <div className="p-4 bg-white/5 rounded-xl backdrop-blur-md">
                <p className="text-gray-400">Category</p>
                <p className="font-semibold">{product.categoryName || "N/A"}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl backdrop-blur-md">
                <p className="text-gray-400">Brand</p>
                <p className="font-semibold">{product.brand || "Generic"}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl backdrop-blur-md">
                <p className="text-gray-400">Stock</p>
                <p className="font-semibold text-green-400">Available</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl backdrop-blur-md">
                <p className="text-gray-400">Delivery</p>
                <p className="font-semibold">2-5 Business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features / Highlights */}
        <div className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-2xl font-bold mb-6">Why choose this product?</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
            {[
              "Premium quality materials for long-lasting comfort",
              "Designed with modern style & elegance",
              "Lightweight frame & ergonomic fit",
              "Scratch-resistant & UV-protected lenses",
              "Free replacement in case of defects",
              "Trusted by thousands of happy customers"
            ].map((feat, i) => (
              <li key={i} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                ✅ {feat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}