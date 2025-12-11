import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { saveUserToDB } from '../api/userAPI';
import { auth } from '../firebase/firebase.init';

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  // Upload image to ImageBB
  const uploadImageToImageBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await res.json();
    return data.data.url;
  };

  // REGISTER
  const createUser = async ({ name, email, password, photoFile }) => {
    setLoading(true);

    const result = await createUserWithEmailAndPassword(auth, email, password);

    let photoURL = '';

    if (photoFile) {
      photoURL = await uploadImageToImageBB(photoFile);
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
    } else {
      await updateProfile(auth.currentUser, { displayName: name });
    }

    await saveUserToDB({
      name,
      email,
      photo: photoURL,
    });

    return result;
  };

  // LOGIN
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // GOOGLE LOGIN
  const signInWithGoogle = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);

    await saveUserToDB({
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL,
    });

    return result;
  };

  // LOGOUT
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // AUTH LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/users/${currentUser.email}`
          );
          const data = await res.json();
          setRole(data.role || 'user'); // default user role
        } catch (err) {
          console.error('Failed to get role:', err);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,
    loading,
    createUser,
    signInUser,
    signInWithGoogle,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
