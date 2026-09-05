import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight, FiUsers, FiBookOpen, FiAward } from 'react-icons/fi';

const programs = [
  {
    icon: FiUsers,
    title: '1-on-1 Mentorship',
    desc: 'Personalized guidance sessions with experienced alumni mentors across diverse fields.',
    badge: 'Most Popular',
    badgeColor: '#0B6B4B',
    path: '/mentorship',
  },
  {
    icon: FiBookOpen,
    title: 'Career Workshops',
    desc: 'Group workshops on resume building, interview prep, and career transitions.',
    badge: 'New',
    badgeColor: '#D4AF37',
    path: '/mentorship',
  },
  {
    icon: FiAward,
    title: 'Leadership Program',
    desc: 'Exclusive program for high-potential alumni to develop leadership capabilities.',
    badge: 'Premium',
    badgeColor: '#8B5CF6',
    path: '/mentorship',
  },
];

const MentorshipBanner: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 px-4" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Grow Together</span>
          <h2 className="section-title mt-2">Mentorship & Career Support</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Our alumni-powered mentorship ecosystem connects aspiring professionals with seasoned leaders who have walked the same path.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {programs.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative bg-white rounded-2xl p-7 shadow-card border border-border/50 hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
              >
                <span
                  className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: p.badgeColor }}
                >
                  {p.badge}
                </span>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(11,107,75,0.08)' }}
                >
                  <Icon size={26} className="text-primary" />
                </div>
                <h3 className="font-bold text-text text-lg mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{p.desc}</p>
                <Link to={p.path} className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Learn More <FiArrowRight size={13} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, rgba(11,107,75,0.06) 0%, rgba(212,175,55,0.06) 100%)', border: '1px solid rgba(11,107,75,0.12)' }}
        >
          <div>
            <h3 className="text-xl font-black text-text mb-1">Ready to make an impact?</h3>
            <p className="text-gray-500 text-sm">Join 500+ alumni mentors who are shaping the next generation.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/mentorship" className="btn-primary">
              Find a Mentor <FiArrowRight size={15} />
            </Link>
            <Link
              to="/mentorship"
              className="px-5 py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-300"
            >
              Become a Mentor
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MentorshipBanner;
