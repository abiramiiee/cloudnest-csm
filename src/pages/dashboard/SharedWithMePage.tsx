import React, { useState, useEffect } from 'react';
import { sharingService } from '../../services/sharingService';
import { fileService } from '../../services/fileService';
import { SharedWithMeItem, FileItem } from '../../types';
import { formatBytes, formatDate } from '../../utils/fileCategorizer';
import { useToast } from '../../context/ToastContext';
import { FilePreviewModal } from '../../components/files/FilePreviewModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Users, FileText, Download, Eye, Clock, ShieldCheck } from 'lucide-react';

export const SharedWithMePage: React.FC = () => {
  const [items, setItems] = useState<SharedWithMeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const loadSharedWithMe = async () => {
      setLoading(true);
      try {
        const data = await sharingService.getSharedWithMe();
        setItems(data);
      } finally {
        setLoading(false);
      }
    };
    loadSharedWithMe();
  }, []);

  const handleDownload = (item: SharedWithMeItem) => {
    if (item.permission === 'VIEW_ONLY') {
      showToast('This file is View Only. Download is restricted by the sender.', { type: 'warning' });
      return;
    }
    const dummyFile: FileItem = {
      id: item.fileId,
      name: item.fileName,
      sizeBytes: item.fileSize,
      mimeType: 'application/pdf',
      extension: item.fileName.split('.').pop() || '',
      category: item.category,
      folderId: null,
      ownerId: 'external',
      starred: false,
      isInTrash: false,
      isVault: false,
      uploadedAt: item.sharedAt,
      updatedAt: item.sharedAt,
    };
    fileService.downloadFile(dummyFile);
    showToast(`Downloading "${item.fileName}"`, { type: 'info' });
  };

  const handlePreview = (item: SharedWithMeItem) => {
    const dummyFile: FileItem = {
      id: item.fileId,
      name: item.fileName,
      sizeBytes: item.fileSize,
      mimeType: 'application/pdf',
      extension: item.fileName.split('.').pop() || '',
      category: item.category,
      folderId: null,
      ownerId: 'external',
      starred: false,
      isInTrash: false,
      isVault: false,
      uploadedAt: item.sharedAt,
      updatedAt: item.sharedAt,
    };
    setPreviewFile(dummyFile);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-600" />
          <span>Shared With Me</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Files and course materials shared by professors and project teammates
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No incoming shared files"
          description="Files shared directly with your university email address will be cataloged here."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Shared By</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Permission</th>
                  <th className="py-3 px-4">Expires</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handlePreview(item)}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-violet-500 shrink-0" />
                        <span className="truncate max-w-xs">{item.fileName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{item.sharedByUserName}</p>
                      <p className="text-[10px] text-slate-400">{item.sharedByUserEmail}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      {formatBytes(item.fileSize)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                          item.permission === 'VIEW_AND_DOWNLOAD'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {item.permission === 'VIEW_AND_DOWNLOAD' ? 'VIEW & DOWNLOAD' : 'VIEW ONLY'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono tabular-nums text-[11px]">
                      {formatDate(item.expiresAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePreview(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Preview File"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {item.permission === 'VIEW_AND_DOWNLOAD' ? (
                          <button
                            onClick={() => handleDownload(item)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold text-[11px] shadow-xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </div>
  );
};
