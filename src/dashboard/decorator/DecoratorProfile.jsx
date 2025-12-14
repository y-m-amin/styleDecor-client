import { useContext, useState } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const SPECIALTIES = ['wedding', 'home', 'stage', 'corporate'];

export default function DecoratorProfile() {
  const { user, refreshUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    specialties: user?.specialties || [],
  });

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

  const saveProfile = async () => {
    setSaving(true);
    try {
      let photoURL = user.photoURL;
      if (photo) photoURL = await uploadImage();

      await axios.patch('/users/me', {
        ...form,
        photoURL,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      await refreshUser();
    }
  };

  return (
    <div className='p-5 max-w-lg'>
      <h2 className='text-2xl font-bold mb-4'>My Profile</h2>

      <input type='file' onChange={(e) => setPhoto(e.target.files[0])} />

      <input
        className='input input-bordered w-full mt-3'
        value={form.displayName}
        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
      />

      <input
        className='input input-bordered w-full mt-3'
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <div className='mt-3'>
        {SPECIALTIES.map((s) => (
          <label key={s} className='flex gap-2'>
            <input
              type='checkbox'
              checked={form.specialties.includes(s)}
              onChange={() =>
                setForm((prev) => ({
                  ...prev,
                  specialties: prev.specialties.includes(s)
                    ? prev.specialties.filter((x) => x !== s)
                    : [...prev.specialties, s],
                }))
              }
            />
            {s}
          </label>
        ))}
      </div>

      <button
        onClick={saveProfile}
        disabled={saving}
        className='btn btn-accent mt-4'
      >
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  );
}
