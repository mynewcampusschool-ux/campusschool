import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZoomIn, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useCMS } from '../context/CMSContext';

const categories = ['All', 'Events', 'Academics', 'Sports', 'Campus', 'Cultural'];

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23e5e7eb%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 fill%3D%22%239ca3af%22 font-size%3D%2216%22%3ENo Image%3C%2Ftext%3E%3C%2Fsvg%3E';
const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = PLACEHOLDER; };

const GalleryPage: React.FC = () => {
  const { cms } = useCMS();
  const GALLERY_ITEMS = cms.gallery.filter(g => g.enabled).sort((a, b) => a.order - b.order);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((p) => p.category === activeCategory);

  const safeIdx = lightboxIndex !== null && lightboxIndex < filtered.length ? lightboxIndex : null;
  const prev = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const next = () => setLightboxIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i));

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setLightboxIndex(null); // close lightbox when filter changes
  };

  return (
    <>
      <Helmet>
        <title>Gallery | Campus School Pantnagar Alumni Portal</title>
        <meta name="description" content="Browse the photo gallery of Campus School Pantnagar alumni events, campus life, and achievements." />
      </Helmet>

      <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Memories</span>
          <h1 className="text-4xl font-black mt-2 mb-3">Photo Gallery</h1>
          <p className="text-white">Relive the moments that define our community</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-premium'
                  : 'bg-white text-gray-500 border border-border hover:border-primary hover:text-primary shadow-card'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <AnimatePresence>
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-card hover:shadow-premium transition-all duration-300"
                style={{ aspectRatio: '1/1' }}
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={photo.thumb || PLACEHOLDER}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={onImgError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-semibold text-xs">{photo.caption}</p>
                  <span className="text-accent text-xs">{photo.category}</span>
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FiZoomIn className="text-white" size={14} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {safeIdx !== null && filtered[safeIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[safeIdx].src || PLACEHOLDER}
                alt={filtered[safeIdx].caption}
                className="w-full rounded-2xl"
                style={{ maxHeight: '80vh', objectFit: 'contain' }}
                onError={onImgError}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl p-5">
                <p className="text-white font-semibold">{filtered[safeIdx].caption}</p>
                <span className="text-accent text-sm">{filtered[safeIdx].category}</span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-2 right-2 sm:-top-4 sm:-right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-premium hover:bg-accent hover:text-white transition-all"
              >
                <FiX size={18} />
              </button>
              <button
                onClick={prev}
                className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
              >
                <FiChevronRight size={18} />
              </button>
              <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full">
                {safeIdx + 1} / {filtered.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryPage;
