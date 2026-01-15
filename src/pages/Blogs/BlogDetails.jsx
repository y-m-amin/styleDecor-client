import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { BLOGS, getBlogById } from './blogsData';

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const blog = getBlogById(id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!blog) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <div className='rounded-2xl border border-base-300 bg-base-100 p-8 text-center'>
          <div className='text-xl font-extrabold'>Blog not found</div>
          <p className='mt-2 text-gray-500'>The blog you’re looking for doesn’t exist.</p>
          <button className='btn btn-primary mt-5' onClick={() => navigate('/blogs')}>
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='mb-6 text-sm text-gray-500'>
        <Link to='/blogs' className='hover:underline'>Blogs</Link> / {blog.title}
      </div>

      <div className='rounded-2xl border border-base-300 bg-base-100 overflow-hidden'>
        <div className='h-56 md:h-80 w-full overflow-hidden'>
          <img src={blog.cover} alt={blog.title} className='h-full w-full object-cover' />
        </div>

        <div className='p-6 md:p-10'>
          <div className='flex flex-wrap gap-2 mb-4'>
            {blog.tags?.map((t) => (
              <span
                key={t}
                className='inline-flex items-center rounded-full border border-base-300 bg-base-200 px-3 py-1 text-xs font-semibold'
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight'>
            {blog.title}
          </h1>

          <div className='mt-3 text-sm text-gray-500'>
            {blog.date} • {blog.readTime}
          </div>

          <div className='mt-6 space-y-4 text-base leading-relaxed'>
            {blog.content?.map((block, idx) => {
              if (block.type === 'h2') {
                return (
                  <h2 key={idx} className='text-xl md:text-2xl font-extrabold mt-8'>
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'h3') {
                return (
                  <h3 key={idx} className='text-lg md:text-xl font-extrabold mt-6'>
                    {block.text}
                  </h3>
                );
              }
              if (block.type === 'ul') {
                return (
                  <ul key={idx} className='list-disc pl-6 space-y-2 text-gray-700'>
                    {block.items?.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className='text-gray-700'>
                  {block.text}
                </p>
              );
            })}
          </div>

          <div className='mt-10 flex flex-col sm:flex-row gap-3'>
            <button className='btn btn-primary' onClick={() => navigate('/services')}>
              Browse Services
            </button>
            <button className='btn btn-outline' onClick={() => navigate('/blogs')}>
              Back to Blogs
            </button>
          </div>
        </div>
      </div>

      {/* Next reads */}
      <div className='mt-10'>
        <div className='text-lg font-extrabold mb-4'>More reads</div>
        <div className='grid md:grid-cols-3 gap-6'>
          {BLOGS.filter((b) => b.id !== blog.id).map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/blogs/${b.id}`)}
              className='text-left rounded-2xl border border-base-300 bg-base-100 overflow-hidden hover:shadow-md transition'
            >
              <div className='h-36 w-full overflow-hidden'>
                <img src={b.cover} alt={b.title} className='h-full w-full object-cover' />
              </div>
              <div className='p-5'>
                <div className='text-xs text-gray-500'>{b.date} • {b.readTime}</div>
                <div className='mt-2 font-extrabold'>{b.title}</div>
                <div className='mt-2 text-sm text-gray-500 line-clamp-2'>{b.excerpt}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
