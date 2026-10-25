import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { FileItem, SharePermission, ShareLink } from '../../types';
import { sharingService } from '../../services/sharingService';
import { useToast } from '../../context/ToastContext';
import { formatBytes } from '../../utils/fileCategorizer';
import { Share2, Copy, Check, Lock, Shield, Calendar, Eye, Download } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, file }) => {
  const { showToast } = useToast();
  const [permission, setPermission] = useState<SharePermission>('VIEW_AND_DOWNLOAD');
  const [expiryOption, setExpiryOption] = useState<'1h' | '24h' | '7d' | '30d'>('7d');
  const [passwordProtection, setPasswordProtection] = useState(false);
  const [password, setPassword] = useState('');
  const [generatedLink, setGeneratedLink] = useState<ShareLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!file) return null;

  const handleCreateShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const hoursMap = {
      '1h': 1,
      '24h': 24,
      '7d': 168,
      '30d': 720,
    };

    try {
      const share = await sharingService.createShare({
        fileId: file.id,
        permission,
        expiryHours: hoursMap[expiryOption],
        password: passwordProtection && password ? password : undefined,
      });

      setGeneratedLink(share);
      showToast('Share link created successfully', { type: 'success' });
    } catch (err: any) {
      showToast(err.message || 'Failed to generate link', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFullShareUrl = (token: string) => {
    return `${window.location.origin}/share/${token}`;
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    const url = getFullShareUrl(generatedLink.token);
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Share link copied to clipboard', { type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setGeneratedLink(null);
    setPassword('');
    setPasswordProtection(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title="Share File"
      description="Create a secure, temporary, token-based link with fine-grained access control."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* File summary strip */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{file.name}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {formatBytes(file.sizeBytes)} · {file.category.toUpperCase()}
            </p>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
            Tokenized
          </span>
        </div>

        {!generatedLink ? (
          <form onSubmit={handleCreateShare} className="space-y-4">
            {/* Permission Option */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Permission Rights
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPermission('VIEW_AND_DOWNLOAD')}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
                    permission === 'VIEW_AND_DOWNLOAD'
                      ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 ring-1 ring-violet-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Download className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">View & Download</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Recipient can view preview and download file payload.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPermission('VIEW_ONLY')}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
                    permission === 'VIEW_ONLY'
                      ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 ring-1 ring-violet-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Eye className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">View Only</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Download button will be disabled on public page.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Expiration selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Expiration Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '1h', label: '1 Hour' },
                  { id: '24h', label: '24 Hours' },
                  { id: '7d', label: '7 Days' },
                  { id: '30d', label: '30 Days' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExpiryOption(opt.id as any)}
                    className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-all ${
                      expiryOption === opt.id
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Password Protection */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={passwordProtection}
                  onChange={(e) => setPasswordProtection(e.target.checked)}
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Protect link with an access passcode</span>
                </span>
              </label>

              {passwordProtection && (
                <div className="mt-2.5">
                  <input
                    type="password"
                    placeholder="Enter passkey for recipient..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={passwordProtection}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Passcode is evaluated server-side by the Spring Boot backend before generating the download ticket.
                  </p>
                </div>
              )}
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
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Generating Link...' : 'Generate Share Link'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Link Generated Success State */
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs space-y-1">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Temporary Share Link Ready</span>
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                Valid until {new Date(generatedLink.expiresAt).toLocaleString()} ({generatedLink.permission === 'VIEW_ONLY' ? 'View Only' : 'View & Download'})
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Public Share URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getFullShareUrl(generatedLink.token)}
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 select-all"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
              >
                Create Another Link
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
