import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBriefcase, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';

const typeColors: Record<string, string> = {
  'full-time': 'bg-green-100 text-green-700',
  'internship': 'bg-blue-100 text-blue-700',
  'part-time': 'bg-orange-100 text-orange-700',
};

const JobsSection: React.FC = () => {
  const { cms } = useCMS();
  const JOBS = cms.jobs
    .filter((j) => j.status === 'Active')
    .map((j) => ({ ...j, skills: Array.isArray(j.skills) ? j.skills : [] }));
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Opportunities</span>
            <h2 className="section-title mt-2">Jobs & Internships</h2>
            <p className="section-subtitle">Exclusive opportunities shared by our alumni network</p>
          </div>
          <Link to="/jobs" className="btn-primary self-start md:self-auto">
            View All Jobs <FiArrowRight size={16} />
          </Link>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {JOBS.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-card border border-border/50 p-6 hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FiBriefcase className="text-primary" size={22} />
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColors[job.type]}`}>
                  {job.type.replace('-', ' ')}
                </span>
              </div>
              <h3 className="font-bold text-text text-base mb-1">{job.title}</h3>
              <p className="text-primary text-sm font-semibold mb-3">{job.company}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><FiMapPin size={11} /> {job.location}</span>
                <span className="flex items-center gap-1"><FiClock size={11} /> {job.deadline}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {job.skills.map((s) => (
                  <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg">{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-xs">By {job.postedBy}</p>
                <Link to="/jobs" className="btn-primary text-xs py-2 px-4" onClick={() => navigate('/jobs')}>Apply</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobsSection;
