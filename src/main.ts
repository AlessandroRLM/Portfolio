/**
 * Main entry point for Portfolio
 * Initializes all modules: theme, i18n, reveal, contact form
 */

import './styles/styles.css';

import { initTheme, toggleTheme, updateThemeToggleUI } from './lib/theme';
import { initI18n, toggleLanguage } from './lib/i18n';
import { initReveal } from './lib/reveal';
import { ContactForm } from './components/contactForm';

/**
 * Initialize all application modules
 */
async function initApp(): Promise<void> {
  // Initialize theme (synchronous, runs first to avoid flash)
  initTheme();

  // Initialize i18n (async, loads translations)
  await initI18n();

  // Initialize reveal animations
  initReveal();

  // Initialize contact form
  new ContactForm();

  // Wire up UI interactions
  wireUpEventListeners();
}

/**
 * Wire up all event listeners for navigation, theme, language
 */
function wireUpEventListeners(): void {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navContent = document.querySelector('.nav-content');

  const closeMenu = () => {
    navContent?.classList.remove('is-open');
  };

  menuToggle?.addEventListener('click', () => {
    navContent?.classList.toggle('is-open');
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    toggleTheme();
    updateThemeToggleUI();
  });

  // Language toggle
  const languageToggle = document.getElementById('languageToggle');

  languageToggle?.addEventListener('click', async () => {
    await toggleLanguage();
    updateThemeToggleUI();
  });

  // Smooth scrolling for nav links
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Close mobile menu if open
      closeMenu();

      const href = link.getAttribute('href');
      if (!href) return;

      const targetSection = document.querySelector(href);
      if (targetSection) {
        const offsetTop = (targetSection as HTMLElement).offsetTop - 20;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initApp().then(() => {
    // Initial UI updates after i18n loads
    updateThemeToggleUI();
  });
});