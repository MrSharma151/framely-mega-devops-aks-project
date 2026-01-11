// src/services/categoryService.ts
import apiClient from "./apiClient";

// Represents a single category returned by the backend
// Used for filtering and display
export interface Category {
  id: number;
  name: string;
  description: string;
}

// Structure of paginated category response from backend
export interface PaginatedCategoriesResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: Category[];
}

// Fetches paginated categories from backend
// Returns fallback structure on failure
export const getCategories = async (
  page = 1,
  pageSize = 50
): Promise<PaginatedCategoriesResponse> => {
  try {
    const response = await apiClient.get(
      `/Categories?page=${page}&pageSize=${pageSize}`
    );

    return {
      totalItems: response.data?.totalItems ?? 0,
      totalPages: response.data?.totalPages ?? 1,
      currentPage: response.data?.currentPage ?? page,
      pageSize: response.data?.pageSize ?? pageSize,
      data: response.data?.data ?? [],
    };
  } catch (error) {
    console.error("Failed to fetch categories:", error);

    return {
      totalItems: 0,
      totalPages: 1,
      currentPage: page,
      pageSize,
      data: [],
    };
  }
};

// Fetches all categories without pagination metadata
// Used for filtering on ShopPage
export const getAllCategories = async (): Promise<Category[]> => {
  const res = await getCategories(1, 50);
  return res.data;
};