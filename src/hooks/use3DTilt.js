import { useCallback, useState } from 'react';

/**
 * Custom hook for 3D tilt effect based on mouse position
 *
 * Calculates 3D rotation values (rotateX, rotateY) based on mouse position
 * relative to the element. Creates an interactive tilt effect that follows
 * the cursor.
 *
 * @param {number} intensity - Tilt intensity multiplier (default: 10)
 * @returns {Object} Tilt state and event handlers
 * @returns {Object} return.tilt - Current tilt values { rotateX, rotateY }
 * @returns {Function} return.handleMouseMove - Mouse move event handler
 * @returns {Function} return.handleMouseEnter - Mouse enter event handler
 * @returns {Function} return.handleMouseLeave - Mouse leave event handler
 *
 * @example
 * const { tilt, handleMouseMove, handleMouseEnter, handleMouseLeave } = use3DTilt(15);
 *
 * <div
 *   onMouseMove={handleMouseMove}
 *   onMouseEnter={handleMouseEnter}
 *   onMouseLeave={handleMouseLeave}
 *   style={{
 *     transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
 *   }}
 * >
 *   Content
 * </div>
 */
export function use3DTilt(intensity = 10) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  /**
   * Calculate 3D tilt based on mouse position
   * @param {MouseEvent} e - Mouse event
   * @param {HTMLElement} element - Target element
   * @returns {Object} Calculated tilt values { rotateX, rotateY }
   */
  const calculate3DTilt = useCallback(
    (e, element) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation based on distance from center
      // Negative rotateX for natural tilt (top = tilt back, bottom = tilt forward)
      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;

      return { rotateX, rotateY };
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

      const newTilt = calculate3DTilt(e, element);
      setTilt(newTilt);
    },
    [calculate3DTilt]
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
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return {
    tilt,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
}
