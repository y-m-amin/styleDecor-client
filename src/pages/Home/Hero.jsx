import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router';
import useMagneticTilt from '../../hooks/useMagneticTilt.js';
import { fadeUpVariants, floatingVariants } from '../../utils/animations';

/**
 * FloatingShape Component
 * Renders geometric shapes with parallax and floating animations
 */
function FloatingShape({ index, type = 'circle', size = 100 }) {
  // Random positioning
  const positions = [
    { top: '15%', left: '10%' },
    { top: '60%', left: '85%' },
    { top: '25%', right: '15%' },
    { bottom: '20%', left: '20%' },
    { top: '70%', right: '25%' },
  ];

  const position = positions[index % positions.length];

  const shapeClass =
    type === 'circle' ? 'rounded-full' : 'rounded-lg rotate-45';

  return (
    <motion.div
      custom={index}
      variants={floatingVariants}
      animate='animate'
      style={{
        width: size,
        height: size,
        ...position,
      }}
      className={`absolute ${shapeClass} bg-linear-to-br from-blue-400/20 to-purple-500/20 backdrop-blur-sm pointer-events-none`}
    />
  );
}

export default function Hero() {
  const heroRef = useRef(null);

  // Magnetic tilt for CTA button
  const { tilt, handleMouseMove, handleMouseEnter, handleMouseLeave } =
    useMagneticTilt(8);

  return (
    <motion.section
      ref={heroRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className='h-[75vh] relative flex flex-col items-center justify-center text-center px-4 overflow-hidden'
    >
      {/* Background image */}
      <div
        style={{
          backgroundImage: "url('/banner.jpg')",
        }}
        className='absolute inset-0 bg-cover bg-center'
      />

      {/* Gradient overlay with shimmer animation */}
      <div className='absolute inset-0 bg-linear-to-br from-blue-600/40 via-purple-600/30 to-pink-500/40 animate-shimmer' />

      {/* Floating geometric shapes */}
      <FloatingShape index={0} type='circle' size={120} />
      <FloatingShape index={1} type='square' size={80} />
      <FloatingShape index={2} type='circle' size={100} />
      <FloatingShape index={3} type='square' size={60} />
      <FloatingShape index={4} type='circle' size={90} />

      {/* Content with enhanced animations */}
      <div className='relative z-10'>
        <motion.h1
          custom={0}
          variants={fadeUpVariants}
          initial='hidden'
          animate='visible'
          className='text-white text-5xl md:text-6xl font-bold drop-shadow-lg'
        >
          Premium Decoration Services
        </motion.h1>

        <motion.p
          custom={1}
          variants={fadeUpVariants}
          initial='hidden'
          animate='visible'
          className='text-white text-lg md:text-xl mt-4 max-w-xl drop-shadow'
        >
          Transform your events with stunning, custom decorations designed by
          our expert team.
        </motion.p>

        <motion.div
          custom={2}
          variants={fadeUpVariants}
          initial='hidden'
          animate='visible'
        >
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animate={{
              rotateX: tilt.x,
              rotateY: tilt.y,
            }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 15,
            }}
            style={{
              perspective: 1000,
            }}
            className='mt-8 inline-block'
          >
            <Link
              to='/services'
              className='relative px-6 py-3 bg-primary hover:bg-secondary text-white text-lg font-medium rounded shadow-lg transition-all hover:shadow-blue-500/50 hover:shadow-2xl'
            >
              Book Decoration Service
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial='hidden'
          animate='visible'
          className='mt-12 text-white'
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className='text-sm'>Scroll down</span>
            <div className='w-1 h-6 mx-auto mt-1 bg-white rounded-full' />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
