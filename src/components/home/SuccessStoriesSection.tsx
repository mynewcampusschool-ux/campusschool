import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';

const SuccessStoriesSection: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.06 });
  const { cms } = useCMS();
  const stories = cms.news.filter((n) => n.status === 'Published').slice(0, 3);

  if (stories.length === 0) return null;

  return (
    <section ref={ref} className="py-20 px-4" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Alumni Spotlight</span>
            <h2 className="section-title mt-2">Latest Updates</h2>
            <p className="section-subtitle max-w-xl">Real journeys. Real impact. Discover how Campus School Pantnagar alumni are changing the world.</p>
          </div>
          <Link to="/news/latest" className="btn-primary self-start md:self-auto flex-shrink-0">
            All News <FiArrowRight size={16} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 stories-mobile-grid">
          {stories.map((s, i) => (
            <motion.article key={s.id} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group bg-white rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col">
              {s.image && (
                <div className="relative h-48 overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#0B6B4B' }}>{s.category}</span>
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-black text-text text-base mb-2 leading-tight">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{s.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-xs text-gray-400">{s.date}</span>
                  <Link to="/news/latest" className="text-primary text-xs font-bold flex items-center gap-1">Read More <FiArrowRight size={11} /></Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
