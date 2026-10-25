import { FileItem, FolderItem, ShareLink, SharedWithMeItem, FileActivity, User, StorageInsights } from '../types';
import { categorizeFile } from '../utils/fileCategorizer';

const DEMO_USER: User = {
  id: 'usr_csm_2026_01',
  name: 'Alex Chen',
  email: 'alex.chen@cloudnest.internal',
  avatarUrl: '/src/assets/images/avatar_user_profile_1792835182672.jpg',
  role: 'USER',
  storageQuotaBytes: 15 * 1024 * 1024 * 1024, // 15 GB
  storageUsedBytes: 3.42 * 1024 * 1024 * 1024, // 3.42 GB
  createdAt: '2026-09-15T08:00:00Z',
};

const INITIAL_FOLDERS: FolderItem[] = [
  {
    id: 'fld_csm_docs',
    name: 'CSM Project Deliverables',
    parentId: null,
    ownerId: DEMO_USER.id,
    color: '#8b5cf6',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-20T14:30:00Z',
    fileCount: 3,
    totalSizeBytes: 14500000,
  },
  {
    id: 'fld_architecture',
    name: 'Cloud Architecture & UML',
    parentId: null,
    ownerId: DEMO_USER.id,
    color: '#3b82f6',
    createdAt: '2026-10-05T11:20:00Z',
    updatedAt: '2026-10-22T09:15:00Z',
    fileCount: 2,
    totalSizeBytes: 8900000,
  },
  {
    id: 'fld_security',
    name: 'Security Audits & Policies',
    parentId: null,
    ownerId: DEMO_USER.id,
    color: '#10b981',
    createdAt: '2026-10-08T15:45:00Z',
    updatedAt: '2026-10-23T11:00:00Z',
    fileCount: 2,
    totalSizeBytes: 4200000,
  },
];

const INITIAL_FILES: FileItem[] = [
  {
    id: 'fil_01',
    name: 'Cloud_Storage_Management_Report.pdf',
    sizeBytes: 4250000,
    mimeType: 'application/pdf',
    extension: 'pdf',
    category: 'documents',
    folderId: 'fld_csm_docs',
    ownerId: DEMO_USER.id,
    starred: true,
    isInTrash: false,
    isVault: false,
    uploadedAt: '2026-10-23T16:20:00Z',
    updatedAt: '2026-10-23T16:20:00Z',
    tags: ['CSM', 'Final Report', 'College'],
  },
  {
    id: 'fil_02',
    name: 'CloudNest_Spring_Boot_Architecture.png',
    sizeBytes: 2840000,
    mimeType: 'image/png',
    extension: 'png',
    category: 'images',
    folderId: 'fld_architecture',
    ownerId: DEMO_USER.id,
    starred: true,
    isInTrash: false,
    isVault: false,
    uploadedAt: '2026-10-22T09:10:00Z',
    updatedAt: '2026-10-22T09:10:00Z',
    contentPreview: '/src/assets/images/cloudnest_hero_illustration_1792835181067.jpg',
    tags: ['Architecture', 'Diagram'],
  },
  {
    id: 'fil_03',
    name: 'MySQL_Schema_Migration_v2.sql',
    sizeBytes: 154000,
    mimeType: 'text/plain',
    extension: 'sql',
    category: 'documents',
    folderId: 'fld_architecture',
    ownerId: DEMO_USER.id,
    starred: false,
    isInTrash: false,
    isVault: false,
    uploadedAt: '2026-10-21T18:40:00Z',
    updatedAt: '2026-10-21T18:40:00Z',
    tags: ['Database', 'DDL'],
  },
  {
    id: 'fil_04',
    name: 'S3_Bucket_Encryption_Compliance.docx',
    sizeBytes: 1980000,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: 'docx',
    category: 'documents',
    folderId: 'fld_security',
    ownerId: DEMO_USER.id,
    starred: false,
    isInTrash: false,
    isVault: false,
    uploadedAt: '2026-10-20T11:05:00Z',
    updatedAt: '2026-10-20T11:05:00Z',
    tags: ['Security', 'AWS S3'],
  },
  {
    id: 'fil_05',
    name: 'System_Benchmark_Presentation.pptx',
    sizeBytes: 8250000,
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    extension: 'pptx',
    category: 'documents',
    folderId: 'fld_csm_docs',
    ownerId: DEMO_USER.id,
    starred: true,
    isInTrash: false,
    isVault: false,
    uploadedAt: '2026-10-19T14:15:00Z',
    updatedAt: '2026-10-19T14:15:00Z',
    tags: ['Slides', 'Defense'],
  },
  {
    id: 'fil_06',
    name: 'Service_Demo_Walkthrough.mp4',
    sizeBytes: 85400000,
    mimeType: 'video/mp4',
    extension: 'mp4',
    category: 'videos',
    folderId: null,
    ownerId: DEMO_USER.id,
    starred: false,
    isInTrash: false,
    isVault: false,
    uploadedAt: '2026-10-18T17:30:00Z',
    updatedAt: '2026-10-18T17:30:00Z',
    tags: ['Demo', 'Video'],
  },
  {
    id: 'fil_07',
    name: 'Deployment_Artifacts_v1.zip',
    sizeBytes: 42100000,
    mimeType: 'application/zip',
    extension: 'zip',
    category: 'archives',
    folderId: null,
    ownerId: DEMO_USER.id,
    starred: false,
    isInTrash: false,
    isVault: false,
    uploadedAt: '2026-10-17T12:00:00Z',
    updatedAt: '2026-10-17T12:00:00Z',
    tags: ['Build', 'Archive'],
  },
  // Vault files (isolated, not returned in standard file listing)
  {
    id: 'vlt_01',
    name: 'Cloud_Credentials_Recovery_Keys.enc',
    sizeBytes: 84000,
    mimeType: 'application/octet-stream',
    extension: 'enc',
    category: 'other',
    folderId: null,
    ownerId: DEMO_USER.id,
    starred: false,
    isInTrash: false,
    isVault: true,
    uploadedAt: '2026-10-10T09:00:00Z',
    updatedAt: '2026-10-10T09:00:00Z',
    tags: ['Confidential', 'Vault'],
  },
  {
    id: 'vlt_02',
    name: 'JWT_RSA_Private_Key.pem',
    sizeBytes: 4096,
    mimeType: 'text/plain',
    extension: 'pem',
    category: 'documents',
    folderId: null,
    ownerId: DEMO_USER.id,
    starred: false,
    isInTrash: false,
    isVault: true,
    uploadedAt: '2026-10-12T14:00:00Z',
    updatedAt: '2026-10-12T14:00:00Z',
    tags: ['Keys', 'Vault'],
  },
  // Trash files
  {
    id: 'trsh_01',
    name: 'Old_Draft_Sprint_Notes.txt',
    sizeBytes: 32000,
    mimeType: 'text/plain',
    extension: 'txt',
    category: 'documents',
    folderId: null,
    ownerId: DEMO_USER.id,
    starred: false,
    isInTrash: true,
    isVault: false,
    uploadedAt: '2026-10-02T10:00:00Z',
    updatedAt: '2026-10-21T08:15:00Z',
    tags: ['Draft'],
  },
];

const INITIAL_SHARES: ShareLink[] = [
  {
    id: 'sh_01',
    token: 'nest_tk_883fa920',
    fileId: 'fil_01',
    fileName: 'Cloud_Storage_Management_Report.pdf',
    fileSize: 4250000,
    category: 'documents',
    createdByUserId: DEMO_USER.id,
    permission: 'VIEW_AND_DOWNLOAD',
    hasPassword: false,
    isExpired: false,
    isRevoked: false,
    expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: '2026-10-23T16:25:00Z',
    accessCount: 14,
  },
  {
    id: 'sh_02',
    token: 'nest_tk_42a8b911',
    fileId: 'fil_02',
    fileName: 'CloudNest_Spring_Boot_Architecture.png',
    fileSize: 2840000,
    category: 'images',
    createdByUserId: DEMO_USER.id,
    permission: 'VIEW_ONLY',
    hasPassword: true,
    isExpired: false,
    isRevoked: false,
    expiresAt: new Date(Date.now() + 86400000 * 1).toISOString(),
    createdAt: '2026-10-22T10:00:00Z',
    accessCount: 6,
  },
];

const INITIAL_SHARED_WITH_ME: SharedWithMeItem[] = [
  {
    id: 'swm_01',
    fileId: 'fil_ext_01',
    fileName: 'College_CSM_Grading_Rubric_2026.pdf',
    fileSize: 1850000,
    category: 'documents',
    sharedByUserName: 'Prof. David Vance',
    sharedByUserEmail: 'd.vance@university.edu',
    permission: 'VIEW_AND_DOWNLOAD',
    sharedAt: '2026-10-15T09:30:00Z',
    expiresAt: '2026-11-15T23:59:59Z',
  },
  {
    id: 'swm_02',
    fileId: 'fil_ext_02',
    fileName: 'Distributed_Systems_Case_Study.pdf',
    fileSize: 3120000,
    category: 'documents',
    sharedByUserName: 'Sarah Connor (TA)',
    sharedByUserEmail: 'sconnor@university.edu',
    permission: 'VIEW_ONLY',
    sharedAt: '2026-10-18T13:20:00Z',
    expiresAt: '2026-10-31T23:59:59Z',
  },
];

const INITIAL_ACTIVITIES: FileActivity[] = [
  {
    id: 'act_01',
    action: 'SHARE_CREATE',
    fileId: 'fil_01',
    fileName: 'Cloud_Storage_Management_Report.pdf',
    timestamp: '2026-10-23T16:25:00Z',
    details: 'Created share link expiring in 7 days (View & Download)',
  },
  {
    id: 'act_02',
    action: 'UPLOAD',
    fileId: 'fil_01',
    fileName: 'Cloud_Storage_Management_Report.pdf',
    timestamp: '2026-10-23T16:20:00Z',
    details: 'Uploaded 4.1 MB document to CSM Project Deliverables',
  },
  {
    id: 'act_03',
    action: 'STAR',
    fileId: 'fil_02',
    fileName: 'CloudNest_Spring_Boot_Architecture.png',
    timestamp: '2026-10-22T10:15:00Z',
    details: 'Marked as starred',
  },
  {
    id: 'act_04',
    action: 'UPLOAD',
    fileId: 'fil_02',
    fileName: 'CloudNest_Spring_Boot_Architecture.png',
    timestamp: '2026-10-22T09:10:00Z',
    details: 'Uploaded 2.7 MB image to Cloud Architecture & UML',
  },
  {
    id: 'act_05',
    action: 'TRASH',
    fileId: 'trsh_01',
    fileName: 'Old_Draft_Sprint_Notes.txt',
    timestamp: '2026-10-21T08:15:00Z',
    details: 'Moved to Trash',
  },
];

class DemoStore {
  private user: User = DEMO_USER;
  private folders: FolderItem[] = INITIAL_FOLDERS;
  private files: FileItem[] = INITIAL_FILES;
  private shares: ShareLink[] = INITIAL_SHARES;
  private sharedWithMe: SharedWithMeItem[] = INITIAL_SHARED_WITH_ME;
  private activities: FileActivity[] = INITIAL_ACTIVITIES;
  private vaultPin: string = '1234';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedFolders = localStorage.getItem('cn_demo_folders');
      const storedFiles = localStorage.getItem('cn_demo_files');
      const storedShares = localStorage.getItem('cn_demo_shares');
      const storedActivities = localStorage.getItem('cn_demo_activities');
      const storedUser = localStorage.getItem('cn_demo_user');

      if (storedFolders) this.folders = JSON.parse(storedFolders);
      if (storedFiles) this.files = JSON.parse(storedFiles);
      if (storedShares) this.shares = JSON.parse(storedShares);
      if (storedActivities) this.activities = JSON.parse(storedActivities);
      if (storedUser) this.user = JSON.parse(storedUser);
    } catch {
      // ignore storage failure
    }
  }

  private persist() {
    try {
      localStorage.setItem('cn_demo_folders', JSON.stringify(this.folders));
      localStorage.setItem('cn_demo_files', JSON.stringify(this.files));
      localStorage.setItem('cn_demo_shares', JSON.stringify(this.shares));
      localStorage.setItem('cn_demo_activities', JSON.stringify(this.activities));
      localStorage.setItem('cn_demo_user', JSON.stringify(this.user));
    } catch {
      // ignore
    }
  }

  getUser(): User {
    return { ...this.user };
  }

  updateUser(updates: Partial<User>): User {
    this.user = { ...this.user, ...updates };
    this.persist();
    return this.getUser();
  }

  getFolders(): FolderItem[] {
    return [...this.folders];
  }

  createFolder(name: string, parentId: string | null = null, color = '#8b5cf6'): FolderItem {
    const newFolder: FolderItem = {
      id: `fld_${Date.now()}`,
      name,
      parentId,
      ownerId: this.user.id,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileCount: 0,
      totalSizeBytes: 0,
    };
    this.folders.unshift(newFolder);
    this.logActivity('UPLOAD', newFolder.id, `${name} (Folder)`, `Created new folder "${name}"`);
    this.persist();
    return newFolder;
  }

  deleteFolder(folderId: string): boolean {
    this.folders = this.folders.filter(f => f.id !== folderId);
    // Unassign files in this folder
    this.files = this.files.map(f => f.folderId === folderId ? { ...f, folderId: null } : f);
    this.persist();
    return true;
  }

  getFiles(options?: { folderId?: string | null; category?: string; starred?: boolean; search?: string }): FileItem[] {
    let result = this.files.filter(f => !f.isInTrash && !f.isVault);

    if (options?.folderId !== undefined) {
      result = result.filter(f => f.folderId === options.folderId);
    }
    if (options?.category && options.category !== 'all') {
      result = result.filter(f => f.category === options.category);
    }
    if (options?.starred !== undefined) {
      result = result.filter(f => f.starred === options.starred);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(f => f.name.toLowerCase().includes(q) || f.tags?.some(t => t.toLowerCase().includes(q)));
    }

    return result;
  }

  getRecentFiles(limit: number = 8): FileItem[] {
    return this.getFiles().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, limit);
  }

  getStarredFiles(): FileItem[] {
    return this.getFiles({ starred: true });
  }

  getTrashFiles(): FileItem[] {
    return this.files.filter(f => f.isInTrash);
  }

  getVaultFiles(): FileItem[] {
    return this.files.filter(f => f.isVault && !f.isInTrash);
  }

  verifyVaultPin(pin: string): boolean {
    return pin === this.vaultPin;
  }

  addFile(name: string, sizeBytes: number, mimeType: string, folderId: string | null = null, isVault: boolean = false): FileItem {
    const extension = name.split('.').pop() || '';
    const category = categorizeFile(name, mimeType);
    const newFile: FileItem = {
      id: `${isVault ? 'vlt' : 'fil'}_${Date.now()}`,
      name,
      sizeBytes,
      mimeType,
      extension,
      category,
      folderId,
      ownerId: this.user.id,
      starred: false,
      isInTrash: false,
      isVault,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [category.toUpperCase()],
    };

    this.files.unshift(newFile);
    this.user.storageUsedBytes += sizeBytes;

    this.logActivity(
      'UPLOAD',
      newFile.id,
      newFile.name,
      isVault ? 'Uploaded sensitive file to Personal Secure Vault' : `Uploaded ${newFile.name} (${Math.round(sizeBytes / 1024)} KB)`
    );

    this.persist();
    return newFile;
  }

  toggleStar(fileId: string): FileItem | null {
    const f = this.files.find(item => item.id === fileId);
    if (!f) return null;
    f.starred = !f.starred;
    f.updatedAt = new Date().toISOString();
    this.logActivity('STAR', f.id, f.name, f.starred ? 'Starred file' : 'Unstarred file');
    this.persist();
    return f;
  }

  renameFile(fileId: string, newName: string): FileItem | null {
    const f = this.files.find(item => item.id === fileId);
    if (!f) return null;
    const oldName = f.name;
    f.name = newName;
    f.extension = newName.split('.').pop() || f.extension;
    f.category = categorizeFile(newName, f.mimeType);
    f.updatedAt = new Date().toISOString();
    this.logActivity('RENAME', f.id, newName, `Renamed from "${oldName}"`);
    this.persist();
    return f;
  }

  moveFile(fileId: string, targetFolderId: string | null): FileItem | null {
    const f = this.files.find(item => item.id === fileId);
    if (!f) return null;
    f.folderId = targetFolderId;
    f.updatedAt = new Date().toISOString();
    const folderName = targetFolderId ? this.folders.find(fl => fl.id === targetFolderId)?.name || 'Folder' : 'Root Directory';
    this.logActivity('MOVE', f.id, f.name, `Moved file to ${folderName}`);
    this.persist();
    return f;
  }

  moveToTrash(fileId: string): boolean {
    const f = this.files.find(item => item.id === fileId);
    if (!f) return false;
    f.isInTrash = true;
    f.updatedAt = new Date().toISOString();
    this.logActivity('TRASH', f.id, f.name, 'Moved file to Trash');
    this.persist();
    return true;
  }

  restoreFromTrash(fileId: string): boolean {
    const f = this.files.find(item => item.id === fileId);
    if (!f) return false;
    f.isInTrash = false;
    f.updatedAt = new Date().toISOString();
    this.logActivity('RESTORE', f.id, f.name, 'Restored file from Trash');
    this.persist();
    return true;
  }

  permanentlyDelete(fileId: string): boolean {
    const f = this.files.find(item => item.id === fileId);
    if (!f) return false;
    this.files = this.files.filter(item => item.id !== fileId);
    this.user.storageUsedBytes = Math.max(0, this.user.storageUsedBytes - f.sizeBytes);
    this.logActivity('PERMANENT_DELETE', fileId, f.name, 'Permanently erased file and purged storage block');
    this.persist();
    return true;
  }

  emptyTrash(): number {
    const trashFiles = this.files.filter(f => f.isInTrash);
    const count = trashFiles.length;
    let reclaimedBytes = 0;
    trashFiles.forEach(f => { reclaimedBytes += f.sizeBytes; });

    this.files = this.files.filter(f => !f.isInTrash);
    this.user.storageUsedBytes = Math.max(0, this.user.storageUsedBytes - reclaimedBytes);
    this.logActivity('PERMANENT_DELETE', 'batch', 'Empty Trash', `Purged ${count} items permanently`);
    this.persist();
    return count;
  }

  getShares(): ShareLink[] {
    return [...this.shares];
  }

  getSharedWithMe(): SharedWithMeItem[] {
    return [...this.sharedWithMe];
  }

  createShareLink(fileId: string, permission: 'VIEW_ONLY' | 'VIEW_AND_DOWNLOAD', expiryHours: number, hasPassword = false): ShareLink {
    const f = this.files.find(item => item.id === fileId);
    if (!f) throw new Error('File not found');

    const token = `nest_tk_${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

    const newShare: ShareLink = {
      id: `sh_${Date.now()}`,
      token,
      fileId: f.id,
      fileName: f.name,
      fileSize: f.sizeBytes,
      category: f.category,
      createdByUserId: this.user.id,
      permission,
      hasPassword,
      isExpired: false,
      isRevoked: false,
      expiresAt,
      createdAt: new Date().toISOString(),
      accessCount: 0,
    };

    this.shares.unshift(newShare);
    this.logActivity('SHARE_CREATE', f.id, f.name, `Created ${permission} share link expiring in ${expiryHours}h`);
    this.persist();
    return newShare;
  }

  revokeShareLink(shareId: string): boolean {
    const sh = this.shares.find(s => s.id === shareId);
    if (!sh) return false;
    sh.isRevoked = true;
    this.logActivity('SHARE_REVOKE', sh.fileId, sh.fileName, 'Revoked public access token');
    this.persist();
    return true;
  }

  getShareByToken(token: string): ShareLink | null {
    const sh = this.shares.find(s => s.token === token);
    if (!sh) return null;
    const isPast = new Date(sh.expiresAt).getTime() < Date.now();
    return {
      ...sh,
      isExpired: sh.isExpired || isPast,
    };
  }

  getActivities(limit = 20): FileActivity[] {
    return this.activities.slice(0, limit);
  }

  private logActivity(action: FileActivity['action'], fileId: string, fileName: string, details?: string) {
    const act: FileActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action,
      fileId,
      fileName,
      timestamp: new Date().toISOString(),
      details,
      userEmail: this.user.email,
    };
    this.activities.unshift(act);
    if (this.activities.length > 100) this.activities.pop();
  }

  getStorageInsights(): StorageInsights {
    const activeFiles = this.files.filter(f => !f.isInTrash);
    let docsSize = 0, docsCount = 0;
    let imgsSize = 0, imgsCount = 0;
    let vidsSize = 0, vidsCount = 0;
    let audioSize = 0, audioCount = 0;
    let arcSize = 0, arcCount = 0;
    let othSize = 0, othCount = 0;

    activeFiles.forEach(f => {
      switch (f.category) {
        case 'documents': docsSize += f.sizeBytes; docsCount++; break;
        case 'images': imgsSize += f.sizeBytes; imgsCount++; break;
        case 'videos': vidsSize += f.sizeBytes; vidsCount++; break;
        case 'audio': audioSize += f.sizeBytes; audioCount++; break;
        case 'archives': arcSize += f.sizeBytes; arcCount++; break;
        default: othSize += f.sizeBytes; othCount++; break;
      }
    });

    const totalUsed = activeFiles.reduce((acc, curr) => acc + curr.sizeBytes, 0);

    return {
      totalUsedBytes: totalUsed,
      quotaBytes: this.user.storageQuotaBytes,
      usagePercentage: Math.min(100, (totalUsed / this.user.storageQuotaBytes) * 100),
      fileCount: activeFiles.length,
      folderCount: this.folders.length,
      categoryBreakdown: [
        { category: 'documents', name: 'Documents', bytes: docsSize, count: docsCount, color: '#8b5cf6' },
        { category: 'images', name: 'Images & Photos', bytes: imgsSize, count: imgsCount, color: '#3b82f6' },
        { category: 'videos', name: 'Videos & Media', bytes: vidsSize, count: vidsCount, color: '#ec4899' },
        { category: 'audio', name: 'Audio Recordings', bytes: audioSize, count: audioCount, color: '#f59e0b' },
        { category: 'archives', name: 'Compressed Archives', bytes: arcSize, count: arcCount, color: '#10b981' },
        { category: 'other', name: 'Other Files & Vault', bytes: othSize, count: othCount, color: '#64748b' },
      ],
      monthlyUploadActivity: [
        { month: 'Jun', uploadCount: 4, sizeMB: 120 },
        { month: 'Jul', uploadCount: 9, sizeMB: 480 },
        { month: 'Aug', uploadCount: 14, sizeMB: 890 },
        { month: 'Sep', uploadCount: 22, sizeMB: 1420 },
        { month: 'Oct', uploadCount: 31, sizeMB: 2150 },
      ],
      largestFiles: [...activeFiles].sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 5),
      recentUploads: [...activeFiles].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).slice(0, 5),
    };
  }

  resetDemoData() {
    localStorage.removeItem('cn_demo_folders');
    localStorage.removeItem('cn_demo_files');
    localStorage.removeItem('cn_demo_shares');
    localStorage.removeItem('cn_demo_activities');
    localStorage.removeItem('cn_demo_user');
    this.user = DEMO_USER;
    this.folders = INITIAL_FOLDERS;
    this.files = INITIAL_FILES;
    this.shares = INITIAL_SHARES;
    this.activities = INITIAL_ACTIVITIES;
    this.persist();
  }
}

export const demoStore = new DemoStore();
