import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiUsers, FiArrowRight, FiPlay } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';

const HeroSection: React.FC = () => {
  const { cms } = useCMS();
  const HERO_SLIDES = cms.heroSlides.filter((s) => s.enabled);
  const slideCount = HERO_SLIDES.length;
  const [current, setCurrent] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (slideCount === 0) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slideCount), 6000);
    return () => clearInterval(timer);
  }, [slideCount]);

  const prev = () => setCurrent((p) => (p - 1 + slideCount) % slideCount);
  const next = () => setCurrent((p) => (p + 1) % slideCount);

  const safeIdx = slideCount > 0 ? Math.min(current, slideCount - 1) : 0;
  const slide = HERO_SLIDES[safeIdx];

  if (slideCount === 0 || !slide) {
    return <section className="relative overflow-hidden" style={{ height: '92vh', minHeight: '600px', background: '#0B6B4B' }} />;
  }

  return (
    <section className="relative overflow-hidden" style={{ height: '75vh', minHeight: '500px' }}>
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="hero" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.25) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
        </motion.div>
      </AnimatePresence>

      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 z-20" style={{ background: 'linear-gradient(90deg, #0B6B4B, #D4AF37, #0B6B4B)' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left content */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 mb-5"
                    style={{
                      background: 'rgba(212,175,55,0.15)',
                      border: '1px solid rgba(212,175,55,0.4)',
                      borderRadius: '2rem',
                      padding: '0.35rem 1rem',
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4AF37', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    <span style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Est. 1972 · Glory To God and Service To All
                    </span>
                  </motion.div>

                  <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 4rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                    {slide.title}
                  </h1>
                  <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 3.2rem)', fontWeight: 900, color: '#D4AF37', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                    {slide.subtitle}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(0.875rem, 2vw, 1.05rem)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '520px' }}>
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4 sm:mb-6">
                    <Link to={slide.primaryBtnLink || '/auth/register'} className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.65rem 1.1rem', borderRadius: '0.875rem' }}>
                      <FiUsers size={15} /> {slide.primaryBtnLabel || 'Join Alumni Network'}
                    </Link>
                    <Link to={slide.secondaryBtnLink || '/directory'} className="btn-outline" style={{ fontSize: '0.82rem', padding: '0.65rem 1.1rem', borderRadius: '0.875rem' }}>
                      {slide.secondaryBtnLabel || 'Explore Community'}
                    </Link>
                    <button
                      onClick={() => setShowVideo(true)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)',
                        color: '#ffffff', padding: '0.65rem 1.1rem', borderRadius: '0.875rem',
                        fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)',
                      }}
                    >
                      <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiPlay size={11} style={{ marginLeft: 2 }} />
                      </span>
                      Watch Story
                    </button>
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-4">
                    {[
                      { val: '55', lbl: 'Alumni' },
                      { val: '25+', lbl: 'Countries' },
                      { val: '50+', lbl: 'Years' },
                      { val: '10+', lbl: 'Companies' },
                    ].map((b) => (
                      <div key={b.lbl} style={{ textAlign: 'center' }}>
                        <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: '1.25rem', lineHeight: 1 }}>{b.val}</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 500, marginTop: 2 }}>{b.lbl}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — floating card */}
            <div className="lg:col-span-5 hidden lg:flex justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 40, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '1.5rem',
                    padding: '1.75rem',
                    width: '320px',
                  }}
                >
                  <p style={{ color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Access</p>
                  {cms.quickAccess.filter((c) => c.enabled).map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.65rem 0.875rem', borderRadius: '0.75rem',
                        marginBottom: '0.4rem', textDecoration: 'none',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.15)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                      <span style={{ color: '#ffffff', fontSize: '0.82rem', fontWeight: 600 }}>{item.title}</span>
                      <FiArrowRight size={13} style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }} />
                    </Link>
                  ))}
                  <Link
                    to="/auth/register"
                    style={{
                      display: 'block', textAlign: 'center', marginTop: '1rem',
                      background: '#D4AF37', color: '#ffffff', padding: '0.75rem',
                      borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem',
                      textDecoration: 'none', transition: 'background 0.2s',
                    }}
                  >
                    Register as Alumni →
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
        <FiChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
        <FiChevronRight size={20} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 32 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? '#D4AF37' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 z-20" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600 }}>
        {String(current + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="relative w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-black rounded-2xl overflow-hidden">
                <iframe
                  width="100%" height="100%"
                  src="https://www.youtube.com/embed/FyixCGoK7OQ?autoplay=1"
                  title="Campus School Pantnagar Alumni"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              </div>
              <button
                onClick={() => setShowVideo(false)}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#ffffff', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: 700, color: '#111827',
                  zIndex: 10,
                }}
              >✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
