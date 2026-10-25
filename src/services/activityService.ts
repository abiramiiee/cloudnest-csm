import { apiClient } from './apiClient';
import { demoStore } from './demoStore';
import { FileActivity } from '../types';

export class ActivityService {
  async getActivities(limit = 20): Promise<FileActivity[]> {
    try {
      return await apiClient.get<FileActivity[]>('/activity', { params: { limit } });
    } catch {
      return demoStore.getActivities(limit);
    }
  }
}

export const activityService = new ActivityService();
