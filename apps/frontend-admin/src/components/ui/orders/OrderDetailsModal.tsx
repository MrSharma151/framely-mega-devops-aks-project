"use client";

import React from "react";
import Button from "../Button";
import { Order } from "@/services/OrderService";

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  // Do not render modal if it's closed or order data is missing
  if (!isOpen || !order) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content fade-in max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Order #{order.id} Details
        </h2>

        {/* Displays customer and order metadata */}
        <div className="space-y-2 text-sm text-secondary">
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.mobileNumber}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>User ID:</strong> {order.userId ?? "N/A"}</p>
        </div>

        {/* Displays list of items in the order */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-primary mb-2">Items</h3>
          <div className="max-h-48 overflow-y-auto table-glass">
            <table className="w-full text-sm">
              <thead className="text-secondary border-b border-[var(--border-color)]">
                <tr>
                  <th className="py-2 text-left">Product</th>
                  <th className="py-2 text-left">Product ID</th>
                  <th className="py-2 text-left">Qty</th>
                  <th className="py-2 text-left">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-highlight transition">
                    <td className="py-2">{item.productName}</td>
                    <td className="py-2">{item.productId}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">₹{item.unitPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Displays total order amount */}
          <p className="mt-4 text-right text-lg font-bold text-highlight">
            Total: ₹{order.totalAmount.toFixed(2)}
          </p>
        </div>

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <Button variant="danger" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;