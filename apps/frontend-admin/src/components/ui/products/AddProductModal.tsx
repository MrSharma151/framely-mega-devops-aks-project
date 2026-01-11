"use client";

import { useEffect, useState } from "react";
import { Product } from "@/services/ProductService";
import { toast } from "react-hot-toast";
import { getAllCategories, Category } from "@/services/CategoryService";
import { uploadImage, deleteImage } from "@/services/imageService";
import Button from "@/components/ui/Button";

interface AddProductModalProps {
  onClose: () => void;
  onProductAdded: (newProduct: Omit<Product, "id">) => Promise<void>;
}

export default function AddProductModal({
  onClose,
  onProductAdded,
}: AddProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetches available categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Handles image selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handles product creation and image upload
  const handleCreate = async () => {
    if (loading) return;

    if (!name || !price || !brand || !categoryId || !description || !imageFile) {
      toast.error("Please fill in all required fields");
      return;
    }

    const form = new FormData();
    form.append("file", imageFile);

    setLoading(true);
    const toastId = toast.loading("Uploading image...");

    let imageUrl = "";
    try {
      imageUrl = await uploadImage(form);
      toast.dismiss(toastId);

      const newProduct: Omit<Product, "id"> = {
        name,
        price: Number(price),
        brand,
        categoryId: Number(categoryId),
        description,
        imageUrl,
      };

      await onProductAdded(newProduct);
      onClose();
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error during product creation:", error);
      toast.error("Failed to create product");

      // Deletes uploaded image if product creation fails
      if (imageUrl) {
        const fileName = imageUrl.split("/").pop();
        if (fileName) {
          try {
            await deleteImage(fileName);
            console.info("Orphan image deleted:", fileName);
          } catch (err) {
            console.warn("Failed to delete orphan image:", err);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

        {/* Form fields for product details */}
        <div className="space-y-4">
          <input
            className="w-full border border-[var(--border-color)] bg-[var(--surface-hover)] p-2 rounded"
            placeholder="Product Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full border border-[var(--border-color)] bg-[var(--surface-hover)] p-2 rounded"
            type="number"
            placeholder="Price (in ₹) *"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <input
            className="w-full border border-[var(--border-color)] bg-[var(--surface-hover)] p-2 rounded"
            placeholder="Brand *"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <select
            className="w-full border border-[var(--border-color)] bg-[var(--surface-hover)] p-2 rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option value="">Select Category *</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} (ID: {cat.id})
              </option>
            ))}
          </select>

          <textarea
            className="w-full border border-[var(--border-color)] bg-[var(--surface-hover)] p-2 rounded"
            placeholder="Description *"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-[var(--border-color)] bg-[var(--surface-hover)] p-2 rounded"
          />

          {/* Image upload guidelines */}
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Only image files (JPEG, PNG, GIF, WebP, AVIF) are allowed. Max size: 2MB.
          </p>

          {/* Preview of selected image */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 h-32 object-contain rounded border"
            />
          )}
        </div>

        {/* Action buttons for cancel and submit */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleCreate} isLoading={loading}>
            Add Product
          </Button>
        </div>
      </div>
    </div>
  );
}