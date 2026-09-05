import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';



const InvestorsPage: React.FC = () => (
  <>
    <Helmet><title>Investors | Campus School Pantnagar Alumni Portal</title></Helmet>

    <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-accent font-semibold text-sm uppercase tracking-widest">Networking</span>
        <h1 className="text-4xl font-black mt-2 mb-3">Investors</h1>
        <p className="text-white">Alumni investors and venture capitalists backing the next generation</p>
      </motion.div>
    </div>

    <div style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', background: '#F8FAFC' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💼</div>
        <h2 style={{ fontWeight: 900, fontSize: '1.75rem', color: '#111827', marginBottom: '0.5rem' }}>Coming Soon</h2>
        <p style={{ color: '#6B7280', fontSize: '0.95rem', maxWidth: 420 }}>Alumni investors and VCs will be featured here as they join the portal.</p>
      </motion.div>
    </div>
  </>
);

export default InvestorsPage;
