import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiPlus, FiX, FiSave } from 'react-icons/fi';
import type { Skill } from '../../../types/profile';
import ProfileModal from '../ProfileModal';

const CATS = ['all','technical','soft','language','tool','framework'] as const;
type Cat = typeof CATS[number];

const CAT_COLORS: Record<string, string> = {
  technical: 'bg-blue-100 text-blue-700',
  soft:      'bg-purple-100 text-purple-700',
  language:  'bg-emerald-100 text-emerald-700',
  tool:      'bg-orange-100 text-orange-700',
  framework: 'bg-pink-100 text-pink-700',
};

const BLANK: Omit<Skill,'id'> = { name: '', level: 75, category: 'technical', endorsements: 0 };

interface Props { items: Skill[]; onAdd: (s: Skill) => void; onRemove: (id: string) => void; }

const SkillsTab: React.FC<Props> = ({ items, onAdd, onRemove }) => {
  const [filter, setFilter] = useState<Cat>('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Skill,'id'>>(BLANK);

  const visible = filter === 'all' ? items : items.filter(s => s.category === filter);

  const handleSave = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form, id: Date.now().toString() });
    setForm(BLANK);
    setOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text text-sm flex items-center gap-2"><FiZap size={15} className="text-primary" /> Skills & Expertise</h3>
          <button onClick={() => setOpen(true)} className="btn-primary text-xs py-2 px-3 gap-1"><FiPlus size={13} /> Add</button>
        </div>

        <div className="flex gap-2 flex-wrap mb-5">
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all capitalize ${filter === c ? 'bg-primary text-white' : 'bg-secondary text-gray-500 hover:bg-primary/10 hover:text-primary'}`}>
              {c}
            </button>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-10">
            <FiZap size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No skills in this category.</p>
          </div>
        )}

        <div className="space-y-4">
          {visible.map(skill => (
            <div key={skill.id} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text text-sm">{skill.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_COLORS[skill.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {skill.category}
                  </span>
                  {(skill.endorsements ?? 0) > 0 && (
                    <span className="text-xs text-gray-400">+{skill.endorsements} endorsements</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">{skill.level}%</span>
                  <button onClick={() => onRemove(skill.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                    <FiX size={13} />
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-2 rounded-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProfileModal open={open} onClose={() => setOpen(false)} title="Add Skill">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Skill Name</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. React, Python, Leadership"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Skill['category'] }))}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all">
              {(['technical','soft','language','tool','framework'] as const).map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Proficiency: {form.level}%</label>
            <input type="range" min={10} max={100} step={5} value={form.level}
              onChange={e => setForm(p => ({ ...p, level: Number(e.target.value) }))}
              className="w-full accent-primary" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} className="btn-primary text-sm py-2.5 px-5 gap-2"><FiSave size={14} /> Save</button>
          </div>
        </div>
      </ProfileModal>
    </motion.div>
  );
};

export default memo(SkillsTab);
