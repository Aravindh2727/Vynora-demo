/**
 * Vynora Application Mode Manager
 * Controls whether Vynora runs in:
 * 1. PRODUCTION MODE (VITE_APP_MODE=production): Real Firebase Auth, Firestore, Cloudinary.
 * 2. DEMO MODE (VITE_APP_MODE=demo): Isolated, fully-populated demo environment
 *    with zero external dependencies, realistic data, and full interactivity.
 */

export type AppMode = 'demo' | 'production';

// Safe fictional recruiter persona for Demo Mode
export const DEMO_USER = {
  id: 'demo_user_recruiter_01',
  name: 'Alex Morgan',
  email: 'alex.morgan@vynora.demo',
  displayName: 'Alex Morgan',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA / Bengaluru, IN',
  role: 'Executive Persona',
  avatarUrl: '/vynora_icon_circle.png',
  isDemoUser: true
};

const MODE_STORAGE_KEY = 'vynora_app_mode';

/**
 * Determine the current application mode:
 * - Checks localStorage override first (allows on-the-fly recruiter toggling).
 * - Checks query parameter (?mode=demo or ?mode=production).
 * - Defaults to VITE_APP_MODE environment variable.
 * - If not configured, defaults safely to 'demo' to prevent unauthorized/broken startup.
 */
export function getAppMode(): AppMode {
  // 1. Check URL search param override (e.g. for direct recruiter links)
  if (typeof window !== 'undefined' && window.location) {
    const params = new URLSearchParams(window.location.search);
    const paramMode = params.get('mode')?.toLowerCase();
    if (paramMode === 'production' || paramMode === 'demo') {
      return paramMode as AppMode;
    }
  }

  // 2. Check localStorage override
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === 'production' || stored === 'demo') {
      return stored as AppMode;
    }
  }

  // 3. Check Vite environment variable
  const envMode = (import.meta.env.VITE_APP_MODE || '').toLowerCase().trim();
  if (envMode === 'production') {
    return 'production';
  }

  // Safe default: demo mode for instant recruiter review
  return 'demo';
}

/**
 * Set the application mode and trigger a reload if needed
 */
export function setAppMode(mode: AppMode) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }
}

/**
 * Convenience helper to test if running in Demo Mode
 */
export function isDemoMode(): boolean {
  return getAppMode() === 'demo';
}

/**
 * Convenience helper to test if running in Production Mode
 */
export function isProductionMode(): boolean {
  return getAppMode() === 'production';
}

