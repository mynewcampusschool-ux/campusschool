import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';

const EmptyState: React.FC<{ icon: React.ReactNode; msg: string }> = ({ icon, msg }) => (
  <div className="text-center py-10">
    <div className="text-gray-200 mx-auto mb-3 flex justify-center">{icon}</div>
    <p className="text-gray-400 text-sm">{msg}</p>
  </div>
);

const EventsTab: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
    <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiCalendar size={15} className="text-primary" /> Upcoming Events</h3>
      <EmptyState icon={<FiCalendar size={36} />} msg="No upcoming events. Browse events to register." />
    </div>
    <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiClock size={15} className="text-primary" /> Registered Events</h3>
      <EmptyState icon={<FiClock size={36} />} msg="You haven't registered for any events yet." />
    </div>
    <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiCheckCircle size={15} className="text-primary" /> Past Events</h3>
      <EmptyState icon={<FiCheckCircle size={36} />} msg="No past events to show." />
    </div>
  </motion.div>
);

export default memo(EventsTab);
