import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiClock, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { useCMS } from '../context/CMSContext';
import { useLocation, useNavigate } from 'react-router-dom';

const pastEvents = [
  { id: 'p1', title: 'Alumni Reunion 2024', date: '15', month: 'DEC', time: '10:00 AM - 04:00 PM', location: 'Main Auditorium', type: 'past', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', description: 'Annual alumni reunion with 500+ attendees.' },
  { id: 'p2', title: 'Career Fair 2024', date: '20', month: 'NOV', time: '09:00 AM - 05:00 PM', location: 'School Ground', type: 'past', image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80', description: 'Career fair with 50+ companies.' },
  { id: 'p3', title: 'Science Exhibition 2024', date: '10', month: 'OCT', time: '10:00 AM - 03:00 PM', location: 'Science Block', type: 'past', image: 'https://images.unsplash.com/photo-1532094349884-543559c5f7f7?w=600&q=80', description: 'Annual science exhibition showcasing student projects.' },
  { id: 'p4', title: 'Foundation Day 2024', date: '25', month: 'APR', time: '09:00 AM - 01:00 PM', location: 'Main Auditorium', type: 'past', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', description: 'Celebration of Campus School Pantnagar Foundation Day.' },
];

const EventsPage: React.FC = () => {
  const { cms } = useCMS();
  const EVENTS = cms.events.filter(e => e.enabled);
  const location = useLocation();
  const navigate = useNavigate();
  const getTab = () => location.pathname.includes('past') ? 'past' : location.pathname.includes('gallery') ? 'gallery' : 'upcoming';
  const [tab, setTab] = useState<'upcoming' | 'past' | 'gallery'>(getTab);

  useEffect(() => { setTab(getTab()); }, [location.pathname]);
  const [registered, setRegistered] = useState<string | null>(null);

  const navigateTab = (t: 'upcoming' | 'past' | 'gallery') => {
    setTab(t);
    if (t === 'gallery') navigate('/events/gallery');
    else if (t === 'past') navigate('/events/past');
    else navigate('/events');
  };
  void navigateTab;

  const handleRegister = (_id: string | number, title: string) => {
    setRegistered(title);
    setTimeout(() => setRegistered(null), 3000);
  };

  return (
    <>
      <Helmet><title>Events | Campus School Pantnagar Alumni Portal</title></Helmet>
      <div className="py-16 px-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Community</span>
          <h1 className="text-4xl font-black mt-2 mb-3">Events</h1>
          <p className="text-white">Stay connected through our events and gatherings</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Success toast */}
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

        {/* Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(tab === 'upcoming' ? EVENTS : pastEvents).map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-card border border-border/50 overflow-hidden hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <div className="bg-primary text-white rounded-xl overflow-hidden text-center w-14">
                    <div className="bg-primary-dark text-xs font-bold py-1">{event.month}</div>
                    <div className="text-2xl font-black py-1">{event.date}</div>
                  </div>
                </div>
                {tab === 'upcoming' && (
                  <div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-lg">Upcoming</div>
                )}
                {tab === 'past' && (
                  <div className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">Past</div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-text text-base mb-3">{event.title}</h3>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs"><FiMapPin size={12} className="text-primary" /> {event.location}</div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs"><FiClock size={12} className="text-primary" /> {event.time}</div>
                </div>
                <p className="text-gray-500 text-xs mb-4">{event.description}</p>
                {tab === 'upcoming' && (
                  <button
                    onClick={() => handleRegister(String(event.id), event.title)}
                    className="w-full btn-primary text-xs py-2.5 justify-center"
                  >
                    <FiUsers size={13} /> Register Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EventsPage;
