import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiBriefcase, FiTrendingUp, FiUserCheck, FiGrid, FiArrowUp, FiEye } from 'react-icons/fi';
import { collection, onSnapshot, query, orderBy, limit, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ALUMNI_DATA } from '../../../lib/alumniData';

interface UserRow {
  id: string;
  full_name: string;
  batch_year: string | null;
  status: string;
  created_at: any;
}

function timeAgo(ts: any): string {
  if (!ts) return '';
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 172800) return 'Yesterday';
  return `${Math.floor(diff / 86400)} days ago`;
}

const DashboardPanel: React.FC = () => {
  const [registeredUsers, setRegisteredUsers] = useState<UserRow[]>([]);
  const [recentUsers,     setRecentUsers]     = useState<UserRow[]>([]);
  const [totalViews,      setTotalViews]      = useState(0);

  useEffect(() => {
    const unsubAll = onSnapshot(collection(db, 'users'), (snap) => {
      setRegisteredUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserRow)));
    });

    const q = query(collection(db, 'users'), orderBy('created_at', 'desc'), limit(5));
    const unsubRecent = onSnapshot(q, (snap) => {
      setRecentUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserRow)));
    });

    const unsubViews = onSnapshot(doc(db, 'pageViews', 'total'), (snap) => {
      setTotalViews(snap.data()?.count ?? 0);
    });

    return () => { unsubAll(); unsubRecent(); unsubViews(); };
  }, []);

  const totalAlumni = ALUMNI_DATA.length + registeredUsers.length;

  const statCards = [
    { label: 'Total Alumni',    value: String(totalAlumni),          change: `${registeredUsers.length} registered + ${ALUMNI_DATA.length} records`, icon: FiUsers,     light: 'rgba(11,107,75,0.1)',    color: '#0B6B4B' },
    { label: 'Registered Users', value: String(registeredUsers.length), change: 'From Firebase',   icon: FiUserCheck, light: 'rgba(59,130,246,0.1)',   color: '#3B82F6' },
    { label: 'Events',           value: '02',                          change: '3 upcoming',        icon: FiCalendar,  light: 'rgba(139,92,246,0.1)',   color: '#8B5CF6' },
    { label: 'Job Postings',     value: '00',                          change: '+12 this week',     icon: FiBriefcase, light: 'rgba(212,175,55,0.1)',   color: '#D4AF37' },
    { label: 'Schools',          value: '00',                          change: 'All active',        icon: FiGrid,      light: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
    { label: 'Page Views',        value: totalViews.toLocaleString(),   change: 'Live tracking',     icon: FiEye,       light: 'rgba(139,92,246,0.1)',   color: '#8B5CF6' },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1.1rem', marginBottom: '1.75rem' }}>
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.6rem', background: s.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={19} style={{ color: s.color }} />
                </div>
                <FiTrendingUp size={15} style={{ color: '#22C55E' }} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827' }}>{s.value}</div>
              <div style={{ fontSize: '0.73rem', fontWeight: 600, color: '#6B7280' }}>{s.label}</div>
              <div style={{ fontSize: '0.68rem', color: '#22C55E', marginTop: '0.25rem' }}>{s.change}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Recent Registrations — real data */}
        <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1rem' }}>Recent Registrations</h3>
          {recentUsers.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', textAlign: 'center', padding: '1rem 0' }}>No registrations yet.</p>
          )}
          {recentUsers.map((u, i) => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: i < recentUsers.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'rgba(11,107,75,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', color: '#0B6B4B' }}>
                  {u.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827' }}>{u.full_name || 'Unknown'}</div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{u.batch_year ? `Batch ${u.batch_year}` : 'No batch'}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.67rem', fontWeight: 700, padding: '0.18rem 0.5rem', borderRadius: '999px', background: u.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: u.status === 'active' ? '#16A34A' : '#D97706' }}>
                  {u.status ? u.status.charAt(0).toUpperCase() + u.status.slice(1) : 'Pending'}
                </span>
                <div style={{ fontSize: '0.67rem', color: '#9CA3AF', marginTop: '0.15rem' }}>{timeAgo(u.created_at)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* This Month Overview */}
        <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1rem' }}>Overview</h3>
          {[
            { label: 'Total Registered Users', value: registeredUsers.length },
            { label: 'Active Users',   value: registeredUsers.filter(u => u.status === 'active').length },
            { label: 'Pending Users',  value: registeredUsers.filter(u => u.status === 'pending').length },
            { label: 'Total Alumni Records', value: ALUMNI_DATA.length },
          ].map((q, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 600 }}>{q.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>{q.value}</span>
                <FiArrowUp size={10} style={{ color: '#16A34A' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity — real registrations */}
      <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
        <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1rem' }}>Recent Activity</h3>
        {recentUsers.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF', textAlign: 'center', padding: '1rem 0' }}>No recent activity.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '0.65rem' }}>
            {recentUsers.map((u) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', padding: '0.7rem', background: '#F9FAFB', borderRadius: '0.6rem' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0B6B4B', marginTop: '0.3rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#374151', lineHeight: 1.4 }}>
                    New alumni registered: <strong>{u.full_name || 'Unknown'}</strong>{u.batch_year ? ` (Batch ${u.batch_year})` : ''}
                  </div>
                  <div style={{ fontSize: '0.67rem', color: '#9CA3AF', marginTop: '0.15rem' }}>{timeAgo(u.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPanel;
