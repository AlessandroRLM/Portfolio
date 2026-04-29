/**
 * Reveal animations module
 * Uses Intersection Observer to trigger animations on scroll
 */

interface RevealConfig {
  threshold?: number;
  rootMargin?: string;
  unobserveOnEnter?: boolean;
}

const DEFAULT_CONFIG: RevealConfig = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px',
  unobserveOnEnter: false
};

let revealObserver: IntersectionObserver | null = null;

/**
 * Initialize reveal animations
 * @param config - Optional configuration overrides
 */
function initReveal(config: RevealConfig = {}): void {
  const options: RevealConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Create the Intersection Observer
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add the 'in' class to trigger the animation
          entry.target.classList.add('in');
          
          // Optionally stop observing after reveal
          if (options.unobserveOnEnter && revealObserver) {
            revealObserver.unobserve(entry.target);
          }
        }
      });
    },
    {
      threshold: options.threshold,
      rootMargin: options.rootMargin
    }
  );
  
  // Get all elements with .reveal class
  const revealElements = document.querySelectorAll('.reveal');
  
  // Apply to each element
  revealElements.forEach(el => {
    // Check if already in viewport (above the fold)
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      // Already visible - apply immediately
      el.classList.add('in');
    } else {
      // Not visible - observe for scroll
      revealObserver?.observe(el);
    }
  });
  
  // Also set up a one-time check for elements that become visible immediately
  // This handles elements that may have been below fold but are now visible after layout
  observeRevealElements();
}

/**
 * Observe all reveal elements
 * Call this after DOM changes or new content loaded
 */
function observeRevealElements(): void {
  if (!revealObserver) return;
  
  const revealElements = document.querySelectorAll('.reveal:not(.in)');
  revealElements.forEach(el => {
    revealObserver?.observe(el);
  });
}

/**
 * Reveal a specific element manually
 */
function revealElement(element: HTMLElement): void {
  element.classList.add('in');
  revealObserver?.unobserve(element);
}

/**
 * Reset reveal state (useful for SPA route changes)
 */
function resetReveal(): void {
  const revealed = document.querySelectorAll('.reveal.in');
  revealed.forEach(el => {
    el.classList.remove('in');
  });
  
  // Re-observe all elements
  observeRevealElements();
}

/**
 * Destroy the reveal observer
 */
function destroyReveal(): void {
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }
}

/**
 * Get current reveal config
 */
function getRevealObserver(): IntersectionObserver | null {
  return revealObserver;
}

export type { RevealConfig };
export { initReveal, observeRevealElements, revealElement, resetReveal, destroyReveal, getRevealObserver };