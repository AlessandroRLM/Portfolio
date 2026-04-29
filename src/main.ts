/**
 * Main entry point for Portfolio
 * Initializes all modules: theme, i18n, reveal, contact form
 */

import { initTheme, toggleTheme, getTheme } from './lib/theme';
import { initI18n, toggleLanguage, getLocale } from './lib/i18n';
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
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    toggleTheme();
    updateThemeToggleUI();
  });

  // Language toggle
  const languageToggle = document.getElementById('languageToggle');
  const mobileLanguageToggle = document.getElementById('mobileLanguageToggle');

  languageToggle?.addEventListener('click', async () => {
    await toggleLanguage();
    updateLanguageToggleUI();
  });

  mobileLanguageToggle?.addEventListener('click', async () => {
    await toggleLanguage();
    updateLanguageToggleUI();
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  mobileMenuToggle?.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
  });

  // Smooth scrolling for nav links
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href) return;

      const targetSection = document.querySelector(href);
      if (targetSection) {
        const offsetTop = (targetSection as HTMLElement).offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }

      // Close mobile menu after click
      mobileMenuToggle?.classList.remove('active');
      mobileMenu?.classList.remove('active');
    });
  });

  // Highlight active section on scroll
  const sections = document.querySelectorAll<HTMLElement>('.scroll-offset');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to current section links
        const activeLinks = document.querySelectorAll<HTMLAnchorElement>(`[href="#${sectionId}"]`);
        activeLinks.forEach(link => link.classList.add('active'));
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as Node;
    if (!navbar?.contains(target)) {
      mobileMenuToggle?.classList.remove('active');
      mobileMenu?.classList.remove('active');
    }
  });
}

/**
 * Update theme toggle button UI
 */
function updateThemeToggleUI(): void {
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    const currentTheme = getTheme();
    themeBtn.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    themeBtn.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

/**
 * Update language toggle button UI
 */
function updateLanguageToggleUI(): void {
  const locale = getLocale();
  const languageToggle = document.getElementById('languageToggle');
  const mobileLanguageToggle = document.getElementById('mobileLanguageToggle');

  const label = locale === 'es' ? 'ES' : 'EN';
  const emoji = '🌐';

  if (languageToggle) {
    languageToggle.textContent = `${emoji} ${label}`;
  }

  if (mobileLanguageToggle) {
    mobileLanguageToggle.textContent = `${emoji} ${label}`;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initApp().then(() => {
    // Initial UI updates after i18n loads
    updateThemeToggleUI();
    updateLanguageToggleUI();
  });
});