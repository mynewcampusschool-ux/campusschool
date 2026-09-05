import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as fbUpdateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, extraData?: { full_name?: string; batch_year?: string; school?: string }) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (
    email: string,
    password: string,
    extraData?: { full_name?: string; batch_year?: string; school?: string }
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (extraData?.full_name) {
      await fbUpdateProfile(cred.user, { displayName: extraData.full_name });
    }
    await sendEmailVerification(cred.user);
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid:            cred.user.uid,
      full_name:      extraData?.full_name  ?? '',
      email:          email.toLowerCase(),
      batch_year:     extraData?.batch_year ?? null,
      school:         extraData?.school     ?? null,
      role:           'alumni',
      status:         'pending',
      email_verified: false,
      created_at:     serverTimestamp(),
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const cred     = await signInWithPopup(auth, provider);
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid:            cred.user.uid,
      full_name:      cred.user.displayName ?? '',
      email:          cred.user.email?.toLowerCase() ?? '',
      avatar:         cred.user.photoURL ?? null,
      batch_year:     null,
      school:         null,
      role:           'alumni',
      status:         'active',
      email_verified: true,
      created_at:     serverTimestamp(),
    }, { merge: true });
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
