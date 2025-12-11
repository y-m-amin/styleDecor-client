import { useContext, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { API_BASE_URL } from '../config';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Register = () => {
  const { createUser, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formatFirebaseError = (message) => {
    const match = message.match(/\(auth\/([^)]+)\)/);
    return match ? `auth/${match[1]}` : message;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const photo = e.target.photo.value;
    const password = e.target.password.value;

    const passValid = /(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);
    if (!passValid) {
      const msg =
        'Password must contain uppercase, lowercase and be at least 6 characters long';
      setError(msg);
      toast.error('Weak password! Please follow the password rules.');
      return;
    }

    const photoFile = e.target.photo.files[0];

    try {
      await createUser({
        name,
        email,
        password,
        photoFile,
      });
      await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, photo }),
      });

      toast.success('Registration successful!', { autoClose: 1000 });
      setError('');

      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      console.error(err);
      const cleanError = formatFirebaseError(err.message);
      setError(cleanError);
      toast.error(cleanError, { autoClose: 2500 });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const newUser = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL || '',
      };

      await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      toast.success('Registered with Google!', { autoClose: 1000 });
      setError('');

      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      console.error(err);
      const cleanError = formatFirebaseError(err.message);
      setError(cleanError);
      toast.error(cleanError, { autoClose: 2500 });
    }
  };

  return (
    <div className='hero bg-base-200 min-h-screen'>
      <div className='hero-content flex-col lg:flex-row gap-20 mx-auto'>
        {/* Left side text */}
        <div className='text-center lg:text-left'>
          <h1 className='text-5xl font-bold text-accent'>Register Now!</h1>
          <p className='py-6 max-w-md text-gray-600'>
            Join our growing agricultural marketplace to connect directly with
            farmers and buyers. Create your account to list crops, send orders,
            and grow your agri-network effortlessly.
          </p>
        </div>

        {/* Register card */}
        <div className='card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl'>
          <form onSubmit={handleRegister} className='card-body'>
            <fieldset className='fieldset space-y-3'>
              <label className='label font-semibold'>Full Name</label>
              <input
                name='name'
                type='text'
                placeholder='Your Name'
                className='input input-bordered w-full'
                required
              />

              <label className='label font-semibold'>Email</label>
              <input
                name='email'
                type='email'
                placeholder='Email'
                className='input input-bordered w-full'
                required
              />

              <label className='label font-semibold'>Photo</label>
              <input
                name='photo'
                type='file'
                accept='image/*'
                className='file-input file-input-bordered w-full'
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
                Register
              </button>

              {/* Google Register */}
              <button
                type='button'
                onClick={handleGoogleRegister}
                className='btn btn-outline btn-secondary w-full mt-2 flex items-center justify-center'
              >
                <img
                  src='https://www.svgrepo.com/show/475656/google-color.svg'
                  alt='Google'
                  className='w-5 h-5 mr-2'
                />
                Register with Google
              </button>

              <p className='text-center text-sm mt-4'>
                Already a user?{' '}
                <Link to='/login' className='link link-primary font-semibold'>
                  Login
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

export default Register;
