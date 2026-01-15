import Lenis from '@studio-freight/lenis';
import { useEffect, useRef } from 'react';

/**
 * Custom hook for Lenis smooth scroll integration
 *
 * Initializes Lenis with configuration options, handles cleanup on unmount,
 * and exposes the Lenis instance via ref.
 *
 * @param {Object} options - Lenis configuration options
 * @param {number} options.duration - Scroll duration (default: 1.2)
 * @param {Function} options.easing - Easing function (default: easeOutCubic)
 * @param {boolean} options.smooth - Enable smooth scrolling (default: true)
 * @param {boolean} options.smoothTouch - Enable smooth scrolling on touch devices (default: false)
 * @param {number} options.touchMultiplier - Touch scroll multiplier (default: 2)
 * @param {boolean} options.infinite - Enable infinite scrolling (default: false)
 * @returns {React.RefObject} Ref containing the Lenis instance
 *
 * @example
 * const lenisRef = useLenis({ duration: 1.5, smooth: true });
 * // Access instance: lenisRef.current.scrollTo(0)
 */
export function useLenis(options = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Default configuration
    const defaultOptions = {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutCubic
      smooth: true,
      smoothTouch: false, // Better mobile performance
      touchMultiplier: 2,
      infinite: false,
      ...options,
    };

    // Initialize Lenis
    try {
      const lenis = new Lenis(defaultOptions);
      lenisRef.current = lenis;

      // Animation frame loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Cleanup on unmount
      return () => {
        lenis.destroy();
        lenisRef.current = null;
      };
    } catch (error) {
      console.warn('Failed to initialize Lenis:', error);
      // Fallback to native scroll - no action needed
    }
  }, [options]);

  return lenisRef;
}
