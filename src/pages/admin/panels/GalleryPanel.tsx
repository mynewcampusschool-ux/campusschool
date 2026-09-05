import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiImage, FiX, FiSave } from 'react-icons/fi';
import { useCMS, type GalleryImage } from '../../../context/CMSContext';

const categories = ['All', 'Events', 'Academics', 'Sports', 'Campus', 'Cultural'];
const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23e5e7eb%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 fill%3D%22%239ca3af%22 font-size%3D%2216%22%3ENo Image%3C%2Ftext%3E%3C%2Fsvg%3E';
const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = PLACEHOLDER; };

const GalleryPanel: React.FC = () => {
  const { cms, updateGallery } = useCMS();
  const [photos, setPhotos] = useState<GalleryImage[]>(cms.gallery);
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ caption: '', category: 'Events', src: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPhotos(cms.gallery); }, [cms.gallery]);

  const filtered = filter === 'All' ? photos : photos.filter(p => p.category === filter);
  const remove = (id: string) => {
    const next = photos.filter(p => p.id !== id);
    setPhotos(next); updateGallery(next);
  };

  const openAdd = () => { setForm({ caption: '', category: 'Events', src: '' }); setEditingId(null); setModal(true); };
  const openEdit = (p: GalleryImage) => { setForm({ caption: p.caption, category: p.category, src: p.src }); setEditingId(p.id); setModal(true); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setForm(p => ({ ...p, src: base64 }));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!form.caption.trim()) return;
    let next: GalleryImage[];
    if (editingId) {
      next = photos.map(p => p.id === editingId ? { ...p, ...form, thumb: form.src || p.thumb } : p);
    } else {
      const src = form.src || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&q=80';
      next = [...photos, { id: Date.now().toString(), src, thumb: src, caption: form.caption, category: form.category, span: '', order: photos.length, enabled: true }];
    }
    setPhotos(next); updateGallery(next); setModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>Gallery Management</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{photos.length} photos total</p>
        </div>
        <button onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.55rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
          <FiPlus size={14} /> Upload Photo
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: '0.35rem 0.875rem', borderRadius: '0.5rem', border: '1px solid', borderColor: filter === cat ? '#0B6B4B' : '#E5E7EB', background: filter === cat ? '#0B6B4B' : '#ffffff', color: filter === cat ? '#ffffff' : '#6B7280', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {filtered.map((photo, i) => (
          <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            style={{ background: '#fff', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
            <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
              <img src={photo.thumb || photo.src || PLACEHOLDER} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={onImgError} />
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.35rem' }}>
                <button onClick={() => openEdit(photo)}
                  style={{ width: 28, height: 28, borderRadius: '0.4rem', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B6B4B' }}>
                  <FiEdit2 size={12} />
                </button>
                <button onClick={() => remove(photo.id)}
                  style={{ width: 28, height: 28, borderRadius: '0.4rem', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                  <FiTrash2 size={12} />
                </button>
              </div>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.caption}</p>
              <span style={{ fontSize: '0.67rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(11,107,75,0.1)', color: '#0B6B4B' }}>{photo.category}</span>
            </div>
          </motion.div>
        ))}

        <div onClick={openAdd}
          style={{ borderRadius: '0.75rem', border: '2px dashed #E5E7EB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', cursor: 'pointer', color: '#9CA3AF', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0B6B4B'; (e.currentTarget as HTMLElement).style.color = '#0B6B4B'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; }}>
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
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>{editingId ? 'Edit Photo' : 'Upload Photo'}</h3>
                <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={lbl}>Photo</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button onClick={() => fileRef.current?.click()}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '0.6rem', padding: '0.55rem 1rem', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                      <FiImage size={14} /> Choose File
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    {form.src && <img src={form.src} alt="preview" style={{ width: 48, height: 48, borderRadius: '0.5rem', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ ...lbl, marginBottom: '0.2rem' }}>Or paste image URL</label>
                    <input value={form.src} onChange={e => setForm(p => ({ ...p, src: e.target.value }))} placeholder="https://..." style={inp} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Caption <span style={{ color: '#EF4444' }}>*</span></label>
                  <input value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} placeholder="e.g. Alumni Meet 2025" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ ...inp }}>
                    {['Events', 'Academics', 'Sports', 'Campus', 'Cultural'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button onClick={() => setModal(false)} style={{ padding: '0.6rem 1.2rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', background: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#6B7280' }}>Cancel</button>
                  <button onClick={save} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <FiSave size={14} /> {editingId ? 'Save Changes' : 'Upload'}
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

export default GalleryPanel;
