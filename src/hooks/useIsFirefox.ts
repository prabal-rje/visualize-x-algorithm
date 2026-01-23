/**
 * Detect Firefox browser synchronously.
 * Safe for browser - navigator is available during module init.
 */
export function useIsFirefox(): boolean {
  // Check synchronously - this runs in the browser where navigator exists
  if (typeof navigator === 'undefined') return false;
  return /Firefox/i.test(navigator.userAgent);
}
