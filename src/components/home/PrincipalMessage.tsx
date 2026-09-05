import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight } from 'react-icons/fi';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const PrincipalMessage: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-20 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 60%, #0d7d58 100%)' }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#ffffff', transform: 'translate(-30%, 30%)' }} />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: '#D4AF37', transform: 'translate(-50%, -50%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative inline-block w-full max-w-sm mx-auto lg:mx-0">
              {/* Decorative frame */}
              <div
                className="absolute -top-4 -left-4 w-full h-full rounded-2xl"
                style={{ border: '2px solid rgba(212,175,55,0.3)', borderRadius: '1.25rem' }}
              />
              <img
                src="/photo.jpg"
                alt="Principal"
                className="rounded-2xl w-full h-96 object-cover object-top shadow-glass relative z-10"
                style={{ border: '3px solid rgba(212,175,55,0.5)' }}
              />
              {/* Name card */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-3 shadow-premium text-center z-20"
                style={{ width: 'max-content', maxWidth: '90%', border: '1px solid rgba(229,231,235,0.5)' }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => <FaStar key={i} size={10} style={{ color: '#D4AF37' }} />)}
                </div>
                <p className="font-black text-text text-sm">Mrs. Priyanka Bhatt</p>
                <p className="text-primary text-xs font-semibold">Principal</p>
                <p className="text-gray-400 text-xs">Campus School Pantnagar</p>
              </div>

              {/* Experience badge */}
              <div
                className="absolute -top-3 -right-3 z-20 rounded-full flex flex-col items-center justify-center"
                style={{
                  width: 72, height: 72,
                  background: 'linear-gradient(135deg, #D4AF37, #b8962e)',
                  boxShadow: '0 4px 16px rgba(212,175,55,0.4)',
                }}
              >
                <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>30+</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.55rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>Years<br />Service</span>
              </div>
            </div>
          </motion.div>

          {/* Message side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">Principal's Message</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3 mb-6 leading-tight">
              A Message of Pride<br />
              <span className="text-accent">& Inspiration</span>
            </h2>

            <div className="relative">
              <FaQuoteLeft className="absolute -top-2 -left-2 opacity-20" size={52} style={{ color: '#D4AF37' }} />
              <div className="pl-10">
                <p className="text-white/90 text-base leading-relaxed mb-5 italic">
                  "Our alumni are the living testament to what Campus School Pantnagar stands for — excellence, integrity, and service. Each one of you carries the torch of our motto: <em>Glory To God and Service To All</em>."
                </p>
                <p className="text-white/75 text-sm leading-relaxed mb-5">
                  "As you navigate your professional journeys, remember that the values instilled within these walls are your greatest asset. Stay connected, support one another, and continue to make us proud. This portal is your home — always."
                </p>
                <p className="text-white/75 text-sm leading-relaxed">
                  "I invite every alumnus to engage actively — mentor a student, share an opportunity, or simply reconnect with a classmate. Together, we build a legacy that endures."
                </p>
              </div>
            </div>

            {/* Signature */}
            <div
              className="mt-8 flex items-center gap-4 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <img
                src="/photo.jpg"
                alt="Principal"
                className="w-14 h-14 rounded-xl object-cover object-top"
                style={{ border: '2px solid rgba(212,175,55,0.4)' }}
              />
              <div>
                <p className="text-white font-black text-base">Mrs. Priyanka Bhatt</p>
                <p className="text-accent text-xs font-semibold">Principal, Campus School Pantnagar</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/about/principal"
                className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-accent hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                Read Full Message <FiArrowRight size={15} />
              </Link>
              <Link
                to="/auth/register"
                className="border-2 border-white/40 text-white px-6 py-3 rounded-xl font-bold text-sm hover:border-accent hover:text-accent transition-all duration-300"
              >
                Join the Community
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PrincipalMessage;
