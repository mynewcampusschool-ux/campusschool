import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { useCMS, type QuickAccessCard } from '../../../context/CMSContext';

const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };

const emptyCard = (): Omit<QuickAccessCard, 'id'> => ({ icon: '🔗', title: '', link: '/', enabled: true });

const QuickAccessPanel: React.FC = () => {
  const { cms, updateQuickAccess } = useCMS();
  const [cards, setCards] = useState<QuickAccessCard[]>(cms.quickAccess);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyCard());
  const [saved, setSaved] = useState(false);

  useEffect(() => { setCards(cms.quickAccess); }, [cms.quickAccess]);

  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => { setForm(emptyCard()); setEditId(null); setModal(true); };
  const openEdit = (c: QuickAccessCard) => { setForm({ ...c }); setEditId(c.id); setModal(true); };

  const saveModal = () => {
    if (!form.title.trim()) return;
    if (editId !== null) {
      setCards((p) => p.map((c) => c.id === editId ? { ...form, id: editId } : c));
    } else {
      setCards((p) => [...p, { ...form, id: Date.now() }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setCards((p) => p.filter((c) => c.id !== id));
  const toggle = (id: number) => setCards((p) => p.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));

  const handleSave = () => {
    updateQuickAccess(cards);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>Quick Access Cards</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>Shown in Hero section sidebar</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            <FiPlus size={14} /> Add Card
          </button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: saved ? '#059669' : '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'background 0.3s' }}>
            <FiSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {cards.map((card, i) => (
          <motion.div key={card.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.6rem', border: '1px solid #E5E7EB', background: card.enabled ? '#F9FAFB' : '#F3F4F6', opacity: card.enabled ? 1 : 0.6 }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{card.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', margin: 0 }}>{card.title}</p>
              <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: 0 }}>{card.link}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
              <button onClick={() => toggle(card.id)} style={{ width: 28, height: 28, borderRadius: '0.35rem', background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.enabled ? '#0B6B4B' : '#9CA3AF' }}>
                {card.enabled ? <FiEye size={12} /> : <FiEyeOff size={12} />}
              </button>
              <button onClick={() => openEdit(card)} style={{ width: 28, height: 28, borderRadius: '0.35rem', background: 'rgba(11,107,75,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B6B4B' }}>
                <FiEdit2 size={12} />
              </button>
              <button onClick={() => remove(card.id)} style={{ width: 28, height: 28, borderRadius: '0.35rem', background: '#FEE2E2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
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
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>{editId ? 'Edit Card' : 'Add Card'}</h3>
                <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.875rem' }}>
                  <div><label style={lbl}>Icon (emoji)</label><input value={form.icon} onChange={(e) => set('icon')(e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>Title *</label><input value={form.title} onChange={(e) => set('title')(e.target.value)} placeholder="Card title" style={inp} /></div>
                </div>
                <div><label style={lbl}>Link</label><input value={form.link} onChange={(e) => set('link')(e.target.value)} placeholder="/path or https://..." style={inp} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="qa-enabled" checked={form.enabled} onChange={(e) => set('enabled')(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="qa-enabled" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Enabled</label>
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

export default QuickAccessPanel;
