import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiGlobe, FiSearch, FiMapPin, FiBriefcase, FiLinkedin } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NetworkingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initTab = location.pathname.includes('startups') ? 'startups' : location.pathname.includes('investors') ? 'investors' : 'professionals';
  const [tab, setTab] = useState<'professionals' | 'startups' | 'investors'>(initTab as any);
  const [search, setSearch] = useState('');

  const handleTab = (t: 'professionals' | 'startups' | 'investors') => {
    setTab(t); setSearch('');
    if (t === 'startups') navigate('/networking/startups');
    else if (t === 'investors') navigate('/networking/investors');
    else navigate('/networking');
  };

  const currentItems: any[] = [];

  return (
    <>
      <Helmet><title>Networking | Campus School Pantnagar Alumni Portal</title></Helmet>
      <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Connect</span>
          <h1 className="text-4xl font-black mt-2 mb-3">Networking</h1>
          <p className="text-white">Expand your professional network with fellow alumni</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: FiUsers, title: 'Professionals', count: '12,000+', desc: 'Alumni professionals across industries', color: 'from-primary/10 to-primary/5' },
            { icon: FiTrendingUp, title: 'Startup Founders', count: '500+', desc: 'Alumni entrepreneurs and startup founders', color: 'from-accent/10 to-accent/5' },
            { icon: FiGlobe, title: 'Investors', count: '200+', desc: 'Alumni investors and venture capitalists', color: 'from-blue-500/10 to-blue-500/5' },
          ].map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-card border border-border/50 p-6 text-center hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="text-primary" size={26} />
                </div>
                <div className="text-2xl font-black text-primary mb-1">{cat.count}</div>
                <h3 className="font-bold text-text text-base mb-1">{cat.title}</h3>
                <p className="text-gray-500 text-xs">{cat.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-secondary rounded-xl p-1.5 w-fit">
          {([
            ['professionals', 'Professionals'],
            ['startups', 'Startup Founders'],
            ['investors', 'Investors'],
          ] as const).map(([t, label]) => (
            <button key={t} onClick={() => handleTab(t)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-primary text-white shadow-premium' : 'text-gray-500 hover:text-primary'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, company, or industry..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
        </div>

        {currentItems.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FiUsers size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No profiles listed yet.</p>
            <p className="text-sm mt-1">Alumni professionals will appear here once registered.</p>
            <Link to="/auth/register" className="btn-primary mt-6 inline-flex">Register as Alumni</Link>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item: any, i: number) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-xl shadow-card border border-border/50 p-5 hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={item.photo} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-text text-sm">{item.name}</h3>
                      <p className="text-primary text-xs font-semibold truncate">{item.role || item.firm}</p>
                      <p className="text-gray-500 text-xs truncate">{item.company || item.firm}</p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5"><FiMapPin size={11} className="text-primary" /> {item.location}</div>
                    <div className="flex items-center gap-1.5"><FiBriefcase size={11} className="text-primary" />
                      {item.industry || item.sector || item.focus}
                    </div>
                    {item.funding && <div className="flex items-center gap-1.5"><FiTrendingUp size={11} className="text-accent" /> {item.funding}</div>}
                    <div className="text-gray-400">Batch of {item.batch}</div>
                  </div>
                  <Link to="/directory" className="btn-primary text-xs py-2 justify-center w-full">
                    <FiLinkedin size={12} /> Connect
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default NetworkingPage;
