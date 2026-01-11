"use client";

import React, { useState, useEffect } from "react";
import Button from "../Button";
import { Order, OrderStatus } from "@/services/OrderService";

interface OrderStatusUpdateModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onConfirm: (newStatus: OrderStatus) => Promise<void>;
}

const OrderStatusUpdateModal: React.FC<OrderStatusUpdateModalProps> = ({
  isOpen,
  order,
  onClose,
  onConfirm,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order?.status ?? "Pending"
  );

  // Syncs selected status with the current order when modal opens
  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order, isOpen]);

  // Do not render modal if it's closed or order data is missing
  if (!isOpen || !order) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content fade-in max-w-md w-full space-y-5">
        <h2 className="text-xl font-semibold text-primary">Update Order Status</h2>

        {/* Displays basic order details */}
        <div className="text-sm text-secondary space-y-1">
          <p><strong>Order ID:</strong> #{order.id}</p>
          <p><strong>Customer:</strong> {order.customerName}</p>
        </div>

        {/* Dropdown to select new status */}
        <div className="space-y-2 pt-2">
          <label className="block text-sm font-medium text-secondary">
            Select New Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Action buttons for cancel and confirm */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConfirm(selectedStatus)}
            disabled={selectedStatus === order.status}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusUpdateModal;