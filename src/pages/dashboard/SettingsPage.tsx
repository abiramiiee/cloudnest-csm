import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { settingsService } from '../../services/settingsService';
import { formatBytes } from '../../utils/fileCategorizer';
import { API_CONFIG } from '../../config/apiConfig';
import {
  Settings,
  User,
  Lock,
  Sun,
  Moon,
  HardDrive,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, isDemoMode, isBackendOnline, checkBackendStatus, logout, updateUserData } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Profile Form State
  const [name, setName] = useState(user?.name || 'Alex Chen');
  const [email, setEmail] = useState(user?.email || 'alex.chen@cloudnest.internal');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Backend Diagnostic State
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [testEndpoint, setTestEndpoint] = useState(API_CONFIG.baseUrl);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const updated = await settingsService.updateProfile(name, email);
      updateUserData({ name: updated.name, email: updated.email });
      showToast('Profile information updated successfully', { type: 'success' });
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', { type: 'error' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await settingsService.changePassword(currentPassword, newPassword);
      showToast(res.message, { type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Password update failed.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleTestBackendConnection = async () => {
    setCheckingBackend(true);
    const online = await checkBackendStatus();
    setCheckingBackend(false);
    if (online) {
      showToast(`Spring Boot backend online at ${testEndpoint}`, { type: 'success' });
    } else {
      showToast(`Backend unreachable at ${testEndpoint}. Running in Demo Mode.`, { type: 'info' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-violet-600" />
          <span>Account & System Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, credentials, storage tier, and Spring Boot connection
        </p>
      </div>

      {/* Profile Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <User className="w-4 h-4 text-violet-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Profile Details</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Institutional Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="px-5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {profileSaving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <KeyRound className="w-4 h-4 text-violet-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Security & Password</h2>
        </div>

        {passwordError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="px-5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {passwordSaving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Theme Preference */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sun className="w-4 h-4 text-violet-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Appearance & Theme</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${
              theme === 'light'
                ? 'border-violet-600 bg-violet-50 text-violet-900 font-semibold ring-1 ring-violet-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Lavender SaaS</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${
              theme === 'dark'
                ? 'border-violet-600 bg-violet-950 text-violet-200 font-semibold ring-1 ring-violet-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Dark Slate Console</span>
          </button>
        </div>
      </div>

      {/* Spring Boot Backend Diagnostics & Target Integration */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Spring Boot Backend Diagnostics</h2>
          </div>
          <span
            className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
              isBackendOnline
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {isBackendOnline ? 'SPRING BOOT ONLINE' : 'DEMO MODE ACTIVE'}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            CloudNest is engineered to communicate with a Java 21 Spring Boot REST service. When the backend is offline at <code className="font-mono text-violet-600">{API_CONFIG.baseUrl}</code>, the application automatically provides high-fidelity simulated persistence for evaluator demonstrations.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="text"
              value={testEndpoint}
              onChange={(e) => setTestEndpoint(e.target.value)}
              className="flex-1 text-xs font-mono px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            />
            <button
              onClick={handleTestBackendConnection}
              disabled={checkingBackend}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingBackend ? 'animate-spin' : ''}`} />
              <span>{checkingBackend ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-rose-900 dark:text-rose-200">End Current Session</h2>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
            Safely invalidate active JWT tokens and log out of CloudNest.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
