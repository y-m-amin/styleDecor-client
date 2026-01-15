import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../../api/axios';

const formatBDT = (n) => `৳${Number(n || 0).toLocaleString()}`;
const na = (v) => (v === undefined || v === null || v === '' ? 'N/A' : v);

const toCSV = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');
const csvToArray = (s) =>
  String(s || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | null
  const [selectedService, setSelectedService] = useState(null);

  const [totalServices, setTotalServices] = useState(0);

  /** PAGINATION **/
  const [page, setPage] = useState(1);
  const limit = 6;
  const [totalPages, setTotalPages] = useState(1);

  /** LOCAL UI FILTERS (frontend only) **/
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all'); // category dropdown from loaded data

  /** FORM **/
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      price: '',
      unit: '',
      category: '',
      description: '',
      coverImage: '',
      imageFile: null,

      // new optional
      status: 'active',
      isFeatured: false,
      durationHours: '',
      availableModes: 'offline, online',
      coverageAreas: '',
      tags: '',
      includes: '',
      excludes: '',
      gallery: '',
      ratingAvg: '',
      ratingCount: '',
    },
  });

  const watchedFile = watch('imageFile');

  /** FETCH SERVICES **/
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/services?page=${page}&limit=${limit}`);
      setServices(res.data.services || []);
      setTotalServices(res.data.total || 0);
      setTotalPages(Math.ceil((res.data.total || 0) / limit));
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

  const closeModal = () => {
    setModalType(null);
    setSelectedService(null);
    reset();
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
      { method: 'POST', body: formData }
    );

    const data = await res.json();
    return data?.data?.url || '';
  };

  const onSubmit = async (data) => {
    try {
      // cover image priority:
      // 1) uploaded file
      // 2) manual url input
      // 3) existing service image
      let finalCover =
        (data.coverImage || '').trim() ||
        selectedService?.coverImage ||
        selectedService?.image ||
        '';

      if (data.imageFile?.length) {
        const uploaded = await uploadImage(data.imageFile[0]);
        if (uploaded) finalCover = uploaded;
      }

      const priceNum = Number(data.price || 0);

      // payload supports old + new backend
      const payload = {
        // legacy keys (keep old pages + old DB)
        service_name: data.name,
        cost: priceNum,
        unit: data.unit,
        service_category: data.category,
        description: data.description || '',
        image: finalCover,

        // new keys (backend should store + normalize)
        basePrice: priceNum,
        coverImage: finalCover,
        status: data.status || 'active',
        isFeatured: Boolean(data.isFeatured),
        durationHours: data.durationHours ? Number(data.durationHours) : null,
        availableModes: csvToArray(data.availableModes),
        coverageAreas: csvToArray(data.coverageAreas),
        tags: csvToArray(data.tags),
        includes: csvToArray(data.includes),
        excludes: csvToArray(data.excludes),
        gallery: csvToArray(data.gallery),
        ratingAvg: data.ratingAvg === '' ? null : Number(data.ratingAvg),
        ratingCount: data.ratingCount === '' ? null : Number(data.ratingCount),
      };

      if (modalType === 'add') {
        await axios.post('/services', payload);
      } else if (modalType === 'edit' && selectedService?._id) {
        await axios.patch(`/services/${selectedService._id}`, payload);
      }

      await fetchServices();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const onEdit = (service) => {
    setSelectedService(service);

    const price = service.basePrice ?? service.cost ?? '';
    const cover = service.coverImage ?? service.image ?? '';

    setValue('name', service.service_name ?? '');
    setValue('price', price);
    setValue('unit', service.unit ?? '');
    setValue('category', service.service_category ?? '');
    setValue('description', service.description ?? '');
    setValue('coverImage', cover);

    // new optional fields (safe defaults)
    setValue('status', service.status ?? 'active');
    setValue('isFeatured', Boolean(service.isFeatured));
    setValue('durationHours', service.durationHours ?? '');
    setValue('availableModes', toCSV(service.availableModes || ['offline', 'online']));
    setValue('coverageAreas', toCSV(service.coverageAreas || []));
    setValue('tags', toCSV(service.tags || []));
    setValue('includes', toCSV(service.includes || []));
    setValue('excludes', toCSV(service.excludes || []));
    setValue('gallery', toCSV(service.gallery || []));
    setValue('ratingAvg', service.ratingAvg ?? '');
    setValue('ratingCount', service.ratingCount ?? '');

    setModalType('edit');
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    await axios.delete(`/services/${id}`);
    fetchServices();
  };

  /** Derive category options from current page results
   *  (If you want all categories, call /services/categories)
   */
  const categoryOptions = useMemo(() => {
    const set = new Set();
    services.forEach((s) => {
      if (s?.service_category) set.add(s.service_category);
    });
    return ['all', ...Array.from(set).sort()];
  }, [services]);

  const filteredServices = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return services.filter((s) => {
      const name = String(s.service_name || '').toLowerCase();
      const catVal = String(s.service_category || '');
      const matchesQ = !qq || name.includes(qq);
      const matchesCat = cat === 'all' ? true : catVal === cat;
      return matchesQ && matchesCat;
    });
  }, [services, q, cat]);

  return (
    <div className='p-4 md:p-8 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6'>
        <div>
          <div className='text-xs font-bold tracking-widest uppercase text-gray-500'>
            Admin
          </div>
          <h1 className='text-2xl md:text-3xl font-extrabold tracking-tight'>
            Manage Services
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Create, update and maintain your marketplace services.
          </p>
        </div>

        <button
          className='btn btn-primary'
          onClick={() => {
            setSelectedService(null);
            reset({
              name: '',
              price: '',
              unit: '',
              category: '',
              description: '',
              coverImage: '',
              status: 'active',
              isFeatured: false,
              durationHours: '',
              availableModes: 'offline, online',
              coverageAreas: '',
              tags: '',
              includes: '',
              excludes: '',
              gallery: '',
              ratingAvg: '',
              ratingCount: '',
            });
            setModalType('add');
          }}
        >
          + Add New Service
        </button>
      </div>

      {/* Summary row */}
      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        <div className='rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm'>
          <div className='text-xs text-gray-500'>Total Services</div>
          <div className='text-2xl font-extrabold mt-1'>{totalServices}</div>
        </div>
        <div className='rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm'>
          <div className='text-xs text-gray-500'>On this page</div>
          <div className='text-2xl font-extrabold mt-1'>{services.length}</div>
        </div>
        <div className='rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm'>
          <div className='text-xs text-gray-500'>Current Page</div>
          <div className='text-2xl font-extrabold mt-1'>{page}</div>
        </div>
        <div className='rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm'>
          <div className='text-xs text-gray-500'>Pages</div>
          <div className='text-2xl font-extrabold mt-1'>{totalPages}</div>
        </div>
      </div>

      {/* Filters */}
      <div className='rounded-2xl border border-base-300 bg-base-100 p-4 md:p-5 shadow-sm mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-3 items-end'>
          <div className='md:col-span-6'>
            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Search
            </label>
            <input
              className='input input-bordered w-full mt-1'
              placeholder='Search by service name...'
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className='md:col-span-3'>
            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Category
            </label>
            <select
              className='select select-bordered w-full mt-1'
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
              {categoryOptions.map((x) => (
                <option key={x} value={x}>
                  {x === 'all' ? 'All Categories' : x}
                </option>
              ))}
            </select>
          </div>

          <div className='md:col-span-3 flex gap-2'>
            <button
              className='btn btn-outline w-full'
              onClick={() => {
                setQ('');
                setCat('all');
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table/List */}
      <div className='rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden'>
        <div className='hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-base-200 border-b border-base-300 text-xs font-bold tracking-wider uppercase text-gray-500'>
          <div className='col-span-5'>Service</div>
          <div className='col-span-3'>Category</div>
          <div className='col-span-2'>Price</div>
          <div className='col-span-2 text-right'>Actions</div>
        </div>

        {loading ? (
          <div className='p-6'>Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>No services found.</div>
        ) : (
          <div className='divide-y divide-base-300'>
            {filteredServices.map((s) => {
              const cover = s.coverImage ?? s.image ?? '';
              const price = s.basePrice ?? s.cost ?? 0;

              return (
                <div
                  key={s._id}
                  className='grid grid-cols-1 md:grid-cols-12 gap-4 px-5 py-4 items-start md:items-center'
                >
                  <div className='md:col-span-5 flex gap-3 items-start'>
                    <img
                      src={cover || '/placeholder-service.jpg'}
                      alt={s.service_name}
                      className='h-12 w-12 rounded-xl border border-base-300 object-cover'
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-service.jpg';
                      }}
                    />
                    <div className='min-w-0'>
                      <div className='font-semibold leading-tight line-clamp-1'>
                        {na(s.service_name)}
                      </div>
                      <div className='text-xs text-gray-500 mt-1 line-clamp-2'>
                        {na(s.description)}
                      </div>

                      <div className='mt-2 flex flex-wrap gap-2'>
                        <span className='px-2.5 py-1 rounded-full text-[11px] font-semibold border border-base-300 bg-base-200'>
                          Unit: {na(s.unit)}
                        </span>

                        <span className='px-2.5 py-1 rounded-full text-[11px] font-semibold border border-base-300 bg-base-200'>
                          Status: {na(s.status ?? 'active')}
                        </span>

                        {s.isFeatured ? (
                          <span className='px-2.5 py-1 rounded-full text-[11px] font-semibold border border-base-300 bg-base-200'>
                            Featured
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className='md:col-span-3'>
                    <div className='text-sm font-semibold'>{na(s.service_category)}</div>
                    <div className='text-xs text-gray-500 mt-1'>
                      slug: {na(s.service_category_slug)}
                    </div>
                  </div>

                  <div className='md:col-span-2'>
                    <div className='text-sm font-extrabold'>{formatBDT(price)}</div>
                    <div className='text-xs text-gray-500'>{na(s.unit)}</div>
                  </div>

                  <div className='md:col-span-2 flex md:justify-end gap-2'>
                    <button className='btn btn-sm btn-outline' onClick={() => onEdit(s)}>
                      Edit
                    </button>
                    <button
                      className='btn btn-sm btn-error text-white'
                      onClick={() => onDelete(s._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-6'>
          <div className='join'>
            <button
              className='join-item btn'
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              «
            </button>

            <button className='join-item btn'>
              Page {page} / {totalPages}
            </button>

            <button
              className='join-item btn'
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <dialog className='modal modal-open'>
          <div className='modal-box w-11/12 max-w-3xl rounded-3xl border border-base-300 bg-base-100'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <div className='text-xs font-bold tracking-widest uppercase text-gray-500'>
                  {modalType === 'add' ? 'Create' : 'Update'}
                </div>
                <h2 className='text-xl md:text-2xl font-extrabold mt-1'>
                  {modalType === 'add' ? 'Add New Service' : 'Edit Service'}
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  Fields like gallery/tags are optional. Old services won’t break.
                </p>
              </div>

              <button className='btn btn-ghost btn-sm' onClick={closeModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='mt-6 space-y-5'>
              {/* Basic */}
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-semibold'>Service Name *</label>
                  <input
                    className='input input-bordered w-full mt-1'
                    placeholder='e.g. Anniversary Decoration'
                    {...register('name', { required: true })}
                  />
                </div>

                <div>
                  <label className='text-sm font-semibold'>Category *</label>
                  <input
                    className='input input-bordered w-full mt-1'
                    placeholder='e.g. anniversary'
                    {...register('category', { required: true })}
                  />
                </div>

                <div>
                  <label className='text-sm font-semibold'>Price (BDT) *</label>
                  <input
                    type='number'
                    className='input input-bordered w-full mt-1'
                    placeholder='e.g. 22000'
                    {...register('price', { required: true })}
                  />
                </div>

                <div>
                  <label className='text-sm font-semibold'>Unit *</label>
                  <input
                    className='input input-bordered w-full mt-1'
                    placeholder='e.g. per event'
                    {...register('unit', { required: true })}
                  />
                </div>
              </div>

              <div>
                <label className='text-sm font-semibold'>Description</label>
                <textarea
                  className='textarea textarea-bordered w-full mt-1 min-h-[100px]'
                  placeholder='Write what’s included...'
                  {...register('description')}
                />
              </div>

              {/* Media */}
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-semibold'>Cover Image URL</label>
                  <input
                    className='input input-bordered w-full mt-1'
                    placeholder='https://...'
                    {...register('coverImage')}
                  />
                  <div className='text-xs text-gray-500 mt-1'>
                    If you upload a file, it will override this URL.
                  </div>
                </div>

                <div>
                  <label className='text-sm font-semibold'>Upload Image</label>
                  <input
                    type='file'
                    className='file-input file-input-bordered w-full mt-1'
                    {...register('imageFile')}
                  />
                  <div className='text-xs text-gray-500 mt-1'>
                    {watchedFile?.length ? 'Selected file ready to upload.' : 'Optional.'}
                  </div>
                </div>
              </div>

              {/* New optional fields */}
              <div className='grid md:grid-cols-3 gap-4'>
                <div>
                  <label className='text-sm font-semibold'>Status</label>
                  <select className='select select-bordered w-full mt-1' {...register('status')}>
                    <option value='active'>active</option>
                    <option value='inactive'>inactive</option>
                    <option value='draft'>draft</option>
                  </select>
                </div>

                <div className='flex items-end gap-3'>
                  <label className='label cursor-pointer gap-3'>
                    <span className='text-sm font-semibold'>Featured</span>
                    <input type='checkbox' className='toggle' {...register('isFeatured')} />
                  </label>
                </div>

                <div>
                  <label className='text-sm font-semibold'>Duration Hours</label>
                  <input
                    type='number'
                    className='input input-bordered w-full mt-1'
                    placeholder='e.g. 4'
                    {...register('durationHours')}
                  />
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-semibold'>Available Modes (CSV)</label>
                  <input
                    className='input input-bordered w-full mt-1'
                    placeholder='offline, online'
                    {...register('availableModes')}
                  />
                </div>

                <div>
                  <label className='text-sm font-semibold'>Coverage Areas (CSV)</label>
                  <input
                    className='input input-bordered w-full mt-1'
                    placeholder='Dhaka, Gazipur'
                    {...register('coverageAreas')}
                  />
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-semibold'>Tags (CSV)</label>
                  <input
                    className='input input-bordered w-full mt-1'
                    placeholder='floral, backdrop, lighting'
                    {...register('tags')}
                  />
                </div>
                <div>
                  <label className='text-sm font-semibold'>Gallery URLs (CSV)</label>
                  <input
                    className='input input-bordered w-full mt-1'
                    placeholder='https://img1, https://img2'
                    {...register('gallery')}
                  />
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-semibold'>Includes (CSV)</label>
                  <input
                    className='input input-bordered w-full mt-1'
                    placeholder='Backdrop, Lighting, Table decor'
                    {...register('includes')}
                  />
                </div>
                <div>
                  <label className='text-sm font-semibold'>Excludes (CSV)</label>
                  <input
                    className='input input-bordered w-full mt-1'
                    placeholder='Venue booking, Catering'
                    {...register('excludes')}
                  />
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-semibold'>Rating Avg</label>
                  <input
                    type='number'
                    step='0.01'
                    className='input input-bordered w-full mt-1'
                    placeholder='e.g. 4.7'
                    {...register('ratingAvg')}
                  />
                </div>

                <div>
                  <label className='text-sm font-semibold'>Rating Count</label>
                  <input
                    type='number'
                    className='input input-bordered w-full mt-1'
                    placeholder='e.g. 120'
                    {...register('ratingCount')}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className='flex justify-end gap-2 pt-2'>
                <button type='button' className='btn btn-ghost' onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type='submit'
                  className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>

          <form method='dialog' className='modal-backdrop'>
            <button onClick={closeModal}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
