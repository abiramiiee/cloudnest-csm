import { apiClient } from './apiClient';
import { demoStore } from './demoStore';
import { StorageInsights } from '../types';

export class InsightsService {
  async getStorageInsights(): Promise<StorageInsights> {
    try {
      return await apiClient.get<StorageInsights>('/storage/insights');
    } catch {
      return demoStore.getStorageInsights();
    }
  }
}

export const insightsService = new InsightsService();
