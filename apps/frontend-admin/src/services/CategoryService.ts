import apiClient from "./apiClient";
import { toast } from "react-hot-toast";

// Defines the category data structure returned by the backend
export interface Category {
  id: number;
  name: string;
  description: string;
}

// Defines the structure of paginated category responses
export interface PaginatedCategoriesResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: Category[];
}

// Displays a consistent toast error and logs the error to console
const toastError = (message: string, error: unknown) => {
  toast.error(message);
  console.error(`Error: ${message}`, error);
};

/**
 * Fetches categories with pagination
 * @param page - Page number (default = 1)
 * @param pageSize - Items per page (default = 20)
 */
export const getCategories = async (
  page = 1,
  pageSize = 20
): Promise<PaginatedCategoriesResponse> => {
  try {
    const response = await apiClient.get(`/Categories?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    toastError("Failed to fetch categories", error);
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
 * Fetches all categories without pagination metadata
 * Useful for dropdowns, filters, etc.
 */
export const getAllCategories = async (): Promise<Category[]> => {
  const res = await getCategories(1, 100);
  return res.data;
};

/**
 * Fetches details of a single category by ID
 */
export const getCategoryById = async (id: number): Promise<Category | null> => {
  try {
    const response = await apiClient.get(`/Categories/${id}`);
    return response.data;
  } catch (error) {
    toastError("Failed to fetch category details", error);
    return null;
  }
};

/**
 * Creates a new category
 * @param category - New category data (without ID)
 */
export const createCategory = async (
  category: Omit<Category, "id">
): Promise<boolean> => {
  try {
    await apiClient.post(`/Categories`, category);
    toast.success("Category created successfully");
    return true;
  } catch (error) {
    toastError("Failed to create category", error);
    return false;
  }
};

/**
 * Updates an existing category by ID
 * @param id - Category ID
 * @param category - Updated category data
 */
export const updateCategory = async (
  id: number,
  category: Omit<Category, "id">
): Promise<boolean> => {
  try {
    const payload = { id, ...category };
    await apiClient.put(`/Categories/${id}`, payload);
    toast.success("Category updated successfully");
    return true;
  } catch (error) {
    toastError("Failed to update category", error);
    return false;
  }
};

/**
 * Deletes a category by ID
 * @param id - Category ID
 */
export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    await apiClient.delete(`/Categories/${id}`);
    toast.success("Category deleted");
    return true;
  } catch (error) {
    toastError("Failed to delete category", error);
    return false;
  }
};