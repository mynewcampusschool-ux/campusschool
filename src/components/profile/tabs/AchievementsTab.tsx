import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiPlus, FiTrash2, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import type { Achievement } from '../../../types/profile';
import ProfileModal from '../ProfileModal';

const TYPE_COLORS: Record<string, string> = {
  award:        'bg-amber-100 text-amber-700',
  certification:'bg-blue-100 text-blue-700',
  patent:       'bg-purple-100 text-purple-700',
  research:     'bg-teal-100 text-teal-700',
  competition:  'bg-orange-100 text-orange-700',
  sports:       'bg-emerald-100 text-emerald-700',
  other:        'bg-gray-100 text-gray-600',
};

const BLANK: Omit<Achievement, 'id'> = { title: '', org: '', year: '', desc: '', type: 'award' };

interface Props {
  items: Achievement[];
  onAdd: (a: Achievement) => void;
  onRemove: (id: string) => void;
  onUpdate: (a: Achievement) => void;
}

const AchievementsTab: React.FC<Props> = ({ items, onAdd, onRemove, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Achievement, 'id'>>(BLANK);
  const [editId, setEditId] = useState<string | null>(null);

  const openAdd = () => { setForm(BLANK); setEditId(null); setOpen(true); };
  const openEdit = (a: Achievement) => { setForm({ title: a.title, org: a.org, year: a.year, desc: a.desc, type: a.type }); setEditId(a.id); setOpen(true); };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editId) onUpdate({ ...form, id: editId });
    else onAdd({ ...form, id: Date.now().toString() });
    setOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-text text-sm flex items-center gap-2"><FiAward size={15} className="text-primary" /> Achievements & Awards</h3>
          <button onClick={openAdd} className="btn-primary text-xs py-2 px-3 gap-1"><FiPlus size={13} /> Add</button>
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <FiAward size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No achievements added yet.</p>
            <button onClick={openAdd} className="mt-3 text-primary text-xs font-semibold hover:underline">+ Add your first achievement</button>
          </div>
        )}

        <div className="space-y-4">
          {items.map(a => (
            <div key={a.id} className="flex gap-4 p-4 bg-secondary rounded-2xl border border-border/40 group">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiAward size={18} className="text-accent-dark" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-text text-sm">{a.title}</h4>
                    <p className="text-primary text-xs font-semibold mt-0.5">{a.org}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[a.type] ?? TYPE_COLORS.other}`}>{a.type}</span>
                      <span className="text-gray-400 text-xs">{a.year}</span>
                    </div>
                    {a.desc && <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{a.desc}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                    <button onClick={() => openEdit(a)} className="text-gray-400 hover:text-primary transition-colors p-1"><FiEdit2 size={13} /></button>
                    <button onClick={() => onRemove(a.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><FiTrash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProfileModal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit Achievement' : 'Add Achievement'}>
        <div className="space-y-3">
          {([['title','Title','e.g. Best Student Award'],['org','Organisation','e.g. Campus School Pantnagar'],['year','Year','e.g. 2015']] as const).map(([k, lbl, ph]) => (
            <div key={k}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{lbl}</label>
              <input value={(form as Record<string,string>)[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as Achievement['type'] }))}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all">
              {(['award','certification','patent','research','competition','sports','other'] as const).map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea value={form.desc ?? ''} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} rows={3} placeholder="Brief description..."
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

export default memo(AchievementsTab);
