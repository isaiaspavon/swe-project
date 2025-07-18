import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, signOut, updateProfile as authUpdateProfile, updateEmail as authUpdateEmail, updatePassword as authUpdatePassword } from 'firebase/auth';
import { ref, get, update} from 'firebase/database';
import { useCart } from './CartContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch user profile from database
        try {
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserProfile(snapshot.val());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      clearCart();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (fields) => {
    if (!currentUser) throw new Error("Not authenticated");

    // 1) Update Auth displayName/email if you want:
    if (fields.name) {
      await authUpdateProfile(currentUser, { displayName: fields.name });
    }

    // 2) Write any fields into your RTDB record
    const userRef = ref(db, `users/${currentUser.uid}`);
    await update(userRef, fields);

    // 3) Optimistically update local state
    setUserProfile(p => ({ ...p, ...fields }));
  };

  const updateEmail = async (newEmail) => {
    if (!currentUser) throw new Error("Not authenticated");
    await authUpdateEmail(currentUser, newEmail);
    // optionally mirror it in your RTDB
    const userRef = ref(db, `users/${currentUser.uid}`);
    await update(userRef, { email: newEmail });
    setCurrentUser(u => ({ ...u, email: newEmail }));
    setUserProfile(p => ({ ...p, email: newEmail }));
  };

  const updatePassword = async (newPassword) => {
    if (!currentUser) throw new Error("Not authenticated");
    await authUpdatePassword(currentUser, newPassword);
  };

  // Add this line to check if user is admin
  const isAdmin = userProfile?.role === 'admin';

  const value = {
    currentUser,
    userProfile,
    loading,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin, // Add this line
    updateProfile,
    updateEmail,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};