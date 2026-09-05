import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const milestones = [
  {
    year: '1972',
    title: 'Foundation',
    desc: 'Campus School Pantnagar was established under G.B. Pant University of Agriculture & Technology with a vision of providing quality holistic education to the children of university staff and the wider community.',
    icon: '🏫',
  },
  {
    year: '1980',
    title: 'Growth & Expansion',
    desc: 'The school expanded its infrastructure and faculty strength to accommodate a rapidly growing student population. New classrooms, laboratories, and sports facilities were added to the campus.',
    icon: '📈',
  },
  {
    year: '1995',
    title: 'Senior Secondary Streams',
    desc: 'Senior Secondary (Class XI–XII) streams in Science, Commerce, and Arts were introduced, enabling students to pursue diverse academic interests and prepare for competitive examinations.',
    icon: '🎓',
  },
  {
    year: '2005',
    title: 'Digital Era',
    desc: 'State-of-the-art computer laboratories were established, integrating technology into the curriculum. The school embraced digital learning tools and internet-based resources for modern education.',
    icon: '💻',
  },
  {
    year: '2015',
    title: 'Alumni Association',
    desc: 'The Campus School Pantnagar Alumni Association was formally strengthened, connecting thousands of graduates across India and abroad. Mentorship and scholarship programmes were launched.',
    icon: '🤝',
  },
  {
    year: '2025',
    title: 'Alumni Portal Launch',
    desc: 'The dedicated Alumni Portal was launched, providing a comprehensive digital platform for networking, mentorship, job opportunities, events, and lifelong connection with the alma mater.',
    icon: '🌐',
  },
];

const HistoryPage: React.FC = () => (
  <>
    <Helmet><title>History & Milestones | Campus School Pantnagar Alumni Portal</title></Helmet>

    {/* Hero */}
    <div
      className="relative py-20 px-4 text-white text-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 60%, #0d7d58 100%)' }}
    >
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%,-30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#ffffff', transform: 'translate(-30%,30%)' }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <span className="text-accent font-semibold text-sm uppercase tracking-widest">Our Journey</span>
        <h1 className="text-4xl md:text-5xl font-black mt-3 mb-4">History & Milestones</h1>
        <p className="text-white max-w-xl mx-auto text-base">Over 50 years of excellence, integrity, and community service</p>
        <div className="flex items-center justify-center gap-2 mt-6 text-white/50 text-sm">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/about" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>About</Link>
          <span>/</span>
          <span style={{ color: '#D4AF37' }}>History</span>
        </div>
      </motion.div>
    </div>

    <div className="max-w-4xl mx-auto px-4 py-16">

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="text-center mb-16"
      >
        <span className="text-primary font-semibold text-sm uppercase tracking-widest">Est. 1972</span>
        <h2 className="text-3xl font-black text-text mt-2 mb-4">A Legacy Built Over Decades</h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm">
          Campus School Pantnagar has been a cornerstone of quality education in Uttarakhand since 1972.
          Affiliated with CBSE, New Delhi, and established under G.B. Pant University of Agriculture & Technology,
          the school has shaped generations of leaders, innovators, and changemakers.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 hidden md:block"
          style={{ background: 'linear-gradient(to bottom, #0B6B4B, #D4AF37)', transform: 'translateX(-50%)' }}
        />

        <div className="space-y-10">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className={`flex items-center gap-6 md:gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Spacer */}
              <div className="flex-1 hidden md:block" />

              {/* Center dot */}
              <div
                className="hidden md:flex w-16 h-16 rounded-full items-center justify-center flex-shrink-0 z-10 text-2xl shadow-premium"
                style={{ background: 'linear-gradient(135deg, #0B6B4B, #D4AF37)' }}
              >
                {m.icon}
              </div>

              {/* Card */}
              <div className="flex-1 bg-white rounded-2xl shadow-card border border-border/50 p-6 hover:shadow-premium transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl md:hidden">{m.icon}</span>
                  <div>
                    <span
                      className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{ background: 'rgba(11,107,75,0.1)', color: '#0B6B4B' }}
                    >
                      {m.year}
                    </span>
                  </div>
                </div>
                <h3 className="font-black text-text text-base mb-2">{m.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 mb-14"
      >
        {[
          { value: '50+', label: 'Years of Excellence' },
          { value: 'CBSE', label: 'Affiliated Board' },
          { value: 'Nursery–XII', label: 'Classes Offered' },
          { value: '1972', label: 'Year Established' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-card border border-border/50 p-5 text-center">
            <div className="text-2xl font-black text-primary mb-1">{s.value}</div>
            <div className="text-xs text-gray-500 font-medium">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        className="rounded-2xl p-10 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%,-30%)' }} />
        <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">School Motto</p>
        <h3 className="text-white font-black text-2xl md:text-3xl mb-4">"Glory To God and Service To All"</h3>
        <p className="text-white/70 text-sm mb-8">— The guiding principle of Campus School Pantnagar since 1972</p>
        <Link to="/about" className="bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-accent hover:text-white transition-all duration-300 inline-flex items-center gap-2">
          Learn More About Us <FiArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  </>
);

export default HistoryPage;
