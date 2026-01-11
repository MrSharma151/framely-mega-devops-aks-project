"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Button from "../Button";
import { Category } from "@/services/CategoryService";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onUpdate: (id: number, updatedCategory: Omit<Category, "id">) => Promise<boolean>;
  category: Category | null;
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  onUpdate,
  category,
}: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fills form fields when category data is available
  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
    }
  }, [category]);

  // Handles form submission and triggers category update
  const handleUpdate = async () => {
    if (!category || !name.trim() || loading) return;
    setLoading(true);
    const success = await onUpdate(category.id, { name, description });
    setLoading(false);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="modal-backdrop">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="modal-content fade-in">
            <Dialog.Title className="text-center text-xl font-semibold mb-4">
              Edit Category
            </Dialog.Title>

            {/* Form fields for editing category name and description */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-secondary">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full"
                  placeholder="Category Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-secondary">
                  Description
                </label>
                <textarea
                  className="w-full resize-none"
                  placeholder="Optional Description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Action buttons for cancel and update */}
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUpdate}
                  disabled={loading || !name.trim()}
                >
                  {loading ? "Updating..." : "Update Category"}
                </Button>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}