import React, { useState } from 'react';
import { FiSave, FiGlobe, FiLock, FiBell } from 'react-icons/fi';

const SettingsPanel: React.FC = () => {
  const [general, setGeneral] = useState({ siteName: 'Campus School Pantnagar Alumni Portal', tagline: 'Glory To God and Service To All', email: 'campusschoolpantnagar@gmail.com', phone: '+91-5944-233530', address: 'Campus School Pantnagar, Udham Singh Nagar, Uttarakhand - 263145', website: 'https://cspantnagar.edu.in' });
  const [social, setSocial] = useState({ facebook: 'https://facebook.com/cspantnagar', instagram: 'https://instagram.com/cspantnagar', linkedin: 'https://linkedin.com/company/cspantnagar', youtube: 'https://youtube.com/cspantnagar' });
  const [notif, setNotif] = useState({ newRegistration: true, newJob: true, newEvent: true, newMentor: false, newsletter: true });
  const [saved, setSaved] = useState('');

  const save = (section: string) => { setSaved(section); setTimeout(() => setSaved(''), 2500); };

  const inputStyle = { width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #E5E7EB', borderRadius: '0.6rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block' as const, fontSize: '0.8rem', fontWeight: 600 as const, color: '#374151', marginBottom: '0.4rem' };
  const cardStyle = { background: '#fff', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(229,231,235,0.5)', marginBottom: '1.25rem' };
  const sectionTitle = { fontWeight: 800 as const, fontSize: '0.95rem', color: '#111827', marginBottom: '1.25rem', display: 'flex' as const, alignItems: 'center' as const, gap: '0.5rem' };

  return (
    <div>
      {saved && (
        <div style={{ background: 'rgba(11,107,75,0.1)', border: '1px solid rgba(11,107,75,0.3)', color: '#0B6B4B', padding: '0.75rem 1rem', borderRadius: '0.6rem', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
          ✓ {saved} settings saved successfully!
        </div>
      )}

      {/* General Settings */}
      <div style={cardStyle}>
        <div style={sectionTitle}><FiGlobe size={17} style={{ color: '#0B6B4B' }} /> General Settings</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'Site Name', key: 'siteName' }, { label: 'Tagline', key: 'tagline' },
            { label: 'Contact Email', key: 'email' }, { label: 'Phone Number', key: 'phone' },
            { label: 'Website URL', key: 'website' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '0.5rem' }}>
              <label style={labelStyle}>{f.label}</label>
              <input value={(general as any)[f.key]} onChange={e => setGeneral(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1', marginBottom: '0.5rem' }}>
            <label style={labelStyle}>Address</label>
            <textarea value={general.address} onChange={e => setGeneral(p => ({ ...p, address: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button onClick={() => save('General')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
            <FiSave size={15} /> Save General
          </button>
        </div>
      </div>

      {/* Social Media */}
      <div style={cardStyle}>
        <div style={sectionTitle}><FiGlobe size={17} style={{ color: '#3B82F6' }} /> Social Media Links</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'Facebook URL', key: 'facebook' }, { label: 'Instagram URL', key: 'instagram' },
            { label: 'LinkedIn URL', key: 'linkedin' }, { label: 'YouTube URL', key: 'youtube' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '0.5rem' }}>
              <label style={labelStyle}>{f.label}</label>
              <input value={(social as any)[f.key]} onChange={e => setSocial(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button onClick={() => save('Social Media')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
            <FiSave size={15} /> Save Social
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div style={cardStyle}>
        <div style={sectionTitle}><FiBell size={17} style={{ color: '#D97706' }} /> Notification Settings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[
            { key: 'newRegistration', label: 'New Alumni Registration', desc: 'Get notified when a new alumni registers' },
            { key: 'newJob', label: 'New Job Posted', desc: 'Get notified when a new job is posted' },
            { key: 'newEvent', label: 'New Event Created', desc: 'Get notified when a new event is created' },
            { key: 'newMentor', label: 'New Mentor Application', desc: 'Get notified when someone applies as mentor' },
            { key: 'newsletter', label: 'Newsletter Subscriptions', desc: 'Get notified for new newsletter subscriptions' },
          ].map(n => (
            <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', background: '#F9FAFB', borderRadius: '0.6rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>{n.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{n.desc}</div>
              </div>
              <button
                onClick={() => setNotif(p => ({ ...p, [n.key]: !(p as any)[n.key] }))}
                style={{ width: 44, height: 24, borderRadius: '999px', border: 'none', cursor: 'pointer', background: (notif as any)[n.key] ? '#0B6B4B' : '#D1D5DB', transition: 'all 0.2s', position: 'relative', flexShrink: 0 }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: (notif as any)[n.key] ? 23 : 3, transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button onClick={() => save('Notification')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#D97706', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
            <FiSave size={15} /> Save Notifications
          </button>
        </div>
      </div>

      {/* Security */}
      <div style={cardStyle}>
        <div style={sectionTitle}><FiLock size={17} style={{ color: '#EF4444' }} /> Security Settings</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={labelStyle}>Current Password</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={labelStyle}>New Password</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={labelStyle}>Confirm New Password</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button onClick={() => save('Security')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
            <FiSave size={15} /> Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
