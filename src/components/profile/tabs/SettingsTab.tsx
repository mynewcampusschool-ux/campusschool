import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiLock, FiBell, FiShield, FiTrash2, FiEye, FiEyeOff, FiSave } from 'react-icons/fi';
import type { ProfileData } from '../../../types/profile';

interface Props { profile: ProfileData; onUpdate: (p: Partial<ProfileData>) => void; }

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
    <h3 className="font-bold text-text text-sm mb-4 flex items-center gap-2">{icon}{title}</h3>
    {children}
  </div>
);

const Toggle: React.FC<{ label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
    <div>
      <p className="text-sm font-semibold text-text">{label}</p>
      {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const SettingsTab: React.FC<Props> = ({ profile, onUpdate }) => {
  const [showPwd, setShowPwd] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, jobs: true, events: true, connections: true });
  const [privacy, setPrivacy] = useState({ profilePublic: true, showEmail: false, showPhone: false, showConnections: true });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Section icon={<FiSettings size={15} className="text-primary" />} title="Profile Settings">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Display Name</label>
            <input defaultValue={profile.name} onBlur={e => onUpdate({ name: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Availability Status</label>
            <select defaultValue={profile.availability ?? ''} onChange={e => onUpdate({ availability: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all">
              <option value="">Select status</option>
              <option value="Open to work">Open to work</option>
              <option value="Open to mentoring">Open to mentoring</option>
              <option value="Hiring">Hiring</option>
              <option value="Not available">Not available</option>
            </select>
          </div>
          <button className="btn-primary text-sm py-2.5 px-5 gap-2"><FiSave size={14} /> Save Settings</button>
        </div>
      </Section>

      <Section icon={<FiEye size={15} className="text-primary" />} title="Privacy">
        <Toggle label="Public Profile" desc="Allow anyone to view your profile" checked={privacy.profilePublic} onChange={v => setPrivacy(p => ({ ...p, profilePublic: v }))} />
        <Toggle label="Show Email" desc="Display email on your profile" checked={privacy.showEmail} onChange={v => setPrivacy(p => ({ ...p, showEmail: v }))} />
        <Toggle label="Show Phone" desc="Display phone number on your profile" checked={privacy.showPhone} onChange={v => setPrivacy(p => ({ ...p, showPhone: v }))} />
        <Toggle label="Show Connections" desc="Display your connection count" checked={privacy.showConnections} onChange={v => setPrivacy(p => ({ ...p, showConnections: v }))} />
      </Section>

      <Section icon={<FiLock size={15} className="text-primary" />} title="Security & Password">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Current Password</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all pr-10" />
              <button onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
            <input type="password" placeholder="••••••••"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
          </div>
          <button className="btn-primary text-sm py-2.5 px-5 gap-2"><FiShield size={14} /> Update Password</button>
        </div>
      </Section>

      <Section icon={<FiBell size={15} className="text-primary" />} title="Notification Preferences">
        <Toggle label="Email Notifications" desc="Receive updates via email" checked={notifications.email} onChange={v => setNotifications(p => ({ ...p, email: v }))} />
        <Toggle label="Push Notifications" desc="Browser push notifications" checked={notifications.push} onChange={v => setNotifications(p => ({ ...p, push: v }))} />
        <Toggle label="Job Alerts" desc="Get notified about new job postings" checked={notifications.jobs} onChange={v => setNotifications(p => ({ ...p, jobs: v }))} />
        <Toggle label="Event Reminders" desc="Reminders for upcoming events" checked={notifications.events} onChange={v => setNotifications(p => ({ ...p, events: v }))} />
        <Toggle label="Connection Requests" desc="Notify when someone connects" checked={notifications.connections} onChange={v => setNotifications(p => ({ ...p, connections: v }))} />
      </Section>

      <Section icon={<FiTrash2 size={15} className="text-red-500" />} title="Danger Zone">
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <p className="text-sm font-semibold text-red-700 mb-1">Delete Account</p>
          <p className="text-xs text-red-500 mb-3">This action is permanent and cannot be undone. All your data will be deleted.</p>
          <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <FiTrash2 size={13} /> Delete My Account
          </button>
        </div>
      </Section>
    </motion.div>
  );
};

export default memo(SettingsTab);
