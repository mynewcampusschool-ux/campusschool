import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const timeline = [
  { year: '1972', title: 'Foundation', desc: 'Campus School Pantnagar established under G.B. Pant University of Agriculture & Technology with a vision of holistic education.' },
  { year: '1980', title: 'Growth', desc: 'School expanded its infrastructure and faculty to accommodate growing student enrollment.' },
  { year: '1995', title: 'Senior Secondary', desc: 'Senior Secondary (Class XI–XII) streams introduced to serve diverse academic interests.' },
  { year: '2005', title: 'Digital Era', desc: 'Technology integration and computer labs established for modern learning.' },
  { year: '2015', title: 'Alumni Network', desc: 'Alumni association strengthened, connecting graduates across India and abroad.' },
  { year: '2025', title: 'Alumni Portal', desc: 'Launched dedicated alumni portal with mentorship, jobs, and global networking features.' },
];

const highlights = [
  'Established in 1972 under G.B. Pant University of Agriculture & Technology, Pantnagar',
  'Affiliated with CBSE, New Delhi',
  'Alumni in IITs, IIMs, ISRO, IAS, and leading companies across India & abroad',
  'Classes from Nursery to Class XII (Science, Commerce & Arts)',
  'Dedicated alumni scholarship and welfare fund',
  'A legacy of academic excellence and character building for 50+ years',
];

const AboutPage: React.FC = () => (
  <>
    <Helmet><title>About Us | Campus School Pantnagar Alumni Portal</title></Helmet>

    {/* Page Hero */}
    <div
      className="relative py-24 px-4 text-white text-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 60%, #0d7d58 100%)' }}
    >
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#ffffff', transform: 'translate(-30%, 30%)' }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <span className="text-accent font-semibold text-sm uppercase tracking-widest">Our Story</span>
        <h1 className="text-4xl md:text-5xl font-black mt-3 mb-4">About Campus School Pantnagar</h1>
        <p className="text-white/75 max-w-2xl mx-auto text-base leading-relaxed">
          Glory To God and Service To All — a legacy of excellence, integrity, and community since 1972
        </p>
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 mt-6 text-white/50 text-sm">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#D4AF37' }}>About Us</span>
        </div>
      </motion.div>
    </div>

    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Main about section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Who We Are</span>
          <h2 className="text-3xl font-black text-text mt-2 mb-5 leading-tight">
            A Legacy Built on<br />
            <span className="text-primary">Excellence & Service</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Campus School Pantnagar has been a beacon of quality education in Uttarakhand since 1972. Established under G.B. Pant University of Agriculture & Technology, the school is affiliated with CBSE and offers classes from Nursery to Class XII across Science, Commerce, and Arts streams.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our alumni network spans across India and abroad, with graduates making significant contributions in science, technology, agriculture, government services, and entrepreneurship.
          </p>
          <ul className="space-y-2.5 mb-8">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700">
                <FiCheckCircle className="text-primary flex-shrink-0 mt-0.5" size={15} />
                {h}
              </li>
            ))}
          </ul>
          <Link to="/auth/register" className="btn-primary">
            Join Our Community <FiArrowRight size={16} />
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { src: '/image_1.jpg', alt: 'Campus' },
              { src: '/image_2.jpg', alt: 'Students' },
              { src: '/image_3.jpg', alt: 'Graduation' },
              { src: '/image_4.jpg', alt: 'Alumni' },
            ].map((img) => (
              <img
                key={img.alt}
                src={img.src}
                alt={img.alt}
                className="rounded-2xl w-full h-52 object-cover shadow-premium"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          { title: 'Our Mission', desc: 'To reconnect alumni, foster meaningful relationships, and create opportunities that benefit the entire Campus School Pantnagar community.', icon: '🎯', color: '#0B6B4B' },
          { title: 'Our Vision', desc: 'To build the most engaged and impactful alumni network in Uttarakhand, empowering every graduate to achieve their full potential.', icon: '🌟', color: '#D4AF37' },
          { title: 'Our Values', desc: 'Excellence, integrity, service, and community — the same values that Campus School Pantnagar has instilled in its students for over 50 years.', icon: '💎', color: '#3B82F6' },
        ].map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.4 }}
            className="bg-white rounded-2xl shadow-card border border-border/50 p-8 text-center hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-5xl mb-5">{v.icon}</div>
            <h3 className="font-bold text-text text-lg mb-3">{v.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Notable Alumni */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Pride of Our School</span>
          <h2 className="section-title mt-2">Notable Alumni</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Brigadier Osiris Das',
              batch: '1990 Batch',
              image: '/about1.jpeg',
              role: 'Indian Army | Kirti Chakra Awardee',
              pos: '50% 15%',
              scale: 'none',
              origin: 'center',
              intro: "Awarded the Kirti Chakra (2008) — India's second-highest peacetime gallantry award — for bravery in counter-terrorism operations in J&K. Conferred the Vishisht Seva Medal (2023) for commanding a brigade along the India-China border. Served as Defence Attaché at the Embassy of India in Beijing.",
            },
            {
              name: 'Dr. Saurabh Shukla',
              batch: 'Campus School Alumni',
              image: '/about2.jpeg',
              role: 'Joint Director, Parliament of India',
              pos: '50% 50%',
              scale: 'none',
              origin: 'center',
              intro: 'Distinguished public-sector professional with 20+ years of experience across the Parliament of India, Ministry of Rural Development, and Competition Commission of India. Ph.D. in Library & Information Science from Jiwaji University.',
            },
            {
              name: 'Deepti Mehra',
              batch: '1999 Batch',
              image: '/about3.jpeg',
              role: 'Deputy Director, CII-FACE',
              pos: '50% 15%',
              scale: 'none',
              origin: 'center',
              intro: 'Policy and advocacy professional with 15+ years working with central & state governments and multilateral organisations. Specialises in agri-sector policy and stakeholder engagement. MBA in Agribusiness from G.B. Pant University.',
            },
          ].map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.2 }}
              className="bg-white rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image — square crop, face centered */}
              <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#f3f4f6' }}>
                <img
                  src={a.image}
                  alt={a.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: a.pos,
                    transform: a.scale,
                    transformOrigin: a.origin,
                    display: 'block',
                  }}
                />
              </div>
              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">{a.batch}</span>
                <h3 className="font-black text-text text-base mt-1 mb-0.5">{a.name}</h3>
                <p style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.6rem' }}>{a.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{a.intro}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Our Journey</span>
          <h2 className="section-title mt-2">History & Milestones</h2>
        </div>
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" style={{ transform: 'translateX(-50%)' }} />
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="flex-1 hidden md:block" />
                {/* Center dot */}
                <div
                  className="hidden md:flex w-14 h-14 rounded-full items-center justify-center flex-shrink-0 z-10"
                  style={{ background: 'linear-gradient(135deg, #0B6B4B, #D4AF37)', boxShadow: '0 4px 16px rgba(11,107,75,0.3)' }}
                >
                  <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '0.7rem' }}>{item.year}</span>
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-card border border-border/50 p-6 hover:shadow-premium transition-all duration-300">
                  <div className="md:hidden text-primary font-black text-sm mb-1">{item.year}</div>
                  <h3 className="font-bold text-text text-base mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Motto banner */}
      <div
        className="rounded-2xl p-6 md:p-10 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%, -30%)' }} />
        <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">School Motto</p>
        <h3 className="text-white font-black text-2xl md:text-4xl mb-4">
          "Glory To God and Service To All"
        </h3>
        <p className="text-white/60 text-sm mb-8">— The guiding principle of Campus School Pantnagar since 1972</p>
        <Link to="/auth/register" className="bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-accent hover:text-white transition-all duration-300 inline-flex items-center gap-2">
          Join Our Alumni Community <FiArrowRight size={16} />
        </Link>
      </div>
    </div>
  </>
);

export default AboutPage;
