import React from 'react';
import { Modal } from '../common/Modal';
import { FileItem } from '../../types';
import { formatBytes, formatDate } from '../../utils/fileCategorizer';
import { fileService } from '../../services/fileService';
import { Download, Star, Share2, FileText, Image, Film, Music, Archive, FileCode } from 'lucide-react';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
  onShare?: (file: FileItem) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  file,
  onShare,
}) => {
  if (!file) return null;

  const handleDownload = () => {
    fileService.downloadFile(file);
  };

  const getCategoryIcon = () => {
    switch (file.category) {
      case 'images': return <Image className="w-8 h-8 text-blue-500" />;
      case 'videos': return <Film className="w-8 h-8 text-pink-500" />;
      case 'audio': return <Music className="w-8 h-8 text-amber-500" />;
      case 'archives': return <Archive className="w-8 h-8 text-emerald-500" />;
      case 'documents': return <FileText className="w-8 h-8 text-violet-500" />;
      default: return <FileCode className="w-8 h-8 text-slate-500" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={file.name}
      description={`Category: ${file.category.toUpperCase()} · Added ${formatDate(file.uploadedAt)}`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Preview Container */}
        <div className="min-h-[220px] max-h-[360px] bg-slate-100 dark:bg-slate-950/60 rounded-2xl flex items-center justify-center p-4 overflow-hidden border border-slate-200/80 dark:border-slate-800">
          {file.category === 'images' && file.contentPreview ? (
            <img
              src={file.contentPreview}
              alt={file.name}
              className="max-h-[320px] max-w-full object-contain rounded-lg shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : file.category === 'documents' && file.extension === 'pdf' ? (
            <div className="w-full h-64 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    PDF Document Stream
                  </span>
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-full" />
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6" />
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Binary stream stored on AWS S3 bucket. Click "Download" to fetch local copy.
              </p>
            </div>
          ) : (
            <div className="text-center p-6 space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto shadow-xs">
                {getCategoryIcon()}
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{file.name}</p>
              <p className="text-[11px] text-slate-400 font-mono">MIME: {file.mimeType || 'binary/octet-stream'}</p>
            </div>
          )}
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Size</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{formatBytes(file.sizeBytes)}</p>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Extension</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">.{file.extension}</p>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Category</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{file.category}</p>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Uploaded</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(file.uploadedAt)}</p>
          </div>
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onShare(file);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-violet-600" />
                <span>Share Link</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
