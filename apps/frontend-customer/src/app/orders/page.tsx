"use client";

import { useEffect, useState } from "react";
import { fetchMyOrders, cancelMyOrder } from "@/services/orderService";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  orderId: number;
}

interface Order {
  id: number;
  orderDate: string; // UTC from backend
  customerName: string;
  email: string;
  mobileNumber: string;
  address: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  userId: string;
  items: OrderItem[];
}

// Map order status to card & badge styles
function getStatusStyles(status: string) {
  switch (status) {
    case "Pending":
      return { card: "bg-yellow-900/20 border-yellow-700/50", badge: "bg-yellow-400 text-black" };
    case "Processing":
      return { card: "bg-blue-900/20 border-blue-700/50", badge: "bg-blue-500 text-white" };
    case "Completed":
      return { card: "bg-green-900/20 border-green-700/50", badge: "bg-green-500 text-white" };
    case "Cancelled":
      return { card: "bg-red-900/20 border-red-700/50", badge: "bg-red-500 text-white" };
    default:
      return { card: "bg-gray-800/20 border-gray-700/50", badge: "bg-gray-500 text-white" };
  }
}

// Convert UTC date → IST formatted string
function formatISTDate(utcDate: string) {
  const utc = new Date(utcDate);
  const istMillis = utc.getTime() + 5.5 * 60 * 60 * 1000; // IST offset
  const istDate = new Date(istMillis);
  return (
    istDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) + " IST"
  );
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (hydrated && !user) {
      toast.error("⚠️ Please login to view your orders");
      setTimeout(() => router.replace("/auth/login"), 1000);
    }
  }, [hydrated, user, router]);

  // Fetch orders from backend
  useEffect(() => {
    if (!user) return;
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data: Order[] = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("❌ Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user]);

  // Cancel an order
  const handleCancelOrder = async (orderId: number) => {
    try {
      setCancelling(orderId);
      await cancelMyOrder(orderId);
      toast.success("✅ Order cancelled successfully!");
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o)));
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to cancel order");
    } finally {
      setCancelling(null);
    }
  };

  // Prevent rendering if not logged in
  if (!user) return null;

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
        ⏳ Fetching your orders...
      </div>
    );
  }

  // Empty orders fallback
  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        😢 You haven’t placed any orders yet.
        <br />
        <Button className="mt-4" onClick={() => router.push("/shop")}>
          Browse Products →
        </Button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-10">
          📦 My Orders
        </h1>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const styles = getStatusStyles(order.status);
            const formattedDate = formatISTDate(order.orderDate);

            return (
              <div
                key={order.id}
                className={`p-6 rounded-2xl shadow-xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] ${styles.card}`}
              >
                {/* Order Header: ID, Date, Status, Total */}
                <div className="flex flex-col md:flex-row justify-between gap-3 items-start md:items-center">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-pink-400">
                      🆔 Order Ref. <span className="text-purple-400">#{order.id}</span>
                    </h2>
                    <p className="text-sm text-gray-400">📅 {formattedDate}</p>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    <span className={`px-4 py-1 rounded-full text-xs font-semibold shadow-md ${styles.badge}`}>
                      {order.status}
                    </span>
                    <span className="text-blue-400 font-bold text-lg">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                  <p>👤 <span className="font-semibold">Name:</span> {order.customerName}</p>
                  <p>📞 <span className="font-semibold">Mobile:</span> {order.mobileNumber}</p>
                  <p className="md:col-span-2">📍 <span className="font-semibold">Address:</span> {order.address}</p>
                </div>

                {/* Order Items */}
                <div className="mt-4 border-t border-gray-700 pt-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-300">
                      <span>{item.productName} <span className="text-gray-400">× {item.quantity}</span></span>
                      <span>₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Pending Order: Extra info + Cancel button */}
                {order.status === "Pending" && (
                  <>
                    <div className="mt-4 text-xs text-gray-400">
                      ℹ️ Our team may contact you if any prescription or lens details are required before processing.
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        className="border border-red-500 text-red-400 font-semibold hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 px-4 py-2 rounded-lg"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelling === order.id}
                      >
                        {cancelling === order.id ? "⏳ Cancelling..." : "❌ Cancel My Order"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          🔒 Your order details are secure with us.
        </div>
      </div>
    </section>
  );
}
