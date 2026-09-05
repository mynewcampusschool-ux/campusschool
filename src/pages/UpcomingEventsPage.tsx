import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiClock, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { useCMS } from '../context/CMSContext';

const UpcomingEventsPage: React.FC = () => {
  const { cms } = useCMS();
  const EVENTS = (cms.events ?? []).filter((e) => e.enabled);
  const [registered, setRegistered] = useState<string | null>(null);

  const handleRegister = (_id: string | number, title: string) => {
    setRegistered(title);
    setTimeout(() => setRegistered(null), 3000);
  };

  return (
    <>
      <Helmet><title>Upcoming Events | Campus School Pantnagar Alumni Portal</title></Helmet>

      <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Community</span>
          <h1 className="text-4xl font-black mt-2 mb-3">Upcoming Events</h1>
          <p className="text-white">Stay connected through our upcoming events and gatherings</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence>
          {registered && (
            <motion.div
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="flex items-center gap-3 bg-primary/10 border border-primary/30 text-primary rounded-xl px-5 py-3.5 mb-6 font-semibold text-sm"
            >
              <FiCheckCircle size={18} className="text-primary flex-shrink-0" />
              Successfully registered for <strong>{registered}</strong>! A confirmation will be sent to your email.
            </motion.div>
          )}
        </AnimatePresence>

        {EVENTS.length === 0 && (
          <p className="text-center text-gray-400 py-16 text-sm">No upcoming events at the moment. Check back soon!</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-card border border-border/50 overflow-hidden hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image || '/photo.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/photo.jpg'; }}
                />
                <div className="absolute top-3 left-3">
                  <div className="bg-primary text-white rounded-xl overflow-hidden text-center w-14">
                    <div className="bg-primary-dark text-xs font-bold py-1">{event.month || '—'}</div>
                    <div className="text-2xl font-black py-1">{event.date || '—'}</div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  Upcoming
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-text text-base mb-3">{event.title}</h3>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <FiMapPin size={12} className="text-primary" /> {event.location || 'TBD'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <FiClock size={12} className="text-primary" /> {event.time || 'TBD'}
                  </div>
                </div>
                <p className="text-gray-500 text-xs mb-4">{event.description}</p>
                <button
                  onClick={() => handleRegister(String(event.id), event.title)}
                  className="w-full btn-primary text-xs py-2.5 justify-center"
                >
                  <FiUsers size={13} /> Register Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UpcomingEventsPage;
