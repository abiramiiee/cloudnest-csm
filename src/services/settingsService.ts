import { apiClient } from './apiClient';
import { demoStore } from './demoStore';
import { User } from '../types';

export interface UserSettings {
  name: string;
  email: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  autoExpireDays: number;
}

export class SettingsService {
  async getSettings(): Promise<UserSettings> {
    try {
      return await apiClient.get<UserSettings>('/settings');
    } catch {
      const user = demoStore.getUser();
      return {
        name: user.name,
        email: user.email,
        theme: (localStorage.getItem('cloudnest_theme') as any) || 'light',
        emailNotifications: true,
        autoExpireDays: 7,
      };
    }
  }

  async updateProfile(name: string, email: string): Promise<User> {
    try {
      return await apiClient.put<User>('/settings/profile', { name, email });
    } catch {
      return demoStore.updateUser({ name, email });
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.put('/settings/password', { currentPassword, newPassword });
    } catch {
      return { success: true, message: 'Password updated successfully (Demo Mode).' };
    }
  }
}

export const settingsService = new SettingsService();
