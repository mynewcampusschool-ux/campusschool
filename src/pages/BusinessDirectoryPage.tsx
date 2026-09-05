import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiSearch, FiArrowRight, FiGlobe } from 'react-icons/fi';

const businesses = [
  { id: 'biz1', name: 'TechVentures India', owner: 'Rajesh Kumar', category: 'Technology', location: 'Bangalore', since: '2010', desc: 'Enterprise SaaS solutions for mid-market companies.', website: '#' },
  { id: 'biz2', name: 'GreenTech Solutions', owner: 'Rohit Bisht', category: 'Clean Energy', location: 'Dehradun', since: '2015', desc: 'Renewable energy solutions for homes and businesses.', website: '#' },
  { id: 'biz3', name: 'EduReach', owner: 'Anjali Pant', category: 'EdTech', location: 'Delhi', since: '2018', desc: 'Online learning platform for rural students.', website: '#' },
  { id: 'biz4', name: 'AgriSmart', owner: 'Suresh Negi', category: 'AgriTech', location: 'Pantnagar', since: '2016', desc: 'Smart farming solutions using IoT and AI.', website: '#' },
  { id: 'biz5', name: 'HealthFirst Clinic', owner: 'Sunita Rawat', category: 'Healthcare', location: 'Delhi', since: '2019', desc: 'Affordable healthcare services for underserved communities.', website: '#' },
  { id: 'biz6', name: 'LegalEase', owner: 'Kavita Mehta', category: 'Legal Tech', location: 'Mumbai', since: '2020', desc: 'AI-powered legal document automation platform.', website: '#' },
];

const BusinessDirectoryPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = businesses.filter(b =>
    [b.name, b.owner, b.category, b.location].some(v =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <Helmet><title>Business Directory | Campus School Pantnagar Alumni Portal</title></Helmet>

      <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Directory</span>
          <h1 className="text-4xl font-black mt-2 mb-3">Business Directory</h1>
          <p className="text-white">Discover alumni-owned businesses and enterprises</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Listed Businesses', value: '6+' },
            { label: 'Industries', value: '10+' },
            { label: 'Cities', value: '8+' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-card border border-border/50 p-5 text-center">
              <div className="text-2xl font-black text-primary mb-1">{s.value}</div>
              <div className="text-sm text-gray-500 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, owner, category..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
        </div>

        {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No businesses found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((biz, i) => (
            <motion.div key={biz.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-xl shadow-card border border-border/50 p-6 hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FiBriefcase className="text-primary" size={20} />
                </div>
                <span className="text-xs font-semibold bg-accent/10 text-accent px-2.5 py-1 rounded-lg">{biz.category}</span>
              </div>
              <h3 className="font-bold text-text text-base mb-1">{biz.name}</h3>
              <p className="text-primary text-xs font-semibold mb-2">Owner: {biz.owner}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><FiMapPin size={11} /> {biz.location}</span>
                <span>Est. {biz.since}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">{biz.desc}</p>
              <a href={biz.website} className="btn-primary text-xs py-2 justify-center w-full">
                <FiGlobe size={12} /> Visit Business <FiArrowRight size={12} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BusinessDirectoryPage;
