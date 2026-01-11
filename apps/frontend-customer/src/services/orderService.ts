// src/services/orderService.ts
import apiClient from "./apiClient";

// Represents a single item within an order
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  orderId: number;
}

// Represents a complete order placed by a user
export interface Order {
  id: number;
  orderDate: string;
  customerName: string;
  email: string;
  mobileNumber: string;
  address: string;
  totalAmount: number;
  status: "Pending" | "Completed";
  userId: string;
  items: OrderItem[];
}

// Fetches orders placed by the currently authenticated user
export const fetchMyOrders = async (): Promise<Order[]> => {
  const res = await apiClient.get<Order[]>("/Orders/my");
  return res.data;
};

// Places a new order with customer and item details
export const placeOrder = async (payload: {
  customerName: string;
  email: string;
  mobileNumber: string;
  address: string;
  totalAmount: number;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}) => {
  const res = await apiClient.post("/Orders", payload);
  return res.data;
};

// Cancels an existing order by ID
export const cancelMyOrder = async (orderId: number) => {
  const res = await apiClient.delete(`/Orders/${orderId}`);
  return res.data;
};