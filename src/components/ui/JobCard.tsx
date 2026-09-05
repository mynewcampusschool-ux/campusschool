import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiClock, FiSearch, FiX, FiSave, FiCheckCircle } from 'react-icons/fi';
import CTABanner from '../sections/CTABanner';

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
  deadline: string;
  postedBy: string;
  duration?: string;
  stipend?: string;
  openings?: number;
  batch?: string;
}

const typeColors: Record<string, string> = {
  'full-time': 'bg-green-100 text-green-700',
  'internship': 'bg-blue-100 text-blue-700',
  'campus': 'bg-purple-100 text-purple-700',
};

const inp: React.CSSProperties = {
  width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB',
  borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none',
  fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '0.78rem', fontWeight: 600,
  color: '#374151', marginBottom: '0.3rem',
};

interface Props {
  items: JobItem[];
}

const JobsContent: React.FC<Props> = ({ items }) => {
  const [search, setSearch] = useState('');
  const [applyModal, setApplyModal] = useState<JobItem | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', resume: '', cover: '' });
  const [submitted, setSubmitted] = useState(false);

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setApplyForm(p => ({ ...p, [k]: e.target.value }));

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setApplyModal(null);
      setSubmitted(false);
      setApplyForm({ name: '', email: '', phone: '', resume: '', cover: '' });
    }, 2500);
  };

  const filtered = items.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative mb-8 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or company..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No listings found.</p>}

        <AnimatePresence mode="wait">
          <motion.div
            key="jobs-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((job, i) => (
              <motion.div
                key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl shadow-card border border-border/50 p-6 hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FiBriefcase className="text-primary" size={22} />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColors[job.type] ?? 'bg-gray-100 text-gray-600'}`}>
                    {job.type.replace('-', ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-text text-base mb-1">{job.title}</h3>
                <p className="text-primary text-sm font-semibold mb-3">{job.company}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><FiMapPin size={11} /> {job.location}</span>
                  <span className="flex items-center gap-1"><FiClock size={11} /> {job.deadline}</span>
                </div>
                {job.duration  && <p className="text-xs text-gray-500 mb-1">Duration: <span className="font-semibold text-text">{job.duration}</span></p>}
                {job.stipend   && <p className="text-xs text-gray-500 mb-1">Stipend: <span className="font-semibold text-primary">{job.stipend}</span></p>}
                {job.openings  && <p className="text-xs text-gray-500 mb-1">Openings: <span className="font-semibold text-text">{job.openings}</span></p>}
                {job.batch     && <p className="text-xs text-gray-500 mb-3">Batch: <span className="font-semibold text-text">{job.batch}</span></p>}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {job.skills.map(s => (
                    <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-xs">By {job.postedBy}</p>
                  <button onClick={() => setApplyModal(job)} className="btn-primary text-xs py-2 px-4">Apply Now</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <CTABanner />

      {/* Apply Modal */}
      <AnimatePresence>
        {applyModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setApplyModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', margin: 0 }}>Apply for {applyModal.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0 }}>{applyModal.company} · {applyModal.location}</p>
                </div>
                <button onClick={() => setApplyModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <FiCheckCircle size={48} style={{ color: '#0B6B4B', margin: '0 auto 1rem' }} />
                    <h4 style={{ fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Application Submitted!</h4>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Your application has been sent. The recruiter will contact you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {[
                      { label: 'Full Name', key: 'name', ph: 'Your full name', type: 'text' },
                      { label: 'Email Address', key: 'email', ph: 'your@email.com', type: 'email' },
                      { label: 'Phone Number', key: 'phone', ph: '+91 XXXXX XXXXX', type: 'tel' },
                      { label: 'Resume / LinkedIn URL', key: 'resume', ph: 'https://linkedin.com/in/...', type: 'url' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={lbl}>{f.label} <span style={{ color: '#EF4444' }}>*</span></label>
                        <input required type={f.type} value={(applyForm as Record<string, string>)[f.key]} onChange={setF(f.key)} placeholder={f.ph} style={inp} />
                      </div>
                    ))}
                    <div>
                      <label style={lbl}>Cover Letter (optional)</label>
                      <textarea value={applyForm.cover} onChange={setF('cover')} placeholder="Why are you a good fit for this role?" rows={3} style={{ ...inp, resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.25rem' }}>
                      <button type="button" onClick={() => setApplyModal(null)} style={{ padding: '0.6rem 1.2rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', background: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#6B7280' }}>Cancel</button>
                      <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                        <FiSave size={14} /> Submit Application
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobsContent;
