import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';

const StartupFoundersPage: React.FC = () => (
  <>
    <Helmet><title>Startup Founders | Campus School Pantnagar Alumni Portal</title></Helmet>

    <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-accent font-semibold text-sm uppercase tracking-widest">Networking</span>
        <h1 className="text-4xl font-black mt-2 mb-3">Startup Founders</h1>
        <p className="text-white">Alumni entrepreneurs and startup founders building the future</p>
      </motion.div>
    </div>

    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[{ label: 'Startup Founders', value: '10+' }, { label: 'Sectors', value: '10+' }, { label: 'Total Funding', value: '$10M+' }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-card border border-border/50 p-6 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FiTrendingUp className="text-accent" size={22} />
            </div>
            <div className="text-2xl font-black text-primary mb-1">{s.value}</div>
            <div className="text-sm text-gray-500 font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ padding: '3rem 1rem', background: '#F8FAFC', borderRadius: '1rem', textAlign: 'center', border: '1px dashed #E5E7EB' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
        <h2 style={{ fontWeight: 900, fontSize: '1.75rem', color: '#111827', marginBottom: '0.5rem' }}>Coming Soon</h2>
        <p style={{ color: '#6B7280', fontSize: '0.95rem', maxWidth: 420, margin: '0 auto' }}>
          Alumni entrepreneur profiles will be featured here as they register and share their startup journeys.
        </p>
      </motion.div>
    </div>
  </>
);

export default StartupFoundersPage;
