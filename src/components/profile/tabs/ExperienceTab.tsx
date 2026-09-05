import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiPlus, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import type { Experience } from '../../../types/profile';
import ProfileModal from '../ProfileModal';

const TYPE_COLORS: Record<string, string> = {
  'full-time':  'bg-emerald-100 text-emerald-700',
  'part-time':  'bg-blue-100 text-blue-700',
  'internship': 'bg-purple-100 text-purple-700',
  'freelance':  'bg-orange-100 text-orange-700',
  'contract':   'bg-amber-100 text-amber-700',
};

const BLANK: Omit<Experience, 'id'> = { role: '', company: '', type: 'full-time', startDate: '', endDate: '', current: false, location: '', description: '' };

interface Props { items: Experience[]; onAdd: (e: Experience) => void; onRemove: (id: string) => void; }

const ExperienceTab: React.FC<Props> = ({ items, onAdd, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Experience, 'id'>>(BLANK);
  const set = (k: keyof typeof BLANK) => (v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.role || !form.company) return;
    onAdd({ ...form, id: Date.now().toString() });
    setForm(BLANK);
    setOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-text text-sm flex items-center gap-2"><FiBriefcase size={15} className="text-primary" /> Work Experience</h3>
          <button onClick={() => setOpen(true)} className="btn-primary text-xs py-2 px-3 gap-1"><FiPlus size={13} /> Add</button>
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <FiBriefcase size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No experience added yet.</p>
            <button onClick={() => setOpen(true)} className="mt-3 text-primary text-xs font-semibold hover:underline">+ Add your first experience</button>
          </div>
        )}

        <div className="space-y-5">
          {items.map((exp, i) => (
            <div key={exp.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBriefcase size={16} className="text-primary" />
                </div>
                {i < items.length - 1 && <div className="w-px flex-1 bg-border/60 mt-2" />}
              </div>
              <div className="flex-1 pb-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-text text-sm">{exp.role}</h4>
                    <p className="text-primary text-xs font-semibold mt-0.5">{exp.company}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[exp.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {exp.type.replace('-', ' ')}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {exp.startDate} – {exp.current ? 'Present' : (exp.endDate || '—')}
                      </span>
                      {exp.location && <span className="text-gray-400 text-xs">{exp.location}</span>}
                    </div>
                    {exp.description && <p className="text-gray-500 text-xs mt-2 leading-relaxed">{exp.description}</p>}
                  </div>
                  <button onClick={() => onRemove(exp.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all flex-shrink-0 p-1">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProfileModal open={open} onClose={() => setOpen(false)} title="Add Experience">
        <div className="space-y-3">
          {([['role','Job Title','e.g. Software Engineer'],['company','Company','e.g. TechCorp India'],['location','Location','e.g. Dehradun, India']] as const).map(([k, lbl, ph]) => (
            <div key={k}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{lbl}</label>
              <input value={(form as unknown as Record<string,string>)[k]} onChange={e => set(k as keyof typeof BLANK)(e.target.value)} placeholder={ph}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Employment Type</label>
            <select value={form.type} onChange={e => set('type')(e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all">
              {['full-time','part-time','internship','freelance','contract'].map(t => (
                <option key={t} value={t}>{t.replace('-',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
              <input type="month" value={form.startDate} onChange={e => set('startDate')(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
              <input type="month" value={form.endDate ?? ''} onChange={e => set('endDate')(e.target.value)} disabled={form.current}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all disabled:opacity-40" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={form.current} onChange={e => set('current')(e.target.checked)} className="rounded" />
            Currently working here
          </label>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea value={form.description ?? ''} onChange={e => set('description')(e.target.value)} rows={3} placeholder="Describe your responsibilities..."
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"><FiX size={14} /> Cancel</button>
            <button onClick={handleSave} className="btn-primary text-sm py-2.5 px-5 gap-2"><FiSave size={14} /> Save</button>
          </div>
        </div>
      </ProfileModal>
    </motion.div>
  );
};

export default memo(ExperienceTab);
