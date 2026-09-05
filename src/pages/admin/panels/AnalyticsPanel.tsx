import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const registrations = [320, 480, 410, 560, 620, 710, 680, 820, 760, 900, 850, 1020];

const topPages = [
  { page: 'Home', views: '42,350', change: '+12%', up: true },
  { page: 'Alumni Directory', views: '18,240', change: '+8%', up: true },
  { page: 'Events', views: '12,100', change: '+15%', up: true },
  { page: 'Jobs & Internships', views: '9,800', change: '-2%', up: false },
  { page: 'Mentorship', views: '7,650', change: '+5%', up: true },
  { page: 'Notice Board', views: '5,420', change: '+3%', up: true },
];

const deviceStats = [
  { label: 'Desktop', pct: 52, color: '#0B6B4B' },
  { label: 'Mobile', pct: 38, color: '#D4AF37' },
  { label: 'Tablet', pct: 10, color: '#3B82F6' },
];

const AnalyticsPanel: React.FC = () => {
  const maxReg = Math.max(...registrations);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Page Views', value: '1.2M', change: '+18%', up: true, color: '#0B6B4B' },
          { label: 'Unique Visitors', value: '84,200', change: '+11%', up: true, color: '#3B82F6' },
          { label: 'Avg. Session', value: '4m 32s', change: '+6%', up: true, color: '#8B5CF6' },
          { label: 'Bounce Rate', value: '32%', change: '-4%', up: true, color: '#10B981' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiTrendingUp size={17} style={{ color: s.color }} />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', fontSize: '0.72rem', fontWeight: 700, color: s.up ? '#16A34A' : '#EF4444' }}>
                {s.up ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}{s.change}
              </span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827' }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        {/* Registration Chart */}
        <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1.25rem' }}>Alumni Registrations (2025)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '140px' }}>
            {registrations.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100%', background: i === new Date().getMonth() ? '#0B6B4B' : 'rgba(11,107,75,0.2)', borderRadius: '4px 4px 0 0', height: `${(v / maxReg) * 120}px`, transition: 'all 0.3s' }} />
                <span style={{ fontSize: '0.58rem', color: '#9CA3AF' }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1.25rem' }}>Device Breakdown</h3>
          {deviceStats.map((d, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{d.label}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: d.color }}>{d.pct}%</span>
              </div>
              <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 1, delay: i * 0.2 }}
                  style={{ height: '100%', background: d.color, borderRadius: '999px' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#F9FAFB', borderRadius: '0.6rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: '0.5rem', fontWeight: 600 }}>Top Traffic Source</div>
            {[{ src: 'Organic Search', pct: '45%' }, { src: 'Direct', pct: '28%' }, { src: 'Social Media', pct: '18%' }, { src: 'Referral', pct: '9%' }].map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '0.2rem 0', color: '#374151' }}>
                <span>{t.src}</span><span style={{ fontWeight: 700, color: '#0B6B4B' }}>{t.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
        <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '1.25rem' }}>Top Pages</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E5E7EB' }}>
              {['Page', 'Views', 'Change'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topPages.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.65rem 1rem', color: '#374151', fontWeight: 600 }}>{p.page}</td>
                <td style={{ padding: '0.65rem 1rem', color: '#111827', fontWeight: 700 }}>{p.views}</td>
                <td style={{ padding: '0.65rem 1rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem', fontSize: '0.75rem', fontWeight: 700, color: p.up ? '#16A34A' : '#EF4444' }}>
                    {p.up ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}{p.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
