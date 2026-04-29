/**
 * Theme management module
 * Handles light/dark theme toggle with localStorage persistence
 * and system preference detection
 */

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'portfolio-theme';

/**
 * Get the stored theme from localStorage
 * Falls back to system preference if no stored value
 */
function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  // Fallback to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Get current theme (reflects what's applied to the DOM)
 */
function getTheme(): Theme {
  const current = document.documentElement.getAttribute('data-theme');
  return (current === 'dark' ? 'dark' : 'light');
}

/**
 * Apply theme to the document
 */
function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Initialize theme on page load
 * Reads stored preference or detects system preference
 */
function initTheme(): void {
  const theme = getStoredTheme();
  applyTheme(theme);
  
  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't set a preference
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

/**
 * Toggle between light and dark theme
 * Returns the new theme
 */
function toggleTheme(): Theme {
  const current = getTheme();
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  return next;
}

export type { Theme };
export { initTheme, toggleTheme, getTheme, getStoredTheme, applyTheme };