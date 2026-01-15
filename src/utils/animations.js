/**
 * Shared Animation Utilities
 *
 * This file contains reusable animation variants, easing functions,
 * and animation constants for use across the application.
 */

// ============================================================================
// Easing Functions
// ============================================================================

/**
 * Cubic ease-out function for smooth deceleration
 */
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Cubic ease-in-out function for smooth acceleration and deceleration
 */
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Custom ease for smooth, natural motion
 */
export const customEase = [0.22, 1, 0.36, 1];

// ============================================================================
// Animation Variants
// ============================================================================

/**
 * Fade up animation with scale
 * Usage: Apply to elements that should fade in from below
 */
export const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: i * 0.15,
      ease: customEase,
    },
  }),
};

/**
 * Fade in animation (simple opacity)
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Slide in from left
 */
export const slideInLeftVariants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: 'easeOut',
    },
  }),
};

/**
 * Slide in from right
 */
export const slideInRightVariants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: 'easeOut',
    },
  }),
};

/**
 * Scale up animation
 */
export const scaleUpVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: i * 0.1,
    },
  }),
};

/**
 * Stagger container for child animations
 */
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * 3D flip animation (for cards)
 */
export const flipVariants = {
  hidden: {
    opacity: 0,
    rotateY: 90,
    scale: 0.8,
  },
  visible: (i = 0) => ({
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      delay: i * 0.15,
    },
  }),
};

/**
 * Floating animation (continuous loop)
 */
export const floatingVariants = {
  animate: (i = 0) => ({
    y: [0, -30, 0],
    x: [0, 15, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 8 + i * 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }),
};

// ============================================================================
// Animation Constants
// ============================================================================

/**
 * Standard animation durations (in seconds)
 */
export const DURATIONS = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.9,
  verySlow: 1.2,
};

/**
 * Standard spring configurations
 */
export const SPRING_CONFIGS = {
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },
  bouncy: {
    type: 'spring',
    stiffness: 200,
    damping: 10,
  },
  stiff: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
};

/**
 * Standard stagger delays (in seconds)
 */
export const STAGGER_DELAYS = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.2,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate stagger delay based on index
 * @param {number} index - Element index
 * @param {number} baseDelay - Base delay in seconds
 * @returns {number} Calculated delay
 */
export const calculateStaggerDelay = (index, baseDelay = 0.1) => {
  return index * baseDelay;
};

/**
 * Create a custom variant with delay
 * @param {object} variant - Base variant object
 * @param {number} delay - Delay in seconds
 * @returns {object} Variant with delay applied
 */
export const withDelay = (variant, delay) => ({
  ...variant,
  transition: {
    ...variant.transition,
    delay,
  },
});
