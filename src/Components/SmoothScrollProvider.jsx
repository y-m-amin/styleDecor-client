import { useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LenisContext } from '../context/LenisContext';
import { useLenis } from '../hooks/useLenis';

/**
 * SmoothScrollProvider Component
 *
 * Wraps Lenis initialization in a provider, synchronizes with Framer Motion
 * scroll tracking, and adds reduced motion detection.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} props.options - Lenis configuration options
 * @returns {JSX.Element}
 *
 * @example
 * <SmoothScrollProvider options={{ duration: 1.5 }}>
 *   <App />
 * </SmoothScrollProvider>
 */
export function SmoothScrollProvider({ children, options = {} }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lenisInstance, setLenisInstance] = useState(null);
  const lenisRef = useLenis(reducedMotion ? { smooth: false } : options);

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll();

  // Update lenisInstance state when ref changes
  useEffect(() => {
    setLenisInstance(lenisRef.current);
  }, [lenisRef]);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Synchronize Lenis with Framer Motion scroll tracking
  useEffect(() => {
    if (!lenisRef.current) return;

    const lenis = lenisRef.current;

    // Update Framer Motion scroll progress when Lenis scrolls
    const unsubscribe = lenis.on('scroll', ({ scroll, limit }) => {
      // Framer Motion's scrollYProgress expects values between 0 and 1
      const progress = scroll / limit;

      // Note: Framer Motion's useScroll hook automatically tracks scroll position
      // This synchronization ensures smooth coordination between Lenis and Framer Motion
      if (scrollYProgress && typeof scrollYProgress.set === 'function') {
        scrollYProgress.set(progress);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [lenisRef, scrollYProgress]);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
