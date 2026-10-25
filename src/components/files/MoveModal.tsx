import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { FileItem } from '../../types';
import { useFiles } from '../../context/FileContext';
import { fileService } from '../../services/fileService';
import { useToast } from '../../context/ToastContext';
import { Folder, FolderCheck } from 'lucide-react';

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
}

export const MoveModal: React.FC<MoveModalProps> = ({ isOpen, onClose, file }) => {
  const { folders, refreshFiles } = useFiles();
  const { showToast } = useToast();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(file?.folderId || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!file) return null;

  const handleMove = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fileService.moveFile(file.id, selectedFolderId);
      await refreshFiles();
      showToast(`Moved "${file.name}"`, { type: 'success' });
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to move file', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Move File"
      description={`Select a new destination folder for "${file.name}"`}
    >
      <form onSubmit={handleMove} className="space-y-4">
        <div className="max-h-60 overflow-y-auto space-y-1.5 p-1">
          {/* Root directory option */}
          <button
            type="button"
            onClick={() => setSelectedFolderId(null)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all ${
              selectedFolderId === null
                ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 font-semibold ring-1 ring-violet-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Folder className="w-4 h-4 text-violet-500" />
              <span>Root Directory (No folder)</span>
            </span>
            {selectedFolderId === null && <FolderCheck className="w-4 h-4 text-violet-600" />}
          </button>

          {/* User folders */}
          {folders.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFolderId(f.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all ${
                selectedFolderId === f.id
                  ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 font-semibold ring-1 ring-violet-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Folder className="w-4 h-4" style={{ color: f.color || '#8b5cf6' }} />
                <span>{f.name}</span>
              </span>
              {selectedFolderId === f.id && <FolderCheck className="w-4 h-4 text-violet-600" />}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
          >
            {isSubmitting ? 'Moving...' : 'Confirm Move'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
