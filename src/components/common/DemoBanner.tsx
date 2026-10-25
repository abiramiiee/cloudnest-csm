import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Server, RefreshCw, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { API_CONFIG } from '../../config/apiConfig';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, isBackendOnline, checkBackendStatus } = useAuth();
  const [checking, setChecking] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleRecheck = async () => {
    setChecking(true);
    await checkBackendStatus();
    setChecking(false);
  };

  if (!isDemoMode && isBackendOnline) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/50 px-4 py-1.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Spring Boot Backend Connected: <strong>{API_CONFIG.baseUrl}</strong> (MySQL & S3 Active)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-purple-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/30 border-b border-amber-200/60 dark:border-slate-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono font-semibold text-[11px] bg-amber-200/70 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300/80 dark:border-amber-800">
            DEMO MODE
          </span>
          <span className="text-slate-600 dark:text-slate-300">
            Backend currently unlinked. Using interactive sample workspace for CSM Project evaluation.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline font-medium cursor-pointer"
          >
            {detailsOpen ? 'Hide Integration Details' : 'Backend Target Info'}
          </button>

          <button
            onClick={handleRecheck}
            disabled={checking}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{checking ? 'Checking...' : 'Check Spring Boot'}</span>
          </button>
        </div>
      </div>

      {detailsOpen && (
        <div className="mt-2 pt-2 border-t border-amber-200/50 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-start gap-2">
            <Server className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">Target REST API</p>
              <p className="font-mono text-[10px] text-slate-500">{API_CONFIG.baseUrl}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">Database & Storage</p>
              <p>MySQL schema ready · Amazon S3 bucket integration mapped</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">Local Testing</p>
              <p>Run your Spring Boot service on port 8080 to switch live.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
