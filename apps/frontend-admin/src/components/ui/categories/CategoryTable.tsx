import React from "react";
import { Category } from "@/services/CategoryService";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../Button";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  // Displays loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="text-[var(--text-secondary)] italic">Loading categories...</span>
      </div>
    );
  }

  // Displays fallback message when no categories are available
  if (categories.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--text-secondary)] italic">
        No categories found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/60 backdrop-blur-lg shadow-lg">
      <table className="min-w-full text-sm text-left text-[var(--text-primary)]">
        <thead className="bg-[var(--surface-hover)]/60 backdrop-blur-sm uppercase text-xs font-semibold text-[var(--text-secondary)]">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {categories.map((category) => (
            <tr
              key={category.id}
              className="hover:bg-[var(--surface-hover)]/50 transition-all duration-200"
            >
              <td className="px-4 py-3 font-semibold text-[var(--primary)]">
                {category.id}
              </td>
              <td className="px-4 py-3 font-medium">{category.name}</td>
              <td className="px-4 py-3 text-[var(--text-secondary)]">
                {category.description || "-"}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  {/* Button to trigger category edit */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="hover:shadow-[0_0_10px_var(--primary)]"
                    onClick={() => onEdit(category)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>

                  {/* Button to trigger category deletion */}
                  <Button
                    variant="danger"
                    size="sm"
                    className="hover:shadow-[0_0_10px_var(--danger)]"
                    onClick={() => onDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;