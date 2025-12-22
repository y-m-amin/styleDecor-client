import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import axios from '../../api/axios';

const STATUS_STYLES = {
  pending: 'badge-warning',
  assigned: 'badge-info',
  planning_phase: 'badge-secondary',
  materials_prepared: 'badge-accent',
  on_the_way: 'badge-primary',
  setup_in_progress: 'badge-neutral',
  completed: 'badge-success',
  cancelled: 'badge-error',
};

const PAYMENT_STYLES = {
  unpaid: 'badge-error',
  initiated: 'badge-warning',
  paid: 'badge-success',
};

const formatCurrency = (amt) => `৳${amt?.toLocaleString() || 0}`;


export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [decorators, setDecorators] = useState([]);
  const [selectedDecorators, setSelectedDecorators] = useState([]);
  const [statusSaving, setStatusSaving] = useState(false);
  const [assignSaving, setAssignSaving] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);


  function MobileBookingSkeleton() {
  return (
    <div className="card bg-base-100 shadow-md p-4 space-y-2">
      <Skeleton width="40%" height={16} />
      <Skeleton width="30%" height={12} />
      <Skeleton width="70%" height={12} />
      <Skeleton width="60%" height={12} />
      <div className="flex justify-between pt-2">
        <Skeleton width={60} height={20} />
        <Skeleton width={80} height={32} />
      </div>
    </div>
  );
}

function DesktopBookingSkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i}>
          <Skeleton height={14} />
        </td>
      ))}
    </tr>
  );
}


  // Fetch bookings 
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/bookings', {
        params: { page, status: statusFilter },
      });

      setBookings(res.data.bookings || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed loading bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, page]);

  useEffect(() => {
  if (!loading) {
    setShowSkeleton(false);
    return;
  }

  const t = setTimeout(() => setShowSkeleton(true), 300);
  return () => clearTimeout(t);
}, [loading]);


  // Fetch active decorators for assignment
  const fetchDecorators = async () => {
    try {
      const res = await axios.get('/decorators/top', {
        params: { limit: 50 },
      });
      setDecorators(res.data.decorators || res.data);
    } catch (err) {
      console.error('Failed loading decorators', err);
    }
  };

  // Open assign modal
  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    setSelectedDecorators(
      booking.assignedDecorators?.map((d) => d.email) || []
    );
    fetchDecorators();
    setShowAssignModal(true);
  };

  const updateStatus = async (bookingId, newStatus) => {
    setStatusSaving(true);
    try {
      await axios.patch(`/admin/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      fetchBookings();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusSaving(false);
    }
  };

  const assignDecorators = async () => {
    setAssignSaving(true);
    try {
      await axios.patch(`/bookings/${selectedBooking._id}/assign`, {
        decoratorEmails: selectedDecorators,
      });
      setShowAssignModal(false);
      fetchBookings();
    } catch (err) {
      console.error('Failed to assign decorators:', err);
    } finally {
      setAssignSaving(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const searchStr = search.toLowerCase();
    return (
      b.bookingRef.toLowerCase().includes(searchStr) ||
      b.service?.service_name?.toLowerCase().includes(searchStr) ||
      b.userEmail?.toLowerCase().includes(searchStr)
    );
  });

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Manage Bookings</h1>

      {/* Filters */}
      <div className='flex gap-3 mb-4 flex-wrap'>
        <input
          type='text'
          placeholder='Search by booking ref, user or service...'
          className='input input-bordered flex-1'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className='select select-bordered'
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value=''>All Status</option>
          <option value='pending'>Pending</option>
          <option value='assigned'>Assigned</option>
          <option value='cancelled'>Cancelled</option>
          <option value='completed'>Completed</option>
        </select>

        <button className='btn btn-accent' onClick={fetchBookings}>
          Refresh
        </button>
      </div>

      {loading && showSkeleton ? (
  <>
    {/* ===== MOBILE / TABLET SKELETON ===== */}
    <div className="space-y-4 lg:hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <MobileBookingSkeleton key={i} />
      ))}
    </div>

    {/* ===== DESKTOP SKELETON ===== */}
    <div className="hidden lg:block overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Booking Ref</th>
            <th>User Email</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Decorators</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <DesktopBookingSkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  </>
) : filtered.length === 0 ? (
  <p className="text-gray-600">No bookings found.</p>
      ) : (
        <>
          {/* ===== MOBILE / TABLET VIEW ===== */}
          <div className='space-y-4 lg:hidden'>
            {filtered.map((b) => (
              <div
                key={b._id}
                className='card bg-base-100 shadow-md p-4 space-y-2'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='font-semibold'>{b.bookingRef}</p>
                    <p className='text-sm opacity-70'>
                      {new Date(b.bookingDate).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`badge ${
                      STATUS_STYLES[b.status] || 'badge-outline'
                    }`}
                  >
                    {b.status.replaceAll('_', ' ')}
                  </span>
                </div>

                <div className='text-sm'>
                  <p>
                    <span className='font-medium'>User:</span>{' '}
                    <a
                      href={`mailto:${b.customer?.email || b.userEmail}`}
                      className='text-blue-600 underline'
                    >
                      {b.customer?.email || b.userEmail}
                    </a>
                  </p>

                  <p>
                    <span className='font-medium'>Service:</span>{' '}
                    {b.serviceSnapshot?.service_name || '—'}
                  </p>

                  <p>
                    <span className='font-medium'>Decorators:</span>{' '}
                    {b.assignedDecorators?.length > 0
                      ? b.assignedDecorators
                          .map((d) => d.name || d.email)
                          .join(', ')
                      : '—'}
                  </p>
                </div>

                <div className="text-sm space-y-1">
  {b.payment?.originalAmount && (
    <p className="line-through opacity-50">
      Original: {formatCurrency(b.payment.originalAmount)}
    </p>
  )}

  {b.payment?.discount > 0 && (
    <p className="text-green-600">
      Discount: −{formatCurrency(b.payment.discount)}
    </p>
  )}

  <p className="font-semibold">
    Amount: {formatCurrency(b.payment.amount)}
  </p>

  {b.payment?.couponCode && (
    <span className="badge badge-success badge-sm">
      Coupon: {b.payment.couponCode}
    </span>
  )}
</div>


                <div className='flex justify-between items-center pt-2'>
                  <span
                    className={`badge ${
                      PAYMENT_STYLES[b.payment?.paymentStatus] ||
                      'badge-outline'
                    }`}
                  >
                    {b.payment?.paymentStatus || 'unknown'}
                  </span>

                  <button
                    className={`btn btn-sm ${
                      b.payment?.paymentStatus === 'paid'
                        ? 'btn-info'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={b.payment?.paymentStatus !== 'paid'}
                    onClick={() =>
                      b.payment?.paymentStatus === 'paid' && openAssignModal(b)
                    }
                  >
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ===== DESKTOP VIEW ===== */}
          <div className='hidden lg:block overflow-x-auto'>
            <table className='table table-zebra w-full'>
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>User Email</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Pricing</th>

                  <th>Payment</th>
                  <th>Decorators</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((b) => (
                  <tr key={b._id}>
                    <td>{b.bookingRef}</td>
                    <td>
                      <a
                        href={`mailto:${b.customer?.email || b.userEmail}`}
                        className='text-blue-600 underline'
                      >
                        {b.customer?.email || b.userEmail}
                      </a>
                    </td>
                    <td>{b.serviceSnapshot?.service_name || '—'}</td>
                    <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          STATUS_STYLES[b.status] || 'badge-outline'
                        }`}
                      >
                        {b.status.replaceAll('_', ' ')}
                      </span>
                    </td>
                    <td className="text-sm space-y-1">
  {b.payment?.originalAmount && (
    <div className="line-through opacity-50">
      {formatCurrency(b.payment.originalAmount)}
    </div>
  )}

  {b.payment?.discount > 0 && (
    <div className="text-green-600">
      −{formatCurrency(b.payment.discount)}
    </div>
  )}

  <div className="font-semibold">
    {formatCurrency(b.payment.amount)}
  </div>

  {b.payment?.couponCode && (
    <span className="badge badge-success badge-sm mt-1">
      {b.payment.couponCode}
    </span>
  )}
</td>

                    <td>
                      <span
                        className={`badge ${
                          PAYMENT_STYLES[b.payment?.paymentStatus] ||
                          'badge-outline'
                        }`}
                      >
                        {b.payment?.paymentStatus || 'unknown'}
                      </span>
                    </td>
                    <td>
                      {b.assignedDecorators?.length > 0
                        ? b.assignedDecorators
                            .map((d) => d.name || d.email)
                            .join(', ')
                        : '—'}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          b.payment?.paymentStatus === 'paid'
                            ? 'btn-info'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        disabled={b.payment?.paymentStatus !== 'paid'}
                        onClick={() =>
                          b.payment?.paymentStatus === 'paid' &&
                          openAssignModal(b)
                        }
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      <div className='flex justify-center gap-3 mt-4'>
        <button
          className='btn btn-sm'
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span className='px-4 py-1'>{page}</span>
        <button
          className='btn btn-sm'
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className='fixed inset-0 bg-black bg-blend-overlay flex items-center justify-center z-50'>
          <div className='bg-base-100 p-6 w-full max-w-lg rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4'>Assign Decorators</h2>

            <div className='space-y-2 max-h-60 overflow-y-auto'>
              {decorators.map((d) => (
                <label key={d.email} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    value={d.email}
                    checked={selectedDecorators.includes(d.email)}
                    onChange={(e) => {
                      const email = e.target.value;
                      setSelectedDecorators((prev) =>
                        prev.includes(email)
                          ? prev.filter((x) => x !== email)
                          : [...prev, email]
                      );
                    }}
                  />
                  <span className='font-medium'>
                    {d.displayName || d.email}
                  </span>
                </label>
              ))}
            </div>

            <div className='flex justify-end gap-3 mt-4'>
              <button
                className='btn btn-outline'
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button
                className='btn btn-accent text-white'
                onClick={assignDecorators}
                disabled={assignSaving}
              >
                {assignSaving ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
