import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import axios from '../../api/axios';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/users/me');
      setProfile(res.data);
      setDisplayName(res.data.displayName || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const uploadImage = async () => {
    const fd = new FormData();
    fd.append('image', photo);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
      { method: 'POST', body: fd }
    );

    const data = await res.json();
    return data.data.url;
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      let photoURL = profile.photoURL;
      if (photo) photoURL = await uploadImage();

      await axios.patch('/users/me', {
        displayName,
        photoURL,
      });

      fetchProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton count={6} height={30} />;

  return (
    <div className='flex justify-center px-4 py-10'>
      <div className='w-full  max-w-lg space-y-5 text-center'>
        <h2 className='text-2xl font-bold'>My Profile</h2>

        {/* Image */}
        <div className='flex flex-col items-center gap-3'>
          <img
            src={profile?.photoURL || 'https://i.ibb.co/2kRzF5H/user.png'}
            className='w-28 h-28 rounded-full object-cover border'
          />
          <input type='file' onChange={(e) => setPhoto(e.target.files[0])} />
        </div>

        {/* Name */}
        <input
          className='input input-bordered w-full'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder='Your name'
        />

        <div className='text-left space-y-2 text-sm opacity-80'>
          <p>
            <b>Email:</b> {profile.email}
          </p>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className='btn btn-primary w-full'
        >
          {saving ? 'Saving...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
