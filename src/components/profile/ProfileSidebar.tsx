import React, { memo } from 'react';
import { FiLinkedin, FiGithub, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiGlobe, FiExternalLink } from 'react-icons/fi';
import type { ProfileData } from '../../types/profile';
import CompletionRing from './CompletionRing';

interface Props { profile: ProfileData; completion: number; }

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin:  <FiLinkedin  size={15} className="text-blue-600" />,
  github:    <FiGithub    size={15} className="text-gray-800" />,
  facebook:  <FiFacebook  size={15} className="text-blue-500" />,
  instagram: <FiInstagram size={15} className="text-pink-500" />,
  twitter:   <FiTwitter   size={15} className="text-sky-500"  />,
  youtube:   <FiYoutube   size={15} className="text-red-500"  />,
  website:   <FiGlobe     size={15} className="text-primary"  />,
  portfolio: <FiExternalLink size={15} className="text-accent" />,
};

const COMPLETION_TIPS: Record<number, string> = {
  0:  'Add your bio to get started.',
  25: 'Add your work experience.',
  50: 'Add your skills and education.',
  75: 'Add social links and projects.',
  100:'Your profile is complete! 🎉',
};

function getTip(pct: number) {
  const keys = Object.keys(COMPLETION_TIPS).map(Number).sort((a, b) => b - a);
  return COMPLETION_TIPS[keys.find(k => pct >= k) ?? 0];
}

const ProfileSidebar: React.FC<Props> = ({ profile, completion }) => {
  const links = Object.entries(profile.socialLinks ?? {}).filter(([, v]) => !!v);

  return (
    <div className="space-y-4">
      {/* Completion */}
      <div className="bg-white rounded-2xl shadow-card border border-border/50 p-5">
        <h3 className="font-bold text-text text-sm mb-4">Profile Completion</h3>
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <svg width={72} height={72} style={{ position: 'absolute', top: 0, left: 0 }}>
              <circle cx={36} cy={36} r={31} fill="none" stroke="#E5E7EB" strokeWidth={5} />
            </svg>
            <CompletionRing pct={completion} size={72} stroke={5} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-text">{completion}%</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 leading-relaxed">{getTip(completion)}</p>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full transition-all duration-700" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {links.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card border border-border/50 p-5">
          <h3 className="font-bold text-text text-sm mb-4">Social Links</h3>
          <div className="space-y-2.5">
            {links.map(([key, url]) => (
              <a
                key={key}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-primary transition-colors capitalize"
              >
                {SOCIAL_ICONS[key] ?? <FiGlobe size={15} />}
                <span className="truncate">{key}</span>
                <FiExternalLink size={10} className="ml-auto flex-shrink-0 opacity-40" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="bg-white rounded-2xl shadow-card border border-border/50 p-5">
        <h3 className="font-bold text-text text-sm mb-4">Quick Info</h3>
        <div className="space-y-2 text-xs text-gray-600">
          {profile.school     && <div className="flex justify-between"><span className="text-gray-400">School</span><span className="font-medium text-right max-w-[60%] truncate">{profile.school}</span></div>}
          {profile.batch      && <div className="flex justify-between"><span className="text-gray-400">Batch</span><span className="font-medium">{profile.batch}</span></div>}
          {profile.department && <div className="flex justify-between"><span className="text-gray-400">Dept</span><span className="font-medium text-right max-w-[60%] truncate">{profile.department}</span></div>}
          {profile.industry   && <div className="flex justify-between"><span className="text-gray-400">Industry</span><span className="font-medium text-right max-w-[60%] truncate">{profile.industry}</span></div>}
          {profile.country    && <div className="flex justify-between"><span className="text-gray-400">Country</span><span className="font-medium">{profile.country}</span></div>}
          {profile.lastActive && <div className="flex justify-between"><span className="text-gray-400">Last Active</span><span className="font-medium">{profile.lastActive}</span></div>}
        </div>
      </div>

      {/* Languages */}
      {(profile.languages?.length ?? 0) > 0 && (
        <div className="bg-white rounded-2xl shadow-card border border-border/50 p-5">
          <h3 className="font-bold text-text text-sm mb-3">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {profile.languages!.map(l => (
              <span key={l} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-lg font-medium">{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {(profile.interests?.length ?? 0) > 0 && (
        <div className="bg-white rounded-2xl shadow-card border border-border/50 p-5">
          <h3 className="font-bold text-text text-sm mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests!.map(i => (
              <span key={i} className="bg-accent/10 text-accent-dark text-xs px-2.5 py-1 rounded-lg font-medium">{i}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ProfileSidebar);
