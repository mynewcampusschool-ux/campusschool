import { useState, useEffect, useCallback, useRef } from 'react';

const API = import.meta.env.VITE_API_URL ?? 'https://campusalumni.in/backend/api';

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

  const fetchUsers = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams();
      if (params.page)     q.set('page',     String(params.page));
      if (params.per_page) q.set('per_page', String(params.per_page));
      if (params.search)   q.set('search',   params.search);
      if (params.status)   q.set('status',   params.status);
      if (params.role)     q.set('role',     params.role);

      const res = await fetch(`${API}/users?${q.toString()}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [params.page, params.per_page, params.search, params.status, params.role]); // eslint-disable-line

  useEffect(() => {
    fetchUsers();
    if (pollMs > 0) {
      timerRef.current = setInterval(() => fetchUsers(true), pollMs);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchUsers, pollMs]);

  const mutate = useCallback(() => fetchUsers(), [fetchUsers]);

  const updateUserStatus = useCallback(async (id: string, newStatus: string) => {
    await fetch(`${API}/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
    mutate();
  }, [mutate]);

  const updateUserRole = useCallback(async (id: string, newRole: string) => {
    await fetch(`${API}/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: newRole }) });
    mutate();
  }, [mutate]);

  const deleteUser = useCallback(async (id: string) => {
    await fetch(`${API}/users/${id}`, { method: 'DELETE' });
    mutate();
  }, [mutate]);

  const createUser = useCallback(async (payload: Record<string, string>) => {
    await fetch(`${API}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    mutate();
  }, [mutate]);

  const updateUser = useCallback(async (id: string, payload: Record<string, string>) => {
    await fetch(`${API}/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    mutate();
  }, [mutate]);

  const resetPassword = useCallback(async (id: string, password: string) => {
    await fetch(`${API}/users/${id}/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    mutate();
  }, [mutate]);

  return {
    result, loading, error, mutate,
    updateUserStatus, updateUserRole,
    deleteUser, createUser, updateUser, resetPassword,
  };
}
