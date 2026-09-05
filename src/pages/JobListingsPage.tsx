import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBriefcase } from 'react-icons/fi';
import { useCMS } from '../context/CMSContext';
import JobsContent from '../components/ui/JobCard';

const JobListingsPage: React.FC = () => {
  const { cms } = useCMS();
  const jobListings = cms.jobs.filter(j => j.status === 'Active' && j.type !== 'Internship');

  return (
    <>
      <Helmet><title>Job Listings | Campus School Pantnagar Alumni Portal</title></Helmet>
      <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Opportunities</span>
          <h1 className="text-4xl font-black mt-2 mb-3">Job Listings</h1>
          <p className="text-white">Full-time and part-time opportunities from our alumni network</p>
          <div className="flex items-center justify-center gap-2 mt-5 text-white/50 text-sm">
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to="/jobs" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Jobs</Link>
            <span>/</span>
            <span style={{ color: '#D4AF37' }}>Job Listings</span>
          </div>
        </motion.div>
      </div>
      {jobListings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FiBriefcase size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-semibold">No job listings at the moment.</p>
          <p className="text-sm mt-1">Check back soon or post a job via the alumni network.</p>
        </div>
      ) : (
        <JobsContent items={jobListings.map(j => ({ ...j, id: String(j.id), skills: Array.isArray(j.skills) ? j.skills : [] }))} />
      )}
    </>
  );
};

export default JobListingsPage;
