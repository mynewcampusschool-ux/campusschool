import React, { useState } from 'react';
import { FiRefreshCw, FiPlus, FiEdit2, FiTrash2, FiKey, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAdminUsers, type AdminUserRow } from '../../../hooks/useAdminUsers';
import { Modal, FormField, SaveBtn, Badge } from '../AdminComponents';

const ROLES   = ['alumni','student','teacher','mentor','recruiter','admin','superadmin'];
const STATUSES = ['active','inactive','pending','banned'];

const emptyForm = { full_name: '', email: '', password: '', batch_year: '', school: '', role: 'alumni', status: 'active' };

const UsersPanel: React.FC = () => {
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter,   setRoleFilter]   = useState('');

  const { result, loading, error, mutate, updateUserStatus, updateUserRole, deleteUser, createUser, updateUser, resetPassword } =
    useAdminUsers({ page, per_page: 20, search, status: statusFilter, role: roleFilter }, 10000);

  const [modal,   setModal]   = useState<'add' | 'edit' | 'reset' | null>(null);
  const [form,    setForm]    = useState(emptyForm);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [newPwd,  setNewPwd]  = useState('');
  const [saving,  setSaving]  = useState(false);
  const [saveErr, setSaveErr] = useState('');

  const set = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setSaveErr(''); setModal('add'); };
  const openEdit = (u: AdminUserRow) => {
    setForm({ full_name: u.full_name, email: u.email, password: '', batch_year: u.batch_year ?? '', school: u.school ?? '', role: u.role?.toLowerCase() ?? 'alumni', status: u.status });
    setEditId(String(u.id)); setSaveErr(''); setModal('edit');
  };
  const openReset = (u: AdminUserRow) => { setEditId(String(u.id)); setNewPwd(''); setSaveErr(''); setModal('reset'); };

  const handleSave = async () => {
    setSaving(true); setSaveErr('');
    try {
      if (modal === 'add') {
        await createUser(form);
      } else if (modal === 'edit' && editId) {
        await updateUser(editId, form);
      } else if (modal === 'reset' && editId) {
        await resetPassword(editId, newPwd);
      }
      setModal(null);
    } catch (e: unknown) {
      setSaveErr(e instanceof Error ? e.message : 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    await deleteUser(id);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const users = result?.data ?? [];
  const total = result?.total ?? 0;
  const lastPage = result?.last_page ?? 1;

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>
            All Users {total > 0 && <span style={{ color: '#6B7280', fontWeight: 600 }}>({total})</span>}
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: '0.2rem 0 0' }}>Live from database · auto-refreshes every 10s</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => mutate()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #E5E7EB', background: '#fff', borderRadius: '0.6rem', padding: '0.5rem 0.875rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#6B7280' }}>
            <FiRefreshCw size={13} /> Refresh
          </button>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 0.875rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
            <FiPlus size={13} /> Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.4rem', flex: 1, minWidth: 200 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search name, email, batch..."
              style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.55rem 0.875rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Search</button>
        </form>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ padding: '0.55rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.8rem', outline: 'none', background: '#fff' }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          style={{ padding: '0.55rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.8rem', outline: 'none', background: '#fff' }}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.6rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#DC2626', fontSize: '0.82rem' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
              {['Name','Email','Batch','School','Role','Status','Verified','Actions'].map(h => (
                <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700, color: '#6B7280', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
                <div style={{ display: 'inline-block', width: 24, height: 24, border: '3px solid rgba(11,107,75,0.2)', borderTopColor: '#0B6B4B', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </td></tr>
            )}
            {!loading && users.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#9CA3AF', fontSize: '0.85rem' }}>
                No users found.
              </td></tr>
            )}
            {!loading && users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #F9FAFB' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0B6B4B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.7rem', flexShrink: 0 }}>
                      {u.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    {u.full_name}
                  </div>
                </td>
                <td style={{ padding: '0.65rem 0.75rem', color: '#6B7280' }}>{u.email}</td>
                <td style={{ padding: '0.65rem 0.75rem', color: '#6B7280' }}>{u.batch_year ?? '—'}</td>
                <td style={{ padding: '0.65rem 0.75rem', color: '#6B7280', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.school ?? '—'}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  <select value={u.role?.toLowerCase() ?? 'alumni'} onChange={e => updateUserRole(u.id, e.target.value)}
                    style={{ border: '1px solid #E5E7EB', borderRadius: '0.4rem', padding: '0.25rem 0.4rem', fontSize: '0.75rem', outline: 'none', background: '#fff', cursor: 'pointer' }}>
                    {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                </td>
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  <select value={u.status} onChange={e => updateUserStatus(u.id, e.target.value)}
                    style={{ border: '1px solid #E5E7EB', borderRadius: '0.4rem', padding: '0.25rem 0.4rem', fontSize: '0.75rem', outline: 'none', background: '#fff', cursor: 'pointer' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </td>
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  <Badge label={u.email_verified ? 'Yes' : 'No'} color={u.email_verified ? '#16A34A' : '#D97706'} />
                </td>
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button onClick={() => openEdit(u)} title="Edit" style={{ background: '#EFF6FF', border: 'none', borderRadius: '0.4rem', padding: '0.35rem', cursor: 'pointer', color: '#2563EB', display: 'flex' }}><FiEdit2 size={13} /></button>
                    <button onClick={() => openReset(u)} title="Reset Password" style={{ background: '#FFF7ED', border: 'none', borderRadius: '0.4rem', padding: '0.35rem', cursor: 'pointer', color: '#D97706', display: 'flex' }}><FiKey size={13} /></button>
                    <button onClick={() => handleDelete(u.id)} title="Delete" style={{ background: '#FEF2F2', border: 'none', borderRadius: '0.4rem', padding: '0.35rem', cursor: 'pointer', color: '#DC2626', display: 'flex' }}><FiTrash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.8rem', color: '#6B7280' }}>
          <span>Page {page} of {lastPage} · {total} total users</span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ border: '1px solid #E5E7EB', background: '#fff', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, display: 'flex' }}>
              <FiChevronLeft size={14} />
            </button>
            <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage}
              style={{ border: '1px solid #E5E7EB', background: '#fff', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', cursor: page === lastPage ? 'not-allowed' : 'pointer', opacity: page === lastPage ? 0.4 : 1, display: 'flex' }}>
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add User' : 'Edit User'} onClose={() => setModal(null)}>
          {saveErr && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.6rem', padding: '0.6rem 0.875rem', marginBottom: '1rem', color: '#DC2626', fontSize: '0.8rem' }}>{saveErr}</div>}
          <FormField label="Full Name" value={form.full_name} onChange={set('full_name')} placeholder="Enter full name" required />
          <FormField label="Email" type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" required />
          {modal === 'add' && <FormField label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" required />}
          <FormField label="Batch Year" value={form.batch_year} onChange={set('batch_year')} placeholder="e.g. 2020" />
          <FormField label="School" value={form.school} onChange={set('school')} placeholder="e.g. Main Campus" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Role</label>
              <select value={form.role} onChange={e => set('role')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Status</label>
              <select value={form.status} onChange={e => set('status')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <SaveBtn onClick={handleSave} loading={saving} />
        </Modal>
      )}

      {/* Reset Password Modal */}
      {modal === 'reset' && (
        <Modal title="Reset Password" onClose={() => setModal(null)}>
          {saveErr && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.6rem', padding: '0.6rem 0.875rem', marginBottom: '1rem', color: '#DC2626', fontSize: '0.8rem' }}>{saveErr}</div>}
          <FormField label="New Password" type="password" value={newPwd} onChange={setNewPwd} placeholder="Min 6 characters" required />
          <SaveBtn onClick={handleSave} loading={saving} label="Reset Password" />
        </Modal>
      )}
    </div>
  );
};

export default UsersPanel;
