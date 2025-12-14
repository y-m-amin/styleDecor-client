import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

export default function ApplyDecorator() {
  const { user, decoratorStatus, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (decoratorStatus === 'pending') {
    return (
      <div className='p-6 text-center'>
        <h2 className='text-xl font-semibold'>
          Your decorator application is under review
        </h2>
      </div>
    );
  }

  if (decoratorStatus === 'active') {
    return (
      <div className='p-6 text-center'>
        <h2 className='text-xl font-semibold text-green-600'>
          You are already an approved decorator 🎉
        </h2>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      await axios.post('/decorators/apply', {
        ...data,
        email: user.email,
      });

      toast.success('Application submitted!');
      await refreshUser(); // 🔥 instant status update
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to submit application');
    }
  };

  return (
    <div className='max-w-xl mx-auto p-6  shadow rounded'>
      <h1 className='text-2xl font-bold mb-4'>Apply as Decorator</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='label'>Experience (years)</label>
          <input
            type='number'
            className='input input-bordered w-full'
            {...register('experience', {
              required: 'Experience is required',
              min: { value: 0, message: 'Must be positive' },
            })}
          />
          {errors.experience && (
            <p className='text-red-500 text-sm'>{errors.experience.message}</p>
          )}
        </div>

        <div>
          <label className='label'>Specialties</label>
          <input
            type='text'
            className='input input-bordered w-full'
            placeholder='Wedding, Birthday, Corporate'
            {...register('specialties', {
              required: 'Specialties required',
            })}
          />
        </div>

        <div>
          <label className='label'>Portfolio / Work Link</label>
          <input
            type='text'
            className='input input-bordered w-full'
            {...register('portfolio')}
          />
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='btn btn-primary w-full'
        >
          {isSubmitting ? 'Submitting...' : 'Apply'}
        </button>
      </form>
    </div>
  );
}
