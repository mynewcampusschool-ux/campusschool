import React, { useState, useEffect } from 'react';
import { AdminTable, TableHeader, Modal, FormField, SaveBtn, Badge } from '../AdminComponents';
import { useCMS, type CMSNotice } from '../../../context/CMSContext';

const cols = [
  { key: 'title', label: 'Notice Title' },
  { key: 'category', label: 'Category' },
  { key: 'priorityBadge', label: 'Priority' },
  { key: 'date', label: 'Date' },
  { key: 'statusBadge', label: 'Status' },
];

const TAG_COLORS: Record<string, string> = {
  Registration: '#0B6B4B', Event: '#D4AF37', Scholarship: '#3B82F6',
  General: '#6B7280', Career: '#8B5CF6', Mentorship: '#8B5CF6',
  Newsletter: '#0B6B4B', Achievement: '#EF4444',
};

const empty = (): CMSNotice => ({
  id: 0, title: '', text: '', date: '', tag: 'General',
  tagColor: '#6B7280', category: 'General', priority: 'Medium', enabled: true,
});

const NoticeBoardPanel: React.FC = () => {
  const { cms, updateNotices } = useCMS();
  const [items, setItems] = useState<CMSNotice[]>(cms.notices);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<CMSNotice>(empty());
  const [editing, setEditing] = useState(false);
  const set = (k: keyof CMSNotice) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { setItems(cms.notices); }, [cms.notices]);

  const filtered = items.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase()),
  );
  const tableData = filtered.map((n) => ({
    ...n,
    priorityBadge: <Badge label={n.priority} color={n.priority === 'high' || n.priority === 'High' ? '#EF4444' : n.priority === 'medium' || n.priority === 'Medium' ? '#D97706' : '#6B7280'} />,
    statusBadge: <Badge label={n.enabled ? 'Active' : 'Disabled'} color={n.enabled ? '#0B6B4B' : '#9CA3AF'} />,
  }));

  const openAdd = () => { setForm(empty()); setEditing(false); setModal(true); };
  const openEdit = (row: CMSNotice) => { setForm({ ...row }); setEditing(true); setModal(true); };
  const handleDelete = (id: number | string) => {
    const next = items.filter((n) => n.id !== id);
    setItems(next); updateNotices(next);
  };
  const handleSave = () => {
    const tagColor = TAG_COLORS[form.category] ?? '#6B7280';
    const record = { ...form, tag: form.category, tagColor };
    const next = editing
      ? items.map((n) => (n.id === record.id ? record : n))
      : [...items, { ...record, id: Date.now() }];
    setItems(next); updateNotices(next); setModal(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <TableHeader title={`Notice Board (${filtered.length})`} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Add Notice" />
      <AdminTable columns={cols} data={tableData} onEdit={openEdit} onDelete={handleDelete} />
      {modal && (
        <Modal title={editing ? 'Edit Notice' : 'Add Notice'} onClose={() => setModal(false)}>
          <FormField label="Notice Title" value={form.title} onChange={set('title')} placeholder="Enter notice title" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Category</label>
              <select value={form.category} onChange={(e) => set('category')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option>General</option><option>Registration</option><option>Event</option><option>Scholarship</option><option>Career</option><option>Mentorship</option><option>Newsletter</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Priority</label>
              <select value={form.priority} onChange={(e) => set('priority')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option>high</option><option>medium</option><option>low</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Enabled</label>
              <select value={form.enabled ? 'true' : 'false'} onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.value === 'true' }))} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option value="true">Active</option><option value="false">Disabled</option>
              </select>
            </div>
          </div>
          <FormField label="Date" type="date" value={form.date} onChange={set('date')} />
          <FormField label="Notice Text" type="textarea" value={form.text || ''} onChange={set('text')} placeholder="Notice details..." />
          <SaveBtn onClick={handleSave} />
        </Modal>
      )}
    </div>
  );
};

export default NoticeBoardPanel;
