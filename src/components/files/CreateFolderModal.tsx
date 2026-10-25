import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useFiles } from '../../context/FileContext';
import { folderService } from '../../services/folderService';
import { useToast } from '../../context/ToastContext';
import { FolderPlus } from 'lucide-react';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose }) => {
  const { currentFolderId, refreshFolders } = useFiles();
  const { showToast } = useToast();
  const [folderName, setFolderName] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [loading, setLoading] = useState(false);

  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#64748b'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      showToast('Please enter a folder name', { type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      await folderService.createFolder(folderName.trim(), currentFolderId, color);
      await refreshFolders();
      showToast(`Folder "${folderName.trim()}" created`, { type: 'success' });
      setFolderName('');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to create folder', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Folder"
      description="Organize your files into categorical directory structures."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Folder Name
          </label>
          <input
            type="text"
            required
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g., Lab Reports 2026"
            className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-slate-100"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Folder Accent Color
          </label>
          <div className="flex items-center gap-3">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? 'scale-110 ring-2 ring-offset-2 ring-violet-500' : 'hover:scale-105'
                }`}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>{loading ? 'Creating...' : 'Create Folder'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
