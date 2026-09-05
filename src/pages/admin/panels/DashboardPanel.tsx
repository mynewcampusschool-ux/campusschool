import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiBriefcase, FiTrendingUp, FiUserCheck, FiGrid, FiEye, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { ALUMNI_DATA } from '../../../lib/alumniData';

const REAL_ALUMNI_COUNT = ALUMNI_DATA.length;

const statCards = [
  { label: 'Total Alumni', value: String(REAL_ALUMNI_COUNT), change: 'From alumni records', icon: FiUsers, light: 'rgba(11,107,75,0.1)', color: '#0B6B4B' },
  { label: 'Active Users', value: '8,240', change: '+5.2% this week', icon: FiUserCheck, light: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
  { label: 'Events', value: '02', change: '3 upcoming', icon: FiCalendar, light: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
  { label: 'Job Postings', value: '00', change: '+12 this week', icon: FiBriefcase, light: 'rgba(212,175,55,0.1)', color: '#D4AF37' },
  { label: 'Schools', value: '00', change: 'All active', icon: FiGrid, light: 'rgba(239,68,68,0.1)', color: '#EF4444' },
  { label: 'Page Views', value: '1.2M', change: '+18% this month', icon: FiEye, light: 'rgba(16,185,129,0.1)', color: '#10B981' },
];

const recentUsers = [
  { name: 'Rahul Sharma', batch: '2020', status: 'Active', date: 'Today, 2:30 PM' },
  { name: 'Priya Singh', batch: '2018', status: 'Active', date: 'Today, 11:15 AM' },
  { name: 'Amit Kumar', batch: '2015', status: 'Pending', date: 'Yesterday' },
  { name: 'Neha Verma', batch: '2022', status: 'Active', date: 'Yesterday' },
  { name: 'Vikram Negi', batch: '2019', status: 'Active', date: '2 days ago' },
];

const quickStats = [
  { label: 'New Registrations', value: 120, change: '+12%', up: true },
  { label: 'Mentorship Sessions', value: 48, change: '+8%', up: true },
  { label: 'Job Applications', value: 320, change: '-3%', up: false },
  { label: 'Event Registrations', value: 890, change: '+25%', up: true },
];

const DashboardPanel: React.FC = () => (
  <div>
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
      <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
        <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1rem' }}>Recent Registrations</h3>
        {recentUsers.map((u, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: i < recentUsers.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'rgba(11,107,75,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', color: '#0B6B4B' }}>{u.name[0]}</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827' }}>{u.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Batch {u.batch}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.67rem', fontWeight: 700, padding: '0.18rem 0.5rem', borderRadius: '999px', background: u.status === 'Active' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: u.status === 'Active' ? '#16A34A' : '#D97706' }}>{u.status}</span>
              <div style={{ fontSize: '0.67rem', color: '#9CA3AF', marginTop: '0.15rem' }}>{u.date}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
        <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1rem' }}>This Month Overview</h3>
        {quickStats.map((q, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: i < quickStats.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
            <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 600 }}>{q.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>{q.value}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', fontSize: '0.7rem', fontWeight: 700, color: q.up ? '#16A34A' : '#EF4444' }}>
                {q.up ? <FiArrowUp size={10} /> : <FiArrowDown size={10} />}{q.change}
              </span>
            </div>
          </div>
        ))}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: '0.4rem' }}>Alumni Growth (Monthly)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '55px' }}>
            {[40,65,50,80,70,90,75,95,85,100,88,120].map((h, i) => (
              <div key={i} style={{ flex: 1, background: i === 11 ? '#0B6B4B' : 'rgba(11,107,75,0.2)', borderRadius: '3px 3px 0 0', height: `${h * 0.55}%` }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#9CA3AF', marginTop: '0.2rem' }}>
            <span>Jan</span><span>Jun</span><span>Dec</span>
          </div>
        </div>
      </div>
    </div>

    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1rem' }}>Recent Activity</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '0.65rem' }}>
        {[
          { text: 'New alumni registered: Rahul Sharma (Batch 2020)', time: '2 min ago', dot: '#0B6B4B' },
          { text: 'Event "Alumni Meet 2025" has 45 new registrations', time: '15 min ago', dot: '#3B82F6' },
          { text: 'Job posted: Software Engineer at TechCorp India', time: '1 hr ago', dot: '#D4AF37' },
          { text: 'Notice published: Alumni Registration Open', time: '2 hr ago', dot: '#EF4444' },
          { text: 'Mentor session booked: Dr. Anita Joshi', time: '3 hr ago', dot: '#8B5CF6' },
          { text: 'News article published: Campus School Ranked Top', time: '5 hr ago', dot: '#10B981' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', padding: '0.7rem', background: '#F9FAFB', borderRadius: '0.6rem' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.dot, marginTop: '0.3rem', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.76rem', color: '#374151', lineHeight: 1.4 }}>{a.text}</div>
              <div style={{ fontSize: '0.67rem', color: '#9CA3AF', marginTop: '0.15rem' }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardPanel;
