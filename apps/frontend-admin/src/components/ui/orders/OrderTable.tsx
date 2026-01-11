"use client";

import React from "react";
import { Order } from "@/services/OrderService";
import Button from "../Button";
import { Eye, RotateCcw, Trash2 } from "lucide-react";

export interface OrderTableProps {
  orders: Order[];
  onViewDetails: (id: number) => Promise<void>;
  onUpdateStatus: (id: number) => Promise<void>;
  onDelete: (order: Order) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onViewDetails,
  onUpdateStatus,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Displays fallback message when no orders are available
  if (orders.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--text-secondary)]">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/60 backdrop-blur-lg shadow-lg fade-in">
      <table className="min-w-full text-sm text-left text-[var(--text-primary)]">
        <thead className="bg-[var(--surface-hover)]/60 backdrop-blur-sm uppercase text-xs font-semibold text-[var(--text-secondary)]">
          <tr>
            {[
              "ID",
              "Date",
              "Customer",
              "Email",
              "Mobile",
              "Total (₹)",
              "Status",
              "Actions",
            ].map((heading, i) => (
              <th key={i} className="px-4 py-3">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-[var(--surface-hover)]/50 transition-all duration-200"
            >
              <td className="px-4 py-3 text-[var(--primary)] font-semibold">
                {order.id}
              </td>
              <td className="px-4 py-3">
                {new Date(order.orderDate).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-4 py-3 font-medium">{order.customerName}</td>
              <td className="px-4 py-3 text-sm">{order.email}</td>
              <td className="px-4 py-3 text-sm">{order.mobileNumber}</td>
              <td className="px-4 py-3 font-semibold text-[var(--highlight)]">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                    order.status === "Pending"
                      ? "bg-yellow-600"
                      : order.status === "Processing"
                      ? "bg-blue-600"
                      : order.status === "Completed"
                      ? "bg-green-600"
                      : "bg-red-600"
                  } text-white`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3 flex justify-center gap-3 flex-wrap">
                {/* Button to view order details */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="hover:shadow-[0_0_10px_var(--primary)]"
                  onClick={() => onViewDetails(order.id)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>

                {/* Button to update order status */}
                <Button
                  variant="primary"
                  size="sm"
                  className="hover:shadow-[0_0_10px_var(--highlight)]"
                  onClick={() => onUpdateStatus(order.id)}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Update
                </Button>

                {/* Button to delete order */}
                <Button
                  variant="danger"
                  size="sm"
                  className="hover:shadow-[0_0_10px_var(--danger)]"
                  onClick={() => onDelete(order)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 py-5 border-t border-[var(--border-color)]">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-[var(--text-primary)]">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrderTable;