"use client";

import React from "react";
import Button from "../Button";
import { Product } from "@/services/ProductService";

interface Props {
  isOpen: boolean;
  product: Product;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: (product: Product) => void;
}

export default function ProductDeleteConfirmationModal({
  isOpen,
  product,
  isDeleting,
  onCancel,
  onConfirm,
}: Props) {
  // Do not render modal if it's closed or product data is missing
  if (!isOpen || !product) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-content fade-in max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal heading */}
        <h2 className="text-xl font-semibold text-red-400 mb-3">
          Delete Product
        </h2>

        {/* Confirmation message with product name */}
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Are you sure you want to delete{" "}
          <span className="font-bold text-[var(--text-primary)]">
            {product.name}
          </span>
          ? This action cannot be undone.
        </p>

        {/* Action buttons for cancel and confirm */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(product)}
            variant="danger"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}