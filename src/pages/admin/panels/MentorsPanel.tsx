import React, { useState, useEffect } from 'react';
import { AdminTable, TableHeader, Modal, FormField, SaveBtn, Badge } from '../AdminComponents';
import { useCMS, type CMSMentor } from '../../../context/CMSContext';

const cols = [
  { key: 'name', label: 'Name' },
  { key: 'designation', label: 'Designation' },
  { key: 'company', label: 'Company' },
  { key: 'expertise', label: 'Expertise' },
  { key: 'rating', label: 'Rating' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'statusBadge', label: 'Status' },
];

const empty = (): CMSMentor => ({ id: 0, name: '', photo: '', designation: '', company: '', expertise: [], rating: 5, sessions: 0, bio: '', availability: [], status: 'Pending' });

const MentorsPanel: React.FC = () => {
  const { cms, updateMentors } = useCMS();
  const [items, setItems] = useState<CMSMentor[]>(cms.mentors);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<CMSMentor>(empty());
  const [expertiseStr, setExpertiseStr] = useState('');
  const [availStr, setAvailStr] = useState('');
  const [editing, setEditing] = useState(false);
  const set = (k: keyof CMSMentor) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { setItems(cms.mentors); }, [cms.mentors]);

  const filtered = items.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.company.toLowerCase().includes(search.toLowerCase()),
  );
  const tableData = filtered.map((m) => ({
    ...m,
    expertise: Array.isArray(m.expertise) ? m.expertise.join(', ') : m.expertise,
    statusBadge: <Badge label={m.status} color={m.status === 'Active' ? '#0B6B4B' : '#D97706'} />,
  }));

  const openAdd = () => { setForm(empty()); setExpertiseStr(''); setAvailStr(''); setEditing(false); setModal(true); };
  const openEdit = (row: CMSMentor) => {
    setForm({ ...row });
    setExpertiseStr(Array.isArray(row.expertise) ? row.expertise.join(', ') : '');
    setAvailStr(Array.isArray(row.availability) ? row.availability.join(', ') : '');
    setEditing(true); setModal(true);
  };
  const handleDelete = (id: number | string) => {
    const next = items.filter((m) => m.id !== id);
    setItems(next); updateMentors(next);
  };
  const handleSave = () => {
    const expertise = expertiseStr.split(',').map((s) => s.trim()).filter(Boolean);
    const availability = availStr.split(',').map((s) => s.trim()).filter(Boolean);
    const record = { ...form, expertise, availability, rating: parseFloat(String(form.rating)) || 5 };
    const next = editing
      ? items.map((m) => (m.id === record.id ? record : m))
      : [...items, { ...record, id: Date.now() }];
    setItems(next); updateMentors(next); setModal(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <TableHeader title={`Mentors (${filtered.length})`} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Add Mentor" />
      <AdminTable columns={cols} data={tableData} onEdit={openEdit} onDelete={handleDelete} />
      {modal && (
        <Modal title={editing ? 'Edit Mentor' : 'Add Mentor'} onClose={() => setModal(false)}>
          <FormField label="Full Name" value={form.name} onChange={set('name')} placeholder="Mentor name" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Designation" value={form.designation} onChange={set('designation')} placeholder="e.g. Product Manager" />
            <FormField label="Company" value={form.company} onChange={set('company')} placeholder="Company name" />
          </div>
          <FormField label="Photo URL" value={form.photo || ''} onChange={set('photo')} placeholder="https://..." />
          <FormField label="Expertise (comma separated)" value={expertiseStr} onChange={setExpertiseStr} placeholder="e.g. Product, Leadership, Strategy" />
          <FormField label="Availability (e.g. Mon, Wed, Fri)" value={availStr} onChange={setAvailStr} placeholder="Mon, Wed, Fri" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Rating (out of 5)" value={String(form.rating)} onChange={(v) => setForm((p) => ({ ...p, rating: parseFloat(v) || 5 }))} placeholder="4.9" />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Status</label>
              <select value={form.status} onChange={(e) => set('status')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option>Active</option><option>Pending</option><option>Inactive</option>
              </select>
            </div>
          </div>
          <FormField label="Bio" type="textarea" value={form.bio || ''} onChange={set('bio')} placeholder="Short bio..." />
          <SaveBtn onClick={handleSave} />
        </Modal>
      )}
    </div>
  );
};

export default MentorsPanel;
