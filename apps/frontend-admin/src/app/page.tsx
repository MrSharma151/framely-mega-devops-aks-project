"use client";

import ProductMetrics from "@/components/ui/dashboard/ProductMetrics";
import RevenueTrend from "@/components/ui/dashboard/RevenueTrend";
import RecentOrders from "@/components/ui/dashboard/RecentOrders";
import TopSellingProducts from "@/components/ui/dashboard/TopSellingProducts";
import LowStockAlerts from "@/components/ui/dashboard/LowStockAlerts";

export default function DashboardPage() {
  return (
    <div className="page-container px-4 sm:px-6 lg:px-8 py-6 space-y-8 fade-in">

      {/* Displays dashboard heading and welcome message */}
      <header>
        <h1 className="title flex items-center gap-2">
          📊 Dashboard
        </h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm sm:text-base">
          Welcome back! Here is a quick insight into your Framely Admin panel.
        </p>
      </header>

      {/* Shows product metrics including counts and summaries */}
      <ProductMetrics />

      {/* Displays revenue trends over time */}
      <RevenueTrend />

      {/* Lists recent customer orders */}
      <RecentOrders />

      {/* Displays top selling products and alerts for low stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopSellingProducts />
        <LowStockAlerts />
      </div>

    </div>
  );
}