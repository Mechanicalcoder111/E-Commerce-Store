import { apiClient } from '../client';
import { InventoryLog, AddInventoryRequest } from '../types';

export const inventoryService = {
  async addInventory(data: AddInventoryRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/inventory/add', data, true);
  },

  async getHistory(productId: string): Promise<{ logs: InventoryLog[] }> {
    return apiClient.get<{ logs: InventoryLog[] }>(`/inventory/history/${productId}`, true);
  },
};
