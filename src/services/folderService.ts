import { apiClient } from './apiClient';
import { demoStore } from './demoStore';
import { FolderItem } from '../types';

export class FolderService {
  async getFolders(): Promise<FolderItem[]> {
    try {
      return await apiClient.get<FolderItem[]>('/folders');
    } catch {
      return demoStore.getFolders();
    }
  }

  async createFolder(name: string, parentId: string | null = null, color?: string): Promise<FolderItem> {
    try {
      return await apiClient.post<FolderItem>('/folders', { name, parentId, color });
    } catch {
      return demoStore.createFolder(name, parentId, color);
    }
  }

  async deleteFolder(folderId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/folders/${folderId}`);
      return true;
    } catch {
      return demoStore.deleteFolder(folderId);
    }
  }
}

export const folderService = new FolderService();
