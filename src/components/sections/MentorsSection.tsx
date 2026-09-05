import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiStar, FiCalendar, FiArrowRight, FiX, FiCheckCircle } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';

const MentorsSection: React.FC = () => {
  const { cms } = useCMS();
  const MENTORS = cms.mentors
    .filter((m) => m.status === 'Active')
    .map((m) => ({
      ...m,
      expertise: Array.isArray(m.expertise) ? m.expertise : [],
      availability: Array.isArray(m.availability) ? m.availability : [],
    }));
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [bookModal, setBookModal] = useState<typeof MENTORS[0] | null>(null);
  const [form, setForm] = useState({ name: '', email: '', date: '', topic: '' });
  const [booked, setBooked] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => { setBookModal(null); setBooked(false); setForm({ name: '', email: '', date: '', topic: '' }); }, 2500);
  };

  const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Guidance</span>
            <h2 className="section-title mt-2">Find a Mentor</h2>
            <p className="section-subtitle">Connect with experienced alumni who can guide your career</p>
          </div>
          <Link to="/mentorship" className="btn-primary self-start md:self-auto">
            Become a Mentor <FiArrowRight size={16} />
          </Link>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MENTORS.map((mentor, i) => (
            <motion.div key={mentor.id} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-card border border-border/50 p-6 hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <img src={mentor.photo} alt={mentor.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-text text-base">{mentor.name}</h3>
                  <p className="text-primary text-xs font-semibold">{mentor.designation}</p>
                  <p className="text-gray-500 text-xs">{mentor.company}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <FiStar className="text-accent" size={12} />
                    <span className="text-xs font-semibold text-text">{mentor.rating}</span>
                    <span className="text-gray-400 text-xs">({mentor.sessions} sessions)</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-4">{mentor.bio}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.expertise.map(e => (
                  <span key={e} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-lg font-medium">{e}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <FiCalendar size={12} className="text-gray-400" />
                <span className="text-xs text-gray-500">Available: {mentor.availability.join(', ')}</span>
              </div>
              <button onClick={() => setBookModal(mentor)} className="w-full btn-primary text-xs py-2.5 justify-center">
                Book Session
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Book Session Modal */}
      <AnimatePresence>
        {bookModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setBookModal(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '460px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>Book a Session</h3>
                  <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0 }}>with {bookModal.name}</p>
                </div>
                <button onClick={() => setBookModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {booked ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <FiCheckCircle size={48} style={{ color: '#0B6B4B', margin: '0 auto 1rem' }} />
                    <h4 style={{ fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Session Booked!</h4>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{bookModal.name} will confirm your session shortly via email.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: '#F9FAFB', borderRadius: '0.75rem', marginBottom: '0.25rem' }}>
                      <img src={bookModal.photo} alt={bookModal.name} style={{ width: 44, height: 44, borderRadius: '0.5rem', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{bookModal.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#0B6B4B', fontWeight: 600 }}>{bookModal.designation}, {bookModal.company}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Available: {bookModal.availability.join(', ')}</div>
                      </div>
                    </div>
                    {[{ label: 'Your Name', key: 'name', ph: 'Full name', type: 'text' }, { label: 'Email', key: 'email', ph: 'your@email.com', type: 'email' }].map(f => (
                      <div key={f.key}>
                        <label style={lbl}>{f.label} <span style={{ color: '#EF4444' }}>*</span></label>
                        <input required type={f.type} value={(form as any)[f.key]} onChange={set(f.key)} placeholder={f.ph} style={inp} />
                      </div>
                    ))}
                    <div>
                      <label style={lbl}>Preferred Date <span style={{ color: '#EF4444' }}>*</span></label>
                      <input required type="date" value={form.date} onChange={set('date')} style={inp} min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label style={lbl}>Topic / Goal</label>
                      <textarea value={form.topic} onChange={set('topic')} placeholder="What would you like to discuss?" rows={2} style={{ ...inp, resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button type="button" onClick={() => setBookModal(null)} style={{ padding: '0.6rem 1.2rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', background: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#6B7280' }}>Cancel</button>
                      <button type="submit" style={{ background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Confirm Booking</button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MentorsSection;
