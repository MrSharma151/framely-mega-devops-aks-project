"use client";

import React from "react";
import Button from "../Button";
import { Order } from "@/services/OrderService";

interface OrderDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  order?: Order | null;
}

const OrderDeleteConfirmationModal: React.FC<OrderDeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  order,
}) => {
  // Do not render modal if it's closed or order data is missing
  if (!isOpen || !order) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content fade-in max-w-md w-full space-y-5">
        <h2 className="text-xl font-semibold text-primary">Delete Order</h2>

        {/* Confirmation message for order deletion */}
        <p className="text-sm text-secondary">
          Are you sure you want to delete the following order? This action cannot be undone.
        </p>

        {/* Displays key order details */}
        <ul className="text-sm text-muted space-y-1">
          <li><strong>Order ID:</strong> #{order.id}</li>
          <li><strong>Customer Name:</strong> {order.customerName}</li>
          <li><strong>Email:</strong> {order.email}</li>
        </ul>

        {/* Action buttons for cancel and confirm */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDeleteConfirmationModal;