import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection, getDocs, doc, updateDoc, deleteDoc, setDoc,
  query, orderBy, onSnapshot,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth, adminAuth } from '../lib/firebase';

export interface AdminUserRow {
  id: string;
  full_name: string;
  email: string;
  batch_year: string | null;
  school: string | null;
  role: string;
  status: string;
  email_verified: number;
  last_login_at: string | null;
  created_at: string;
  avatar: string | null;
}

export interface UsersResponse {
  data: AdminUserRow[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

interface Params {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  role?: string;
}

export function useAdminUsers(params: Params = {}, _pollMs = 15000) {
  const [allUsers, setAllUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState<string | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  // Real-time listener on Firestore users collection
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'users'), orderBy('created_at', 'desc'));
    unsubRef.current = onSnapshot(
      q,
      (snap) => {
        const rows: AdminUserRow[] = snap.docs.map((d) => {
          const r = d.data();
          return {
            id:             d.id,
            full_name:      r.full_name ?? '',
            email:          r.email ?? '',
            batch_year:     r.batch_year ?? null,
            school:         r.school ?? null,
            role:           r.role ?? 'alumni',
            status:         r.status ?? 'active',
            email_verified: r.email_verified ? 1 : 0,
            last_login_at:  r.last_login_at ?? null,
            created_at:     r.created_at?.toDate?.()?.toISOString() ?? '',
            avatar:         r.avatar ?? null,
          };
        });
        setAllUsers(rows);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => { unsubRef.current?.(); };
  }, []);

  // Client-side filter + paginate
  const per_page = params.per_page ?? 20;
  const page     = params.page ?? 1;

  const filtered = allUsers.filter((u) => {
    if (params.search) {
      const q = params.search.toLowerCase();
      if (
        !u.full_name.toLowerCase().includes(q) &&
        !u.email.toLowerCase().includes(q) &&
        !(u.batch_year ?? '').toLowerCase().includes(q)
      ) return false;
    }
    if (params.status && u.status !== params.status) return false;
    if (params.role   && u.role   !== params.role)   return false;
    return true;
  });

  const total     = filtered.length;
  const last_page = Math.max(1, Math.ceil(total / per_page));
  const start     = (page - 1) * per_page;
  const data      = filtered.slice(start, start + per_page);

  const result: UsersResponse = { data, total, page, per_page, last_page };

  const mutate = useCallback(() => {}, []); // no-op, real-time handles it

  const updateUserStatus = useCallback(async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'users', id), { status: newStatus });
  }, []);

  const updateUserRole = useCallback(async (id: string, newRole: string) => {
    await updateDoc(doc(db, 'users', id), { role: newRole });
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
  }, []);

  const createUser = useCallback(async (payload: Record<string, string>) => {
    const cred = await createUserWithEmailAndPassword(adminAuth, payload.email, payload.password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid:            cred.user.uid,
      full_name:      payload.full_name ?? '',
      email:          payload.email.toLowerCase(),
      batch_year:     payload.batch_year || null,
      school:         payload.school || null,
      role:           payload.role ?? 'alumni',
      status:         payload.status ?? 'active',
      email_verified: false,
      created_at:     new Date(),
    });
  }, []);

  const updateUser = useCallback(async (id: string, payload: Record<string, string>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = payload;
    await updateDoc(doc(db, 'users', id), rest);
  }, []);

  const resetPassword = useCallback(async (_id: string, _password: string) => {
    // Firebase Admin SDK needed for server-side reset; show info to admin
    throw new Error('Password reset via email is handled by Firebase. Use "Forgot Password" flow.');
  }, []);

  return {
    result, loading, error, mutate,
    updateUserStatus, updateUserRole,
    deleteUser, createUser, updateUser, resetPassword,
  };
}
