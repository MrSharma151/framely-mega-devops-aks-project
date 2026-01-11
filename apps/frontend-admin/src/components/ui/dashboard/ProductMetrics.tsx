"use client";

import { useEffect, useState } from "react";
import { Package, Tag, ShoppingCart, DollarSign, Loader2 } from "lucide-react";
import { getProducts } from "@/services/ProductService";
import { getCategories } from "@/services/CategoryService";
import { getPaginatedOrders } from "@/services/OrderService";

export default function ProductMetrics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: "Total Products", value: "0", change: "", changeColor: "text-green-400", icon: Package },
    { title: "Categories", value: "0", change: "", changeColor: "text-blue-400", icon: Tag },
    { title: "Total Orders", value: "0", change: "", changeColor: "text-yellow-400", icon: ShoppingCart },
    { title: "Revenue", value: "₹0", change: "", changeColor: "text-green-400", icon: DollarSign },
  ]);

  // Fetches product, category, and order data to populate metrics
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        getProducts(1, 1),
        getCategories(1, 1),
        getPaginatedOrders(1, 1000),
      ]);

      const totalProducts = productsRes?.totalItems ?? 0;
      const totalCategories = categoriesRes?.totalItems ?? 0;
      const totalOrders = ordersRes?.totalItems ?? 0;
      const totalRevenue =
        ordersRes?.data?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

      setStats([
        { title: "Total Products", value: `${totalProducts}`, change: "", changeColor: "text-green-400", icon: Package },
        { title: "Categories", value: `${totalCategories}`, change: "", changeColor: "text-blue-400", icon: Tag },
        { title: "Total Orders", value: `${totalOrders}`, change: "", changeColor: "text-yellow-400", icon: ShoppingCart },
        { title: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "", changeColor: "text-green-400", icon: DollarSign },
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  // Displays loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-secondary)]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 fade-in">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="
              card relative group
              p-6 rounded-2xl
              flex flex-col
              transition-all duration-300
              hover:scale-[1.02]
            "
          >
            {/* Renders metric icon */}
            <div
              className="
                w-14 h-14 rounded-xl 
                bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]
                flex items-center justify-center
                shadow-md
                group-hover:shadow-lg group-hover:scale-105 transition
              "
            >
              <Icon className="w-7 h-7 text-white" />
            </div>

            {/* Displays metric title */}
            <h3
              className="
                mt-5 text-lg font-semibold 
                bg-gradient-to-r from-[var(--highlight)] to-[var(--accent-secondary)]
                bg-clip-text text-transparent
              "
            >
              {stat.title}
            </h3>

            {/* Displays metric value */}
            <p className="text-3xl font-extrabold mt-2 tracking-wide text-[var(--text-primary)] leading-snug">
              {stat.value}
            </p>

            {/* Displays change percentage if available */}
            {stat.change && (
              <span className={`text-sm mt-1 block ${stat.changeColor}`}>
                {stat.change}
              </span>
            )}

            {/* Glow effect on hover */}
            <div
              className="
                absolute inset-0 rounded-2xl
                opacity-0 group-hover:opacity-10
                bg-gradient-to-r from-[var(--highlight)] to-[var(--accent-secondary)]
                blur-2xl transition
              "
            ></div>
          </div>
        );
      })}
    </div>
  );
}