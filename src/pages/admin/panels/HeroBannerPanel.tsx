import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiEye, FiEyeOff, FiImage } from 'react-icons/fi';
import { useCMS, type HeroSlide } from '../../../context/CMSContext';

const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical' };

const emptySlide = (): Omit<HeroSlide, 'id'> => ({
  image: '',
  title: '',
  subtitle: '',
  description: '',
  primaryBtnLabel: 'Join Alumni Network',
  primaryBtnLink: '/auth/register',
  secondaryBtnLabel: 'Explore Community',
  secondaryBtnLink: '/directory',
  enabled: true,
});

const HeroBannerPanel: React.FC = () => {
  const { cms, updateHeroSlides } = useCMS();
  const [slides, setSlides] = useState<HeroSlide[]>(() => cms.heroSlides);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptySlide());
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setSlides(cms.heroSlides); }, [cms.heroSlides]);

  const set = (k: keyof typeof form) => (v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => { setForm(emptySlide()); setEditId(null); setModal(true); };
  const openEdit = (s: HeroSlide) => { setForm({ ...s }); setEditId(s.id); setModal(true); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        set('image')(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveModal = () => {
    if (!form.title.trim()) return;
    if (editId !== null) {
      setSlides((p) => p.map((s) => s.id === editId ? { ...form, id: editId } : s));
    } else {
      setSlides((p) => [...p, { ...form, id: Date.now() }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setSlides((p) => p.filter((s) => s.id !== id));
  const toggle = (id: number) => setSlides((p) => p.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));

  const handleSave = () => {
    updateHeroSlides(slides);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>Hero Banner</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{slides.length} slides</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            <FiPlus size={14} /> Add Slide
          </button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: saved ? '#059669' : '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'background 0.3s' }}>
            <FiSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {slides.map((slide, i) => (
          <motion.div key={slide.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #E5E7EB', opacity: slide.enabled ? 1 : 0.55 }}>
            <div style={{ position: 'relative', height: 140 }}>
              {slide.image ? (
                <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0B6B4B,#094d36)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiImage size={32} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }}>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem', margin: 0 }}>{slide.title}</p>
                <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.75rem', margin: 0 }}>{slide.subtitle}</p>
              </div>
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.3rem' }}>
                <button onClick={() => toggle(slide.id)} style={{ width: 28, height: 28, borderRadius: '0.4rem', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: slide.enabled ? '#0B6B4B' : '#9CA3AF' }}>
                  {slide.enabled ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                </button>
                <button onClick={() => openEdit(slide)} style={{ width: 28, height: 28, borderRadius: '0.4rem', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B6B4B' }}>
                  <FiEdit2 size={12} />
                </button>
                <button onClick={() => remove(slide.id)} style={{ width: 28, height: 28, borderRadius: '0.4rem', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                  <FiTrash2 size={12} />
                </button>
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: '#F9FAFB' }}>
              <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.description}</p>
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
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>{editId ? 'Edit Slide' : 'Add Slide'}</h3>
                <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {/* Image */}
                <div>
                  <label style={lbl}>Background Image</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <button onClick={() => fileRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 0.875rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                      <FiImage size={13} /> Upload
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                    {form.image && <img src={form.image} alt="preview" style={{ width: 48, height: 48, borderRadius: '0.5rem', objectFit: 'cover' }} />}
                  </div>
                  <input value={form.image} onChange={(e) => set('image')(e.target.value)} placeholder="Or paste image URL" style={inp} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem' }}>
                  <div><label style={lbl}>Title *</label><input value={form.title} onChange={(e) => set('title')(e.target.value)} placeholder="Main heading" style={inp} /></div>
                  <div><label style={lbl}>Subtitle</label><input value={form.subtitle} onChange={(e) => set('subtitle')(e.target.value)} placeholder="Sub heading" style={inp} /></div>
                </div>
                <div><label style={lbl}>Description</label><textarea value={form.description} onChange={(e) => set('description')(e.target.value)} rows={2} placeholder="Slide description..." style={ta} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem' }}>
                  <div><label style={lbl}>Primary Button Label</label><input value={form.primaryBtnLabel} onChange={(e) => set('primaryBtnLabel')(e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>Primary Button Link</label><input value={form.primaryBtnLink} onChange={(e) => set('primaryBtnLink')(e.target.value)} style={inp} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem' }}>
                  <div><label style={lbl}>Secondary Button Label</label><input value={form.secondaryBtnLabel} onChange={(e) => set('secondaryBtnLabel')(e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>Secondary Button Link</label><input value={form.secondaryBtnLink} onChange={(e) => set('secondaryBtnLink')(e.target.value)} style={inp} /></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="slide-enabled" checked={form.enabled} onChange={(e) => set('enabled')(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="slide-enabled" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Enabled</label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button onClick={() => setModal(false)} style={{ padding: '0.6rem 1.2rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', background: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#6B7280' }}>Cancel</button>
                  <button onClick={saveModal} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <FiSave size={14} /> {editId ? 'Save Changes' : 'Add Slide'}
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

export default HeroBannerPanel;
