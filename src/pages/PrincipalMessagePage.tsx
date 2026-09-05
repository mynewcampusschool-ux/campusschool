import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const vision = [
  'Nurture every student\'s intellectual, moral, and physical potential.',
  'Build a community rooted in the motto "Glory To God and Service To All".',
  'Prepare students to be responsible, compassionate global citizens.',
];

const mission = [
  'Deliver quality education through experienced and dedicated faculty.',
  'Foster a safe, inclusive, and stimulating learning environment.',
  'Strengthen the bond between school, alumni, and the wider community.',
  'Continuously innovate in curriculum, infrastructure, and student welfare.',
];

const PrincipalMessagePage: React.FC = () => (
  <>
    <Helmet><title>Principal's Message | Campus School Pantnagar Alumni Portal</title></Helmet>

    {/* Hero */}
    <div
      className="relative py-20 px-4 text-white text-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 60%, #0d7d58 100%)' }}
    >
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%,-30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#ffffff', transform: 'translate(-30%,30%)' }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <span className="text-accent font-semibold text-sm uppercase tracking-widest">Leadership</span>
        <h1 className="text-4xl md:text-5xl font-black mt-3 mb-4">Principal's Message</h1>
        <p className="text-white max-w-xl mx-auto text-base">A word from the head of Campus School Pantnagar</p>
        <div className="flex items-center justify-center gap-2 mt-6 text-white/50 text-sm">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/about" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>About</Link>
          <span>/</span>
          <span style={{ color: '#D4AF37' }}>Principal's Message</span>
        </div>
      </motion.div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-16">

      {/* Principal card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-premium border border-border/50 overflow-hidden mb-14"
      >
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Photo */}
          <div className="md:col-span-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="w-36 h-36 rounded-2xl shadow-premium mb-4 overflow-hidden">
              <img src="/photo.jpg" alt="The Principal" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-black text-text text-lg text-center">The Principal</h3>
            <p className="text-primary font-semibold text-sm text-center mt-1">Campus School Pantnagar</p>
            <p className="text-gray-400 text-xs text-center mt-1">Est. 1972 · Pantnagar, Uttarakhand</p>
          </div>

          {/* Message */}
          <div className="md:col-span-2 p-8">
            <span className="text-accent font-semibold text-xs uppercase tracking-widest">Dear Alumni & Students,</span>
            <p className="text-gray-600 leading-relaxed mt-4 mb-4 text-sm">
              It is with immense pride and joy that I welcome you to the Campus School Pantnagar Alumni Portal — a digital home for our ever-growing family of graduates who have gone on to make a difference in every corner of the world.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4 text-sm">
              Since our founding in 1972 under the G.B. Pant University of Agriculture & Technology, Campus School Pantnagar has stood as a beacon of holistic education. Our motto, <em>"Glory To God and Service To All,"</em> is not merely a phrase — it is the guiding principle that has shaped thousands of young minds into responsible, compassionate, and accomplished individuals.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4 text-sm">
              I encourage every alumnus to stay connected, give back, and inspire the next generation. Your success is our greatest achievement, and your continued engagement with this institution is what keeps our legacy alive.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm font-semibold">
              With warm regards and best wishes,<br />
              <span className="text-primary">The Principal, Campus School Pantnagar</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {[
          { title: 'Our Vision', icon: '🌟', items: vision, color: '#0B6B4B' },
          { title: 'Our Mission', icon: '🎯', items: mission, color: '#D4AF37' },
        ].map((block, i) => (
          <motion.div
            key={block.title}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-white rounded-2xl shadow-card border border-border/50 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{block.icon}</span>
              <h2 className="text-xl font-black text-text">{block.title}</h2>
            </div>
            <ul className="space-y-3">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <FiCheckCircle size={15} style={{ color: block.color, flexShrink: 0, marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl p-10 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%,-30%)' }} />
        <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Join Our Community</p>
        <h3 className="text-white font-black text-2xl mb-4">Be Part of the Legacy</h3>
        <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">Register on the alumni portal and stay connected with your school family.</p>
        <Link to="/auth/register" className="bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-accent hover:text-white transition-all duration-300 inline-flex items-center gap-2">
          Register Now <FiArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  </>
);

export default PrincipalMessagePage;
