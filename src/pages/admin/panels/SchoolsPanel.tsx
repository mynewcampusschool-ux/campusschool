import React, { useState, useEffect } from 'react';
import { AdminTable, TableHeader, Modal, FormField, SaveBtn } from '../AdminComponents';
import { useCMS, type CMSSchool } from '../../../context/CMSContext';

const cols = [
  { key: 'name', label: 'School Name' },
  { key: 'established', label: 'Established' },
  { key: 'students', label: 'Students' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
];

const empty = (): CMSSchool => ({ id: 0, name: '', description: '', image: '', established: '', students: 0, location: '', status: 'Active' });

const SchoolsPanel: React.FC = () => {
  const { cms, updateSchools } = useCMS();
  const [items, setItems] = useState<CMSSchool[]>(cms.schools);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<CMSSchool>(empty());
  const [editing, setEditing] = useState(false);
  const set = (k: keyof CMSSchool) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { setItems(cms.schools); }, [cms.schools]);

  const filtered = items.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(empty()); setEditing(false); setModal(true); };
  const openEdit = (row: CMSSchool) => { setForm({ ...row }); setEditing(true); setModal(true); };
  const handleDelete = (id: number | string) => {
    const next = items.filter((s) => s.id !== id);
    setItems(next); updateSchools(next);
  };
  const handleSave = () => {
    const record = { ...form, students: Number(form.students) || 0 };
    const next = editing
      ? items.map((s) => (s.id === record.id ? record : s))
      : [...items, { ...record, id: Date.now() }];
    setItems(next); updateSchools(next); setModal(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <TableHeader title={`Schools (${filtered.length})`} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Add School" />
      <AdminTable columns={cols} data={filtered} onEdit={openEdit} onDelete={handleDelete} />
      {modal && (
        <Modal title={editing ? 'Edit School' : 'Add School'} onClose={() => setModal(false)}>
          <FormField label="School Name" value={form.name} onChange={set('name')} placeholder="Enter school name" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Established Year" value={form.established} onChange={set('established')} placeholder="e.g. 1972" />
            <FormField label="Total Students" value={String(form.students)} onChange={(v) => setForm((p) => ({ ...p, students: Number(v) || 0 }))} placeholder="e.g. 3500" />
          </div>
          <FormField label="Location" value={form.location} onChange={set('location')} placeholder="City, State" />
          <FormField label="Image URL" value={form.image || ''} onChange={set('image')} placeholder="https://..." />
          <FormField label="Description" type="textarea" value={form.description || ''} onChange={set('description')} placeholder="School description..." />
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Status</label>
            <select value={form.status} onChange={(e) => set('status')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
          <SaveBtn onClick={handleSave} />
        </Modal>
      )}
    </div>
  );
};

export default SchoolsPanel;
