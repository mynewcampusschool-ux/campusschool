import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiAward, FiZap, FiTarget } from 'react-icons/fi';
import type { ProfileData } from '../../../types/profile';

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
    <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2">{icon}{title}</h3>
    {children}
  </div>
);

const DashCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className={`rounded-2xl p-3 border ${color} flex flex-col gap-2 hover:-translate-y-1 transition-transform cursor-default`}>
    <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">{icon}</div>
    <div>
      <p className="text-xs opacity-70 font-medium leading-tight break-words">{label}</p>
      <p className="font-black text-sm leading-tight break-words">{value}</p>
    </div>
  </div>
);

const Empty: React.FC<{ msg: string }> = ({ msg }) => (
  <p className="text-gray-400 text-sm text-center py-6 italic">{msg}</p>
);

const OverviewTab: React.FC<{ profile: ProfileData }> = ({ profile }) => {
  const { role } = profile;

  const dashCards = () => {
    if (role === 'alumni') return [
      { icon: <FiTrendingUp size={18} className="text-emerald-600" />, label: 'Career Growth',  value: 'Active',   color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
      { icon: <FiUsers      size={18} className="text-blue-600"    />, label: 'Connections',   value: String(profile.connections ?? 0), color: 'bg-blue-50 border-blue-200 text-blue-800' },
      { icon: <FiCalendar   size={18} className="text-purple-600"  />, label: 'Events Joined', value: String(profile.eventsJoined ?? 0), color: 'bg-purple-50 border-purple-200 text-purple-800' },
      { icon: <FiBriefcase  size={18} className="text-orange-600"  />, label: 'Jobs',          value: 'Browse',   color: 'bg-orange-50 border-orange-200 text-orange-800' },
      { icon: <FiZap        size={18} className="text-teal-600"    />, label: 'Mentorship',    value: 'Explore',  color: 'bg-teal-50 border-teal-200 text-teal-800' },
      { icon: <FiAward      size={18} className="text-amber-600"   />, label: 'Achievements',  value: String(profile.achievements ?? 0), color: 'bg-amber-50 border-amber-200 text-amber-800' },
    ];
    if (role === 'student') return [
      { icon: <FiBriefcase  size={18} className="text-blue-600"    />, label: 'Internships',   value: 'Browse',  color: 'bg-blue-50 border-blue-200 text-blue-800' },
      { icon: <FiAward      size={18} className="text-amber-600"   />, label: 'Scholarships',  value: 'Apply',   color: 'bg-amber-50 border-amber-200 text-amber-800' },
      { icon: <FiUsers      size={18} className="text-teal-600"    />, label: 'Mentors',       value: 'Find',    color: 'bg-teal-50 border-teal-200 text-teal-800' },
      { icon: <FiTrendingUp size={18} className="text-emerald-600" />, label: 'Placement',     value: 'Track',   color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
      { icon: <FiBookOpen   size={18} className="text-purple-600"  />, label: 'Courses',       value: 'Enroll',  color: 'bg-purple-50 border-purple-200 text-purple-800' },
      { icon: <FiCalendar   size={18} className="text-orange-600"  />, label: 'Events',        value: 'Join',    color: 'bg-orange-50 border-orange-200 text-orange-800' },
    ];
    if (role === 'teacher') return [
      { icon: <FiUsers    size={18} className="text-blue-600"   />, label: 'Students',      value: 'Manage',  color: 'bg-blue-50 border-blue-200 text-blue-800' },
      { icon: <FiBookOpen size={18} className="text-purple-600" />, label: 'Research',      value: 'Publish', color: 'bg-purple-50 border-purple-200 text-purple-800' },
      { icon: <FiCalendar size={18} className="text-teal-600"   />, label: 'Events',        value: 'Create',  color: 'bg-teal-50 border-teal-200 text-teal-800' },
      { icon: <FiZap      size={18} className="text-amber-600"  />, label: 'Announcements', value: 'Post',    color: 'bg-amber-50 border-amber-200 text-amber-800' },
    ];
    if (role === 'recruiter' || role === 'hr') return [
      { icon: <FiBriefcase  size={18} className="text-blue-600"    />, label: 'Post Jobs',    value: 'Create',  color: 'bg-blue-50 border-blue-200 text-blue-800' },
      { icon: <FiUsers      size={18} className="text-emerald-600" />, label: 'Applications', value: 'Review',  color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
      { icon: <FiTrendingUp size={18} className="text-purple-600"  />, label: 'Hire Alumni',  value: 'Browse',  color: 'bg-purple-50 border-purple-200 text-purple-800' },
    ];
    if (role === 'admin' || role === 'super_admin') return [
      { icon: <FiTrendingUp size={18} className="text-red-600"  />, label: 'Dashboard', value: 'Open',   color: 'bg-red-50 border-red-200 text-red-800' },
      { icon: <FiUsers      size={18} className="text-blue-600" />, label: 'Users',     value: 'Manage', color: 'bg-blue-50 border-blue-200 text-blue-800' },
      { icon: <FiZap        size={18} className="text-amber-600"/>, label: 'Reports',   value: 'View',   color: 'bg-amber-50 border-amber-200 text-amber-800' },
    ];
    return [];
  };

  const cards = dashCards();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {cards.length > 0 && (
        <InfoCard icon={<FiZap size={15} className="text-primary" />} title="Quick Dashboard">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {cards.map((c, i) => <DashCard key={i} {...c} />)}
          </div>
        </InfoCard>
      )}

      <InfoCard icon={<FiBookOpen size={15} className="text-primary" />} title="About Me">
        {profile.bio
          ? <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
          : <Empty msg="No bio added yet. Click Edit to add your bio." />}
      </InfoCard>

      {(profile.objective || role === 'student') && (
        <InfoCard icon={<FiTarget size={15} className="text-primary" />} title="Career Objective">
          {profile.objective
            ? <p className="text-gray-600 text-sm leading-relaxed">{profile.objective}</p>
            : <Empty msg="No career objective added yet." />}
        </InfoCard>
      )}

      {(profile.skills?.length ?? 0) > 0 && (
        <InfoCard icon={<FiZap size={15} className="text-primary" />} title="Top Skills">
          <div className="flex flex-wrap gap-2">
            {profile.skills!.slice(0, 10).map(s => (
              <span key={s.id} className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-xl font-medium">{s.name}</span>
            ))}
          </div>
        </InfoCard>
      )}

      {(profile.education?.length ?? 0) > 0 && (
        <InfoCard icon={<FiBookOpen size={15} className="text-primary" />} title="Education">
          <div className="space-y-3">
            {profile.education!.slice(0, 2).map(e => (
              <div key={e.id} className="flex gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBookOpen size={15} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-text text-sm">{e.institution}</p>
                  <p className="text-xs text-gray-500">{[e.degree, e.course].filter(Boolean).join(' · ')}</p>
                  <p className="text-xs text-gray-400">{e.startYear}{e.endYear ? ` – ${e.endYear}` : ' – Present'}</p>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      )}
    </motion.div>
  );
};

export default memo(OverviewTab);
