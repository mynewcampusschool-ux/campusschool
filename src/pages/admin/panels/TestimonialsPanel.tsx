import React, { useState, useEffect } from 'react';
import { AdminTable, TableHeader, Modal, FormField, SaveBtn, Badge } from '../AdminComponents';
import { useCMS, type CMSTestimonial } from '../../../context/CMSContext';

const cols = [
  { key: 'name', label: 'Name' },
  { key: 'batch', label: 'Batch' },
  { key: 'designation', label: 'Designation' },
  { key: 'statusBadge', label: 'Status' },
];

const empty = (): CMSTestimonial => ({ id: 0, name: '', batch: '', designation: '', photo: '', text: '', enabled: true });

const TestimonialsPanel: React.FC = () => {
  const { cms, updateTestimonials } = useCMS();
  const [items, setItems] = useState<CMSTestimonial[]>(cms.testimonials);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<CMSTestimonial>(empty());
  const [editing, setEditing] = useState(false);
  const set = (k: keyof CMSTestimonial) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { setItems(cms.testimonials); }, [cms.testimonials]);

  const filtered = items.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.designation.toLowerCase().includes(search.toLowerCase()),
  );
  const tableData = filtered.map((t) => ({
    ...t,
    statusBadge: <Badge label={t.enabled ? 'Approved' : 'Hidden'} color={t.enabled ? '#0B6B4B' : '#D97706'} />,
  }));

  const openAdd = () => { setForm(empty()); setEditing(false); setModal(true); };
  const openEdit = (row: CMSTestimonial) => { setForm({ ...row }); setEditing(true); setModal(true); };
  const handleDelete = (id: number | string) => {
    const next = items.filter((t) => t.id !== id);
    setItems(next); updateTestimonials(next);
  };
  const handleSave = () => {
    const next = editing
      ? items.map((t) => (t.id === form.id ? { ...form } : t))
      : [...items, { ...form, id: Date.now() }];
    setItems(next); updateTestimonials(next); setModal(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <TableHeader title={`Testimonials (${filtered.length})`} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Add Testimonial" />
      <AdminTable columns={cols} data={tableData} onEdit={openEdit} onDelete={handleDelete} />
      {modal && (
        <Modal title={editing ? 'Edit Testimonial' : 'Add Testimonial'} onClose={() => setModal(false)}>
          <FormField label="Full Name" value={form.name} onChange={set('name')} placeholder="Alumni name" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Batch Year" value={form.batch} onChange={set('batch')} placeholder="e.g. 2015" />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Status</label>
              <select value={form.enabled ? 'true' : 'false'} onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.value === 'true' }))} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option value="true">Approved</option><option value="false">Hidden</option>
              </select>
            </div>
          </div>
          <FormField label="Designation & Company" value={form.designation} onChange={set('designation')} placeholder="e.g. Software Engineer, Google" />
          <FormField label="Photo URL" value={form.photo || ''} onChange={set('photo')} placeholder="https://..." />
          <FormField label="Testimonial Text" type="textarea" value={form.text} onChange={set('text')} placeholder="What they said..." required />
          <SaveBtn onClick={handleSave} />
        </Modal>
      )}
    </div>
  );
};

export default TestimonialsPanel;
