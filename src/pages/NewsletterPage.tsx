import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar } from 'react-icons/fi';
import { useCMS } from '../context/CMSContext';

const NewsletterPage: React.FC = () => {
  const { cms } = useCMS();
  const newsletters = cms.newsletters;

  return (
    <>
      <Helmet><title>Newsletter | Campus School Pantnagar Alumni Portal</title></Helmet>
      <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Stay Informed</span>
          <h1 className="text-4xl font-black mt-2 mb-3">Newsletter</h1>
          <p className="text-white">Download our alumni newsletters and stay up to date</p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsletters.map((nl, i) => (
            <motion.div key={nl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-card border border-border/50 p-6 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex gap-5">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiBookOpen className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text text-base mb-1">{nl.title}</h3>
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-2"><FiCalendar size={11} /> {nl.date} · {nl.pages} pages</div>
                <p className="text-gray-500 text-sm mb-4">{nl.desc}</p>
                <button
                  onClick={() => {
                    const blob = new Blob([`${nl.title}\nDate: ${nl.date}\n\n${nl.desc}\n\nFor full newsletter, visit the alumni portal.`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `${nl.title.replace(/\s+/g, '_')}.txt`; a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Download PDF
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewsletterPage;
