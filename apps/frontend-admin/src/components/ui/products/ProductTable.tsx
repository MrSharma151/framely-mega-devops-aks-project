"use client";

import { Product } from "@/services/ProductService";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import Button from "../Button";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEditClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
  refreshProducts: () => Promise<void>;
}

export default function ProductTable({
  products,
  loading,
  onEditClick,
  onDeleteClick,
}: ProductTableProps) {
  // Displays loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-[var(--primary)]" />
      </div>
    );
  }

  // Displays fallback message when no products are available
  if (products.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--text-secondary)]">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/60 backdrop-blur-lg shadow-lg">
      <table className="min-w-full text-sm text-left text-[var(--text-primary)]">
        <thead className="bg-[var(--surface-hover)]/60 backdrop-blur-sm uppercase text-xs font-semibold text-[var(--text-secondary)]">
          <tr>
            {[
              "ID",
              "Image",
              "Name",
              "Description",
              "Category ID",
              "Category Name",
              "Brand",
              "Price (₹)",
              "Actions",
            ].map((heading, i) => (
              <th key={i} className="px-4 py-3">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-[var(--surface-hover)]/50 transition-all duration-200"
            >
              <td className="px-4 py-3 text-[var(--primary)] font-semibold">
                {product.id}
              </td>
              <td className="px-4 py-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm border border-[var(--border-color)]"
                />
              </td>
              <td className="px-4 py-3 font-medium">{product.name}</td>
              <td
                className="px-4 py-3 text-sm max-w-xs truncate"
                title={product.description}
              >
                {product.description}
              </td>
              <td className="px-4 py-3">{product.categoryId}</td>
              <td className="px-4 py-3">{product.categoryName}</td>
              <td className="px-4 py-3">{product.brand}</td>
              <td className="px-4 py-3 font-semibold text-[var(--highlight)]">
                ₹{product.price.toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3 flex justify-center gap-3">
                {/* Button to trigger product edit */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="hover:shadow-[0_0_10px_var(--primary)]"
                  onClick={() => onEditClick(product)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>

                {/* Button to trigger product deletion */}
                <Button
                  variant="danger"
                  size="sm"
                  className="hover:shadow-[0_0_10px_var(--danger)]"
                  onClick={() => onDeleteClick(product)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}