import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiBell, FiCalendar, FiDownload, FiSearch } from 'react-icons/fi';
import { useCMS } from '../context/CMSContext';

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const categories = ['All', 'Registration', 'Event', 'Scholarship', 'General', 'Career', 'Mentorship', 'Newsletter'];

const NoticeBoardPage: React.FC = () => {
  const { cms } = useCMS();
  const NOTICES = (cms.notices ?? []);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = NOTICES.filter(n => {
    const cat = n.category || 'General';
    const matchCat = activeCategory === 'All' || cat === activeCategory;
    const matchSearch = (n.title || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (title: string) => {
    const notice = NOTICES.find(n => n.title === title);
    const blob = new Blob([`Notice: ${title}\nDate: ${notice?.date ?? ''}\n\nPlease visit the portal for full details.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet><title>Notice Board | Campus School Pantnagar Alumni Portal</title></Helmet>
      <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Announcements</span>
          <h1 className="text-4xl font-black mt-2 mb-3">Notice Board</h1>
          <p className="text-white">Stay updated with the latest announcements</p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="relative mb-5">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat ? 'bg-primary text-white shadow-premium' : 'bg-white text-gray-500 border border-border hover:border-primary hover:text-primary'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No notices found.</div>
          )}
          {filtered.map((notice, i) => (
            <motion.div key={notice.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-xl shadow-card border border-border/50 p-5 flex items-start gap-4 hover:shadow-premium transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiBell className="text-primary" size={18} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-text text-sm">{notice.title}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityColors[(notice.priority || 'low').toLowerCase()] ?? priorityColors.low}`}>
                    {(notice.priority || 'low').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FiCalendar size={10} /> {notice.date}</span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-lg font-medium">{notice.category || 'General'}</span>
                </div>
              </div>
              <button
                onClick={() => handleDownload(notice.title)}
                title="Download notice"
                className="text-gray-400 hover:text-primary transition-colors flex-shrink-0"
              >
                <FiDownload size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NoticeBoardPage;
