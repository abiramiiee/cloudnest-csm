import React, { useState, useEffect } from 'react';
import { fileService } from '../../services/fileService';
import { FileItem } from '../../types';
import { useToast } from '../../context/ToastContext';
import { FileCard } from '../../components/files/FileCard';
import { FilePreviewModal } from '../../components/files/FilePreviewModal';
import { ShareModal } from '../../components/files/ShareModal';
import { MoveModal } from '../../components/files/MoveModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StarredFilesPage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [shareFile, setShareFile] = useState<FileItem | null>(null);
  const [moveFile, setMoveFile] = useState<FileItem | null>(null);
  const { showToast } = useToast();

  const loadStarred = async () => {
    setLoading(true);
    try {
      const data = await fileService.getStarredFiles();
      setFiles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStarred();
  }, []);

  const handleToggleStar = async (file: FileItem) => {
    try {
      await fileService.toggleStar(file.id);
      await loadStarred();
      showToast('Removed from starred', { type: 'info' });
    } catch (err: any) {
      showToast(err.message, { type: 'error' });
    }
  };

  const handleDelete = async (file: FileItem) => {
    try {
      await fileService.moveToTrash(file.id);
      await loadStarred();
      showToast(`Moved "${file.name}" to Trash`, { type: 'info' });
    } catch (err: any) {
      showToast(err.message, { type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span>Starred Files</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Pinned important documents and project deliverables for quick access
        </p>
      </div>

      {files.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No starred files yet"
          description="Star key documents in your File Manager to quickly access them here anytime."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {files.map((file) => (
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
              onDownload={() => fileService.downloadFile(file)}
            />
          ))}
        </div>
      )}

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
    </div>
  );
};
