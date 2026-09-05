import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiUsers, FiArrowRight, FiStar } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';

const CTABanner: React.FC = () => {
  const { cms } = useCMS();
  const { cta } = cms;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 50%, #0d7d58 100%)' }} />

      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(-40%, -40%)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#ffffff', transform: 'translate(30%, 30%)' }} />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full opacity-5" style={{ background: '#D4AF37', transform: 'translate(-50%, -50%)' }} />

      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        {[...Array(10)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={`${(i + 1) * 10}%`} x2="100%" y2={`${(i + 1) * 10}%`} stroke="white" strokeWidth="0.5" />
        ))}
        {[...Array(15)].map((_, i) => (
          <line key={`v${i}`} x1={`${(i + 1) * 6.67}%`} y1="0" x2={`${(i + 1) * 6.67}%`} y2="100%" stroke="white" strokeWidth="0.5" />
        ))}
      </svg>

      <div className="relative max-w-5xl mx-auto text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} size={18} style={{ color: '#D4AF37', fill: '#D4AF37' }} />
            ))}
          </div>

          <span
            style={{
              display: 'inline-block', background: 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.4)', borderRadius: '2rem',
              padding: '0.3rem 1rem', color: '#D4AF37',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', marginBottom: '1.25rem',
            }}
          >
            Join Us Today
          </span>

          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            {cta.heading}
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            {cta.description}
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Link
              to={cta.primaryBtnLink}
              style={{
                background: '#ffffff', color: '#0B6B4B',
                padding: '0.9rem 2rem', borderRadius: '0.875rem',
                fontWeight: 800, fontSize: '0.95rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                textDecoration: 'none', transition: 'all 0.3s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#D4AF37'; (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff'; (e.currentTarget as HTMLElement).style.color = '#0B6B4B'; }}
            >
              <FiUsers size={18} /> {cta.primaryBtnLabel}
            </Link>
            <Link
              to={cta.secondaryBtnLink}
              style={{
                border: '2px solid rgba(255,255,255,0.5)', color: '#ffffff',
                padding: '0.9rem 2rem', borderRadius: '0.875rem',
                fontWeight: 700, fontSize: '0.95rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                textDecoration: 'none', transition: 'all 0.3s',
                background: 'transparent',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = '#ffffff'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; }}
            >
              {cta.secondaryBtnLabel} <FiArrowRight size={18} />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { val: '55', lbl: 'Registered Alumni' },
              { val: '10+', lbl: 'Countries' },
              { val: '10+', lbl: 'Active Mentors' },
              { val: '50+', lbl: 'Years of Legacy' },
            ].map((s) => (
              <div key={s.lbl} style={{ textAlign: 'center' }}>
                <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{s.val}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', fontWeight: 500, marginTop: 4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
