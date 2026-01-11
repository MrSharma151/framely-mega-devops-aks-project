"use client";
import { useEffect, useState } from "react";
import { getPaginatedOrders } from "@/services/OrderService";
import Link from "next/link";

interface ProductSales {
  name: string;
  sold: number;
}

export default function TopSellingProducts() {
  const [products, setProducts] = useState<ProductSales[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetches top-selling products by aggregating order data
  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      const res = await getPaginatedOrders(1, 1000, "date", "desc");
      if (res && res.data) {
        const salesMap: Record<string, number> = {};
        res.data.forEach((order) => {
          order.items.forEach((item) => {
            salesMap[item.productName] =
              (salesMap[item.productName] || 0) + item.quantity;
          });
        });

        const sorted = Object.entries(salesMap)
          .map(([name, sold]) => ({ name, sold }))
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 3);

        setProducts(sorted);
      }
      setLoading(false);
    };

    fetchTopProducts();
  }, []);

  const maxSold = products.length > 0 ? Math.max(...products.map((p) => p.sold)) : 0;

  return (
    <div className="card fade-in hover:shadow-[0_8px_25px_rgba(138,180,248,0.25)] hover:scale-[1.01] transition-transform duration-300">
      {/* Displays header with title and description */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] bg-clip-text text-transparent">
            🔥 Top Selling Products
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Best-performing products by sales
          </p>
        </div>
      </div>

      {/* Renders list of top-selling products */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product, i) => {
            const progress = maxSold > 0 ? (product.sold / maxSold) * 100 : 0;

            return (
              <li
                key={i}
                className="relative rounded-lg p-4 bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] hover:bg-[rgba(255,255,255,0.05)] transition-all"
              >
                <div className="flex justify-between items-center">
                  {/* Displays product name with rank badge */}
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-full bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)] text-white shadow-md">
                      {i + 1}
                    </span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {product.name}
                    </span>
                  </div>

                  {/* Displays total units sold */}
                  <span className="text-sm font-semibold text-green-400">
                    {product.sold} sold
                  </span>
                </div>

                {/* Renders progress bar based on relative sales */}
                <div className="w-full h-2 mt-3 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Link to view full product list */}
      <div className="mt-5 flex justify-end">
        <Link href="/products" className="btn-primary text-xs sm:text-sm">
          View All Products →
        </Link>
      </div>
    </div>
  );
}