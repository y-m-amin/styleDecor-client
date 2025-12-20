import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../../api/axios';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  /** PAGINATION **/
  const [page, setPage] = useState(1);
  const limit = 6;
  const [totalPages, setTotalPages] = useState(1);

  /** FETCH SERVICES **/
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/services?page=${page}&limit=${limit}`);

      setServices(res.data.services);
      setTotalPages(Math.ceil(res.data.total / limit));
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

  /** REACT HOOK FORM **/
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let finalImageUrl = selectedService?.image || '';

      if (data.imageFile?.length) {
        finalImageUrl = await uploadImage(data.imageFile[0]);
      }

      const payload = {
        service_name: data.name,
        cost: data.price,
        unit: data.duration,
        service_category: data.category,
        description: data.description,
        image: finalImageUrl,
      };

      if (modalType === 'add') {
        await axios.post('/services', payload);
      } else {
        await axios.patch(`/services/${selectedService._id}`, payload);
      }

      fetchServices();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const onEdit = (service) => {
    setSelectedService(service);
    setValue('name', service.service_name);
    setValue('price', service.cost);
    setValue('duration', service.unit);
    setValue('category', service.service_category);
    setValue('description', service.description);
    setModalType('edit');
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    await axios.delete(`/services/${id}`);
    fetchServices();
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
      { method: 'POST', body: formData }
    );

    const data = await res.json();
    return data.data.url;
  };

  return (
    <div className='p-4 md:p-6'>
      <h1 className='text-2xl font-bold mb-4'>Manage Services</h1>

      <button
        className='btn btn-accent mb-4 text-white'
        onClick={() => setModalType('add')}
      >
        + Add New Service
      </button>

      {loading ? (
        <p>Loading services...</p>
      ) : (
        <>
          {/* LIST */}
          <ul className='list bg-base-100 rounded-box shadow-md'>
            <li className='p-4 pb-2 text-xs opacity-60 tracking-wide'>
              Total Services: {services.length}
            </li>

            {services.map((s) => (
              <li
                key={s._id}
                className='list-row flex flex-col xl:flex-row gap-4'
              >
                {/* IMAGE */}
                <div>
                  <img
                    src={s.image}
                    alt={s.service_name}
                    className='size-12 rounded-box object-cover'
                  />
                </div>

                {/* INFO */}
                <div className='flex-1'>
                  <div className='font-semibold'>{s.service_name}</div>
                  <div className='text-xs uppercase opacity-60'>
                    {s.service_category} • ${s.cost} / {s.unit}
                  </div>

                  {/* DESCRIPTION (xl only) */}
                  <p className='hidden xl:block text-xs mt-1 opacity-70'>
                    {s.description}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className='flex gap-2 self-start xl:self-center'>
                  <button
                    className='btn btn-sm btn-info text-white'
                    onClick={() => onEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn-sm btn-error text-white'
                    onClick={() => onDelete(s._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* PAGINATION */}
          <div className='join mt-6 justify-center w-full'>
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
        </>
      )}

      {/* MODAL (unchanged UI logic) */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-base-100 p-6 w-full max-w-lg rounded-lg'>
            <h2 className='text-xl font-semibold mb-4'>
              {modalType === 'add' ? 'Add Service' : 'Edit Service'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <input
                className='input input-bordered w-full'
                placeholder='Name'
                {...register('name', { required: true })}
              />
              <input
                type='number'
                className='input input-bordered w-full'
                placeholder='Price'
                {...register('price', { required: true })}
              />
              <input
                className='input input-bordered w-full'
                placeholder='Duration'
                {...register('duration', { required: true })}
              />
              <input
                className='input input-bordered w-full'
                placeholder='Category'
                {...register('category', { required: true })}
              />
              <input
                type='file'
                className='file-input file-input-bordered w-full'
                {...register('imageFile')}
              />
              <textarea
                className='textarea textarea-bordered w-full'
                placeholder='Description'
                {...register('description')}
              />

              <div className='flex justify-end gap-3'>
                <button
                  type='button'
                  className='btn btn-outline'
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className={`btn btn-accent text-white ${
                    isSubmitting && 'loading'
                  }`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
