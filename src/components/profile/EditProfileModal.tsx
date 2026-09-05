import React, { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import type { ProfileData, UserRole } from '../../types/profile';
import ProfileModal from './ProfileModal';

const ROLES: UserRole[] = ['alumni','student','teacher','principal','staff','mentor','recruiter','hr','business_owner','admin','super_admin','guest'];

const Field: React.FC<{
  label: string; value: string;
  onChange: (v: string) => void;
  placeholder?: string; type?: string;
}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 transition-all"
      style={{ '--tw-ring-color': 'rgba(11,107,75,0.10)' } as React.CSSProperties}
    />
  </div>
);

interface Props { open: boolean; onClose: () => void; profile: ProfileData; onSave: (p: Partial<ProfileData>) => void; }

const EditProfileModal: React.FC<Props> = ({ open, onClose, profile, onSave }) => {
  const [form, setForm] = useState<Partial<ProfileData>>({});

  useEffect(() => { if (open) setForm({ ...profile }); }, [open, profile]);

  const set = (k: keyof ProfileData) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const setSocial = (k: string) => (v: string) =>
    setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, [k]: v } }));

  const handleSave = () => { onSave(form); onClose(); };

  return (
    <ProfileModal open={open} onClose={onClose} title="Edit Profile" maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Basic */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Basic Info</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full Name"    value={form.name ?? ''}        onChange={set('name')}        placeholder="Your full name" />
            <Field label="Phone"        value={form.phone ?? ''}       onChange={set('phone')}       placeholder="+91 9876543210" />
            <Field label="City"         value={form.city ?? ''}        onChange={set('city')}        placeholder="City" />
            <Field label="State"        value={form.state ?? ''}       onChange={set('state')}       placeholder="State" />
            <Field label="Country"      value={form.country ?? ''}     onChange={set('country')}     placeholder="Country" />
            <Field label="Website"      value={form.website ?? ''}     onChange={set('website')}     placeholder="https://yoursite.com" />
          </div>
        </div>

        {/* Role */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Role & Identity</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Role</label>
              <select
                value={form.role ?? 'alumni'}
                onChange={e => setForm(p => ({ ...p, role: e.target.value as UserRole }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
              >
                {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
              </select>
            </div>
            <Field label="Batch Year"    value={form.batch ?? ''}       onChange={set('batch')}       placeholder="e.g. 2015" />
            <Field label="School"        value={form.school ?? ''}      onChange={set('school')}      placeholder="School name" />
            <Field label="Department"    value={form.department ?? ''}  onChange={set('department')}  placeholder="Department" />
            <Field label="Alumni ID"     value={form.alumniId ?? ''}    onChange={set('alumniId')}    placeholder="ALM-XXXX" />
            <Field label="Student ID"    value={form.studentId ?? ''}   onChange={set('studentId')}   placeholder="STU-XXXX" />
            <Field label="Teacher ID"    value={form.teacherId ?? ''}   onChange={set('teacherId')}   placeholder="TCH-XXXX" />
            <Field label="Employee ID"   value={form.employeeId ?? ''}  onChange={set('employeeId')}  placeholder="EMP-XXXX" />
            <Field label="Admission No"  value={form.admissionNo ?? ''} onChange={set('admissionNo')} placeholder="ADM-XXXX" />
          </div>
        </div>

        {/* Professional */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Professional</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Designation"  value={form.designation ?? ''} onChange={set('designation')} placeholder="e.g. Software Engineer" />
            <Field label="Company"      value={form.company ?? ''}     onChange={set('company')}     placeholder="Current company" />
            <Field label="Industry"     value={form.industry ?? ''}    onChange={set('industry')}    placeholder="e.g. Technology" />
            <Field label="Availability" value={form.availability ?? ''} onChange={set('availability')} placeholder="e.g. Open to work" />
          </div>
        </div>

        {/* Bio */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">About</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Bio</label>
              <textarea
                value={form.bio ?? ''} rows={3}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="Write a short bio..."
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Career Objective</label>
              <textarea
                value={form.objective ?? ''} rows={2}
                onChange={e => setForm(p => ({ ...p, objective: e.target.value }))}
                placeholder="Your career objective..."
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Social */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Social Links</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['linkedin','github','facebook','instagram','twitter','youtube','website','portfolio'] as const).map(k => (
              <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}
                value={(form.socialLinks as Record<string,string>)?.[k] ?? ''}
                onChange={setSocial(k)} placeholder={`https://${k}.com/...`} />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <button onClick={onClose} className="px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary text-sm py-2.5 px-5 gap-2">
            <FiSave size={14} /> Save Changes
          </button>
        </div>
      </div>
    </ProfileModal>
  );
};

export default EditProfileModal;
