import React, { useRef, useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCamera, FiMapPin, FiMail, FiPhone, FiGlobe, FiCalendar, FiEye,
  FiUserPlus, FiMessageCircle, FiShare2, FiDownload, FiEdit2,
  FiBriefcase, FiX, FiStar,
} from 'react-icons/fi';
import {
  MdOutlineQrCode2, MdOutlineSchool, MdOutlineBusiness, MdVerified,
} from 'react-icons/md';
import type { ProfileData, ProfileTab, UserRole } from '../../types/profile';
import RoleBadge from './RoleBadge';
import CompletionRing from './CompletionRing';

/* ── Role-based tab visibility ─────────────────────────────────────── */
const ROLE_TABS: Record<UserRole, ProfileTab[]> = {
  alumni:         ['overview','experience','education','skills','achievements','projects','gallery','network','events','mentorship','jobs','settings'],
  student:        ['overview','education','skills','achievements','projects','gallery','network','events','mentorship','jobs','settings'],
  teacher:        ['overview','experience','education','skills','achievements','projects','gallery','network','events','mentorship','settings'],
  principal:      ['overview','experience','education','skills','achievements','gallery','network','events','settings'],
  staff:          ['overview','experience','education','skills','gallery','network','events','settings'],
  mentor:         ['overview','experience','education','skills','achievements','projects','gallery','network','events','mentorship','settings'],
  recruiter:      ['overview','experience','skills','network','jobs','settings'],
  hr:             ['overview','experience','skills','network','jobs','settings'],
  business_owner: ['overview','experience','skills','network','jobs','settings'],
  admin:          ['overview','network','events','settings'],
  super_admin:    ['overview','network','events','settings'],
  guest:          ['overview'],
};

const ALL_TABS: { id: ProfileTab; label: string }[] = [
  { id: 'overview',     label: 'Overview'     },
  { id: 'experience',   label: 'Experience'   },
  { id: 'education',    label: 'Education'    },
  { id: 'skills',       label: 'Skills'       },
  { id: 'achievements', label: 'Achievements' },
  { id: 'projects',     label: 'Projects'     },
  { id: 'gallery',      label: 'Gallery'      },
  { id: 'network',      label: 'Network'      },
  { id: 'events',       label: 'Events'       },
  { id: 'mentorship',   label: 'Mentorship'   },
  { id: 'jobs',         label: 'Jobs'         },
  { id: 'settings',     label: 'Settings'     },
];

/* ── Minimal QR SVG generator (no external lib) ────────────────────── */
function buildQrSvg(text: string, size = 160): string {
  const cells = 21;
  const cell = size / cells;
  const bits: boolean[][] = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      const inFinder =
        (r < 7 && c < 7) ||
        (r < 7 && c >= cells - 7) ||
        (r >= cells - 7 && c < 7);
      if (inFinder) {
        const lr = r < 7 ? r : r - (cells - 7);
        const lc = c < 7 ? c : c >= cells - 7 ? c - (cells - 7) : c;
        return (lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4));
      }
      let h = 0;
      for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
      return ((h ^ (r * 17 + c * 13)) & 1) === 1;
    })
  );
  const rects = bits.flatMap((row, r) =>
    row.map((on, c) =>
      on ? `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}" fill="#0B6B4B"/>` : ''
    )
  ).join('');
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="white"/>${rects}</svg>`;
}

const StatPill: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <div className="flex flex-col items-center px-3 py-2 rounded-xl hover:bg-secondary transition-colors cursor-default">
    <span className="font-black text-text text-base leading-none">{value}</span>
    <span className="text-gray-400 text-xs mt-0.5 whitespace-nowrap">{label}</span>
  </div>
);

interface Props {
  profile: ProfileData;
  completion: number;
  activeTab: ProfileTab;
  onTabChange: (t: ProfileTab) => void;
  onEditClick: () => void;
  onCoverChange: (url: string) => void;
  onPhotoChange: (url: string) => void;
}

const ProfileHeader: React.FC<Props> = ({
  profile, completion, activeTab, onTabChange, onEditClick, onCoverChange, onPhotoChange,
}) => {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [qrOpen, setQrOpen] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, cb: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) cb(ev.target.result as string); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const initials = (profile.name || 'A').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const profileUrl = `${window.location.origin}/profile?uid=${profile.uid}`;
  const qrSrc = useMemo(() => buildQrSvg(profileUrl), [profileUrl]);

  const visibleTabs = useMemo(() => {
    const allowed = ROLE_TABS[profile.role] ?? ROLE_TABS.guest;
    return ALL_TABS.filter(t => allowed.includes(t.id));
  }, [profile.role]);

  const idLabel = (): string | null => {
    if (profile.role === 'alumni')  return profile.alumniId  ? `Alumni ID: ${profile.alumniId}`  : null;
    if (profile.role === 'student') return profile.studentId ? `Student ID: ${profile.studentId}` : null;
    if (profile.role === 'teacher') return profile.teacherId ? `Teacher ID: ${profile.teacherId}` : null;
    if (['staff','principal','admin','super_admin'].includes(profile.role))
      return profile.employeeId ? `Emp ID: ${profile.employeeId}` : null;
    return null;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${profile.name} — Alumni Profile`, url: profileUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(profileUrl).then(() => alert('Profile link copied!')).catch(() => {});
    }
  };

  const id = idLabel();

  return (
    <div className="bg-white rounded-2xl shadow-premium border border-border/50 overflow-hidden mb-6">
      {/* Cover */}
      <div
        className="h-44 sm:h-44 md:h-52 relative rounded-t-2xl overflow-hidden"
        style={
          profile.coverURL
            ? { backgroundImage: `url(${profile.coverURL})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: profile.coverColor ?? 'linear-gradient(135deg,#0B6B4B 0%,#094d36 50%,#D4AF37 100%)' }
        }
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl">
          <FiStar size={11} className="text-accent" />
          <span className="hidden sm:inline">{completion}% Complete</span>
          <span className="sm:hidden">{completion}%</span>
        </div>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, onCoverChange)} />
      </div>

      <div className="px-4 md:px-6 pb-0">
        {/* Avatar row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
          <div className="relative flex-shrink-0 self-start -mt-8 sm:-mt-12">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ margin: -6 }}>
              <CompletionRing pct={completion} size={108} stroke={3} />
            </div>
            <div className="w-24 h-24 rounded-full border-2 border-white shadow-premium bg-primary flex items-center justify-center overflow-hidden">
              {profile.photoURL
                ? <img src={profile.photoURL} alt={profile.name} className="w-full h-full object-cover" loading="lazy" />
                : <span className="text-white font-black text-2xl">{initials}</span>
              }
            </div>
            <button
              onClick={() => photoInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white shadow-premium hover:bg-primary-dark transition-colors"
            >
              <FiCamera size={12} />
            </button>
            <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, onPhotoChange)} />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
          </div>

          {/* Name / meta */}
          <div className="flex-1 min-w-0 sm:pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-text leading-tight">{profile.name}</h1>
              {profile.verified && <MdVerified size={20} className="text-primary flex-shrink-0" />}
              <RoleBadge role={profile.role} />
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
              {profile.designation && (
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <FiBriefcase size={13} /> {profile.designation}
                </span>
              )}
              {profile.company && (
                <span className="flex items-center gap-1">
                  <MdOutlineBusiness size={14} /> {profile.company}
                </span>
              )}
              {profile.batch && <span className="text-gray-500 text-xs">Batch {profile.batch}</span>}
              {profile.school && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MdOutlineSchool size={13} /> {profile.school}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-400">
              {(profile.city || profile.state || profile.country) && (
                <span className="flex items-center gap-1">
                  <FiMapPin size={11} /> {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}
                </span>
              )}
              {profile.email && <span className="flex items-center gap-1"><FiMail size={11} /> {profile.email}</span>}
              {profile.phone && <span className="flex items-center gap-1"><FiPhone size={11} /> {profile.phone}</span>}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <FiGlobe size={11} /> Website
                </a>
              )}
              {profile.joinedDate && (
                <span className="flex items-center gap-1"><FiCalendar size={11} /> Member since {profile.joinedDate}</span>
              )}
              {profile.lastActive && <span className="text-gray-300">· Last active {profile.lastActive}</span>}
              {id && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium">{id}</span>}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 sm:pb-2 sm:flex-shrink-0 w-full sm:w-auto justify-start sm:justify-end">
            <button
              onClick={() => setQrOpen(true)}
              className="flex items-center gap-1.5 border border-border text-gray-600 hover:border-primary hover:text-primary text-xs font-semibold py-2 px-3 rounded-xl transition-all"
            >
              <MdOutlineQrCode2 size={13} /> QR
            </button>
            <button
              onClick={() => coverInputRef.current?.click()}
              className="flex items-center gap-1.5 border border-border text-gray-600 hover:border-primary hover:text-primary text-xs font-semibold py-2 px-3 rounded-xl transition-all"
            >
              <FiCamera size={13} /> Cover
            </button>
            <button onClick={onEditClick} className="btn-primary text-xs py-2 px-3 gap-1.5">
              <FiEdit2 size={13} /> Edit
            </button>
            <button className="flex items-center gap-1.5 border border-border text-gray-600 hover:border-primary hover:text-primary text-xs font-semibold py-2 px-3 rounded-xl transition-all">
              <FiUserPlus size={13} /> Connect
            </button>
            <button className="flex items-center gap-1.5 border border-border text-gray-600 hover:border-primary hover:text-primary text-xs font-semibold py-2 px-3 rounded-xl transition-all">
              <FiMessageCircle size={13} /> Message
            </button>
            <button onClick={handleShare} className="flex items-center gap-1.5 border border-border text-gray-600 hover:border-primary hover:text-primary text-xs font-semibold py-2 px-3 rounded-xl transition-all">
              <FiShare2 size={13} /> Share
            </button>
            <button className="flex items-center gap-1.5 border border-border text-gray-600 hover:border-primary hover:text-primary text-xs font-semibold py-2 px-3 rounded-xl transition-all">
              <FiDownload size={13} /> PDF
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-1 border-t border-border/60 pt-2 pb-2 sm:pt-3 sm:pb-3 -mx-1">
          <StatPill label="Followers"    value={profile.followers ?? 0} />
          <StatPill label="Following"    value={profile.following ?? 0} />
          <StatPill label="Connections"  value={profile.connections ?? 0} />
          <StatPill label="Posts"        value={profile.posts ?? 0} />
          <StatPill label="Events"       value={profile.eventsJoined ?? 0} />
          <StatPill label="Certificates" value={profile.certificates ?? 0} />
          <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400">
            <FiEye size={13} /> {profile.profileViews ?? 0} views
          </div>
          {profile.availability && (
            <div className="flex items-center gap-1.5 px-3 py-2 ml-auto">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs font-semibold text-green-600">{profile.availability}</span>
            </div>
          )}
        </div>

        {/* Role-filtered Tabs */}
        <div className="flex gap-0.5 overflow-x-auto border-t border-border/60 -mx-4 md:-mx-6 px-4 md:px-6 scrollbar-hide">
          {visibleTabs.map(t => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`px-3 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={() => setQrOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-glass p-5 flex flex-col items-center gap-4 w-[90vw] max-w-xs"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold text-text text-sm">Share Profile</h3>
                <button onClick={() => setQrOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <FiX size={16} />
                </button>
              </div>
              <div className="p-3 border-2 border-border rounded-2xl">
                <img src={qrSrc} alt="Profile QR Code" width={160} height={160} />
              </div>
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Scan to view <span className="font-semibold text-text">{profile.name}</span>'s profile
              </p>
              <div className="flex gap-2 w-full">
                <button onClick={handleShare} className="flex-1 btn-primary text-xs py-2.5 gap-1.5 justify-center">
                  <FiShare2 size={12} /> Share Link
                </button>
                <a
                  href={qrSrc}
                  download={`${profile.name}-qr.svg`}
                  className="flex items-center gap-1.5 border border-border text-gray-600 hover:border-primary hover:text-primary text-xs font-semibold py-2.5 px-3 rounded-xl transition-all"
                >
                  <FiDownload size={12} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ProfileHeader);
