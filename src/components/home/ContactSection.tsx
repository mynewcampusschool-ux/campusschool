import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const contactInfo = [
  {
    icon: FiMapPin,
    label: 'Address',
    value: 'Campus School Pantnagar, Udham Singh Nagar, Uttarakhand – 263145',
  },
  {
    icon: FiPhone,
    label: 'Phone',
    value: '+91-5944-233530',
    href: 'tel:+915944233530',
  },
  {
    icon: FiMail,
    label: 'Email',
    value: 'campusschoolpantnagar@gmail.com',
    href: 'mailto:campusschoolpantnagar@gmail.com',
  },
  {
    icon: FiClock,
    label: 'Office Hours',
    value: 'Mon – Sat: 9:00 AM – 5:00 PM',
  },
];

const socials = [
  { icon: FaFacebookF, href: 'https://www.facebook.com/Campusalumni/', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://www.instagram.com/campusschoolpantnagaralumn', label: 'Instagram' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { icon: FaYoutube, href: 'https://www.youtube.com/channel/UCgPKP8cmNPq_lSevfihUrCQ', label: 'YouTube' },
];

const ContactSection: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section ref={ref} className="py-20 px-4" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
          <h2 className="section-title mt-2">Contact Us</h2>
          <p className="section-subtitle">We'd love to hear from you. Reach out anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-5 mb-8">
              {contactInfo.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-card border border-border/50"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-primary" size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="text-text text-sm font-medium hover:text-primary transition-colors">
                          {c.value}
                        </a>
                      ) : (
                        <p className="text-text text-sm font-medium">{c.value}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Social */}
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-4">Follow Us On Social Media</p>
              <div className="flex gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-white rounded-xl shadow-card border border-border/50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                      title={s.label}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Form side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-white rounded-2xl shadow-card border border-border/50 p-8">
              <h3 className="font-black text-text text-xl mb-6">Send Us a Message</h3>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 contact-form-grid">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-3.5">
                  <FiSend size={16} /> Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
