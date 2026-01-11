"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { Trash2, Plus, Minus } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const { user, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && !user) {
      toast.error("⚠️ Please login to view your cart");
      setTimeout(() => {
        router.replace("/auth/login");
      }, 800);
    }
  }, [hydrated, user, router]);

  const clearCart = () => {
    if (cart.length === 0) return;
    cart.forEach((item) => removeFromCart(item.id));
    toast.success("🛒 Cart cleared successfully!");
  };

  if (!hydrated || !user) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 py-14">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          🛒 Your Cart
        </h1>

        {cart.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400 transition"
            onClick={clearCart}
          >
            <Trash2 size={16} className="mr-1" /> Clear All
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <p className="text-center text-gray-400 text-base">
          Your cart is empty.
          <br />
          <span className="text-xs text-gray-500">
            Add some eyewear to get started!
          </span>
        </p>
      ) : (
        <div className="space-y-5">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-gradient-to-r from-gray-900/60 via-gray-800/40 to-gray-900/60 rounded-xl p-5 shadow-md hover:shadow-blue-500/10 transition-all duration-300"
            >
              {/* Replaced Image with img tag */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-lg object-cover shadow-sm w-full h-full hover:scale-[1.02] transition-transform"
                />
              </div>

              {/* Product Details and Actions */}
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <div>
                    <h2 className="text-sm md:text-base font-medium text-white leading-snug">
                      {item.name}
                    </h2>
                    <p className="text-blue-400 text-sm font-semibold mt-0.5">
                      ₹{item.price}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400 transition text-xs"
                    onClick={() => {
                      removeFromCart(item.id);
                      toast.error(`❌ ${item.name} removed from cart`);
                    }}
                  >
                    <Trash2 size={14} className="mr-1" /> Remove
                  </Button>
                </div>

                <div className="flex flex-wrap justify-start items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 bg-gray-800/70 px-3 py-1.5 rounded-full backdrop-blur-sm text-xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-700 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-medium text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-700 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-gray-400">
                    Subtotal:{" "}
                    <span className="text-white font-medium">
                      ₹{item.price * item.quantity}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-700 pt-5 mt-5">
            <h2 className="text-lg md:text-xl font-semibold">
              Total:{" "}
              <span className="text-blue-400">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </h2>

            <Button
              variant="primary"
              size="md"
              className="w-full md:w-auto"
              disabled={cart.length === 0}
              onClick={() => {
                if (cart.length > 0) router.push("/checkout");
              }}
            >
              Proceed to Checkout →
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}