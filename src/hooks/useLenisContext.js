import { useContext } from 'react';
import { LenisContext } from '../context/LenisContext';

/**
 * Hook to access Lenis instance from context
 * @returns {Object|null} Lenis instance or null
 */
export function useLenisContext() {
  return useContext(LenisContext);
}
