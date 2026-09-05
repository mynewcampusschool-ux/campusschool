import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { adminAuth } from '../lib/firebase';

const ADMIN_EMAILS: Record<string, 'admin' | 'superadmin'> = {
  'admin@campusschool.edu': 'superadmin',
  'admin@campusschool.in':  'superadmin',
};

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'superadmin';
  avatar?: string | null;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

function buildAdminUser(fbUser: FirebaseUser): AdminUser | null {
  const email = (fbUser.email ?? '').toLowerCase();
  const role  = ADMIN_EMAILS[email];
  if (!role) return null;
  return {
    id:        fbUser.uid,
    full_name: fbUser.displayName ?? 'Admin',
    email:     fbUser.email ?? '',
    role,
    avatar:    fbUser.photoURL ?? null,
  };
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin,   setAdmin]   = useState<AdminUser | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(adminAuth, async (fbUser) => {
      if (!fbUser) {
        setAdmin(null);
        setToken(null);
        setLoading(false);
        return;
      }
      const profile = buildAdminUser(fbUser);
      if (profile) {
        const t = await fbUser.getIdToken();
        setAdmin(profile);
        setToken(t);
      } else {
        await signOut(adminAuth);
        setAdmin(null);
        setToken(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalised = email.trim().toLowerCase();
    if (!ADMIN_EMAILS[normalised]) {
      throw new Error('Access denied. Only admins can login here.');
    }
    const cred    = await signInWithEmailAndPassword(adminAuth, normalised, password);
    const profile = buildAdminUser(cred.user);
    if (!profile) {
      await signOut(adminAuth);
      throw new Error('Access denied. Only admins can login here.');
    }
    const t = await cred.user.getIdToken();
    setAdmin(profile);
    setToken(t);
  }, []);

  const logout = useCallback(async () => {
    await signOut(adminAuth);
    setAdmin(null);
    setToken(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, token }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
