import { apiClient } from './apiClient';
import { demoStore } from './demoStore';
import { FileItem } from '../types';

export class TrashService {
  async getTrashItems(): Promise<FileItem[]> {
    try {
      return await apiClient.get<FileItem[]>('/trash');
    } catch {
      return demoStore.getTrashFiles();
    }
  }

  async restoreItem(id: string): Promise<boolean> {
    try {
      await apiClient.post(`/trash/${id}/restore`);
      return true;
    } catch {
      return demoStore.restoreFromTrash(id);
    }
  }

  async permanentlyDeleteItem(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/trash/${id}`);
      return true;
    } catch {
      return demoStore.permanentlyDelete(id);
    }
  }

  async emptyTrash(): Promise<number> {
    try {
      const res = await apiClient.delete<{ count: number }>('/trash');
      return res.count || 0;
    } catch {
      return demoStore.emptyTrash();
    }
  }
}

export const trashService = new TrashService();
