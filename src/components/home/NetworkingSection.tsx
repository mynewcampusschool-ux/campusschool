import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight, FiUsers, FiShare2, FiMessageCircle, FiTrendingUp } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';

const FEATURE_ICONS = [FiUsers, FiShare2, FiMessageCircle, FiTrendingUp];
const FEATURE_COLORS = ['#0B6B4B', '#3B82F6', '#8B5CF6', '#D4AF37'];
const FEATURE_BG = ['rgba(11,107,75,0.08)', 'rgba(59,130,246,0.08)', 'rgba(139,92,246,0.08)', 'rgba(212,175,55,0.08)'];
const FEATURE_PATHS = ['/directory', '/networking', '/networking', '/directory'];
const FEATURE_TITLES = ['Alumni Directory', 'Professional Network', 'Discussion Forums', 'Success Stories'];
const FEATURE_DESCS = [
  null, // dynamic — filled below
  'Expand your circle with startup founders, investors, and industry leaders.',
  'Engage in meaningful conversations across industries and interest groups.',
  'Get inspired by the journeys of alumni who are making a global impact.',
];

const NetworkingSection: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });
  const { cms } = useCMS();
  const registeredStat = cms.stats.find(s => s.label === 'Registered Alumni');
  const alumniCount = registeredStat ? `${registeredStat.value}${registeredStat.suffix}` : '55+';

  const features = FEATURE_TITLES.map((title, i) => ({
    icon: FEATURE_ICONS[i],
    title,
    desc: i === 0
      ? `Search and connect with ${alumniCount} alumni by batch, location, or profession.`
      : FEATURE_DESCS[i]!,
    path: FEATURE_PATHS[i],
    color: FEATURE_COLORS[i],
    bg: FEATURE_BG[i],
  }));

  return (
    <section ref={ref} className="py-20 px-4" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Connect & Grow</span>
            <h2 className="section-title mt-2 mb-5" style={{ fontSize: '2.25rem', lineHeight: 1.2 }}>
              Your Network is<br />
              <span style={{ color: '#0B6B4B' }}>Your Greatest Asset</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-base">
              The Campus School Pantnagar alumni network is one of the most powerful communities in Uttarakhand. From IIT graduates to IAS officers, from Silicon Valley engineers to Bollywood artists — your next opportunity is just one connection away.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 * i + 0.2 }}
                    className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-card border border-border/50 hover:shadow-premium transition-all duration-300"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: f.bg }}
                    >
                      <Icon size={20} style={{ color: f.color }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text text-sm mb-1">{f.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link to="/networking" className="btn-primary">
              Start Networking <FiArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Right — visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div
              className="rounded-3xl overflow-hidden shadow-glass"
              style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)', padding: 'clamp(1.25rem, 4vw, 2.5rem)' }}
            >
              <h3 className="text-white font-black text-xl mb-6">Alumni Across the Globe</h3>

              {/* Stats grid — live from CMS */}
              <div className="grid grid-cols-2 gap-4 mb-6 networking-stats-grid">
                {cms.stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/10 rounded-xl p-4 text-center"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <div className="text-accent font-black text-2xl">{s.value}{s.suffix}</div>
                    <div className="text-white/70 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Industry tags */}
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Industries Represented</p>
                <div className="flex flex-wrap gap-2">
                  {['Technology', 'Medicine', 'Finance', 'Government', 'Education', 'Entrepreneurship', 'Research', 'Arts'].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NetworkingSection;
