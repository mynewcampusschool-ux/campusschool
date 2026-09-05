import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight, FiCalendar, FiClock, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import { useCMS } from '../../context/CMSContext';

const HomeMiddle: React.FC = () => {
  const { cms } = useCMS();
  const notices = (cms.notices ?? []).filter((n) => n.enabled).slice(0, 5);
  const events = (cms.events ?? []).filter((e) => e.enabled).slice(0, 3);
  const latestNews = (cms.news ?? []).filter((n) => n.status === 'Published').slice(0, 3);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section ref={ref} className="py-16 px-4" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 home-middle-grid">

          {/* Notice Board */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-card border border-border/50 overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ background: 'linear-gradient(135deg, #0B6B4B, #094d36)', borderBottom: '3px solid #D4AF37' }}
            >
              <div className="flex items-center gap-2">
                <FaBell size={14} style={{ color: '#D4AF37' }} />
                <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notice Board</h2>
              </div>
              <Link to="/notice-board" style={{ color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
            </div>
            <div className="divide-y divide-border/40">
              {notices.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.07 + 0.2 }}
                  className="px-5 py-3.5 hover:bg-primary/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      style={{
                        width: 6, height: 6, borderRadius: '50%', background: n.tagColor,
                        flexShrink: 0, marginTop: 6,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        style={{
                          fontSize: '0.62rem', fontWeight: 700, color: '#ffffff',
                          background: n.tagColor, padding: '0.1rem 0.5rem',
                          borderRadius: '0.25rem', marginBottom: '0.3rem', display: 'inline-block',
                        }}
                      >
                        {n.tag}
                      </span>
                      <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.5, marginBottom: '0.2rem' }} className="line-clamp-2">
                        {n.text}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{n.date}</p>
                    </div>
                    <FiChevronRight size={13} style={{ color: '#9CA3AF', flexShrink: 0, marginTop: 4 }} className="group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-card border border-border/50 overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ background: 'linear-gradient(135deg, #0B6B4B, #094d36)', borderBottom: '3px solid #D4AF37' }}
            >
              <div className="flex items-center gap-2">
                <FiCalendar size={14} style={{ color: '#D4AF37' }} />
                <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Upcoming Events</h2>
              </div>
              <Link to="/events" style={{ color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
            </div>
            <div className="p-4 space-y-3">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="flex gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer group"
                  style={{ border: '1px solid rgba(229,231,235,0.6)' }}
                >
                  <div className="flex-shrink-0 text-center" style={{ width: 52 }}>
                    <div style={{ background: '#0B6B4B', color: '#ffffff', borderRadius: '0.5rem 0.5rem 0 0', padding: '0.2rem 0', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                      {event.month}
                    </div>
                    <div style={{ background: 'rgba(11,107,75,0.08)', color: '#0B6B4B', borderRadius: '0 0 0.5rem 0.5rem', padding: '0.3rem 0', fontSize: '1.4rem', fontWeight: 900, lineHeight: 1 }}>
                      {event.date}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '0.82rem', marginBottom: '0.25rem' }} className="line-clamp-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1" style={{ color: '#9CA3AF', fontSize: '0.7rem', marginBottom: '0.15rem' }}>
                      <FiMapPin size={10} /> {event.location}
                    </div>
                    <div className="flex items-center gap-1" style={{ color: '#9CA3AF', fontSize: '0.7rem' }}>
                      <FiClock size={10} /> {event.time}
                    </div>
                  </div>
                </motion.div>
              ))}
              <Link
                to="/events"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-primary text-xs font-semibold hover:bg-primary/5 transition-colors"
                style={{ border: '1px dashed rgba(11,107,75,0.3)' }}
              >
                View All Events <FiArrowRight size={12} />
              </Link>
            </div>
          </motion.div>

          {/* Latest News */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-card border border-border/50 overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ background: 'linear-gradient(135deg, #0B6B4B, #094d36)', borderBottom: '3px solid #D4AF37' }}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '0.85rem' }}>📰</span>
                <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Latest News</h2>
              </div>
              <Link to="/news" style={{ color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
            </div>
            <div className="p-4 space-y-3">
              {latestNews.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="flex gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer group"
                  style={{ border: '1px solid rgba(229,231,235,0.6)' }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      style={{
                        fontSize: '0.6rem', fontWeight: 700, color: '#0B6B4B',
                        background: 'rgba(11,107,75,0.08)', padding: '0.1rem 0.45rem',
                        borderRadius: '0.25rem', marginBottom: '0.3rem', display: 'inline-block',
                      }}
                    >
                      {item.category}
                    </span>
                    <h3 style={{ fontWeight: 600, color: '#111827', fontSize: '0.78rem', lineHeight: 1.4, marginBottom: '0.25rem' }} className="line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1" style={{ color: '#9CA3AF', fontSize: '0.65rem' }}>
                      <FiCalendar size={9} /> {item.date}
                    </div>
                  </div>
                </motion.div>
              ))}
              <Link
                to="/news"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-primary text-xs font-semibold hover:bg-primary/5 transition-colors"
                style={{ border: '1px dashed rgba(11,107,75,0.3)' }}
              >
                View All News <FiArrowRight size={12} />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HomeMiddle;
