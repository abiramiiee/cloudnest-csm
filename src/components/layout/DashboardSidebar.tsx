import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { formatBytes } from '../../utils/fileCategorizer';
import {
  LayoutDashboard,
  FolderOpen,
  Clock,
  Star,
  Users,
  Share2,
  ShieldAlert,
  Trash2,
  PieChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HardDrive,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'My Files', path: '/app/files', icon: FolderOpen },
    { label: 'Recent Files', path: '/app/recent', icon: Clock },
    { label: 'Starred Files', path: '/app/starred', icon: Star },
    { label: 'Shared With Me', path: '/app/shared-with-me', icon: Users },
    { label: 'Shared By Me', path: '/app/shared-by-me', icon: Share2 },
    { label: 'Secure Vault', path: '/app/vault', icon: ShieldAlert },
    { label: 'Trash', path: '/app/trash', icon: Trash2 },
    { label: 'Storage Insights', path: '/app/insights', icon: PieChart },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const storageUsed = user?.storageUsedBytes || 3.4 * 1024 * 1024 * 1024;
  const storageQuota = user?.storageQuotaBytes || 15 * 1024 * 1024 * 1024;
  const usagePercent = Math.min(100, Math.round((storageUsed / storageQuota) * 100));

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 select-none ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="overflow-hidden whitespace-nowrap">
            {collapsed ? (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center text-white shadow-sm font-bold text-lg">
                CN
              </div>
            ) : (
              <Logo size="sm" showTagline={false} />
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  } ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Storage Summary Mini Widget */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>Storage</span>
              </span>
              <span className="font-mono text-[11px] font-semibold">{usagePercent}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
              {formatBytes(storageUsed)} of {formatBytes(storageQuota)} used
            </p>
          </div>
        )}

        {/* Footer with user info & logout */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors ${
              collapsed ? 'justify-center px-2' : ''
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
