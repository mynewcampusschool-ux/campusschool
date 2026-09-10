import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiUsers, FiUserCheck, FiClock, FiEye, FiTrendingUp } from 'react-icons/fi';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ALUMNI_DATA } from '../../../lib/alumniData';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface UserRow {
  id: string;
  status: string;
  role: string;
  created_at: any;
  batch_year: string | null;
  country: string | null;
}

const AnalyticsPanel: React.FC = () => {
  const [users,        setUsers]        = useState<UserRow[]>([]);
  const [totalViews,   setTotalViews]   = useState(0);
  const [topPages,     setTopPages]     = useState<{ path: string; count: number }[]>([]);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserRow)));
    });

    const unsubTotal = onSnapshot(doc(db, 'pageViews', 'total'), (snap) => {
      setTotalViews(snap.data()?.count ?? 0);
    });

    const unsubPages = onSnapshot(collection(db, 'pageViews'), (snap) => {
      const pages = snap.docs
        .filter((d) => d.id !== 'total')
        .map((d) => ({ path: d.data().path ?? '/' + d.id, count: d.data().count ?? 0 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
      setTopPages(pages);
    });

    return () => { unsubUsers(); unsubTotal(); unsubPages(); };
  }, []);

  const currentYear  = new Date().getFullYear();
  const monthCounts  = Array(12).fill(0);
  users.forEach((u) => {
    const date = u.created_at?.toDate?.();
    if (date && date.getFullYear() === currentYear) monthCounts[date.getMonth()]++;
  });
  const maxCount = Math.max(...monthCounts, 1);

  const activeUsers  = users.filter((u) => u.status === 'active').length;
  const pendingUsers = users.filter((u) => u.status === 'pending').length;
  const totalAlumni  = ALUMNI_DATA.length + users.length;

  const batchMap: Record<string, number> = {};
  users.forEach((u) => { if (u.batch_year) batchMap[u.batch_year] = (batchMap[u.batch_year] ?? 0) + 1; });
  const topBatches = Object.entries(batchMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const countryMap: Record<string, number> = {};
  users.forEach((u) => { const c = u.country ?? 'India'; countryMap[c] = (countryMap[c] ?? 0) + 1; });
  const topCountries = Object.entries(countryMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const summaryCards = [
    { label: 'Total Page Views',  value: totalViews.toLocaleString(), icon: FiEye,       color: '#8B5CF6' },
    { label: 'Total Alumni',      value: totalAlumni,                  icon: FiUsers,     color: '#0B6B4B' },
    { label: 'Registered Users',  value: users.length,                 icon: FiUserCheck, color: '#3B82F6' },
    { label: 'Active Users',      value: activeUsers,                  icon: FiTrendingUp,color: '#10B981' },
    { label: 'Pending Approval',  value: pendingUsers,                 icon: FiClock,     color: '#D97706' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem' }}>
        {summaryCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} style={{ color: s.color }} />
                </div>
                <FiArrowUp size={13} style={{ color: '#22C55E' }} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827' }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: '0.65rem', color: '#22C55E', marginTop: '0.2rem' }}>Live · Firebase</div>
            </motion.div>
          );
        })}
      </div>

      {/* Registrations Chart */}
      <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
        <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1.25rem' }}>
          Alumni Registrations ({currentYear})
          <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 500, marginLeft: '0.5rem' }}>Real data from Firebase</span>
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '140px' }}>
          {monthCounts.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '0.6rem', color: '#6B7280', fontWeight: 700 }}>{v > 0 ? v : ''}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((v / maxCount) * 110, v > 0 ? 8 : 2)}px` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                style={{ width: '100%', background: i === new Date().getMonth() ? '#0B6B4B' : v > 0 ? 'rgba(11,107,75,0.35)' : '#F3F4F6', borderRadius: '4px 4px 0 0' }}
              />
              <span style={{ fontSize: '0.58rem', color: '#9CA3AF' }}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Pages + Batches */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Top Pages by Views */}
        <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1rem' }}>Top Pages by Views</h3>
          {topPages.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>No page view data yet. Views will appear as users browse the site.</p>
          ) : topPages.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: i < topPages.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 600 }}>{p.path}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#8B5CF6' }}>{p.count.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Top Batches */}
        <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1rem' }}>Top Batches</h3>
          {topBatches.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>No batch data yet.</p>
          ) : topBatches.map(([batch, count], i) => (
            <div key={i} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Batch {batch}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0B6B4B' }}>{count}</span>
              </div>
              <div style={{ height: '7px', background: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(count / (topBatches[0]?.[1] ?? 1)) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                  style={{ height: '100%', background: '#0B6B4B', borderRadius: '999px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Countries + Status Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1rem' }}>Top Countries</h3>
          {topCountries.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>No country data yet.</p>
          ) : topCountries.map(([country, count], i) => (
            <div key={i} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{country}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3B82F6' }}>{count}</span>
              </div>
              <div style={{ height: '7px', background: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(count / (topCountries[0]?.[1] ?? 1)) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                  style={{ height: '100%', background: '#3B82F6', borderRadius: '999px' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1rem' }}>User Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { label: 'Active',   count: users.filter(u => u.status === 'active').length,   color: '#16A34A' },
              { label: 'Pending',  count: users.filter(u => u.status === 'pending').length,  color: '#D97706' },
              { label: 'Inactive', count: users.filter(u => u.status === 'inactive').length, color: '#6B7280' },
              { label: 'Banned',   count: users.filter(u => u.status === 'banned').length,   color: '#EF4444' },
            ].map((s) => (
              <div key={s.label} style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '0.6rem', textAlign: 'center', border: `2px solid ${s.color}22` }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPanel;
