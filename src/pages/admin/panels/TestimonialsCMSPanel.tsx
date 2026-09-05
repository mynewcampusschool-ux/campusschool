import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiEye, FiEyeOff, FiImage } from 'react-icons/fi';
import { useCMS, type CMSTestimonial } from '../../../context/CMSContext';

const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical' };

const emptyItem = (): Omit<CMSTestimonial, 'id'> => ({ photo: '', name: '', batch: '', designation: '', text: '', enabled: true });

const TestimonialsCMSPanel: React.FC = () => {
  const { cms, updateTestimonials } = useCMS();
  const [items, setItems] = useState<CMSTestimonial[]>(cms.testimonials);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyItem());
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setItems(cms.testimonials); }, [cms.testimonials]);

  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => { setForm(emptyItem()); setEditId(null); setModal(true); };
  const openEdit = (t: CMSTestimonial) => { setForm({ ...t }); setEditId(t.id); setModal(true); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        set('photo')(canvas.toDataURL('image/jpeg', 0.70));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveModal = () => {
    if (!form.name.trim()) return;
    if (editId !== null) {
      setItems((p) => p.map((t) => t.id === editId ? { ...form, id: editId } : t));
    } else {
      setItems((p) => [...p, { ...form, id: Date.now() }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setItems((p) => p.filter((t) => t.id !== id));
  const toggle = (id: number) => setItems((p) => p.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t));

  const handleSave = () => {
    updateTestimonials(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>Testimonials</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{items.length} testimonials</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            <FiPlus size={14} /> Add Testimonial
          </button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: saved ? '#059669' : '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'background 0.3s' }}>
            <FiSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {items.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ borderRadius: '0.875rem', border: '1px solid #E5E7EB', padding: '1.25rem', background: t.enabled ? '#F9FAFB' : '#F3F4F6', opacity: t.enabled ? 1 : 0.6, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              {t.photo ? (
                <img src={t.photo} alt={t.name} style={{ width: 48, height: 48, borderRadius: '0.6rem', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: '0.6rem', background: '#0B6B4B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                  {t.name[0]}
                </div>
              )}
              <div>
                <p style={{ fontWeight: 800, color: '#111827', fontSize: '0.85rem', margin: 0 }}>{t.name}</p>
                <p style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 600, margin: 0 }}>{t.designation}</p>
                <p style={{ color: '#9CA3AF', fontSize: '0.65rem', margin: 0 }}>{t.batch}</p>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#6B7280', fontStyle: 'italic', margin: 0, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>"{t.text}"</p>
            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.3rem' }}>
              <button onClick={() => toggle(t.id)} style={{ width: 26, height: 26, borderRadius: '0.35rem', background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.enabled ? '#0B6B4B' : '#9CA3AF' }}>
                {t.enabled ? <FiEye size={11} /> : <FiEyeOff size={11} />}
              </button>
              <button onClick={() => openEdit(t)} style={{ width: 26, height: 26, borderRadius: '0.35rem', background: 'rgba(11,107,75,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B6B4B' }}>
                <FiEdit2 size={11} />
              </button>
              <button onClick={() => remove(t.id)} style={{ width: 26, height: 26, borderRadius: '0.35rem', background: '#FEE2E2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
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
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div>
                  <label style={lbl}>Photo</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <button onClick={() => fileRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 0.875rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                      <FiImage size={13} /> Upload
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                    {form.photo && <img src={form.photo} alt="preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />}
                  </div>
                  <input value={form.photo} onChange={(e) => set('photo')(e.target.value)} placeholder="Or paste photo URL" style={inp} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div><label style={lbl}>Full Name *</label><input value={form.name} onChange={(e) => set('name')(e.target.value)} placeholder="Alumni name" style={inp} /></div>
                  <div><label style={lbl}>Batch</label><input value={form.batch} onChange={(e) => set('batch')(e.target.value)} placeholder="Batch of 2015" style={inp} /></div>
                </div>
                <div><label style={lbl}>Designation</label><input value={form.designation} onChange={(e) => set('designation')(e.target.value)} placeholder="e.g. Software Engineer, Google" style={inp} /></div>
                <div><label style={lbl}>Testimonial Text *</label><textarea value={form.text} onChange={(e) => set('text')(e.target.value)} rows={3} placeholder="What they said..." style={ta} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="tm-enabled" checked={form.enabled} onChange={(e) => set('enabled')(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="tm-enabled" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Enabled</label>
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

export default TestimonialsCMSPanel;
