import { useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

/**
 * ScrollProgressSection
 *
 * - Safe Framer Motion scroll tracking
 * - No hydration crash
 * - Reusable wrapper
 */
export default function ScrollProgressSection({
  children,
  className = '',
  progressBarClass = 'bg-linear-to-r from-primary via-secondary to-accent',
  offset = ['start center', 'end center'],
  showProgressBar = true,
}) {
  const sectionRef = useRef(null);
  const [mounted] = useState(true); // Always mounted on client

  // Always call hooks unconditionally
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset,
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={sectionRef} className={className}>
      {children({ progressWidth, mounted, showProgressBar, progressBarClass })}
    </section>
  );
}
