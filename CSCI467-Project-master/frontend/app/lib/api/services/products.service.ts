import { apiClient } from '../client';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types';

export const productsService = {
  async getAll(): Promise<{ products: Product[] }> {
    return apiClient.get<{ products: Product[] }>('/products', false);
  },

  async getById(id: string): Promise<{ product: Product }> {
    return apiClient.get<{ product: Product }>(`/products/${id}`, false);
  },

  async create(data: CreateProductRequest): Promise<{ product: Product }> {
    return apiClient.post<{ product: Product }>('/products', data, true);
  },

  async update(id: string, data: UpdateProductRequest): Promise<{ product: Product }> {
    return apiClient.put<{ product: Product }>(`/products/${id}`, data, true);
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/products/${id}`, true);
  },
};
