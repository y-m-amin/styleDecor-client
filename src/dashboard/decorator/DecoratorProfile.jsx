import { useContext, useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const BASE_SPECIALTIES = ['wedding', 'home', 'stage', 'corporate'];

const normalizeSpec = (s) => String(s || '').trim().toLowerCase();

export default function DecoratorProfile() {
  const { user, refreshUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    displayName: '',
    phone: '',
    address: '',
    specialties: [],
  });

  const [customSpec, setCustomSpec] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);

  
  useEffect(() => {
    if (!user) return;

    const normalizedSpecialties = Array.isArray(user.specialties)
      ? user.specialties.map(normalizeSpec).filter(Boolean)
      : [];

    setForm({
      displayName: user.displayName || '',
      phone: user.phone || '',
      address: user.address || '',
      specialties: Array.from(new Set(normalizedSpecialties)),
    });

    setPhotoFile(null);
    setPhotoPreview('');
  }, [user]);

  
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const specialtyOptions = useMemo(() => {
    const fromUser = (form.specialties || []).map(normalizeSpec);
    const merged = [...BASE_SPECIALTIES, ...fromUser].map(normalizeSpec).filter(Boolean);
    return Array.from(new Set(merged));
  }, [form.specialties]);

  const toggleSpecialty = (s) => {
    const key = normalizeSpec(s);
    setForm((prev) => {
      const current = (prev.specialties || []).map(normalizeSpec);
      const has = current.includes(key);
      return {
        ...prev,
        specialties: has ? current.filter((x) => x !== key) : [...current, key],
      };
    });
  };

  const addCustomSpecialty = () => {
    const key = normalizeSpec(customSpec);
    if (!key) return;

    setForm((prev) => {
      const current = (prev.specialties || []).map(normalizeSpec);
      if (current.includes(key)) return prev;
      return { ...prev, specialties: [...current, key] };
    });

    setCustomSpec('');
  };

  const onPickPhoto = (file) => {
    if (!file) return;

    if (!file.type?.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // 2MB soft limit 
    const MAX = 2 * 1024 * 1024;
    if (file.size > MAX) {
      toast.error('Image is too large (max 2MB)');
      return;
    }

    setPhotoFile(file);

    // preview
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const uploadImageToImgbb = async (file) => {
    const key = import.meta.env.VITE_IMGBB_KEY;
    if (!key) throw new Error('Missing IMGBB key');

    const fd = new FormData();
    fd.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: 'POST',
      body: fd,
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      const msg = data?.error?.message || 'Image upload failed';
      throw new Error(msg);
    }

    const url = data?.data?.url;
    if (!url) throw new Error('Image upload returned no URL');

    return url;
  };

  const startEdit = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    // revert back to user data (form hydration already knows how)
    if (user) {
      const normalizedSpecialties = Array.isArray(user.specialties)
        ? user.specialties.map(normalizeSpec).filter(Boolean)
        : [];

      setForm({
        displayName: user.displayName || '',
        phone: user.phone || '',
        address: user.address || '',
        specialties: Array.from(new Set(normalizedSpecialties)),
      });
    }

    setPhotoFile(null);
    setPhotoPreview('');
    setCustomSpec('');
    setIsEditing(false);
  };

  const saveProfile = async () => {
    if (!user) return;

    const displayName = String(form.displayName || '').trim();
    if (displayName.length < 2) return toast.error('Name must be at least 2 characters');

    setSaving(true);
    try {
      let photoURL = user.photoURL;

      if (photoFile) {
        photoURL = await uploadImageToImgbb(photoFile);
      }

      await axios.patch('/users/me', {
        displayName,
        phone: String(form.phone || '').trim(),
        address: String(form.address || '').trim(),
        specialties: (form.specialties || []).map(normalizeSpec).filter(Boolean),
        photoURL,
      });

      toast.success('Profile updated');
      await refreshUser();

      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview('');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc =
    photoPreview ||
    user?.photoURL ||
    'https://i.ibb.co/2kRzF5H/user.png';

  return (
    <div className='flex justify-center px-4 py-10'>
      <div className='w-full max-w-xl space-y-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>Decorator Profile</h2>

          {!isEditing ? (
            <button className='btn btn-sm btn-outline' onClick={startEdit}>
              Edit Profile
            </button>
          ) : (
            <button className='btn btn-sm btn-ghost' onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
          )}
        </div>

        {/* PROFILE HEADER */}
        <div className='bg-base-200 rounded-lg p-5 shadow-sm'>
          <div className='flex items-center gap-4'>
            <img
              src={avatarSrc}
              className='w-20 h-20 rounded-full object-cover border'
              alt='profile'
            />

            <div className='flex-1'>
              <div className='font-semibold text-lg'>
                {user?.displayName || '—'}
              </div>
              <div className='text-sm opacity-70'>{user?.email || '—'}</div>
              <div className='text-sm opacity-70'>{user?.phone || '—'}</div>
            </div>
          </div>

          {isEditing && (
            <div className='mt-4'>
              <label className='block text-sm font-medium mb-1'>Update Photo</label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => onPickPhoto(e.target.files?.[0])}
                className='file-input file-input-bordered w-full'
                disabled={saving}
              />
              {photoFile && (
                <p className='text-xs opacity-70 mt-1'>
                  Selected: {photoFile.name}
                </p>
              )}
            </div>
          )}
        </div>

        {/* VIEW MODE */}
        {!isEditing && (
          <div className='bg-base-100 rounded-lg p-5 shadow-sm space-y-3'>
            <div>
              <p className='text-xs opacity-70'>Name</p>
              <p className='font-medium'>{user?.displayName || '—'}</p>
            </div>
            <div>
              <p className='text-xs opacity-70'>Phone</p>
              <p className='font-medium'>{user?.phone || '—'}</p>
            </div>
            <div>
              <p className='text-xs opacity-70'>Address</p>
              <p className='font-medium'>{user?.address || '—'}</p>
            </div>
            <div>
              <p className='text-xs opacity-70'>Specialties</p>
              <div className='flex flex-wrap gap-2 mt-1'>
                {(user?.specialties || []).length ? (
                  user.specialties.map((s) => (
                    <span key={s} className='badge badge-outline'>
                      {normalizeSpec(s)}
                    </span>
                  ))
                ) : (
                  <span className='opacity-70'>—</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODE */}
        {isEditing && (
          <div className='bg-base-100 rounded-lg p-5 shadow-sm space-y-4'>
            <input
              className='input input-bordered w-full'
              placeholder='Name'
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              disabled={saving}
            />

            <input
              className='input input-bordered w-full'
              placeholder='Phone'
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={saving}
            />

            <input
              className='input input-bordered w-full'
              placeholder='Address'
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              disabled={saving}
            />

            {/* Specialties */}
            <div>
              <p className='font-semibold mb-2'>Specialties</p>

              <div className='grid grid-cols-2 gap-2'>
                {specialtyOptions.map((s) => {
                  const key = normalizeSpec(s);
                  const checked = (form.specialties || []).map(normalizeSpec).includes(key);

                  return (
                    <label key={key} className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        className='checkbox checkbox-sm'
                        checked={checked}
                        onChange={() => toggleSpecialty(key)}
                        disabled={saving}
                      />
                      <span className='capitalize'>{key}</span>
                    </label>
                  );
                })}
              </div>

              {/* Add new */}
              <div className='flex gap-2 mt-3'>
                <input
                  className='input input-bordered flex-1'
                  placeholder='Add specialty'
                  value={customSpec}
                  onChange={(e) => setCustomSpec(e.target.value)}
                  disabled={saving}
                />
                <button
                  className='btn'
                  type='button'
                  onClick={addCustomSpecialty}
                  disabled={saving}
                >
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
        )}
      </div>
    </div>
  );
}
