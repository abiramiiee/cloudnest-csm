import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFiles } from '../../context/FileContext';
import { useToast } from '../../context/ToastContext';
import { activityService } from '../../services/activityService';
import { fileService } from '../../services/fileService';
import { sharingService } from '../../services/sharingService';
import { FileItem, FileActivity, ShareLink } from '../../types';
import { formatBytes, formatDate, formatDateTime } from '../../utils/fileCategorizer';
import { FileCard } from '../../components/files/FileCard';
import { FilePreviewModal } from '../../components/files/FilePreviewModal';
import { ShareModal } from '../../components/files/ShareModal';
import { MoveModal } from '../../components/files/MoveModal';
import { CreateFolderModal } from '../../components/files/CreateFolderModal';
import {
  Folder,
  Files,
  HardDrive,
  Share2,
  UploadCloud,
  FolderPlus,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Trash2,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const { files, folders, refreshFiles } = useFiles();
  const { showToast } = useToast();
  const { onOpenUpload } = useOutletContext<{ onOpenUpload: () => void }>();

  const [activities, setActivities] = useState<FileActivity[]>([]);
  const [shares, setShares] = useState<ShareLink[]>([]);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [shareFile, setShareFile] = useState<FileItem | null>(null);
  const [moveFile, setMoveFile] = useState<FileItem | null>(null);
  const [folderModalOpen, setFolderModalOpen] = useState(false);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        const [acts, shs] = await Promise.all([
          activityService.getActivities(6),
          sharingService.getCreatedShares(),
        ]);
        setActivities(acts);
        setShares(shs);
      } catch {
        // handled
      }
    };
    loadOverviewData();
  }, [files]);

  const storageUsed = user?.storageUsedBytes || 3.4 * 1024 * 1024 * 1024;
  const storageQuota = user?.storageQuotaBytes || 15 * 1024 * 1024 * 1024;
  const availableBytes = Math.max(0, storageQuota - storageUsed);
  const usagePercentage = Math.min(100, Math.round((storageUsed / storageQuota) * 100));

  const recentFiles = files.slice(0, 4);

  const handleToggleStar = async (file: FileItem) => {
    try {
      await fileService.toggleStar(file.id);
      await refreshFiles();
      showToast(file.starred ? `Unstarred "${file.name}"` : `Starred "${file.name}"`, { type: 'info' });
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

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome & Quick CTA Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Alex'}!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            CloudNest Storage Node · College CSM Project Workspace
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setFolderModalOpen(true)}
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
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Files className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Files</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {files.length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Folders</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {folders.length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Storage Used</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatBytes(storageUsed)}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Files Shared</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {shares.filter((s) => !s.isRevoked).length}
            </p>
          </div>
        </div>
      </div>

      {/* Storage Summary Strip */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Storage Capacity Overview</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Allocated AWS S3 bucket capacity with MySQL metadata tracking
            </p>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Used: <strong className="text-violet-600">{formatBytes(storageUsed)}</strong></span>
            <span>·</span>
            <span>Free: <strong className="text-emerald-600">{formatBytes(availableBytes)}</strong></span>
            <span>·</span>
            <span>Quota: <strong className="text-slate-700 dark:text-slate-300">{formatBytes(storageQuota)}</strong></span>
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>{usagePercentage}% used of 15 GB allocation</span>
          <Link to="/app/insights" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
            View Analytics & Breakdown →
          </Link>
        </div>
      </div>

      {/* Recent Files Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Files</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Frequently accessed and updated files</p>
          </div>
          <Link
            to="/app/files"
            className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
          >
            <span>View All Files</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              isSelected={false}
              onSelect={() => {}}
              onPreview={() => setPreviewFile(file)}
              onToggleStar={() => handleToggleStar(file)}
              onShare={() => setShareFile(file)}
              onMove={() => setMoveFile(file)}
              onRename={() => setPreviewFile(file)}
              onDelete={() => handleDelete(file)}
              onDownload={() => handleDownload(file)}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-600" />
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Recent Activity Timeline</h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Live Audit Stream</span>
        </div>

        <div className="space-y-3 pt-2">
          {activities.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No recent activity recorded.</p>
          ) : (
            activities.map((act) => {
              const getActionBadge = () => {
                switch (act.action) {
                  case 'UPLOAD': return <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 font-semibold px-2 py-0.5 rounded text-[10px]">UPLOAD</span>;
                  case 'SHARE_CREATE': return <span className="text-violet-600 bg-violet-50 dark:bg-violet-950/60 font-semibold px-2 py-0.5 rounded text-[10px]">SHARE</span>;
                  case 'STAR': return <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/60 font-semibold px-2 py-0.5 rounded text-[10px]">STAR</span>;
                  case 'TRASH': return <span className="text-rose-600 bg-rose-50 dark:bg-rose-950/60 font-semibold px-2 py-0.5 rounded text-[10px]">TRASH</span>;
                  default: return <span className="text-blue-600 bg-blue-50 dark:bg-blue-950/60 font-semibold px-2 py-0.5 rounded text-[10px]">{act.action}</span>;
                }
              };

              return (
                <div
                  key={act.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 text-xs border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    {getActionBadge()}
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{act.fileName}</p>
                      {act.details && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{act.details}</p>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    {formatDateTime(act.timestamp)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

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
        isOpen={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
      />
    </div>
  );
};
