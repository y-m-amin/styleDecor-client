// src/context/AuthContext.jsx
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
import { auth } from '../firebase/firebase.init';
import axios from '../api/axios';

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const uploadImageToImageBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
      { method: 'POST', body: formData }
    );

    const data = await res.json();
    return data.data.url;
  };

  

  const createUser = async ({ name, email, password, photoFile }) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);

    let photoURL = '';
    if (photoFile) {
      photoURL = await uploadImageToImageBB(photoFile);
    }

    await updateProfile(auth.currentUser, { displayName: name, photoURL });

    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
    await axios.post('/users', {
      email,
      displayName: name,
      photoURL,
      role,
    });

    return result;
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
  setLoading(true);
  const result = await signInWithPopup(auth, googleProvider);
  const { email, displayName, photoURL } = result.user;

  try {
    await axios.post("/users", {
      email,
      displayName,
      photoURL,
    });
  } catch (err) {
    // ignore if user exists
  }

  return result;
};


  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      
      const idToken = await firebaseUser.getIdToken();

      
      const res = await axios.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      
      setUser({
        email: res.data.email,
        displayName: res.data.displayName,
        photoURL: res.data.photoURL,
      });

      
      setRole(res.data.role);
    } catch (err) {
      console.error("Error fetching user:", err);
      setRole("user"); 
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
