import React, { useState, useEffect } from 'react';
import { AdminTable, TableHeader, Modal, FormField, SaveBtn, Badge } from '../AdminComponents';
import { useCMS, type CMSEvent } from '../../../context/CMSContext';

const cols = [
  { key: 'title', label: 'Event Title' },
  { key: 'date', label: 'Date (DD)' },
  { key: 'month', label: 'Month' },
  { key: 'time', label: 'Time' },
  { key: 'location', label: 'Location' },
  { key: 'statusBadge', label: 'Status' },
];

const empty = (): CMSEvent => ({ id: 0, title: '', date: '', month: '', time: '', location: '', image: '', description: '', registerLink: '/events', enabled: true });

const EventsPanel: React.FC = () => {
  const { cms, updateEvents } = useCMS();
  const [events, setEvents] = useState<CMSEvent[]>(cms.events);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<CMSEvent>(empty());
  const [editing, setEditing] = useState(false);
  const set = (k: keyof CMSEvent) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { setEvents(cms.events); }, [cms.events]);

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase()));
  const tableData = filtered.map(e => ({ ...e, statusBadge: <Badge label={e.enabled ? 'Active' : 'Hidden'} color={e.enabled ? '#0B6B4B' : '#6B7280'} /> }));

  const openAdd = () => { setForm(empty()); setEditing(false); setModal(true); };
  const openEdit = (row: CMSEvent) => { setForm({ ...row }); setEditing(true); setModal(true); };
  const handleDelete = (id: number | string) => {
    const next = events.filter(e => e.id !== id);
    setEvents(next); updateEvents(next);
  };
  const handleSave = () => {
    const next = editing
      ? events.map(e => e.id === form.id ? { ...form } : e)
      : [...events, { ...form, id: Date.now() }];
    setEvents(next); updateEvents(next); setModal(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <TableHeader title={`Events (${filtered.length})`} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Add Event" />
      <AdminTable columns={cols} data={tableData} onEdit={openEdit} onDelete={handleDelete} />
      {modal && (
        <Modal title={editing ? 'Edit Event' : 'Add Event'} onClose={() => setModal(false)}>
          <FormField label="Event Title" value={form.title} onChange={set('title')} placeholder="Enter event title" required />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            <FormField label="Date (DD)" value={form.date} onChange={set('date')} placeholder="20" required />
            <FormField label="Month (MMM)" value={form.month} onChange={set('month')} placeholder="JUN" />
            <FormField label="Time" value={form.time} onChange={set('time')} placeholder="10:00 AM - 01:00 PM" />
          </div>
          <FormField label="Location" value={form.location} onChange={set('location')} placeholder="Venue or Online" />
          <FormField label="Image URL" value={form.image || ''} onChange={set('image')} placeholder="https://..." />
          <FormField label="Register Link" value={form.registerLink || '/events'} onChange={set('registerLink')} placeholder="/events" />
          <FormField label="Description" type="textarea" value={form.description || ''} onChange={set('description')} placeholder="Event description..." />
          <SaveBtn onClick={handleSave} />
        </Modal>
      )}
    </div>
  );
};

export default EventsPanel;
