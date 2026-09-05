import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight } from 'react-icons/fi';
import { useAlumniData } from '../../hooks/useAlumniData';
import AlumniCard from '../ui/AlumniCard';

const NotableAlumni: React.FC = () => {
  const { data: alumni, loading } = useAlumniData({ limit: 8 });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  if (loading || alumni.length === 0) return null;

  return (
    <section className="py-10 sm:py-20 px-3 sm:px-4" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-14 gap-3"
        >
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Our Pride</span>
            <h2 className="section-title mt-2">Notable Alumni</h2>
            <p className="section-subtitle">Celebrating the achievements of our distinguished graduates</p>
          </div>
          <Link to="/directory" className="btn-primary self-start md:self-auto flex-shrink-0 text-sm py-2 px-4">
            View All Alumni <FiArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {alumni.map((a, i) => (
            <AlumniCard key={a.id} alumni={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NotableAlumni;
