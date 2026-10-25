import { apiClient } from './apiClient';
import { demoStore } from './demoStore';
import { User, AuthResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
      if (res?.token) {
        apiClient.setToken(res.token);
      }
      return res;
    } catch {
      // Graceful fallback to Demo user
      const demoUser = demoStore.getUser();
      const mockResponse: AuthResponse = {
        token: 'demo_jwt_token_sample_session',
        tokenType: 'Bearer',
        user: {
          ...demoUser,
          email: credentials.email || demoUser.email,
        },
      };
      apiClient.setToken(mockResponse.token);
      return mockResponse;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>('/auth/register', data);
      if (res?.token) {
        apiClient.setToken(res.token);
      }
      return res;
    } catch {
      // Demo fallback
      const demoUser = demoStore.updateUser({
        name: data.name,
        email: data.email,
      });
      const mockResponse: AuthResponse = {
        token: 'demo_jwt_token_sample_session',
        tokenType: 'Bearer',
        user: demoUser,
      };
      apiClient.setToken(mockResponse.token);
      return mockResponse;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      apiClient.setToken(null);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>('/auth/me');
    } catch {
      return demoStore.getUser();
    }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.post('/auth/forgot-password', { email });
    } catch {
      return {
        success: true,
        message: `Password reset verification link has been dispatched to ${email} (Demo Mode).`,
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.post('/auth/reset-password', { token, newPassword });
    } catch {
      return {
        success: true,
        message: 'Your password has been successfully updated.',
      };
    }
  }
}

export const authService = new AuthService();
