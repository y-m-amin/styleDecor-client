// Statistics.jsx
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Usage:
 * <Statistics stats={stats} />
 *
 * stats = [
 *  { label: 'Decorators onboarded', value: '1,200+' },
 *  { label: 'Events completed', value: '8,500+' },
 *  { label: 'Avg. rating', value: '4.7/5' },
 *  { label: 'Cities covered', value: '35+' },
 * ]
 */

const shimmerAnim = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
  },
};

function useMouseGlow() {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return { ref, pos };
}

function AnimatedCounter({ value }) {
  // Accepts strings like "8,500+" or "4.7/5" → we only animate if it looks numeric-ish.
  const parsed = useMemo(() => {
    const raw = String(value);
    const hasSlash = raw.includes('/');
    if (hasSlash) return null;

    // Keep suffix like "+" if exists
    const suffix = raw.replace(/[0-9.,]/g, '');
    const numPart = raw.replace(/[^0-9.]/g, '');
    const n = Number(numPart);

    if (!Number.isFinite(n)) return null;

    // detect decimal
    const decimals = numPart.includes('.') ? Math.min(2, (numPart.split('.')[1] || '').length) : 0;

    return { n, decimals, suffix, raw };
  }, [value]);

  const [display, setDisplay] = useState(String(value));
  const rafRef = useRef(null);

  useEffect(() => {
    if (!parsed) {
      setDisplay(String(value));
      return;
    }

    const duration = 900;
    const start = performance.now();
    const from = 0;
    const to = parsed.n;

    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = from + (to - from) * eased;

      const formatted =
        parsed.decimals > 0
          ? cur.toFixed(parsed.decimals)
          : Math.round(cur).toLocaleString();

      setDisplay(`${formatted}${parsed.suffix || ''}`);

      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [parsed, value]);

  return <>{display}</>;
}

function StatPill({ stat, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.08 * i }}
      className='rounded-2xl border border-base-300 bg-base-100 px-5 py-4 shadow-sm'
    >
      <div className='text-xl font-extrabold'>
        <AnimatedCounter value={stat.value} />
      </div>
      <div className='mt-1 text-xs text-gray-500 max-w-[160px]'>{stat.label}</div>
    </motion.div>
  );
}

function StatsOrbitPlus({ stats = [] }) {
  // Desktop: orbit + subtle particle dots + hover "magnet" scale
  const angles = [18, 115, 210, 305, 55, 265]; // supports >4 stats too
  const max = Math.min(stats.length, angles.length);

  return (
    <div className='hidden sm:block'>
      <div className='relative mx-auto aspect-square max-w-[560px]'>
        {/* Ambient animated gradient */}
        <motion.div
          {...shimmerAnim}
          className='absolute inset-0 rounded-full blur-3xl opacity-60'
          style={{
            background:
              'linear-gradient(90deg, rgba(99,102,241,.25), rgba(236,72,153,.25), rgba(34,197,94,.2))',
            backgroundSize: '200% 200%',
          }}
        />

        {/* Rotating rings */}
        <motion.div
          className='absolute inset-14 rounded-full border border-base-300 bg-base-100/35 backdrop-blur'
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className='absolute inset-24 rounded-full border border-base-300 bg-base-200/35 backdrop-blur'
          animate={{ rotate: -360 }}
          transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className='absolute inset-36 rounded-full border border-base-300 bg-base-100/20 backdrop-blur'
          animate={{ rotate: 360 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center pulse card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-base-300 bg-base-100/80 backdrop-blur px-7 py-7 shadow-md'
        >
          <div className='text-center'>
            <div className='text-xs font-bold tracking-widest text-gray-500 uppercase'>
              Live Pulse
            </div>
            <div className='mt-2 text-3xl font-extrabold'>
              <AnimatedCounter value={stats?.[1]?.value ?? '—'} />
            </div>
            <div className='mt-1 text-sm text-gray-500'>
              {stats?.[1]?.label ?? 'Events completed'}
            </div>

            <motion.div
              className='mx-auto mt-4 h-2 w-32 rounded-full'
              style={{
                background:
                  'linear-gradient(90deg, rgba(99,102,241,.7), rgba(236,72,153,.7), rgba(34,197,94,.7))',
              }}
              animate={{ opacity: [0.35, 1, 0.35], scaleX: [0.92, 1, 0.92] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Small “spark” dots */}
            <div className='relative mt-5 h-8'>
              {[...Array(7)].map((_, k) => (
                <motion.span
                  key={k}
                  className='absolute top-1/2 h-1.5 w-1.5 rounded-full bg-base-300'
                  style={{ left: `${10 + k * 12}%` }}
                  animate={{ y: [-2, 2, -2], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.8 + (k % 3) * 0.35,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: k * 0.08,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Orbiting stat pills */}
        {stats.slice(0, max).map((s, i) => {
          const angle = angles[i];
          const r = 225;
          const x = Math.cos((angle * Math.PI) / 180) * r;
          const y = Math.sin((angle * Math.PI) / 180) * r;

          return (
            <motion.div
              key={s.label}
              className='absolute left-1/2 top-1/2'
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.08 * i }}
              whileHover={{ scale: 1.05 }}
            >
              <StatPill stat={s} i={i} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StatsMobileGrid({ stats = [] }) {
  return (
    <div className='grid sm:hidden grid-cols-2 gap-4'>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          className='rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm'
        >
          <div className='text-2xl font-extrabold'>
            <AnimatedCounter value={s.value} />
          </div>
          <div className='mt-1 text-xs text-gray-500'>{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Statistics({
  stats = [],
  eyebrow = 'Numbers',
  title = 'Platform Stats',
  desc = 'A quick snapshot of what’s happening.',
  badgeText = 'Updated regularly',
}) {
  const { ref, pos } = useMouseGlow();

  return (
    <section className='py-14 bg-base-200'>
      <div
        ref={ref}
        className='container mx-auto px-4'
      >
        <div className='relative overflow-hidden rounded-[28px] border border-base-300 bg-base-200/60 backdrop-blur p-6 md:p-10'>
          {/* mouse-follow glow */}
          <div
            className='pointer-events-none absolute inset-0 opacity-60'
            style={{
              background: `radial-gradient(550px circle at ${pos.x}% ${pos.y}%, rgba(99,102,241,.18), transparent 45%),
                           radial-gradient(450px circle at ${Math.max(0, pos.x - 18)}% ${Math.min(100, pos.y + 10)}%, rgba(236,72,153,.14), transparent 48%),
                           radial-gradient(520px circle at ${Math.min(100, pos.x + 18)}% ${Math.max(0, pos.y - 12)}%, rgba(34,197,94,.12), transparent 46%)`,
            }}
          />

          {/* animated shimmer overlay */}
          <motion.div
            {...shimmerAnim}
            className='pointer-events-none absolute inset-0 opacity-25'
            style={{
              background:
                'linear-gradient(120deg, rgba(99,102,241,.22), rgba(236,72,153,.22), rgba(34,197,94,.18))',
              backgroundSize: '220% 220%',
            }}
          />

          <div className='relative'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
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
                  <p className='mt-2 text-sm md:text-base text-gray-500 max-w-2xl'>
                    {desc}
                  </p>
                ) : null}
              </div>

              {badgeText ? (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  className='inline-flex items-center rounded-full border border-base-300 bg-base-100/70 px-3 py-1 text-xs font-semibold backdrop-blur w-fit'
                >
                  {badgeText}
                  <motion.span
                    className='ml-2 inline-block h-2 w-2 rounded-full'
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(99,102,241,.9), rgba(236,72,153,.9), rgba(34,197,94,.9))',
                    }}
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              ) : null}
            </div>

            <div className='mt-10'>
              <StatsMobileGrid stats={stats} />
              <StatsOrbitPlus stats={stats} />

              {/* extra: bottom “glow strip” */}
              <motion.div
                className='mt-10 h-[3px] w-full rounded-full'
                style={{
                  background:
                    'linear-gradient(90deg, rgba(99,102,241,.75), rgba(236,72,153,.75), rgba(34,197,94,.65))',
                }}
                initial={{ opacity: 0, scaleX: 0.6 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
