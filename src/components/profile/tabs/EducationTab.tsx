import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiPlus, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import type { Education } from '../../../types/profile';
import ProfileModal from '../ProfileModal';

const BLANK: Omit<Education, 'id'> = { institution: '', degree: '', course: '', startYear: '', endYear: '', cgpa: '' };

interface Props { items: Education[]; onAdd: (e: Education) => void; onRemove: (id: string) => void; }

const EducationTab: React.FC<Props> = ({ items, onAdd, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Education, 'id'>>(BLANK);
  const set = (k: keyof typeof BLANK) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.institution) return;
    onAdd({ ...form, id: Date.now().toString() });
    setForm(BLANK);
    setOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-text text-sm flex items-center gap-2"><FiBookOpen size={15} className="text-primary" /> Education</h3>
          <button onClick={() => setOpen(true)} className="btn-primary text-xs py-2 px-3 gap-1"><FiPlus size={13} /> Add</button>
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <FiBookOpen size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No education added yet.</p>
            <button onClick={() => setOpen(true)} className="mt-3 text-primary text-xs font-semibold hover:underline">+ Add education</button>
          </div>
        )}

        <div className="space-y-4">
          {items.map((edu, i) => (
            <div key={edu.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBookOpen size={16} className="text-accent-dark" />
                </div>
                {i < items.length - 1 && <div className="w-px flex-1 bg-border/60 mt-2" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-text text-sm">{edu.institution}</h4>
                    {(edu.degree || edu.course) && (
                      <p className="text-primary text-xs font-semibold mt-0.5">{[edu.degree, edu.course].filter(Boolean).join(' · ')}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-gray-400 text-xs">{edu.startYear} – {edu.endYear || 'Present'}</span>
                      {edu.cgpa && <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">CGPA: {edu.cgpa}</span>}
                    </div>
                  </div>
                  <button onClick={() => onRemove(edu.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all flex-shrink-0 p-1">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProfileModal open={open} onClose={() => setOpen(false)} title="Add Education">
        <div className="space-y-3">
          {([['institution','Institution','e.g. Campus School Pantnagar'],['degree','Degree','e.g. B.Tech'],['course','Course / Stream','e.g. Computer Science'],['cgpa','CGPA / Percentage','e.g. 8.5']] as const).map(([k, lbl, ph]) => (
            <div key={k}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{lbl}</label>
              <input value={(form as Record<string,string>)[k] ?? ''} onChange={e => set(k as keyof typeof BLANK)(e.target.value)} placeholder={ph}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            {(['startYear','endYear'] as const).map(k => (
              <div key={k}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{k === 'startYear' ? 'Start Year' : 'End Year'}</label>
                <input type="number" min="1990" max="2040" value={form[k] ?? ''} onChange={e => set(k)(e.target.value)} placeholder="YYYY"
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
              </div>
            ))}
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

export default memo(EducationTab);
