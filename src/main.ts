import { ContactForm } from "./components/contactForm";

interface LanguageState {
    currentLanguage: 'es' | 'en';
}

const languageState: LanguageState = {
    currentLanguage: 'es'
};

function switchLanguage() {
    // Toggle language
    languageState.currentLanguage = languageState.currentLanguage === 'es' ? 'en' : 'es';
    
    // Apply the language changes
    applyLanguage();
    
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', languageState.currentLanguage);
}

// Function to apply the current language state to the UI
function applyLanguage() {
    const currentLang = languageState.currentLanguage;
    
    // Update language toggle buttons
    const languageToggle = document.getElementById('languageToggle');
    const mobileLanguageToggle = document.getElementById('mobileLanguageToggle');
    
    if (languageToggle) {
        languageToggle.textContent = `🌐 ${currentLang === 'es' ? 'ES' : 'EN'}`;
    }
    
    if (mobileLanguageToggle) {
        mobileLanguageToggle.textContent = `🌐 ${currentLang === 'es' ? 'ES' : 'EN'}`;
    }
    
    // Update all elements with data-es and data-en attributes
    const elementsWithTranslation = document.querySelectorAll('[data-es][data-en]');
    elementsWithTranslation.forEach(element => {
        const translatedText = element.getAttribute(`data-${currentLang}`);
        if (translatedText) {
            if (element.tagName === 'SPAN' && element.parentElement) {
                element.textContent = translatedText;
            } else {
                element.textContent = translatedText;
            }
        }
    });
    
    // Update textarea placeholders
    const textareas = document.querySelectorAll('textarea[data-es-placeholder][data-en-placeholder]');
    textareas.forEach(textarea => {
        const translatedPlaceholder = textarea.getAttribute(`data-${currentLang}-placeholder`);
        if (translatedPlaceholder) {
            (textarea as HTMLTextAreaElement).placeholder = translatedPlaceholder;
        }
    });
    
    // Update document language attribute
    document.documentElement.lang = currentLang;
}

document.addEventListener('DOMContentLoaded', function () {
    new ContactForm();
    
    // Load saved language preference if available
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage === 'en') {
        languageState.currentLanguage = 'en';
        applyLanguage();
    }
    
    // Set up language toggle buttons
    const languageToggle = document.getElementById('languageToggle');
    const mobileLanguageToggle = document.getElementById('mobileLanguageToggle');
    
    languageToggle?.addEventListener('click', switchLanguage);
    mobileLanguageToggle?.addEventListener('click', switchLanguage);

    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuToggle?.addEventListener('click', function () {
        mobileMenuToggle?.classList.toggle('active');
        mobileMenu?.classList.toggle('active');
    });

    // Smooth scrolling and active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
            if (!targetId) return;
            const targetSection = document.querySelector(targetId);

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
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll<HTMLElement>('.scroll-offset');
        const scrollPos = window.scrollY + 100;


        sections.forEach(section => {
            const sectionTop = (section as HTMLElement).offsetTop;
            const sectionHeight = (section as HTMLElement).offsetHeight;
            const sectionId = (section as HTMLElement).getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to current section links
                const activeLinks = document.querySelectorAll(`[href="#${sectionId}"]`);
                activeLinks.forEach(link => link.classList.add('active'));
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!navbar?.contains(e.target as Node)) {
            mobileMenuToggle?.classList.remove('active');
            mobileMenu?.classList.remove('active');
        }
    });
});