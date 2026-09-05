import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import MentorsSection from '../components/sections/MentorsSection';
import CTABanner from '../components/sections/CTABanner';
import { FiCheckCircle, FiX } from 'react-icons/fi';

const MentorshipPage: React.FC = () => {
  const [applyModal, setApplyModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', designation: '', company: '', expertise: '', bio: '' });
  const [submitted, setSubmitted] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setApplyModal(false); setSubmitted(false); setForm({ name: '', email: '', designation: '', company: '', expertise: '', bio: '' }); }, 2500);
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' };

  return (
    <>
      <Helmet><title>Mentorship | Campus School Pantnagar Alumni Portal</title></Helmet>
      <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Guidance</span>
          <h1 className="text-4xl font-black mt-2 mb-3">Mentorship Program</h1>
          <p className="text-white max-w-xl mx-auto">Connect with experienced alumni who can guide your career journey</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-text">How It Works</h2>
          <p className="text-gray-500 mt-2">Simple steps to connect with your mentor</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { step: '01', title: 'Browse Mentors', desc: 'Explore our directory of experienced alumni mentors across various fields.' },
            { step: '02', title: 'Choose Your Mentor', desc: 'Select a mentor based on expertise, availability, and your career goals.' },
            { step: '03', title: 'Book a Session', desc: 'Schedule a one-on-one session at a time convenient for both of you.' },
            { step: '04', title: 'Grow Together', desc: 'Learn, network, and grow with personalized guidance from your mentor.' },
          ].map((s, i) => (
            <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-premium">
                <span className="text-white font-black text-xl">{s.step}</span>
              </div>
              <h3 className="font-bold text-text text-base mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 md:p-8 mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-black text-text mb-2">Become a Mentor</h3>
            <p className="text-gray-600 text-sm max-w-lg">Share your experience and expertise with the next generation of Campus School Pantnagar graduates. Make a lasting impact.</p>
            <ul className="mt-4 space-y-1.5">
              {['Flexible scheduling', 'Build your network', 'Give back to the community', 'Earn recognition'].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCheckCircle className="text-primary flex-shrink-0" size={14} /> {b}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => setApplyModal(true)} className="btn-primary w-full md:w-auto flex-shrink-0 px-8 py-4 text-base justify-center">Apply as Mentor</button>
        </div>
      </div>

      <MentorsSection />
      <CTABanner />

      {/* Apply as Mentor Modal */}
      <AnimatePresence>
        {applyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setApplyModal(false)}
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>Apply as Mentor</h3>
                <button onClick={() => setApplyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><FiX size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <FiCheckCircle size={48} style={{ color: '#0B6B4B', margin: '0 auto 1rem' }} />
                    <h4 style={{ fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Application Submitted!</h4>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Thank you! Our team will review your application and get back to you within 3–5 business days.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {[{ label: 'Full Name', key: 'name', placeholder: 'Your full name' }, { label: 'Email Address', key: 'email', placeholder: 'your@email.com' }, { label: 'Designation', key: 'designation', placeholder: 'e.g. Senior Engineer' }, { label: 'Company / Organisation', key: 'company', placeholder: 'Where you work' }, { label: 'Areas of Expertise', key: 'expertise', placeholder: 'e.g. Product Management, Finance, AI' }].map(f => (
                      <div key={f.key} style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>{f.label} <span style={{ color: '#EF4444' }}>*</span></label>
                        <input required value={(form as any)[f.key]} onChange={set(f.key)} placeholder={f.placeholder} style={inputStyle} />
                      </div>
                    ))}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={labelStyle}>Short Bio</label>
                      <textarea value={form.bio} onChange={set('bio')} placeholder="Tell us about yourself and why you want to mentor..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.65rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                        Submit Application
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

export default MentorshipPage;
