import React, { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import { useCMS, type CTAData } from '../../../context/CMSContext';

const inp: React.CSSProperties = { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.83rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };
const ta: React.CSSProperties = { ...inp, resize: 'vertical' };

const CTAPanel: React.FC = () => {
  const { cms, updateCTA } = useCMS();
  const [form, setForm] = useState<CTAData>({ ...cms.cta });
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm({ ...cms.cta }); }, [cms.cta]);

  const set = (k: keyof CTAData) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    updateCTA(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827', margin: 0 }}>CTA Section</h2>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>Bottom call-to-action banner</p>
        </div>
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: saved ? '#059669' : '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'background 0.3s' }}>
          <FiSave size={14} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Live Preview */}
      <div style={{ borderRadius: '0.875rem', overflow: 'hidden', marginBottom: '1.5rem', background: 'linear-gradient(135deg,#0B6B4B,#094d36)', padding: '2rem', textAlign: 'center' }}>
        <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem', margin: '0 0 0.5rem' }}>{form.heading || 'Heading preview'}</h3>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: '0 0 1rem' }}>{form.description || 'Description preview'}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: '#fff', color: '#0B6B4B', padding: '0.5rem 1.25rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.82rem' }}>{form.primaryBtnLabel}</span>
          <span style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.82rem' }}>{form.secondaryBtnLabel}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div><label style={lbl}>Heading *</label><input value={form.heading} onChange={(e) => set('heading')(e.target.value)} placeholder="CTA heading" style={inp} /></div>
        <div><label style={lbl}>Description</label><textarea value={form.description} onChange={(e) => set('description')(e.target.value)} rows={3} placeholder="CTA description..." style={ta} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={lbl}>Primary Button Label</label><input value={form.primaryBtnLabel} onChange={(e) => set('primaryBtnLabel')(e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Primary Button Link</label><input value={form.primaryBtnLink} onChange={(e) => set('primaryBtnLink')(e.target.value)} placeholder="/auth/register" style={inp} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={lbl}>Secondary Button Label</label><input value={form.secondaryBtnLabel} onChange={(e) => set('secondaryBtnLabel')(e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Secondary Button Link</label><input value={form.secondaryBtnLink} onChange={(e) => set('secondaryBtnLink')(e.target.value)} placeholder="/directory" style={inp} /></div>
        </div>
      </div>
    </div>
  );
};

export default CTAPanel;
