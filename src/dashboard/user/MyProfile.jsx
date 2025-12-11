import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Skeleton from 'react-loading-skeleton';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/users/me');
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Skeleton count={5} height={30} />;

  return (
    <div className='p-5 max-w-xl'>
      <h2 className='text-2xl font-bold mb-4'>My Profile</h2>
      <div className='space-y-3'>
        <div>
          <span className='font-semibold'>Name:</span> {profile?.displayName || 'N/A'}
        </div>
        <div>
          <span className='font-semibold'>Email:</span> {profile?.email}
        </div>
        <div>
          <span className='font-semibold'>Role:</span> {profile?.role}
        </div>
        {profile?.phone && (
          <div>
            <span className='font-semibold'>Phone:</span> {profile?.phone}
          </div>
        )}
        {profile?.address && (
          <div>
            <span className='font-semibold'>Address:</span> {profile?.address}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
