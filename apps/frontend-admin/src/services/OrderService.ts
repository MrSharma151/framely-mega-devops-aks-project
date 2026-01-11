import apiClient from "./apiClient";
import { toast } from "react-hot-toast";

// Defines the strict set of allowed order statuses
export type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

// Defines the structure of an individual order item
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  orderId: number;
}

// Defines the structure of an order
export interface Order {
  id: number;
  orderDate: string;
  customerName: string;
  email: string;
  mobileNumber: string;
  address: string;
  totalAmount: number;
  status: OrderStatus;
  userId?: string;
  items: OrderItem[];
}

// Defines the structure of paginated order responses
export interface PaginatedOrderResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: Order[];
}

/**
 * Fetches paginated orders with optional sorting and status filtering
 */
export const getPaginatedOrders = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  sortBy: string = "date",
  sortOrder: "asc" | "desc" = "desc",
  status?: OrderStatus
): Promise<PaginatedOrderResponse | null> => {
  try {
    const params: Record<string, string | number> = {
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
    };

    if (status) {
      params.status = status;
    }

    const response = await apiClient.get("/Orders", { params });
    return response.data ?? null;
  } catch (error: unknown) {
    toast.error("Failed to fetch orders");
    console.error("Error in getPaginatedOrders:", error);
    return null;
  }
};

/**
 * Fetches a single order by its ID
 */
export const getOrderById = async (id: number): Promise<Order | null> => {
  try {
    const response = await apiClient.get(`/Orders/${id}`);
    return response.data ?? null;
  } catch (error: unknown) {
    toast.error("Failed to fetch order details");
    console.error(`Error in getOrderById(${id}):`, error);
    return null;
  }
};

/**
 * Updates the status of an order
 */
export const updateOrderStatus = async (
  id: number,
  newStatus: OrderStatus
): Promise<boolean> => {
  try {
    await apiClient.put(`/Orders/${id}/status?newStatus=${newStatus}`);
    toast.success("Order status updated successfully");
    return true;
  } catch (error: unknown) {
    toast.error("Failed to update order status");
    console.error("Error in updateOrderStatus:", error);
    return false;
  }
};

/**
 * Deletes an order by its ID
 */
export const deleteOrder = async (id: number): Promise<boolean> => {
  try {
    await apiClient.delete(`/Orders/${id}`);
    toast.success("Order deleted");
    return true;
  } catch (error: unknown) {
    toast.error("Failed to delete order");
    console.error(`Error in deleteOrder(${id}):`, error);
    return false;
  }
};

/**
 * Fetches all orders placed by a specific user
 */
export const getOrdersByUserId = async (
  userId: string
): Promise<Order[]> => {
  try {
    const response = await apiClient.get(`/Orders/user/${userId}`);
    return response.data ?? [];
  } catch (error: unknown) {
    toast.error("Failed to fetch orders for user");
    console.error(`Error in getOrdersByUserId(${userId}):`, error);
    return [];
  }
};