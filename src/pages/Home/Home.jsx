import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from '../../api/axios';
import MapComponent from '../../components/MapComponent';
import ServiceCard from '../../components/ServiceCard';
import SkeletonCard from '../../components/SkeletonCard';
import Hero from './Hero';

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

const shimmerAnim = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
  },
};

function Badge({ children }) {
  return (
    <span className='inline-flex items-center rounded-full border border-base-300 bg-base-100/70 px-3 py-1 text-xs font-semibold backdrop-blur'>
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, desc, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
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

function MarqueePartners({ items = [] }) {
  // Pure CSS marquee (no extra libs). Duplicates items for seamless loop.
  const doubled = [...items, ...items];
  return (
    <div className='relative overflow-hidden rounded-2xl border border-base-300 bg-base-200'>
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-base-200 via-transparent to-base-200' />
      <div className='py-6'>
        <div className='flex w-max animate-[marquee_28s_linear_infinite] gap-4 px-6'>
          {doubled.map((p, idx) => (
            <div
              key={`${p}-${idx}`}
              className='shrink-0 rounded-full border border-base-300 bg-base-100/70 px-5 py-2 text-sm font-semibold shadow-sm backdrop-blur'
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* add keyframes once */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function StatsOrbit({ stats }) {
  // Fun layout: center “pulse” + orbiting stat pills (responsive stacks on small)
  return (
    <div className='relative'>
      {/* mobile: simple grid */}
      <div className='grid sm:hidden grid-cols-2 gap-4'>
        {stats.map((s) => (
          <div
            key={s.label}
            className='rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm'
          >
            <div className='text-2xl font-extrabold'>{s.value}</div>
            <div className='mt-1 text-xs text-gray-500'>{s.label}</div>
          </div>
        ))}
      </div>

      {/* desktop: orbit */}
      <div className='hidden sm:block'>
        <div className='relative mx-auto aspect-square max-w-[520px]'>
          <motion.div
            {...shimmerAnim}
            className='absolute inset-0 rounded-full blur-3xl opacity-60'
            style={{
              background:
                'linear-gradient(90deg, rgba(99,102,241,.25), rgba(236,72,153,.25), rgba(34,197,94,.2))',
              backgroundSize: '200% 200%',
            }}
          />
          <motion.div
            className='absolute inset-16 rounded-full border border-base-300 bg-base-100/40 backdrop-blur'
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className='absolute inset-24 rounded-full border border-base-300 bg-base-200/40 backdrop-blur'
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-base-300 bg-base-100 px-6 py-6 shadow-md'
            {...fadeUp}
            custom={0}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.4 }}
          >
            <div className='text-center'>
              <div className='text-xs font-bold tracking-widest text-gray-500 uppercase'>
                Live Pulse
              </div>
              <div className='mt-2 text-3xl font-extrabold'>
                {stats?.[1]?.value || '—'}
              </div>
              <div className='mt-1 text-sm text-gray-500'>
                {stats?.[1]?.label || 'Events completed'}
              </div>
              <motion.div
                className='mx-auto mt-4 h-2 w-28 rounded-full'
                style={{
                  background:
                    'linear-gradient(90deg, rgba(99,102,241,.7), rgba(236,72,153,.7), rgba(34,197,94,.7))',
                }}
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          {/* orbiting pills */}
          {stats.map((s, i) => {
            const angles = [18, 115, 210, 305];
            const angle = angles[i % angles.length];
            const r = 210; // radius
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
              >
                <div className='rounded-2xl border border-base-300 bg-base-100 px-5 py-4 shadow-sm'>
                  <div className='text-xl font-extrabold'>{s.value}</div>
                  <div className='mt-1 text-xs text-gray-500 max-w-[140px]'>
                    {s.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className='space-y-3'>
      {items.map((f, idx) => {
        const open = idx === openIndex;
        return (
          <div
            key={`${f.q}-${idx}`}
            className='rounded-2xl border border-base-300 bg-base-100/70 backdrop-blur shadow-sm overflow-hidden'
          >
            <button
              onClick={() => setOpenIndex(open ? -1 : idx)}
              className='w-full flex items-center justify-between gap-3 px-5 py-4 text-left'
            >
              <div className='font-semibold'>{f.q}</div>
              <motion.div
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className='text-xl font-bold'
              >
                +
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className='px-5 pb-5 text-sm text-gray-500 leading-relaxed'>
                    {f.a}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
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

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decorators, setDecorators] = useState([]);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const navigate = useNavigate();

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

  const highlights = useMemo(
    () => [
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
    ],
    []
  );

  const stats = useMemo(
    () => [
      { label: 'Decorators onboarded', value: '1,200+' },
      { label: 'Events completed', value: '8,500+' },
      { label: 'Avg. rating', value: '4.7/5' },
      { label: 'Cities covered', value: '35+' },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: 'Nusrat A.',
        role: 'Wedding Client',
        quote:
          'Booking was simple, decorator was punctual, and the setup looked premium. Photos came out amazing.',
        rating: 5,
      },
      {
        name: 'Rafi S.',
        role: 'Corporate Event',
        quote:
          'Professional execution, great lighting and stage branding. Clear communication from start to finish.',
        rating: 5,
      },
      {
        name: 'Tania R.',
        role: 'Birthday Party',
        quote:
          'Loved the theme suggestions and balloon work. My kid was obsessed with the backdrop!',
        rating: 4,
      },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        q: 'How do I book a decorator?',
        a: 'Pick a service, choose a decorator or package, and place a request. You’ll get confirmation and next steps inside your dashboard.',
      },
      {
        q: 'Can I customize a package?',
        a: 'Yes—most services support add-ons (lighting, flowers, stage, props). Request customization from the service page or decorator profile.',
      },
      {
        q: 'How do ratings work?',
        a: 'Ratings are collected after completed bookings. We calculate an average and show recent reviews when available.',
      },
      {
        q: 'Do you cover outside Dhaka?',
        a: 'Yes—coverage depends on decorator availability. Check the coverage map and service pages for supported areas.',
      },
      {
        q: 'What if the decorator cancels?',
        a: 'We’ll help you find an alternative quickly or assist with refund options depending on the booking status.',
      },
    ],
    []
  );

  const blogs = useMemo(
    () => [
      {
        id: '1',
        title: 'Top 10 Wedding Stage Ideas for 2026',
        excerpt:
          'From minimalist florals to luxury lighting—see what’s trending this season.',
        date: 'Jan 2026',
      },
      {
        id: '2',
        title: 'Birthday Theme Checklist: What You’ll Forget Otherwise',
        excerpt:
          'Backdrops, props, cake table, lighting—here’s a quick plan that saves time.',
        date: 'Jan 2026',
      },
      {
        id: '3',
        title: 'Corporate Event Decor: Branding That Looks Premium',
        excerpt:
          'How to make your booth and stage look polished without overspending.',
        date: 'Dec 2025',
      },
    ],
    []
  );

  const partners = useMemo(
    () => [
      'Event Venues',
      'Catering Teams',
      'Photography',
      'Sound & Lighting',
      'Florists',
      'Printing',
      'DJ & Entertainment',
      'Rentals',
    ],
    []
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchTopDecorators = async () => {
      try {
        const res = await axios.get('/decorators/top?limit=6');
        setDecorators(res.data.decorators || []);
      } catch (err) {
        console.error('Failed to load decorators', err);
      }
    };

    fetchTopDecorators();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/services', { params: { limit: 6 } });
        setServices(res.data.services || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const onNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterMsg('');

    const email = newsletterEmail.trim();
    if (!email) {
      setNewsletterMsg('Please enter your email.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setNewsletterMsg('Please enter a valid email address.');
      return;
    }

    setNewsletterMsg('Thanks! You’re subscribed.');
    setNewsletterEmail('');
  };

  // Parallax strip behind some sections
  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div className='overflow-x-hidden'>
      {/* 1) Hero (keep your existing component) */}
      <Hero />

      {/* 2) Categories (NEW layout: “bento” / mixed sizes + animated gradient blobs) */}
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
                      transition={{ type: 'spring', stiffness: 250, damping: 16 }}
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

      {/* 3) Popular Services (keep, but add entrance animation + different layout wrappers) */}
      <section className='container mx-auto px-4 py-12'>
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7'>
          <SectionTitle
            eyebrow='Trending'
            title='Popular Decoration Services'
            desc='Handpicked services people book the most.'
          />
          <button
            onClick={() => navigate('/services')}
            className='btn btn-outline btn-sm md:btn-md'
          >
            See More Services →
          </button>
        </div>

        {loading ? (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
              >
                <SkeletonCard />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.2 }}
            className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          >
            {services.map((s, idx) => (
              <motion.div key={s._id} variants={fadeUp} custom={idx}>
                <ServiceCard service={s} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* 4) How it works (NEW: timeline + sliding indicator) */}
      <section className='py-14' ref={parallaxRef}>
        <motion.div
          className='relative'
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(34,197,94,.12), transparent 40%), radial-gradient(circle at 80% 30%, rgba(236,72,153,.12), transparent 40%), radial-gradient(circle at 50% 80%, rgba(99,102,241,.12), transparent 40%)',
          }}
        >
          <motion.div
            style={{ y: bgY }}
            className='absolute inset-0 opacity-70'
          />
          <div className='container mx-auto px-4 py-14 relative'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
              <SectionTitle
                eyebrow='Simple'
                title='How It Works'
                desc='A clear path from idea → setup → wow.'
              />
              <Badge>Average booking: under 3 minutes</Badge>
            </div>

            <div className='mt-10 grid lg:grid-cols-12 gap-6 items-start'>
              {/* left: timeline */}
              <div className='lg:col-span-7'>
                <div className='space-y-4'>
                  {[
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
                  ].map((x, idx) => (
                    <motion.div
                      key={x.step}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        type: 'spring',
                        stiffness: 220,
                        damping: 18,
                        delay: 0.06 * idx,
                      }}
                      className='relative rounded-2xl border border-base-300 bg-base-100/70 backdrop-blur p-5 shadow-sm'
                    >
                      <div className='flex items-start gap-4'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-base-300 bg-base-200 font-extrabold'>
                          {x.step}
                        </div>
                        <div>
                          <div className='font-extrabold text-lg'>{x.title}</div>
                          <div className='mt-1 text-sm text-gray-500'>
                            {x.desc}
                          </div>
                        </div>
                      </div>
                      {/* animated “progress line” accent */}
                      <motion.div
                        className='absolute left-6 top-14 bottom-0 w-[2px] bg-base-300'
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 0.6, delay: 0.08 * idx }}
                        style={{ transformOrigin: 'top' }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* right: demo card with floating badges */}
              <div className='lg:col-span-5'>
                <TiltCard className='rounded-2xl border border-base-300 bg-base-100 shadow-md overflow-hidden'>
                  <div className='relative p-6'>
                    <motion.div
                      {...shimmerAnim}
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
                        <motion.div {...floaty}>
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
        </motion.div>
      </section>

      {/* 5) Highlights (NEW: “feature cards” with hover reveal + micro animation) */}
      <section className='container mx-auto px-4 py-14'>
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
        >
          {highlights.map((h, idx) => (
            <motion.div key={h.title} variants={fadeUp} custom={idx}>
              <TiltCard className='h-full rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden'>
                <div className='p-6'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='text-3xl'>{h.icon}</div>
                    <motion.div
                      className='h-10 w-10 rounded-2xl border border-base-300 bg-base-200 flex items-center justify-center'
                      whileHover={{ rotate: -12, scale: 1.06 }}
                      transition={{ type: 'spring', stiffness: 250, damping: 16 }}
                    >
                      ✦
                    </motion.div>
                  </div>

                  <div className='mt-4 text-lg font-extrabold'>{h.title}</div>
                  <div className='mt-2 text-sm text-gray-500'>{h.desc}</div>

                  <motion.div
                    className='mt-5 rounded-xl border border-base-300 bg-base-200 p-4 text-sm text-gray-600'
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    Tip: Check portfolios + specialties before booking for best match.
                  </motion.div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6) Statistics (NEW: Orbit/pulse layout) */}
      <section className='py-14 bg-base-200'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <SectionTitle
              eyebrow='Numbers'
              title='Platform Stats'
              desc='A quick snapshot of what’s happening.'
            />
            <Badge>Updated regularly</Badge>
          </div>

          <div className='mt-10'>
            <StatsOrbit stats={stats} />
          </div>
        </div>
      </section>

      {/* 7) Top Decorators (NEW: “spotlight strip” + animated reveal) */}
      <section className='py-14'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6'>
            <SectionTitle
              eyebrow='Top rated'
              title='Top Decorators'
              desc='Discover pros with standout reviews and specialties.'
            />
            <button
              onClick={() => navigate('/decorators')}
              className='btn btn-outline btn-sm md:btn-md'
            >
              See All →
            </button>
          </div>

          {decorators.length === 0 ? (
            <div className='rounded-2xl border border-base-300 bg-base-200 p-8 text-gray-500'>
              No decorators yet.
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
              {/* spotlight */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
                className='md:col-span-4 rounded-2xl border border-base-300 bg-base-200 p-6 overflow-hidden relative'
              >
                <motion.div
                  {...shimmerAnim}
                  className='absolute inset-0 opacity-50'
                  style={{
                    background:
                      'linear-gradient(120deg, rgba(236,72,153,.18), rgba(99,102,241,.18), rgba(34,197,94,.14))',
                    backgroundSize: '200% 200%',
                  }}
                />
                <div className='relative'>
                  <div className='text-xs font-bold tracking-widest uppercase text-gray-500'>
                    Spotlight
                  </div>
                  <div className='mt-2 text-2xl font-extrabold'>
                    Handpicked creators
                  </div>
                  <p className='mt-2 text-sm text-gray-500'>
                    Tap a decorator to view profile, photos, and specialties.
                  </p>
                  <div className='mt-5 flex flex-wrap gap-2'>
                    <Badge>Portfolio</Badge>
                    <Badge>Experience</Badge>
                    <Badge>Rating</Badge>
                  </div>
                  <button
                    onClick={() => navigate('/decorators')}
                    className='mt-6 btn btn-primary btn-sm md:btn-md'
                  >
                    Browse all decorators
                  </button>
                </div>
              </motion.div>

              {/* cards */}
              <motion.div
                variants={stagger}
                initial='hidden'
                whileInView='show'
                viewport={{ once: true, amount: 0.25 }}
                className='md:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
              >
                {decorators.map((d, idx) => (
                  <motion.div
                    key={d._id}
                    variants={fadeUp}
                    custom={idx}
                    className='group cursor-pointer'
                    onClick={() => navigate(`/decorators/${d._id}`)}
                  >
                    <div className='relative rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm overflow-hidden'>
                      <motion.div
                        className='absolute -inset-1 opacity-0 group-hover:opacity-100'
                        transition={{ duration: 0.2 }}
                        style={{
                          background:
                            'radial-gradient(circle at 30% 30%, rgba(99,102,241,.18), transparent 55%)',
                        }}
                      />
                      <div className='relative flex flex-col items-center text-center'>
                        <motion.img
                          src={d.photoURL}
                          alt={d.displayName}
                          className='w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-base-300'
                          whileHover={{ scale: 1.06 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                        />
                        <div className='mt-2 font-extrabold text-sm md:text-base line-clamp-1'>
                          {d.displayName}
                        </div>
                        <div className='text-[11px] text-gray-500 my-1'>
                          Rating:{' '}
                          {d.rating != null && !Number.isNaN(Number(d.rating))
                            ? Number(d.rating).toFixed(2)
                            : 'N/A'}
                        </div>
                        <div className='text-[11px] text-gray-600 line-clamp-2'>
                          {d.specialties?.join(', ') || 'No specialties'}
                        </div>

                        <motion.div
                          className='mt-3 text-xs font-semibold'
                          initial={{ opacity: 0, y: 6 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          View profile →
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* 8) Testimonials (NEW: carousel-like stack + animated card swap) */}
      <section className='py-14 bg-base-200'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <SectionTitle
              eyebrow='Trust'
              title='What Customers Say'
              desc='Feedback that tells the real story.'
            />
            <button
              onClick={() => navigate('/reviews')}
              className='btn btn-outline btn-sm md:btn-md'
            >
              View Reviews →
            </button>
          </div>

          <TestimonialStack testimonials={testimonials} />
        </div>
      </section>

      {/* 9) Blog / Tips (NEW: asymmetric layout with “featured post”) */}
      <section className='py-14'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6'>
            <SectionTitle
              eyebrow='Learn'
              title='Ideas & Inspiration'
              desc='Planning shortcuts, trends, and theme ideas.'
            />
            <button
              onClick={() => navigate('/blogs')}
              className='btn btn-outline btn-sm md:btn-md'
            >
              Read More →
            </button>
          </div>

          <div className='grid lg:grid-cols-12 gap-6'>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className='lg:col-span-7 rounded-2xl border border-base-300 bg-base-200 p-6 md:p-8 overflow-hidden relative cursor-pointer'
              onClick={() => navigate(`/blogs/${blogs?.[0]?.id || '1'}`)}
            >
              <motion.div
                {...shimmerAnim}
                className='absolute inset-0 opacity-45'
                style={{
                  background:
                    'linear-gradient(120deg, rgba(99,102,241,.18), rgba(236,72,153,.18), rgba(34,197,94,.14))',
                  backgroundSize: '200% 200%',
                }}
              />
              <div className='relative'>
                <Badge>Featured</Badge>
                <div className='mt-4 text-2xl md:text-3xl font-extrabold'>
                  {blogs?.[0]?.title}
                </div>
                <div className='mt-3 text-sm text-gray-600 max-w-[60ch]'>
                  {blogs?.[0]?.excerpt}
                </div>
                <div className='mt-6 flex items-center justify-between'>
                  <div className='text-xs text-gray-500'>{blogs?.[0]?.date}</div>
                  <div className='font-extrabold'>Read →</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={stagger}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true, amount: 0.2 }}
              className='lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-6'
            >
              {blogs.slice(1).map((b, idx) => (
                <motion.div
                  key={b.id}
                  variants={fadeUp}
                  custom={idx}
                  className='rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm cursor-pointer hover:shadow-md'
                  onClick={() => navigate(`/blogs/${b.id}`)}
                >
                  <div className='text-xs text-gray-500'>{b.date}</div>
                  <div className='mt-2 font-extrabold'>{b.title}</div>
                  <div className='mt-2 text-sm text-gray-500'>{b.excerpt}</div>
                  <div className='mt-4 text-sm font-extrabold'>Read →</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10) Newsletter (NEW: glass + animated success state) */}
      <section className='py-14'>
        <div className='container mx-auto px-4'>
          <div className='relative overflow-hidden rounded-[28px] border border-base-300 bg-base-200 p-6 md:p-10'>
            <motion.div
              className='absolute inset-0 opacity-35'
              {...shimmerAnim}
              style={{
                background:
                  'linear-gradient(120deg, rgba(236,72,153,.22), rgba(99,102,241,.22), rgba(34,197,94,.18))',
                backgroundSize: '220% 220%',
              }}
            />
            <div className='relative grid md:grid-cols-12 gap-6 items-center'>
              <div className='md:col-span-6'>
                <SectionTitle
                  eyebrow='Newsletter'
                  title='Get event ideas in your inbox'
                  desc='Monthly trends, theme ideas, and occasional offers—no spam.'
                />
                <div className='mt-4 flex flex-wrap gap-2'>
                  <Badge>Trends</Badge>
                  <Badge>Checklists</Badge>
                  <Badge>Offers</Badge>
                </div>
              </div>

              <div className='md:col-span-6'>
                <form onSubmit={onNewsletterSubmit} className='space-y-3'>
                  <div className='flex flex-col sm:flex-row gap-2'>
                    <input
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      type='email'
                      placeholder='you@example.com'
                      className='input input-bordered w-full'
                    />
                    <button type='submit' className='btn btn-primary'>
                      Subscribe
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {newsletterMsg ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className='text-sm text-gray-700'
                      >
                        {newsletterMsg}
                      </motion.div>
                    ) : (
                      <motion.div
                        key='hint'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='text-xs text-gray-600'
                      >
                        Tip: add your primary email so you don’t miss updates.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11) FAQ (NEW: animated accordion) */}
      <section className='py-14 bg-base-200'>
        <div className='container mx-auto px-4'>
          <div className='grid lg:grid-cols-12 gap-8 items-start'>
            <div className='lg:col-span-5'>
              <SectionTitle
                eyebrow='FAQ'
                title='Clear answers before you book'
                desc='No confusion, just straightforward info.'
              />
              <div className='mt-6 flex gap-3'>
                <button
                  onClick={() => navigate('/services')}
                  className='btn btn-primary btn-sm md:btn-md'
                >
                  Browse Services
                </button>
                <button
                  onClick={() => navigate('/support')}
                  className='btn btn-outline btn-sm md:btn-md'
                >
                  Contact Support
                </button>
              </div>
            </div>

            <div className='lg:col-span-7'>
              <Accordion items={faqs} />
            </div>
          </div>
        </div>
      </section>

      {/* 12) Partners (NEW: marquee strip) */}
      <section className='py-14'>
        <div className='container mx-auto px-4'>
          <div className='mb-6'>
            <SectionTitle
              eyebrow='Ecosystem'
              title='Partner Network'
              desc='We collaborate with teams that make events smoother.'
            />
          </div>
          <MarqueePartners items={partners} />
        </div>
      </section>

      {/* 13) Map (keep your MapComponent, but wrap with nicer layout + small animation) */}
      <section className='py-14 bg-base-200'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6'>
            <SectionTitle
              eyebrow='Coverage'
              title='Service Coverage Map'
              desc='Check where we currently support bookings.'
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/services')}
              className='btn btn-primary btn-sm md:btn-md'
            >
              Book Now →
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className='rounded-2xl border border-base-300 bg-base-100 p-3 md:p-4 shadow-sm'
          >
            <MapComponent />
          </motion.div>
        </div>
      </section>

      {/* 14) Final CTA (NEW: split layout + animated background) */}
      <section className='py-14'>
        <div className='container mx-auto px-4'>
          <div className='relative overflow-hidden rounded-[32px] border border-base-300 bg-base-200 p-7 md:p-12'>
            <motion.div
              {...shimmerAnim}
              className='absolute inset-0 opacity-40'
              style={{
                background:
                  'linear-gradient(120deg, rgba(99,102,241,.22), rgba(236,72,153,.22), rgba(34,197,94,.18))',
                backgroundSize: '220% 220%',
              }}
            />
            <div className='relative grid md:grid-cols-12 gap-8 items-center'>
              <div className='md:col-span-7'>
                <div className='text-xs font-bold tracking-widest uppercase text-gray-600'>
                  Ready when you are
                </div>
                <div className='mt-2 text-3xl md:text-4xl font-extrabold tracking-tight'>
                  Ready to decorate your next event?
                </div>
                <p className='mt-3 text-sm md:text-base text-gray-600 max-w-[60ch]'>
                  Browse services, compare decorators, and book in minutes.
                  Your vibe, your budget, your timeline.
                </p>

                <div className='mt-6 flex flex-col sm:flex-row gap-3'>
                  <button
                    onClick={() => navigate('/services')}
                    className='btn btn-primary md:btn-lg'
                  >
                    Explore Services
                  </button>
                  <button
                    onClick={() => navigate('/decorators')}
                    className='btn btn-outline md:btn-lg'
                  >
                    Find Decorators
                  </button>
                </div>
              </div>

              <div className='md:col-span-5'>
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  className='rounded-2xl border border-base-300 bg-base-100/70 backdrop-blur p-6 shadow-sm'
                >
                  <div className='text-sm font-extrabold'>Quick Picks</div>
                  <div className='mt-3 space-y-3'>
                    {[
                      { t: 'Wedding stage + aisle', s: 'Luxury + soft lights' },
                      { t: 'Birthday balloon arch', s: 'Theme + backdrop' },
                      { t: 'Corporate branding', s: 'Stage + booth + signage' },
                    ].map((x, i) => (
                      <motion.div
                        key={x.t}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.35, delay: 0.05 * i }}
                        className='flex items-start justify-between gap-4 rounded-xl border border-base-300 bg-base-200 p-4'
                      >
                        <div>
                          <div className='font-semibold'>{x.t}</div>
                          <div className='text-xs text-gray-500 mt-1'>{x.s}</div>
                        </div>
                        <div className='text-lg'>✨</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** NEW: testimonial stack with auto-advance + swipeable feel (no external libs) */
function TestimonialStack({ testimonials = [] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!testimonials.length) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const current = testimonials[idx] || testimonials[0];

  const next = () => setIdx((p) => (p + 1) % testimonials.length);
  const prev = () => setIdx((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <div className='mt-10 grid lg:grid-cols-12 gap-6 items-start'>
      <div className='lg:col-span-5'>
        <div className='rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm'>
          <div className='text-sm font-extrabold'>Customer love</div>
          <p className='mt-2 text-sm text-gray-500'>
            We rotate highlights every few seconds—tap next/prev if you want.
          </p>

          <div className='mt-5 flex gap-2'>
            <button onClick={prev} className='btn btn-outline btn-sm'>
              ← Prev
            </button>
            <button onClick={next} className='btn btn-primary btn-sm'>
              Next →
            </button>
          </div>

          <div className='mt-6 flex flex-wrap gap-2'>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2.5 w-2.5 rounded-full ${
                  i === idx ? 'bg-primary' : 'bg-base-300'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className='lg:col-span-7'>
        <div className='relative'>
          {/* back cards */}
          <div className='absolute inset-0 translate-x-2 translate-y-2 rounded-2xl border border-base-300 bg-base-100/50' />
          <div className='absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border border-base-300 bg-base-100/30' />

          <AnimatePresence mode='wait'>
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -10, rotate: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className='relative rounded-2xl border border-base-300 bg-base-200 p-7 md:p-10 shadow-sm overflow-hidden'
            >
              <motion.div
                className='absolute inset-0 opacity-35'
                {...shimmerAnim}
                style={{
                  background:
                    'linear-gradient(120deg, rgba(236,72,153,.22), rgba(99,102,241,.22), rgba(34,197,94,.18))',
                  backgroundSize: '220% 220%',
                }}
              />
              <div className='relative'>
                <div className='text-sm text-gray-500'>
                  {'★'.repeat(current?.rating || 5)}
                  {'☆'.repeat(Math.max(0, 5 - (current?.rating || 5)))}
                </div>
                <p className='mt-4 text-base md:text-lg font-semibold leading-relaxed'>
                  “{current?.quote}”
                </p>

                <div className='mt-6 flex items-center justify-between gap-4'>
                  <div>
                    <div className='font-extrabold'>{current?.name}</div>
                    <div className='text-xs text-gray-500'>{current?.role}</div>
                  </div>
                  <div className='text-2xl'>💬</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
