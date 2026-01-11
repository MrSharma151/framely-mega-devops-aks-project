// src/components/ui/CategoryFilter.tsx
"use client";

import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

// Category shape used for filtering
export interface Category {
  id: number;
  name: string;
  description: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryName: string | null;
  onCategorySelect: (categoryName: string | null) => void;
  loading?: boolean;
}

// Renders a category filter bar with dynamic buttons and loading fallback
export default function CategoryFilter({
  categories,
  selectedCategoryName,
  onCategorySelect,
  loading = false,
}: CategoryFilterProps) {
  // Loading state fallback
  if (loading) {
    return (
      <div className="flex justify-center items-center py-4 text-gray-400">
        <Loader2 className="animate-spin mr-2" />
        Loading categories...
      </div>
    );
  }

  // Empty state fallback
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center text-gray-400 py-3">
        No categories available.
      </div>
    );
  }

  // Sort categories alphabetically by name
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="px-4 mb-8">
      <div
        className="
          flex flex-wrap gap-4 justify-center sm:justify-start
          rounded-2xl p-6
          bg-gradient-to-r from-gray-950/70 to-gray-900/40 
          backdrop-blur-md border border-white/10
          shadow-[0_4px_25px_rgba(0,0,0,0.25)]
        "
      >
        {/* "All" category button */}
        <CategoryButton
          label="All"
          isSelected={selectedCategoryName === null}
          onClick={() => onCategorySelect(null)}
        />

        {/* Dynamic category buttons */}
        {sortedCategories.map((cat) => {
          const cleanName = cat.name.trim();
          return (
            <CategoryButton
              key={cat.id}
              label={cleanName}
              isSelected={selectedCategoryName === cleanName}
              onClick={() => onCategorySelect(cleanName)}
            />
          );
        })}
      </div>
    </div>
  );
}

// Individual category button with variant styling and glow effect
function CategoryButton({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      variant={isSelected ? "primary" : "outline"}
      className={`
        relative rounded-full text-sm font-semibold tracking-wide 
        transition-all duration-300 ease-out
        px-5 py-2
        ${
          isSelected
            ? "scale-105 shadow-lg shadow-blue-500/30 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border border-blue-400/40"
            : "hover:scale-105 hover:shadow-md"
        }
      `}
    >
      {label}

      {/* Glow ring for selected category */}
      {isSelected && (
        <span
          className="
            absolute inset-0 rounded-full 
            border border-blue-300/40 
            shadow-[0_0_12px_rgba(80,120,255,0.4)] 
            pointer-events-none
          "
        />
      )}
    </Button>
  );
}