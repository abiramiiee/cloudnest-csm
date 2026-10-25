import React, { useState, useEffect } from 'react';
import { sharingService } from '../../services/sharingService';
import { ShareLink } from '../../types';
import { formatBytes, formatDate } from '../../utils/fileCategorizer';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Share2,
  Copy,
  Check,
  Ban,
  Clock,
  Lock,
  ExternalLink,
  Eye,
  Download,
  AlertCircle,
} from 'lucide-react';

export const SharedByMePage: React.FC = () => {
  const [shares, setShares] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadShares = async () => {
    setLoading(true);
    try {
      const data = await sharingService.getCreatedShares();
      setShares(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShares();
  }, []);

  const handleCopyLink = (share: ShareLink) => {
    const fullUrl = `${window.location.origin}/share/${share.token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(share.id);
    showToast('Public link copied to clipboard', { type: 'success' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = async (share: ShareLink) => {
    try {
      await sharingService.revokeShare(share.id);
      await loadShares();
      showToast(`Revoked share link for "${share.fileName}"`, { type: 'info' });
    } catch (err: any) {
      showToast(err.message, { type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-violet-600" />
            <span>Shared By Me</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Active and expired temporary share tokens generated for your files
          </p>
        </div>
      </div>

      {shares.length === 0 ? (
        <EmptyState
          icon={Share2}
          title="No share links generated yet"
          description="Go to My Files, click 'Share Link' on any item, and generate a temporary token to collaborate."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Permission</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Passcode</th>
                  <th className="py-3 px-4">Expires</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shares.map((share) => {
                  const isExpired = share.isExpired || new Date(share.expiresAt).getTime() < Date.now();
                  const isRevoked = share.isRevoked;

                  return (
                    <tr
                      key={share.id}
                      className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-xs">{share.fileName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({formatBytes(share.fileSize)})
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {share.permission === 'VIEW_ONLY' ? 'VIEW ONLY' : 'VIEW & DOWNLOAD'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isRevoked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded font-semibold">
                            <Ban className="w-3 h-3" />
                            <span>REVOKED</span>
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded font-semibold">
                            <Clock className="w-3 h-3" />
                            <span>EXPIRED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-semibold">
                            <span>ACTIVE</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {share.hasPassword ? (
                          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                            <Lock className="w-3.5 h-3.5 text-violet-600" />
                            <span>Required</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                        {formatDate(share.expiresAt)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-400">
                        {share.accessCount || 0}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isRevoked && !isExpired && (
                            <button
                              onClick={() => handleCopyLink(share)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                              title="Copy URL"
                            >
                              {copiedId === share.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-500" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          )}

                          <a
                            href={`/share/${share.token}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Open recipient preview in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {!isRevoked && (
                            <button
                              onClick={() => handleRevoke(share)}
                              className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Revoke access token immediately"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
