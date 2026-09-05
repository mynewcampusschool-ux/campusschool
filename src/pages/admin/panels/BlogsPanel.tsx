import React, { useState, useEffect } from 'react';
import { AdminTable, TableHeader, Modal, FormField, SaveBtn, Badge } from '../AdminComponents';
import { useCMS, type CMSBlog } from '../../../context/CMSContext';

const cols = [
  { key: 'title', label: 'Blog Title' },
  { key: 'author', label: 'Author' },
  { key: 'category', label: 'Category' },
  { key: 'date', label: 'Date' },
  { key: 'views', label: 'Views' },
  { key: 'statusBadge', label: 'Status' },
];

const empty = (): CMSBlog => ({ id: 0, title: '', author: '', category: 'Career', date: '', status: 'Draft', content: '', views: 0, image: '', excerpt: '' });

const BlogsPanel: React.FC = () => {
  const { cms, updateBlogs } = useCMS();
  const [items, setItems] = useState<CMSBlog[]>(cms.blogs);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<CMSBlog>(empty());
  const [editing, setEditing] = useState(false);
  const set = (k: keyof CMSBlog) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { setItems(cms.blogs); }, [cms.blogs]);

  const filtered = items.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()),
  );
  const tableData = filtered.map((b) => ({
    ...b,
    statusBadge: <Badge label={b.status} color={b.status === 'Published' ? '#0B6B4B' : '#D97706'} />,
  }));

  const openAdd = () => { setForm(empty()); setEditing(false); setModal(true); };
  const openEdit = (row: CMSBlog) => { setForm({ ...row }); setEditing(true); setModal(true); };
  const handleDelete = (id: number | string) => {
    const next = items.filter((b) => b.id !== id);
    setItems(next); updateBlogs(next);
  };
  const handleSave = () => {
    const next = editing
      ? items.map((b) => (b.id === form.id ? { ...form } : b))
      : [...items, { ...form, id: Date.now() }];
    setItems(next); updateBlogs(next); setModal(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <TableHeader title={`Blogs (${filtered.length})`} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Add Blog" />
      <AdminTable columns={cols} data={tableData} onEdit={openEdit} onDelete={handleDelete} />
      {modal && (
        <Modal title={editing ? 'Edit Blog' : 'Add Blog'} onClose={() => setModal(false)}>
          <FormField label="Blog Title" value={form.title} onChange={set('title')} placeholder="Enter blog title" required />
          <FormField label="Author" value={form.author} onChange={set('author')} placeholder="Author name" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Category</label>
              <select value={form.category} onChange={(e) => set('category')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option>Career</option><option>Networking</option><option>Education</option><option>Entrepreneurship</option><option>Life</option><option>Technology</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Status</label>
              <select value={form.status} onChange={(e) => set('status')(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none' }}>
                <option>Draft</option><option>Published</option>
              </select>
            </div>
          </div>
          <FormField label="Date" type="date" value={form.date} onChange={set('date')} />
          <FormField label="Image URL" value={form.image || ''} onChange={set('image')} placeholder="https://..." />
          <FormField label="Excerpt" value={form.excerpt || ''} onChange={set('excerpt')} placeholder="Short description..." />
          <FormField label="Content" type="textarea" value={form.content || ''} onChange={set('content')} placeholder="Blog content..." />
          <SaveBtn onClick={handleSave} />
        </Modal>
      )}
    </div>
  );
};

export default BlogsPanel;
