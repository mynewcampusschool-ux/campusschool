import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiTrash2, FiSearch } from 'react-icons/fi';
import { useAlumniData } from '../../../hooks/useAlumniData';
import { useAlumniPhotos } from '../../../context/AlumniPhotoContext';
import { resolvePhoto } from '../../../lib/alumniPhotos';

// Compress image to max 300px wide, JPEG 0.65 quality → ~15-25 KB per photo
function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 300;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.65));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const AlumniPhotosPanel: React.FC = () => {
  const { photoMap, setPhoto, removePhoto } = useAlumniPhotos();
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { data: ALUMNI_DATA, loading } = useAlumniData({ limit: 100 });

  const filtered = ALUMNI_DATA.filter((a) =>
    [a.fullName, a.batch, a.organization, a.profession]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );

  const handleFile = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setPhoto(id, compressed);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
    e.target.value = '';
  };

  const handleUrl = (id: string, url: string) => {
    if (!url.trim()) return;
    setPhoto(id, url.trim());
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>Alumni Profile Photos</h2>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.25rem 0 0' }}>
          Upload or replace profile photos. Changes reflect instantly on Directory, Home, and all cards.
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search alumni by name, batch, organization..."
          style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' }}
        />
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {filtered.map((alumni, i) => {
          const photo = resolvePhoto(alumni.id, alumni.fullName, alumni.photoUrl, photoMap);
          const hasOverride = !!photoMap[alumni.id];
          const isSaved = saved === alumni.id;

          return (
            <motion.div
              key={alumni.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              style={{ border: `1px solid ${hasOverride ? 'rgba(11,107,75,0.3)' : '#E5E7EB'}`, borderRadius: '0.875rem', overflow: 'hidden', background: '#FAFAFA' }}
            >
              {/* Photo preview */}
              <div style={{ position: 'relative', height: 120, background: 'linear-gradient(135deg,#0B6B4B,#094d36)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {photo ? (
                  <img src={photo} alt={alumni.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.35)' }}>
                    {alumni.fullName.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('')}
                  </span>
                )}
                {hasOverride && (
                  <div style={{ position: 'absolute', top: 6, right: 6, background: '#0B6B4B', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '0.3rem', letterSpacing: '0.04em' }}>
                    CUSTOM
                  </div>
                )}
                {isSaved && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,107,75,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>✓ Saved!</span>
                  </div>
                )}
              </div>

              {/* Info + controls */}
              <div style={{ padding: '0.75rem' }}>
                <p style={{ fontWeight: 800, fontSize: '0.85rem', color: '#111827', margin: '0 0 0.1rem' }}>{alumni.fullName}</p>
                <p style={{ fontSize: '0.7rem', color: '#6B7280', margin: '0 0 0.75rem' }}>Batch {alumni.batch} · {alumni.organization || alumni.profession}</p>

                {/* Upload button */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => fileRefs.current[alumni.id]?.click()}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.45rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}
                  >
                    <FiUpload size={12} /> Upload Photo
                  </button>
                  <input
                    ref={(el) => { fileRefs.current[alumni.id] = el; }}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFile(alumni.id, e)}
                  />
                  {hasOverride && (
                    <button
                      onClick={() => removePhoto(alumni.id)}
                      title="Remove custom photo"
                      style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', cursor: 'pointer', color: '#EF4444', flexShrink: 0 }}
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>

                {/* URL input */}
                <input
                  placeholder="Or paste image URL and press Enter"
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.4rem 0.65rem', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontSize: '0.72rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box', color: '#374151' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUrl(alumni.id, (e.currentTarget as HTMLInputElement).value);
                      (e.currentTarget as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>Loading alumni...</div>}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
          No alumni found matching "{search}"
        </div>
      )}
    </div>
  );
};

export default AlumniPhotosPanel;
