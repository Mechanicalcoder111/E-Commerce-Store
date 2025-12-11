import { apiClient } from '../client';
import { ShippingBracket, CreateShippingBracketRequest } from '../types';

export const shippingService = {
  async getAll(): Promise<{ brackets: ShippingBracket[] }> {
    return apiClient.get<{ brackets: ShippingBracket[] }>('/shipping', false);
  },

  async create(data: CreateShippingBracketRequest): Promise<{ bracket: ShippingBracket }> {
    return apiClient.post<{ bracket: ShippingBracket }>('/shipping', data, true);
  },

  async update(id: string, data: CreateShippingBracketRequest): Promise<{ bracket: ShippingBracket }> {
    return apiClient.put<{ bracket: ShippingBracket }>(`/shipping/${id}`, data, true);
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/shipping/${id}`, true);
  },
};
