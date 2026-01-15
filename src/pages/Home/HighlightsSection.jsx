import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import useMagneticTilt from '../../hooks/useMagneticTilt';
import { SectionTitle } from './Home';

const highlightCardVariants = {
  hidden: { opacity: 0, rotateY: 90, scale: 0.8 },
  visible: (i) => ({
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

const iconVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
      delay: 0.3,
    },
  },
  hover: {
    scale: [1, 1.2, 1],
    rotate: [0, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

const gradientVariants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const ry = (px - 0.5) * 10;
    const rx = -(py - 0.5) * 10;
    setTilt({ rx, ry });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HighlightCard({ highlight, index }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { tilt, handleMouseMove, handleMouseLeave } = useMagneticTilt(
    cardRef,
    15
  );

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeaveWrapper = () => {
    setIsHovered(false);
    handleMouseLeave();
  };

  return (
    <motion.div
      ref={cardRef}
      variants={highlightCardVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeaveWrapper}
      className='h-full rounded-2xl border border-base-300 bg-base-100 overflow-hidden relative'
      whileHover={{
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 40px rgba(99, 102, 241, 0.3)',
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Animated gradient background */}
      <motion.div
        className='absolute inset-0 opacity-20'
        variants={gradientVariants}
        initial='initial'
        animate='animate'
        style={{
          background:
            'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(236,72,153,0.4), rgba(34,197,94,0.3), rgba(99,102,241,0.4))',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Secondary gradient layer for depth */}
      <motion.div
        className='absolute inset-0 opacity-10'
        animate={{
          backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background:
            'linear-gradient(225deg, rgba(236,72,153,0.5), rgba(99,102,241,0.5), rgba(34,197,94,0.4))',
          backgroundSize: '200% 200%',
        }}
      />

      <div className='p-6 relative z-10'>
        <div className='flex items-start justify-between gap-3'>
          <motion.div
            className='text-3xl relative'
            variants={iconVariants}
            initial='initial'
            animate='animate'
            whileHover='hover'
          >
            <motion.div
              className='absolute inset-0 rounded-full blur-xl opacity-0'
              style={{
                background:
                  'radial-gradient(circle, rgba(99,102,241,0.6), rgba(236,72,153,0.6))',
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <span className='relative z-10'>{highlight.icon}</span>
          </motion.div>
          <motion.div
            className='h-10 w-10 rounded-2xl border border-base-300 bg-base-200 flex items-center justify-center'
            whileHover={{ rotate: -12, scale: 1.06 }}
            transition={{
              type: 'spring',
              stiffness: 250,
              damping: 16,
            }}
          >
            ✦
          </motion.div>
        </div>

        <div className='mt-4 text-lg font-extrabold'>{highlight.title}</div>
        <div className='mt-2 text-sm text-gray-500'>{highlight.desc}</div>

        {/* Animated hint/tip on hover */}
        <motion.div
          className='mt-5 rounded-xl border border-base-300 bg-base-200 p-4 text-sm text-gray-600 overflow-hidden'
          initial={{ height: 'auto' }}
          animate={{ height: isHovered ? 'auto' : '60px' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <div className='font-semibold mb-1'>💡 Pro Tip</div>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 5,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Check portfolios + specialties before booking for best match.
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Additional details revealed on hover */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? 'auto' : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='mt-3 text-xs text-gray-500 overflow-hidden'
        >
          <div className='flex items-center gap-2'>
            <motion.span
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              ⭐
            </motion.span>
            <span>Hover to explore more features</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HighlightsSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax transforms for decorative shapes
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const highlights = [
    {
      title: 'Verified Decorators',
      desc: 'Browse profiles, portfolios, and ratings.',
      icon: '✅',
    },
    {
      title: 'Transparent Pricing',
      desc: 'Clear packages and add-ons—no surprises.',
      icon: '💳',
    },
    {
      title: 'Fast Booking',
      desc: 'Book in minutes and track status easily.',
      icon: '⚡',
    },
    {
      title: 'Custom Themes',
      desc: 'Tell us your vibe—minimal, luxury, or funky.',
      icon: '🎨',
    },
  ];

  return (
    <section ref={sectionRef} className='container mx-auto px-4 py-14 relative'>
      {/* Parallax decorative shapes */}
      <motion.div
        className='absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none'
        style={{
          y: y1,
          background:
            'radial-gradient(circle, rgba(99,102,241,0.6), transparent 70%)',
        }}
      />
      <motion.div
        className='absolute top-1/2 -right-20 w-60 h-60 rounded-full blur-3xl opacity-25 pointer-events-none'
        style={{
          y: y2,
          background:
            'radial-gradient(circle, rgba(236,72,153,0.6), transparent 70%)',
        }}
      />
      <motion.div
        className='absolute -bottom-20 left-1/4 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none'
        style={{
          y: y3,
          background:
            'radial-gradient(circle, rgba(34,197,94,0.6), transparent 70%)',
        }}
      />

      <SectionTitle
        eyebrow='Why us'
        title='Why People Book Here'
        desc='Not just pretty—reliable and smooth end-to-end.'
        align='center'
      />

      <motion.div
        variants={stagger}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.2 }}
        className='mt-10 grid md:grid-cols-2 xl:grid-cols-4 gap-6'
        style={{ perspective: '1000px' }}
      >
        {highlights.map((h, idx) => (
          <HighlightCard key={h.title} highlight={h} index={idx} />
        ))}
      </motion.div>
    </section>
  );
}
