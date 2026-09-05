import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiStar, FiBookOpen, FiCalendar } from 'react-icons/fi';

const EmptyState: React.FC<{ icon: React.ReactNode; msg: string }> = ({ icon, msg }) => (
  <div className="text-center py-10">
    <div className="text-gray-200 mx-auto mb-3 flex justify-center">{icon}</div>
    <p className="text-gray-400 text-sm">{msg}</p>
  </div>
);

const MentorshipTab: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
    <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiUsers size={15} className="text-primary" /> My Mentors</h3>
      <EmptyState icon={<FiUsers size={36} />} msg="No mentors connected yet. Find a mentor to guide your career." />
    </div>
    <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiBookOpen size={15} className="text-primary" /> My Mentees</h3>
      <EmptyState icon={<FiBookOpen size={36} />} msg="No mentees yet. Share your expertise with students." />
    </div>
    <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiCalendar size={15} className="text-primary" /> Booked Sessions</h3>
      <EmptyState icon={<FiCalendar size={36} />} msg="No sessions booked yet." />
    </div>
    <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiStar size={15} className="text-primary" /> Reviews</h3>
      <EmptyState icon={<FiStar size={36} />} msg="No reviews yet." />
    </div>
  </motion.div>
);

export default memo(MentorshipTab);
