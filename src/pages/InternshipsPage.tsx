import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const InternshipsPage: React.FC = () => (
  <>
    <Helmet><title>Internships | Campus School Pantnagar Alumni Portal</title></Helmet>

    <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-accent font-semibold text-sm uppercase tracking-widest">Opportunities</span>
        <h1 className="text-4xl font-black mt-2 mb-3">Internships</h1>
        <p className="text-white">Internship opportunities posted by our alumni network</p>
        <div className="flex items-center justify-center gap-2 mt-5 text-white/50 text-sm">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/jobs" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Jobs</Link>
          <span>/</span>
          <span style={{ color: '#D4AF37' }}>Internships</span>
        </div>
      </motion.div>
    </div>

    <div style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', background: '#F8FAFC' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
        <h2 style={{ fontWeight: 900, fontSize: '1.75rem', color: '#111827', marginBottom: '0.5rem' }}>Coming Soon</h2>
        <p style={{ color: '#6B7280', fontSize: '0.95rem', maxWidth: 420 }}>Internship listings from our alumni network are on their way. Check back soon!</p>
      </motion.div>
    </div>
  </>
);

export default InternshipsPage;
