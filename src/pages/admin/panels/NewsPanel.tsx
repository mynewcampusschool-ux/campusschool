import React, { useState, useEffect } from 'react';
import { AdminTable, TableHeader, Modal, FormField, SaveBtn, Badge } from '../AdminComponents';
import { useCMS, type CMSNewsItem } from '../../../context/CMSContext';

const cols = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'author', label: 'Author' },
  { key: 'date', label: 'Date' },
  { key: 'statusBadge', label: 'Status' },
];

const empty = (): CMSNewsItem => ({ id: 0, title: '', category: 'Achievement', author: '', date: '', status: 'Draft', content: '', image: '', excerpt: '' });

const NewsPanel: React.FC = () => {
  const { cms, updateNews } = useCMS();
  const [items, setItems] = useState<CMSNewsItem[]>(cms.news);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<CMSNewsItem>(empty());
  const [editing, setEditing] = useState(false);
  const set = (k: keyof CMSNewsItem) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { setItems(cms.news); }, [cms.news]);

  const filtered = items.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase()),
  );
  const tableData = filtered.map((n) => ({
    ...n,
    statusBadge: <Badge label={n.status} color={n.status === 'Published' ? '#0B6B4B' : '#D97706'} />,
  }));

  const openAdd = () => { setForm(empty()); setEditing(false); setModal(true); };
  const openEdit = (row: CMSNewsItem) => { setForm({ ...row }); setEditing(true); setModal(true); };
  const handleDelete = (id: number | string) => {
    const next = items.filter((n) => n.id !== id);
    setItems(next); updateNews(next);
  };
  const handleSave = () => {
    const next = editing
      ? items.map((n) => (n.id === form.id ? { ...form } : n))
      : [...items, { ...form, id: Date.now() }];
    setItems(next); updateNews(next); setModal(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <TableHeader title={`News (${filtered.length})`} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Add News" />
      <AdminTable columns={cols} data={tableData} onEdit={openEdit} onDelete={handleDelete} />
      {modal && (
        <Modal title={editing ? 'Edit News' : 'Add News'} onClose={() => setModal(false)}>
          <FormField label="Title" value={form.title} onChange={set('title')} placeholder="News title" required />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Category</label>
              <select value={form.category} onChange={(e) => set('category')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option>Achievement</option><option>Infrastructure</option><option>Initiative</option><option>Sports</option><option>Academic</option><option>General</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Status</label>
              <select value={form.status} onChange={(e) => set('status')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option>Draft</option><option>Published</option>
              </select>
            </div>
          </div>
          <FormField label="Author" value={form.author} onChange={set('author')} placeholder="Author name" />
          <FormField label="Date" type="date" value={form.date} onChange={set('date')} />
          <FormField label="Image URL" value={form.image || ''} onChange={set('image')} placeholder="https://..." />
          <FormField label="Excerpt" value={form.excerpt || ''} onChange={set('excerpt')} placeholder="Short description..." />
          <FormField label="Content" type="textarea" value={form.content || ''} onChange={set('content')} placeholder="News content..." />
          <SaveBtn onClick={handleSave} />
        </Modal>
      )}
    </div>
  );
};

export default NewsPanel;
