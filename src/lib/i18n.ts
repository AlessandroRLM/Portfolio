/**
 * Internationalization module
 * Handles language switching with localStorage persistence
 * and JSON translation files
 */

type Locale = 'es' | 'en';
type Translations = Record<string, string>;

const STORAGE_KEY = 'portfolio-locale';

let currentLocale: Locale = 'es';
let translations: Translations = {};
let translationsLoaded = false;

/**
 * Get stored locale from localStorage
 * Falls back to Spanish
 */
function getStoredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'es' || stored === 'en') {
    return stored;
  }
  return 'es';
}

/**
 * Get current locale
 */
function getLocale(): Locale {
  return currentLocale;
}

/**
 * Load translations for a locale
 */
async function loadTranslations(locale: Locale): Promise<void> {
  try {
    const response = await fetch(`/src/i18n/${locale}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations: ${response.status}`);
    }
    translations = await response.json();
    currentLocale = locale;
    translationsLoaded = true;
    
    // Update HTML lang attribute
    document.documentElement.lang = locale;
  } catch (error) {
    console.error('Error loading translations:', error);
    // Keep existing translations if fetch fails
    if (!translationsLoaded && locale === 'es') {
      // Fallback to inline translations (minimal set)
      translations = getInlineTranslations();
      translationsLoaded = true;
    }
  }
}

/**
 * Get inline fallback translations (minimal set for offline/error cases)
 */
function getInlineTranslations(): Translations {
  return {
    'nav.inicio': currentLocale === 'es' ? 'Inicio' : 'Home',
    'nav.fortalezas': currentLocale === 'es' ? 'Fortalezas' : 'Strengths',
    'nav.habilidades': currentLocale === 'es' ? 'Habilidades' : 'Skills',
    'nav.proyectos': currentLocale === 'es' ? 'Proyectos' : 'Projects',
    'nav.contacto': currentLocale === 'es' ? 'Contacto' : 'Contact',
    'form.success': currentLocale === 'es' ? 'Mensaje enviado' : 'Message sent',
    'form.error': currentLocale === 'es' ? 'Error al enviar' : 'Error sending'
  };
}

/**
 * Translate a key
 * @param key - Dot-notation key (e.g., 'nav.inicio')
 * @param fallback - Optional fallback if key not found
 */
function t(key: string, fallback?: string): string {
  if (translations[key]) {
    return translations[key];
  }
  
  return fallback || key;
}

/**
 * Set locale and update all translatable elements
 */
async function setLocale(locale: Locale): Promise<void> {
  await loadTranslations(locale);
  localStorage.setItem(STORAGE_KEY, locale);
  
  // Update all elements with data-i18n attribute
  updateDOMTranslations();
}

/**
 * Update all DOM elements with translations
 */
function updateDOMTranslations(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const translated = t(key);
      if (translated !== key) {
        el.textContent = translated;
      }
    }
  });
  
  // Update placeholders
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      const translated = t(key);
      if (translated !== key) {
        el.placeholder = translated;
      }
    }
  });
  
  // Also update legacy data-es/data-en attributes for compatibility
  const allElements = document.querySelectorAll<HTMLElement>('[data-es][data-en]');
  const currentLang = currentLocale;
  
  allElements.forEach(el => {
    const translatedText = el.getAttribute(`data-${currentLang}`);
    if (translatedText) {
      el.textContent = translatedText;
    }
  });
  
  // Update legacy placeholders
  const textareas = document.querySelectorAll<HTMLTextAreaElement>('textarea[data-es-placeholder][data-en-placeholder]');
  textareas.forEach(textarea => {
    const translatedPlaceholder = textarea.getAttribute(`data-${currentLang}-placeholder`);
    if (translatedPlaceholder) {
      textarea.placeholder = translatedPlaceholder;
    }
  });
  
  const inputs = document.querySelectorAll<HTMLInputElement>('input[data-es-placeholder][data-en-placeholder]');
  inputs.forEach(input => {
    const translatedPlaceholder = input.getAttribute(`data-${currentLang}-placeholder`);
    if (translatedPlaceholder) {
      input.placeholder = translatedPlaceholder;
    }
  });
  
  // Update language toggle buttons
  const languageToggle = document.getElementById('languageToggle');
  const mobileLanguageToggle = document.getElementById('mobileLanguageToggle');
  
  if (languageToggle) {
    languageToggle.textContent = `🌐 ${currentLocale === 'es' ? 'ES' : 'EN'}`;
  }
  
  if (mobileLanguageToggle) {
    mobileLanguageToggle.textContent = `🌐 ${currentLocale === 'es' ? 'ES' : 'EN'}`;
  }
}

/**
 * Initialize i18n on page load
 */
async function initI18n(): Promise<void> {
  const stored = getStoredLocale();
  await loadTranslations(stored);
  updateDOMTranslations();
}

/**
 * Toggle between Spanish and English
 */
async function toggleLanguage(): Promise<Locale> {
  const next = currentLocale === 'es' ? 'en' : 'es';
  await setLocale(next);
  return next;
}

export type { Locale, Translations };
export { initI18n, setLocale, toggleLanguage, t, getLocale, updateDOMTranslations };