import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import SchoolsSection from '../components/sections/SchoolsSection';
import CTABanner from '../components/sections/CTABanner';

const SchoolsPage: React.FC = () => (
  <>
    <Helmet><title>Schools | Campus School Pantnagar Alumni Portal</title></Helmet>
    <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-accent font-semibold text-sm uppercase tracking-widest">Our Campuses</span>
        <h1 className="text-4xl font-black mt-2 mb-3">Our Schools</h1>
        <p className="text-white">Explore the campuses that shaped generations of excellence</p>
      </motion.div>
    </div>
    <SchoolsSection />
    <CTABanner />
  </>
);

export default SchoolsPage;
