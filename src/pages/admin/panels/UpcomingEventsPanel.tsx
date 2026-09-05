import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiEye, FiEyeOff, FiImage } from 'react-icons/fi';
import { useCMS, type CMSEvent } from '../../../context/CMSContext';

const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical' };

const emptyEvent = (): Omit<CMSEvent, 'id'> => ({ date: '', month: '', time: '', image: '', title: '', description: '', location: '', registerLink: '/events', enabled: true });

const UpcomingEventsPanel: React.FC = () => {
  const { cms, updateEvents } = useCMS();
  const [events, setEvents] = useState<CMSEvent[]>(cms.events);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyEvent());
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setEvents(cms.events); }, [cms.events]);

  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => { setForm(emptyEvent()); setEditId(null); setModal(true); };
  const openEdit = (e: CMSEvent) => { setForm({ ...e }); setEditId(e.id); setModal(true); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) set('image')(URL.createObjectURL(file));
  };

  const saveModal = () => {
    if (!form.title.trim()) return;
    if (editId !== null) {
      setEvents((p) => p.map((e) => e.id === editId ? { ...form, id: editId } : e));
    } else {
      setEvents((p) => [...p, { ...form, id: Date.now() }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setEvents((p) => p.filter((e) => e.id !== id));
  const toggle = (id: number) => setEvents((p) => p.map((e) => e.id === id ? { ...e, enabled: !e.enabled } : e));

  const handleSave = () => {
    updateEvents(events);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>Upcoming Events</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{events.length} events</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            <FiPlus size={14} /> Add Event
          </button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: saved ? '#059669' : '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'background 0.3s' }}>
            <FiSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {events.map((event, i) => (
          <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E5E7EB', background: event.enabled ? '#F9FAFB' : '#F3F4F6', opacity: event.enabled ? 1 : 0.6, alignItems: 'center' }}>
            {event.image && <img src={event.image} alt={event.title} style={{ width: 72, height: 72, borderRadius: '0.6rem', objectFit: 'cover', flexShrink: 0 }} />}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 48 }}>
              <div style={{ background: '#0B6B4B', color: '#fff', borderRadius: '0.4rem 0.4rem 0 0', padding: '0.15rem 0', fontSize: '0.58rem', fontWeight: 800, width: '100%', textAlign: 'center' }}>{event.month}</div>
              <div style={{ background: 'rgba(11,107,75,0.1)', color: '#0B6B4B', borderRadius: '0 0 0.4rem 0.4rem', padding: '0.2rem 0', fontSize: '1.2rem', fontWeight: 900, width: '100%', textAlign: 'center', lineHeight: 1 }}>{event.date}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.85rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</p>
              <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: 0 }}>{event.location} · {event.time}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
              <button onClick={() => toggle(event.id)} style={{ width: 28, height: 28, borderRadius: '0.35rem', background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: event.enabled ? '#0B6B4B' : '#9CA3AF' }}>
                {event.enabled ? <FiEye size={12} /> : <FiEyeOff size={12} />}
              </button>
              <button onClick={() => openEdit(event)} style={{ width: 28, height: 28, borderRadius: '0.35rem', background: 'rgba(11,107,75,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B6B4B' }}>
                <FiEdit2 size={12} />
              </button>
              <button onClick={() => remove(event.id)} style={{ width: 28, height: 28, borderRadius: '0.35rem', background: '#FEE2E2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                <FiTrash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>{editId ? 'Edit Event' : 'Add Event'}</h3>
                <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div><label style={lbl}>Title *</label><input value={form.title} onChange={(e) => set('title')(e.target.value)} placeholder="Event title" style={inp} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem' }}>
                  <div><label style={lbl}>Date (DD)</label><input value={form.date} onChange={(e) => set('date')(e.target.value)} placeholder="20" style={inp} /></div>
                  <div><label style={lbl}>Month (MMM)</label><input value={form.month} onChange={(e) => set('month')(e.target.value)} placeholder="JUN" style={inp} /></div>
                  <div><label style={lbl}>Time</label><input value={form.time} onChange={(e) => set('time')(e.target.value)} placeholder="10:00 AM" style={inp} /></div>
                </div>
                <div><label style={lbl}>Location</label><input value={form.location} onChange={(e) => set('location')(e.target.value)} placeholder="Venue or Online" style={inp} /></div>
                <div>
                  <label style={lbl}>Event Image</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <button onClick={() => fileRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 0.875rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                      <FiImage size={13} /> Upload
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                    {form.image && <img src={form.image} alt="preview" style={{ width: 48, height: 48, borderRadius: '0.5rem', objectFit: 'cover' }} />}
                  </div>
                  <input value={form.image} onChange={(e) => set('image')(e.target.value)} placeholder="Or paste image URL" style={inp} />
                </div>
                <div><label style={lbl}>Description</label><textarea value={form.description} onChange={(e) => set('description')(e.target.value)} rows={2} placeholder="Event description..." style={ta} /></div>
                <div><label style={lbl}>Register Link</label><input value={form.registerLink} onChange={(e) => set('registerLink')(e.target.value)} placeholder="/events or https://..." style={inp} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="ev-enabled" checked={form.enabled} onChange={(e) => set('enabled')(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="ev-enabled" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Enabled</label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button onClick={() => setModal(false)} style={{ padding: '0.6rem 1.2rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', background: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#6B7280' }}>Cancel</button>
                  <button onClick={saveModal} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <FiSave size={14} /> {editId ? 'Save' : 'Add'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpcomingEventsPanel;
