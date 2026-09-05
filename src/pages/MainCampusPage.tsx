import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMapPin, FiUsers, FiCalendar, FiArrowRight, FiCheckCircle, FiBook, FiAward } from 'react-icons/fi';

const facilities = [
  { icon: '📚', title: 'Library', desc: 'Well-stocked library with 10,000+ books, journals, and digital resources.' },
  { icon: '🔬', title: 'Science Labs', desc: 'Fully equipped Physics, Chemistry, and Biology laboratories.' },
  { icon: '💻', title: 'Computer Lab', desc: '100-seat computer lab with high-speed internet connectivity.' },
  { icon: '🏃', title: 'Sports Ground', desc: 'Large sports ground for cricket, football, athletics, and more.' },
  { icon: '🎨', title: 'Art & Craft Room', desc: 'Dedicated space for creative arts, painting, and craft activities.' },
  { icon: '🎭', title: 'Auditorium', desc: 'Spacious auditorium for cultural events, seminars, and assemblies.' },
];

const highlights = [
  'Affiliated with CBSE, New Delhi',
  'Classes from Nursery to Class XII',
  'Science, Commerce & Arts streams at Senior Secondary level',
  'Experienced and dedicated faculty',
  'Regular co-curricular and extracurricular activities',
  'Strong alumni network across India and abroad',
];

const MainCampusPage: React.FC = () => (
  <>
    <Helmet><title>Main Campus | Campus School Pantnagar Alumni Portal</title></Helmet>

    {/* Hero */}
    <div
      className="relative py-20 px-4 text-white text-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 60%, #0d7d58 100%)' }}
    >
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%,-30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#ffffff', transform: 'translate(-30%,30%)' }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <span className="text-accent font-semibold text-sm uppercase tracking-widest">Our Campus</span>
        <h1 className="text-4xl md:text-5xl font-black mt-3 mb-4">Main Campus</h1>
        <p className="text-white max-w-xl mx-auto text-base">Campus School Pantnagar — the heart of our educational legacy since 1972</p>
        <div className="flex items-center justify-center gap-2 mt-6 text-white/50 text-sm">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/schools" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Schools</Link>
          <span>/</span>
          <span style={{ color: '#D4AF37' }}>Main Campus</span>
        </div>
      </motion.div>
    </div>

    <div className="max-w-6xl mx-auto px-4 py-16">

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">About the Campus</span>
          <h2 className="text-3xl font-black text-text mt-2 mb-5 leading-tight">
            Where Excellence<br />
            <span className="text-primary">Begins</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4 text-sm">
            The Main Campus of Campus School Pantnagar is located within the G.B. Pant University of Agriculture & Technology campus in Pantnagar, Udham Singh Nagar, Uttarakhand. Established in 1972, it is the flagship campus of the school.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6 text-sm">
            The campus offers a nurturing environment where students from Nursery to Class XII receive a well-rounded education. With CBSE affiliation and a strong focus on both academics and co-curricular activities, the Main Campus has produced thousands of successful alumni.
          </p>
          <ul className="space-y-2.5 mb-8">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700">
                <FiCheckCircle className="text-primary flex-shrink-0 mt-0.5" size={14} />
                {h}
              </li>
            ))}
          </ul>
          <Link to="/auth/register" className="btn-primary">
            Join Alumni Network <FiArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { src: '/image 1.jpg', alt: 'Campus' },
              { src: '/image 2.jpg', alt: 'Students' },
              { src: '/image 3.jpg', alt: 'Graduation' },
              { src: '/image 4.jpg', alt: 'Alumni' },
            ].map((img) => (
              <img key={img.alt} src={img.src} alt={img.alt} className="rounded-2xl w-full h-48 object-cover shadow-premium" />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
      >
        {[
          { icon: FiCalendar, value: '1972', label: 'Established' },
          { icon: FiUsers, value: '3,500+', label: 'Students' },
          { icon: FiBook, value: 'CBSE', label: 'Affiliation' },
          { icon: FiAward, value: '54+', label: 'Years of Excellence' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-card border border-border/50 p-5 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="text-primary" size={18} />
              </div>
              <div className="text-xl font-black text-primary mb-1">{s.value}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Facilities */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="text-center mb-10">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Infrastructure</span>
          <h2 className="text-2xl font-black text-text mt-2">Campus Facilities</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {facilities.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.4 }}
              className="bg-white rounded-2xl shadow-card border border-border/50 p-6 hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-text text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Location */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-card border border-border/50 p-8 mb-14"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <FiMapPin className="text-primary" size={22} />
          </div>
          <div>
            <h3 className="font-bold text-text text-base mb-2">Location</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Campus School Pantnagar<br />
              G.B. Pant University of Agriculture & Technology Campus<br />
              Pantnagar, Udham Singh Nagar<br />
              Uttarakhand — 263145, India
            </p>
            <a
              href="https://maps.google.com/?q=Campus+School+Pantnagar"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs py-2 px-4 mt-4 inline-flex"
            >
              View on Map <FiArrowRight size={12} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="rounded-2xl p-10 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%,-30%)' }} />
        <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Alumni Portal</p>
        <h3 className="text-white font-black text-2xl mb-4">Stay Connected with Your Campus</h3>
        <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">Join thousands of alumni who are making a difference. Register today and reconnect with your roots.</p>
        <Link to="/auth/register" className="bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-accent hover:text-white transition-all duration-300 inline-flex items-center gap-2">
          Register Now <FiArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  </>
);

export default MainCampusPage;
