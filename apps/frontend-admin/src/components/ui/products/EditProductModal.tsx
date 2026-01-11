"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/services/ProductService";
import { getAllCategories } from "@/services/CategoryService";
import { uploadImage, deleteImage } from "@/services/imageService";
import { toast } from "react-hot-toast";
import Button from "../Button";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onProductUpdated: (updatedData: Product) => Promise<void>;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  onClose,
  onProductUpdated,
}) => {
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [imageUrl] = useState(product.imageUrl);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<number>(product.categoryId || 0);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetches available categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const all = await getAllCategories();
      setCategories(all);
    };
    fetchCategories();
  }, []);

  // Handles form submission and image upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let newImageUrl = imageUrl;
    let uploadedFileName = "";

    try {
      if (newImageFile) {
        const oldFileName = imageUrl.split("/").pop();
        if (oldFileName) await deleteImage(oldFileName);

        const formData = new FormData();
        formData.append("file", newImageFile);
        newImageUrl = await uploadImage(formData);
        uploadedFileName = newImageUrl.split("/").pop() || "";
      }

      const updatedData: Product = {
        id: product.id,
        name,
        brand,
        description,
        price,
        imageUrl: newImageUrl,
        categoryId,
      };

      await onProductUpdated(updatedData);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
      if (uploadedFileName) {
        await deleteImage(uploadedFileName);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content fade-in max-w-lg overflow-y-auto max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Displays product ID in read-only mode */}
          <input
            type="text"
            value={`ID: ${product.id}`}
            disabled
            className="w-full p-2 rounded bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] cursor-not-allowed"
          />

          {/* Editable fields for product details */}
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-primary)]"
            required
          />
          <input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-2 rounded bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-primary)]"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-primary)]"
            rows={3}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full p-2 rounded bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-primary)]"
            required
          />

          {/* Displays image preview if available */}
          {(newImageFile || imageUrl) && (
            <img
              src={newImageFile ? URL.createObjectURL(newImageFile) : imageUrl}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded border border-[var(--border-color)] mb-2"
            />
          )}

          {/* Image upload input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setNewImageFile(file);
            }}
            className="w-full p-2 rounded bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-primary)]"
          />

          {/* Image upload guidelines */}
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Only image files (JPEG, PNG, GIF, WebP, AVIF) are allowed. Max size: 2MB.
          </p>

          {/* Category selection dropdown */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
            className="w-full p-2 rounded bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-primary)]"
            required
          >
            <option value={0}>Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;