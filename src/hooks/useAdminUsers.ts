import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

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

export function useAdminUsers(params: Params = {}, pollMs = 15000) {
  const [result,  setResult]  = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const page     = params.page     ?? 1;
  const per_page = params.per_page ?? 20;
  const search   = (params.search  ?? '').toLowerCase();
  const status   = params.status   ?? '';
  const role     = params.role     ?? '';

  const fetchUsers = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      // No orderBy to avoid Firestore index requirement
      const snap = await getDocs(collection(db, 'users'));

      let rows: AdminUserRow[] = snap.docs.map(d => {
        const data = d.data();
        return {
          id:             d.id,
          full_name:      data.full_name  ?? data.displayName ?? 'Unknown',
          email:          data.email      ?? '',
          batch_year:     data.batch_year ?? null,
          school:         data.school     ?? null,
          role:           data.role       ?? 'alumni',
          status:         data.status     ?? 'active',
          email_verified: data.email_verified ? 1 : 0,
          last_login_at:  data.last_login_at?.toDate?.()?.toISOString() ?? null,
          created_at:     data.created_at?.toDate?.()?.toISOString()    ?? new Date().toISOString(),
          avatar:         data.avatar     ?? null,
        };
      });

      // Sort newest first client-side
      rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      // Client-side filter
      if (search) rows = rows.filter(u =>
        u.full_name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        (u.batch_year ?? '').toLowerCase().includes(search)
      );
      if (status) rows = rows.filter(u => u.status === status);
      if (role)   rows = rows.filter(u => u.role?.toLowerCase() === role);

      const total     = rows.length;
      const offset    = (page - 1) * per_page;
      const paginated = rows.slice(offset, offset + per_page);

      setResult({
        data:      paginated,
        total,
        page,
        per_page,
        last_page: Math.max(1, Math.ceil(total / per_page)),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, per_page, search, status, role]);

  useEffect(() => {
    fetchUsers();
    if (pollMs > 0) {
      timerRef.current = setInterval(() => fetchUsers(true), pollMs);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchUsers, pollMs]);

  const mutate = useCallback(() => fetchUsers(), [fetchUsers]);

  const updateUserStatus = useCallback(async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'users', id), { status: newStatus });
    mutate();
  }, [mutate]);

  const updateUserRole = useCallback(async (id: string, newRole: string) => {
    await updateDoc(doc(db, 'users', id), { role: newRole });
    mutate();
  }, [mutate]);

  const deleteUser = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
    mutate();
  }, [mutate]);

  const createUser = useCallback(async (payload: Record<string, string>) => {
    // Create in Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
    // Save profile in Firestore
    await addDoc(collection(db, 'users'), {
      uid:            cred.user.uid,
      full_name:      payload.full_name  ?? '',
      email:          payload.email,
      batch_year:     payload.batch_year ?? null,
      school:         payload.school     ?? null,
      role:           payload.role       ?? 'alumni',
      status:         payload.status     ?? 'active',
      email_verified: false,
      created_at:     serverTimestamp(),
    });
    mutate();
  }, [mutate]);

  const updateUser = useCallback(async (id: string, payload: Record<string, string>) => {
    const updates: Record<string, string | null> = {};
    if (payload.full_name)  updates.full_name  = payload.full_name;
    if (payload.batch_year !== undefined) updates.batch_year = payload.batch_year || null;
    if (payload.school     !== undefined) updates.school     = payload.school     || null;
    if (payload.role)       updates.role       = payload.role;
    if (payload.status)     updates.status     = payload.status;
    await updateDoc(doc(db, 'users', id), updates);
    mutate();
  }, [mutate]);

  // Password reset not possible client-side without Admin SDK — send reset email instead
  const resetPassword = useCallback(async (_id: string, _password: string) => {
    throw new Error('Use Firebase Console or send a password reset email to the user.');
  }, []);

  return {
    result, loading, error, mutate,
    updateUserStatus, updateUserRole,
    deleteUser, createUser, updateUser, resetPassword,
  };
}
