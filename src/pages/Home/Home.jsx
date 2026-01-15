import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from '../../api/axios';
import MapComponent from '../../components/MapComponent';
import ServiceCard from '../../components/ServiceCard';
import SkeletonCard from '../../components/SkeletonCard';
import { SmoothScrollProvider } from '../../Components/SmoothScrollProvider';
import CategoriesSection from './CategoriesSection';
import Hero from './Hero';
import HighlightsSection from './HighlightsSection';
import HowItWorksSection from './HowItWorksSection';
import Statistics from './Statistics';

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

export function Badge({ children }) {
  return (
    <span className='inline-flex items-center rounded-full border border-base-300 bg-base-100/70 px-3 py-1 text-xs font-semibold backdrop-blur'>
      {children}
    </span>
  );
}

export function SectionTitle({ eyebrow, title, desc, align = 'left' }) {
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
      <div className='pointer-events-none absolute inset-0 bg-linear-to-r from-base-200 via-transparent to-base-200' />
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
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
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
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 18,
                  delay: 0.08 * i,
                }}
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
  const [zones, setZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const navigate = useNavigate();

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
        const res = await axios.get('/services', { params: { limit: 8 } });
        setServices(res.data.services || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await axios.get('/coverage-zones');
        setZones(res.data.zones);
        setFilteredZones(res.data.zones);
      } catch (err) {
        console.error('Failed to load coverage zones', err);
      }
    };
    fetchZones();
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

  return (
    <SmoothScrollProvider options={{ duration: 1.2, smooth: true }}>
      <div className='overflow-x-hidden'>
        {/* 1) Hero (keep your existing component) */}
        <Hero />

        {/* 2) Categories  */}
        <CategoriesSection SectionTitle={SectionTitle} Badge={Badge} />

        {/* 3) Popular Services  */}
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

        {/* 4) How it works  */}
        <HowItWorksSection />

        {/* 5) Highlights */}
        <HighlightsSection />

        {/* 6) Statistics */}
        <Statistics stats={stats} />

        {/* 7) Top Decorators  */}
        <section className='py-14'>
          <div className='container mx-auto px-4'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6'>
              <SectionTitle
                eyebrow='Top rated'
                title='Top Decorators'
                desc='Discover pros with standout reviews and specialties.'
              />
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
                            transition={{
                              type: 'spring',
                              stiffness: 260,
                              damping: 16,
                            }}
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

        {/* 8) Testimonials  */}
        <section className='py-14 bg-base-200'>
          <div className='container mx-auto px-4'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
              <SectionTitle
                eyebrow='Trust'
                title='What Customers Say'
                desc='Feedback that tells the real story.'
              />
              {/* <button
                onClick={() => navigate('/reviews')}
                className='btn btn-outline btn-sm md:btn-md'
              >
                View Reviews →
              </button> */}
            </div>

            <TestimonialStack testimonials={testimonials} />
          </div>
        </section>

        {/* 9) Blog / Tips  */}
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
                    <div className='text-xs text-gray-500'>
                      {blogs?.[0]?.date}
                    </div>
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
                    <div className='mt-2 text-sm text-gray-500'>
                      {b.excerpt}
                    </div>
                    <div className='mt-4 text-sm font-extrabold'>Read →</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* 10) Newsletter  */}
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

        {/* 11) FAQ  */}
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

        {/* 13) Map */}
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
              <MapComponent
                center={[23.8103, 90.4125]}
                zoom={7}
                zones={filteredZones}
                markers={filteredZones.map((z) => ({
                  position: [z.center.lat, z.center.lng],
                  popupText: z.name,
                }))}
              />
            </motion.div>
          </div>
        </section>

        {/* 14) Final CTA  */}
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
                    {/* <button
                      onClick={() => navigate('/decorators')}
                      className='btn btn-outline md:btn-lg'
                    >
                      Find Decorators
                    </button> */}
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
                        {
                          t: 'Wedding stage + aisle',
                          s: 'Luxury + soft lights',
                        },
                        { t: 'Birthday balloon arch', s: 'Theme + backdrop' },
                        {
                          t: 'Corporate branding',
                          s: 'Stage + booth + signage',
                        },
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
                            <div className='text-xs text-gray-500 mt-1'>
                              {x.s}
                            </div>
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
    </SmoothScrollProvider>
  );
}

/** NEW: testimonial stack with auto-advance + swipeable feel (no external libs) */
function TestimonialStack({ testimonials = [] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!testimonials.length) return;
    const t = setInterval(
      () => setIdx((p) => (p + 1) % testimonials.length),
      4500
    );
    return () => clearInterval(t);
  }, [testimonials.length]);

  const current = testimonials[idx] || testimonials[0];

  const next = () => setIdx((p) => (p + 1) % testimonials.length);
  const prev = () =>
    setIdx((p) => (p - 1 + testimonials.length) % testimonials.length);

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
