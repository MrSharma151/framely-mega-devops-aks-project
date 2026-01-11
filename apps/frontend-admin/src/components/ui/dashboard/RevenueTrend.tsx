"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { getPaginatedOrders, Order } from "@/services/OrderService";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface RevenueData {
  month: string;
  revenue: number;
}

export default function RevenueTrend() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);

  // Fetches and aggregates monthly revenue data from orders
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const ordersRes = await getPaginatedOrders(1, 1000);
        const orders: Order[] = ordersRes?.data || [];

        const revenueMap: Record<string, number> = {};
        orders.forEach((order) => {
          const date = new Date(order.orderDate);
          const month = date.toLocaleString("default", { month: "short" });
          if (!revenueMap[month]) revenueMap[month] = 0;
          revenueMap[month] += order.totalAmount || 0;
        });

        const chartData = Object.entries(revenueMap).map(([month, revenue]) => ({
          month,
          revenue,
        }));

        setRevenueData(chartData);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
      }
    };

    fetchRevenueData();
  }, []);

  return (
    <div className="card fade-in hover:shadow-[0_8px_25px_rgba(138,180,248,0.25)] hover:scale-[1.01] transition-transform duration-300">

      {/* Displays header with title and icon */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] bg-clip-text text-transparent">
            📈 Revenue Trend
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Monthly revenue growth overview
          </p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl shadow-md bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] group-hover:scale-105 transition">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>

      {/* Renders revenue trend chart or fallback message */}
      <div className="relative h-48 sm:h-56 rounded-lg flex flex-col items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] backdrop-blur-md shadow-inner overflow-hidden">
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(19,42,79,0.9)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  fontSize: "0.8rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--accent-secondary)"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          // Displays fallback message when no data is available
          <div className="flex flex-col items-center text-center p-4">
            <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--accent-secondary)] opacity-40" />
            <span className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)]">
              No revenue data available
            </span>
          </div>
        )}
      </div>

      {/* Link to view detailed revenue report */}
      <div className="mt-5 flex justify-end">
        <Link href="/" className="btn-primary text-xs sm:text-sm">
          View Detailed Report →
        </Link>
      </div>

    </div>
  );
}