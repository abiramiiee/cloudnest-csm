/**
 * Central API Configuration
 * Supports Java Spring Boot target endpoint with automated graceful fallback to Demo Mode.
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeoutMs: 5000,
  defaultStorageQuota: 15 * 1024 * 1024 * 1024, // 15 GB default quota
  appName: 'CloudNest',
  tagline: 'Your Files. Your Space. Your Control.',
  collegeCourse: 'Cloud Service Management Project',
};
