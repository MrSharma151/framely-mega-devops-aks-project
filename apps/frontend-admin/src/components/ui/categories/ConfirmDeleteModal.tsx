"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Button from "../Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  categoryName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  categoryName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onCancel} className="modal-backdrop">
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
              Delete Category
            </Dialog.Title>

            {/* Confirmation message for category deletion */}
            <p className="text-sm text-secondary mb-6 leading-relaxed text-center">
              Are you sure you want to delete
              {categoryName ? ` “${categoryName}”` : " this category"}? This action cannot be undone.
            </p>

            {/* Action buttons for cancel and confirm */}
            <div className="flex justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={onConfirm}>
                Yes, Delete
              </Button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}