import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import axios from '../../api/axios';

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

  // Fetch bookings (with pagination and optional status filter)
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/bookings', {
        params: { page, status: statusFilter },
      });

      setBookings(res.data.bookings || res.data);
      setTotalPages(res.data.totalPages || 1); // adapt if backend gives different field
    } catch (err) {
      console.error('Failed loading bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, page]);

  // Fetch active decorators for assignment
  const fetchDecorators = async () => {
    try {
      const res = await axios.get('/decorators/top', {
        params: { limit: 100 },
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
      await axios.patch(`/bookings/${bookingId}`, { status: newStatus });
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

      {loading ? (
        <Skeleton count={5} height={60} />
      ) : filtered.length === 0 ? (
        <p className='text-gray-600'>No bookings found.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='table table-zebra w-full'>
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>User Email</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Decorators</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
                  {/* Email mailto */}
                  <td>{b.bookingRef}</td>
                  <td>
                    <a
                      href={`mailto:${b.customer?.email || b.userEmail}`}
                      className='text-blue-600 underline'
                    >
                      {b.customer?.email || b.userEmail}
                    </a>
                  </td>
                  <td>{b.service?.service_name || '-'}</td>
                  <td>{new Date(b.bookingDate).toLocaleDateString()}</td>

                  {/* Status dropdown */}
                  <td>
                    <select
                      className='select select-sm'
                      value={b.status}
                      onChange={(e) => updateStatus(b._id, e.target.value)}
                      disabled={statusSaving}
                    >
                      <option value='pending'>pending</option>
                      <option value='assigned'>assigned</option>
                      <option value='planning_phase'>planning_phase</option>
                      <option value='materials_prepared'>
                        materials_prepared
                      </option>
                      <option value='on_the_way'>on_the_way</option>
                      <option value='setup_in_progress'>
                        setup_in_progress
                      </option>
                      <option value='completed'>completed</option>
                      <option value='cancelled'>cancelled</option>
                    </select>
                  </td>

                  {/* Decorators list */}
                  <td>
                    {b.assignedDecorators?.length > 0
                      ? b.assignedDecorators
                          .map((d) => d.name || d.email)
                          .join(', ')
                      : '—'}
                  </td>

                  {/* Actions */}
                  <td>
                    <button
                      className='btn btn-sm btn-info mr-2'
                      onClick={() => openAssignModal(b)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
