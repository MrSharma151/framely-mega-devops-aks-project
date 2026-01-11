"use client";

import React, { useEffect, useState } from "react";
import { Category } from "@/services/CategoryService";
import CategorySearchBar from "@/components/ui/categories/CategorySearchBar";
import CategoryTable from "@/components/ui/categories/CategoryTable";
import AddCategoryModal from "@/components/ui/categories/AddCategoryModal";
import EditCategoryModal from "@/components/ui/categories/EditCategoryModal";
import ConfirmDeleteModal from "@/components/ui/categories/ConfirmDeleteModal";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/CategoryService";
import Button from "@/components/ui/Button";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    open: false,
    categoryId: null as number | null,
    categoryName: "",
  });

  // Fetches all categories from the backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on initial render
  useEffect(() => {
    fetchCategories();
  }, []);

  // Updates search term used for filtering categories
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Adds a new category and refreshes the list
  const handleAddCategory = async (newCategory: Omit<Category, "id">) => {
    const success = await createCategory(newCategory);
    if (success) {
      fetchCategories();
      setIsAddModalOpen(false);
    }
  };

  // Updates an existing category and refreshes the list
  const handleEditCategory = async (
    id: number,
    updatedCategory: Omit<Category, "id">
  ): Promise<boolean> => {
    const success = await updateCategory(id, updatedCategory);
    if (success) {
      fetchCategories();
      setSelectedCategory(null);
      return true;
    }
    return false;
  };

  // Opens the delete confirmation modal for a selected category
  const triggerDeleteModal = (category: Category) => {
    setConfirmDeleteModal({
      open: true,
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  // Confirms deletion of a category and refreshes the list
  const confirmDeleteCategory = async () => {
    if (confirmDeleteModal.categoryId) {
      const success = await deleteCategory(confirmDeleteModal.categoryId);
      if (success) fetchCategories();
    }
    setConfirmDeleteModal({ open: false, categoryId: null, categoryName: "" });
  };

  // Opens the edit modal for a selected category
  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
  };

  // Filters categories based on the search term
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renders the category management interface
  return (
    <div className="page-container px-4 sm:px-6 lg:px-8 py-6 space-y-8 fade-in">
      {/* Page header with title and add button */}
      <header className="flex-row-between gap-4">
        <div>
          <h1 className="title">📁 Categories</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm sm:text-base">
            Manage and organize your product categories here.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)}>
          + Add Category
        </Button>
      </header>

      {/* Search bar for filtering categories */}
      <section className="card">
        <CategorySearchBar searchTerm={searchTerm} onSearch={handleSearch} />
      </section>

      {/* Table displaying filtered categories */}
      <section className="overflow-x-auto">
        <CategoryTable
          categories={filteredCategories}
          onEdit={handleOpenEditModal}
          onDelete={(id) => {
            const category = categories.find((cat) => cat.id === id);
            if (category) triggerDeleteModal(category);
          }}
          isLoading={loading}
        />
      </section>

      {/* Modal for adding a new category */}
      {isAddModalOpen && (
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCategory}
        />
      )}

      {/* Modal for editing an existing category */}
      {selectedCategory && (
        <EditCategoryModal
          isOpen={!!selectedCategory}
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onUpdate={handleEditCategory}
          onSuccess={() => {}}
        />
      )}

      {/* Modal for confirming category deletion */}
      {confirmDeleteModal.open && (
        <ConfirmDeleteModal
          isOpen={confirmDeleteModal.open}
          categoryName={confirmDeleteModal.categoryName}
          onConfirm={confirmDeleteCategory}
          onCancel={() =>
            setConfirmDeleteModal({ open: false, categoryId: null, categoryName: "" })
          }
        />
      )}
    </div>
  );
};

export default CategoriesPage;