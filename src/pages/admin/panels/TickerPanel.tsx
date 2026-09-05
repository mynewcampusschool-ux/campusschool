import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { useCMS, type TickerItem } from '../../../context/CMSContext';

const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };

const emptyItem = (): Omit<TickerItem, 'id'> => ({ text: '', highlight: '', emoji: '📢', enabled: true });

const TickerPanel: React.FC = () => {
  const { cms, updateTicker } = useCMS();
  const [items, setItems] = useState<TickerItem[]>(cms.ticker);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyItem());
  const [saved, setSaved] = useState(false);

  useEffect(() => { setItems(cms.ticker); }, [cms.ticker]);

  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => { setForm(emptyItem()); setEditId(null); setModal(true); };
  const openEdit = (item: TickerItem) => { setForm({ ...item }); setEditId(item.id); setModal(true); };

  const saveModal = () => {
    if (!form.text.trim()) return;
    if (editId !== null) {
      setItems((p) => p.map((t) => t.id === editId ? { ...form, id: editId } : t));
    } else {
      setItems((p) => [...p, { ...form, id: Date.now() }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setItems((p) => p.filter((t) => t.id !== id));
  const toggle = (id: number) => setItems((p) => p.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t));

  const moveUp = (i: number) => {
    if (i === 0) return;
    setItems((p) => { const a = [...p]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; });
  };
  const moveDown = (i: number) => {
    setItems((p) => { if (i >= p.length - 1) return p; const a = [...p]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a; });
  };

  const handleSave = () => {
    updateTicker(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>News Ticker</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{items.filter((t) => t.enabled).length} active items</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            <FiPlus size={14} /> Add News
          </button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: saved ? '#059669' : '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'background 0.3s' }}>
            <FiSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.6rem', border: '1px solid #E5E7EB', background: item.enabled ? '#F9FAFB' : '#F3F4F6', opacity: item.enabled ? 1 : 0.6 }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.82rem', color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.text} <span style={{ color: '#D4AF37', fontWeight: 700 }}>{item.highlight}</span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
              <button onClick={() => moveUp(i)} style={{ width: 26, height: 26, borderRadius: '0.35rem', background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, color: '#6B7280' }}>↑</button>
              <button onClick={() => moveDown(i)} style={{ width: 26, height: 26, borderRadius: '0.35rem', background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, color: '#6B7280' }}>↓</button>
              <button onClick={() => toggle(item.id)} style={{ width: 26, height: 26, borderRadius: '0.35rem', background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.enabled ? '#0B6B4B' : '#9CA3AF' }}>
                {item.enabled ? <FiEye size={12} /> : <FiEyeOff size={12} />}
              </button>
              <button onClick={() => openEdit(item)} style={{ width: 26, height: 26, borderRadius: '0.35rem', background: 'rgba(11,107,75,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B6B4B' }}>
                <FiEdit2 size={12} />
              </button>
              <button onClick={() => remove(item.id)} style={{ width: 26, height: 26, borderRadius: '0.35rem', background: '#FEE2E2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
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
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>{editId ? 'Edit News Item' : 'Add News Item'}</h3>
                <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.875rem' }}>
                  <div><label style={lbl}>Emoji</label><input value={form.emoji} onChange={(e) => set('emoji')(e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>News Text *</label><input value={form.text} onChange={(e) => set('text')(e.target.value)} placeholder="Main news text" style={inp} /></div>
                </div>
                <div><label style={lbl}>Highlight (golden text)</label><input value={form.highlight} onChange={(e) => set('highlight')(e.target.value)} placeholder="e.g. Register Now" style={inp} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="ticker-enabled" checked={form.enabled} onChange={(e) => set('enabled')(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="ticker-enabled" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Enabled</label>
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

export default TickerPanel;
