import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight, FiUsers, FiCalendar } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';

const SchoolsSection: React.FC = () => {
  const { cms } = useCMS();
  const SCHOOLS = (cms.schools ?? []).filter((s) => s.status === 'Active');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-16 px-4 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Our Campuses</span>
          <h2 className="section-title mt-2">Our Schools</h2>
          <p className="section-subtitle">Explore the campuses that shaped generations</p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCHOOLS.map((school, i) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white rounded-xl shadow-card overflow-hidden hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={school.image}
                  alt={school.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm">{school.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-xs mb-4">{school.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><FiCalendar size={11} /> Est. {school.established}</span>
                  <span className="flex items-center gap-1"><FiUsers size={11} /> {school.students.toLocaleString()} Students</span>
                </div>
                <Link
                  to={`/schools/${school.id}`}
                  className="w-full btn-primary text-xs py-2 justify-center"
                >
                  Visit School <FiArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolsSection;
