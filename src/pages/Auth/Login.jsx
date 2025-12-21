import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const { signInUser, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      await signInUser(email, password);
      toast.success('Login successful!');
      setTimeout(() => navigate(redirectTo, { replace: true }), 900);
      reset();
    } catch {
      toast.error('Invalid email or password');
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      toast.success('Logged in with Google!');
      setTimeout(() => navigate(redirectTo, { replace: true }), 900);
    } catch {
      toast.error('Google login failed');
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
              "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?auto=format&fit=crop&w=800&q=80')",
          }}
        />

        {/* Form */}
        <div className='w-full p-6 sm:p-8 lg:w-1/2'>
          <h2 className='text-2xl font-bold text-center text-primary'>
            Welcome Back
          </h2>
          <p className='text-center text-sm text-base-content/60 mb-6'>
            Login to continue
          </p>

          <button
            onClick={handleGoogle}
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
              <div className='flex justify-between label'>
                <span className='font-semibold'>Password</span>
                <Link to='#' className='text-xs link link-hover'>
                  Forgot?
                </Link>
              </div>

              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='input input-bordered w-full pr-10'
                  {...register('password', { required: 'Password required' })}
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 -translate-y-1/2 opacity-60'
                  onClick={() => setShowPassword((s) => !s)}
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
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className='text-center text-sm mt-6'>
            New here?{' '}
            <Link to='/register' className='link link-primary font-semibold'>
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position='top-center' theme='colored' />
    </div>
  );
}
