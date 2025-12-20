import { useContext, useState } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const BASE_SPECIALTIES = ['wedding', 'home', 'stage', 'corporate'];

export default function DecoratorProfile() {
  const { user, refreshUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    specialties: user?.specialties || [],
  });

  const [customSpec, setCustomSpec] = useState('');
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const toggleSpecialty = (s) => {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(s)
        ? prev.specialties.filter((x) => x !== s)
        : [...prev.specialties, s],
    }));
  };

  const addCustomSpecialty = () => {
    if (customSpec && !form.specialties.includes(customSpec)) {
      setForm((prev) => ({
        ...prev,
        specialties: [...prev.specialties, customSpec.toLowerCase()],
      }));
      setCustomSpec('');
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      let photoURL = user.photoURL;
      if (photo) photoURL = await uploadImage();

      await axios.patch('/users/me', {
        ...form,
        photoURL,
      });

      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='flex justify-center px-4 py-10'>
      <div className='w-full max-w-xl space-y-5'>
        <h2 className='text-2xl font-bold text-center'>Decorator Profile</h2>

        {/* Image */}
        <div className='flex flex-col items-center gap-3'>
          <img
            src={user?.photoURL || 'https://i.ibb.co/2kRzF5H/user.png'}
            className='w-32 h-32 rounded-full object-cover border'
          />
          <input type='file' onChange={(e) => setPhoto(e.target.files[0])} />
        </div>

        {/* Basic Info */}
        <input
          className='input input-bordered w-full'
          placeholder='Name'
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
        />

        <input
          className='input input-bordered w-full'
          placeholder='Phone'
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className='input input-bordered w-full'
          placeholder='Address'
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        {/* Specialties */}
        <div>
          <p className='font-semibold mb-2'>Specialties</p>

          <div className='grid grid-cols-2 gap-2'>
            {[...new Set([...BASE_SPECIALTIES, ...form.specialties])].map(
              (s) => (
                <label key={s} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={form.specialties.includes(s)}
                    onChange={() => toggleSpecialty(s)}
                  />
                  {s}
                </label>
              )
            )}
          </div>

          {/* Add new */}
          <div className='flex gap-2 mt-3'>
            <input
              className='input input-bordered flex-1'
              placeholder='Add specialty'
              value={customSpec}
              onChange={(e) => setCustomSpec(e.target.value)}
            />
            <button className='btn' onClick={addCustomSpecialty}>
              Add
            </button>
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className='btn btn-accent w-full'
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
