import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMapPin } from 'react-icons/fi';

const locations = [
  { city: 'Pantnagar', country: 'India (HQ)', alumni: '10+', top: '55%', left: '62%' },
  { city: 'Delhi', country: 'India', alumni: '10+', top: '48%', left: '60%' },
  { city: 'Bangalore', country: 'India', alumni: '10+', top: '65%', left: '61%' },
  { city: 'San Francisco', country: 'USA', alumni: '10+', top: '38%', left: '12%' },
  { city: 'London', country: 'UK', alumni: '10+', top: '30%', left: '46%' },
  { city: 'Dubai', country: 'UAE', alumni: '10+', top: '50%', left: '56%' },
  { city: 'Singapore', country: 'Singapore', alumni: '10+', top: '62%', left: '76%' },
  { city: 'Toronto', country: 'Canada', alumni: '10+', top: '35%', left: '20%' },
];

const AlumniMap: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 px-4" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Global Presence</span>
          <h2 className="section-title mt-2">Alumni Around the World</h2>
          <p className="section-subtitle">Our graduates are making an impact across 10+ countries</p>
        </motion.div>

        {/* Map visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden shadow-premium"
          style={{
            background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)',
            minHeight: '420px',
          }}
        >
          {/* World map SVG background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cellipse cx='500' cy='250' rx='490' ry='240' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: 'cover',
            }}
          />

          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            {[...Array(8)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="white" strokeWidth="0.5" />
            ))}
            {[...Array(12)].map((_, i) => (
              <line key={`v${i}`} x1={`${(i + 1) * 8.33}%`} y1="0" x2={`${(i + 1) * 8.33}%`} y2="100%" stroke="white" strokeWidth="0.5" />
            ))}
          </svg>

          {/* Location pins */}
          {locations.map((loc, i) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
              className="absolute group cursor-pointer"
              style={{ top: loc.top, left: loc.left, transform: 'translate(-50%, -50%)' }}
            >
              {/* Pulse ring */}
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: i === 0 ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.3)',
                  width: '24px',
                  height: '24px',
                  top: '-4px',
                  left: '-4px',
                }}
              />
              <div
                className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
                style={{ background: i === 0 ? '#D4AF37' : '#ffffff' }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: i === 0 ? '#ffffff' : '#0B6B4B' }}
                />
              </div>

              {/* Tooltip */}
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white rounded-xl shadow-premium px-3 py-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style={{ minWidth: '120px', zIndex: 10 }}
              >
                <p className="font-bold text-text text-xs">{loc.city}</p>
                <p className="text-gray-400 text-xs">{loc.country}</p>
                <p className="text-primary text-xs font-semibold">{loc.alumni} Alumni</p>
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid white' }}
                />
              </div>
            </motion.div>
          ))}

          {/* Bottom legend */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-wrap gap-4 justify-center">
            {[
              { color: '#D4AF37', label: 'Headquarters' },
              { color: '#ffffff', label: 'Alumni Hub' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-white" style={{ background: l.color }} />
                <span className="text-white/70 text-xs">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* City cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {locations.slice(0, 4).map((loc, i) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 + 0.5 }}
              className="bg-white rounded-xl p-4 shadow-card border border-border/50 text-center hover:shadow-premium transition-all duration-300"
            >
              <FiMapPin className="text-primary mx-auto mb-2" size={18} />
              <p className="font-bold text-text text-sm">{loc.city}</p>
              <p className="text-gray-400 text-xs">{loc.country}</p>
              <p className="text-primary font-semibold text-sm mt-1">{loc.alumni}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlumniMap;
