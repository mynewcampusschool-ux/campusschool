import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { FiMapPin, FiUsers } from 'react-icons/fi';
import { ALUMNI_DATA } from '../../lib/alumniData';
import { useCMS } from '../../context/CMSContext';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Country → [longitude, latitude]
const COUNTRY_COORDS: Record<string, [number, number]> = {
  'India':                [78.9629,  20.5937],
  'USA':                  [-95.7129, 37.0902],
  'United States':        [-95.7129, 37.0902],
  'United Arab Emirates': [53.8478,  23.4241],
  'Germany':              [10.4515,  51.1657],
  'United Kingdom':       [-3.4360,  55.3781],
  'Canada':               [-106.346, 56.1304],
  'Australia':            [133.775,  -25.274],
  'Singapore':            [103.819,   1.352],
  'New Zealand':          [174.885, -40.900],
  'Netherlands':          [5.2913,   52.1326],
  'France':               [2.2137,   46.2276],
  'Japan':                [138.252,  36.2048],
  'INDIA':                [78.9629,  20.5937],
};

const AlumniMap: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { cms } = useCMS();
  const [tooltip, setTooltip] = useState<{ country: string; count: number } | null>(null);

  // Build country → count from real alumni data (normalized)
  const countryData = useMemo(() => {
    const map: Record<string, number> = {};
    ALUMNI_DATA.forEach(a => {
      const raw = a.country?.trim() || 'India';
      // normalize casing + known variants
      const c = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
      const normalized =
        c === 'Usa' ? 'USA' :
        c === 'Uae' || c === 'United arab emirates' ? 'United Arab Emirates' :
        c === 'Uk' || c === 'United kingdom' ? 'United Kingdom' :
        c === 'India' || raw.toUpperCase() === 'INDIA' ? 'India' : c;
      map[normalized] = (map[normalized] || 0) + 1;
    });
    return map;
  }, []);

  const markers = useMemo(() =>
    Object.entries(countryData)
      .filter(([c]) => COUNTRY_COORDS[c])
      .map(([country, count]) => ({ country, count, coords: COUNTRY_COORDS[country] }))
      .sort((a, b) => b.count - a.count),
    [countryData]
  );

  const registeredStat = cms.stats.find(s => s.label === 'Registered Alumni');
  const totalAlumni = registeredStat ? `${registeredStat.value}${registeredStat.suffix}` : `${ALUMNI_DATA.length}+`;
  const totalCountries = Object.keys(countryData).length;

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
          <p className="section-subtitle">Our graduates are making an impact across {totalCountries}+ countries</p>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden shadow-premium"
          style={{ background: '#a8c8e8', minHeight: '420px' }}
        >
          {/* Stats overlay top-right */}
          <div className="absolute top-4 right-4 z-10 flex gap-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 text-center border border-white/60 shadow-card">
              <div className="text-primary font-black text-lg leading-none">{totalAlumni}</div>
              <div className="text-gray-500 text-xs mt-0.5">Alumni</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 text-center border border-white/60 shadow-card">
              <div className="text-primary font-black text-lg leading-none">{totalCountries}+</div>
              <div className="text-gray-500 text-xs mt-0.5">Countries</div>
            </div>
          </div>

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 140, center: [20, 20] }}
            style={{ width: '100%', height: '420px' }}
          >
            <ZoomableGroup zoom={1} minZoom={1} maxZoom={4}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#b8cc80"
                      stroke="#8fa860"
                      strokeWidth={0.4}
                      style={{ outline: 'none' }}
                      onMouseEnter={(e) => { (e.target as SVGPathElement).setAttribute('fill', '#f5d76e'); }}
                      onMouseLeave={(e) => { (e.target as SVGPathElement).setAttribute('fill', '#b8cc80'); }}
                    />
                  ))
                }
              </Geographies>

              {markers.map((m, i) => (
                <Marker
                  key={m.country}
                  coordinates={m.coords}
                  onMouseEnter={() => setTooltip({ country: m.country, count: m.count })}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Pulse ring */}
                  <circle
                    r={m.count >= 10 ? 10 : m.count >= 5 ? 8 : 6}
                    fill={i === 0 ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.15)'}
                    style={{ animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }}
                  />
                  {/* Dot */}
                  <circle
                    r={m.count >= 10 ? 6 : m.count >= 5 ? 5 : 4}
                    fill={i === 0 ? '#D4AF37' : '#0B6B4B'}
                    stroke='#ffffff'
                    strokeWidth={1.5}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Count label for large clusters */}
                  {m.count >= 5 && (
                    <text
                      textAnchor="middle"
                      y={-10}
                      style={{ fontSize: '7px', fill: '#0B6B4B', fontWeight: 700, pointerEvents: 'none' }}
                    >
                      {m.count}
                    </text>
                  )}
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}
          {tooltip && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-premium px-4 py-2 text-center pointer-events-none z-20">
              <p className="font-bold text-text text-sm">{tooltip.country}</p>
              <p className="text-primary text-xs font-semibold">{tooltip.count} Alumni</p>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-5 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-card">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-accent border-2 border-white" />
              <span className="text-gray-600 text-xs">Most Alumni</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-white" />
              <span className="text-gray-600 text-xs">Alumni Present</span>
            </div>
          </div>
        </motion.div>

        {/* Country cards — top 4 by count */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {markers.slice(0, 4).map((m, i) => (
            <motion.div
              key={m.country}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 + 0.5 }}
              className="bg-white rounded-xl p-4 shadow-card border border-border/50 text-center hover:shadow-premium transition-all duration-300"
            >
              <FiMapPin className="text-primary mx-auto mb-2" size={18} />
              <p className="font-bold text-text text-sm">{m.country}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <FiUsers size={11} className="text-primary" />
                <p className="text-primary font-semibold text-sm">{m.count} Alumni</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlumniMap;
