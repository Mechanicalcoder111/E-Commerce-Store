import { apiClient } from '../client';
import { User } from '../types';

export const usersService = {
  async getAll(): Promise<{ users: User[] }> {
    return apiClient.get<{ users: User[] }>('/users', true);
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/users/${id}`, true);
  },
};
