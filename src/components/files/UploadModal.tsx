import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { useFiles } from '../../context/FileContext';
import { useToast } from '../../context/ToastContext';
import { UploadCloud, File as FileIcon, X, CheckCircle2 } from 'lucide-react';
import { formatBytes, categorizeFile } from '../../utils/fileCategorizer';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { uploadFiles, folders, currentFolderId } = useFiles();
  const { showToast } = useToast();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(currentFolderId);
  const [selectedFileList, setSelectedFileList] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFileList((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileList((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFileList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFileList.length === 0) {
      showToast('Please select at least one file to upload', { type: 'warning' });
      return;
    }

    setIsUploading(true);
    try {
      await uploadFiles(selectedFileList, selectedFolder);
      setSelectedFileList([]);
      onClose();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Files to CloudNest"
      description="Add files to your cloud storage space with automatic deterministic categorization."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Destination folder selector */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Destination Folder
          </label>
          <select
            value={selectedFolder || ''}
            onChange={(e) => setSelectedFolder(e.target.value || null)}
            className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-slate-100"
          >
            <option value="">Root Space (No folder)</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                📁 {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-violet-500 bg-violet-50/60 dark:bg-violet-950/30'
              : 'border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500 bg-slate-50/50 dark:bg-slate-800/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Click to browse or drag and drop files here
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Documents, Images, Media, Archives up to 500 MB per file
          </p>
        </div>

        {/* Selected files preview list */}
        {selectedFileList.length > 0 && (
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Files to upload ({selectedFileList.length})
            </p>
            {selectedFileList.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <FileIcon className="w-4 h-4 text-violet-500 shrink-0" />
                  <div className="truncate">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {formatBytes(file.size)} · {categorizeFile(file.name, file.type).toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(idx);
                  }}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading || selectedFileList.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors"
          >
            {isUploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Upload {selectedFileList.length > 0 ? `(${selectedFileList.length})` : ''}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
