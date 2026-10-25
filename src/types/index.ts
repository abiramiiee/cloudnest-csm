/**
 * Core domain types for CloudNest File Storage & Sharing System
 * Engineered to match Java Spring Boot backend entities:
 * User, FileMetadata, Folder, ShareLink, SharedFilePermission, FileActivity, UserStorageUsage, VaultFile, TrashItem
 */

export type FileCategory = 'documents' | 'images' | 'videos' | 'audio' | 'archives' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  storageQuotaBytes: number;
  storageUsedBytes: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface FileItem {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  extension: string;
  category: FileCategory;
  folderId: string | null;
  ownerId: string;
  starred: boolean;
  isInTrash: boolean;
  isVault: boolean;
  uploadedAt: string;
  updatedAt: string;
  downloadUrl?: string;
  contentPreview?: string;
  tags?: string[];
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  ownerId: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  fileCount?: number;
  totalSizeBytes?: number;
}

export type SharePermission = 'VIEW_ONLY' | 'VIEW_AND_DOWNLOAD';

export interface ShareLink {
  id: string;
  token: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  category: FileCategory;
  createdByUserId: string;
  permission: SharePermission;
  hasPassword: boolean;
  isExpired: boolean;
  isRevoked: boolean;
  expiresAt: string;
  createdAt: string;
  accessCount: number;
}

export interface SharedWithMeItem {
  id: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  category: FileCategory;
  sharedByUserName: string;
  sharedByUserEmail: string;
  permission: SharePermission;
  sharedAt: string;
  expiresAt: string;
  downloadUrl?: string;
}

export interface FileActivity {
  id: string;
  action: 'UPLOAD' | 'DOWNLOAD' | 'RENAME' | 'MOVE' | 'STAR' | 'TRASH' | 'RESTORE' | 'PERMANENT_DELETE' | 'SHARE_CREATE' | 'SHARE_REVOKE' | 'VAULT_ACCESS';
  fileId: string;
  fileName: string;
  timestamp: string;
  details?: string;
  userEmail?: string;
}

export interface StorageInsights {
  totalUsedBytes: number;
  quotaBytes: number;
  usagePercentage: number;
  fileCount: number;
  folderCount: number;
  categoryBreakdown: {
    category: FileCategory;
    name: string;
    bytes: number;
    count: number;
    color: string;
  }[];
  monthlyUploadActivity: {
    month: string;
    uploadCount: number;
    sizeMB: number;
  }[];
  largestFiles: FileItem[];
  recentUploads: FileItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}
