import React, { useState } from 'react';
import { useFiles } from '../../context/FileContext';
import { useToast } from '../../context/ToastContext';
import { fileService } from '../../services/fileService';
import { folderService } from '../../services/folderService';
import { FileItem, FolderItem, FileCategory } from '../../types';
import { formatBytes, formatDate } from '../../utils/fileCategorizer';
import { FileCard } from '../../components/files/FileCard';
import { FileTableRow } from '../../components/files/FileTableRow';
import { FilePreviewModal } from '../../components/files/FilePreviewModal';
import { ShareModal } from '../../components/files/ShareModal';
import { MoveModal } from '../../components/files/MoveModal';
import { CreateFolderModal } from '../../components/files/CreateFolderModal';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Folder,
  UploadCloud,
  FolderPlus,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  Search,
  ChevronRight,
  Trash2,
  FolderInput,
  FolderOpen,
  Check,
  X,
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export const MyFilesPage: React.FC = () => {
  const {
    files,
    folders,
    currentFolderId,
    setCurrentFolderId,
    refreshFiles,
    refreshFolders,
    viewMode,
    setViewMode,
    selectedFileIds,
    toggleSelectFile,
    selectAllFiles,
    clearSelection,
  } = useFiles();

  const { onOpenUpload } = useOutletContext<{ onOpenUpload: () => void }>();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [shareFile, setShareFile] = useState<FileItem | null>(null);
  const [moveFile, setMoveFile] = useState<FileItem | null>(null);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<FileItem | null>(null);
  const [newFileName, setNewFileName] = useState('');

  // Folder navigation breadcrumb
  const currentFolder = folders.find((f) => f.id === currentFolderId);

  // Filter by category
  let displayedFiles = files;
  if (activeCategory !== 'all') {
    displayedFiles = displayedFiles.filter((f) => f.category === activeCategory);
  }

  // Sort logic
  displayedFiles = [...displayedFiles].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'date') {
      comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
    } else if (sortBy === 'size') {
      comparison = a.sizeBytes - b.sizeBytes;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Files' },
    { id: 'documents', label: 'Documents' },
    { id: 'images', label: 'Images' },
    { id: 'videos', label: 'Videos' },
    { id: 'audio', label: 'Audio' },
    { id: 'archives', label: 'Archives' },
  ];

  const handleToggleStar = async (file: FileItem) => {
    try {
      await fileService.toggleStar(file.id);
      await refreshFiles();
      showToast(file.starred ? 'Removed star' : 'Added star', { type: 'info' });
    } catch (err: any) {
      showToast(err.message, { type: 'error' });
    }
  };

  const handleDelete = async (file: FileItem) => {
    try {
      await fileService.moveToTrash(file.id);
      await refreshFiles();
      showToast(`Moved "${file.name}" to Trash`, { type: 'info' });
    } catch (err: any) {
      showToast(err.message, { type: 'error' });
    }
  };

  const handleDownload = (file: FileItem) => {
    fileService.downloadFile(file);
    showToast(`Downloading "${file.name}"`, { type: 'info' });
  };

  const handleStartRename = (file: FileItem) => {
    setFileToRename(file);
    setNewFileName(file.name);
    setRenameModalOpen(true);
  };

  const handleConfirmRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToRename || !newFileName.trim()) return;

    try {
      await fileService.renameFile(fileToRename.id, newFileName.trim());
      await refreshFiles();
      showToast('File renamed', { type: 'success' });
      setRenameModalOpen(false);
      setFileToRename(null);
    } catch (err: any) {
      showToast(err.message || 'Rename failed', { type: 'error' });
    }
  };

  // Bulk Operations
  const handleBulkDelete = async () => {
    if (selectedFileIds.length === 0) return;
    try {
      for (const id of selectedFileIds) {
        await fileService.moveToTrash(id);
      }
      await refreshFiles();
      showToast(`Moved ${selectedFileIds.length} files to Trash`, { type: 'info' });
      clearSelection();
    } catch (err: any) {
      showToast(err.message, { type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <button
              onClick={() => setCurrentFolderId(null)}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
                currentFolderId === null ? 'font-bold text-violet-600 dark:text-violet-400' : ''
              }`}
            >
              My Files (Root)
            </button>
            {currentFolder && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                  {currentFolder.name}
                </span>
              </>
            )}
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {currentFolder ? currentFolder.name : 'File Manager'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateFolderOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-violet-600" />
            <span>New Folder</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Folders Row (when at root) */}
      {currentFolderId === null && folders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Folders ({folders.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => setCurrentFolderId(folder.id)}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-md transition-all cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${folder.color || '#8b5cf6'}18` }}
                  >
                    <Folder className="w-5 h-5" style={{ color: folder.color || '#8b5cf6' }} />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-violet-600">
                      {folder.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {folder.fileCount || 0} files · Created {formatDate(folder.createdAt)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-600 transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar: Category Tabs, Sort, View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Toggle & Sorting */}
        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb as any);
                setSortOrder(so as any);
              }}
              className="text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-violet-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="size-desc">Largest First</option>
              <option value="size-asc">Smallest First</option>
            </select>
          </div>

          {/* Grid / List Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List View"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Selection Bar (shows when items are selected) */}
      {selectedFileIds.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-violet-900 dark:text-violet-200">
              {selectedFileIds.length} item{selectedFileIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={selectAllFiles}
              className="text-violet-600 dark:text-violet-400 underline hover:text-violet-800"
            >
              Select All ({displayedFiles.length})
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* File List Content */}
      {displayedFiles.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No files in this directory"
          description="Upload files to start managing your digital workspace with CloudNest."
          actionText="Upload Files Now"
          onAction={onOpenUpload}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              isSelected={selectedFileIds.includes(file.id)}
              onSelect={() => toggleSelectFile(file.id)}
              onPreview={() => setPreviewFile(file)}
              onToggleStar={() => handleToggleStar(file)}
              onShare={() => setShareFile(file)}
              onMove={() => setMoveFile(file)}
              onRename={() => handleStartRename(file)}
              onDelete={() => handleDelete(file)}
              onDownload={() => handleDownload(file)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3 px-4 w-10">
                    <button
                      type="button"
                      onClick={() =>
                        selectedFileIds.length === displayedFiles.length
                          ? clearSelection()
                          : selectAllFiles()
                      }
                      className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center bg-white dark:bg-slate-800"
                    >
                      {selectedFileIds.length === displayedFiles.length && displayedFiles.length > 0 && (
                        <Check className="w-3 h-3 text-violet-600 stroke-[3]" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Category</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4 hidden md:table-cell">Modified</th>
                  <th className="py-3 px-2 w-10 text-center">Star</th>
                  <th className="py-3 px-4 w-12 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedFiles.map((file) => (
                  <FileTableRow
                    key={file.id}
                    file={file}
                    isSelected={selectedFileIds.includes(file.id)}
                    onSelect={() => toggleSelectFile(file.id)}
                    onPreview={() => setPreviewFile(file)}
                    onToggleStar={() => handleToggleStar(file)}
                    onShare={() => setShareFile(file)}
                    onMove={() => setMoveFile(file)}
                    onRename={() => handleStartRename(file)}
                    onDelete={() => handleDelete(file)}
                    onDownload={() => handleDownload(file)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
        onShare={(f) => setShareFile(f)}
      />

      <ShareModal
        isOpen={!!shareFile}
        onClose={() => setShareFile(null)}
        file={shareFile}
      />

      <MoveModal
        isOpen={!!moveFile}
        onClose={() => setMoveFile(null)}
        file={moveFile}
      />

      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
      />

      {/* Rename Dialog */}
      {renameModalOpen && fileToRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setRenameModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rename File</h3>
            <form onSubmit={handleConfirmRename} className="space-y-4">
              <input
                type="text"
                required
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenameModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
