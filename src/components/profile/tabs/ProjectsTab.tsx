import React, { useState, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiPlus, FiTrash2, FiGithub, FiExternalLink, FiSave, FiX, FiUpload } from 'react-icons/fi';
import type { Project } from '../../../types/profile';
import ProfileModal from '../ProfileModal';

const BLANK: Omit<Project, 'id'> = { title: '', description: '', tech: [], github: '', demo: '', image: '' };

interface Props { items: Project[]; onAdd: (p: Project) => void; onRemove: (id: string) => void; }

const ProjectsTab: React.FC<Props> = ({ items, onAdd, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Project, 'id'>>(BLANK);
  const [techInput, setTechInput] = useState('');
  const imgRef = useRef<HTMLInputElement>(null);

  const handleImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) setForm(p => ({ ...p, image: ev.target!.result as string })); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.tech.includes(t)) { setForm(p => ({ ...p, tech: [...p.tech, t] })); setTechInput(''); }
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    onAdd({ ...form, id: Date.now().toString() });
    setForm(BLANK); setTechInput(''); setOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white rounded-2xl shadow-card border border-border/50 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-text text-sm flex items-center gap-2"><FiCode size={15} className="text-primary" /> Projects</h3>
          <button onClick={() => setOpen(true)} className="btn-primary text-xs py-2 px-3 gap-1"><FiPlus size={13} /> Add</button>
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <FiCode size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No projects added yet.</p>
            <button onClick={() => setOpen(true)} className="mt-3 text-primary text-xs font-semibold hover:underline">+ Add your first project</button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(proj => (
            <div key={proj.id} className="group border border-border/50 rounded-2xl overflow-hidden hover:shadow-card transition-shadow">
              {proj.image ? (
                <div className="h-36 overflow-hidden">
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
              ) : (
                <div className="h-24 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <FiCode size={32} className="text-primary/30" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-text text-sm">{proj.title}</h4>
                  <button onClick={() => onRemove(proj.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all flex-shrink-0 p-0.5">
                    <FiTrash2 size={13} />
                  </button>
                </div>
                {proj.description && <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">{proj.description}</p>}
                {proj.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {proj.tech.map(t => (
                      <span key={t} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-lg font-medium">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-3">
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
                      <FiGithub size={12} /> GitHub
                    </a>
                  )}
                  {proj.demo && (
                    <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
                      <FiExternalLink size={12} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProfileModal open={open} onClose={() => setOpen(false)} title="Add Project">
        <div className="space-y-3">
          {([['title','Project Title','e.g. Alumni Portal'],['description','Description','Brief description...'],['github','GitHub URL','https://github.com/...'],['demo','Live Demo URL','https://...']] as const).map(([k, lbl, ph]) => (
            <div key={k}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{lbl}</label>
              {k === 'description'
                ? <textarea value={(form as unknown as Record<string,string>)[k] ?? ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph} rows={2}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all resize-none" />
                : <input value={(form as unknown as Record<string,string>)[k] ?? ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
              }
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Project Image</label>
            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImgFile} />
            <button type="button" onClick={() => imgRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl py-5 flex flex-col items-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-all">
              {form.image
                ? <img src={form.image} alt="preview" className="h-20 rounded-xl object-cover" />
                : <><FiUpload size={20} /><span className="text-xs font-semibold">Click to upload image</span></>}
            </button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTech()} placeholder="e.g. React, TypeScript"
                className="flex-1 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
              <button onClick={addTech} className="btn-primary text-xs py-2 px-3"><FiPlus size={13} /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tech.map(t => (
                <span key={t} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-lg font-medium">
                  {t}
                  <button onClick={() => setForm(p => ({ ...p, tech: p.tech.filter(x => x !== t) }))} className="hover:text-red-500 transition-colors"><FiX size={10} /></button>
                </span>
              ))}
            </div>
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

export default memo(ProjectsTab);
