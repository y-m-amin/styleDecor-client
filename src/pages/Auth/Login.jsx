import { useContext, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const { signInUser, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const from = location.state?.from?.pathname || '/';

  const formatFirebaseError = (message) => {
    const match = message.match(/\(auth\/([^)]+)\)/);
    return match ? `auth/${match[1]}` : message;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInUser(email, password);
      toast.success('Login successful!', { autoClose: 1000 });
      setError('');

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      console.error(err);
      const cleanError = formatFirebaseError(err.message);
      setError(cleanError);
      toast.error(cleanError, { autoClose: 2500 });
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      toast.success('Logged in with Google! Redirecting...', {
        autoClose: 1500,
      });
      setError('');

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (err) {
      console.error(err);
      const cleanError = formatFirebaseError(err.message);
      setError(cleanError);
      toast.error(cleanError, { autoClose: 2500 });
    }
  };

  return (
    <div className='hero bg-base-200 min-h-screen'>
      <div className='hero-content flex-col lg:flex-row-reverse gap-20 mx-auto'>
        {/* Left side text */}
        <div className='text-center lg:text-left'>
          <h1 className='text-5xl font-bold text-accent'>Login now!</h1>
          <p className='py-6 max-w-md text-gray-600'>
            Access your account to explore and manage your crops effortlessly.
            Stay connected, grow smarter, and keep track of your agri-business.
          </p>
        </div>

        {/* Login card */}
        <div className='card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl'>
          <form onSubmit={handleLogin} className='card-body'>
            <fieldset className='fieldset space-y-3'>
              <label className='label font-semibold'>Email</label>
              <input
                name='email'
                type='email'
                placeholder='Email'
                className='input input-bordered w-full'
                required
              />

              <label className='label font-semibold'>Password</label>
              <div className='relative'>
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  className='input input-bordered w-full pr-10 focus:pr-10 relative z-0'
                  required
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10'
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div>
                <a className='link link-hover text-sm text-primary'>
                  Forgot password?
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <p className='text-red-500 text-sm font-medium text-center bg-red-50 border border-red-200 rounded-md py-2'>
                  {error}
                </p>
              )}

              <button
                type='submit'
                className='btn btn-accent btn-outline w-full mt-2'
              >
                Login
              </button>

              <button
                type='button'
                onClick={handleGoogle}
                className='btn btn-outline btn-secondary w-full mt-2 flex items-center justify-center'
              >
                <img
                  src='https://www.svgrepo.com/show/475656/google-color.svg'
                  alt='Google'
                  className='w-5 h-5 mr-2'
                />
                Login with Google
              </button>

              <p className='text-center text-sm mt-4'>
                Not a user yet?{' '}
                <Link
                  to='/register'
                  className='link link-primary font-semibold'
                >
                  Register now
                </Link>
              </p>
            </fieldset>
          </form>
        </div>
      </div>
      <ToastContainer position='top-center' theme='colored' />
    </div>
  );
};

export default Login;
