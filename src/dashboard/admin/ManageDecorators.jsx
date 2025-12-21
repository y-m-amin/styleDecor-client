import { useEffect, useState } from 'react';
import axios from '../../api/axios';

export default function ManageDecorators() {
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const fetchDecorators = async () => {
    try {
      setLoading(true);

      const params = {};
      if (status !== 'all') params.status = status;

      const res = await axios.get('/decorators', { params });
      setDecorators(res.data.decorators);
    } catch (err) {
      console.error('Failed to load decorators', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecorators();
  }, [status]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const endpoint =
        newStatus === 'active'
          ? `/decorators/${id}/activate`
          : `/decorators/${id}/disable`;

      await axios.patch(endpoint);
      fetchDecorators();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filtered = decorators.filter(
    (d) =>
      d.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Manage Decorators</h1>
      <div className='flex gap-2 mb-4'>
        {['all', 'pending', 'active', 'disabled'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`btn btn-sm ${
              status === s ? 'btn-primary' : 'btn-outline'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <input
        type='text'
        placeholder='Search by name or email...'
        className='input input-bordered w-full mb-4'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading decorators...</p>
      ) : (
        <div className='overflow-x-auto mx-auto'>
          <table className='table table-zebra w-full'>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialties</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d._id}>
                  <td>
                    <img
                      src={d.photoURL}
                      alt='avatar'
                      className='w-10 h-10 rounded-full'
                    />
                  </td>
                  <td>{d.displayName || 'N/A'}</td>
                  <td>{d.email}</td>
                  <td>{d.specialties?.join(', ') || '—'}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        d.decoratorStatus === 'active'
                          ? 'bg-green-200 text-green-800'
                          : d.decoratorStatus === 'disabled'
                          ? 'bg-red-200 text-red-800'
                          : d.decoratorStatus === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {d.decoratorStatus}
                    </span>
                  </td>
                  <td>{d.rating?.toFixed(1) || '0.0'}</td>
                  <td className='space-x-2'>
                    {d.decoratorStatus === 'pending' && (
                      <button
                        className='btn btn-sm btn-success'
                        onClick={() => handleStatusChange(d._id, 'active')}
                      >
                        Approve
                      </button>
                    )}

                    {d.decoratorStatus === 'active' && (
                      <button
                        className='btn btn-sm btn-warning'
                        onClick={() => handleStatusChange(d._id, 'disabled')}
                      >
                        Disable
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
