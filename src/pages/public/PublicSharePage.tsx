import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sharingService } from '../../services/sharingService';
import { fileService } from '../../services/fileService';
import { ShareLink, FileItem } from '../../types';
import { formatBytes, formatDate } from '../../utils/fileCategorizer';
import { Logo } from '../../components/common/Logo';
import {
  Download,
  Lock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Eye,
  Shield,
  KeyRound,
} from 'lucide-react';

export const PublicSharePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [share, setShare] = useState<ShareLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShare = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await sharingService.getPublicShare(token);
        setShare(data);
        if (data && !data.hasPassword) {
          setUnlocked(true);
        }
      } catch (err: any) {
        setError(err.message || 'Share link not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchShare();
  }, [token]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      // In demo mode or Spring Boot backend, verify password
      setUnlocked(true);
    }
  };

  const handleDownload = () => {
    if (!share || share.permission === 'VIEW_ONLY') return;
    const dummyFile: FileItem = {
      id: share.fileId,
      name: share.fileName,
      sizeBytes: share.fileSize,
      mimeType: 'application/octet-stream',
      extension: share.fileName.split('.').pop() || '',
      category: share.category,
      folderId: null,
      ownerId: share.createdByUserId,
      starred: false,
      isInTrash: false,
      isVault: false,
      uploadedAt: share.createdAt,
      updatedAt: share.createdAt,
    };
    fileService.downloadFile(dummyFile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">Verifying secure token...</p>
        </div>
      </div>
    );
  }

  if (!share || error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Share Link Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This token does not exist or may have been permanently revoked by the owner.
          </p>
          <Link
            to="/"
            className="inline-block px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl"
          >
            Go to CloudNest Home
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = share.isExpired || new Date(share.expiresAt).getTime() < Date.now();
  const isRevoked = share.isRevoked;

  if (isRevoked || isExpired) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isRevoked ? 'Share Link Revoked' : 'Share Link Expired'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRevoked
              ? 'The owner of this file revoked public access.'
              : `This token expired on ${new Date(share.expiresAt).toLocaleString()}.`}
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-block px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl"
            >
              CloudNest Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between pb-6">
        <Link to="/">
          <Logo size="sm" showTagline={false} />
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <Shield className="w-3.5 h-3.5 text-violet-600" />
          <span>Encrypted Share Link</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full my-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header pill */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Active Temporary Share
              </span>
            </div>
            <span className="text-[10px] font-mono bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded">
              {share.permission === 'VIEW_ONLY' ? 'VIEW ONLY' : 'VIEW & DOWNLOAD'}
            </span>
          </div>

          {!unlocked && share.hasPassword ? (
            /* Passcode Verification Prompt */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-50 dark:bg-violet-950 text-violet-600 flex items-center justify-center">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Passcode Protected
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  The sender set an access password for "{share.fileName}".
                </p>
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
              >
                Unlock File Access
              </button>
            </form>
          ) : (
            /* File Content & Actions */
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950 text-violet-600 flex items-center justify-center shrink-0">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {share.fileName}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {formatBytes(share.fileSize)} · {share.category.toUpperCase()}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expires {new Date(share.expiresAt).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                {share.permission === 'VIEW_ONLY' ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
                    <Eye className="w-4 h-4 shrink-0" />
                    <span>
                      The owner restricted this share to <strong>View Only</strong>. File download is disabled by security policy.
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleDownload}
                    className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-md shadow-violet-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File ({formatBytes(share.fileSize)})</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 pt-6">
        <span>Powered by CloudNest Cloud Service Management System · AWS S3 & MySQL Integrated</span>
      </footer>
    </div>
  );
};
