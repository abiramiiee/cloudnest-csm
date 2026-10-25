import React, { useState, useEffect } from 'react';
import { trashService } from '../../services/trashService';
import { FileItem } from '../../types';
import { formatBytes, formatDate } from '../../utils/fileCategorizer';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const TrashPage: React.FC = () => {
  const [trashItems, setTrashItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [emptyModalOpen, setEmptyModalOpen] = useState(false);
  const [fileToDeletePermanently, setFileToDeletePermanently] = useState<FileItem | null>(null);
  const { showToast } = useToast();

  const loadTrash = async () => {
    setLoading(true);
    try {
      const data = await trashService.getTrashItems();
      setTrashItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (file: FileItem) => {
    try {
      await trashService.restoreItem(file.id);
      await loadTrash();
      showToast(`Restored "${file.name}" to workspace`, { type: 'success' });
    } catch (err: any) {
      showToast(err.message, { type: 'error' });
    }
  };

  const handlePermanentDelete = async (file: FileItem) => {
    try {
      await trashService.permanentlyDeleteItem(file.id);
      await loadTrash();
      setFileToDeletePermanently(null);
      showToast(`Permanently purged "${file.name}"`, { type: 'info' });
    } catch (err: any) {
      showToast(err.message, { type: 'error' });
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const count = await trashService.emptyTrash();
      await loadTrash();
      setEmptyModalOpen(false);
      showToast(`Trash emptied (${count} items removed)`, { type: 'success' });
    } catch (err: any) {
      showToast(err.message, { type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-500" />
            <span>Trash Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Soft-deleted items are safely held here before permanent storage reclamation
          </p>
        </div>

        {trashItems.length > 0 && (
          <button
            onClick={() => setEmptyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl transition-colors cursor-pointer border border-rose-200 dark:border-rose-900/60 shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Trash ({trashItems.length})</span>
          </button>
        )}
      </div>

      {trashItems.length === 0 ? (
        <EmptyState
          icon={Trash2}
          title="Trash is currently empty"
          description="Deleted files from your drive will be held here for 30 days before being purged."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Deleted Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trashItems.map((file) => (
                  <tr
                    key={file.id}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{file.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      {formatBytes(file.sizeBytes)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      {formatDate(file.updatedAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRestore(file)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-violet-600" />
                          <span>Restore</span>
                        </button>

                        <button
                          onClick={() => setFileToDeletePermanently(file)}
                          className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          Delete Forever
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Empty All Trash */}
      {emptyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setEmptyModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Empty All Trash?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                All {trashItems.length} files in Trash will be permanently deleted from object storage and cannot be recovered.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEmptyModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleEmptyTrash}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Yes, Empty Trash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Single File Permanent Delete */}
      {fileToDeletePermanently && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setFileToDeletePermanently(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete Permanently?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                "{fileToDeletePermanently.name}" will be erased from storage.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setFileToDeletePermanently(null)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePermanentDelete(fileToDeletePermanently)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
