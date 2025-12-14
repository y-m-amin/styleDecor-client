import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useForm } from 'react-hook-form';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/services');
      setServices(res.data.services || res.data);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const closeModal = () => {
    setModalType(null);
    setSelectedService(null);
    reset();
  };

  /*** REACT HOOK FORM SETUP ***/

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      price: '',
      duration: '',
      category: '',
      image: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      let finalImageUrl = selectedService?.image || '';

      if (data.imageFile && data.imageFile.length > 0) {
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
      console.error('Submit failed:', err);
    }
  };

  const onEdit = (service) => {
    setSelectedService(service);
    reset({
      name: service.name,
      price: service.price,
      duration: service.duration,
      category: service.category,
      image: service.image,
      description: service.description,
    });
    setModalType('edit');
  };

  const onDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const url = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMGBB_KEY
    }`;

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.data.url;
  };

  useEffect(() => {
    if (modalType === 'edit' && selectedService) {
      setValue('name', selectedService.service_name);
      setValue('price', selectedService.cost);
      setValue('duration', selectedService.unit);
      setValue('category', selectedService.service_category);
      setValue('description', selectedService.description);
    }
  }, [modalType, selectedService, setValue]);

  return (
    <div className='p-6'>
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
        <table className='table table-zebra w-full'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id} className='text-white'>
                <td>{s.service_name}</td>
                <td>${s.cost}</td>
                <td>{s.unit}</td>
                <td>{s.service_category}</td>
                <td className='space-x-2'>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className=' p-6 w-full max-w-lg rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4'>
              {modalType === 'add' ? 'Add Service' : 'Edit Service'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* Name */}
              <div>
                <label className='label'>Name</label>
                <input
                  className='input input-bordered w-full'
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className='text-red-500 text-sm'>{errors.name.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className='label'>Price</label>
                <input
                  type='number'
                  className='input input-bordered w-full'
                  {...register('price', {
                    required: 'Price is required',
                  })}
                />
                {errors.price && (
                  <p className='text-red-500 text-sm'>{errors.price.message}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className='label'>Duration</label>
                <input
                  className='input input-bordered w-full'
                  {...register('duration', {
                    required: 'Duration is required',
                  })}
                />
                {errors.duration && (
                  <p className='text-red-500 text-sm'>
                    {errors.duration.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className='label'>Category</label>
                <input
                  className='input input-bordered w-full'
                  {...register('category', {
                    required: 'Category is required',
                  })}
                />
                {errors.category && (
                  <p className='text-red-500 text-sm'>
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className='label'>Image</label>
                <input
                  type='file'
                  className='file-input file-input-bordered w-full'
                  {...register('imageFile')}
                />
              </div>

              {/* Description */}
              <div>
                <label className='label'>Description</label>
                <textarea
                  className='textarea textarea-bordered w-full'
                  {...register('description')}
                />
              </div>

              <div className='flex justify-end space-x-3 mt-4'>
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
                    isSubmitting ? 'loading' : ''
                  }`}
                >
                  {modalType === 'add' ? 'Add' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
