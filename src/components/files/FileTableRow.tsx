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

interface FileTableRowProps {
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

export const FileTableRow: React.FC<FileTableRowProps> = ({
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
      case 'images': return <Image className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'videos': return <Film className="w-4 h-4 text-pink-500 shrink-0" />;
      case 'audio': return <Music className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'archives': return <Archive className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'documents': return <FileText className="w-4 h-4 text-violet-500 shrink-0" />;
      default: return <FileCode className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  return (
    <tr
      onClick={onPreview}
      className={`group border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 text-xs transition-colors cursor-pointer select-none ${
        isSelected ? 'bg-violet-50/50 dark:bg-violet-950/20' : ''
      }`}
    >
      {/* Checkbox */}
      <td className="py-3 px-4 w-10" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onSelect}
          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
          }`}
          aria-label="Select file"
        >
          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
        </button>
      </td>

      {/* Name and icon */}
      <td className="py-3 px-4 max-w-xs sm:max-w-md">
        <div className="flex items-center gap-2.5 truncate">
          {getFileIcon()}
          <span className="font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {file.name}
          </span>
        </div>
      </td>

      {/* Category */}
      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 capitalize hidden sm:table-cell">
        {file.category}
      </td>

      {/* Size */}
      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono tabular-nums">
        {formatBytes(file.sizeBytes)}
      </td>

      {/* Upload date */}
      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono tabular-nums hidden md:table-cell">
        {formatDate(file.uploadedAt)}
      </td>

      {/* Star button */}
      <td className="py-3 px-2 w-10 text-center" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onToggleStar}
          className={`p-1 rounded-md transition-colors ${
            file.starred
              ? 'text-amber-500'
              : 'text-slate-300 dark:text-slate-600 hover:text-amber-500'
          }`}
          aria-label={file.starred ? 'Unstar file' : 'Star file'}
        >
          <Star className={`w-4 h-4 ${file.starred ? 'fill-amber-500' : ''}`} />
        </button>
      </td>

      {/* Options menu */}
      <td className="py-3 px-4 w-12 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="File options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-6 z-30 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 text-xs space-y-0.5 text-left">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDownload();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onShare();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Share2 className="w-3.5 h-3.5 text-violet-600" />
                  <span>Share Link</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onMove();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <FolderInput className="w-3.5 h-3.5 text-blue-600" />
                  <span>Move to Folder</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onRename();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Move to Trash</span>
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
