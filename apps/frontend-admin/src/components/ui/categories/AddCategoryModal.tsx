"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Button from "../Button";
import { Category } from "@/services/CategoryService";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCategory: Omit<Category, "id">) => Promise<void>;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAdd,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Handles form submission and triggers category creation
  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await onAdd({ name, description });
    setLoading(false);
    setName("");
    setDescription("");
    onClose();
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
              Add New Category
            </Dialog.Title>

            {/* Form fields for category name and description */}
            <div className="space-y-4">
              <input
                className="w-full"
                placeholder="Category Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="w-full resize-none"
                placeholder="Optional description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Action buttons for cancel and submit */}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={loading || !name.trim()}
              >
                {loading ? "Adding..." : "Add Category"}
              </Button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}