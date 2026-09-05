import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave } from 'react-icons/fi';
import { useCMS, type StatItem } from '../../../context/CMSContext';

const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };

const emptyItem = (): Omit<StatItem, 'id'> => ({ label: '', value: 0, suffix: '+' });

const StatsPanel: React.FC = () => {
  const { cms, updateStats } = useCMS();
  const [stats, setStats] = useState<StatItem[]>(cms.stats);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyItem());
  const [saved, setSaved] = useState(false);

  useEffect(() => { setStats(cms.stats); }, [cms.stats]);

  const set = (k: keyof typeof form) => (v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => { setForm(emptyItem()); setEditId(null); setModal(true); };
  const openEdit = (s: StatItem) => { setForm({ label: s.label, value: s.value, suffix: s.suffix }); setEditId(s.id); setModal(true); };

  const saveModal = () => {
    if (!form.label.trim()) return;
    if (editId !== null) {
      setStats((p) => p.map((s) => s.id === editId ? { ...form, id: editId } : s));
    } else {
      setStats((p) => [...p, { ...form, id: Date.now() }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setStats((p) => p.filter((s) => s.id !== id));

  const handleSave = () => {
    updateStats(stats);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>Statistics</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{stats.length} counters</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            <FiPlus size={14} /> Add Counter
          </button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: saved ? '#059669' : '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'background 0.3s' }}>
            <FiSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {stats.map((stat, i) => (
          <motion.div key={stat.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            style={{ background: 'linear-gradient(135deg,rgba(11,107,75,0.06),rgba(11,107,75,0.02))', border: '1px solid rgba(11,107,75,0.15)', borderRadius: '0.875rem', padding: '1.25rem', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0B6B4B', lineHeight: 1 }}>
              {stat.value.toLocaleString()}<span style={{ color: '#D4AF37' }}>{stat.suffix}</span>
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.35rem' }}>{stat.label}</div>
            <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.3rem' }}>
              <button onClick={() => openEdit(stat)} style={{ width: 24, height: 24, borderRadius: '0.35rem', background: 'rgba(11,107,75,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B6B4B' }}>
                <FiEdit2 size={11} />
              </button>
              <button onClick={() => remove(stat.id)} style={{ width: 24, height: 24, borderRadius: '0.35rem', background: '#FEE2E2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                <FiTrash2 size={11} />
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
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>{editId ? 'Edit Counter' : 'Add Counter'}</h3>
                <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div><label style={lbl}>Label *</label><input value={form.label} onChange={(e) => set('label')(e.target.value)} placeholder="e.g. Alumni" style={inp} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.875rem' }}>
                  <div><label style={lbl}>Value *</label><input type="number" value={form.value} onChange={(e) => set('value')(Number(e.target.value))} style={inp} /></div>
                  <div><label style={lbl}>Suffix</label><input value={form.suffix} onChange={(e) => set('suffix')(e.target.value)} placeholder="+" style={inp} /></div>
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

export default StatsPanel;
