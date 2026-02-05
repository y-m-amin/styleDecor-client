import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import Spinner from '../../Components/Spinner';
import { AuthContext } from '../../context/AuthContext';

const formatBDT = (n) => `৳${Number(n || 0).toLocaleString()}`;
const sanitizeCoupon = (code) => (code || '').trim().toUpperCase();
const na = (v) => (v === undefined || v === null || v === '' ? 'N/A' : v);

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // booking fields
  const [bookingDate, setBookingDate] = useState('');
  const [serviceMode, setServiceMode] = useState('offline');
  const [location, setLocation] = useState('');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // frontend preview coupons
  const TEST_COUPONS = useMemo(
    () => ({
      NEWUSER10: { type: 'percent', value: 10 },
      FLAT500: { type: 'flat', value: 500 },
    }),
    []
  );

  const couponNormalized = sanitizeCoupon(couponCode);

  const pricePreview = useMemo(() => {
    if (!service) return null;

    // Backward + forward compatible price read:
    // - new: basePrice (optional)
    // - old: cost
    const original = Number(service.basePrice ?? service.cost ?? 0);

    const coupon = couponNormalized ? TEST_COUPONS[couponNormalized] : null;

    if (!coupon) {
      return {
        original,
        discount: 0,
        final: original,
        isKnownCoupon: !couponNormalized,
      };
    }

    let discount = 0;
    if (coupon.type === 'percent') discount = Math.round(original * (coupon.value / 100));
    else discount = Number(coupon.value || 0);

    discount = Math.min(discount, original);

    return {
      original,
      discount,
      final: original - discount,
      isKnownCoupon: true,
    };
  }, [service, couponNormalized, TEST_COUPONS]);

  const fetchService = async () => {
    try {
      const res = await axios.get(`/services/${id}`);
      setService(res.data);
    } catch (err) {
      toast.error('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    fetchService();
  }, [id]);

  useEffect(() => {
    setCustomerEmail(user?.email || '');
  }, [user?.email]);

  const openBooking = () => {
    if (!user) return navigate('/login', { state: { from: `/services/${id}` } });
    if (role !== 'user') return toast.error('Only customers can book services');
    setIsModalOpen(true);
  };

  const closeBooking = () => setIsModalOpen(false);

  const handleBook = async () => {
    if (!user) return navigate('/login', { state: { from: `/services/${id}` } });
    if (role !== 'user') return toast.error('Only customers can book services');
    if (!bookingDate) return toast.error('Please choose a booking date');
    if (!customerEmail || !customerPhone) return toast.error('Email and phone are required');

    const couponToSend = couponNormalized || null;

    setIsBooking(true);
    try {
      await axios.post('/bookings', {
        serviceId: id,
        bookingDate,
        serviceMode,
        location,
        customerEmail,
        customerPhone,
        couponCode: couponToSend,
      });

      toast.success('Booking created! Check your My Bookings');
      closeBooking();
      navigate('/dashboard/my-bookings');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to book service');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <Spinner />;
  if (!service) return <p className='text-center text-gray-500'>Service not found</p>;

  // Backward + forward compatible reads
  const name = service.service_name ?? service.name ?? 'N/A';
  const category = service.service_category ?? service.category ?? '';
  const unit = service.unit ?? 'N/A';
  const image = service.image ?? service.coverImage ?? '';
  const description = service.description ?? service.details ?? '';

  // New doc ideas: gallery, tags, rating, duration, coverage
  const gallery = Array.isArray(service.gallery) ? service.gallery : [];
  const tags = Array.isArray(service.tags) ? service.tags : [];
  const includes = Array.isArray(service.includes) ? service.includes : [];
  const duration = service.durationHours ?? service.duration ?? null;
  const coverage = service.coverageAreas ?? service.coverage ?? null;
  const ratingAvg = service.ratingAvg ?? service.avgRating ?? null;
  const ratingCount = service.ratingCount ?? null;

  return (
    <div className='container mx-auto px-4 py-10'>
      {/* Top layout */}
      <div className='grid lg:grid-cols-12 gap-8'>
        {/* Media */}
        <div className='lg:col-span-7'>
          <div className='rounded-3xl overflow-hidden border border-base-300 bg-base-100 shadow-sm'>
            <div className='relative'>
              <img
                src={image || '/placeholder-service.jpg'}
                alt={name}
                className='w-full h-[280px] sm:h-[360px] object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent' />
              <div className='absolute bottom-4 left-4 right-4'>
                <div className='flex flex-wrap gap-2 items-center'>
                  <span className='inline-flex items-center rounded-full bg-base-100/80 backdrop-blur px-3 py-1 text-xs font-semibold border border-base-300'>
                    Category: {na(category)}
                  </span>
                  <span className='inline-flex items-center rounded-full bg-base-100/80 backdrop-blur px-3 py-1 text-xs font-semibold border border-base-300'>
                    Unit: {na(unit)}
                  </span>
                  <span className='inline-flex items-center rounded-full bg-base-100/80 backdrop-blur px-3 py-1 text-xs font-semibold border border-base-300'>
                    Rating: {ratingAvg != null ? `${Number(ratingAvg).toFixed(2)}` : 'N/A'}
                    {ratingCount != null ? ` (${ratingCount})` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Gallery (optional) */}
            {gallery.length > 0 ? (
              <div className='p-4 border-t border-base-300'>
                <div className='text-sm font-semibold mb-3'>Gallery</div>
                <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
                  {gallery.slice(0, 8).map((src, idx) => (
                    <img
                      key={`${src}-${idx}`}
                      src={src}
                      alt={`gallery-${idx}`}
                      className='h-20 sm:h-24 w-full object-cover rounded-xl border border-base-300'
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-service.jpg';
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Details / Actions */}
        <div className='lg:col-span-5'>
          <div className='rounded-3xl border border-base-300 bg-base-100 shadow-sm p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h1 className='text-2xl md:text-3xl font-extrabold tracking-tight'>
                  {na(name)}
                </h1>
                <div className='mt-2 text-sm text-gray-500'>
                  Created by: {na(service.createdByEmail ?? service.createdBy?.email)}
                </div>
              </div>

              <div className='text-right'>
                <div className='text-xs text-gray-500'>Starting at</div>
                <div className='text-2xl font-extrabold text-primary'>
                  {formatBDT(service.basePrice ?? service.cost)}
                </div>
                <div className='text-xs text-gray-500 mt-1'>{na(unit)}</div>
              </div>
            </div>

            <div className='mt-5 text-sm text-gray-600 leading-relaxed'>
              {description ? description : 'N/A'}
            </div>

            {/* Meta grid */}
            <div className='mt-6 grid grid-cols-2 gap-3'>
              <div className='rounded-2xl border border-base-300 bg-base-200 p-4'>
                <div className='text-xs text-gray-500'>Duration</div>
                <div className='font-semibold mt-1'>
                  {duration != null ? `${duration}` : 'N/A'}
                </div>
              </div>
              <div className='rounded-2xl border border-base-300 bg-base-200 p-4'>
                <div className='text-xs text-gray-500'>Coverage</div>
                <div className='font-semibold mt-1 line-clamp-2'>
                  {Array.isArray(coverage) ? coverage.join(', ') : na(coverage)}
                </div>
              </div>
            </div>

            {/* tags */}
            <div className='mt-5'>
              <div className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                Tags
              </div>
              <div className='mt-2 flex flex-wrap gap-2'>
                {tags.length > 0 ? (
                  tags.slice(0, 8).map((t) => (
                    <span
                      key={t}
                      className='px-3 py-1 rounded-full bg-base-200 border border-base-300 text-xs font-semibold'
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className='text-sm text-gray-500'>N/A</span>
                )}
              </div>
            </div>

            {/* includes */}
            <div className='mt-6'>
              <div className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                Includes
              </div>
              <div className='mt-2'>
                {includes.length > 0 ? (
                  <ul className='list-disc pl-5 text-sm text-gray-600 space-y-1'>
                    {includes.slice(0, 8).map((x, idx) => (
                      <li key={`${x}-${idx}`}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  <div className='text-sm text-gray-500'>N/A</div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className='mt-8 flex flex-col sm:flex-row gap-3'>
              <button
                onClick={openBooking}
                className='btn btn-primary flex-1'
              >
                Book Now
              </button>

              <Link to='/services' className='btn btn-outline flex-1'>
                Back to Services
              </Link>
            </div>

            {/* Login / role hints */}
            {!user ? (
              <div className='mt-4 rounded-2xl border border-base-300 bg-base-200 p-4 text-sm text-gray-600'>
                Please{' '}
                <Link to='/login' className='underline font-semibold'>
                  login
                </Link>{' '}
                to book this service.
              </div>
            ) : role !== 'user' ? (
              <div className='mt-4 rounded-2xl border border-base-300 bg-base-200 p-4 text-sm text-gray-600'>
                You are logged in as <b>{na(role)}</b>. Only customers can book services.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <dialog className='modal modal-open'>
          <div className='modal-box w-11/12 max-w-2xl rounded-3xl border border-base-300 bg-base-100'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <div className='text-xs font-bold tracking-widest uppercase text-gray-500'>
                  Booking
                </div>
                <h3 className='mt-1 text-xl md:text-2xl font-extrabold'>
                  {na(name)}
                </h3>
                <div className='mt-1 text-sm text-gray-500'>
                  Price: {formatBDT(service.basePrice ?? service.cost)} · {na(unit)}
                </div>
              </div>

              <button className='btn btn-ghost btn-sm' onClick={closeBooking}>
                ✕
              </button>
            </div>

            <div className='mt-6 grid md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold mb-1'>Booking Date</label>
                <input
                  type='date'
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className='input input-bordered w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold mb-1'>Service Mode</label>
                <select
                  value={serviceMode}
                  onChange={(e) => setServiceMode(e.target.value)}
                  className='select select-bordered w-full'
                >
                  <option value='offline'>Offline</option>
                  <option value='online'>Online</option>
                </select>
              </div>

              {serviceMode === 'offline' && (
                <div className='md:col-span-2'>
                  <label className='block text-sm font-semibold mb-1'>Location</label>
                  <input
                    type='text'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className='input input-bordered w-full'
                    placeholder='Event location (optional)'
                  />
                </div>
              )}

              <div>
                <label className='block text-sm font-semibold mb-1'>Contact Email</label>
                <input
                  type='email'
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className='input input-bordered w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold mb-1'>Phone Number</label>
                <input
                  type='text'
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className='input input-bordered w-full'
                  placeholder='01XXXXXXXXX'
                />
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold mb-1'>
                  Coupon Code <span className='text-gray-400'>(optional)</span>
                </label>
                <input
                  type='text'
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className='input input-bordered w-full'
                  placeholder='e.g. NEWUSER10'
                />
                {couponNormalized && pricePreview && pricePreview.isKnownCoupon === false && (
                  <p className='text-xs text-warning mt-1'>
                    Coupon preview not available. It will be validated when you book.
                  </p>
                )}
              </div>

              {pricePreview && (
                <div className='md:col-span-2 rounded-2xl border border-base-300 bg-base-200 p-4 text-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>Original</span>
                    <span className='font-semibold'>{formatBDT(pricePreview.original)}</span>
                  </div>

                  <div className='mt-2 flex items-center justify-between'>
                    <span className='text-gray-600'>Discount</span>
                    {pricePreview.discount > 0 ? (
                      <span className='font-semibold text-green-600'>
                        −{formatBDT(pricePreview.discount)}
                      </span>
                    ) : (
                      <span className='font-semibold'>{formatBDT(0)}</span>
                    )}
                  </div>

                  <div className='mt-3 flex items-center justify-between text-base'>
                    <span className='font-extrabold'>Final</span>
                    <span className='font-extrabold'>{formatBDT(pricePreview.final)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className='modal-action mt-6 flex gap-2'>
              <button className='btn btn-ghost' onClick={closeBooking} disabled={isBooking}>
                Cancel
              </button>
              <button className='btn btn-primary' onClick={handleBook} disabled={isBooking}>
                {isBooking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>

          <form method='dialog' className='modal-backdrop'>
            <button onClick={closeBooking}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
