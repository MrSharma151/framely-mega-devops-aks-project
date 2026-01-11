import apiClient from "./apiClient";
import { deleteImage } from "./imageService";
import { toast } from "react-hot-toast";

// Defines the product structure returned by the backend
export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  categoryName?: string;
}

// Defines the payload structure for creating a product
export type CreateProductPayload = {
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
};

// Defines the structure of paginated product responses
export interface PaginatedProductsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: Product[];
}

/**
 * Fetches paginated products with sorting support
 */
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
    return response.data;
  } catch (error: unknown) {
    toast.error("Failed to fetch products");
    console.error("Error in getProducts:", error);
    return {
      totalItems: 0,
      totalPages: 1,
      currentPage: page,
      pageSize,
      data: [],
    };
  }
};

/**
 * Fetches a single product by its ID
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await apiClient.get(`/Products/${id}`);
    return response.data ?? null;
  } catch (error: unknown) {
    toast.error("Failed to fetch product details");
    console.error(`Error in getProductById(${id}):`, error);
    return null;
  }
};

/**
 * Creates a new product
 */
export const createProduct = async (
  product: CreateProductPayload
): Promise<Product | null> => {
  try {
    const response = await apiClient.post("/Products", product);
    toast.success("Product created successfully");
    return response.data;
  } catch (error: unknown) {
    toast.error("Failed to create product");
    console.error("Error in createProduct:", error);
    return null;
  }
};

/**
 * Updates an existing product by ID
 */
export const updateProduct = async (
  id: number,
  updatedProduct: Partial<Product>
): Promise<boolean> => {
  try {
    updatedProduct.id = id;
    await apiClient.put(`/Products/${id}`, updatedProduct);
    toast.success("Product updated successfully");
    return true;
  } catch (error: unknown) {
    toast.error("Failed to update product");
    console.error("Error in updateProduct:", error);
    return false;
  }
};

/**
 * Deletes a product and its associated image
 */
export const deleteProduct = async (
  id: number,
  imageUrl: string
): Promise<boolean> => {
  try {
    const fileName = imageUrl ? imageUrl.split("/").pop() : null;
    if (fileName) {
      await deleteImage(fileName);
    }

    await apiClient.delete(`/Products/${id}`);
    toast.success("Product and image deleted");

    console.log("Deleting product:", { id, imageUrl });
    return true;
  } catch (error: unknown) {
    toast.error("Failed to delete product or image");
    console.error(`Error in deleteProduct(${id}):`, error);
    return false;
  }
};

/**
 * Searches products by keyword
 */
export const searchProducts = async (term: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/Products/search?term=${term.trim()}`);
    return response.data ?? [];
  } catch (error: unknown) {
    toast.error("Failed to search products");
    console.error("Error in searchProducts:", error);
    return [];
  }
};

/**
 * Filters products by category name
 */
export const getProductsByCategoryName = async (
  categoryName: string
): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/Products/category?name=${categoryName.trim()}`);
    return response.data ?? [];
  } catch (error: unknown) {
    toast.error(`Failed to filter by category "${categoryName}"`);
    console.error(`Error in getProductsByCategoryName("${categoryName}"):`, error);
    return [];
  }
};

/**
 * Filters products by brand name
 */
export const getProductsByBrand = async (
  brandName: string
): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/Products/brand?name=${brandName.trim()}`);
    return response.data ?? [];
  } catch (error: unknown) {
    toast.error(`Failed to filter by brand "${brandName}"`);
    console.error(`Error in getProductsByBrand("${brandName}"):`, error);
    return [];
  }
};