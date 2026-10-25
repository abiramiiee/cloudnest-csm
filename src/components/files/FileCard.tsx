import React, { useState } from 'react';
import { FileItem } from '../../types';
import { formatBytes, formatDate } from '../../utils/fileCategorizer';
import {
  FileText,
  Image,
  Film,
  Music,
  Archive,
  FileCode,
  Star,
  MoreVertical,
  Download,
  Share2,
  FolderInput,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';

interface FileCardProps {
  file: FileItem;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onToggleStar: () => void;
  onShare: () => void;
  onMove: () => void;
  onRename: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  file,
  isSelected,
  onSelect,
  onPreview,
  onToggleStar,
  onShare,
  onMove,
  onRename,
  onDelete,
  onDownload,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getFileIcon = () => {
    switch (file.category) {
      case 'images':
        return <Image className="w-6 h-6 text-blue-500" />;
      case 'videos':
        return <Film className="w-6 h-6 text-pink-500" />;
      case 'audio':
        return <Music className="w-6 h-6 text-amber-500" />;
      case 'archives':
        return <Archive className="w-6 h-6 text-emerald-500" />;
      case 'documents':
        return <FileText className="w-6 h-6 text-violet-500" />;
      default:
        return <FileCode className="w-6 h-6 text-slate-500" />;
    }
  };

  return (
    <div
      onClick={onPreview}
      className={`group relative flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer select-none ${
        isSelected
          ? 'border-violet-600 ring-2 ring-violet-500/20 bg-violet-50/20 dark:bg-violet-950/20 shadow-sm'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
      }`}
    >
      {/* Top row: Checkbox, Star, and Actions menu */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400 bg-white dark:bg-slate-800'
          }`}
          aria-label="Select file"
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar();
            }}
            className={`p-1 rounded-md transition-colors ${
              file.starred
                ? 'text-amber-500'
                : 'text-slate-300 dark:text-slate-600 hover:text-amber-500'
            }`}
            aria-label={file.starred ? 'Unstar file' : 'Star file'}
          >
            <Star className={`w-4 h-4 ${file.starred ? 'fill-amber-500' : ''}`} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="File options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-6 z-30 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 text-xs space-y-0.5"
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDownload();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onShare();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <Share2 className="w-3.5 h-3.5 text-violet-600" />
                    <span>Share Link</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onMove();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <FolderInput className="w-3.5 h-3.5 text-blue-600" />
                    <span>Move to Folder</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onRename();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Rename</span>
                  </button>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Move to Trash</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* File Graphic Preview or Icon */}
      <div className="h-28 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3 overflow-hidden border border-slate-100 dark:border-slate-800/80">
        {file.category === 'images' && file.contentPreview ? (
          <img
            src={file.contentPreview}
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-xs border border-slate-200/60 dark:border-slate-700/60">
            {getFileIcon()}
          </div>
        )}
      </div>

      {/* File Details */}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {file.name}
        </p>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
          <span>{formatBytes(file.sizeBytes)}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(file.uploadedAt)}</span>
        </div>
      </div>
    </div>
  );
};
