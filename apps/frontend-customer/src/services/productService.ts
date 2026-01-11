// src/services/productService.ts
import apiClient from "./apiClient";

// Represents a single product returned by the backend
export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;      // Used for backend reference
  categoryName?: string;   // Optional, used for UI filtering
}

// Structure of paginated product response
export interface PaginatedProductsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: Product[];
}

// Fetches paginated products with sorting options
// Used on ShopPage for listing and navigation
export const getProducts = async (
  page = 1,
  pageSize = 10,
  sortBy = "name",
  sortOrder: "asc" | "desc" = "asc"
): Promise<PaginatedProductsResponse> => {
  try {
    const response = await apiClient.get(
      `/Products?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );

    return {
      totalItems: response.data?.totalItems ?? 0,
      totalPages: response.data?.totalPages ?? 1,
      currentPage: response.data?.currentPage ?? page,
      pageSize: response.data?.pageSize ?? pageSize,
      data: response.data?.data ?? [],
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return {
      totalItems: 0,
      totalPages: 1,
      currentPage: page,
      pageSize,
      data: [],
    };
  }
};

// Fetches a single product by ID
// Adds fallback values for missing fields
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await apiClient.get(`/Products/${id}`);

    if (!response.data) return null;

    return {
      ...response.data,
      categoryName: response.data.categoryName || "Uncategorized",
      imageUrl: response.data.imageUrl || "/images/products/aviator.jpeg",
    } as Product;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
};

// Fetches products by category name
// Used for category-based filtering on ShopPage
export const getProductsByCategoryName = async (
  categoryName: string
): Promise<Product[]> => {
  try {
    const cleanName = categoryName.trim();
    const url = `/Products/category?name=${cleanName}`;

    const response = await apiClient.get(url, { transformRequest: [(data) => data] });

    return response.data ?? [];
  } catch (error) {
    console.error(`Failed to fetch products for category "${categoryName}":`, error);
    return [];
  }
};

// Fetches products by brand name
// Used for brand-based filtering
export const getProductsByBrand = async (brandName: string): Promise<Product[]> => {
  try {
    const cleanBrand = brandName.trim();
    const url = `/Products/brand?name=${cleanBrand}`;

    const response = await apiClient.get(url, { transformRequest: [(data) => data] });

    return response.data ?? [];
  } catch (error) {
    console.error(`Failed to fetch products for brand "${brandName}":`, error);
    return [];
  }
};

// Performs server-side search for products
// Used for keyword-based filtering
export const searchProducts = async (term: string): Promise<Product[]> => {
  try {
    const cleanTerm = term.trim();
    const url = `/Products/search?term=${cleanTerm}`;

    const response = await apiClient.get(url, { transformRequest: [(data) => data] });

    return response.data ?? [];
  } catch (error) {
    console.error(`Failed to search products for term "${term}":`, error);
    return [];
  }
};