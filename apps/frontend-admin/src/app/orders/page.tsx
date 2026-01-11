"use client";

import React, { useEffect, useState } from "react";
import {
  getPaginatedOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder,
  Order,
  OrderStatus,
} from "@/services/OrderService";

import OrderFilters from "@/components/ui/orders/OrderFilters";
import OrderTable from "@/components/ui/orders/OrderTable";
import OrderDetailsModal from "@/components/ui/orders/OrderDetailsModal";
import OrderStatusUpdateModal from "@/components/ui/orders/OrderStatusUpdateModal";
import OrderDeleteConfirmationModal from "@/components/ui/orders/OrderDeleteConfirmationModal";

interface OrderFilterState {
  status: OrderStatus | undefined;
  orderId: string;
  userId: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modals, setModals] = useState({
    details: false,
    statusUpdate: false,
    deleteConfirm: false,
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<OrderFilterState>({
    status: undefined,
    orderId: "",
    userId: "",
    sortBy: "orderDate",
    sortOrder: "desc",
  });

  // Reusable fetch function
  const fetchOrders = async () => {
    let response;

    if (filters.orderId.trim()) {
      const order = await getOrderById(Number(filters.orderId));
      response = {
        data: order ? [order] : [],
        totalItems: order ? 1 : 0,
        totalPages: 1,
        currentPage: 1,
        pageSize,
      };
    } else if (filters.userId.trim()) {
      const orders = await getOrdersByUserId(filters.userId);
      response = {
        data: orders,
        totalItems: orders.length,
        totalPages: 1,
        currentPage: 1,
        pageSize,
      };
    } else {
      response = await getPaginatedOrders(
        page,
        pageSize,
        filters.sortBy,
        filters.sortOrder,
        filters.status
      );
    }

    if (response) {
      setOrders(response.data);
      setTotalPages(response.totalPages);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, filters]);

  const handleViewDetails = async (id: number) => {
    const order = await getOrderById(id);
    if (order) {
      setSelectedOrder(order);
      setModals((prev) => ({ ...prev, details: true }));
    }
  };

  const handleStatusUpdate = async (id: number) => {
    const order = await getOrderById(id);
    if (order) {
      setSelectedOrder(order);
      setModals((prev) => ({ ...prev, statusUpdate: true }));
    }
  };

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setModals((prev) => ({ ...prev, deleteConfirm: true }));
  };

  const handleConfirmStatusUpdate = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    const success = await updateOrderStatus(selectedOrder.id, newStatus);
    if (success) {
      // Local update for instant UI feedback
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id ? { ...order, status: newStatus } : order
        )
      );
      setModals((prev) => ({ ...prev, statusUpdate: false }));
      // Optional: background refetch for consistency
      fetchOrders();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;
    const success = await deleteOrder(selectedOrder.id);
    if (success) {
      setModals((prev) => ({ ...prev, deleteConfirm: false }));
      fetchOrders();
    }
  };

  return (
    <div className="page-container px-4 sm:px-6 lg:px-8 py-6 space-y-8 fade-in">
      <header className="flex-row-between gap-4">
        <div>
          <h1 className="title">📑 Orders</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm sm:text-base">
            Track, manage, and update customer orders from here.
          </p>
        </div>
      </header>

      <section className="card">
        <OrderFilters
          filters={filters}
          onApplyFilters={(newFilters) => {
            setFilters({
              status: newFilters.status,
              orderId: newFilters.orderId?.toString() || "",
              userId: newFilters.userId?.toString() || "",
              sortBy: newFilters.sortBy || "orderDate",
              sortOrder: newFilters.sortOrder || "desc",
            });
            setPage(1);
          }}
        />
      </section>

      <section className="overflow-x-auto">
        <OrderTable
          orders={orders}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleStatusUpdate}
          onDelete={handleDeleteClick}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      </section>

      {selectedOrder && (
        <>
          <OrderDetailsModal
            isOpen={modals.details}
            onClose={() => setModals((prev) => ({ ...prev, details: false }))}
            order={selectedOrder}
          />

          <OrderStatusUpdateModal
            isOpen={modals.statusUpdate}
            onClose={() => setModals((prev) => ({ ...prev, statusUpdate: false }))}
            order={selectedOrder}
            onConfirm={handleConfirmStatusUpdate}
          />

          <OrderDeleteConfirmationModal
            isOpen={modals.deleteConfirm}
            onClose={() => setModals((prev) => ({ ...prev, deleteConfirm: false }))}
            onConfirm={handleConfirmDelete}
            order={selectedOrder}
          />
        </>
      )}
    </div>
  );
};

export default OrdersPage;