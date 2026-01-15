import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BLOGS } from './blogsData';

export default function Blogs() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='flex items-end justify-between gap-4 mb-7'>
        <div>
          <div className='text-xs font-bold tracking-widest uppercase text-gray-500'>
            Learn
          </div>
          <h1 className='mt-2 text-3xl md:text-4xl font-extrabold tracking-tight'>
            Ideas & Inspiration
          </h1>
          <p className='mt-2 text-sm md:text-base text-gray-500 max-w-2xl'>
            Trends, checklists, and planning shortcuts for better-looking events.
          </p>
        </div>

        <button
          className='btn btn-outline btn-sm md:btn-md'
          onClick={() => navigate('/services')}
        >
          Browse Services →
        </button>
      </div>

      <div className='grid lg:grid-cols-12 gap-6'>
        {/* Featured */}
        <button
          onClick={() => navigate(`/blogs/${BLOGS[0]?.id}`)}
          className='lg:col-span-7 text-left rounded-2xl border border-base-300 bg-base-200 overflow-hidden hover:shadow-md transition'
        >
          <div className='h-52 md:h-64 w-full overflow-hidden'>
            <img
              src={BLOGS[0]?.cover}
              alt={BLOGS[0]?.title}
              className='h-full w-full object-cover'
            />
          </div>
          <div className='p-6 md:p-7'>
            <div className='inline-flex items-center rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-semibold'>
              Featured
            </div>
            <div className='mt-3 text-2xl md:text-3xl font-extrabold'>
              {BLOGS[0]?.title}
            </div>
            <div className='mt-2 text-sm text-gray-600'>{BLOGS[0]?.excerpt}</div>

            <div className='mt-5 flex items-center justify-between text-xs text-gray-500'>
              <div>
                {BLOGS[0]?.date} • {BLOGS[0]?.readTime}
              </div>
              <div className='font-bold'>Read →</div>
            </div>
          </div>
        </button>

        {/* Others */}
        <div className='lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-6'>
          {BLOGS.slice(1).map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/blogs/${b.id}`)}
              className='text-left rounded-2xl border border-base-300 bg-base-100 overflow-hidden hover:shadow-md transition'
            >
              <div className='h-40 w-full overflow-hidden'>
                <img src={b.cover} alt={b.title} className='h-full w-full object-cover' />
              </div>
              <div className='p-6'>
                <div className='text-xs text-gray-500'>
                  {b.date} • {b.readTime}
                </div>
                <div className='mt-2 font-extrabold'>{b.title}</div>
                <div className='mt-2 text-sm text-gray-500'>{b.excerpt}</div>
                <div className='mt-4 text-sm font-extrabold'>Read →</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
