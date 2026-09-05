import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiEye, FiEyeOff, FiImage } from 'react-icons/fi';
import { useCMS, type GalleryImage } from '../../../context/CMSContext';

const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };

const CATS = ['Events', 'Academics', 'Sports', 'Campus', 'Cultural'];
const SPANS = [{ label: 'Normal', value: '' }, { label: 'Wide (2 cols)', value: 'col-span-2' }, { label: 'Tall (2 rows)', value: 'row-span-2' }, { label: 'Large (2x2)', value: 'col-span-2 row-span-2' }];

const emptyImage = (order: number): Omit<GalleryImage, 'id'> => ({ src: '', thumb: '', caption: '', category: 'Events', span: '', order, enabled: true });

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23e5e7eb%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 fill%3D%22%239ca3af%22 font-size%3D%2216%22%3ENo Image%3C%2Ftext%3E%3C%2Fsvg%3E';
const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = PLACEHOLDER; };

const GalleryCMSPanel: React.FC = () => {
  const { cms, updateGallery } = useCMS();
  const [images, setImages] = useState<GalleryImage[]>(cms.gallery);
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyImage(0));
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setImages(cms.gallery); }, [cms.gallery]);

  const set = (k: keyof typeof form) => (v: string | boolean | number) => setForm((p) => ({ ...p, [k]: v }));

  const filtered = filter === 'All' ? images : images.filter((g) => g.category === filter);

  const openAdd = () => { setForm(emptyImage(images.length)); setEditId(null); setModal(true); };
  const openEdit = (g: GalleryImage) => { setForm({ ...g }); setEditId(g.id); setModal(true); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.70);
        setForm((p) => ({ ...p, src: base64, thumb: base64 }));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveModal = () => {
    if (!form.caption.trim()) return;
    const src = form.src || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80';
    const thumb = form.thumb || src;
    if (editId !== null) {
      setImages((p) => p.map((g) => g.id === editId ? { ...form, id: editId, src, thumb } : g));
    } else {
      setImages((p) => [...p, { ...form, id: Date.now().toString(), src, thumb }]);
    }
    setModal(false);
  };

  const remove = (id: string) => setImages((p) => p.filter((g) => g.id !== id));
  const toggle = (id: string) => setImages((p) => p.map((g) => g.id === id ? { ...g, enabled: !g.enabled } : g));

  const moveUp = (id: string) => {
    setImages((p) => {
      const sorted = [...p].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((g) => g.id === id);
      if (idx <= 0) return p;
      const newArr = [...sorted];
      [newArr[idx - 1].order, newArr[idx].order] = [newArr[idx].order, newArr[idx - 1].order];
      return newArr;
    });
  };

  const moveDown = (id: string) => {
    setImages((p) => {
      const sorted = [...p].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((g) => g.id === id);
      if (idx >= sorted.length - 1) return p;
      const newArr = [...sorted];
      [newArr[idx].order, newArr[idx + 1].order] = [newArr[idx + 1].order, newArr[idx].order];
      return newArr;
    });
  };

  const handleSave = () => {
    updateGallery(images);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>Gallery Preview</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{images.length} images · first 6 shown on home page</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            <FiPlus size={14} /> Upload
          </button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: saved ? '#059669' : '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'background 0.3s' }}>
            <FiSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {['All', ...CATS].map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: '0.35rem 0.875rem', borderRadius: '0.5rem', border: '1px solid', borderColor: filter === cat ? '#0B6B4B' : '#E5E7EB', background: filter === cat ? '#0B6B4B' : '#fff', color: filter === cat ? '#fff' : '#6B7280', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {filtered.sort((a, b) => a.order - b.order).map((img, i) => (
          <motion.div key={img.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
            style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #E5E7EB', opacity: img.enabled ? 1 : 0.5 }}>
            <div style={{ position: 'relative', height: 140 }}>
              <img src={img.thumb || img.src || PLACEHOLDER} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={onImgError} />
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.3rem' }}>
                <button onClick={() => moveUp(img.id)} style={{ width: 24, height: 24, borderRadius: '0.35rem', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 700, color: '#6B7280' }}>↑</button>
                <button onClick={() => moveDown(img.id)} style={{ width: 24, height: 24, borderRadius: '0.35rem', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 700, color: '#6B7280' }}>↓</button>
                <button onClick={() => toggle(img.id)} style={{ width: 24, height: 24, borderRadius: '0.35rem', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: img.enabled ? '#0B6B4B' : '#9CA3AF' }}>
                  {img.enabled ? <FiEye size={11} /> : <FiEyeOff size={11} />}
                </button>
                <button onClick={() => openEdit(img)} style={{ width: 24, height: 24, borderRadius: '0.35rem', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B6B4B' }}>
                  <FiEdit2 size={11} />
                </button>
                <button onClick={() => remove(img.id)} style={{ width: 24, height: 24, borderRadius: '0.35rem', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                  <FiTrash2 size={11} />
                </button>
              </div>
              <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
                <span style={{ background: '#0B6B4B', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>#{img.order + 1}</span>
              </div>
            </div>
            <div style={{ padding: '0.6rem 0.75rem', background: '#F9FAFB' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.caption}</p>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#0B6B4B', background: 'rgba(11,107,75,0.1)', padding: '0.1rem 0.4rem', borderRadius: '999px' }}>{img.category}</span>
            </div>
          </motion.div>
        ))}

        <div onClick={openAdd}
          style={{ borderRadius: '0.75rem', border: '2px dashed #E5E7EB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', cursor: 'pointer', color: '#9CA3AF', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#0B6B4B'; (e.currentTarget as HTMLElement).style.color = '#0B6B4B'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; }}>
          <FiImage size={28} style={{ marginBottom: '0.5rem' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Upload Photo</span>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>{editId ? 'Edit Photo' : 'Upload Photo'}</h3>
                <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div>
                  <label style={lbl}>Photo</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <button onClick={() => fileRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.5rem 0.875rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                      <FiImage size={13} /> Choose File
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                    {form.src && <img src={form.src} alt="preview" style={{ width: 48, height: 48, borderRadius: '0.5rem', objectFit: 'cover' }} />}
                  </div>
                  <input value={form.src} onChange={(e) => set('src')(e.target.value)} placeholder="Or paste image URL" style={inp} />
                </div>
                <div><label style={lbl}>Caption *</label><input value={form.caption} onChange={(e) => set('caption')(e.target.value)} placeholder="e.g. Alumni Meet 2025" style={inp} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <label style={lbl}>Category</label>
                    <select value={form.category} onChange={(e) => set('category')(e.target.value)} style={inp}>
                      {CATS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Grid Span</label>
                    <select value={form.span} onChange={(e) => set('span')(e.target.value)} style={inp}>
                      {SPANS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="gl-enabled" checked={form.enabled} onChange={(e) => set('enabled')(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="gl-enabled" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Enabled</label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button onClick={() => setModal(false)} style={{ padding: '0.6rem 1.2rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', background: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#6B7280' }}>Cancel</button>
                  <button onClick={saveModal} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <FiSave size={14} /> {editId ? 'Save' : 'Upload'}
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

export default GalleryCMSPanel;
