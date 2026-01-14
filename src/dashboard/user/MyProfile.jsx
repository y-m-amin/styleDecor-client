import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.init'; 


const DEFAULT_AVATAR = 'https://i.ibb.co/2kRzF5H/user.png';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  // form
  const [form, setForm] = useState({
    displayName: '',
    phone: '',
    address: '',
  });

  // image
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/users/me');
      setProfile(res.data || {});
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to load profile');
      setProfile({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  
  useEffect(() => {
    if (!profile) return;

    setForm({
      displayName: profile.displayName || '',
      phone: profile.phone || '',
      address: profile.address || '',
    });

    setPhotoFile(null);
    setPhotoPreview('');
  }, [profile]);

  // cleanup blob preview
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const onPickPhoto = (file) => {
    if (!file) return;

    if (!file.type?.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const MAX = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX) {
      toast.error('Image is too large (max 2MB)');
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
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

  const startEdit = () => setIsEditing(true);

  const cancelEdit = () => {
    setForm({
      displayName: profile?.displayName || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setIsEditing(false);
  };

  const saveProfile = async () => {
    const displayName = String(form.displayName || '').trim();
    if (displayName.length < 2) return toast.error('Name must be at least 2 characters');

    setSaving(true);
    try {
      let photoURL = profile?.photoURL || '';

      if (photoFile) {
        photoURL = await uploadImageToImgbb(photoFile);
      }

      await axios.patch('/users/me', {
        displayName,
        photoURL,
        phone: String(form.phone || '').trim(),
        address: String(form.address || '').trim(),
      });

      if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL });
    }

    //refresh UI
    await refreshUser();

      await fetchProfile();
      setIsEditing(false);
      setPhotoFile(null);
      toast.success('Profile updated!');
      setPhotoPreview('');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-lg space-y-5 text-center">
          <Skeleton circle width={112} height={112} className="mx-auto" />
          <Skeleton height={40} />
          <Skeleton height={20} width="70%" className="mx-auto" />
          <Skeleton height={44} />
        </div>
      </div>
    );
  }

  const avatarSrc = photoPreview || profile?.photoURL || DEFAULT_AVATAR;

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Profile</h2>

          {!isEditing ? (
            <button className="btn btn-sm btn-outline" onClick={startEdit}>
              Edit Profile
            </button>
          ) : (
            <button className="btn btn-sm btn-ghost" onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
          )}
        </div>

        {/* Header card */}
        <div className="bg-base-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={avatarSrc}
              className="w-20 h-20 rounded-full object-cover border"
              alt="profile"
            />
            <div className="flex-1">
              <div className="font-semibold text-lg">{profile?.displayName || '—'}</div>
              <div className="text-sm opacity-70">{profile?.email || '—'}</div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Update Photo</label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => onPickPhoto(e.target.files?.[0])}
                disabled={saving}
              />
              {photoFile && (
                <p className="text-xs opacity-70 mt-1">Selected: {photoFile.name}</p>
              )}
            </div>
          )}
        </div>

        {/* View mode */}
        {!isEditing && (
          <div className="bg-base-100 rounded-lg p-5 shadow-sm space-y-3">
            <div>
              <p className="text-xs opacity-70">Phone</p>
              <p className="font-medium">{profile?.phone || '—'}</p>
            </div>

            <div>
              <p className="text-xs opacity-70">Address</p>
              <p className="font-medium">{profile?.address || '—'}</p>
            </div>
          </div>
        )}

        {/* Edit mode */}
        {isEditing && (
          <div className="bg-base-100 rounded-lg p-5 shadow-sm space-y-4">
            <input
              className="input input-bordered w-full"
              value={form.displayName}
              onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
              placeholder="Your name"
              disabled={saving}
            />

            <input
              className="input input-bordered w-full"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="Phone"
              disabled={saving}
            />

            <input
              className="input input-bordered w-full"
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              placeholder="Address"
              disabled={saving}
            />

            <button onClick={saveProfile} disabled={saving} className="btn btn-primary w-full">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
