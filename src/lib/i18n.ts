/**
 * Internationalization module
 * Handles language switching with localStorage persistence
 * using bundled JSON translation files
 */

import esTranslations from "../i18n/es.json";
import enTranslations from "../i18n/en.json";

/**
 * Const Types Pattern for Locales
 */
export const LOCALE = {
  ES: "es",
  EN: "en",
} as const;

export type Locale = (typeof LOCALE)[keyof typeof LOCALE];

/**
 * Type-safe translation storage
 */
export type Translations = Record<string, string>;

const TRANSLATIONS: Record<Locale, Translations> = {
  [LOCALE.ES]: esTranslations as Translations,
  [LOCALE.EN]: enTranslations as Translations,
};

const STORAGE_KEY = "portfolio-locale";

let currentLocale: Locale = LOCALE.ES;
let isInitialized = false;

/**
 * Get stored locale from localStorage
 * Falls back to Spanish
 */
function getStoredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === LOCALE.ES || stored === LOCALE.EN) {
    return stored;
  }
  return LOCALE.ES;
}

/**
 * Get current locale
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Translate a key
 * @param key - Key in translation files
 * @param fallback - Optional fallback if key not found
 */
export function t(key: string, fallback?: string): string {
  const translations = TRANSLATIONS[currentLocale];
  if (translations && translations[key]) {
    return translations[key];
  }

  return fallback || key;
}

/**
 * Set locale and update all translatable elements
 */
export async function setLocale(locale: Locale): Promise<void> {
  currentLocale = locale;
  document.documentElement.lang = locale;
  localStorage.setItem(STORAGE_KEY, locale);

  // Update all elements with data-i18n attribute
  updateDOMTranslations();
}

/**
 * Update all DOM elements with translations
 */
export function updateDOMTranslations(): void {
  // Update standard text elements
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      const translated = t(key);
      if (translated !== key) {
        el.textContent = translated;
      }
    }
  });

  // Update placeholders
  document
    .querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >("[data-i18n-placeholder]")
    .forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) {
        const translated = t(key);
        if (translated !== key) {
          el.placeholder = translated;
        }
      }
    });

  // Update legacy data-es/data-en attributes for compatibility
  document.querySelectorAll<HTMLElement>("[data-es][data-en]").forEach((el) => {
    const translatedText = el.getAttribute(`data-${currentLocale}`);
    if (translatedText) {
      el.textContent = translatedText;
    }
  });

  // Update language toggle buttons text (show destination language)
  const languageToggle = document.getElementById("languageToggle");
  if (languageToggle) {
    languageToggle.textContent = currentLocale === LOCALE.ES ? "ES" : "EN";
  }
}

/**
 * Initialize i18n on page load
 */
export async function initI18n(): Promise<void> {
  if (isInitialized) return;

  const stored = getStoredLocale();
  await setLocale(stored);
  isInitialized = true;
}

/**
 * Toggle between Spanish and English
 */
export async function toggleLanguage(): Promise<Locale> {
  const next = currentLocale === LOCALE.ES ? LOCALE.EN : LOCALE.ES;
  await setLocale(next);
  return next;
}
