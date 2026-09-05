import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { useCMS, type CMSNotice } from '../../../context/CMSContext';

const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical' };

const TAG_COLORS = ['#0B6B4B', '#D4AF37', '#3B82F6', '#8B5CF6', '#EF4444', '#6B7280', '#D97706'];

const emptyNotice = (): Omit<CMSNotice, 'id'> => ({ title: '', text: '', date: '', tag: 'General', tagColor: '#0B6B4B', category: 'General', priority: 'low', enabled: true });

const NoticeBoardCMSPanel: React.FC = () => {
  const { cms, updateNotices } = useCMS();
  const [notices, setNotices] = useState<CMSNotice[]>(cms.notices);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyNotice());
  const [saved, setSaved] = useState(false);

  useEffect(() => { setNotices(cms.notices); }, [cms.notices]);

  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => { setForm(emptyNotice()); setEditId(null); setModal(true); };
  const openEdit = (n: CMSNotice) => { setForm({ ...n }); setEditId(n.id); setModal(true); };

  const saveModal = () => {
    if (!form.title.trim()) return;
    if (editId !== null) {
      setNotices((p) => p.map((n) => n.id === editId ? { ...form, id: editId } : n));
    } else {
      setNotices((p) => [...p, { ...form, id: Date.now() }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setNotices((p) => p.filter((n) => n.id !== id));
  const toggle = (id: number) => setNotices((p) => p.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n));

  const handleSave = () => {
    updateNotices(notices);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>Notice Board</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{notices.filter((n) => n.enabled).length} active notices</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            <FiPlus size={14} /> Add Notice
          </button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: saved ? '#059669' : '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'background 0.3s' }}>
            <FiSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {notices.map((notice, i) => (
          <motion.div key={notice.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.6rem', border: '1px solid #E5E7EB', background: notice.enabled ? '#F9FAFB' : '#F3F4F6', opacity: notice.enabled ? 1 : 0.6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: notice.tagColor, flexShrink: 0, marginTop: 6 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#fff', background: notice.tagColor, padding: '0.1rem 0.5rem', borderRadius: '0.25rem' }}>{notice.tag}</span>
                <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{notice.date}</span>
              </div>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notice.title}</p>
              <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notice.text}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
              <button onClick={() => toggle(notice.id)} style={{ width: 28, height: 28, borderRadius: '0.35rem', background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: notice.enabled ? '#0B6B4B' : '#9CA3AF' }}>
                {notice.enabled ? <FiEye size={12} /> : <FiEyeOff size={12} />}
              </button>
              <button onClick={() => openEdit(notice)} style={{ width: 28, height: 28, borderRadius: '0.35rem', background: 'rgba(11,107,75,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B6B4B' }}>
                <FiEdit2 size={12} />
              </button>
              <button onClick={() => remove(notice.id)} style={{ width: 28, height: 28, borderRadius: '0.35rem', background: '#FEE2E2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
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
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>{editId ? 'Edit Notice' : 'Add Notice'}</h3>
                <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div><label style={lbl}>Title *</label><input value={form.title} onChange={(e) => set('title')(e.target.value)} placeholder="Notice title" style={inp} /></div>
                <div><label style={lbl}>Notice Text</label><textarea value={form.text} onChange={(e) => set('text')(e.target.value)} rows={2} placeholder="Notice details..." style={ta} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div><label style={lbl}>Tag Label</label><input value={form.tag} onChange={(e) => set('tag')(e.target.value)} placeholder="e.g. Event" style={inp} /></div>
                  <div><label style={lbl}>Date</label><input value={form.date} onChange={(e) => set('date')(e.target.value)} placeholder="June 1, 2025" style={inp} /></div>
                </div>
                <div>
                  <label style={lbl}>Tag Color</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {TAG_COLORS.map((c) => (
                      <button key={c} onClick={() => set('tagColor')(c)}
                        style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.tagColor === c ? '3px solid #111827' : '2px solid transparent', cursor: 'pointer', transition: 'border 0.15s' }} />
                    ))}
                    <input type="color" value={form.tagColor} onChange={(e) => set('tagColor')(e.target.value)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="nb-enabled" checked={form.enabled} onChange={(e) => set('enabled')(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="nb-enabled" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Enabled</label>
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

export default NoticeBoardCMSPanel;
