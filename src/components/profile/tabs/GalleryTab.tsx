import React, { useState, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { FiImage, FiPlus, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import type { GalleryItem } from '../../../types/profile';
import ProfileModal from '../ProfileModal';

const CATS = ['all', 'professional', 'campus', 'events', 'certificates'] as const;
type Cat = typeof CATS[number];

const BLANK: Omit<GalleryItem, 'id'> = { src: '', caption: '', category: 'professional' };

interface Props { items: GalleryItem[]; onAdd: (g: GalleryItem) => void; onRemove: (id: string) => void; }

const GalleryTab: React.FC<Props> = ({ items, onAdd, onRemove }) => {
  const [filter, setFilter] = useState<Cat>('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<GalleryItem, 'id'>>(BLANK);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const visible = filter === 'all' ? items : items.filter(g => g.category === filter);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) setForm(p => ({ ...p, src: ev.target!.result as string })); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    if (!form.src) return;
    onAdd({ ...form, id: Date.now().toString() });
    setForm(BLANK); setOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text text-sm flex items-center gap-2"><FiImage size={15} className="text-primary" /> Gallery</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{items.length} photos</span>
            <button onClick={() => setOpen(true)} className="btn-primary text-xs py-2 px-3 gap-1"><FiPlus size={13} /> Add</button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-5">
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all capitalize ${filter === c ? 'bg-primary text-white' : 'bg-secondary text-gray-500 hover:bg-primary/10 hover:text-primary'}`}>
              {c}
            </button>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-12">
            <FiImage size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No photos in this category.</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visible.map(g => (
            <div key={g.id} className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer" onClick={() => setLightbox(g)}>
              <img src={g.src} alt={g.caption ?? ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end justify-start p-2">
                <button onClick={e => { e.stopPropagation(); onRemove(g.id); }}
                  className="bg-red-500 text-white rounded-lg p-1.5 hover:bg-red-600 transition-colors">
                  <FiTrash2 size={12} />
                </button>
                {g.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white text-xs font-medium text-center">{g.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"><FiX size={24} /></button>
          <img src={lightbox.src} alt={lightbox.caption ?? ''} className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
          {lightbox.caption && <p className="absolute bottom-6 text-white text-sm font-medium">{lightbox.caption}</p>}
        </div>
      )}

      <ProfileModal open={open} onClose={() => setOpen(false)} title="Add Photo">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Photo</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-all">
              {form.src
                ? <img src={form.src} alt="preview" className="h-24 rounded-xl object-cover" />
                : <><FiUpload size={22} /><span className="text-xs font-semibold">Click to upload photo</span></>}
            </button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Caption</label>
            <input value={form.caption ?? ''} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} placeholder="e.g. Graduation Day 2015"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as GalleryItem['category'] }))}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all">
              {(['professional','campus','events','certificates'] as const).map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"><FiX size={14} /> Cancel</button>
            <button onClick={handleSave} className="btn-primary text-sm py-2.5 px-5 gap-2">Add Photo</button>
          </div>
        </div>
      </ProfileModal>
    </motion.div>
  );
};

export default memo(GalleryTab);
