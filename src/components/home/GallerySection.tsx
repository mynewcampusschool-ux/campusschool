import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight, FiX, FiZoomIn, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';

const categories = ['All', 'Events', 'Academics', 'Sports', 'Campus'];

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23e5e7eb%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 fill%3D%22%239ca3af%22 font-size%3D%2216%22%3ENo Image%3C%2Ftext%3E%3C%2Fsvg%3E';
const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = PLACEHOLDER; };

const GallerySection: React.FC = () => {
  const { cms } = useCMS();
  const galleryItems = (cms.gallery ?? [])
    .filter((g) => g.enabled)
    .sort((a, b) => a.order - b.order)
    .slice(0, 6);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? galleryItems : galleryItems.filter((g) => g.category === activeCategory);
  const activeIdx = filtered.findIndex((g) => g.id === lightbox);
  const active = lightbox ? filtered.find((g) => g.id === lightbox) ?? null : null;

  const prevLight = () => {
    if (activeIdx > 0) setLightbox(filtered[activeIdx - 1].id);
  };
  const nextLight = () => {
    if (activeIdx < filtered.length - 1) setLightbox(filtered[activeIdx + 1].id);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setLightbox(null);
  };

  return (
    <section ref={ref} className="py-20 px-4" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Memories</span>
          <h2 className="section-title mt-2">Photo Gallery</h2>
          <p className="section-subtitle">Relive the moments that define our community</p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '0.45rem 1.1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeCategory === cat ? '#0B6B4B' : '#ffffff',
                color: activeCategory === cat ? '#ffffff' : '#6B7280',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(11,107,75,0.25)' : '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 gallery-mobile-grid">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative overflow-hidden cursor-pointer transition-all duration-300"
              style={{ height: 260, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.10)' }}
              onClick={() => setLightbox(item.id)}
            >
              <img
                src={item.thumb || PLACEHOLDER}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={onImgError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category tag */}
              <div
                className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: '#0B6B4B', color: '#ffffff',
                  fontSize: '0.62rem', fontWeight: 700, padding: '0.2rem 0.5rem',
                  borderRadius: '0.375rem', letterSpacing: '0.04em',
                }}
              >
                {item.category}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-semibold text-sm">{item.caption}</p>
              </div>
              <div className="absolute top-3 right-3 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FiZoomIn className="text-white" size={16} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/events/gallery" className="btn-primary">
            View Full Gallery <FiArrowRight size={16} />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.88 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.88 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={active.src || PLACEHOLDER}
                alt={active.caption}
                className="w-full rounded-2xl shadow-glass"
                style={{ maxHeight: '80vh', objectFit: 'contain' }}
                onError={onImgError}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl p-5">
                <p className="text-white font-semibold">{active.caption}</p>
                <span className="text-accent text-sm">{active.category}</span>
              </div>
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 34, height: 34, borderRadius: '50%',
                  background: '#ffffff', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                <FiX size={16} />
              </button>
              {activeIdx > 0 && (
                <button
                  onClick={prevLight}
                  style={{
                    position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff',
                    zIndex: 10,
                  }}
                >
                  <FiChevronLeft size={18} />
                </button>
              )}
              {activeIdx < filtered.length - 1 && (
                <button
                  onClick={nextLight}
                  style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff',
                    zIndex: 10,
                  }}
                >
                  <FiChevronRight size={18} />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
