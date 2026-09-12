import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiLinkedin, FiFacebook, FiUser, FiDownload } from 'react-icons/fi';
import { useAlumniData } from '../../../hooks/useAlumniData';
import { resolvePhoto } from '../../../lib/alumniPhotos';
import { useAlumniPhotos } from '../../../context/AlumniPhotoContext';
import { api } from '../../../lib/api';
import * as XLSX from 'xlsx';
import { ALUMNI_DATA } from '../../../lib/alumniData';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const PAGE_SIZE = 20;

const AlumniDirectoryPanel: React.FC = () => {
  const [search, setSearch]   = useState('');
  const [batch,  setBatch]    = useState('');
  const [country, setCountry] = useState('');
  const [page,   setPage]     = useState(1);

  const [batches,   setBatches]   = React.useState<string[]>([]);
  const [countries, setCountries] = React.useState<string[]>([]);

  React.useEffect(() => {
    api.alumni.batches().then((b)   => { if (b) setBatches(b); });
    api.alumni.countries().then((c) => { if (c) setCountries(c); });
  }, []);

  const { data, total, totalPages, loading } = useAlumniData({
    search:  search  || undefined,
    batch:   batch   || undefined,
    country: country || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const { photoMap } = useAlumniPhotos();

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); };

  const handleExport = async () => {
    // Fetch all Firestore users
    const snap = await getDocs(collection(db, 'users'));
    const firestoreUsers = snap.docs
      .filter(d => d.data().full_name)
      .map(d => {
        const u = d.data();
        return {
          'Full Name':     u.full_name ?? '',
          'Nickname':      u.nickname ?? '',
          'Batch':         u.batch_year ?? '',
          'Designation':   u.designation ?? '',
          'Organization':  u.organization ?? '',
          'Profession':    u.profession ?? '',
          'Qualification': u.qualification ?? '',
          'City':          u.city ?? '',
          'Country':       u.country ?? 'India',
          'LinkedIn':      u.linkedin_url ?? '',
          'Facebook':      u.facebook_url ?? '',
          'Registered At': u.created_at?.toDate?.()?.toLocaleDateString?.() ?? '',
          'Source':        'Registered',
        };
      });

    const firestoreNames = new Set(snap.docs.map(d => d.id));

    // Merge with static ALUMNI_DATA (avoid duplicates by id)
    const staticRows = ALUMNI_DATA
      .filter(a => !firestoreNames.has(a.id))
      .map(a => ({
        'Full Name':     a.fullName,
        'Nickname':      a.nickname ?? '',
        'Batch':         a.batch,
        'Designation':   a.designation,
        'Organization':  a.organization,
        'Profession':    a.profession,
        'Qualification': a.qualification,
        'City':          a.city,
        'Country':       a.country,
        'LinkedIn':      a.linkedinUrl ?? '',
        'Facebook':      a.facebookUrl ?? '',
        'Registered At': a.registeredAt,
        'Source':        'Excel Import',
      }));

    const allRows = [...firestoreUsers, ...staticRows];
    const ws = XLSX.utils.json_to_sheet(allRows);
    // Column widths
    ws['!cols'] = [22,14,8,24,28,20,22,14,14,36,36,14,14].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alumni');
    XLSX.writeFile(wb, `alumni_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>Alumni Directory</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.25rem 0 0' }}>{total} registered alumni</p>
        </div>
        <button
          onClick={handleExport}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
        >
          <FiDownload size={15} /> Download Excel
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <FiSearch size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, organization, city..."
            style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={batch} onChange={(e) => { setBatch(e.target.value); setPage(1); }}
          style={{ padding: '0.55rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.8rem', outline: 'none', background: '#fff' }}>
          <option value="">All Batches</option>
          {batches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={country} onChange={(e) => { setCountry(e.target.value); setPage(1); }}
          style={{ padding: '0.55rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.8rem', outline: 'none', background: '#fff' }}>
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" style={{ background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.55rem 1rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
          Search
        </button>
      </form>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
              {['Photo', 'Name', 'Batch', 'Designation / Organization', 'Profession', 'City', 'Country', 'Links'].map((h) => (
                <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700, color: '#6B7280', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#9CA3AF' }}>
                <div style={{ display: 'inline-block', width: 24, height: 24, border: '3px solid rgba(11,107,75,0.2)', borderTopColor: '#0B6B4B', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </td></tr>
            )}
            {!loading && data.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#9CA3AF', fontSize: '0.85rem' }}>No alumni found.</td></tr>
            )}
            {!loading && data.map((a, i) => {
              const photo = resolvePhoto(a.id, a.fullName, a.photoUrl, photoMap);
              return (
                <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  style={{ borderBottom: '1px solid #F9FAFB' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,#0B6B4B,#094d36)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {photo
                        ? <img src={photo} alt={a.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        : <FiUser size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />}
                    </div>
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
                    {a.fullName}
                    {a.nickname && a.nickname !== a.fullName && a.nickname !== '—' && a.nickname !== '-' && (
                      <div style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 400 }}>"{a.nickname}"</div>
                    )}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#6B7280', whiteSpace: 'nowrap' }}>{a.batch || '—'}</td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#374151', maxWidth: 200 }}>
                    {a.designation && <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{a.designation}</div>}
                    {a.organization && <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{a.organization}</div>}
                    {!a.designation && !a.organization && <span style={{ color: '#D1D5DB' }}>—</span>}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#6B7280', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.profession || '—'}</td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#6B7280', whiteSpace: 'nowrap' }}>{a.city || '—'}</td>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#6B7280', whiteSpace: 'nowrap' }}>{a.country || '—'}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {a.linkedinUrl && (
                        <a href={a.linkedinUrl} target="_blank" rel="noopener noreferrer"
                          style={{ width: 26, height: 26, borderRadius: '0.35rem', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', textDecoration: 'none' }}>
                          <FiLinkedin size={13} />
                        </a>
                      )}
                      {a.facebookUrl && (
                        <a href={a.facebookUrl} target="_blank" rel="noopener noreferrer"
                          style={{ width: 26, height: 26, borderRadius: '0.35rem', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8', textDecoration: 'none' }}>
                          <FiFacebook size={13} />
                        </a>
                      )}
                      {!a.linkedinUrl && !a.facebookUrl && <span style={{ color: '#D1D5DB', fontSize: '0.72rem' }}>—</span>}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.8rem', color: '#6B7280' }}>
          <span>Page {page} of {totalPages} · {total} total alumni</span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                style={{ border: '1px solid #E5E7EB', background: p === page ? '#0B6B4B' : '#fff', color: p === page ? '#fff' : '#6B7280', borderRadius: '0.5rem', padding: '0.35rem 0.65rem', cursor: 'pointer', fontWeight: p === page ? 700 : 400, fontSize: '0.78rem' }}>
                {p}
              </button>
            ))}
            {totalPages > 7 && page < totalPages && (
              <button onClick={() => setPage(totalPages)}
                style={{ border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280', borderRadius: '0.5rem', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '0.78rem' }}>
                {totalPages}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectoryPanel;
