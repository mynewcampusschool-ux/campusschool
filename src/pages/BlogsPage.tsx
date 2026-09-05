import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiSearch, FiX, FiUser, FiEye } from 'react-icons/fi';
import { useCMS } from '../context/CMSContext';

const categories = ['All', 'Career', 'Networking', 'Education', 'Entrepreneurship', 'Life', 'Technology'];

const BlogsPage: React.FC = () => {
  const { cms } = useCMS();
  const blogs = cms.blogs.filter((b) => b.status === 'Published');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [readModal, setReadModal] = useState<any>(null);

  const filtered = blogs.filter(b => {
    const matchCat = category === 'All' || b.category === category;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Helmet><title>Blogs | Campus School Pantnagar Alumni Portal</title></Helmet>
      <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Stay Informed</span>
          <h1 className="text-4xl font-black mt-2 mb-3">Blogs</h1>
          <p className="text-white">Stories and insights from our alumni community</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search blogs or authors..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${category === cat ? 'bg-primary text-white shadow-premium' : 'bg-white text-gray-500 border border-border hover:border-primary hover:text-primary'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No blogs found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((blog, i) => (
            <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl shadow-card border border-border/50 overflow-hidden hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-lg">{blog.category}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1"><FiUser size={11} /> {blog.author}</span>
                  <span className="flex items-center gap-1"><FiEye size={11} /> {blog.views.toLocaleString()}</span>
                </div>
                <h3 className="font-bold text-text text-base mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                <button onClick={() => setReadModal(blog)} className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Read Blog <FiArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {readModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setReadModal(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '640px', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ position: 'relative' }}>
                <img src={readModal.image} alt={readModal.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '1rem 1rem 0 0' }} />
                <button onClick={() => setReadModal(null)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: 34, height: 34, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <FiX size={16} />
                </button>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ background: '#D4AF37', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '0.375rem' }}>{readModal.category}</span>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.5rem 0' }}>By {readModal.author} · {readModal.date}</p>
                <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#111827', marginBottom: '1rem', lineHeight: 1.4 }}>{readModal.title}</h2>
                <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: 1.7 }}>{readModal.excerpt}</p>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7, marginTop: '1rem' }}>Campus School Pantnagar continues to inspire generations of students and alumni. Stay connected with the alumni portal for more stories.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogsPage;
