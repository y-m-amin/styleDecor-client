import { useCallback, useState } from 'react';

/**
 * Custom hook for magnetic tilt effect
 *
 * Creates a smooth magnetic tilt effect where the element tilts toward
 * the cursor position with spring-like physics. The effect is more subtle
 * than 3D tilt and creates a "magnetic attraction" feel.
 *
 * @param {number} intensity - Tilt intensity multiplier (default: 15)
 * @returns {Object} Magnetic tilt state and event handlers
 * @returns {Object} return.tilt - Current tilt values { x, y }
 * @returns {Function} return.handleMouseMove - Mouse move event handler
 * @returns {Function} return.handleMouseEnter - Mouse enter event handler
 * @returns {Function} return.handleMouseLeave - Mouse leave event handler
 *
 * @example
 * const { tilt, handleMouseMove, handleMouseEnter, handleMouseLeave } = useMagneticTilt(20);
 *
 * <motion.div
 *   onMouseMove={handleMouseMove}
 *   onMouseEnter={handleMouseEnter}
 *   onMouseLeave={handleMouseLeave}
 *   animate={{
 *     rotateX: tilt.x,
 *     rotateY: tilt.y,
 *   }}
 *   transition={{
 *     type: 'spring',
 *     stiffness: 150,
 *     damping: 15,
 *   }}
 * >
 *   Content
 * </motion.div>
 */
export default function useMagneticTilt(intensity = 15) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  /**
   * Calculate magnetic tilt effect
   * @param {MouseEvent} e - Mouse event
   * @param {HTMLElement} element - Target element
   * @returns {Object} Calculated tilt values { x, y }
   */
  const calculateMagneticTilt = useCallback(
    (e, element) => {
      const rect = element.getBoundingClientRect();

      // Calculate mouse position relative to element center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Normalize to -1 to 1 range based on element dimensions
      const normalizedX = mouseX / (rect.width / 2);
      const normalizedY = mouseY / (rect.height / 2);

      // Apply intensity and create tilt values
      // x controls rotateX (vertical tilt), y controls rotateY (horizontal tilt)
      const x = normalizedY * intensity * -1; // Inverted for natural feel
      const y = normalizedX * intensity;

      return { x, y };
    },
    [intensity]
  );

  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback(
    (e) => {
      const element = e.currentTarget;
      if (!element) return;

      const newTilt = calculateMagneticTilt(e, element);
      setTilt(newTilt);
    },
    [calculateMagneticTilt]
  );

  /**
   * Handle mouse enter event
   */
  const handleMouseEnter = useCallback(() => {
    // Optional: Can be used for additional effects on hover start
  }, []);

  /**
   * Handle mouse leave event - reset tilt to neutral position
   */
  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return {
    tilt,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
}
