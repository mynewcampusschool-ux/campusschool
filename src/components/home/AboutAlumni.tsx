import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const pillars = [
  { icon: '🎓', title: 'Academic Excellence', desc: 'Decades of producing top-ranking students across science, commerce, and humanities.' },
  { icon: '🌍', title: 'Global Reach', desc: 'Alumni thriving in 25+ countries, representing India with pride and distinction.' },
  { icon: '🤝', title: 'Community First', desc: 'A vibrant network that gives back — through mentorship, scholarships, and service.' },
  { icon: '🏆', title: 'Legacy of Honour', desc: 'Rooted in the motto "Glory To God and Service To All" since 1972.' },
];

const highlights = [
  'Established in 1972 under G.B. Pant University of Agriculture & Technology, Pantnagar',
  'Affiliated with CBSE, New Delhi',
  'Alumni in IITs, IIMs, ISRO, IAS, and leading companies across India & abroad',
  'Classes from Nursery to Class XII (Science, Commerce & Arts)',
  'Dedicated alumni scholarship and welfare fund',
];

const AboutAlumni: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section ref={ref} className="py-20 px-4" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Who We Are</span>
            <h2 className="section-title mt-2 mb-5" style={{ fontSize: '2.25rem', lineHeight: 1.2 }}>
              A Legacy Built on<br />
              <span style={{ color: '#0B6B4B' }}>Excellence & Service</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-base">
              Campus School Pantnagar has been a cornerstone of quality education in Uttarakhand since 1972. Founded with an unwavering commitment to holistic development, the institution has shaped generations of leaders, innovators, and changemakers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6 text-base">
              The Alumni Portal is our digital home — a space to reconnect, collaborate, and celebrate the shared journey that began within these walls. Whether you graduated last year or decades ago, this community belongs to you.
            </p>
            <ul className="space-y-2.5 mb-8">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <FiCheckCircle className="text-primary flex-shrink-0 mt-0.5" size={15} />
                  {h}
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-primary">
              Our Full Story <FiArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Right — image collage */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4 about-img-collage">
              {[
                              { src: '/image 1.jpg', alt: 'Campus' },
                { src: '/image 2.jpg', alt: 'Students' },
                { src: '/image 3.jpg', alt: 'Graduation' },
                { src: '/image 4.jpg', alt: 'Alumni' },
              ].map((img) => (
                <img
                  key={img.alt}
                  src={img.src}
                  alt={img.alt}
                  className="rounded-2xl w-full h-52 object-cover shadow-premium"
                />
              ))}
            </div>
            {/* Floating badge */}
            <div
              className="about-floating-badge absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-premium px-5 py-4 border border-border/50"
              style={{ zIndex: 10 }}
            >
              <div className="text-3xl font-black text-primary">54+</div>
              <div className="text-xs text-gray-500 font-medium">Years of Excellence</div>
            </div>
          </motion.div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 pillars-mobile-grid">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i + 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="font-bold text-text text-base mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutAlumni;
