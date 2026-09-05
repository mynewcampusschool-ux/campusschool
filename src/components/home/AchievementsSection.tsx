import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const achievements = [
  { icon: '🏆', value: '#1', label: 'Top School', sub: 'Uttarakhand 2024' },
  { icon: '🎓', value: '25+', label: 'Years of Excellence', sub: 'Est. 1972' },
  { icon: '🌍', value: '10+', label: 'Countries', sub: 'Alumni Presence' },
  { icon: '🏅', value: '10+', label: 'National Awards', sub: 'Academic & Sports' },
  { icon: '💼', value: '55+', label: 'Companies', sub: 'Alumni Employed' },
  { icon: '📚', value: '1,000+', label: 'Students', sub: 'Currently Enrolled' },
];

const AchievementsSection: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-16 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 50%, #0B5D3B 100%)' }}
    >
      {/* Decorative */}
      <div
        className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-10"
        style={{ background: '#D4AF37', transform: 'translate(-40%, -40%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10"
        style={{ background: '#ffffff', transform: 'translate(30%, 30%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Our Milestones</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2">
            A Legacy of Achievements
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center p-5 rounded-2xl hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="text-accent font-black text-2xl leading-none mb-1">{a.value}</div>
              <div className="text-white font-bold text-xs mb-0.5">{a.label}</div>
              <div className="text-white/50 text-xs">{a.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
