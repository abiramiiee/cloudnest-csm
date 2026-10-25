import { apiClient } from './apiClient';
import { demoStore } from './demoStore';
import { ShareLink, SharedWithMeItem, SharePermission } from '../types';

export interface CreateShareParams {
  fileId: string;
  permission: SharePermission;
  expiryHours: number;
  password?: string;
}

export class SharingService {
  async getCreatedShares(): Promise<ShareLink[]> {
    try {
      return await apiClient.get<ShareLink[]>('/shares/created-by-me');
    } catch {
      return demoStore.getShares();
    }
  }

  async getSharedWithMe(): Promise<SharedWithMeItem[]> {
    try {
      return await apiClient.get<SharedWithMeItem[]>('/shares/shared-with-me');
    } catch {
      return demoStore.getSharedWithMe();
    }
  }

  async createShare(params: CreateShareParams): Promise<ShareLink> {
    try {
      return await apiClient.post<ShareLink>('/shares', params);
    } catch {
      return demoStore.createShareLink(
        params.fileId,
        params.permission,
        params.expiryHours,
        !!params.password
      );
    }
  }

  async revokeShare(shareId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/shares/${shareId}`);
      return true;
    } catch {
      return demoStore.revokeShareLink(shareId);
    }
  }

  async getPublicShare(token: string, password?: string): Promise<ShareLink | null> {
    try {
      return await apiClient.get<ShareLink>(`/public/shares/${token}`, {
        params: password ? { password } : undefined,
      });
    } catch {
      return demoStore.getShareByToken(token);
    }
  }
}

export const sharingService = new SharingService();
