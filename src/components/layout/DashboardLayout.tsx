import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DemoBanner } from '../common/DemoBanner';
import { UploadModal } from '../files/UploadModal';
import { useFiles } from '../../context/FileContext';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { uploads } = useFiles();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Top Demo Banner */}
      <DemoBanner />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Viewport */}
        <div
          className={`flex-1 flex flex-col transition-all duration-200 ${
            sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
        >
          <DashboardHeader
            onOpenUpload={() => setUploadModalOpen(true)}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet context={{ onOpenUpload: () => setUploadModalOpen(true) }} />
          </main>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      {/* Floating active upload indicator if any uploads exist */}
      {uploads.length > 0 && (
        <aside
          aria-label="Upload Progress"
          className="fixed bottom-5 right-5 z-40 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3.5 space-y-2 animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 pb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-violet-600" />
              <span>Upload Queue ({uploads.length})</span>
            </span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploads.map((u) => (
              <div key={u.id} className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate max-w-[170px] text-slate-700 dark:text-slate-300">
                    {u.fileName}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {u.status === 'completed' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />
                    ) : u.status === 'failed' ? (
                      <AlertCircle className="w-3 h-3 text-rose-500 inline" />
                    ) : (
                      `${u.progress}%`
                    )}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      u.status === 'completed'
                        ? 'bg-emerald-500'
                        : u.status === 'failed'
                        ? 'bg-rose-500'
                        : 'bg-violet-600'
                    }`}
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};
