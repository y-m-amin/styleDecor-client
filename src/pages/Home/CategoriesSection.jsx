// CategoriesSection.jsx
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.06 * i },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const floaty = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export default function CategoriesSection({ SectionTitle, Badge }) {
  const navigate = useNavigate();

  // Keeping the exact same categories content/structure
  const categories = useMemo(
    () => [
      {
        title: 'Wedding & Reception',
        desc: 'Elegant floral, stage, aisle, and lighting setups.',
        icon: '💍',
        href: '/services?category=wedding',
      },
      {
        title: 'Birthday & Kids Party',
        desc: 'Balloon arches, themes, backdrops, table decor.',
        icon: '🎉',
        href: '/services?category=birthday',
      },
      {
        title: 'Corporate Events',
        desc: 'Branding, stage, booth, signage, premium ambience.',
        icon: '🏢',
        href: '/services?category=corporate',
      },
      {
        title: 'Home & Festive Decor',
        desc: 'Eid, Puja, Christmas, home makeovers.',
        icon: '🏠',
        href: '/services?category=home',
      },
      {
        title: 'Photography Setups',
        desc: 'Photo booth, props, LED walls, themed corners.',
        icon: '📸',
        href: '/services?category=photo',
      },
      {
        title: 'Catering & Add-ons',
        desc: 'Food, tables, chairs, sound, and more.',
        icon: '🍽️',
        href: '/services?category=addons',
      },
    ],
    []
  );

  return (
    <section className='container mx-auto px-4 py-14'>
      <div className='relative overflow-hidden rounded-[28px] border border-base-300 bg-base-200 p-6 md:p-10'>
        <motion.div
          className='absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40'
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(236,72,153,.6), transparent 55%)',
          }}
          {...floaty}
        />
        <motion.div
          className='absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-40'
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(99,102,241,.6), transparent 55%)',
          }}
          animate={{ y: [0, 12, 0], x: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className='relative flex flex-col md:flex-row md:items-end md:justify-between gap-5'>
          <SectionTitle
            eyebrow='Explore'
            title='Browse Categories'
            desc='Pick a vibe, choose a service, and book your decorator.'
          />
          <div className='flex gap-2 md:justify-end'>
            <Badge>Fast booking</Badge>
            <Badge>Verified pros</Badge>
            <button
              onClick={() => navigate('/services')}
              className='btn btn-primary btn-sm md:btn-md'
            >
              Explore All →
            </button>
          </div>
        </div>

        {/* Bento grid */}
        <motion.div
          variants={stagger}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.25 }}
          className='relative mt-8 grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12'
        >
          {categories.map((c, idx) => {
            const spans = [
              'lg:col-span-7',
              'lg:col-span-5',
              'lg:col-span-4',
              'lg:col-span-4',
              'lg:col-span-4',
              'lg:col-span-12',
            ];
            const span = spans[idx] || 'lg:col-span-4';

            return (
              <motion.button
                key={c.title}
                variants={fadeUp}
                custom={idx}
                onClick={() => navigate(c.href)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className={`${span} group text-left rounded-2xl border border-base-300 bg-base-100/70 backdrop-blur p-5 md:p-6 shadow-sm hover:shadow-md`}
              >
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <div className='flex items-center gap-3'>
                      <div className='text-3xl'>{c.icon}</div>
                      <div className='text-lg font-extrabold'>{c.title}</div>
                    </div>
                    <div className='mt-2 text-sm text-gray-500 max-w-[42ch]'>
                      {c.desc}
                    </div>
                  </div>

                  <motion.div
                    className='hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-base-300 bg-base-200'
                    whileHover={{ rotate: 12 }}
                    transition={{
                      type: 'spring',
                      stiffness: 250,
                      damping: 16,
                    }}
                  >
                    →
                  </motion.div>
                </div>

                <div className='mt-5 flex flex-wrap gap-2'>
                  <span className='text-xs font-semibold rounded-full bg-base-200 px-3 py-1'>
                    Popular
                  </span>
                  <span className='text-xs font-semibold rounded-full bg-base-200 px-3 py-1'>
                    Premium looks
                  </span>
                  <span className='text-xs font-semibold rounded-full bg-base-200 px-3 py-1'>
                    Add-ons
                  </span>
                </div>

                <div className='mt-5 text-xs text-gray-500'>
                  Tap to view services
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
