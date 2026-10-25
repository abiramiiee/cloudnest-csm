import { apiClient } from './apiClient';
import { demoStore } from './demoStore';
import { FileItem } from '../types';

export class VaultService {
  async verifyVaultAccess(passcode: string): Promise<boolean> {
    try {
      const res = await apiClient.post<{ verified: boolean }>('/vault/verify', { passcode });
      return res.verified;
    } catch {
      // Demo PIN is '1234'
      return demoStore.verifyVaultPin(passcode);
    }
  }

  async getVaultFiles(): Promise<FileItem[]> {
    try {
      return await apiClient.get<FileItem[]>('/vault/files');
    } catch {
      return demoStore.getVaultFiles();
    }
  }

  async uploadVaultFile(file: File): Promise<FileItem> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isVault', 'true');
      return await apiClient.post<FileItem>('/vault/files', formData);
    } catch {
      return demoStore.addFile(file.name, file.size, file.type, null, true);
    }
  }

  async deleteVaultFile(fileId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/vault/files/${fileId}`);
      return true;
    } catch {
      return demoStore.permanentlyDelete(fileId);
    }
  }
}

export const vaultService = new VaultService();
