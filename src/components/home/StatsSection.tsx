import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { FiHome, FiBriefcase, FiUsers, FiUserCheck, FiGrid, FiGlobe } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';

const Counter: React.FC<{ end: number; suffix: string; active: boolean }> = ({ end, suffix, active }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(end / (2000 / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, end]);
  return <span>{count.toLocaleString()}<span style={{ color: '#D4AF37' }}>{suffix}</span></span>;
};

const ICONS = [FiHome, FiBriefcase, FiUsers, FiUserCheck, FiGrid, FiGlobe];

const StatsSection: React.FC = () => {
  const { cms } = useCMS();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative z-10 -mt-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            background: '#ffffff',
            borderRadius: '1.25rem',
            boxShadow: '0 8px 40px 0 rgba(11,107,75,0.14), 0 2px 8px 0 rgba(0,0,0,0.06)',
            border: '1px solid rgba(229,231,235,0.6)',
            overflow: 'hidden',
          }}
        >
          {/* Top accent bar */}
          <div style={{ height: 4, background: 'linear-gradient(90deg, #0B6B4B 0%, #D4AF37 50%, #0B6B4B 100%)' }} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 stats-mobile-grid">
            {(cms.stats ?? []).map((stat, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '1.25rem 0.75rem',
                    borderRight: i < cms.stats.length - 1 ? '1px solid rgba(229,231,235,0.6)' : 'none',
                    borderBottom: '1px solid rgba(229,231,235,0.6)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: '0.875rem',
                      background: 'rgba(11,107,75,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Icon style={{ color: '#0B6B4B' }} size={22} />
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                    <Counter end={stat.value} suffix={stat.suffix} active={inView} />
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '0.72rem', fontWeight: 600, marginTop: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
