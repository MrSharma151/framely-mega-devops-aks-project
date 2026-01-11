"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Loader2, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation"; // ✅ Hook is now in a client component

import {
  getProducts,
  getProductsByCategoryName,
  Product,
  PaginatedProductsResponse,
} from "@/services/productService";
import { getCategories, Category } from "@/services/categoryService";

import CategoryFilter from "@/components/ui/CategoryFilter";
import ProductCard from "@/components/ui/ProductCard";

export default function ShopClient() {
  const searchParams = useSearchParams();
  const initialCategoryFromURL = searchParams.get("category");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"" | "low-high" | "high-low">("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 10; // Always 10 products per page

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await getCategories();
        setCategories(res.data || []);
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when page or category changes
  useEffect(() => {
    if (initialCategoryFromURL) {
      setSelectedCategoryName(initialCategoryFromURL);
      fetchCategoryProducts(initialCategoryFromURL);
    } else {
      fetchAllProducts(currentPage);
    }
  }, [initialCategoryFromURL, currentPage]);

  // Fetch all products with backend pagination
  const fetchAllProducts = async (page: number) => {
    try {
      setLoadingProducts(true);
      const res: PaginatedProductsResponse = await getProducts(page, PAGE_SIZE, "name", "asc");
      setProducts(res.data || []);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch products by category (frontend only)
  const fetchCategoryProducts = async (categoryName: string) => {
    try {
      setLoadingProducts(true);
      const res = await getProductsByCategoryName(categoryName.trim());
      setProducts(res || []);
      setTotalPages(1);
      setCurrentPage(1);
    } catch {
      toast.error(`Failed to load products for "${categoryName}"`);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryName: string | null) => {
    setSelectedCategoryName(categoryName);
    if (!categoryName) {
      fetchAllProducts(1); // Reset to first page
    } else {
      fetchCategoryProducts(categoryName);
    }
  };

  // Apply search and sort (frontend only)
  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0;
    });

  const sortLabel =
    sortOrder === "low-high"
      ? "Price: Low → High"
      : sortOrder === "high-low"
      ? "Price: High → Low"
      : "Sort by Price";

  const toggleSort = () => {
    setSortOrder((prev) =>
      prev === "" ? "low-high" : prev === "low-high" ? "high-low" : ""
    );
  };

  return (
    <section className="relative py-16 sm:py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-gray-800/10 to-transparent pointer-events-none" />

      {/* Page Title */}
      <div className="relative z-10 text-center mb-10 px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Shop <span className="text-blue-400">Eyewear</span>
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
          Premium quality eyewear. Find your perfect style today.
        </p>
      </div>

      {/* Category Filter */}
      <div className="relative z-20">
        <CategoryFilter
          categories={categories}
          selectedCategoryName={selectedCategoryName}
          onCategorySelect={handleCategorySelect}
          loading={loadingCategories}
        />
      </div>

      {/* Search & Sort Controls */}
      <div className="relative z-20 container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 mt-6 mb-8">
        {/* Search Bar */}
        <div className="flex items-center bg-[var(--background-alt)] rounded-full px-4 py-2 w-full sm:w-72 shadow-inner">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-200 ml-3 w-full"
          />
        </div>

        {/* Sort Button */}
        <button
          onClick={toggleSort}
          className="flex items-center gap-2 bg-[var(--background-alt)] px-4 py-2 rounded-full text-gray-300 hover:bg-blue-500/20 transition shadow-sm"
        >
          <Filter size={16} />
          {sortLabel}
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Loading State */}
      {loadingProducts && (
        <div className="flex justify-center items-center py-20 text-gray-400">
          <Loader2 className="animate-spin mr-2" /> Loading products...
        </div>
      )}

      {/* Product Grid */}
      {!loadingProducts && (
        <>
          <div className="relative z-20 container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center text-gray-400">
                No products found.
              </div>
            )}
          </div>

          {/* Pagination Controls (only for non-category listing) */}
          {!selectedCategoryName && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition"
              >
                ← Prev
              </button>

              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}