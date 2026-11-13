/**
 * Vynora Application Mode Manager — Dedicated Demo Mode
 *
 * Configured exclusively for Recruiter and Portfolio Demonstration.
 * Runs completely in-browser with zero external dependencies, realistic
 * sample datasets, and persistent local storage.
 */

export type AppMode = 'demo';

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

/**
 * Permanently returns 'demo' mode
 */
export function getAppMode(): AppMode {
  return 'demo';
}

/**
 * Application mode setter (no-op in demo-only build)
 */
export function setAppMode(_mode?: string) {
  // Demo mode is permanent in this showcase repository
}

/**
 * Always returns true: Demo Mode is active
 */
export function isDemoMode(): boolean {
  return true;
}

/**
 * Always returns false: Production mode is removed
 */
export function isProductionMode(): boolean {
  return false;
}
