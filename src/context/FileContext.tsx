import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FileItem, FolderItem } from '../types';
import { fileService } from '../services/fileService';
import { folderService } from '../services/folderService';
import { useToast } from './ToastContext';

interface UploadProgressItem {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
}

interface FileContextType {
  files: FileItem[];
  folders: FolderItem[];
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
  isLoading: boolean;
  refreshFiles: () => Promise<void>;
  refreshFolders: () => Promise<void>;
  uploads: UploadProgressItem[];
  uploadFiles: (files: FileList | File[], folderId?: string | null) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  selectedFileIds: string[];
  toggleSelectFile: (id: string) => void;
  selectAllFiles: () => void;
  clearSelection: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploads, setUploads] = useState<UploadProgressItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const { showToast } = useToast();

  const refreshFolders = useCallback(async () => {
    try {
      const flds = await folderService.getFolders();
      setFolders(flds);
    } catch {
      // handled
    }
  }, []);

  const refreshFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fileService.getFiles({
        folderId: currentFolderId,
        search: searchQuery || undefined,
      });
      setFiles(data);
    } catch {
      // handled
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, searchQuery]);

  useEffect(() => {
    refreshFolders();
  }, [refreshFolders]);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const uploadFiles = async (fileList: FileList | File[], targetFolderId: string | null = currentFolderId) => {
    const list = Array.from(fileList);
    if (list.length === 0) return;

    for (const file of list) {
      const uploadId = `upl_${Date.now()}_${file.name}`;
      setUploads((prev) => [
        ...prev,
        { id: uploadId, fileName: file.name, progress: 10, status: 'uploading' },
      ]);

      try {
        await fileService.uploadFile(file, targetFolderId, (prog) => {
          setUploads((prev) =>
            prev.map((u) => (u.id === uploadId ? { ...u, progress: prog } : u))
          );
        });

        setUploads((prev) =>
          prev.map((u) => (u.id === uploadId ? { ...u, progress: 100, status: 'completed' } : u))
        );

        showToast(`Uploaded "${file.name}" successfully`, { type: 'success' });
      } catch (err: any) {
        setUploads((prev) =>
          prev.map((u) => (u.id === uploadId ? { ...u, status: 'failed' } : u))
        );
        showToast(`Failed to upload "${file.name}": ${err.message || 'Error'}`, { type: 'error' });
      }
    }

    // Refresh after upload
    await refreshFiles();
    await refreshFolders();

    // Auto-clean completed uploads after 3s
    setTimeout(() => {
      setUploads((prev) => prev.filter((u) => u.status === 'uploading'));
    }, 3000);
  };

  const toggleSelectFile = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAllFiles = () => {
    setSelectedFileIds(files.map((f) => f.id));
  };

  const clearSelection = () => {
    setSelectedFileIds([]);
  };

  return (
    <FileContext.Provider
      value={{
        files,
        folders,
        currentFolderId,
        setCurrentFolderId,
        isLoading,
        refreshFiles,
        refreshFolders,
        uploads,
        uploadFiles,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        selectedFileIds,
        toggleSelectFile,
        selectAllFiles,
        clearSelection,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};
