"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPaginatedOrders, Order } from "@/services/OrderService";

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const statusColors: Record<string, string> = {
    Completed: "bg-green-500/20 text-green-300",
    Pending: "bg-yellow-500/20 text-yellow-300",
    Cancelled: "bg-red-500/20 text-red-300",
    Processing: "bg-blue-500/20 text-blue-300",
  };

  // Fetches the latest orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const res = await getPaginatedOrders(1, 5, "date", "desc");
      setOrders(res?.data ?? []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="card fade-in hover:shadow-[0_8px_25px_rgba(138,180,248,0.25)] hover:scale-[1.01] transition-transform duration-300">
      {/* Displays header with title and description */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] bg-clip-text text-transparent">
            🛒 Recent Orders
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Latest customer orders overview
          </p>
        </div>
      </div>

      {/* Renders table of recent orders */}
      <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)] text-[var(--text-secondary)]">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Displays loading message while fetching data
              <tr>
                <td colSpan={4} className="py-6 text-center text-[var(--text-secondary)]">
                  Loading recent orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              // Displays fallback message when no orders are found
              <tr>
                <td colSpan={4} className="py-6 text-center text-[var(--text-secondary)]">
                  No recent orders found
                </td>
              </tr>
            ) : (
              // Renders each order row
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[var(--border-color)] hover:bg-[rgba(255,255,255,0.05)] transition"
                >
                  <td className="py-3 px-4 font-medium">#{order.id}</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        statusColors[order.status] || "bg-gray-500/20 text-gray-300"
                      } border border-white/5 shadow-sm`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Link to view all orders */}
      <div className="mt-4 flex justify-end">
        <Link href="/orders" className="btn-primary text-xs sm:text-sm">
          View All Orders →
        </Link>
      </div>
    </div>
  );
}