import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMapPin, FiBriefcase, FiUsers, FiShare2, FiGrid, FiUser, FiArrowRight } from 'react-icons/fi';

const features = [
  {
    icon: FiMapPin,
    title: 'Members in Your City',
    desc: 'Find alumni living in your city and connect with them',
    path: '/directory',
    color: 'from-primary/10 to-primary/5',
  },
  {
    icon: FiBriefcase,
    title: 'Career Opportunities',
    desc: 'Find and share career opportunities within the community',
    path: '/jobs',
    color: 'from-accent/10 to-accent/5',
  },
  {
    icon: FiUsers,
    title: 'Find a Mentor',
    desc: 'Connect with experienced alumni who can guide your journey',
    path: '/mentorship',
    color: 'from-blue-500/10 to-blue-500/5',
  },
  {
    icon: FiShare2,
    title: 'Networking',
    desc: 'Expand your professional network and create meaningful connections',
    path: '/networking',
    color: 'from-purple-500/10 to-purple-500/5',
  },
  {
    icon: FiGrid,
    title: 'Business Directory',
    desc: 'Discover businesses owned and managed by our alumni',
    path: '/directory/business',
    color: 'from-orange-500/10 to-orange-500/5',
  },
  {
    icon: FiUser,
    title: 'Your Profile',
    desc: 'Create & complete your profile and stay updated',
    path: '/profile',
    color: 'from-green-500/10 to-green-500/5',
  },
];

const FeatureCards: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 feature-mobile-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={f.path}
                  className="group block bg-white rounded-xl border border-border/50 shadow-card p-4 lg:p-6 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 h-full"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="font-bold text-text text-sm mb-2 leading-snug">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{f.desc}</p>
                  <div className="w-8 h-8 rounded-full border-2 border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <FiArrowRight size={14} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
