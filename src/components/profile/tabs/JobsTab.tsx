import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiBookmark, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import type { UserRole } from '../../../types/profile';

interface Props { role: UserRole; }

const EmptyState: React.FC<{ icon: React.ReactNode; msg: string }> = ({ icon, msg }) => (
  <div className="text-center py-10">
    <div className="text-gray-200 mx-auto mb-3 flex justify-center">{icon}</div>
    <p className="text-gray-400 text-sm">{msg}</p>
  </div>
);

const JobsTab: React.FC<Props> = ({ role }) => {
  const isRecruiter = role === 'recruiter' || role === 'hr' || role === 'business_owner';

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {isRecruiter ? (
        <>
          <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
            <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiBriefcase size={15} className="text-primary" /> Posted Jobs</h3>
            <EmptyState icon={<FiBriefcase size={36} />} msg="No jobs posted yet. Post a job to find the right talent." />
          </div>
          <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
            <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiTrendingUp size={15} className="text-primary" /> Manage Applications</h3>
            <EmptyState icon={<FiTrendingUp size={36} />} msg="Applications will appear here once you post jobs." />
          </div>
        </>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
            <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiBriefcase size={15} className="text-primary" /> Applied Jobs</h3>
            <EmptyState icon={<FiBriefcase size={36} />} msg="No job applications yet. Browse jobs to apply." />
          </div>
          <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
            <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiBookmark size={15} className="text-primary" /> Saved Jobs</h3>
            <EmptyState icon={<FiBookmark size={36} />} msg="No saved jobs. Save jobs to apply later." />
          </div>
          <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
            <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiTrendingUp size={15} className="text-primary" /> Recommended Jobs</h3>
            <EmptyState icon={<FiTrendingUp size={36} />} msg="Complete your profile to get job recommendations." />
          </div>
          <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
            <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiCalendar size={15} className="text-primary" /> Interview Schedule</h3>
            <EmptyState icon={<FiCalendar size={36} />} msg="No interviews scheduled." />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default memo(JobsTab);
