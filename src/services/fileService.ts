import { apiClient } from './apiClient';
import { demoStore } from './demoStore';
import { FileItem } from '../types';

export class FileService {
  async getFiles(params?: { folderId?: string | null; category?: string; starred?: boolean; search?: string }): Promise<FileItem[]> {
    try {
      const queryParams: Record<string, string | number | boolean> = {};
      if (params?.folderId !== undefined) queryParams.folderId = params.folderId || '';
      if (params?.category && params.category !== 'all') queryParams.category = params.category;
      if (params?.starred !== undefined) queryParams.starred = params.starred;
      if (params?.search) queryParams.search = params.search;

      return await apiClient.get<FileItem[]>('/files', { params: queryParams });
    } catch {
      return demoStore.getFiles(params);
    }
  }

  async getRecentFiles(): Promise<FileItem[]> {
    try {
      return await apiClient.get<FileItem[]>('/files/recent');
    } catch {
      return demoStore.getRecentFiles();
    }
  }

  async getStarredFiles(): Promise<FileItem[]> {
    try {
      return await apiClient.get<FileItem[]>('/files', { params: { starred: true } });
    } catch {
      return demoStore.getStarredFiles();
    }
  }

  async uploadFile(file: File, folderId: string | null = null, onProgress?: (percentage: number) => void): Promise<FileItem> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folderId) formData.append('folderId', folderId);

      // Simulate step progress for user feedback
      onProgress?.(25);
      const res = await apiClient.post<FileItem>('/files/upload', formData);
      onProgress?.(100);
      return res;
    } catch {
      // Demo simulated upload with progress
      onProgress?.(45);
      await new Promise(r => setTimeout(r, 350));
      onProgress?.(85);
      await new Promise(r => setTimeout(r, 200));
      onProgress?.(100);

      return demoStore.addFile(file.name, file.size, file.type, folderId, false);
    }
  }

  async renameFile(id: string, newName: string): Promise<FileItem> {
    try {
      return await apiClient.put<FileItem>(`/files/${id}`, { name: newName });
    } catch {
      const updated = demoStore.renameFile(id, newName);
      if (!updated) throw new Error('File not found');
      return updated;
    }
  }

  async moveFile(id: string, targetFolderId: string | null): Promise<FileItem> {
    try {
      return await apiClient.patch<FileItem>(`/files/${id}/move`, { folderId: targetFolderId });
    } catch {
      const moved = demoStore.moveFile(id, targetFolderId);
      if (!moved) throw new Error('File not found');
      return moved;
    }
  }

  async toggleStar(id: string): Promise<FileItem> {
    try {
      return await apiClient.patch<FileItem>(`/files/${id}/star`);
    } catch {
      const starred = demoStore.toggleStar(id);
      if (!starred) throw new Error('File not found');
      return starred;
    }
  }

  async moveToTrash(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/files/${id}`);
      return true;
    } catch {
      return demoStore.moveToTrash(id);
    }
  }

  async downloadFile(file: FileItem): Promise<void> {
    try {
      // In production Spring Boot, fetch binary stream
      if (apiClient.getIsBackendOnline()) {
        const blob = await fetch(`${apiClient['token'] ? '' : ''}/api/files/${file.id}/download`).then(r => r.blob());
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }
    } catch {
      // Fallback
    }

    // Demo client-side simulated download
    const dummyBlob = new Blob([`[CloudNest Demo File]\nName: ${file.name}\nSize: ${file.sizeBytes} bytes\nCategory: ${file.category}\nSimulated payload for College CSM Project evaluation.`], { type: file.mimeType || 'text/plain' });
    const url = URL.createObjectURL(dummyBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const fileService = new FileService();
