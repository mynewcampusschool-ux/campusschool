import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ContactSection from '../components/home/ContactSection';
import { FiMapPin } from 'react-icons/fi';

const ContactPage: React.FC = () => (
  <>
    <Helmet>
      <title>Contact Us | Campus School Pantnagar Alumni Portal</title>
      <meta name="description" content="Get in touch with the Campus School Pantnagar Alumni Portal team." />
    </Helmet>

    {/* Page Hero */}
    <div
      className="relative py-24 px-4 text-white text-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 60%, #0d7d58 100%)' }}
    >
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#ffffff', transform: 'translate(-30%, 30%)' }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <span className="text-accent font-semibold text-sm uppercase tracking-widest">Reach Out</span>
        <h1 className="text-4xl md:text-5xl font-black mt-3 mb-4">Contact Us</h1>
        <p className="text-white/75 max-w-xl mx-auto">We're here to help. Reach out to the alumni team anytime.</p>
        <div className="flex items-center justify-center gap-2 mt-6 text-white/50 text-sm">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#D4AF37' }}>Contact Us</span>
        </div>
      </motion.div>
    </div>

    <ContactSection />

    {/* Map */}
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div
        className="rounded-2xl overflow-hidden shadow-premium flex items-center justify-center"
        style={{ height: '320px', background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}
      >
        <div className="text-center text-white">
          <FiMapPin size={48} className="mx-auto mb-4 text-accent" />
          <p className="font-black text-xl mb-1">Campus School Pantnagar</p>
          <p className="text-white/70 text-sm mb-4">Udham Singh Nagar, Uttarakhand – 263145</p>
          <a
            href="https://maps.google.com/?q=Campus+School+Pantnagar+Uttarakhand"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-accent-dark transition-colors"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    </div>
  </>
);

export default ContactPage;
