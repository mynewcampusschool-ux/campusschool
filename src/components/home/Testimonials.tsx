import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiStar } from 'react-icons/fi';
import { FaQuoteRight } from 'react-icons/fa';
import { useCMS } from '../../context/CMSContext';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials: React.FC = () => {
  const { cms } = useCMS();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const items = (cms.testimonials ?? []).filter((t) => t.enabled);

  if (items.length === 0) return null;

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 60%, #0d7d58 100%)' }}
    >
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#ffffff', transform: 'translate(-30%, 30%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2">
            What Our Alumni Say
          </h2>
          <p className="text-white/60 mt-3 text-base">Real stories from the Campus School Pantnagar community</p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-14"
        >
          {items.map((t) => (
            <SwiperSlide key={t.id}>
              <div
                className="relative h-full"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '1.25rem',
                  padding: '1.75rem',
                }}
              >
                {/* Quote icon */}
                <FaQuoteRight
                  size={36}
                  style={{ color: 'rgba(212,175,55,0.2)', position: 'absolute', top: '1.25rem', right: '1.25rem' }}
                />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={14} style={{ color: '#D4AF37', fill: '#D4AF37' }} />
                  ))}
                </div>

                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>

                <div
                  className="flex items-center gap-3 pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <img
                    src={t.photo}
                    alt={t.name}
                    style={{ width: 48, height: 48, borderRadius: '0.75rem', objectFit: 'cover', border: '2px solid rgba(212,175,55,0.4)' }}
                  />
                  <div>
                    <p style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.875rem' }}>{t.name}</p>
                    <p style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 600 }}>{t.designation}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem' }}>{t.batch}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
