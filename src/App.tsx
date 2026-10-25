/**
 * CloudNest — Cloud-Based File Storage and Sharing System
 * "Your Files. Your Space. Your Control."
 *
 * College Cloud Service Management Capstone Project
 * Ready for Java Spring Boot REST API, MySQL database, and AWS S3 storage.
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { FileProvider } from './context/FileContext';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { SecurityPage } from './pages/public/SecurityPage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';
import { PublicSharePage } from './pages/public/PublicSharePage';

// Dashboard & Layout
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { MyFilesPage } from './pages/dashboard/MyFilesPage';
import { RecentFilesPage } from './pages/dashboard/RecentFilesPage';
import { StarredFilesPage } from './pages/dashboard/StarredFilesPage';
import { SharedWithMePage } from './pages/dashboard/SharedWithMePage';
import { SharedByMePage } from './pages/dashboard/SharedByMePage';
import { SecureVaultPage } from './pages/dashboard/SecureVaultPage';
import { TrashPage } from './pages/dashboard/TrashPage';
import { StorageInsightsPage } from './pages/dashboard/StorageInsightsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <FileProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Landing & Informational Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Public Tokenized Share Route */}
                <Route path="/share/:token" element={<PublicSharePage />} />

                {/* Protected Application Workspace */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardOverviewPage />} />
                  <Route path="files" element={<MyFilesPage />} />
                  <Route path="recent" element={<RecentFilesPage />} />
                  <Route path="starred" element={<StarredFilesPage />} />
                  <Route path="shared-with-me" element={<SharedWithMePage />} />
                  <Route path="shared-by-me" element={<SharedByMePage />} />
                  <Route path="vault" element={<SecureVaultPage />} />
                  <Route path="trash" element={<TrashPage />} />
                  <Route path="insights" element={<StorageInsightsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </FileProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
