import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiShield } from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin/dashboard';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password, remember);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin Login | Campus School Pantnagar</title></Helmet>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#0B6B4B 0%,#094d36 60%,#D4AF37 100%)',
        fontFamily: 'Poppins, sans-serif', padding: '1rem',
      }}>
        <div style={{
          background: '#fff', borderRadius: '1.25rem', width: '100%', maxWidth: 420,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#0B6B4B,#094d36)', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '1rem', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <FiShield size={32} color="#fff" />
            </div>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem', margin: 0 }}>Admin Portal</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: '0.4rem 0 0' }}>Campus School Pantnagar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#DC2626', fontSize: '0.82rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@campusschool.edu" required autoComplete="username"
                  style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.4rem', border: '1.5px solid #E5E7EB', borderRadius: '0.75rem', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins,sans-serif', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = '#0B6B4B')}
                  onBlur={e  => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required autoComplete="current-password"
                  style={{ width: '100%', padding: '0.7rem 2.6rem 0.7rem 2.4rem', border: '1.5px solid #E5E7EB', borderRadius: '0.75rem', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins,sans-serif', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = '#0B6B4B')}
                  onBlur={e  => (e.target.style.borderColor = '#E5E7EB')}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, display: 'flex' }}>
                  {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#6B7280', cursor: 'pointer' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: '#0B6B4B' }} />
                Remember me
              </label>
              <a href="/admin/forgot-password" style={{ fontSize: '0.8rem', color: '#0B6B4B', fontWeight: 600, textDecoration: 'none' }}>
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.85rem', background: loading ? '#6B7280' : '#0B6B4B',
              color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 800,
              fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'background 0.2s', fontFamily: 'Poppins,sans-serif',
            }}>
              {loading
                ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Signing in...</>
                : <><FiLogIn size={16} /> Sign In to Admin</>
              }
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9CA3AF', marginTop: '1.25rem', lineHeight: 1.5 }}>
              Only authorized administrators can access this portal.<br />
              Normal users cannot login here.
            </p>
          </form>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
};

export default AdminLoginPage;
