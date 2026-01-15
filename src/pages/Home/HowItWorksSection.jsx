import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { use3DTilt } from '../../hooks/use3DTilt';

function Badge({ children }) {
  return (
    <span className='inline-flex items-center rounded-full border border-base-300 bg-base-100/70 px-3 py-1 text-xs font-semibold backdrop-blur'>
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div>
      {eyebrow ? (
        <div className='text-xs font-bold tracking-widest uppercase text-gray-500'>
          {eyebrow}
        </div>
      ) : null}
      <h2 className='mt-2 text-2xl md:text-3xl font-extrabold tracking-tight'>
        {title}
      </h2>
      {desc ? (
        <p className='mt-2 text-sm md:text-base text-gray-500 max-w-2xl mx-auto'>
          {desc}
        </p>
      ) : null}
    </div>
  );
}

function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
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

// Step card with 3D tilt and glow effect
function StepCard({ step, title, desc, index, isLast }) {
  const { tilt, handleMouseMove, handleMouseEnter, handleMouseLeave } =
    use3DTilt(8);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMoveWithGlow = (e) => {
    handleMouseMove(e);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition({ x, y });
  };

  const handleEnter = (e) => {
    handleMouseEnter(e);
    setIsHovered(true);
  };

  const handleLeave = (e) => {
    handleMouseLeave(e);
    setIsHovered(false);
  };

  return (
    <div className='relative'>
      <motion.div
        initial={{ opacity: 0, x: -50, rotateY: -15 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15,
          delay: index * 0.2,
        }}
        onMouseMove={handleMouseMoveWithGlow}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        }}
        className='relative rounded-2xl border border-base-300 bg-base-100/70 backdrop-blur p-5 shadow-sm overflow-hidden transition-shadow duration-300'
      >
        {/* Glow effect */}
        {isHovered && (
          <motion.div
            className='absolute inset-0 pointer-events-none'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle 200px at ${glowPosition.x}% ${glowPosition.y}%, rgba(99, 102, 241, 0.15), transparent)`,
            }}
          />
        )}

        <div className='flex items-start gap-4 relative z-10'>
          {/* Number badge with animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: index * 0.2 + 0.1,
            }}
            whileHover={{
              scale: [1, 1.1, 1],
              transition: { duration: 0.3 },
            }}
            className='flex h-12 w-12 items-center justify-center rounded-2xl border border-base-300 bg-base-200 font-extrabold'
          >
            {step}
          </motion.div>
          <div>
            <div className='font-extrabold text-lg'>{title}</div>
            <div className='mt-1 text-sm text-gray-500'>{desc}</div>
          </div>
        </div>
      </motion.div>

      {/* Animated connecting line */}
      {!isLast && (
        <motion.div
          className='absolute left-6 top-[72px] w-[2px] h-4 bg-linear-to-b from-base-300 to-transparent'
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.6,
            delay: index * 0.2 + 0.3,
            ease: 'easeOut',
          }}
          style={{ transformOrigin: 'top' }}
        />
      )}
    </div>
  );
}

export default function HowItWorksSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // Scroll-linked progress for the section
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  const progressWidth = useTransform(sectionProgress, [0, 1], ['0%', '100%']);

  const steps = [
    {
      step: '01',
      title: 'Choose a service',
      desc: 'Pick a category or package that matches your event.',
    },
    {
      step: '02',
      title: 'Select a decorator',
      desc: 'Compare profiles, ratings, specialties, and photos.',
    },
    {
      step: '03',
      title: 'Confirm details',
      desc: 'Share location, time, and theme preferences.',
    },
    {
      step: '04',
      title: 'Enjoy your event',
      desc: 'Decorator sets up; you celebrate. Leave a review after.',
    },
  ];

  return (
    <section className='py-14' ref={sectionRef}>
      <div
        className='relative'
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(34,197,94,.12), transparent 40%), radial-gradient(circle at 80% 30%, rgba(236,72,153,.12), transparent 40%), radial-gradient(circle at 50% 80%, rgba(99,102,241,.12), transparent 40%)',
        }}
      >
        <div className='container mx-auto px-4 py-14 relative'>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <SectionTitle
              eyebrow='Simple'
              title='How It Works'
              desc='A clear path from idea → setup → wow.'
            />
            <Badge>Average booking: under 3 minutes</Badge>
          </div>

          {/* Progress indicator */}
          <div className='mt-6 h-1 bg-base-200 rounded-full overflow-hidden'>
            <motion.div
              className='h-full bg-linear-to-r from-primary via-secondary to-accent'
              style={{ width: progressWidth }}
            />
          </div>

          <div className='mt-10 grid lg:grid-cols-12 gap-6 items-start'>
            {/* left: timeline */}
            <div className='lg:col-span-7'>
              <div className='space-y-4'>
                {steps.map((x, idx) => (
                  <StepCard
                    key={x.step}
                    step={x.step}
                    title={x.title}
                    desc={x.desc}
                    index={idx}
                    isLast={idx === steps.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* right: demo card with floating badges */}
            <div className='lg:col-span-5'>
              <TiltCard className='rounded-2xl border border-base-300 bg-base-100 shadow-md overflow-hidden'>
                <div className='relative p-6'>
                  <motion.div
                    initial={{ backgroundPosition: '0% 50%' }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className='absolute inset-0 opacity-50'
                    style={{
                      background:
                        'linear-gradient(120deg, rgba(99,102,241,.18), rgba(236,72,153,.18), rgba(34,197,94,.14))',
                      backgroundSize: '200% 200%',
                    }}
                  />
                  <div className='relative'>
                    <div className='text-sm font-bold text-gray-500 uppercase tracking-widest'>
                      Smart Booking
                    </div>
                    <div className='mt-2 text-2xl font-extrabold'>
                      Theme → Decorator → Setup
                    </div>
                    <p className='mt-2 text-sm text-gray-500 leading-relaxed'>
                      Tell your theme and budget. We help you match with the
                      best decorators.
                    </p>

                    <div className='mt-5 flex flex-wrap gap-2'>
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 4.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Badge>Verified</Badge>
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 3.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.2,
                        }}
                      >
                        <Badge>Fast response</Badge>
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 4.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.5,
                        }}
                      >
                        <Badge>Custom add-ons</Badge>
                      </motion.div>
                    </div>

                    <div className='mt-6 flex gap-3'>
                      <button
                        onClick={() => navigate('/services')}
                        className='btn btn-primary btn-sm md:btn-md'
                      >
                        Start Booking
                      </button>
                      <button
                        onClick={() => navigate('/decorators')}
                        className='btn btn-outline btn-sm md:btn-md'
                      >
                        Browse Decorators
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
