import React, { useState, useEffect } from 'react';
import { insightsService } from '../../services/insightsService';
import { fileService } from '../../services/fileService';
import { StorageInsights, FileItem } from '../../types';
import { formatBytes, formatDate } from '../../utils/fileCategorizer';
import { useAuth } from '../../context/AuthContext';
import {
  PieChart,
  HardDrive,
  BarChart3,
  TrendingUp,
  FileText,
  Download,
  Database,
  Layers,
} from 'lucide-react';

export const StorageInsightsPage: React.FC = () => {
  const { isDemoMode } = useAuth();
  const [insights, setInsights] = useState<StorageInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      try {
        const data = await insightsService.getStorageInsights();
        setInsights(data);
      } finally {
        setLoading(false);
      }
    };
    loadInsights();
  }, []);

  if (!insights) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const freeBytes = Math.max(0, insights.quotaBytes - insights.totalUsedBytes);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-violet-600" />
          <span>Storage Usage Insights</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Visual capacity telemetry, category distribution, and consumption trends
        </p>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Space Used</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
            {formatBytes(insights.totalUsedBytes)}
          </p>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-violet-600 h-full rounded-full"
              style={{ width: `${insights.usagePercentage}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Available Space</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-1">
            {formatBytes(freeBytes)}
          </p>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {Math.round(100 - insights.usagePercentage)}% of quota free
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Account Quota</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
            {formatBytes(insights.quotaBytes)}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Managed via Spring Boot role configuration
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Cataloged Objects</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
            {insights.fileCount} <span className="text-sm font-normal text-slate-400">files</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Across {insights.folderCount} organized directories
          </p>
        </div>
      </div>

      {/* Category Breakdown & Monthly Upload Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-600" />
              <span>Category-Wise Storage Usage</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Deterministic MIME Filter</span>
          </div>

          <div className="space-y-3.5">
            {insights.categoryBreakdown.map((cat) => {
              const catPercent = insights.totalUsedBytes > 0 ? (cat.bytes / insights.totalUsedBytes) * 100 : 0;
              return (
                <div key={cat.category} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-md shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({cat.count} files)</span>
                    </div>
                    <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums font-semibold">
                      {formatBytes(cat.bytes)} ({Math.round(catPercent)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(2, catPercent)}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Upload Activity */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Upload Volume Trajectory</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">2026 Monthly (MB)</span>
          </div>

          <div className="flex items-end justify-between h-48 pt-6 pb-2 px-2">
            {insights.monthlyUploadActivity.map((m) => {
              const maxMB = 2500;
              const heightPercent = Math.min(100, (m.sizeMB / maxMB) * 100);
              return (
                <div key={m.month} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {m.sizeMB}M
                  </span>
                  <div className="w-8 sm:w-10 bg-slate-100 dark:bg-slate-800 rounded-t-xl h-32 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-xl transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Upload activity accelerating as CSM final project submission approaches.
          </p>
        </div>
      </div>

      {/* Largest Files Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Largest Stored Files</h2>
            <p className="text-[11px] text-slate-500">Top candidates for quota reclamation</p>
          </div>
          <span className="text-[11px] font-mono text-violet-600">Top 5 by Size</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">File Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Uploaded</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {insights.largestFiles.map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-violet-500 shrink-0" />
                      <span className="truncate max-w-xs">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500 capitalize">{file.category}</td>
                  <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200 tabular-nums font-bold">
                    {formatBytes(file.sizeBytes)}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 tabular-nums">
                    {formatDate(file.uploadedAt)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => fileService.downloadFile(file)}
                      className="p-1.5 text-slate-500 hover:text-violet-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
