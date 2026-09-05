import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const items = [
  {
    icon: '🎯',
    label: 'Our Mission',
    color: '#0B6B4B',
    bg: 'rgba(11,107,75,0.06)',
    border: 'rgba(11,107,75,0.15)',
    heading: 'Reconnect. Empower. Inspire.',
    body: 'To build a thriving alumni ecosystem that reconnects graduates, fosters meaningful relationships, and creates life-changing opportunities — rooted in the values of Campus School Pantnagar.',
  },
  {
    icon: '🌟',
    label: 'Our Vision',
    color: '#D4AF37',
    bg: 'rgba(212,175,55,0.06)',
    border: 'rgba(212,175,55,0.20)',
    heading: 'A Global Legacy of Excellence',
    body: 'To become the most engaged and impactful alumni network in Uttarakhand — empowering every graduate to achieve their full potential and give back to the community that shaped them.',
  },
  {
    icon: '💎',
    label: 'Our Values',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.06)',
    border: 'rgba(59,130,246,0.15)',
    heading: 'Excellence, Integrity & Service',
    body: 'The same values instilled in every student for over 50 years — academic excellence, personal integrity, community service, and the enduring spirit of "Glory To God and Service To All."',
  },
];

const VisionMissionSection: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #F8FAFC 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Our Foundation</span>
          <h2 className="section-title mt-2">Vision, Mission & Values</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            The principles that have guided Campus School Pantnagar for over five decades — and continue to inspire our alumni worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300"
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                boxShadow: `0 4px 24px 0 ${item.border}`,
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
                style={{ background: item.color }}
              />

              <div className="text-5xl mb-5">{item.icon}</div>

              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: item.color, color: '#ffffff' }}
              >
                {item.label}
              </span>

              <h3
                className="font-black text-xl mb-4 leading-tight"
                style={{ color: item.color }}
              >
                {item.heading}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Motto banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 rounded-2xl p-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: '#D4AF37', transform: 'translate(30%, -30%)' }}
          />
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-2">School Motto</p>
          <h3 className="text-white font-black text-2xl md:text-3xl">
            "Glory To God and Service To All"
          </h3>
          <p className="text-white/70 text-sm mt-3">
            — The guiding principle of Campus School Pantnagar since 1972
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
