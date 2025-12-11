import { apiClient } from '../client';
import { Order, CreateOrderRequest, OrderFilters } from '../types';

export const ordersService = {
  async create(data: CreateOrderRequest): Promise<{ order: Order }> {
    return apiClient.post<{ order: Order }>('/orders', data, false);
  },

  async getAll(filters?: OrderFilters): Promise<{ orders: Order[] }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return apiClient.get<{ orders: Order[] }>(`/orders${query ? `?${query}` : ''}`, true);
  },

  async getPackingList(orderId: string): Promise<{ order: Order }> {
    return apiClient.get<{ order: Order }>(`/orders/packing-list/${orderId}`, true);
  },

  async markAsShipped(orderId: string): Promise<{ order: Order }> {
    return apiClient.post<{ order: Order }>(`/orders/${orderId}/ship`, {}, true);
  },

  async cancel(orderId: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/orders/${orderId}/cancel`, {}, true);
  },
};
