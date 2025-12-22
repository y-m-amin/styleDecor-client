import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';

export default function Register() {
  const { createUser, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { name, email, password, photo } = data;
      await createUser({
        name,
        email,
        password,
        photoFile: photo?.[0] || null,
      });

      toast.success('Registration successful!');
      setTimeout(() => navigate('/'), 1200);
      reset();
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      toast.success('Registered with Google!');
      setTimeout(() => navigate('/'), 1200);
    } catch {
      toast.error('Google authentication failed');
    }
  };

  return (
    <div className='min-h-screen bg-base-200 flex items-center justify-center px-4'>
      <div className='flex w-full max-w-sm lg:max-w-4xl bg-base-100 rounded-xl shadow-xl overflow-hidden'>
        {/* Image */}
        <div
          className='hidden lg:block lg:w-1/2 bg-cover'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80')",
          }}
        />

        {/* Form */}
        <div className='w-full p-6 sm:p-8 lg:w-1/2'>
          <h2 className='text-2xl font-bold text-center text-primary'>
            Create Account
          </h2>
          <p className='text-center text-sm text-base-content/60 mb-6'>
            Join us in a few seconds
          </p>

          <button
            onClick={handleGoogleRegister}
            className='btn btn-outline btn-secondary w-full mb-4'
            type='button'
          >
            <img
              src='https://www.svgrepo.com/show/475656/google-color.svg'
              className='w-5 h-5 mr-2'
            />
            Continue with Google
          </button>

          <div className='divider text-xs'>OR</div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='label font-semibold'>Full Name</label>
              <input
                className='input input-bordered w-full'
                {...register('name', { required: 'Name required' })}
              />
              {errors.name && (
                <p className='text-error text-sm'>{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className='label font-semibold'>Email</label>
              <input
                type='email'
                className='input input-bordered w-full'
                {...register('email', { required: 'Email required' })}
              />
              {errors.email && (
                <p className='text-error text-sm'>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className='label font-semibold'>Profile Photo</label>
              <input
                type='file'
                className='file-input file-input-bordered w-full'
                {...register('photo')}
              />
            </div>

            <div>
              <label className='label font-semibold'>Password</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='input input-bordered w-full pr-10'
                  {...register('password')}
                />
                <button
  type="button"
  tabIndex={-1}
  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 opacity-60 hover:opacity-100"
  onMouseDown={(e) => e.preventDefault()}
  onClick={() => setShowPassword((p) => !p)}
>

                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className='text-error text-sm'>{errors.password.message}</p>
              )}
            </div>

            <button
              className='btn btn-primary w-full'
              disabled={isSubmitting}
              type='submit'
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className='text-center text-sm mt-6'>
            Already have an account?{' '}
            <Link to='/login' className='link link-primary font-semibold'>
              Login
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position='top-center' theme='colored' />
    </div>
  );
}
