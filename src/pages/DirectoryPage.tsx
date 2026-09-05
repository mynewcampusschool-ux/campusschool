import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUsers, FiGlobe, FiGrid } from 'react-icons/fi';

import { useAlumniData } from '../hooks/useAlumniData';
import { api } from '../lib/api';
import AlumniCard from '../components/ui/AlumniCard';
import AlumniFilters, { type FilterState } from '../components/ui/AlumniFilters';
import AlumniPagination from '../components/ui/AlumniPagination';

const PAGE_SIZE = 12;

const INIT_FILTERS: FilterState = {
  search: '', batch: '', profession: '',
  organization: '', country: '', city: '', sort: 'az',
};

const DirectoryPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(INIT_FILTERS);
  const [page, setPage] = useState(1);
  const [batches, setBatches] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    api.alumni.batches().then((b) => { if (b) setBatches(b); });
    api.alumni.countries().then((c) => { if (c) setCountries(c); });
  }, []);

  useEffect(() => { setPage(1); }, [filters]);

  const { data: alumni, total, totalPages, loading } = useAlumniData({
    search: filters.search || undefined,
    batch: filters.batch || undefined,
    country: filters.country || undefined,
    page,
    limit: PAGE_SIZE,
  });

  return (
    <>
      <Helmet>
        <title>Alumni Directory | Campus School Pantnagar</title>
        <meta name="description" content="Connect with Campus School Pantnagar alumni across the globe." />
      </Helmet>

      <div
        className="relative py-20 px-4 text-white text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 60%, #0d7d58 100%)' }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: '#D4AF37', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: '#ffffff', transform: 'translate(-30%,30%)' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Our Community</span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 mb-4">Alumni Directory</h1>
          <p className="text-white/75 max-w-xl mx-auto text-base">
            Connect with {total}+ alumni across {countries.length}+ countries
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
            {[
              { icon: <FiUsers size={18} />, val: `${total}+`, lbl: 'Registered Alumni' },
              { icon: <FiGlobe size={18} />, val: `${countries.length}+`, lbl: 'Countries' },
              { icon: <FiGrid size={18} />, val: `${batches.length}+`, lbl: 'Batches' },
            ].map((s) => (
              <div key={s.lbl} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#D4AF37', fontWeight: 900, fontSize: '1.4rem' }}>
                  {s.icon} {s.val}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', fontWeight: 500, marginTop: 2 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/50 text-sm">
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: '#D4AF37' }}>Alumni Directory</span>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <AlumniFilters
          filters={filters}
          onChange={setFilters}
          batches={batches}
          professions={[]}
          organizations={[]}
          countries={countries}
          cities={[]}
          total={total}
          filtered={total}
        />

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading alumni...</div>
        ) : alumni.length > 0 ? (
          <>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.25rem' }}
              className="alumni-grid"
            >
              {alumni.map((a, i) => (
                <AlumniCard key={a.id} alumni={a} index={i} />
              ))}
            </div>
            <AlumniPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', marginTop: '1rem' }}>
              Page {page} of {totalPages} · Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} results
            </p>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '1.125rem', border: '1px solid rgba(229,231,235,0.6)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', marginBottom: '0.5rem' }}>No alumni found</h3>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Try adjusting your search or filters.</p>
            <button
              onClick={() => setFilters(INIT_FILTERS)}
              style={{ background: '#0B6B4B', color: '#ffffff', border: 'none', borderRadius: '0.75rem', padding: '0.65rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 640px)  { .alumni-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (min-width: 1024px) { .alumni-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1280px) { .alumni-grid { grid-template-columns: repeat(4, 1fr) !important; } }
      `}</style>
    </>
  );
};

export default DirectoryPage;
