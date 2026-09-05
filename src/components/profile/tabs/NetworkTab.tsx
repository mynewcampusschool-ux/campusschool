import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserPlus, FiUserCheck } from 'react-icons/fi';
import type { ProfileData } from '../../../types/profile';

interface Props { profile: ProfileData; }

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string }> = ({ icon, label, value, color }) => (
  <div className={`rounded-2xl p-4 border flex items-center gap-3 ${color}`}>
    <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">{icon}</div>
    <div>
      <p className="font-black text-xl leading-none">{value}</p>
      <p className="text-xs opacity-70 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

const EmptyState: React.FC<{ icon: React.ReactNode; msg: string }> = ({ icon, msg }) => (
  <div className="text-center py-10">
    <div className="text-gray-200 mx-auto mb-3 flex justify-center">{icon}</div>
    <p className="text-gray-400 text-sm">{msg}</p>
  </div>
);

const NetworkTab: React.FC<Props> = ({ profile }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
    <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiUsers size={15} className="text-primary" /> Network Overview</h3>
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<FiUsers size={18} className="text-blue-600" />} label="Connections" value={profile.connections ?? 0} color="bg-blue-50 border-blue-200 text-blue-800" />
        <StatCard icon={<FiUserCheck size={18} className="text-emerald-600" />} label="Followers" value={profile.followers ?? 0} color="bg-emerald-50 border-emerald-200 text-emerald-800" />
        <StatCard icon={<FiUserPlus size={18} className="text-purple-600" />} label="Following" value={profile.following ?? 0} color="bg-purple-50 border-purple-200 text-purple-800" />
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiUserPlus size={15} className="text-primary" /> Suggested Connections</h3>
      <EmptyState icon={<FiUsers size={36} />} msg="Suggested connections will appear here based on your profile and network." />
    </div>
    <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2"><FiUsers size={15} className="text-primary" /> People You May Know</h3>
      <EmptyState icon={<FiUsers size={36} />} msg="Connect with more alumni to see recommendations." />
    </div>
  </motion.div>
);

export default memo(NetworkTab);
