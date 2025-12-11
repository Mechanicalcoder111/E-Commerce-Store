import { apiClient } from '../client';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials, false);
    apiClient.setToken(response.token);
    return response;
  },

  async register(userData: RegisterRequest): Promise<{ user: User }> {
    return apiClient.post<{ user: User }>('/auth/register', userData, true);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {}, true);
    } finally {
      apiClient.clearToken();
    }
  },

  async getCurrentUser(): Promise<{ user: User }> {
    return apiClient.get<{ user: User }>('/auth/me', true);
  },

  async checkHealth(): Promise<{ status: string }> {
    return apiClient.get<{ status: string }>('/health', false);
  },
};
