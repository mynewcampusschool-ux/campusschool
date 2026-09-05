import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiAward, FiExternalLink, FiX, FiCalendar, FiGlobe } from 'react-icons/fi';
import { FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import type { AlumniRecord } from '../../types/alumni';
import { useAlumniPhotos } from '../../context/AlumniPhotoContext';
import { resolvePhoto, localCandidates } from '../../lib/alumniPhotos';

/* ── Default avatar ── */
const DefaultAvatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0B6B4B,#094d36)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
      <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Poppins',sans-serif", letterSpacing: '0.05em', userSelect: 'none' }}>{initials}</span>
    </div>
  );
};

interface Props { alumni: AlumniRecord; index: number; }

/* ─────────────────────────────────────────────────────────
   Profile Modal — rendered via portal at document.body
───────────────────────────────────────────────────────── */
const ProfileModal: React.FC<{ alumni: AlumniRecord; open: boolean; onClose: () => void }> = ({ alumni, open, onClose }) => {
  const { photoMap } = useAlumniPhotos();
  const photo = resolvePhoto(alumni.id, alumni.fullName, alumni.photoUrl, photoMap);

  const clean = (v?: string) =>
    !v || ['—', '-', 'NA', 'None', 'none', 'no nickname', 'No nickname'].includes(v.trim()) ? '' : v.trim();
  const nickname = clean(alumni.nickname);
  const location = [alumni.city, alumni.country?.toLowerCase() !== 'india' ? alumni.country : ''].filter(Boolean).join(', ');

  const infoRows = [
    alumni.designation  && { icon: <FiBriefcase size={15} />, color: '#0B6B4B', bg: 'rgba(11,107,75,0.08)',    label: 'Designation',  value: alumni.designation },
    alumni.organization && { icon: <FiGlobe size={15} />,     color: '#6366F1', bg: 'rgba(99,102,241,0.08)',   label: 'Organization', value: alumni.organization },
    alumni.profession   && { icon: <FiAward size={15} />,     color: '#D4AF37', bg: 'rgba(212,175,55,0.10)',   label: 'Profession',   value: alumni.profession },
    alumni.qualification && { icon: <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>🎓</span>, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', label: 'Education', value: alumni.qualification },
    location            && { icon: <FiMapPin size={15} />,    color: '#EF4444', bg: 'rgba(239,68,68,0.08)',    label: 'Location',     value: location },
    alumni.registeredAt && { icon: <FiCalendar size={15} />,  color: '#6B7280', bg: 'rgba(107,114,128,0.08)', label: 'Member Since', value: new Date(alumni.registeredAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
  ].filter(Boolean) as { icon: React.ReactNode; color: string; bg: string; label: string; value: string }[];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 32 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '1.5rem', width: '100%', maxWidth: 460, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.28)', fontFamily: "'Poppins',sans-serif", position: 'relative' }}
          >
            {/* Hero cover */}
            <div style={{ height: 110, background: 'linear-gradient(135deg,#0B6B4B 0%,#094d36 50%,#D4AF37 100%)', borderRadius: '1.5rem 1.5rem 0 0', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ position: 'absolute', bottom: -30, left: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ position: 'absolute', top: 14, left: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <img src="/logo.jpg" alt="logo" style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'contain' }} />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Campus School Pantnagar</span>
              </div>
              <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <FiX size={15} />
              </button>
            </div>

            {/* Avatar overlapping cover */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -52, position: 'relative', zIndex: 1 }}>
              <div style={{ width: 104, height: 104, borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 8px 24px rgba(11,107,75,0.22)', background: '#f3f4f6', flexShrink: 0 }}>
                {photo ? <img src={photo} alt={alumni.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <DefaultAvatar name={alumni.fullName} />}
              </div>
              <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#111827', margin: '0.75rem 0 0', textAlign: 'center', padding: '0 1.5rem', lineHeight: 1.3 }}>{alumni.fullName}</h2>
              {nickname && <p style={{ fontSize: '0.78rem', color: '#9CA3AF', fontStyle: 'italic', margin: '0.2rem 0 0' }}>"{nickname}"</p>}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem', flexWrap: 'wrap', justifyContent: 'center', padding: '0 1rem' }}>
                {alumni.batch && (
                  <span style={{ background: 'rgba(11,107,75,0.09)', color: '#0B6B4B', fontSize: '0.68rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(11,107,75,0.18)', letterSpacing: '0.04em' }}>
                    🎓 Batch {alumni.batch}
                  </span>
                )}
                {alumni.country && (
                  <span style={{ background: 'rgba(99,102,241,0.08)', color: '#6366F1', fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.18)' }}>
                    🌍 {alumni.country}
                  </span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#E5E7EB,transparent)', margin: '1rem 1.5rem 0' }} />

            {/* Info rows */}
            <div style={{ padding: '1rem 1.25rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {infoRows.map((row) => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: '0.75rem', padding: '0.65rem 0.875rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '0.6rem', background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: row.color }}>{row.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.15rem' }}>{row.label}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social buttons */}
            {(alumni.linkedinUrl || alumni.facebookUrl) ? (
              <div style={{ padding: '0.75rem 1.25rem 1.25rem', display: 'flex', gap: '0.6rem' }}>
                {alumni.linkedinUrl && (
                  <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#0A66C2', color: '#fff', borderRadius: '0.75rem', padding: '0.6rem 1rem', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                  ><FaLinkedinIn size={14} /> LinkedIn</a>
                )}
                {alumni.facebookUrl && (
                  <a href={alumni.facebookUrl} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#1877F2', color: '#fff', borderRadius: '0.75rem', padding: '0.6rem 1rem', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                  ><FaFacebookF size={14} /> Facebook</a>
                )}
              </div>
            ) : <div style={{ height: '1.25rem' }} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

/* ─────────────────────────────────────────────────────────
   Alumni Card
───────────────────────────────────────────────────────── */
const AlumniCard: React.FC<Props> = ({ alumni, index }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { photoMap } = useAlumniPhotos();

  const buildCandidates = (): string[] => {
    if (photoMap[alumni.id]) return [photoMap[alumni.id]];
    const locals = localCandidates(alumni.id, alumni.fullName);
    const excel = alumni.photoUrl && !alumni.photoUrl.includes('drive.google.com') && !alumni.photoUrl.includes('linkedin.com') ? alumni.photoUrl : null;
    return excel ? [...locals, excel] : locals;
  };

  const [candidates] = useState<string[]>(buildCandidates);
  const [photoIdx, setPhotoIdx] = useState(0);

  const prevOverrideRef = React.useRef(photoMap[alumni.id]);
  if (prevOverrideRef.current !== photoMap[alumni.id]) {
    prevOverrideRef.current = photoMap[alumni.id];
    setPhotoIdx(0);
  }

  const resolvedPhoto = resolvePhoto(alumni.id, alumni.fullName, alumni.photoUrl, photoMap);
  const currentSrc = photoMap[alumni.id] ? photoMap[alumni.id] : candidates[photoIdx] ?? '';

  const handleImgError = () => {
    if (photoIdx < candidates.length - 1) {
      setPhotoIdx((p) => p + 1);
    } else {
      setPhotoIdx(candidates.length);
      if (resolvedPhoto) console.warn(`[AlumniCard] No image loaded for "${alumni.fullName}" (id: ${alumni.id}). Drop a file at public/images/alumni/${alumni.id}.jpg to fix this.`);
    }
  };

  const showImage = currentSrc && photoIdx < candidates.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
        style={{ background: '#fff', borderRadius: '1.125rem', border: '1px solid rgba(229,231,235,0.6)', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', cursor: 'default' }}
        whileHover={{ y: -5, boxShadow: '0 8px 32px rgba(11,107,75,0.14)' }}
      >
        {/* Top colour band */}
        <div style={{ height: 6, background: 'linear-gradient(90deg,#0B6B4B,#D4AF37)', flexShrink: 0 }} />

        {/* Photo + batch badge */}
        <div style={{ padding: '0.75rem 0.75rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(11,107,75,0.08)', color: '#0B6B4B', fontSize: '0.58rem', fontWeight: 800, padding: '0.18rem 0.45rem', borderRadius: '0.375rem', letterSpacing: '0.05em', border: '1px solid rgba(11,107,75,0.15)' }}>
            {alumni.batch}
          </div>
          <div className="alumni-avatar" style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(11,107,75,0.12)', boxShadow: '0 4px 16px rgba(11,107,75,0.15)', flexShrink: 0, background: '#f3f4f6' }}>
            {showImage
              ? <img key={currentSrc} src={currentSrc} alt={alumni.fullName} onError={handleImgError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <DefaultAvatar name={alumni.fullName} />}
          </div>
          <h3 style={{ marginTop: '0.5rem', fontWeight: 800, fontSize: '0.82rem', color: '#111827', textAlign: 'center', lineHeight: 1.3, wordBreak: 'break-word' }}>{alumni.fullName}</h3>
          {alumni.nickname && <p style={{ fontSize: '0.62rem', color: '#9CA3AF', fontStyle: 'italic', marginTop: '0.1rem', textAlign: 'center' }}>"{alumni.nickname}"</p>}
        </div>

        {/* Details */}
        <div style={{ padding: '0.5rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ background: 'rgba(11,107,75,0.05)', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', border: '1px solid rgba(11,107,75,0.08)' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0B6B4B', lineHeight: 1.3, marginBottom: '0.1rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{alumni.designation}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiBriefcase size={9} style={{ color: '#6B7280', flexShrink: 0 }} />
              <p style={{ fontSize: '0.62rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alumni.organization}</p>
            </div>
          </div>
          {alumni.profession && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiAward size={10} style={{ color: '#D4AF37', flexShrink: 0 }} />
            <span style={{ fontSize: '0.62rem', color: '#374151', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alumni.profession}</span>
          </div>}
          {alumni.qualification && <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
            <span style={{ fontSize: '0.62rem', flexShrink: 0 }}>🎓</span>
            <span style={{ fontSize: '0.6rem', color: '#6B7280', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{alumni.qualification}</span>
          </div>}
          {alumni.city && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiMapPin size={10} style={{ color: '#EF4444', flexShrink: 0 }} />
            <span style={{ fontSize: '0.62rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alumni.city}{alumni.country && alumni.country !== 'India' ? `, ${alumni.country}` : ''}</span>
          </div>}
        </div>

        {/* Footer */}
        <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid rgba(229,231,235,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {alumni.linkedinUrl && (
              <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn"
                style={{ width: 30, height: 30, borderRadius: '0.5rem', background: 'rgba(10,102,194,0.08)', border: '1px solid rgba(10,102,194,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A66C2', textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0A66C2'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,102,194,0.08)'; (e.currentTarget as HTMLElement).style.color = '#0A66C2'; }}
              ><FaLinkedinIn size={13} /></a>
            )}
            {alumni.facebookUrl && (
              <a href={alumni.facebookUrl} target="_blank" rel="noopener noreferrer" title="Facebook"
                style={{ width: 30, height: 30, borderRadius: '0.5rem', background: 'rgba(24,119,242,0.08)', border: '1px solid rgba(24,119,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1877F2', textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1877F2'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(24,119,242,0.08)'; (e.currentTarget as HTMLElement).style.color = '#1877F2'; }}
              ><FaFacebookF size={13} /></a>
            )}
            {!alumni.linkedinUrl && !alumni.facebookUrl && <span style={{ fontSize: '0.65rem', color: '#D1D5DB', fontStyle: 'italic' }}>—</span>}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.35rem 0.75rem', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '0.02em', fontFamily: "'Poppins',sans-serif" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#094d36')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#0B6B4B')}
          >
            View Profile <FiExternalLink size={11} />
          </button>
        </div>
      </motion.div>

      {/* Modal rendered at document.body via portal — outside overflow:hidden card */}
      <ProfileModal alumni={alumni} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default AlumniCard;
