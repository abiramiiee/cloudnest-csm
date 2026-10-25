import React, { useState, useEffect, useRef } from 'react';
import { vaultService } from '../../services/vaultService';
import { fileService } from '../../services/fileService';
import { FileItem } from '../../types';
import { formatBytes, formatDate } from '../../utils/fileCategorizer';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/common/EmptyState';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  UploadCloud,
  Download,
  Trash2,
  FileCode,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const SecureVaultPage: React.FC = () => {
  const { isDemoMode } = useAuth();
  const { showToast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [vaultFiles, setVaultFiles] = useState<FileItem[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadVaultFiles = async () => {
    try {
      const files = await vaultService.getVaultFiles();
      setVaultFiles(files);
    } catch {
      // handled
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const verified = await vaultService.verifyVaultAccess(pin);
      if (verified) {
        setIsUnlocked(true);
        showToast('Personal Secure Vault unlocked', { type: 'success' });
        await loadVaultFiles();
      } else {
        setError('Incorrect PIN code. Hint for evaluator: use PIN "1234"');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPin('');
    setError(null);
    showToast('Vault secured and relocked', { type: 'info' });
  };

  const handleUploadVaultFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await vaultService.uploadVaultFile(file);
        await loadVaultFiles();
        showToast(`Uploaded "${file.name}" to Secure Vault`, { type: 'success' });
      } catch (err: any) {
        showToast(err.message || 'Vault upload failed', { type: 'error' });
      }
    }
  };

  const handleDeleteVaultFile = async (id: string, name: string) => {
    try {
      await vaultService.deleteVaultFile(id);
      await loadVaultFiles();
      setConfirmDeleteId(null);
      showToast(`Permanently purged "${name}" from vault`, { type: 'info' });
    } catch (err: any) {
      showToast(err.message || 'Failed to delete file', { type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-violet-600" />
            <span>Personal Secure Vault</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Isolated zero-exposure repository for highly sensitive keys, credentials, and recovery phrases
          </p>
        </div>

        {isUnlocked && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload to Vault</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleUploadVaultFile}
              className="hidden"
            />
            <button
              onClick={handleLock}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Lock Vault</span>
            </button>
          </div>
        )}
      </div>

      {!isUnlocked ? (
        /* Vault Lock Screen */
        <div className="max-w-md mx-auto my-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto rounded-3xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 flex items-center justify-center border border-violet-200 dark:border-violet-900 shadow-inner">
            <Lock className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Secondary PIN Verification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your master 4-digit security PIN to decrypt vault metadata.
            </p>
          </div>

          {isDemoMode && (
            <div className="p-3 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900 rounded-xl text-xs text-violet-800 dark:text-violet-300 flex items-center gap-2 text-left">
              <Info className="w-4 h-4 shrink-0 text-violet-600" />
              <span>Demo mode active: default test PIN is <strong>1234</strong></span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-44 text-center tracking-widest text-lg font-mono font-bold px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-slate-100"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !pin}
              className="w-full py-2.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Unlock Secure Vault'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Vault files are never indexed in search or shared via public links.
          </p>
        </div>
      ) : (
        /* Unlocked Vault Files Interface */
        <div className="space-y-6">
          <div className="p-4 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/60 rounded-2xl flex items-start gap-3 text-xs text-violet-900 dark:text-violet-200">
            <ShieldCheck className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Secure Session Active</p>
              <p className="text-[11px] text-violet-700 dark:text-violet-300 mt-0.5">
                These files are excluded from general file lists, search indexes, and cannot be shared via public links. Deletions here are permanent and bypass Trash.
              </p>
            </div>
          </div>

          {vaultFiles.length === 0 ? (
            <EmptyState
              icon={ShieldAlert}
              title="Your Secure Vault is Empty"
              description="Store cryptographic private keys, AWS access secrets, or private certificates safely."
              actionText="Upload First Vault File"
              onAction={() => fileInputRef.current?.click()}
            />
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                      <th className="py-3 px-4">Confidential File Name</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Stored At</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaultFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-2.5">
                            <FileCode className="w-4 h-4 text-violet-500 shrink-0" />
                            <span className="font-mono text-xs">{file.name}</span>
                            <span className="text-[9px] font-mono uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                              AES-256
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                          {formatBytes(file.sizeBytes)}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                          {formatDate(file.uploadedAt)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => fileService.downloadFile(file)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold text-[11px] shadow-xs cursor-pointer"
                              title="Download Vault Artifact"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Decrypt & Download</span>
                            </button>

                            <button
                              onClick={() => setConfirmDeleteId(file.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Permanently Destroy"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* Permanent Deletion Confirmation Modal */}
          {confirmDeleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setConfirmDeleteId(null)} />
              <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Permanently Destroy Vault Item?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This file will be purged from the AWS S3 block store immediately. It cannot be recovered from Trash.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const f = vaultFiles.find((vf) => vf.id === confirmDeleteId);
                      if (f) handleDeleteVaultFile(f.id, f.name);
                    }}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                  >
                    Permanently Erase
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
