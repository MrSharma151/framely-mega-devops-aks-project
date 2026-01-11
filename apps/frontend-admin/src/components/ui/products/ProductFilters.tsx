"use client";

import { useEffect, useState } from "react";
import { getAllCategories } from "@/services/CategoryService";
import Button from "@/components/ui/Button";

interface ProductFiltersProps {
  onSearch: (term: string) => void;
  onFilterCategory: (category: string) => void;
  onFilterBrand: (brand: string) => void;
  onSearchById: (id: number) => void;
  onClearFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onSearch,
  onFilterCategory,
  onFilterBrand,
  onSearchById,
  onClearFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [productId, setProductId] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // Fetches available category names on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data.map((cat) => cat.name));
    };
    fetchCategories();
  }, []);

  // Applies filters based on input priority
  const handleApplyFilters = () => {
    if (searchTerm) onSearch(searchTerm);
    else if (productId) onSearchById(Number(productId));
    else {
      if (category) onFilterCategory(category);
      if (brand) onFilterBrand(brand);
    }
  };

  // Clears all filters and resets local state
  const handleClear = () => {
    setSearchTerm("");
    setCategory("");
    setBrand("");
    setProductId("");
    onClearFilters();
  };

  return (
    <div className="flex flex-wrap items-end gap-4 mb-6">
      {/* Filter: Product Name */}
      <div className="flex flex-col">
        <label className="text-[var(--text-secondary)] mb-1 text-xs sm:text-sm">
          Product Name
        </label>
        <input
          type="text"
          placeholder="Enter product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded border border-[var(--border-color)] bg-[var(--surface-hover)] text-[var(--text-primary)] w-44 sm:w-48"
        />
      </div>

      {/* Filter: Brand */}
      <div className="flex flex-col">
        <label className="text-[var(--text-secondary)] mb-1 text-xs sm:text-sm">
          Brand
        </label>
        <input
          type="text"
          placeholder="Enter brand name"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="px-3 py-2 rounded border border-[var(--border-color)] bg-[var(--surface-hover)] text-[var(--text-primary)] w-44 sm:w-48"
        />
      </div>

      {/* Filter: Product ID */}
      <div className="flex flex-col">
        <label className="text-[var(--text-secondary)] mb-1 text-xs sm:text-sm">
          Product ID
        </label>
        <input
          type="number"
          placeholder="Enter product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="px-3 py-2 rounded border border-[var(--border-color)] bg-[var(--surface-hover)] text-[var(--text-primary)] w-44 sm:w-48"
        />
      </div>

      {/* Filter: Category */}
      <div className="flex flex-col">
        <label className="text-[var(--text-secondary)] mb-1 text-xs sm:text-sm">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded border border-[var(--border-color)] bg-[var(--surface-hover)] text-[var(--text-primary)] w-44 sm:w-48"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-2 sm:mt-0">
        <Button variant="primary" size="sm" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="secondary" size="sm" onClick={handleClear}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;