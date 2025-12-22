import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import Spinner from '../../Components/Spinner';
import { AuthContext } from '../../context/AuthContext';

const formatBDT = (n) => `৳${Number(n || 0).toLocaleString()}`;

const sanitizeCoupon = (code) => (code || '').trim().toUpperCase();

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookingDate, setBookingDate] = useState('');
  const [serviceMode, setServiceMode] = useState('offline');
  const [location, setLocation] = useState('');

  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const [isBooking, setIsBooking] = useState(false);

  // Only for frontend preview. Must match backend COUPONS or booking will fail.
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

    const original = Number(service.cost || 0);
    const coupon = couponNormalized ? TEST_COUPONS[couponNormalized] : null;

    // If user typed a coupon but it's not in preview list, we still show final = original,

    if (!coupon) {
      return {
        original,
        discount: 0,
        final: original,
        isKnownCoupon: !couponNormalized, // true if empty, false if typed unknown
      };
    }

    let discount = 0;
    if (coupon.type === 'percent') {
      discount = Math.round(original * (coupon.value / 100));
    } else {
      discount = Number(coupon.value || 0);
    }

    // clamp discount so final never goes negative
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

  const handleBook = async () => {
    if (!user)
      return navigate('/login', { state: { from: `/services/${id}` } });
    if (role !== 'user') return toast.error('Only customers can book services');
    if (!bookingDate) return toast.error('Please choose a booking date');
    if (!customerEmail || !customerPhone)
      return toast.error('Email and phone are required');

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
      navigate('/dashboard/my-bookings');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to book service');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <Spinner />;
  if (!service)
    return <p className='text-center text-gray-500'>Service not found</p>;

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 space-y-8'>
      <div className='bg-base-300 shadow-md rounded-lg overflow-hidden'>
        <img
          src={service.image || '/placeholder-service.jpg'}
          alt={service.service_name}
          className='w-full h-64 object-cover'
        />
        <div className='p-6 space-y-4'>
          <h1 className='text-2xl font-bold text-gray-100'>
            {service.service_name}
          </h1>
          <div className='flex items-center gap-4'>
            <span className='text-lg text-accent font-semibold'>
              {formatBDT(service.cost)}
            </span>
            <span className='text-sm text-gray-300 uppercase'>
              {service.unit} units
            </span>
          </div>
          <p className='text-base leading-relaxed'>{service.description}</p>
        </div>
      </div>

      {/* Booking Form */}
      {role === 'user' ? (
        <div className='bg-base-300 shadow-inner rounded-lg p-6 space-y-6'>
          <h2 className='text-xl font-semibold text-gray-100'>
            Book This Service
          </h2>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Booking Date
            </label>
            <input
              type='date'
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className='input input-bordered w-full'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Service Mode
            </label>
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
            <div>
              <label className='block text-sm font-medium mb-1'>Location</label>
              <input
                type='text'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className='input input-bordered w-full'
              />
            </div>
          )}

          <div>
            <label className='block text-sm font-medium mb-1'>
              Contact Email
            </label>
            <input
              type='email'
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className='input input-bordered w-full'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Phone Number
            </label>
            <input
              type='text'
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className='input input-bordered w-full'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Coupon Code (optional)
            </label>
            <input
              type='text'
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className='input input-bordered w-full'
              placeholder='e.g. NEWUSER10'
            />
            {couponNormalized &&
              pricePreview &&
              pricePreview.isKnownCoupon === false && (
                <p className='text-xs text-warning mt-1'>
                  Coupon preview not available. It will be validated when you
                  book.
                </p>
              )}
          </div>

          {/*   price box (final price included) */}
          {pricePreview && (
            <div className='bg-base-100 border border-base-300 rounded p-3 text-sm'>
              <p>Original: {formatBDT(pricePreview.original)}</p>

              {pricePreview.discount > 0 ? (
                <p className='text-green-600'>
                  Discount: −{formatBDT(pricePreview.discount)}
                </p>
              ) : (
                <p className='opacity-70'>Discount: {formatBDT(0)}</p>
              )}

              <p className='font-semibold'>
                Final Price: {formatBDT(pricePreview.final)}
              </p>
            </div>
          )}

          <button
            onClick={handleBook}
            className='btn btn-primary w-full'
            disabled={isBooking}
          >
            {isBooking ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      ) : user ? (
        <div className='bg-yellow-100 text-yellow-800 p-4 rounded'>
          <p>Only customers can book services.</p>
        </div>
      ) : (
        <div className='bg-blue-100 text-blue-700 p-4 rounded'>
          <p>
            Please{' '}
            <Link to='/login' className='underline font-medium text-blue-900'>
              login
            </Link>{' '}
            to book this service.
          </p>
        </div>
      )}
    </div>
  );
}
