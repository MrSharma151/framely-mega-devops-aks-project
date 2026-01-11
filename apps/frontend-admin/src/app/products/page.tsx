"use client";

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  Product,
  getProducts,
  searchProducts,
  getProductsByCategoryName,
  getProductsByBrand,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "@/services/ProductService";

import AddProductModal from "@/components/ui/products/AddProductModal";
import EditProductModal from "@/components/ui/products/EditProductModal";
import ProductTable from "@/components/ui/products/ProductTable";
import ProductFilters from "@/components/ui/products/ProductFilters";
import ProductDeleteConfirmationModal from "@/components/ui/products/ProductDeleteConfirmationModal";
import Button from "@/components/ui/Button";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy] = useState("name");
  const [sortOrder] = useState<"asc" | "desc">("asc");

  // Reusable fetch function for external calls
  const refreshProducts = async () => {
    setLoading(true);
    const response = await getProducts(currentPage, pageSize, sortBy, sortOrder);
    if (response) {
      setProducts(response.data);
      setTotalPages(response.totalPages);
    }
    setLoading(false);
  };

  // Fetch products when the page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await getProducts(currentPage, pageSize, sortBy, sortOrder);
      if (response) {
        setProducts(response.data);
        setTotalPages(response.totalPages);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [currentPage, pageSize, sortBy, sortOrder]);

  const handleSearch = async (term: string) => {
    if (!term.trim()) return refreshProducts();
    setLoading(true);
    const results = await searchProducts(term);
    setProducts(results);
    setTotalPages(1);
    setCurrentPage(1);
    setLoading(false);
  };

  const handleFilterCategory = async (category: string) => {
    if (!category) return refreshProducts();
    setLoading(true);
    const results = await getProductsByCategoryName(category);
    setProducts(results);
    setTotalPages(1);
    setCurrentPage(1);
    setLoading(false);
  };

  const handleFilterBrand = async (brand: string) => {
    if (!brand) return refreshProducts();
    setLoading(true);
    const results = await getProductsByBrand(brand);
    setProducts(results);
    setTotalPages(1);
    setCurrentPage(1);
    setLoading(false);
  };

  const handleProductByIdSearch = async (id: number) => {
    if (!id) return;
    const product = await getProductById(id);
    if (product) {
      setProducts([product]);
      setTotalPages(1);
      setCurrentPage(1);
    } else {
      toast.error("No product found with this ID");
    }
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    refreshProducts();
  };

  const handleProductAdded = async (newProduct: Omit<Product, "id">) => {
    const created = await createProduct(newProduct);
    if (created) {
      refreshProducts();
      setShowAddModal(false);
    }
  };

  const handleProductUpdated = async (id: number, updatedData: Partial<Product>) => {
    const success = await updateProduct(id, updatedData);
    if (success) {
      refreshProducts();
      setProductToEdit(null);
    }
  };

  const handleDeleteClick = (product: Product) => setProductToDelete(product);

  const handleConfirmDelete = async (product: Product) => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id, product.imageUrl);
      toast.success("Product deleted successfully");
      refreshProducts();
    } catch (error: unknown) {
      toast.error("Failed to delete product");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => setProductToDelete(null);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const renderModals = () => (
    <>
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}
      {productToEdit && (
        <EditProductModal
          product={productToEdit}
          onClose={() => setProductToEdit(null)}
          onProductUpdated={(fields) => handleProductUpdated(productToEdit.id, fields)}
        />
      )}
      {productToDelete && (
        <ProductDeleteConfirmationModal
          isOpen={true}
          product={productToDelete}
          isDeleting={isDeleting}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );

  return (
    <div className="page-container px-4 sm:px-6 lg:px-8 py-6 space-y-8 fade-in">
      {/* Page header with title and description */}
      <header className="flex-row-between gap-4">
        <div>
          <h1 className="title">📦 Products</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm sm:text-base">
            Manage and monitor all your product inventory here.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowAddModal(true)}>
          + Add Product
        </Button>
      </header>

      {/* Filter section for search and category/brand filtering */}
      <section className="card">
        <ProductFilters
          onSearch={handleSearch}
          onFilterCategory={handleFilterCategory}
          onFilterBrand={handleFilterBrand}
          onSearchById={handleProductByIdSearch}
          onClearFilters={handleClearFilters}
        />
      </section>

      {/* Table displaying product list */}
      <section className="overflow-x-auto">
        <ProductTable
          products={products}
          loading={loading}
          onEditClick={setProductToEdit}
          onDeleteClick={handleDeleteClick}
          refreshProducts={refreshProducts}
        />
      </section>

      {/* Pagination controls */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="secondary" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="text-[var(--text-primary)] text-sm sm:text-base">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </section>

      {/* Modal rendering */}
      {renderModals()}
    </div>
  );
}