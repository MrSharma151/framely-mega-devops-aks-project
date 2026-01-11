"use client";

import React, { useState, useEffect } from "react";
import Button from "../Button";

const orderStatusOptions = ["Pending", "Processing", "Completed", "Cancelled"] as const;
export type OrderStatus = (typeof orderStatusOptions)[number];

export interface OrderFiltersProps {
  filters: {
    status?: OrderStatus;
    orderId: string;
    userId: string;
  };
  onApplyFilters: (filters: {
    sortBy: string;
    sortOrder: "asc" | "desc";
    status?: OrderStatus;
    orderId?: number;
    userId?: string;
  }) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onApplyFilters,
}) => {
  const [sortBy, setSortBy] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [status, setStatus] = useState<OrderStatus | "">(filters.status || "");
  const [orderId, setOrderId] = useState(filters.orderId);
  const [userId, setUserId] = useState(filters.userId);

  // Syncs local state with external filter props
  useEffect(() => {
    setStatus(filters.status || "");
    setOrderId(filters.orderId);
    setUserId(filters.userId);
  }, [filters]);

  // Applies selected filters
  const handleApply = () => {
    onApplyFilters({
      sortBy,
      sortOrder,
      status: status || undefined,
      orderId: orderId ? Number(orderId) : undefined,
      userId: userId || undefined,
    });
  };

  // Clears all filters and resets to default
  const handleClear = () => {
    setSortBy("orderDate");
    setSortOrder("desc");
    setStatus("");
    setOrderId("");
    setUserId("");
    onApplyFilters({
      sortBy: "orderDate",
      sortOrder: "desc",
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Filter: Sort By */}
      <div>
        <label className="block mb-1 text-sm text-secondary">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full"
        >
          <option value="orderDate">Order Date</option>
        </select>
      </div>

      {/* Filter: Sort Order */}
      <div>
        <label className="block mb-1 text-sm text-secondary">Sort Order</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="w-full"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Filter: Order Status */}
      <div>
        <label className="block mb-1 text-sm text-secondary">Order Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus | "")}
          className="w-full"
        >
          <option value="">All</option>
          {orderStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Filter: Order ID */}
      <div>
        <label className="block mb-1 text-sm text-secondary">Order ID</label>
        <input
          type="number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. 1024"
          className="w-full"
        />
      </div>

      {/* Filter: User ID */}
      <div>
        <label className="block mb-1 text-sm text-secondary">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. abc-user-123"
          className="w-full"
        />
      </div>

      {/* Action Buttons: Apply and Clear */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end mt-1">
        <Button
          variant="primary"
          size="sm"
          onClick={handleApply}
          className="w-full sm:w-auto"
        >
          Apply Filters
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleClear}
          className="w-full sm:w-auto"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default OrderFilters;