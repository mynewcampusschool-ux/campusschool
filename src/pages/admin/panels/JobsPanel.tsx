import React, { useState, useEffect } from 'react';
import { AdminTable, TableHeader, Modal, FormField, SaveBtn, Badge } from '../AdminComponents';
import { useCMS, type CMSJob } from '../../../context/CMSContext';

const cols = [
  { key: 'title', label: 'Job Title' },
  { key: 'company', label: 'Company' },
  { key: 'location', label: 'Location' },
  { key: 'typeBadge', label: 'Type' },
  { key: 'postedBy', label: 'Posted By' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'statusBadge', label: 'Status' },
];

const empty = (): CMSJob => ({ id: 0, title: '', company: '', location: '', type: 'Full-time', skills: [], postedBy: '', deadline: '', status: 'Active', description: '' });

const JobsPanel: React.FC = () => {
  const { cms, updateJobs } = useCMS();
  const [items, setItems] = useState<CMSJob[]>(cms.jobs);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<CMSJob>(empty());
  const [skillsStr, setSkillsStr] = useState('');
  const [editing, setEditing] = useState(false);
  const set = (k: keyof CMSJob) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { setItems(cms.jobs); }, [cms.jobs]);

  const filtered = items.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase()),
  );
  const tableData = filtered.map((j) => ({
    ...j,
    typeBadge: <Badge label={j.type} color={j.type === 'Internship' ? '#3B82F6' : '#0B6B4B'} />,
    statusBadge: <Badge label={j.status} color={j.status === 'Active' ? '#0B6B4B' : '#EF4444'} />,
  }));

  const openAdd = () => { setForm(empty()); setSkillsStr(''); setEditing(false); setModal(true); };
  const openEdit = (row: CMSJob) => {
    setForm({ ...row });
    setSkillsStr(Array.isArray(row.skills) ? row.skills.join(', ') : '');
    setEditing(true); setModal(true);
  };
  const handleDelete = (id: number | string) => {
    const next = items.filter((j) => j.id !== id);
    setItems(next); updateJobs(next);
  };
  const handleSave = () => {
    const skills = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const record = { ...form, skills };
    const next = editing
      ? items.map((j) => (j.id === record.id ? record : j))
      : [...items, { ...record, id: Date.now() }];
    setItems(next); updateJobs(next); setModal(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <TableHeader title={`Jobs & Internships (${filtered.length})`} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Post Job" />
      <AdminTable columns={cols} data={tableData} onEdit={openEdit} onDelete={handleDelete} />
      {modal && (
        <Modal title={editing ? 'Edit Job' : 'Post Job'} onClose={() => setModal(false)}>
          <FormField label="Job Title" value={form.title} onChange={set('title')} placeholder="e.g. Software Engineer" required />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <FormField label="Company" value={form.company} onChange={set('company')} placeholder="Company name" required />
            <FormField label="Location" value={form.location} onChange={set('location')} placeholder="City or Remote" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Job Type</label>
              <select value={form.type} onChange={(e) => set('type')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Status</label>
              <select value={form.status} onChange={(e) => set('status')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option>Active</option><option>Closed</option>
              </select>
            </div>
          </div>
          <FormField label="Skills Required (comma separated)" value={skillsStr} onChange={setSkillsStr} placeholder="React, Node.js, TypeScript" />
          <FormField label="Posted By (Alumni Name)" value={form.postedBy} onChange={set('postedBy')} placeholder="Alumni name" />
          <FormField label="Application Deadline" type="date" value={form.deadline} onChange={set('deadline')} />
          <FormField label="Job Description" type="textarea" value={form.description || ''} onChange={set('description')} placeholder="Job description..." />
          <SaveBtn onClick={handleSave} />
        </Modal>
      )}
    </div>
  );
};

export default JobsPanel;
