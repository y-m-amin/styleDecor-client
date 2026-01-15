import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

const money = (n) => `৳${Number(n || 0).toLocaleString('en-BD')}`;

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);

  const {
    _id,
    service_name,
    description,
    coverImage,
    image,
    basePrice,
    cost,
    unit,
    service_category,
    tags = [],
    isFeatured,
    slug,
  } = service;

  const handleView = () => {
    navigate(`/services/${slug || _id}`);
  };

  return (
    <div
      className={`group relative bg-base-100 rounded-2xl border border-base-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col`}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className='absolute top-3 left-3 z-10 badge badge-secondary badge-sm font-semibold'>
          Featured
        </div>
      )}

      {/* Image */}
      <div className='relative h-48 overflow-hidden'>
        <img
          src={coverImage || image || '/placeholder-service.jpg'}
          alt={service_name}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />

        {/* Category pill */}
        {service_category && (
          <div className='absolute bottom-3 left-3 badge badge-outline bg-base-100/80 backdrop-blur text-xs capitalize'>
            {service_category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-5 flex flex-col grow'>
        <h3 className='text-lg font-bold text-base-content leading-snug'>
          {service_name}
        </h3>

        <p className='mt-1 text-sm text-base-content/60 line-clamp-2'>
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className='mt-3 flex flex-wrap gap-2'>
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className='badge badge-ghost badge-sm text-xs'>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className='mt-auto pt-5 flex items-center justify-between'>
          <div>
            <div className='text-base font-bold text-primary'>
              {money(basePrice ?? cost)}
            </div>
            <div className='text-xs text-base-content/50'>
              {unit || 'per service'}
            </div>
          </div>

          <button
            onClick={handleView}
            className='btn btn-primary btn-sm md:btn-md'
          >
            {user && role === 'user' ? 'View & Book' : 'View'}
          </button>
        </div>
      </div>
    </div>
  );
}
